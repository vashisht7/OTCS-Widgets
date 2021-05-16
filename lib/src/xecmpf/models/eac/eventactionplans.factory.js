/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'xecmpf/models/eac/eventactionplans.model'
], function (module, _, Backbone,
  CollectionFactory, NodeFactory, EACEventActionPlans) {

    var EACEventActionPlansFactory = CollectionFactory.extend({

      propertyPrefix: 'EACEventActionPlans',

      constructor: function EACEventActionPlansFactory(context, options) {
        CollectionFactory.prototype.constructor.apply(this, arguments);
        var eacEventActionPlans = this.options.EACEventActionPlans || {};

        if (!(eacEventActionPlans instanceof Backbone.Collection)) {
          var node = context.getModel(NodeFactory, options), config = module.config();

          eacEventActionPlans = new EACEventActionPlans(eacEventActionPlans.models, _.extend({
            node: node,
            connector: node.connector,
            extSysTypes: options.extSysTypes
          }, eacEventActionPlans.options, config.options, {
              autofetch: true
            }));
        }

        this.property = eacEventActionPlans;
      },

      fetch: function (options) {
        return this.property.fetch(options);
      }
    });

    return EACEventActionPlansFactory;
  });
