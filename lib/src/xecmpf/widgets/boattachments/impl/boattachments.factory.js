/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore',  'csui/lib/jquery', 'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/node',
    'xecmpf/widgets/boattachments/impl/boattachments.model',
    'xecmpf/models/boattachmentcontext/attachmentcontext.busobjinfo.factory'

], function (module, _, $, Backbone,
             CollectionFactory,
             NodeModelFactory,
             BOAttachmentCollection,
             AttachmentContextBusinessObjectInfoFactory) {

    var BOAttachmentCollectionFactory = CollectionFactory.extend({

        propertyPrefix: 'boAttachments',

        constructor: function BOAttachmentCollectionFactory(context, options) {
            CollectionFactory.prototype.constructor.apply(this, arguments);

            var boAttachments = this.options.boAttachments || {};
            if (!(boAttachments instanceof Backbone.Collection)) {

                this.property = new BOAttachmentCollection(boAttachments.models, _.extend({
                    context: context,
                    node: context.getModel(NodeModelFactory, options),
                }, boAttachments.options, module.config().options, {
                    autoreset: true
                }, options));
            }
        },

        fetch: function (options) {
            return this.property.fetch(options);
        }

    });

    return BOAttachmentCollectionFactory;

});
