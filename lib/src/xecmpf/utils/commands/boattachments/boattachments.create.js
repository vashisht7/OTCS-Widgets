/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url',
  'csui/utils/commandhelper', 'csui/utils/command.error', 'csui/utils/commands/multiple.items',
  'csui/models/command', 'i18n!xecmpf/utils/commands/nls/localized.strings'
], function (module, require, _, $, Url,
  CommandHelper, CommandError, MultipleItemsCommand,
  CommandModel, lang) {
  'use strict';

  var config = _.extend({
    nodesSelectionType: 'savedQuery' //browse
  }, module.config());

  var CmdModelWithMultipleItemsMixin = CommandModel.extend({});
  _.extend(CmdModelWithMultipleItemsMixin.prototype, MultipleItemsCommand);

  var GlobalMessage, BOAttachment;

  var BOAttachmentsCreate = CmdModelWithMultipleItemsMixin.extend({
    defaults: {
      signature: 'BOAttachmentsCreate',
      command_key: ['BOAttachmentsCreate'],
      name: lang.BOAttachmentCreate.name,
      verb: lang.BOAttachmentCreate.verb,
      doneVerb: lang.BOAttachmentCreate.doneVerb,
      pageLeavingWarning: lang.BOAttachmentCreate.pageLeavingWarning,
      scope: 'multiple',
      successMessages: {
        formatForNone: lang.BOAttachmentCreate.successMessages.formatForNone,
        formatForOne: lang.BOAttachmentCreate.successMessages.formatForOne,
        formatForTwo: lang.BOAttachmentCreate.successMessages.formatForMultiple,
        formatForFive: lang.BOAttachmentCreate.successMessages.formatForMultiple
      },
      errorMessages: {
        formatForNone: lang.BOAttachmentCreate.successMessages.formatForNone,
        formatForOne: lang.BOAttachmentCreate.errorMessages.formatForOne,
        formatForTwo: lang.BOAttachmentCreate.errorMessages.formatForMultiple,
        formatForFive: lang.BOAttachmentCreate.errorMessages.formatForMultiple
      }
    },

    enabled: function (status) {
      if (status.data && status.data.enabledAttach) {
        var nodes = CommandHelper.getAtLeastOneNode(status);
        return !!nodes.length;
      }
      return !!status.collection &&
        !!status.collection.businessObjectActions &&
        !!status.collection.businessObjectActions.data &&
        _.has(status.collection.businessObjectActions.data, this.defaults.signature);
    },

    execute: function (status, options) {
      var deferred = $.Deferred();
      status.suppressFailMessage = true;
      status.suppressSuccessMessage = true;
      status.context = status.context || options && options.context;

      options = _.extend(options, status.data, {
        collection: status.collection
      });
      var selectedNodes = CommandHelper.getAtLeastOneNode(status);
      if (selectedNodes.length && !!status.originatingView) {
        status.originatingView.triggerMethod('set:picker:result', {
          nodes: selectedNodes.models
        });
        deferred.resolve();
        status.originatingView.triggerMethod('close');
      }
      else {
        status.nodesSelectionType = status.nodesSelectionType ||
          (options && options.nodesSelectionType) ||
          config.nodesSelectionType;

        require(['csui/controls/globalmessage/globalmessage',
          'xecmpf/widgets/boattachments/impl/boattachment.model'
        ], function () {
          GlobalMessage = arguments[0];
          BOAttachment = arguments[1];
          this._selectNodes(status, options)
            .then(function (results) {
              this._showProgressbarAndPerformActions(results.nodes, status, options)
                .then(deferred.resolve, deferred.reject);
            }.bind(this), function (err) {
              if (err && !err.cancelled) {
                GlobalMessage.showMessage('error', err);
              }
              deferred.reject(); // cancel action without error
            });
        }.bind(this), deferred.reject);
      }
      return deferred;
    },

    _selectNodes: function (status, options) {
      var deferred = $.Deferred(),
        that = this;
      require(['csui/dialogs/node.picker/node.picker',
        'xecmpf/controls/savedquery.node.picker/savedquery.node.picker.view',
        'csui/controls/toolbar/toolitems.factory'
      ], function (NodePickerDialog, SavedQueryNodePickerView, ToolItemsFactory) {

        var toolItemsFactory = new ToolItemsFactory({
          main: [{
            signature: that.get('signature'),
            name: lang.BOAttachmentCreate.addButtonLabel,
            commandData: {
              enabledAttach: true
            }
          }]
          }, {
          maxItemsShown: 1,
          dropDownText: lang.ToolbarItemMore,
          dropDownIcon: 'icon icon-toolbar-more',
          addGroupSeparators: false
        });

        var nodePicker = status.nodesSelectionType === 'savedQuery' ?

          new SavedQueryNodePickerView(_.extend({
            title: lang.BOAttachmentCreate.name,
            enableBackButton: true,
            backButtonToolTip: lang.backButtonToolTip,
            toolbarItems: {
              otherToolbar: toolItemsFactory,
              inlineToolbar: [],
              tableHeaderToolbar: toolItemsFactory
            }
          }, _.omit(status, 'collection', 'toolbarItems'))) :

          new NodePickerDialog(_.extend({
            selectMultiple: true,
            selectableTypes: [],
            unselectableTypes: [],
            showAllTypes: true,
            dialogTitle: lang.BOAttachmentCreate.name,
            selectButtonLabel: lang.selectButtonLabel
          }));

        nodePicker
          .show()
          .then(deferred.resolve, deferred.reject);

      }, deferred.reject);
      return deferred;
    },

    _showProgressbarAndPerformActions: function (selectedNodes, status, options) {
      var deferred = $.Deferred();
      require(['csui/models/fileuploads'], function (UploadFileCollection) {

        var models = _.map(selectedNodes, function (node) {
            return {
              name: node.get('name'),
              state: 'pending',
              count: 0,
              total: 1,
              node: node
            };
          }),
          uploadCollection = new UploadFileCollection(models),
          newStatus = _.defaults({
            nodes: uploadCollection,
            suppressMultipleFailMessage: true
          }, status);

        uploadCollection.each(function (model) {
          model.node = model.get('node');
          model.unset('node', {
            silent: true
          });
        });

        GlobalMessage.showFileUploadProgress(uploadCollection, {
          oneFileTitle: lang.BOAttachmentCreate.progressBarMessages.oneFileTitle,
          oneFileSuccess: lang.BOAttachmentCreate.successMessages.formatForOne,
          multiFileSuccess: lang.BOAttachmentCreate.successMessages.formatForMultiple,
          oneFilePending: lang.BOAttachmentCreate.progressBarMessages.oneFileTitle,
          multiFilePending: lang.BOAttachmentCreate.progressBarMessages.multiFilePending,
          oneFileFailure: lang.BOAttachmentCreate.errorMessages.formatForOne,
          multiFileFailure: lang.BOAttachmentCreate.progressBarMessages.multiFileFailure,
          someFileSuccess: lang.BOAttachmentCreate.successMessages.formatForMultiple,
          someFilePending: lang.BOAttachmentCreate.progressBarMessages.multiFilePending,
          someFileFailure: lang.BOAttachmentCreate.progressBarMessages.multiFileFailure,
          enableCancel: false
        });

        this._performActions(newStatus, options)
          .then(function () {
            GlobalMessage.hideFileUploadProgress();
            deferred.resolve.apply(deferred, arguments);
          }.bind(this), deferred.reject);

      }.bind(this), deferred.reject);
      return deferred;
    },

    _performAction: function (model, options) {
      var node = model.node,
        connector = node.connector;

      return connector.makeAjaxCall({
        url: Url.combine(connector.connection.url.replace('/v1', '/v2'), 'businessobjects',
          encodeURIComponent(options.extId), encodeURIComponent(options.boType), encodeURIComponent(options.boid), 'businessattachments', node.get('id')),
        type: 'POST',
        data: {
          expand: {
            properties: {
              fields: ['original_id','ancestors','parent_id','reserved_user_id','createdby','modifiedby']
            }
          }
        },
        success: function (response, status, xhr) {
          var boAttachment = new BOAttachment(response.results[0], {
            connector: connector,
            parse: true
          });
          boAttachment.isLocallyCreated = true;
          options.collection.add(boAttachment, {
            at: 0
          });
          model.deferred.resolve(model);
        },
        error: function (xhr, status, err) {
          var cmdError = xhr ? new CommandError(xhr, node) : xhr;
          model.deferred.reject(model, cmdError);
        },
        complete: function (xhr, status) {
          model.set('count', 1);
        }
      });
    }
  });

  return BOAttachmentsCreate;
});