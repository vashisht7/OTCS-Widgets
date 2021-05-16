/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/connector',
    'csui/utils/contexts/factories/node',
    'conws/widgets/header/impl/header.model'
], function (ModelFactory, ConnectorFactory, NodeModelFactory, HeaderModel) {

  var HeaderModelFactory = ModelFactory.extend({
      propertyPrefix: 'header',

      constructor: function HeaderModelFactory(context, options){
          ModelFactory.prototype.constructor.apply(this, arguments);
          var node = context.getModel(NodeModelFactory),
              connector = context.getObject(ConnectorFactory, options);
          this.property = new HeaderModel( {}, {
            node: node,
              connector: connector
          });
      },

      fetch: function(options){
          return this.property.fetch(options);
      }
  });

  return HeaderModelFactory;
});
