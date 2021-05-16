/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore',
    'csui/lib/jquery',
    'csui/lib/backbone',
    'csui/utils/url'
  ], function (_, $, Backbone, Url) {
    'use strict';
  
    var WSTypeModel = Backbone.Model.extend({
  
      constructor: function WSTypeModel(attributes, options) {
        Backbone.Model.prototype.constructor.apply(this, arguments);
        if (options && options.connector) {
          options.connector.assignTo(this);
        }
      },
  
      url: function () {
        var baseUrl = this.connector.connection.url.replace('/v1', '/v2'),
            getUrl  = Url.combine(baseUrl, 'businessworkspacetypes');
        return getUrl;
  
      },
  
      parse: function (response) {
        this.fetched = true;
        return {wstypes: response.results};
      },
  
      isFetchable: function () {
        return true;
      }
    });
  
    return WSTypeModel;
  
  }); 
  