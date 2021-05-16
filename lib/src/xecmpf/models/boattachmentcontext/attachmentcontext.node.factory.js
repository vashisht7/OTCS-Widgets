/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/connector',
    'csui/utils/contexts/factories/node',
    'xecmpf/models/boattachmentcontext/attachmentcontext.node.model'
], function (_,
             ModelFactory,
             ConnectorFactory,
             NodeModelFactory,
             AttachmentContextNodeModel) {

    var AttachmentContextNodeFactory = ModelFactory.extend({

        propertyPrefix: 'attachmentContextNode',

        constructor: function AttachmentContextNodeFactory(context, options) {
            ModelFactory.prototype.constructor.apply(this, arguments);

            var node = options.attachmentContextNode.node ||
                    context.getModel(NodeModelFactory, {}),
                connector = options.attachmentContextNode.connector ||
                    context.getObject(ConnectorFactory, {});

            this.property = new AttachmentContextNodeModel({}, {data: options.attachmentContextNode.data,
                connector: connector, node: node});

        },

        fetch: function (options) {
            return this.property.fetch(options);
        }

    });

    return AttachmentContextNodeFactory;

});
