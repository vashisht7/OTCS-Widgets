/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone',
    'csui/models/mixins/connectable/connectable.mixin', 'csui/utils/url'
], function (_, Backbone, ConnectableMixin, Url) {
    
    var MissingDocumentModel = Backbone.Model.extend({

        idAttribute: 'id',

        constructor: function MissingDocumentModel(attributes, options) {
            options || (options = {});
            Backbone.Model.prototype.constructor.apply(this, arguments);
            this.makeConnectable(options);
        },

        parse: function (response) {
            return response;
        }

    });
    ConnectableMixin.mixin(MissingDocumentModel.prototype);

    var MissingDocumentCollection = Backbone.Collection.extend({

        model: MissingDocumentModel,

        constructor: function MissingDocumentCollection(models, options) {
            this.options = options || {};
            Backbone.Collection.prototype.constructor.apply(this, arguments);
            this.makeConnectable(options);
        },

        url: function () {
            var wrkspceId = this.options.node.get('id');
            return Url.combine(new Url(this.connector.connection.url).getApiBase('v2'),
                '/businessworkspaces/' + wrkspceId + '/missingdocuments');
        },

        parse: function (response) {
            return response.results.data;
        },

        fetch: function () {
            return Backbone.Collection.prototype.fetch.apply(this, arguments);
        }
    });
    ConnectableMixin.mixin(MissingDocumentCollection.prototype);

    return MissingDocumentCollection;
});
