/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',
    'xecmpf/widgets/workspaces/models/workspace.types.collection',
    'csui/utils/contexts/factories/connector',
], function (module, _, Backbone,
             CollectionFactory,
             WorkspaceTypesCollection,
             ConnectorFactory) {

    var WorkspaceTypesCollectionFactory = CollectionFactory.extend({

        propertyPrefix: 'workspaceTypes',

        constructor: function WorkspaceTypesCollectionFactory(context, options) {

            CollectionFactory.prototype.constructor.apply(this, arguments);
            var workspaceTypes = new WorkspaceTypesCollection(undefined, {
                autoreset: true,
                config: this.options.workspaceTypes,
                connector: context.getObject(ConnectorFactory)
            });
            this.property = workspaceTypes;
        },

        fetch: function (options) {
            return this.property.fetch(options);
        }

    });

    return WorkspaceTypesCollectionFactory;

});
