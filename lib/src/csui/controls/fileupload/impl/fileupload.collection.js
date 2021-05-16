/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/backbone', 'csui/utils/log', "i18n!csui/controls/fileupload/impl/nls/lang",
  'csui/controls/fileupload/impl/upload.controller',
  'csui/models/fileuploads', 'csui/controls/globalmessage/globalmessage',
  'csui/controls/conflict.resolver/conflict.resolver', 'csui/utils/mime.types',
  'csui/dialogs/modal.alert/modal.alert', 'csui/utils/page.leaving.blocker',
  'csui/utils/node.links/node.links', 'csui/utils/contexts/factories/next.node'
], function (require, module, $, _, Backbone, log, lang, UploadController,
    UploadFileCollection, GlobalMessage, ConflictResolver, mimeTypes, ModalAlert,
    PageLeavingBlocker, NodeLinks, NextNodeModelFactory) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    actionType : 'UPLOAD',
    allowMultipleInstances: true,
    hideGotoLocationSingleSet: true,
    hideGotoLocationMultiSet : true
  });

  var FileUploadModel = Backbone.Model.extend({
    defaults: {
      parentCollection: null,
      container: null
    },

    constructor: function FileUploadModel(attributes, options) {
      attributes || (attributes = {});

      Backbone.Model.prototype.constructor.call(this, attributes, options);

      var container = this.container = this.get('container'),
          parentCollection = this.get('parentCollection');
      this.uploadFiles = new UploadFileCollection();
      this.controller = new UploadController({
        container: container,
        context: this.get('context')
      });
      if (parentCollection) {
        this.originalCollectionUrl = parentCollection.url();
        this.listenTo(parentCollection, 'reset', this._stopCollectionUpdate); //stop collection update after a collection reset
        this.listenTo(parentCollection.node, 'request', this._stopCollectionUpdate); //stop collection update after node change
      }

      this._uploadCounts = {failed: 0, success: 0, complete: 0};
    },

    close: function () {
      this.onDestroy();
      this.trigger('destroy');
      return true;
    },

    onDestroy: function () {
      this.uploadView && this.uploadView.destroy();
      return true;
    },

    onUploadFileAdded: function (fileUpload) {
      fileUpload.promise()
          .done(_.bind(this.onFileUploadProcessed, this))
          .fail(_.bind(this.onFileUploadFailed, this));
    },

    addFilesToUpload: function (files, options) {
      var self     = this,
          deferred = $.Deferred();
      files = this._validateFileList(files);

      if (GlobalMessage.isActionInProgress(config.actionType, lang.UploadNotAllowed, lang.CommandTitleUpload)) {
        return deferred.resolve();
      }
      if (files.length) {
        var originatingView = this.setBlocker();
        this.addFilesToUploadCollection(files, options);
        this.resolveNamingConflicts(options)
            .then(_.bind(this.checkAndHandleRequiredMetadata, this, options))
            .then(_.bind(this.addToUpload, this))
            .fail(function (args) {
              if (args) {
                if (args.error) {
                  GlobalMessage.showMessage('error', args.error.message);
                }
                else if (args.userAction && args.userAction ===
                         "cancelAddOneItemWithRequiredMetadata") {
                  self.trigger("metadata:cancelled");
                }
                else if (args.userAction && args.userAction === "closeMetadataActionView") {
                  self.trigger("metadata:closed");
                }
                else if (args.userAction && args.userAction === "cancelResolveNamingConflicts") {
                  self.trigger("resolve:naming:conflicts:cancelled");
                }
              }
            })
            .always(function (promises) {
              if (originatingView) {
                originatingView.unblockActions();
              }
              deferred.resolve(promises);
              self.close();
            });
        return deferred.promise();
      }

      this.close();
      return false;
    },

    addFilesToUploadCollection: function (files, options) {
      _.each(files, function (file) {
        var parameters = file,
            container  = parameters.container ||
                         options && options.container ||
                         this.container,
            collection = options && options.collection ||
                         this.get('parentCollection');
        parameters.file && (file = parameters.file);
        var newName = parameters.newName || file.newName;
        this.uploadFiles.add({
              file: file,
              newName: newName,
              name: newName || file.name,
              newVersion: parameters.newVersion,
              id: parameters.id, // in case of user select add as a version instead of new file.
              extended_data: parameters.data || {},
              collection: collection,
              subType: this.get('addableType') || parameters.type,
              type: parameters.type,
              targetLocation : {
                id : container.get('id'),
                url : NodeLinks.getUrl(container)
              }
            },
            {
              container: container,
              connector: container.connector,
              enforcedRequiredAttrs: true
            });
      }, this);
      return this.uploadFiles;
    },

    setBlocker: function () {
      var originatingView = this.get('originatingView');
      if (!(originatingView && originatingView.blockActions)) {
        originatingView = undefined;
      }
      if (originatingView) {
        originatingView.blockActions();
      }
      return originatingView;
    },

    unSetBlocker: function () {
      var originatingView = this.get('originatingView');
      if (!(originatingView && originatingView.unblockActions)) {
        originatingView = undefined;
      }
      if (originatingView) {
        originatingView.unblockActions();
      }
    },

    resolveNamingConflicts: function (options) {
      var uploadCollection = this.uploadFiles;
      if (options && options.skipResolveNamingConflicts) {
        var deferred = $.Deferred();
        _.each(uploadCollection.models, _.bind(function (fileUploadModel) {
          if (this.status === "version") {
            fileUploadModel.attributes.id = this.itemId;
            fileUploadModel.attributes.newVersion = true;
          }

        }, this));
        return deferred.resolve(uploadCollection);
      } else {
        var h1               = uploadCollection.length === 1 ? lang.uploadCount : lang.uploadCounts,
            conflictResolver = new ConflictResolver({
              h1Label: _.str.sformat(h1, uploadCollection.length),
              container: options && options.container || this.container,
              files: uploadCollection,
              originatingView: this.get('originatingView')
            });
        return conflictResolver.run();
      }
    },

    _validateFileList: function (files) {

      if (!files || files.length === 0) {
        log.debug("No upload files selected")
        && console.log(log.last);
        return [];
      }
      var failedFiles = [],
          firstFile   = files[0],
          name        = firstFile.name || firstFile.file && firstFile.file.name ||
                        firstFile.get && firstFile.get('name');
      if (!name) {
        GlobalMessage.showMessage('error', lang.invalidFileList);
        return [];
      }
      return files;
    },

    checkAndHandleRequiredMetadata: function (options, fileCollection) {
      var self            = this,
          deferred        = $.Deferred(),
          originatingView = this.get('originatingView');
      originatingView && originatingView._blockingCounter === 0 && originatingView.blockActions();
      require(['csui/widgets/metadata/metadata.add.document.controller'
      ], function (MetadataAddDocumentController) {
        var metadataController = new MetadataAddDocumentController();
        metadataController
            .addItemsRequiredMetadata(fileCollection, {
              container: options && options.container || self.container,
              addableType: 144,
              context: self.get('context'),
              openMetadata: options && options.openMetadata,
              inheritance: options && options.inheritance
            })
            .then(function () {
              self.unSetBlocker();
              return fileCollection;
            })
            .done(deferred.resolve)
            .fail(deferred.reject);
      }, function (error) {
        log.warn('Failed to load MetadataAddDocumentController. {0}', error)
        && console.warn(log.last);
        deferred.reject(error);
      });
      return deferred.promise();
    },

    addToUpload: function (files) {
      var promises;
      if (files && files.length > 0) {
        var fileAdded, self = this;
        var bundleNumber = new Date().getTime();
        promises = _.map(files.models, function (file) {
          var deferred = $.Deferred();
          if (!file.get('id') || file.get('newName') || file.get('newVersion')) {
            var name = file.get('newName') || file.get('file').name;

            var mimeType = (!!file.get('file').type && file.get('file').type) ||
                           mimeTypes.getMimeType(name);
            var size = file.get('size') || file.get('file').size;
            file.set('mime_type', mimeType);
            file.set('bundleNumber', bundleNumber);
            file.uploadContainer = self.container;
            log.debug("Object was added - {0}", name)
            && console.log(log.last);
            if (!fileAdded) {
              fileAdded = true;
              var pageLeavingWarning = this.get('pageLeavingWarning') ||
                                       lang.pageLeavingWarning;
              PageLeavingBlocker.enable(pageLeavingWarning);
            }
            if (size === 0) {
              var errorMessage = _.str.sformat(lang.InvalidFile, name);
              file.deferred.reject(file, {message: errorMessage});
            } else {
              this.controller.scheduleFileForUpload(file);
            }
            this.onUploadFileAdded(file);
            file.promise().done(function (file) {
              deferred.resolve(file);
            }).fail(function (file) {
              deferred.reject(file);
            });
            return deferred.promise();
          }
          else {
            log.debug("Object was skipped - {0}", file.name);
            deferred.reject(file);
          }
          return deferred.promise(promises);
        }, this);
      }
      else {
        log.debug("No files were upload. All have naming conflict")
        && console.log(log.last);
      }
      this.showProgress(files);
      return $.whenAll.apply($, promises);
    },

    onFileUploadProcessed: function (file) {
      if (!this.stopParentUpdate) {
        var collection       = file.get('collection'),
            parentCollection = this.get('parentCollection');
        collection || (collection = parentCollection);
        if (collection !== parentCollection ||
            parentCollection && parentCollection.url() == this.originalCollectionUrl) {
          var container           = file.container,
              originalContainerId = (this.container || container).get('id'),
              containerParentId   = container.get('parent_id');
          containerParentId && containerParentId.id && (containerParentId = containerParentId.id);
          if (originalContainerId == containerParentId) {
            if (!collection.findWhere({id: container.get('id')})) {
              container.isLocallyCreated = true;
              collection.unshift(container);
              $(".csui-new-item").closest("tbody").scrollTop(0);
            }
          } else if (originalContainerId == container.get('id')) {
            var newFile = !file.get('newVersion');
            if (newFile) {
              file.node.isLocallyCreated = true;
              collection.unshift(file.node);
              $(".csui-new-item").closest("tbody").scrollTop(0);
            }
          }
        }
      }
      this._increaseUploadCount('success');
    },

    onFileUploadFailed: function (file, errorMsg) {
      this.uploadFiles && this.uploadFiles.trigger("try:again");
      this._increaseUploadCount('failed');
    },

    showProgress: function (files) {
      this.uploadView && this.uploadView.destroy();
      var options = {
        originatingView: this.get('originatingView'),
        actionType : this.get('actionType') || config.actionType,
        allowMultipleInstances : config.allowMultipleInstances,
        hideGotoLocationSingleSet : config.hideGotoLocationSingleSet,
        hideGotoLocationMultiSet : config.hideGotoLocationMultiSet,
        context: this.get('context'),
        nextNodeModelFactory: NextNodeModelFactory
      };
      GlobalMessage.showProgressPanel(files, options);
    },

    _stopCollectionUpdate: function () {
      this.stopParentUpdate = false;
    },

    _increaseUploadCount: function (status) {
      var totalUpload  = this.uploadFiles.length,
          uploadCounts = this._uploadCounts;
      if (status === 'failed') {
        uploadCounts.failed++;
      }
      else {
        uploadCounts.success++;
      }
      if (++(uploadCounts.complete) === totalUpload) {
        PageLeavingBlocker.disable();
      } 
      this.close();
    }

  });

  var FileUploadCollection = Backbone.Collection.extend({
    model: FileUploadModel,
    comparator: 'sequence'
  });

  return FileUploadCollection;

});
