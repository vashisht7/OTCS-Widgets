/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

csui.define('csui/integration/folderbrowser/d2/thumbnail/thumbnail.object.mixin', [
  'csui/lib/underscore'
], function (_) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          var node = this.options.node;
          return node.get('csuiThumbnailImageUrl');
        },

        available: function () {
          return this.url() ? true : false;
        }

      });
    }
  };

  return ServerAdaptorMixin;
});
  
  