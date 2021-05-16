/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/connector',
    'csui/utils/contexts/factories/node',
    'xecmpf/models/boattachmentcontext/attachmentcontext.busobjinfo.model'

], function (_,
             ModelFactory,
             ConnectorFactory,
             NodeModelFactory,
             AttachmentContextBusinessObjectInfoModel) {

    var AttachmentContextBusinessObjectInfoFactory = ModelFactory.extend({

        propertyPrefix: 'attachmentContextBusinessObjectInfo',

        constructor: function AttachmentContextBusinessObjectInfoFactory(context, options) {
            options = options || {};
            ModelFactory.prototype.constructor.apply(this, arguments);

            var node = options.node ||  context.getModel(NodeModelFactory, {}),
                connector = options.connector || context.getObject(ConnectorFactory, {}),
                data = options.attachmentContextBusinessObjectInfo.data || {};

            _.defaults(data, {
                busObjectId: "",
                busObjectType: "",
                extSystemId: ""
            })

            this.property = new AttachmentContextBusinessObjectInfoModel({},
                {context: context, data: data, connector: connector, node: node});

        },

        fetch: function (options) {
            return this.property.fetch(options);
        }

    });

    return AttachmentContextBusinessObjectInfoFactory;

});
