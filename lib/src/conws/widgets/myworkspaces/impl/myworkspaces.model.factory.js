/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/connector',
    'conws/widgets/myworkspaces/impl/myworkspaces.model'
], function (module, _, Backbone,
             CollectionFactory,
             ConnectorFactory,
             MyWorkspacesCollection) {

    var MyWorkspacesCollectionFactory = CollectionFactory.extend({

        propertyPrefix: 'myworkspaces',

        constructor: function MyWorkspacesCollectionFactory(context, options) {
            CollectionFactory.prototype.constructor.apply(this, arguments);

            var myworkspaces = this.options.myworkspaces || {};
            if (!(myworkspaces instanceof Backbone.Collection)) {
                var connector = context.getObject(ConnectorFactory, options),
                    config = module.config();
                myworkspaces = new MyWorkspacesCollection(myworkspaces.models, _.extend({
                    connector: connector
                }, myworkspaces.options, config.options, {
                    autoreset: true
                }, options));
            }
            this.property = myworkspaces;
        },

        fetch: function (options) {
            return this.property.ensureFetched(options);
        }

    });

    return MyWorkspacesCollectionFactory;

});
