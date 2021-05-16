/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/base', 'csui/utils/taskqueue', 'csui/utils/contexts/factories/task.queue.factory', 'csui/models/version',
  'csui/utils/commandhelper', 'csui/lib/underscore.deepExtend'
], function (module, _, $, Backbone, base, TaskQueue, TaskQueueFactory, VersionModel, CommandHelper) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    parallelism: 3
  });

  function UploadController(options) {
    options || (options = {});
    this.container = options.container ? options.container.clone() : null;
    if (options.context) {
      this.queue = options.context.getCollection(TaskQueueFactory, {
        options: {
          parallelism: options.parallelism || config.parallelism,
          permanent: true //To retain task queue collection while switching between folders
        }
      });
    } else {
      this.queue = new TaskQueue({
        parallelism: options.parallelism || config.parallelism
      });
    }
  }

  _.extend(UploadController.prototype, Backbone.Events, {

    scheduleFileForUpload: function (fileUpload) {
      this.queue.pending.add({
        worker: _.bind(this._uploadFile, this, fileUpload)
      });
    },

    _uploadFile: function (fileUpload) {
      var container    = fileUpload.container || this.container,
          deferred     = fileUpload.deferred,
          node         = fileUpload.node,
          version      = fileUpload.version || fileUpload.get('newVersion'),
          file         = fileUpload.get("file"),
          extendedData = fileUpload.get('extended_data'),
          data;

      if (_.isArray(node.get('versions'))) {
        !!node.attributes && !!node.attributes.versions &&
        node.attributes.versions.push(version.attributes);

      }
      if (version) {
        if (!node.has('id')) {
          node.set('id', fileUpload.get('id'));
        }
        if (!(version instanceof VersionModel)) {
          version = new VersionModel({
            id: node.get('id')
          });
        }
        data = {};
        fileUpload.get('add_major_version') && (data.add_major_version =  fileUpload.get('add_major_version'));
      } else {
        if (!container) {
          throw new Error('Container node is missing.');
        }
        data = {
          name: fileUpload.get('newName') || file.name,
          type: fileUpload.get('type') || 144,
          parent_id: container.get('id'),
          advanced_versioning: !!container.get('versions_control_advanced')
        };
      }
      if (extendedData) {
        _.deepExtend(data, extendedData);
      }
      if (!node.connector) {
        if (!container) {
          throw new Error('Either node or container have to be connected.');
        }
        container.connector.assignTo(node);
      }
      if (version && !version.connector) {
        node.connector.assignTo(version);
      }
      var jqxhr = (version || node).save(data, {
        data: data,
        files: {file: file}
      });
      jqxhr.progress(function (event, request) {
            deferred.notify(fileUpload, event);
          })
          .then(function (data, result, request) {
            if (node) {
              return node.fetch({collection: node.collection , refreshCache: true});
            }
          })
          .done(function (data, result, request) {
            deferred.resolve(fileUpload);
          })
          .fail(function (request, message, statusText) {
            var error = new base.RequestErrorMessage(request);
            deferred.reject(fileUpload, error);
          });
      deferred.fail(function (model, error) {
        if (!error) {
          jqxhr.abort();
        }
      });
      return fileUpload.promise();
    }

  });

  UploadController.extend = Backbone.View.extend;

  return UploadController;

});
