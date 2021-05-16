/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
    'csui/utils/url', 'csui/models/mixins/connectable/connectable.mixin'
], function (module, $, _, Backbone,
             Url, ConnectableMixin) {

    var DossierModel, DossierCollection;

    DossierModel = Backbone.Model.extend({
        constructor: function DossierModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);
        },

        parse: function (response) {
            if (response && response.paging && response.paging.total_count > 0) {
                return response;
            }
        }
    });

    DossierCollection = Backbone.Collection.extend({
        model: DossierModel,

        constructor: function DossierCollection(attributes, options) {
            options || (options = {});
            Backbone.Collection.prototype.constructor.apply(this, arguments);

            this.options = _.pick(options, ['connector', 'nodeModel', 'query']);
            this.makeConnectable(this.options);
        },

        parse: function (response, options) {
            var data = response.results.data,
                properties = response.results.properties;
            this.total_documents = properties.total_documents;
            data = _.filter(data, function (item) {
                return item.paging.total_count > 0
            });
            return data;
        },

        queryParamsToString: function (params) {
            return '?' + $.param(params);
        },

        fetch: function (options) {
            options || (options = {});
            if (options.query) {
                this.url = this.getUrl() + this.queryParamsToString(options.query);
            }
            return Backbone.Collection.prototype.fetch.apply(this, arguments);
        },

        url: function () {
            var queryParams = this.options.query || {};

            return this.getUrl() + this.queryParamsToString(queryParams);
        },

        getUrl: function () {
            var url = this.connector.connection.url;
            url = Url.combine(url, 'businessworkspaces', this.options.nodeModel.get('id'), 'dossier')
                .replace('/v1', '/v2');
            return url;
        }
    });

    ConnectableMixin.mixin(DossierCollection.prototype);

    return DossierCollection;
});
