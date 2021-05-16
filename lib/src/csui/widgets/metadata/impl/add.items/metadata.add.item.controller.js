/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(["csui/lib/underscore", "csui/lib/jquery", "csui/lib/backbone",
  "csui/models/nodes", "csui/models/node/node.model",
  "csui/widgets/metadata/metadata.add.item.controller",
  "csui/widgets/metadata/impl/metadata.utils",
  "csui/widgets/metadata/impl/add.items/metadata.add.multiple.items.controller",
  "i18n!csui/widgets/metadata/impl/nls/lang", "csui/utils/deepClone/deepClone"
], function (_, $, Backbone, NodeCollection, NodeModel, MetadataAddOneItemController, MetadataUtils,
    MetadataAddMultipleItemsController, lang) {
  'use strict';

  function MetadataAddItemController() {
  }

  _.extend(MetadataAddItemController.prototype, Backbone.Events, {

    addItemsRequiredMetadata: function (items, options) {
      if (options.openMetadata !== true && options.inheritance === 'original') {
        return $.Deferred().resolve();
      }

      var deferred      = $.Deferred(),
          file          = _.find(items, function (item) {
                return item.get('newVersion') === undefined;
              }) || items[0],
          tempName      = items.length > 0 ? items[0].get('name') : 'temp_name',

          utilOptions   = {
            action: 'create',
            name: tempName,
            items: items,
            container: options.container,
            context: options.container.context,
            collection: options.collection,
            docParentId: items.length > 0 ? file.get('id') : null,
            addableType: 144 //this is tweak to
          },
          metadataUtils = new MetadataUtils(),
          newFiles      = $.grep(items, function (item) {
            return item.get('newVersion') === undefined;
          }); //Collection might contain new versions of existing items, remove such items

      metadataUtils.ContainerHasEnforcedEmptyRequiredMetadata(utilOptions)
          .done(_.bind(function (resp) {
            if (resp.hasRequiredMetadata === true) {
              var metadataDeferred = $.Deferred();
              if (newFiles && newFiles.length === 1) {
                metadataDeferred = this._addOneItemWithRequiredMetadata(newFiles,
                    options);
              } else if (newFiles && newFiles.length > 1) {
                if (resp.initialFormData) {
                  options.initialFormData = resp.initialFormData;
                }
                metadataDeferred = this._addMultipleItemsWithRequiredMetadata(newFiles,
                    options);
              } else if (items.length) {
                deferred.resolve();
              }
              else {
                deferred.reject();
              }

              metadataDeferred.done(function (resp) {
                deferred.resolve(resp);
              }).fail(function (error) {
                deferred.reject(error);
              });

            } else {
              deferred.resolve({});
            }
          }, this))
          .fail(function (error) {
            deferred.reject(error);
          });

      return deferred.promise();
    },

    _addOneItemWithRequiredMetadata: function (items, options) {
      var deferred = $.Deferred(),
          nodes    = this._makeNodeCollectionFromItems(items, options),
          status   = {
            nodes: nodes,
            container: options.container,
            context: options.context
          };
      options = options || {};
      _.extend(options, {
        callerProcessData: true,
        cancelButtonActionToken: "cancelAddOneItemWithRequiredMetadata",
        dialogTitle: nodes.models[0].get('fileObject') ? lang.addDocumentMetadataDialogTitle :
                     lang.addFolderMetadataDialogTitle,
        addButtonTitle: lang.addItemMetadataDialogButtonUploadTitle
      });
      this.displayForm(status, options)
          .done(function (resp) {
            if (options.callerProcessData) {
              var model = nodes.models[0];
              var item = model.get('itemObject') || model.get('fileObject');
              item.set('newName', resp.data.name);

              if (item) {
                var extendedData = {};
                item.set('newName', resp.data.name);
                if (resp.data.description !== undefined) {
                  extendedData.description = resp.data.description;
                }
                if (resp.data.advanced_versioning !== undefined) {
                  extendedData.advanced_versioning = resp.data.advanced_versioning;
                }
                if (resp.data.roles) {
                  extendedData.roles = _.deepClone(resp.data.roles);
                }
                if (_.isEmpty(extendedData) === false) {
                  item.set('extended_data', extendedData);
                }
              }
              deferred.resolve(items);
            } else {
              deferred.resolve.apply(deferred, arguments);
            }
          })
          .fail(function () {
            deferred.reject.apply(deferred, arguments);
          });
      return deferred.promise();
    },
    _addMultipleItemsWithRequiredMetadata: function (nodes, options) {
      nodes = this._makeNodeCollectionFromItems(nodes, options);
      var folderLen = 0, fileLen = 0, nodesLen = nodes.length, cmdStatus = {nodes: nodes},
          deferred                                                       = $.Deferred();
      for (var i = 0; i < nodesLen; i++) {
        nodes.models[i].get('fileObject') ? fileLen++ : folderLen++;
      }
      _.extend(options, {
        dialogTitle: fileLen === nodesLen ? lang.addDocumentsMetadataDialogTitle :
                     folderLen === nodesLen ? lang.addFoldersMetadataDialogTitle :
                     lang.addItemsMetadataDialogTitle,
        addButtonTitle: lang.addItemMetadataDialogButtonUploadTitle
      });
      var metadataAddMultipleDocsController = new MetadataAddMultipleItemsController();
      metadataAddMultipleDocsController
          .displayForm(cmdStatus, options)
          .done(function (resp) {
            deferred.resolve(nodes);
          })
          .fail(function () {
            deferred.reject();
          });

      return deferred.promise();
    },
    _makeNodeCollectionFromItems: function (items, options) {
      var nodes = new NodeCollection();
      var node;
      if (items && items.length > 0) {
        _.each(items, function (item) {
          var file = item.get('file');
          if (file) {
            node = new NodeModel({
              name: item.get('newName') || file.name,
              type: item.get('type') || 144,
              size: file.size,
              mime_type: file.type,
              fileObject: item,
              parent_id: options.container.get('id'),
              extended_data: item.get('extended_data')
            }, {
              connector: options.container.connector
            });
          } else {
            node = new NodeModel({
              container: true,
              name: item.get('newName') || item.get('name'),
              type: item.get('type') || item.get('subType' || 0),
              type_name: item.get('type_name') || 'Folder',
              itemObject: item,
              parent_id: options.container.get('id'),
              extended_data: item.get('extended_data'),
              enforcedRequiredAttrsForFolders: item.get('enforcedRequiredAttrsForFolders')
            }, {
              connector: options.container.connector
            });
          }

          _.extend(node.options, {
            enforcedRequiredAttrs: true
          });
          nodes.add(node, {silent: true});
        }, this);
      }
      return nodes;
    },
    displayForm: function (status, options) {
      var metadataAddOneItemController = new MetadataAddOneItemController();
      return metadataAddOneItemController
          .displayForm(status, options);
    }

  });

  MetadataAddItemController.prototype.get = Backbone.Model.prototype.get;
  _.extend(MetadataAddItemController, {version: "1.0"});

  return MetadataAddItemController;

});
