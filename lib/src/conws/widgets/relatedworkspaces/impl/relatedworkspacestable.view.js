/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/lib/marionette", "csui/utils/log",
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/widgets/header/impl/header.model.factory',
  'conws/widgets/relatedworkspaces/commands',
  'conws/widgets/relatedworkspaces/toolbaritems',
  'conws/widgets/relatedworkspaces/toolbaritems.masks',
  'conws/widgets/relatedworkspaces/headermenuitems',
  'conws/widgets/relatedworkspaces/headermenuitems.masks',
  'conws/utils/workspaces/impl/workspaceutil',
  'conws/utils/workspaces/workspacestable.view',
  'css!conws/widgets/relatedworkspaces/impl/relatedworkspacestable'
], function (module, $, _, Backbone,
    Marionette, log,
    WorkspaceContextFactory,
    HeaderModelFactory,
    commands,
    toolbarItems,
    ToolbarItemsMasks,
    headermenuItems,
    HeaderMenuItemsMasks,
    workspaceUtil, WorkspacesTableView) {

  var RelatedWorkspacesTableView = WorkspacesTableView.extend({

    constructor: function RelatedWorkspacesTableView(options) {
      if (!options.workspaceContext) {
        options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
        options.workspaceContext.setWorkspaceSpecific(HeaderModelFactory);
      }

      WorkspacesTableView.prototype.constructor.apply(this, arguments);
      this.collection.workspace = options.workspaceContext.getModel(HeaderModelFactory);
      this.collection.workspace.fetch();
      this.listenTo(this.collection.workspace,"sync",function() {
        if (this.tableToolbarView && this.tableToolbarView.addToolbarView) {
          this.tableToolbarView.addToolbarView.collection.refilter();
        }
      });
    },

    initialize: function() {
      this.options.commands = commands;
      this.options.hasTableRowSelection = true;
      this.options.toolbarItems = toolbarItems;
      this.options.toolbarItemsMasks = new ToolbarItemsMasks();
      this.options.headermenuItems = headermenuItems;
      this.options.headermenuItemsMasks = new HeaderMenuItemsMasks();
      WorkspacesTableView.prototype.initialize.apply(this, arguments);
    },

    onRender: function () {
      var collection = this.collection;
      if (!_.isUndefined(this.collection.options.relatedWorkspaces.attributes.sortExpanded)) {
        collection.orderBy = this.collection.options.relatedWorkspaces.attributes.sortExpanded;
      } else {
        collection.orderBy = workspaceUtil.orderByAsString(this.options.data.orderBy);
      }

      this.doRender(collection);
    },

    _getCollectionUrlQuery: function () {

      var query = {where_relationtype: this.options.data.relationType};
      query.fields = encodeURIComponent("properties{" + this.getColumnsToFetch() + "}");
      query.action = "properties-properties";
      query.expand_users = "true";

      return query;
    },

    _beforeExecuteCommand: function (toolbarActionContext) {
      WorkspacesTableView.prototype._beforeExecuteCommand.apply(this, arguments);
    },

    _toolbarActionTriggered: function (toolbarActionContext) {
      WorkspacesTableView.prototype._toolbarActionTriggered.apply(this, arguments);
      if (!toolbarActionContext || toolbarActionContext.cancelled) {
         return;
       }
  
      var view = this;
      var newNodes;
      
      switch (toolbarActionContext.commandSignature) {
        case 'AddRelation':
          view.changed = true;

          newNodes = toolbarActionContext.newNodes;
          if (newNodes && newNodes.length>0) {
            newNodes.forEach(function(newNode){
              newNode.isLocallyCreated = true;
              newNode.attributes && delete newNode.attributes.csuiIsSelected;
              newNode.collection = view.collection;
              newNode.selectable = true;
            });
            this.collection.totalCount = this.collection.totalCount + newNodes.length;
            if (newNodes.length>this.collection.topCount) {
              newNodes = newNodes.slice(0,this.collection.topCount);
            } else if (newNodes.length<this.collection.topCount) {
              newNodes = newNodes.concat(this.collection.slice(0,this.collection.topCount-newNodes.length));
            }
            this.collection.updateSelectableState(newNodes);
            var showSelectColumn = !!(this.options.showSelectColumn && this.collection.existsSelectable);
            if (this.tableView && this.tableView.options && this.tableView.options.selectColumn!==showSelectColumn) {
              this.tableView.options.selectColumn = showSelectColumn;
              this.collection.reset(newNodes,{silent:true});
              this.collection.columns.trigger('reset',this.collection.columns);
              this.tableView.resetScrollToTop();
              this.paginationView && this.paginationView.collectionChange();
            } else {
              this.collection.reset(newNodes);
              this.tableView && this.tableView.resetScrollToTop();
            }
          }
          break;

        case 'RemoveRelation':
          this.changed = true;
          
          this.collection.fetch().then(function(){
            if (view.collection.totalCount<=view.collection.skipCount) {
              if (view.collection.totalCount>0) {
                if (view.collection.totalCount<=view.collection.topCount) {
                  view.collection.skipCount = 0;
                  view.collection.fetch();
                }
              }
            }
          });
          this.allSelectedNodes.reset([]);
          break;
      }
    }

  });

  return RelatedWorkspacesTableView;
});
