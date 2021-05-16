/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/url'
], function (_, $, Backbone, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      var originalSync = prototype.sync;
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          var url         = this.connector.getConnectionUrl().getApiBase('v2'),
              queryString = "",
              templateId  = this.options.templateId;
          if (templateId) {
            queryString = Url.combine(queryString, "/template/" + templateId);
          } else {
            queryString = Url.combine(queryString, "/template");
          }
          queryString = Url.combine(queryString, "/settings/display");

          return Url.combine(url, 'search' + queryString);
        },

        sync: function (method, model, options) {
          return originalSync.apply(this, arguments);
        }
      });
    }
  };

  return ServerAdaptorMixin;
});
