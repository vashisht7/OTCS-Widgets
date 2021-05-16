/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
    'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/node',
    'csui/utils/contexts/factories/connector',
    'conws/widgets/team/impl/roles.model.expanded'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory, ConnectorFactory, RolesCollection) {

    var RoleCollectionFactory = CollectionFactory.extend({

        propertyPrefix: 'roles',

        constructor: function RoleCollectionFactory(context, options) {
            CollectionFactory.prototype.constructor.apply(this, arguments);

            var roles = this.options.roles || {};
            if (!(roles instanceof Backbone.Collection)) {
                var node = context.getModel(NodeModelFactory, options),
                    connector = context.getObject(ConnectorFactory, options),
                    config = module.config();

                roles = new RolesCollection(roles.models, _.extend({
                    context: context,
                    node: node,
                    connector: connector
                }, roles.options, config.options, {
                    autoreset: true
                }));
            }
            this.property = roles;
        },

        fetch: function (options) {
            return this.property.fetch(options);
        }
    });

    return RoleCollectionFactory;
});
