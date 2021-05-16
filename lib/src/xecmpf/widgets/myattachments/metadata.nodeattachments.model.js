/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
    'csui/utils/base', 'csui/utils/log', 'csui/utils/url',
    'xecmpf/widgets/myattachments/metadata.attachments.model', 'csui/models/actions', 'csui/models/columns',
    'csui/models/mixins/node.resource/node.resource.mixin',
    'csui/models/mixins/expandable/expandable.mixin',
    'csui/lib/jquery',
    'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, base, log, Url, AttachmentCollection, ActionCollection,
             NodeColumnCollection, NodeResourceMixin,
             ExpandableMixin, $/* ClientSideBrowsableMixin */) {
    'use strict';

    var NodeAttachmentCollection = AttachmentCollection.extend({

        constructor: function NodeAttachmentCollection(models, options) {
            AttachmentCollection.prototype.constructor.apply(this, arguments);

            this.makeNodeResource(options)
                .makeExpandable(options);

            this.columns = new NodeColumnCollection();
        },

        clone: function () {
            return new this.constructor(this.models, {
                node: this.node,
                skip: this.skipCount,
                top: this.topCount,
                filter: _.deepClone(this.filters),
                orderBy: _.clone(this.orderBy),
                expand: _.clone(this.expand),
                commands: _.clone(this.options.commands)
            });
        },

        mergeUrlPaging: function () {
            var queryParams = {};
            var limit = this.topCount;
            if (limit) {
                queryParams.limit = limit;
                queryParams.page = this.skipCount ? (Math.floor(this.skipCount / limit)) + 1 : 1;
            }
            return queryParams;
        },

        mergeUrlFiltering: function () {
            var queryParams = [];
            if (!$.isEmptyObject(this.filters)) {
                for (var name in this.filters) {
                    if (this.filters.hasOwnProperty(name)) {
                        if (this.filters[name] !== "" && this.filters[name] !== undefined) {
                            queryParams["where_" + name] = "contains_" + this.filters[name];
                        }
                    }
                }
            }
            return queryParams;
        },

        mergeUrlSorting: function () {
            var queryParams = [];
            var orderBy;
            if (this.orderBy) {
                orderBy = this.orderBy;
                queryParams.sort = this._formatSorting(orderBy);
            } else if (_.isUndefined(queryParams.sort)) {
                queryParams.sort = "asc_name";
                this.orderBy = "name asc";
            } else if (queryParams.sort.indexOf(" ") > -1) {
                orderBy = queryParams.sort;
                this.orderBy = queryParams.sort;
                queryParams.sort = this._formatSorting(orderBy);
            }
            return queryParams;
        },

        _formatSorting: function (orderBy) {
            var slicePosition = orderBy.lastIndexOf(" ");
            return orderBy.slice(slicePosition + 1) + '_' + orderBy.slice(0, slicePosition);
        },

        url: function () {
            var query = Url.combineQueryString(
                this.getExpandableResourcesUrlQuery(),
                'metadata',
                this.mergeUrlPaging(),
                this.mergeUrlFiltering(),
                this.mergeUrlSorting()
            );

            var url = this.node.urlBase();
            url = url.replace('/v1', '/v2');
            return Url.combine(url, '/businessattachments?' + query);
        },

        parse: function (response) {
            this.actions = response.actions; // get actions independent from single bus. attachment, e.g. add attachment
            this.totalCount = response.paging.total_count;

            var metadata = response.meta_data;
            var columnKeys = _.keys(metadata.properties);

            if (!this.options.onlyClientSideDefinedColumns) {
                if (response.metadata_order) {
                    for (var idx = 0; idx < response.metadata_order.length; idx++) {
                        var column_key = response.metadata_order[idx];
                        metadata[column_key].metadata_order = 500 + idx;
                    }
                }
            }
            if (!this.filters) {
                this.columns.reset(this.getColumnModels(columnKeys, metadata.properties));
            }

            return response.results;
        },

        getColumnModels: function (columnKeys, metadata) {
            var columns = _.reduce(columnKeys, function (colArray, column) {
                if (column.indexOf('_formatted') >= 0) {
                    var shortColumnName = column.replace(/_formatted$/, '');
                    if (metadata[shortColumnName]) {
                        return colArray;
                    }
                } else {
                    var definition_short = metadata[column];
                    if (!definition_short.metadata_order) {
                        var definition_formatted = metadata[column + '_formatted'];
                        if (definition_formatted && definition_formatted.metadata_order) {
                            definition_short.metadata_order = definition_formatted.metadata_order;
                        }
                    }
                }
                var definition = metadata[column];

                switch (column) {
                    case "name":
                        definition = _.extend(definition, {
                            default_action: true,
                            contextual_menu: false,
                            editable: true,
                            filter_key: "name"
                        });
                        break;
                }

                colArray.push(_.extend({column_key: column}, definition));
                return colArray;
            }, []);
            return columns;
        }

    });
    ExpandableMixin.mixin(NodeAttachmentCollection.prototype);
    NodeResourceMixin.mixin(NodeAttachmentCollection.prototype);

    return NodeAttachmentCollection;

});
