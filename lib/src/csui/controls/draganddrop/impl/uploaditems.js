/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore',
  'csui/utils/base',
  'csui/controls/fileupload/fileupload',
  'csui/models/fileuploads', "i18n!csui/controls/fileupload/impl/nls/lang",
  'csui/controls/conflict.resolver/conflict.resolver',"csui/models/namequery",
  'csui/utils/deepClone/deepClone'
], function ($, _, base,
    fileUploadHelper, UploadFileCollection, lang, ConflictResolver, NameQuery) {
  'use strict';

  return {

    uploadFiles: function (files, status, options) {
      var fileUploadModel = fileUploadHelper.newUpload(status, {});
      return fileUploadModel.addFilesToUpload(files, options);
    },

    uploadDropItems: function (items, options) {
      var deferred = $.Deferred();

      if (this.validateItems(items)) {
        this.addDropItemsToCollection(items, options);

        this.resolveNamingConflicts(options).done(_.bind(function (itemsCollection) {
          this.openMetadataWindow(this.uploadItems, options).done(
              _.bind(function (itemsCollection) {
                deferred.resolve(itemsCollection);
              }, this));
        }, this)).fail(function(error) {
          deferred.reject(error);
          options.originatingView && options.originatingView.unblockActions();
        });

      } else {
        deferred.reject();
      }
      return deferred.promise();
    },

    validateItems: function (items, options) {
      return items && items.length;
    },

    addDropItemsToCollection: function (items, options) {
      this.uploadItems = new UploadFileCollection();
      _.each(items, _.bind(function (item) {
        if (item.file) {
          this.addFileToUploadCollection(item.file, options);
        } else {
          this.addFolderToUploadCollection(item, options);
        }
      }, this));
      return this.uploadItems;
    },

    addFileToUploadCollection: function (file, options) {
      var newName = file.newName;
      this.uploadItems.add({
            file: file,
            newName: newName,
            name: newName || file.name,
            extended_data: file.data || {},
            collection: options.collection,
            subType: 144
          },
          {
            container: options.container,
            connector: options.container.connector,
            enforcedRequiredAttrs: true
          });
    },

    addFolderToUploadCollection: function (folder, options) {
      this.uploadItems.add({
            container: true,
            name: folder.get('name'),
            enforcedRequiredAttrsForFolders: folder.get('enforcedRequiredAttrsForFolders'),
            extended_data: folder.data || folder.get('data') || {},
            collection: options.collection,
            subType: folder.get('type'),
            subItems: folder.subItems
          },
          {
            container: options.container,
            connector: options.container.connector,
            enforcedRequiredAttrs: true
          });
    },

    resolveNamingConflicts: function (options) {
      var uploadCollection = this.uploadItems,
          h1               = uploadCollection.length === 1 ?
                             uploadCollection.models[0].get('container') ?
                             lang.uploadCountFolder : lang.uploadCount : lang.uploadCountsItems,
          conflictResolver = new ConflictResolver({
            h1Label: _.str.sformat(h1, uploadCollection.length),
            container: options && options.container || this.container,
            files: uploadCollection,
            excludeAddVersionforFolders: options.excludeAddVersionforFolders,
            originatingView: options.originatingView
          });
      this.resolveNameConflicts = true;
      return conflictResolver.run();
    },

    validateNodes: function (files, container) {
      var uploadFiles = [], validateFiles = [], nameQuery, deferred = $.Deferred();
      _.each(files, function (file) {
        file.data ? uploadFiles.push(file) : validateFiles.push(file);
      });
      container = validateFiles.length ? validateFiles[0].container : container;
      nameQuery = new NameQuery({
        containerId: container.get('id')
      }, {connector: container.connector});
      nameQuery.queryNames(validateFiles)
          .always(function (cleanFiles, conflictFiles) {
            uploadFiles = cleanFiles ? uploadFiles.concat(cleanFiles) : uploadFiles;
            deferred.resolve(uploadFiles, conflictFiles);
          });
      return deferred.promise();
    },

    openMetadataWindow: function (itemsCollection, options) {
      var deferred = $.Deferred(); 
      options.originatingView && options.originatingView._blockingCounter === 0 &&
      options.originatingView.blockActions();
      require(['csui/widgets/metadata/impl/add.items/metadata.add.item.controller'
      ], function (MetadataAddItemController) {
        var metadataController = new MetadataAddItemController();
        metadataController
            .addItemsRequiredMetadata(itemsCollection.models, {
              container: options && options.container,
              context: options.context,
              openMetadata: options.openMetadata,
              inheritance: options.inheritance
            })
            .done(function () {
              deferred.resolve(itemsCollection);
            })
            .fail(function() {
              options.originatingView && options.originatingView.unblockActions();
              deferred.reject();
            });
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },

    create: function (folder, options) {
      var container    = options.container,
          deferred     = $.Deferred(),
          node         = folder.node || folder,
          data,
          extendedData = folder.get('extended_data');

      data = {
        name: folder.get('newName') || folder.get('name'),
        type: folder.get('type') || 0,
        parent_id: container.get('id'),
        container: true,
        collection: options.collection
      };
      if (extendedData) {
        _.deepExtend(data, extendedData);
      }
      if (!node.connector) {
        if (!container) {
          throw new Error('Either node or container have to be connected.');
        }
        container.connector.assignTo(node);
      }

      var jqxhr = node
          .save(undefined, {
            data: data,
            wait: true,
            silent: true
          });
      deferred.fail(function (model, error) {
        if (!error) {
          jqxhr.abort();
        }
      });

      jqxhr
          .then(function (data, result, request) {
            folder.set('id', data.id);
            return node.fetch({refreshCache: true});
          })
          .done(function (data, result, request) {
            node.isLocallyCreated = true;
            deferred.resolve(node);
          })
          .fail(function (request, message, statusText) {
            var error = new base.RequestErrorMessage(request);
            deferred.reject(folder, error);
          });

      return deferred.promise();
    }

  };

});
