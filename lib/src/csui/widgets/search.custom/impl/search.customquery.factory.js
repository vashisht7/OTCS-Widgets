/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/widgets/search.custom/impl/search.customview.factory',
  'csui/widgets/search.custom/impl/search.customquery.model',
  'csui/utils/contexts/factories/connector'
], function (module, _, Backbone, ModelFactory, CustomViewFactory,
    SearchCustomQueryModel, ConnectorFactory) {

  var CustomQueryFactory = ModelFactory.extend({

    propertyPrefix: 'customQuery',

    constructor: function CustomQueryFactory(context, options) {
      options || (options = {});
      ModelFactory.prototype.constructor.apply(this, arguments);

      var customQuery = this.options.customQuery || {};
      if (!(customQuery instanceof Backbone.Model)) {
        var connector = context.getObject(ConnectorFactory, options),
            config    = module.config();
        customQuery = new SearchCustomQueryModel(options.attributes, _.extend({
          connector: connector
        }, config.options, customQuery.options));
      }
      this.property = customQuery;
    },

    fetch: function (options) {
      return this.property.fetch(this.options);
    }

  });

  return CustomQueryFactory;

});
