/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/base', 'csui/utils/url', 'csui/lib/underscore',
  'i18n!csui/utils/commands/collection/nls/lang', 'csui/models/command',
  'csui/utils/commands/multiple.items', 'csui/utils/commandhelper'
], function (module, require, $, Backbone, base, Url, _, lang, CommandModel,
    MultipleItemsCommand, CommandHelper) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    parallelism: 3
  });

  var GlobalMessage, TaskQueue, UploadFileCollection, PageLeavingBlocker,
      NextNodeModelFactory, CollectionConflictView, nodeLinks;

  var CollectCommandParent = CommandModel.extend({});
  _.extend(CollectCommandParent.prototype, MultipleItemsCommand); //apply required mixin

  var Collect = CollectCommandParent.extend({

    defaults: {
      signature: "Collect",
      scope: "multiple",
      successMessages: {
        formatForOne: lang.CollectOneItemSuccessMessage,
        formatForTwo: lang.CollectManyItemsSuccessMessage,
        formatForMany: lang.CollectManyItemsSuccessMessage,
        formatForFive: lang.CollectManyItemsSuccessMessage,
      },
      errorMessages: {
        formatForOne: lang.CollectOneItemFailMessage,
        formatForTwo: lang.CollectManyItemsFailMessage,
        formatForMany: lang.CollectManyItemsFailMessage,
        formatForFive: lang.CollectManyItemsFailMessage,
      }
    },

    enabled: function (status, options) {
      var enable = this._isSupported(status.container),
          nodes  = CommandHelper.getAtLeastOneNode(status);
      enable = !!enable && !!nodes && nodes.length;
      return enable;
    },

    _isSupported: function (node) {
      var unsupportedObjects = [298], //this may be extend in future for other object types also
          support            = !!node ? $.inArray(node.get('type'), unsupportedObjects) === -1 :
                               true;
      return support;
    },

    execute: function (status, options) {
      var that     = this,
          deferred = $.Deferred();
      require([
        'csui/controls/globalmessage/globalmessage',
        'csui/controls/conflict.resolver/impl/collection.conflicts/collection.conflicts.view',
        'csui/utils/taskqueue', 'csui/models/fileuploads', 'csui/utils/page.leaving.blocker',
        'csui/utils/contexts/factories/next.node', 'csui/utils/node.links/node.links'
      ], function () {
        GlobalMessage = arguments[0];
        CollectionConflictView = arguments[1];
        TaskQueue = arguments[2];
        UploadFileCollection = arguments[3];
        PageLeavingBlocker = arguments[4];
        NextNodeModelFactory = arguments[5];
        nodeLinks = arguments[6];

        that._addToCollection(status, options).done(function (container) {
          var selectedNodes    = status.nodes.models,
              nodes            = _.map(selectedNodes, function (node) {
                return {
                  name: node.get('name'),
                  state: 'pending',
                  count: 0,
                  total: 1,
                  node: node
                };
              }),
              targetFolder     = container.nodes,
              uploadCollection = new UploadFileCollection(nodes, {connector: connector}),
              connector        = (status.container && status.container.connector) ||
                                 (status.originatingView && status.originatingView.connector) || 
                                 (status.collection && status.collection.connector) ||
                                 (selectedNodes[0] && selectedNodes[0].connector);
          that._announceOperationStart(status);
          uploadCollection.each(function (fileUpload) {
            var node = fileUpload.get('node');
            fileUpload.node = node;
            fileUpload.unset('node');
            fileUpload.set('mime_type', node.get('mime_type'));
          });

          that._addSelectedNodesToCollection(uploadCollection, connector, targetFolder[0],
              status.collection)
              .then(function (promises) {
                GlobalMessage.hideFileUploadProgress();
                var result = that._checkPromisess(promises);
                if (result.failedNodes.length) {
                  that._showDialog(result.failedNodes).then(
                      function (resolveOption, dialog) {
                        dialog.kill();
                        if (result.successNodes.length) {
                          var msgOptions = {
                            context: status.context,
                            nextNodeModelFactory: NextNodeModelFactory,
                            link_url: nodeLinks.getUrl(targetFolder[0]),
                            targetFolder: targetFolder[0]
                          };
                          that.showSuccessWithLink(result.successNodes.models, msgOptions);
                        }
                      });

                } else if (result.successNodes.length) {
                  var msgOptions = {
                    context: status.context,
                    nextNodeModelFactory: NextNodeModelFactory,
                    link_url: nodeLinks.getUrl(targetFolder[0]),
                    targetFolder: targetFolder[0]
                  };
                  that.showSuccessWithLink(promises, msgOptions);
                }
              });
          that._announceOperationEnd(status);
          var targetNodeInCurrentCollection;
          if (status.collection && status.originatingView &&
              status.originatingView.findNodeFromCollection) {
            targetNodeInCurrentCollection = status.originatingView.findNodeFromCollection(
                status.collection, targetFolder[0]);
          } else if (status.collection) {
            targetNodeInCurrentCollection = status.collection.get(targetFolder[0].get('id')) ||
                                            status.collection.findWhere(
                                                {id: targetFolder[0].get('id')});
          }
          targetNodeInCurrentCollection &&
          targetNodeInCurrentCollection.fetch();
        });

        deferred.resolve();
      });
      return deferred.promise();
    },

    _addToCollection: function (status, options) {
      var self     = this,
          deferred = $.Deferred();

      require(['csui/dialogs/node.picker/node.picker'],
          function (NodePicker) {
            var pickerOptions = _.extend({
              selectableTypes: [298],
              addableTypes: [298],
              showAllTypes: true,
              orderBy: 'type asc',
              dialogTitle: lang.selectCollectionDialogTitle,
              selectButtonLabel: lang.selectCollectButtonLabel,
              globalSearch: true,
              selectMultiple: false,
              context: options ? options.context : status.context,
              startLocation: 'recent.containers',
              startLocations: ['enterprise.volume', 'current.location', 'personal.volume',
                'favorites', 'recent.containers'],
              resolveShortcuts: true
            }, status);

            self.nodePicker = new NodePicker(pickerOptions);

            self.nodePicker
                .show()
                .done(function () {
                  deferred.resolve.apply(deferred, arguments);
                })
                .fail(function () {
                  deferred.reject.apply(deferred, arguments);
                });
          }, function (error) {
            deferred.reject(error);
          });
      return deferred.promise();
    },

    _addSelectedNodesToCollection: function (uploadCollection, connector, targetFolder,
        targetCollection) {
      var self     = this,
          queue    = new TaskQueue({
            parallelism: config.parallelism
          }),
          count    = 0,
          promises = _.map(uploadCollection.models, function (model) {
            var deferred = $.Deferred();
            queue.pending.add({
              worker: function () {
                var node     = model.node,
                    node_id  = node.get('id'),
                    targetId = targetFolder.get('id');
                self._collectNode(connector, targetId, node_id)
                    .done(function () {

                      model.set('count', 1);
                      model.deferred.resolve(model);

                      deferred.resolve(model);
                    })
                    .fail(function (cause) {
                      deferred.resolve(model);
                    });
                return deferred.promise();
              }
            });
            count++;
            return deferred.promise(promises);  // return promises
          });
      GlobalMessage.showFileUploadProgress(uploadCollection, {
        oneFileTitle: lang.CollectingOneItem,
        oneFileSuccess: lang.CollectOneItemSuccessMessage,
        multiFileSuccess: lang.CollectManyItemsSuccessMessage,
        oneFilePending: lang.CollectingOneItem,
        multiFilePending: lang.CollectingItems,
        oneFileFailure: lang.CollectOneItemFailMessage,
        multiFileFailure: lang.CollectManyItemsFailMessage2,
        someFileSuccess: lang.CollectManyItemsSuccessMessage,
        someFilePending: lang.CollectingItems,
        someFileFailure: lang.CollectManyItemsFailMessage2,
        enableCancel: false
      });

      return $.whenAll.apply($, promises);
    },

    _collectNode: function (connector, targetFolderID, node_id) {
      var deferred = $.Deferred();
      var nodeAttr = {
        "collection_id": targetFolderID
      };

      var collectOptions = {
        url: Url.combine(connector.getConnectionUrl().getApiBase('v2'), '/nodes/' + node_id),
        type: 'PUT',
        data: nodeAttr,
        contentType: 'application/x-www-form-urlencoded'
      };

      connector.makeAjaxCall(collectOptions).done(function (resp) {
        deferred.resolve(resp);

      }).fail(function (resp) {
        deferred.reject(resp);
      });
      return deferred.promise();
    },

    _checkPromisess: function (promises) {
      if (!_.isArray(promises)) {
        promises = [promises];
      }

      var successPromises = new Backbone.Collection(),
          failedPromises  = new Backbone.Collection();

      _.each(promises, function (prom) {
        if (prom !== undefined) {
          if (!prom.cancelled) {
            if (prom.get("count") === undefined) {
            } else if (prom.get("count")) {
              successPromises.push(prom);
            }
            else {
              failedPromises.push(prom);
            }
          }
        }
      });

      return {
        successNodes: successPromises,
        failedNodes: failedPromises
      };
    },

    _showDialog: function (conflictFiles) {
      var deferred = $.Deferred(),
          buttons  = [{
            id: 'close',
            label: lang.conflictsDialogCloseLabel,
            toolTip: lang.conflictsDialogCloseLabel,
            click: function (args) {
              deferred.resolve('close', args.dialog);
            }
          }];
      this._showConflictDialog(conflictFiles, buttons);
      return deferred;
    },

    _showConflictDialog: function (collection, buttons) {
      var self     = this,
          deferred = $.Deferred();
      require(['csui/controls/dialog/dialog.view'], function (DialogView) {
        var failureMessage = base.formatMessage(collection.length, self.get("errorMessages")),
            dialog         = new DialogView({
              title: failureMessage,
              midSize: true,
              iconLeft: 'csui-icon-notification-information',
              className: "csui-collection-conflicts-dialog",
              view: self._getListView(collection),
              buttons: buttons
            });
        dialog.show();
        return dialog;
      });

    },

    _getListView: function (conflictFiles) {
      var retVal = new CollectionConflictView(_.extend({}, {collection: conflictFiles}));
      return retVal;
    },

    _announceOperationStart: function (status) {
      var originatingView = status.originatingView;
      if (originatingView.blockActions) {
        originatingView.blockActions();
      }
      PageLeavingBlocker.enable(this.get('pageLeavingWarning'));
    },

    _announceOperationEnd: function (status) {
      PageLeavingBlocker.disable();
      var originatingView = status.originatingView;
      if (originatingView.unblockActions) {
        originatingView.unblockActions();
      }
    }

  });

  return Collect;

});
