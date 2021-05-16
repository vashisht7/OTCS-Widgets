/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          var url   = this.connector.getConnectionUrl().getApiBase('v2'),
              query = Url.combineQueryString(
                  this.getAdditionalResourcesUrlQuery(),
                  this.getResourceFieldsUrlQuery(),
                  this.getExpandableResourcesUrlQuery(),
                  this.getStateEnablingUrlQuery(),
                  this.getRequestedCommandsUrlQuery(),
                  this.getSortByOrderUrlQuery()
              );
          url = Url.combine(url, '/members/favorites');
          return query ? url + '?' + query : url;
        },

        getSortByOrderUrlQuery: function () {
          return {sort: 'order'};
        },

        parse: function (response, options) {
          this.parseBrowsedState({results: response}, options);
          return this.parseBrowsedItems(response, options);
        }

      });
    }
  };

  return ServerAdaptorMixin;
});
