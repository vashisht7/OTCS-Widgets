/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',
    'xecmpf/widgets/workspaces/models/workspace.collection',
    'csui/utils/contexts/factories/connector',
    'csui/utils/commands',
], function (module, _, Backbone,
             CollectionFactory,
             WorkspaceCollection,
             ConnectorFactory,
             allCommands) {
    'use strict';

    var WorkspaceCollectionFactory = CollectionFactory.extend({

        propertyPrefix: 'workspaces',

        constructor: function WorkspaceCollectionFactory(context, options) {
            options || (options = {});

            CollectionFactory.prototype.constructor.apply(this, arguments);
            var workspaces = this.options.workspaces || {};

            if (!(workspaces instanceof Backbone.Collection)) {
                workspaces = new WorkspaceCollection(workspaces.models, _.extend({},
                    this.options.workspaces, {
                    autoreset: true,
                    commands: allCommands.getAllSignatures(),
                    includeActions: false,
                    connector: context.getObject(ConnectorFactory)
                }));
            }
            this.property = workspaces;
        },

        fetch: function (options) {
            return this.property.fetch(options);
        }

    });

    return WorkspaceCollectionFactory;

});
