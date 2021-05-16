/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

 define(['module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
    'csui/utils/url',
    'csui/models/nodes',
    'csui/models/nodechildrencolumns',
    'csui/models/browsable/browsable.mixin',
    'csui/models/browsable/v1.request.mixin',
    'csui/models/mixins/resource/resource.mixin',
    'csui/models/browsable/v1.response.mixin',
    'csui/models/browsable/v2.response.mixin',
    'csui/utils/log',
    'csui/utils/deepClone/deepClone'
], function (module, $, _, Backbone, Url,
             NodeCollection,
             NodeChildrenColumnCollection,
             BrowsableMixin,
             BrowsableV1RequestMixin,
             ResourceMixin,
             BrowsableV1ResponseMixin,
             BrowsableV2ResponseMixin,
             log) {
    'use strict';

    var config = module.config();
    _.defaults(config, {
        defaultPageSize: 30
    });

    var WorkspaceCollection = NodeCollection.extend({

        constructor: function WorkspaceCollection(models, options) {
            options = _.defaults({}, options, {
                top: config.defaultPageSize
            }, options);

            NodeCollection.prototype.constructor.call(this, models, options);
            this.makeBrowsable(options)
                .makeBrowsableV1Request(options)
                .makeResource(options)
                .makeBrowsableV2Response(options);

            this.options = options;
            this.orderBy = "name asc";
        },

        clone: function () {
            return new this.constructor(this.models, {
                skip: this.skipCount,
                top: this.topCount,
                orderBy: this.orderBy
            });
        },
        getBaseUrl: function () {
            return this.options.connector.connection.url.replace('/v1', '/v2');
        },

        url: function () {
            var query = this.getBrowsableUrlQuery(),
                url = Url.combine(this.getBaseUrl(),
                    query ? '/businessworkspaces?' + query + "&" : '/businessworkspaces?');

            url += 'metadata&expanded_view=true' +
                '&where_bo_type=' + this.options.busObjectType +
                '&where_ext_system_id=' + this.options.extSystemId;
            if (this.options.early) {
                url += '&where_is_early=true';
            }
            if (this.options.busObjectId) {
                url += '&where_bo_id='+this.options.busObjectId;
            }
            url = url.replace("where_name=", "where_name=contains_");
            return url;
        },
        isFetchable: function () {
            return true;
        },
        parse: function (response, options) {
            var modifyDate = _.chain(response.meta_data.properties).pick("modify_date").value().modify_date,
                name = _.chain(response.meta_data.properties).pick("name").value().name

            this.columns = new NodeChildrenColumnCollection([
                {
                    align: modifyDate.align,
                    column_key: "modify_date",
                    name: modifyDate.name,
                    persona: modifyDate.persona,
                    sort: (modifyDate.sort ? true : false ),
                    type: modifyDate.type,
                    width_weight: modifyDate.width_weight
                },
                {
                    column_key: "name",
                    align: name.align,
                    name: name.name,
                    persona: name.persona,
                    sort: (name ? name.sort : false ),
                    type: name.type,
                    width_weight: name.width_weight
                }]);

            this.parseBrowsedState(response, options);
            return this.parseBrowsedItems(response, options);
        }

    });

    BrowsableMixin.mixin(WorkspaceCollection.prototype);
    BrowsableV1RequestMixin.mixin(WorkspaceCollection.prototype);
    ResourceMixin.mixin(WorkspaceCollection.prototype);
    BrowsableV2ResponseMixin.mixin(WorkspaceCollection.prototype);
    var originalFetch = WorkspaceCollection.prototype.fetch;
    WorkspaceCollection.prototype.Fetchable = {

        fetch: function (options) {
            return originalFetch.call(this, options);
        }

    };

    return WorkspaceCollection;

});
