/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'module',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/node',
  'xecmpf/widgets/header/impl/completenesscheck/impl/models/missingdocuments.model'
], function (module,
    _,
    Backbone,
    CollectionFactory,
    ConnectorFactory,
    NodeFactory,
    MissingReportCollection) {
  var MissingDocumentsFactory = CollectionFactory.extend({
    propertyPrefix: 'missingDocumentsCollection',
    constructor: function MissingDocumentsFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);
      var missingDocumentsCollection = this.options.missingDocumentsCollection || {};
      if (!(missingDocumentsCollection instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            node      = context.getModel(NodeFactory, options),
            config    = module.config();
        missingDocumentsCollection = new MissingReportCollection(missingDocumentsCollection.models, _.extend(
            {
              connector: connector,
              node: node,
              reportType: 'MissingDocuments'
            }, missingDocumentsCollection.options, config.options, {
              autofetch: true
            }));
      }
      this.property = missingDocumentsCollection;
    },
    fetch: function (options) {
      return this.property.fetch(options);
    }
  });
  return MissingDocumentsFactory;
});
