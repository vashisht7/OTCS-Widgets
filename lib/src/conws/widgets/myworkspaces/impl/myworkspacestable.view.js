/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
    "csui/lib/marionette", "csui/utils/log",
    'conws/utils/workspaces/impl/workspaceutil',
    'conws/utils/workspaces/workspacestable.view'
], function (module, $, _, Backbone,
             Marionette, log,
             workspaceUtil, WorkspacesTableView) {

    var MyWorkspacesTableView = WorkspacesTableView.extend({

        constructor: function MyWorkspacesTableView(options) {
            WorkspacesTableView.prototype.constructor.apply(this, arguments);
        },

        onRender: function () {
            var collection = this.collection;
            if (!_.isUndefined(this.collection.options.myworkspaces.attributes.sortExpanded)) {
                collection.orderBy = this.collection.options.myworkspaces.attributes.sortExpanded;
            }else{
              collection.orderBy = workspaceUtil.orderByAsString(this.options.data.orderBy);
            }

            this.doRender(collection);
        },

        _getCollectionUrlQuery: function () {
            var query = {};
            query.fields = encodeURIComponent("properties{" + this.getColumnsToFetch() + "}");
            query.action = "properties-properties";
            query.expanded_view = "true";
            query.expand_users = "true";

            return query;
        }

    });

    return MyWorkspacesTableView;
});
