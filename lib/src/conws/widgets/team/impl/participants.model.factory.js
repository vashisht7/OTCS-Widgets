/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
    'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/node',
    'csui/utils/contexts/factories/connector',
    'conws/widgets/team/impl/participants.model',
    'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory, ConnectorFactory, ParticipantCollection) {
  'use strict';
    var ParticipantCollectionFactory = CollectionFactory.extend({

        propertyPrefix: 'participants',

        constructor: function ParticipantCollectionFactory(context, options) {
            CollectionFactory.prototype.constructor.apply(this, arguments);

            var participants = this.options.participants || {};
            if (!(participants instanceof Backbone.Collection)) {
                var node = context.getModel(NodeModelFactory, options),
                    connector = context.getObject(ConnectorFactory, options),
                    config = module.config();

                participants = new ParticipantCollection(participants.models, _.extend({
                    context: context,
                    node: node,
                    connector: connector
                }, participants.options, config.options,
                    ParticipantCollectionFactory.getDefaultResourceScope(), {
                      autoreset: true
                    }));
            }
            this.property = participants;
        },

        fetch: function (options) {
            return this.property.fetch(options);
        }
    }, {
      getDefaultResourceScope: function () {
        return _.deepClone({
          fields: {
            properties: [],
            'versions.element(0)': []
          },
          expand: {
            properties: []
          },
          includeResources: ['metadata']
        });
      }
    });

    return ParticipantCollectionFactory;
});

