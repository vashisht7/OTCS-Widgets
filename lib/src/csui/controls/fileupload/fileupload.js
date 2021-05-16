/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/controls/fileupload/impl/fileupload.collection'
], function (module, _, Backbone, FileUploadCollection) {
  'use strict';

  return {

    newUpload: function (status, options) {
      status || (status = {});
      options || (options = {});
      _.extend(options, {
        parentCollection: status.collection,
        container: status.container ? status.container.clone() : undefined,
        originatingView: status.originatingView,
        context: status.context || (options && options.context),
        skipProgressBar: !!status.skipProgressBar
      });

      if (!this.collection) {
        this.collection = new FileUploadCollection();
      }

      var uploadControlModel = this.collection.add(options);
      uploadControlModel.listenToOnce(uploadControlModel, 'destroy', function () {
        this.collection.remove(uploadControlModel);
      }, this);

      return uploadControlModel;
    }

  };

});
