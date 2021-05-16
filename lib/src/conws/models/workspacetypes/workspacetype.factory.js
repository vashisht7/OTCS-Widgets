/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'module', 'csui/lib/jquery', 'csui/lib/backbone',
    'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
    'conws/models/workspacetypes/workspacetype.model', 'csui/utils/commands'
  ], function (module, $, Backbone, ModelFactory, ConnectorFactory,
      wstypeModel, commands) {
    'use strict';
  
    var WsTypeFactory = ModelFactory.extend({
      propertyPrefix: 'workspacetypes',
  
      constructor: function WsTypeFactory(context, options) {
        ModelFactory.prototype.constructor.apply(this, arguments);
        var connector = context.getObject(ConnectorFactory, options);
        this.context = context;
        this.property = new wstypeModel(options, {
          connector: connector
        });
      },
  
      isFetchable: function () {
        return this.property.isFetchable();
      },
  
      fetch: function (options) {
        return this.property.fetch(options);
      }
    });
  
    return WsTypeFactory;
  });
  