/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore',
    'csui/utils/contexts/factories/factory',
    'xecmpf/models/boattachmentcontext/attachmentcontext.model'
], function (_,
             ModelFactory,
             AttachmentContextModel) {

    var AttachmentContextFactory = ModelFactory.extend({

        propertyPrefix: 'attachmentContext',

        constructor: function AttachmentContextFactory(context, options) {
            ModelFactory.prototype.constructor.apply(this, arguments);
            this.property = new AttachmentContextModel({}, {context: context, data: options.attachmentContext});
        },

        fetch: function (options) {
            return this.property.fetch(options);
        }

    });

    return AttachmentContextFactory;

});
