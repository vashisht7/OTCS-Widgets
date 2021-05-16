/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'module',
    'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',
    'conws/widgets/outlook/impl/recentwksps/impl/recentwksps.model',
    'conws/widgets/outlook/impl/utils/utility'
], function (module, _, Backbone, ModelFactory, RecentWkspsModel, WkspUtil) {

  var recentwkspsModelFactory = ModelFactory.extend({

    propertyPrefix: 'recentwksps',

    constructor: function recentwkspsModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      this.property = new RecentWkspsModel(undefined, {
          connector: context.connector,
          pageNo: 1,
          pageSize: WkspUtil.pageSize
      });
    },

    fetch: function (options) {
        return this.property.fetch(options);
    }

  });

  return recentwkspsModelFactory;

});
