/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
    'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
    './test.workspacetypes.model.js', 'csui/utils/commands'
  ], function (module, $, _, Backbone, ModelFactory, ConnectorFactory,
      WorkspacesTypes, commands) {
    'use strict';
  
    var WsTypeFactory = ModelFactory.extend({
      propertyPrefix: 'workspacetypes',
  
      constructor: function WsTypeFactory(context, options) {
        ModelFactory.prototype.constructor.apply(this, arguments);
        var connector = context.getObject(ConnectorFactory, options);
        this.context = context;
        options = _.extend(options||{},{
          connector: connector
        });
        this.property = new WorkspacesTypes(undefined, options);
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
  