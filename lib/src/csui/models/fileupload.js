/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/log', 'csui/models/node/node.model', 'csui/models/version'
], function (module, _, $, Backbone, log, NodeModel, VersionModel) {
  'use strict';

  var config = _.extend({
    idAttribute: null
  }, module.config());

  var FileUploadModel = Backbone.Model.extend({

    defaults: {
      state: "pending",
      count: 0,
      total: 0,
      errorMessage: "",
      sequence: 0
    },

    idAttribute: config.idAttribute,

    constructor: function FileUploadModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      options || (options = {});

      this.node = options.node;
      if (this.node) {
        this.set('newVersion', true, {silent: true});
        this.version = new VersionModel({
          id: this.node.get('id')
        }, {
          connector: options.connector || this.node.connector
        });
      } else {
        this.container = options.container;
        this.node = new NodeModel(undefined, _.extend({
          connector: options.connector ||
                     this.container && this.container.connector
        }, options, {
          collection: this.get('collection')
        }));
      }

      this.deferred = $.Deferred();
      this.deferred
          .progress(_.bind(this.onStateChange, this))
          .done(_.bind(this.onStateChange, this))
          .fail(_.bind(this.onStateChange, this));

      this._updateFileAttributes(true);
      this.listenTo(this, 'change:file',
          _.bind(this._updateFileAttributes, this, false));
    },

    abort: function (reason) {
      this.deferred.reject(this, reason);
    },

    promise: function () {
      return this.deferred.promise();
    },

    onStateChange: function (fileUpload, options) {
      var state = this.deferred.state();
      if (state == "pending") {
        state = "processing";
      } else if (state === "rejected") {
        fileUpload && fileUpload.get('file') && 
        this.set({count : fileUpload.get('file').size, silent: true}); // count rejected file size for progress percentage calculation
        if (options && options.message) {
          this.set("errorMessage", options.message);// Rejecting with a message is error
          if (options.statusCode >= 500) {
            this.set({serverFailure : true}); 
          }
        } else if(options && options.state) {
          state = options.state;                     // Rejecting with a state
        } else {
          state = "aborted";                         // Rejecting without any error is aborted
        }
      }
      var values = {state: state};
      if (options && options.type === "progress") {
        var loaded = options.loaded,
            total = this.get("total");
        if (options.lengthComputable && options.total > total) {
          total = options.total;
          values.total = total;
        }
        if (this.get("count") < loaded && loaded <= total) {
          values.count = loaded;
        }
      }
      this.set(values);
    },

    _updateFileAttributes: function (silent) {
      var file = this.get("file");
      if (file) {
        this.set({
          name: file.name,
          total: file.size
        }, silent ? {silent: true} : {});
      }
    }

  });

  return FileUploadModel;

});
