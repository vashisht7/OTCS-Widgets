/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



define(['csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/backbone',
    "csui/utils/log",
    'csui/utils/url',
    "csui/models/resource"
], function ($, _, Backbone,
             log,
             Url,
             ResourceModel) {

    var AttachmentContextNode = Backbone.Model.extend(
        _.defaults({

            workspaceSpecific: true,

            constructor: function AttachmentContextNode(attributes, options) {
                options || (options = {});

                Backbone.Model.prototype.constructor.call(this, attributes, options);

                this.options = options;
                this.makeResource(options);
                this.listenTo(this.options.node, 'change:id', this.syncToNode);
                this.syncToNode();
            },

            syncToNode: function () {
                var node = this.options.node;
                var node_id = node.get("id");
                if (node.get("type") === 848) {
                    this.set({id: node_id, type: 848});
                }
            },

            url: function () {
                var nodeId = this.options.node.get('id');
                var url;

                if (this.options.data && this.options.data.busObjectId &&
                    this.options.data.busObjectType &&
                    this.options.data.extSystemId) {

                    url = Url.combine(this.options.connector.connection.url,
                        '/businessworkspaces');
                    url += '?expanded_view=true&where_bo_type=' + this.options.data.busObjectType;
                    url += '&where_ext_system_id=' + this.options.data.extSystemId;
                    url += '&where_bo_id=' + this.options.data.busObjectId;
                    url = url.replace('/v1', '/v2'); // yes, we need to send a v1 call!!!
                } else {
                    url = Url.combine(this.options.connector.connection.url, 'nodes', nodeId,
                        'businessworkspace');
                    url = url.replace('/v2', '/v1'); // yes, we need to send a v1 call!!!
                }
                return url;
            },

            fetch: function (options) {
                if (this.options.node.get('id')) {
                    if (this.options.node.get('type') !== 848) {
                        log.debug("Fetching the workspace id for {0} from server.", this) && console.log(log.last);
                        options || (options = {});
                        if (!options.url) {
                            options.url = _.result(this, 'url');
                        }
                        return this.Fetchable.fetch.call(this, options);
                    } else {
                        log.debug("Fetching the workspace id for {0} from node.", this) && console.log(log.last);
                        this.set({id: this.options.node.get('id'), type: 848});
                        return $.Deferred().resolve().promise();
                    }

                } else if (this.options.data && this.options.data.busObjectId && // integration scenario
                            this.options.data.busObjectType &&
                            this.options.data.extSystemId) {

                    log.debug("Fetching the workspace id for {0} from server.", this) && console.log(log.last);
                    options || (options = {});
                    if (!options.url) {
                        options.url = _.result(this, 'url');
                    }
                    return this.Fetchable.fetch.call(this, options);

                } else {
                    return $.Deferred().resolve().promise();
                }
            },

            parse: function (response) {
                if (response.results) {
                    response = response.results.length>0?response.results[0].data.properties:null;
                }

                if (response) {
                    return {id: response.id, type: response.type};
                }
            },

            toString: function () {
                return "node:" + this.get('id');
            }

        }, ResourceModel(Backbone.Model)));

    return AttachmentContextNode;

});
