/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/widget/search.results/search.settings/search.settings.model'
], function (require, module, _, Backbone, CollectionFactory, ConnectorFactory,
    SearchSettingsCollection) {

  var SearchSettingsFactory = CollectionFactory.extend({
    propertyPrefix: 'searchSettings',

    constructor: function SearchSettingsFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var searchSettings = this.options.searchSettings || {};
      if (!(searchSettings instanceof Backbone.Collection)) {
        var connector  = context.getObject(ConnectorFactory, options),
            config     = module.config(),
            templateId = options.templateId;
        searchSettings = new SearchSettingsCollection(searchSettings.models, _.extend({
          connector: connector,
          templateId: templateId
        }, searchSettings.options, config.options, {
          autofetch: true,
          autoreset: true
        }));
      }
      this.property = searchSettings;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  });
  return SearchSettingsFactory;
});