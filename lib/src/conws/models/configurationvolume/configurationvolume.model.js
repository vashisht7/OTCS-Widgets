/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/models/mixins/fetchable/fetchable.mixin'
], function (_, $, Backbone, Url, FetchableMixin) {
  'use strict';

  var VolumesModel = Backbone.Model.extend({

    constructor: function VolumesModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
      this.makeFetchable(options);
    },

    url: function () {
      var baseUrl = this.connector.connection.url.replace('/v1', '/v2'),
          getUrl  = Url.combine(baseUrl, 'configurationvolumes');
      return getUrl;

    },

    parse: function (response) {
      this.fetched = true;
      return {shortcutItems: response.results};
    },

    isFetchable: function () {
      return true;
    }
  });

  FetchableMixin.mixin(VolumesModel.prototype);
  
  return VolumesModel;
}); 
