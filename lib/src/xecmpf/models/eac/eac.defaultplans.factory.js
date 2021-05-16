/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'xecmpf/models/eac/eac.defaultplans.model'
], function (_, Backbone,
  CollectionFactory, ConnectorFactory,
  EACDefaultPlansCollection) {

    var EACDefaultPlansFactory = CollectionFactory.extend({
      propertyPrefix: 'EACDefaultPlansCollection',
      constructor: function EACDefaultPlansFactory(context, options) {
        CollectionFactory.prototype.constructor.apply(this, arguments);
        var eacCollection = this.options.EACDefaultPlansCollection || {};
        if (!(eacCollection instanceof Backbone.Collection)) {
          eacCollection = new EACDefaultPlansCollection(eacCollection.models, _.extend({
            connector: context.getModel(ConnectorFactory),
            autofetch: true
          }, eacCollection.options));
        }
        this.property = eacCollection;
      },
      fetch: function (options) {
        return this.property.fetch(options);
      }
    });

    return EACDefaultPlansFactory;
  });