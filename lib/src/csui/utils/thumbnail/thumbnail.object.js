/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/url', 'csui/utils/base', 'csui/utils/thumbnail/server.adaptor.mixin'
], function ($, Marionette, Url, base, ServerAdaptorMixin) {
  'use strict';

  var Thumbnail = Marionette.Object.extend({

    constructor: function Thumbnail(options) {
      Marionette.Object.prototype.constructor.apply(this, arguments);
      this.node = this.options.node;
      this.listenTo(this.node, 'change:id', this.loadUrl)
          .listenTo(this, 'destroy', this.release);
      this.makeServerAdaptor(options);
    },
    loadUrl: function () {
      var url = this.url();
      var self = this;
      this.release();
      return this.node.connector.makeAjaxCall({
            url: url,
            dataType: 'binary'
          }
      ).then(function (response) {
            self.load(response);
          }, function (jqxhr) {
            self._failureHandler(jqxhr);
          }
      );
    },

    load: function (response) {
      var self = this;
      if (response.type && response.type.match(/application\/json/i)) {
        var reader = new window.FileReader();
        reader.readAsText(response);
        reader.onload = function (event) {
          var jsonObject = JSON.parse(event.target.result);
          if (jsonObject.statusCode === 404) {
            self._failureHandler(jsonObject.error);
          }
        };
      } else {
        self.imgUrl = URL.createObjectURL(response);
        self.options.node.set('csuiThumbnailImageUrl', self.imgUrl, {silent: true});

        self.triggerMethod('loadUrl', self, self.imgUrl);
      }
    },

    release: function () {
      if (this.imgUrl) {
        URL.revokeObjectURL(this.imgUrl);
        delete this.imgUrl;
        this.options.node.unset('csuiThumbnailImageUrl', {silent: true});
      }
    },

    _failureHandler: function (jqxhr) {
      var error = new base.Error(jqxhr);
      this.triggerMethod('error', this, error);
      return $.Deferred().reject(error).promise();
    }

  });

  ServerAdaptorMixin.mixin(Thumbnail.prototype);
  return Thumbnail;

});
