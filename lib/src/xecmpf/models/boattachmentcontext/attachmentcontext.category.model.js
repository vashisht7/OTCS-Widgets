/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/backbone',
    "csui/utils/log",
    'csui/utils/url',
    'csui/models/node/node.model',
    'csui/models/mixins/fetchable/fetchable.mixin'
], function ($, _,
             Backbone,
             log,
             Url,
             NodeModel,
             FetchableMixin) {

    var AttachmentContextCategoryModel = NodeModel.extend({
        constructor: function AttachmentContextCategoryModel(attributes, options) {
            options || (options = {});

            NodeModel.prototype.constructor.call(this, attributes, options);
            this.node = options.node;
            this.category_id = options.category_id;

        },
        fetch: function (options) {
            options || (options = {});
			var categoryOptions = _.extend({},options)
			 if (!categoryOptions.url) {
                categoryOptions.url = _.result(this, 'url');
            }
            if (this.node.get("id")) {
                return NodeModel.prototype.fetch.call(this, categoryOptions);
            } else {
                return $.Deferred().resolve().promise();
            }
        },

        url: function () {
            return Url.combine(this.connector.connection.url,
                'nodes', this.node.get("id"), 'categories', this.category_id).replace('/v2/', '/v1/');
        },
        parse: function (response) {
            return response.data;
        }
    });
    return AttachmentContextCategoryModel;
});

