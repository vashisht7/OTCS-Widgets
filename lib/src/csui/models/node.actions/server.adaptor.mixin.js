/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      var originalFetch = prototype.fetch;

      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        fetch: function (options) {
          var data = {};
          !!this.parent_id && (data.reference_id = this.parent_id);
          data.ids = this.nodes;
          data.actions = this.getRequestedCommandsUrlQuery().actions;
          var postOptions = options || {};
          _.extend(postOptions, {
            type: 'POST',
            url: Url.combine(this.connector.getConnectionUrl().getApiBase('v2'), '/nodes/actions'),
            contentType: 'application/x-www-form-urlencoded',
            data: {body: JSON.stringify(data)}
          });

          return originalFetch.call(this, postOptions);
        },

        parse: function (response, options) {
          if (_.isArray(response)) {
            return response;
          }
          return _.map(response.results, function (value, key) {
            return {
              id: key,
              actions: _.map(value.data, function (value, key) {
                value.signature = key;
                return value;
              })
            };
          }, {});
        }

      });
    }
  };

  return ServerAdaptorMixin;
});
