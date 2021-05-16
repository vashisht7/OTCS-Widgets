/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/widgets/metadata/metadata.forms',
  'csui/utils/contexts/factories/connector'
], function (module, _, Backbone, CollectionFactory, 
    CreateFormCollection, ConnectorFactory) {

  var CreateFormCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'createForm',
    widgetID: '',

    constructor: function CreateFormCollectionFactory(context, options) {
      options || (options = {});
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var createForms = {};
      if (!(createForms instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            config    = module.config();
        createForms = new CreateFormCollection(createForms.models, _.extend({
          connector: connector,
          action: "create",
          container: options.container,
          node: options.node,
          autoreset: true
        }, createForms.options, config.options));
      }
      this.property = createForms;
    },

    fetch: function (options) {
      return this.property.fetch(this.options);
    }

  });

  return CreateFormCollectionFactory;

});
