/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/connector',
    'csui/utils/contexts/factories/node',
    'xecmpf/models/boattachmentcontext/attachmentcontext.category.model'
], function (_,
             ModelFactory,
             ConnectorFactory,
             NodeModelFactory,
             AttachmentContextFactoryModel) {

    var AttachmentContextCategoryFactory = ModelFactory.extend({

        propertyPrefix: 'attachmentContextCategory',

        constructor: function AttachmentContextCategoryFactory(context, options) {
            ModelFactory.prototype.constructor.apply(this, arguments);
            options.attachmentContextCategory = options.attachmentContextCategory || {};

            var node = options.attachmentContextCategory.node ||
                    context.getModel(NodeModelFactory, options),
                connector = options.attachmentContextCategory.connector ||
                    context.getObject(ConnectorFactory, options);

            this.property = new AttachmentContextFactoryModel({},
                {
                    category_id: options.attachmentContextCategory.category_id,
                    connector: connector,
                    node: node
                });

        },

        fetch: function (options) {
            return this.property.fetch(options);
        }

    });

    return AttachmentContextCategoryFactory;

});
