/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/node',
  'xecmpf/widgets/dossier/impl/dossier.model'
], function (module, _, Backbone,
    CollectionFactory, ConnectorFactory, NodeModelFactory,
    DossierCollection) {

  var DossierCollectionFactory;

  DossierCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'dossierCollection',

    constructor: function DossierFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);
      var dossierCollection = this.options.dossierCollection || {};
      if (!(dossierCollection instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            config    = module.config();
        dossierCollection = new DossierCollection(dossierCollection.models, _.extend({
          connector: connector
        }, dossierCollection.options, config.options, {
          autofetch: true
        }, options));
      }
      this.property = dossierCollection;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  });

  return DossierCollectionFactory;
});
