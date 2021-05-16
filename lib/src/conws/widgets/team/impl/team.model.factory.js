/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
    'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/node',
    'csui/utils/contexts/factories/connector',
    'conws/widgets/team/impl/team.model'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory, ConnectorFactory, TeamCollection) {

    var TeamCollectionFactory = CollectionFactory.extend({

        propertyPrefix: 'team',

        constructor: function TeamCollectionFactory(context, options) {
            CollectionFactory.prototype.constructor.apply(this, arguments);

            var team = this.options.team || {};
            if (!(team instanceof Backbone.Collection)) {
                var node = context.getModel(NodeModelFactory, options),
                    connector = context.getObject(ConnectorFactory, options),
                    config = module.config();

                team = new TeamCollection(team.models, _.extend({
                    context: context,
                    node: node,
                    connector: connector
                }, team.options, config.options, {
                    autoreset: true
                }));
            }
            this.property = team;
        },

        fetch: function (options) {
            return this.property.fetch(options);
        }

    });

    return TeamCollectionFactory;

});
