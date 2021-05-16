/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'module',
    'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',   
    'conws/widgets/outlook/impl/favoritewksps/impl/favoritewksps.model'    
], function (module, _, Backbone, ModelFactory, FavoriteWkspsModel) {

  var favoritewkspsModelFactory = ModelFactory.extend({

    propertyPrefix: 'favoritewksps',

    constructor: function favoritewkspsModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);
     
      this.property = new FavoriteWkspsModel(undefined, {
          connector: context.connector,
          context: context
      });
    },

    fetch: function (options) {
        options.context = this.property.options.context;
        return this.property.fetch(options);
    }

  });

  return favoritewkspsModelFactory;
});
