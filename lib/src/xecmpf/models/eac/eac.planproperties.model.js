/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
    'csui/models/mixins/connectable/connectable.mixin',
    'csui/models/mixins/fetchable/fetchable.mixin',
    'csui/utils/url',
], function (_, $, Backbone, ConnectableMixin, FetchableMixin, Url) {

    var EACPlanPropertiesModel = Backbone.Model.extend({
        constructor: function EACPlanPropertiesModel(attributes, options) {
            this.options = options || {};
            Backbone.Model.prototype.constructor.apply(this, arguments);
            this.makeConnectable(options);
        },
        parse: function (response) {
            return response;
        }
    });
    ConnectableMixin.mixin(EACPlanPropertiesModel.prototype);

    var EACPlanPropertiesCollection = Backbone.Collection.extend({

        model: EACPlanPropertiesModel,

        constructor: function EACPlanPropertiesCollection(models, options) {
            this.options = options || {};
            Backbone.Collection.prototype.constructor.apply(this, arguments);
            this.makeConnectable(options)
                .makeFetchable(options);
        },

        url: function () {
            var url = new Url(this.connector.connection.url).getApiBase('v2');
            url = Url.combine(url, 'eventactioncenter', 'eventproperties');
            return url + this.queryParamsToString(this.options.query);
        },

        parse: function (response) {
            return response.results.data;
        },

        queryParamsToString: function (params) {
            var query = '';
            if (!_.isEmpty(params)) {
                query = '?' + $.param(params);
            }
            return query.replace(/%5B%5D/g, '');
        }
    });

    ConnectableMixin.mixin(EACPlanPropertiesCollection.prototype);
    FetchableMixin.mixin(EACPlanPropertiesCollection.prototype);

    return EACPlanPropertiesCollection;
});
