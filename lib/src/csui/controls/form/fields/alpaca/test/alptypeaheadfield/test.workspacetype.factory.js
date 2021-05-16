/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'module', 'csui/lib/jquery',  'csui/lib/underscore', 'csui/lib/backbone',
    'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
    './test.workspacetype.model.js', 'csui/utils/commands'
  ], function (module, $, _, Backbone, ModelFactory, ConnectorFactory,
      WSTypeModel, commands) {
    'use strict';
  
    var WsTypeFactory = ModelFactory.extend({
      propertyPrefix: 'workspacetype',
  
      constructor: function WsTypeFactory(context, options) {

        ModelFactory.prototype.constructor.apply(this, arguments);
  
        var connector = context.getObject(ConnectorFactory, options);
        this.context = context;
        options = _.extend(options||{},{
          connector: connector,
          context: context
        });
        this.property = new WSTypeModel(options&&options.attributes,options);
      },
  
    });
  
    return WsTypeFactory;
  });
  