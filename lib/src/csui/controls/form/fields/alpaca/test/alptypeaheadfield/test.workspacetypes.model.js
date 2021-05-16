/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore',
    'csui/lib/jquery',
    'csui/lib/backbone',
    'csui/models/browsable/client-side.mixin',
    'csui/utils/url',
    './test.workspacetype.model.js'
  ], function (_, $, Backbone, ClientSideMixin, Url, WSTypeModel) {
    'use strict';
  
    var WorkspaceTypeCollection = Backbone.Collection.extend({

      model:WSTypeModel,
  
      constructor: function WorkspaceTypeCollection(attributes, options) {
        Backbone.Collection.prototype.constructor.apply(this, arguments);
        this.makeClientSideBrowsable(options);
        if (options && options.connector) {
          options.connector.assignTo(this);
        }
      },
  
      url: function () {
        var baseUrl = this.connector.getConnectionUrl().getApiBase('v2'),
            getUrl  = Url.combine(baseUrl, 'businessworkspacetypes');
        return getUrl;
  
      },
  
      parse: function (response) {
        this.fetched = true;
        return response.results;
      },
  
      isFetchable: function () {
        return true;
      }
    });

    ClientSideMixin.mixin(WorkspaceTypeCollection.prototype);
  
    return WorkspaceTypeCollection;
  
  }); 
  