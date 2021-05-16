/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'xecmpf/models/eac/eac.planproperties.model'
], function (_, Backbone,
  CollectionFactory, ConnectorFactory,
  EACPlanPropertiesCollection) {
    var EACPlanPropertiesFactory = CollectionFactory.extend({
      propertyPrefix: 'EACPlanPropertiesCollection',
      constructor: function EACPlanPropertiesFactory(context, options) {
        CollectionFactory.prototype.constructor.apply(this, arguments);
        var eacCollection = this.options.EACPlanPropertiesCollection || {};
        if (!(eacCollection instanceof Backbone.Collection)) {
          var namespace;
          var event_name;
          if(options.eventModel.get){
            namespace = options.eventModel.get('namespace');
            event_name = options.eventModel.get('event_name');
          } else {
            namespace = options.eventModel.attributes.namespace;
            event_name = options.eventModel.attributes.event_name;
          }
          eacCollection = new EACPlanPropertiesCollection(eacCollection.models, _.extend({
            connector: context.getModel(ConnectorFactory),
            query: {
              event_name: event_name,
              system_name: namespace
            },
            autofetch: true
          }, eacCollection.options));
        }
        this.property = eacCollection;
      },
      fetch: function (options) {
        return this.property.fetch(options);
      }
    });
    return EACPlanPropertiesFactory;
  });