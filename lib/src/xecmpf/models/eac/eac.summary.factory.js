/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'xecmpf/models/eac/eac.summary.model'
], function (_, Backbone,
  CollectionFactory, ConnectorFactory,
  EACSummary) {
    var EACSummaryFactory = CollectionFactory.extend({
      propertyPrefix: 'EACSummaryCollection',
      constructor: function EACSummaryCollection(context, options) {
        CollectionFactory.prototype.constructor.apply(this, arguments);
        var eacSummary = this.options.EACSummary || {};
        if (!(eacSummary instanceof Backbone.Collection)) {
          eacSummary = new EACSummary(eacSummary.models, _.extend({
            connector: context.getModel(ConnectorFactory),
            autofetch: true
          }, eacSummary.options));
        }
        this.proprty = eacSummary;
      },
      fetch: function (options) {
        return this.property.fetch(options);
      }
    });
    return EACSummaryFactory;

  })