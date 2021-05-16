/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/node',
    'conws/models/categoryforms/categoryforms.model',
    'conws/models/selectedmetadataform/selectedmetadataform.model'
], function (ModelFactory, NodeModelFactory, CategoryFormCollection, SelectedMetadataFormModel) {

    var SelectedMetadataFormFactory = ModelFactory.extend({
        propertyPrefix: 'metadata',

        constructor: function SelectedMetadataFormFactory(context, options) {

            ModelFactory.prototype.constructor.apply(this, arguments);

            var node = context.getModel(NodeModelFactory);
            this.property = new SelectedMetadataFormModel(undefined, {
                node: node,
                metadataConfig: options[this.propertyPrefix].metadataConfig,
                autofetch: true,
                autoreset: true
            });

        },

        fetch: function (options) {
            return this.property.fetch(options);
        }
    });

    return SelectedMetadataFormFactory;
});
