/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/marionette', 'module', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/jquery',
    'conws/widgets/myworkspaces/impl/myworkspaceslistitem.view',
    'conws/widgets/myworkspaces/impl/myworkspaces.model.factory',
    'conws/widgets/myworkspaces/impl/myworkspacestable.view',
    'i18n!conws/widgets/myworkspaces/impl/nls/lang',
    'csui/utils/nodesprites',
	'csui/utils/base',
    'conws/utils/workspaces/impl/workspaceutil',
    'conws/utils/workspaces/workspaces.view'
], function (Marionette, module, _, Backbone, $,
             MyWorkspacesListItem,
             MyWorkspacesCollectionFactory,
             MyWorkspacesTableView,
             lang,
             NodeSpriteCollection,
			 BaseUtils,
             workspaceUtil,
             WorkspacesView) {

    var MyWorkspacesView = WorkspacesView.extend({

        constructor: function MyWorkspacesView(options) {
            this.viewClassName = 'conws-myworkspaces';

            WorkspacesView.prototype.constructor.apply(this, arguments);
            this.limit = -1;
        },

        childView: MyWorkspacesListItem,

        childViewOptions: function () {
            return {
                context: this.options.context,
                preview: this.options.data                      &&
                         this.options.data.collapsedView        &&
                         this.options.data.collapsedView.preview,
                templateHelpers: function () {
                    return {
                        name: this.model.get('name'),
                        icon: NodeSpriteCollection.findClassByNode(this.model),
                        enableIcon: true
                    };
                }
            }
        },

        emptyViewOptions: {
            templateHelpers: function () {
                return {
                    text: this._parent._getNoResultsPlaceholder()
                };
            }
        },

        workspacesCollectionFactory: MyWorkspacesCollectionFactory,
        workspacesTableView: MyWorkspacesTableView,
        dialogClassName: 'myworkspaces',
        lang: lang,
        _getCollectionAttributes: function () {
            var attributes = {
                workspaceTypeId: this.options.data.workspaceTypeId,
                sortExpanded: this.options.data.expandedView && workspaceUtil.orderByAsString(this.options.data.expandedView.orderBy),
				title:  BaseUtils.getClosestLocalizedString(this.options.data.title, lang.dialogTitle)
            };
            return attributes;
        },

        _getCollectionUrlQuery: function () {
            var options = this.options.data,
                query = {};
            if (!_.isUndefined(options.workspaceTypeId)) {
                query.where_workspace_type_id = options.workspaceTypeId;
            }
            query.fields = encodeURIComponent("properties{id,container,name,type}");
            query.action = "properties-properties";
            query.expanded_view = "false";

            return _.isEmpty(query) ? undefined : query;
        }

    });

    return MyWorkspacesView;
});
