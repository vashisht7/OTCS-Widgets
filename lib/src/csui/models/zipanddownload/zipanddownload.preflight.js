/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/uploadable/uploadable.mixin'
], function (module, _, $, Backbone, Url, ConnectableMixin, UploadableMixin) {
  'use strict';

  var config = _.extend({
    idAttribute: null
  }, module.config());

  var PreFlightModel = Backbone.Model.extend({

    constructor: function PreFlightModel(attributes, options) {
      attributes || (attributes = {});
      options || (options = {});
      this.options = options;

      Backbone.Model.prototype.constructor.call(this, attributes, options);

      this.options.connector = options.collection && options.collection.connector ||
                               options.container && options.container.connector ||
                               options.nodes.models && options.nodes.models[0].connector;
      this.makeConnectable(options)
          .makeUploadable(options);
    },

    urlBase: function () {
      var queryString = "",
          url         = this.options.connector.getConnectionUrl().getApiBase('v2');
      url = Url.combine(url, 'zipanddownload');

      if (this.preflight) {
        url = Url.combine(url, 'preflight', queryString);
      } else {
        url = Url.combine(url, queryString);
      }
      return url;
    },

    url: function () {
      var url   = this.urlBase(),
          query = null;
      return query ? url + '?' + query : url;
    },

    parse: function (response, options) {
      return response;
    }
  });
  ConnectableMixin.mixin(PreFlightModel.prototype);
  UploadableMixin.mixin(PreFlightModel.prototype);

  return PreFlightModel;
});
