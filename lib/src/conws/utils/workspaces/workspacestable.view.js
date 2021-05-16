/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/backbone', 'csui/lib/marionette', 'csui/utils/log',
  'i18n!conws/utils/workspaces/impl/nls/lang',
  'hbs!conws/utils/workspaces/workspacestable',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/utils/contexts/factories/connector',
  'csui/models/node/node.model',
  'csui/controls/table/table.view',
  'csui/controls/tabletoolbar/tabletoolbar.view',
  'csui/controls/table.rowselection.toolbar/table.rowselection.toolbar.view',
  'csui/utils/commands',
  'csui/controls/toolbar/toolbar.command.controller',
  'csui/controls/pagination/nodespagination.view',
  'conws/utils/workspaces/workspaces.columns',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/utils/accessibility',
  'csui/utils/base',
  'csui/controls/progressblocker/blocker',
  'conws/utils/workspaces/busyindicator',
  'csui/lib/jquery.redraw',
  'css!conws/utils/workspaces/workspacestable',
  'css!conws/utils/workspaces/workspaces',
  'csui/controls/toolbar/toolbar.view' /* must load this as well to have toolbar.css effective. */
], function (module, $, _, Backbone,
    Marionette, log, lang,
    template,
    DefaultActionBehavior,
    ConnectorFactory,
    NodeModel,
    TableView,
    TableToolbarView,
    TableRowSelectionToolbarView,
    commands,
    ToolbarCommandController,
    PaginationView,
    WorkspacesColumns,
    ModalAlert,
    Accessibility,
    base,
    BlockingView,
    BusyIndicator) {

  var config = module.config();
  var orderByDefault = { sortColumn: "{name}", sortOrder: "asc" };

  var accessibleTable = Accessibility.isAccessibleTable();

  var WorkspacesTableView = Marionette.LayoutView.extend({

    className: function () {
      var className = 'conws-workspaces-table';
      if (accessibleTable) {
        className += ' csui-no-animation';
      }
      return className;
    },

    template: template,

    ui: {
      toolbarContainer: '.conws-alternating-toolbars'//,
    },

    regions: {
      tableToolbarRegion: '.conws-table-tabletoolbar',
      tableRowSelectionToolbarRegion: '.conws-table-rowselection-toolbar',
      tableRegion: '#tableview',
      paginationRegion: '#paginationview'
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    constructor: function WorkspacesTableView(options) {
      if (options === undefined || !options.context) {
        throw new Error('Context required to create WorkspacesTableView');
      }
      if (!options.collection) {
        throw new Error('Collection required to create WorkspacesTableView');
      }
      options.data || (options.data = {});
      this.context = options.context;
      this.collection = options.collection;
      Marionette.LayoutView.prototype.constructor.apply(this, arguments); // sets this.options
      _.defaults(this.options.data, {
        pageSize: config.defaultPageSize || 20,
        orderBy: {}
      });
      _.defaults(this.options.data.orderBy, orderByDefault );

      if (this.options &&
          this.options.data &&
          this.options.data.expandedView &&
          this.options.data.expandedView.orderBy) {
        if (_.isString(this.options.data.expandedView.orderBy)) {
          log.error(lang.errorOrderByMustNotBeString) && console.log(log.last);
          ModalAlert.showError(lang.errorOrderByMustNotBeString);
        } else if (this.options.data.expandedView.orderBy.sortColumn) {
          var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g;
          var match = parameterPlaceholder.exec(this.options.data.expandedView.orderBy.sortColumn);
          if (!match) {
            log.error(lang.errorOrderByMissingBraces) && console.log(log.last);
            ModalAlert.showError(lang.errorOrderByMissingBraces);
          }
        }
      }

      this.onWinRefresh = _.bind(this.windowRefresh, this);
      $(window).on("resize.app", this.onWinRefresh);

      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }
      this.listenTo(this, 'after:show', this.windowRefresh);
      this.listenTo(this.collection, "request", this.blockActions)
          .listenTo(this.collection, "sync", this.unblockActions)
          .listenTo(this.collection, "destroy", this.unblockActions)
          .listenTo(this.collection, "error", function (model,request,options) {
            this.unblockActions.apply(this, arguments);
            if (request) {
              ModalAlert.showError((new base.Error(request)).message);
            }
          })
          .listenTo(this.collection,"sync",function(){
            if (this.collection.selectActions) {
              var showSelectColumn = !!(this.options.showSelectColumn && this.collection.existsSelectable);
              if (this.tableView && this.tableView.options && this.tableView.options.selectColumn!==showSelectColumn) {
                this.tableView.options.selectColumn = showSelectColumn;
                this.collection.columns.trigger('reset',this.collection.columns);
              }
            }
          });
    },

    initialize: function() {

      Marionette.LayoutView.prototype.initialize.apply(this, arguments);

      if (this.options.hasTableRowSelection) {

        _.defaults(this.options,{
          showCondensedHeaderToggle: true,
          showSelectColumn: true,
          showSelectionCounter: true
        });

        this.commands = this.options.commands || commands;
        this.commandController = this.options.commandController || new ToolbarCommandController({commands: this.commands});

        this.listenTo(this.commandController, 'before:execute:command', this._beforeExecuteCommand);
        this.listenTo(this.commandController, 'after:execute:command', this._toolbarActionTriggered);
        this.listenTo(this, 'dom:refresh', this._refreshTableToolbar);
  
        this.initAllSelection();
        var selcmds = this.commands;
        var sigcmds = _.compact(this.options.toolbarItems.tableHeaderToolbar.collection.map(function(toolItem){
          return (selcmds.get(toolItem.get("signature")));
        }));
        this.collection.selectActions = _.flatten(_.map(sigcmds,function(cmd){
          return cmd.get("command_key");
        }));
      }

    },

    onDestroy: function () {
      $(window).off("resize.app", this.onWinRefresh);
    },

    _refreshTableToolbar: function () {
      if (this.tableToolbarView && this.tableToolbarView.rightToolbarView) {
        this.tableToolbarView.rightToolbarView.collection.refilter();
      }
    },

    templateHelpers: function (data) {
      data = data || {};
      data.showAlternatingToolbar = !!this.options.hasTableRowSelection;
      return data;
    },

    doRender: function (collection) {
      _.extend(collection.options.query, this._getCollectionUrlQuery());
      collection.setLimit(0, this.options.data.pageSize, false);
      var self = this;
      collection
        .once('sync', function() {
          self.renderAfterFetch(self,collection);
        })
        .fetch();

      if (this.options.hasTableRowSelection) {
        this._setToolBar();
        this._setTableRowSelectionToolbar({
          toolItemFactory: this.options.toolbarItems.tableHeaderToolbar,
          toolbarItemsMask: this.options.toolbarItemsMasks.toolbars.tableHeaderToolbar,
          showCondensedHeaderToggle: this.options.showCondensedHeaderToggle,
          showSelectionCounter: this.options.showSelectionCounter
        });
        this._setTableRowSelectionToolbarEventListeners();
        
        this.tableToolbarRegion.show(this.tableToolbarView);

        if (this.tableRowSelectionToolbarRegion) {
          if (this._tableRowSelectionToolbarView) {
            this.tableRowSelectionToolbarRegion.show(this._tableRowSelectionToolbarView);
          }
          this.tableRowSelectionToolbarRegion.$el.find('ul').attr('aria-label',
            lang.selectedItemActionBarAria);
        }
      }
      
    },

    renderAfterFetch: function (self, collection) {
      var columns   = self.collection.columns,
          connector = self.context.getObject(ConnectorFactory);
      var columnsWithSearch = [];
      _.each(columns.models, function (model) {
        if (model.get("sort") === true && model.get("type") === -1) {
          columnsWithSearch.push(model.get("column_key"));
        }
      });
      var tableColumns = WorkspacesColumns.clone();
      tableColumns.add(this._getCustomColumns(true));
      this.tableColumns = tableColumns;

      this.tableView = new TableView({
        context: this.options.context,
        connector: connector,
        collection: collection,
        columns: columns,
        tableColumns: tableColumns,
        columnsWithSearch: columnsWithSearch,
        selectColumn: !!(this.options.showSelectColumn && this.collection.existsSelectable),
        showSelectionCounter: !!this.options.showSelectionCounter,
        allSelectedNodes: this.allSelectedNodes,
        pageSize: this.options.data.pageSize,
        orderBy: this.collection.orderBy,
        nameEdit: false,
        tableTexts: {
          zeroRecords: lang.noWorkspacesFound
        }
      });

      if (this.options.hasTableRowSelection) {
        this._setTableViewEvents();
      }
      this.tableView.enableEmptyViewText();
      this.listenTo(this.tableView, 'execute:defaultAction', function (node) {
        this.triggerMethod('execute:defaultAction', node);
      });
      this.listenTo(this.tableView, 'render', function () {
        this.tableView.triggerMethod('refresh:tabindexes');
      });
      self.paginationView = new PaginationView({
        collection: collection,
        pageSize: self.options.data.pageSize
      });
      if (!_.isUndefined(self.tableView.accFocusedState.body.column)) {
        self.tableView.accFocusedState.body.column = 1;
      }

      self.tableRegion.show(self.tableView);
      self.paginationRegion.show(self.paginationView);
    },

    _beforeExecuteCommand: function (toolbarActionContext) {

      var self = this;
      if (toolbarActionContext.command && toolbarActionContext.command.get("showBusy") ||
          toolbarActionContext.status.toolItem && toolbarActionContext.status.toolItem.get("showBusy")) {
          toolbarActionContext.status.busyIndicator = new BusyIndicator(
          function(){ self.blockActions(); },
          function(){ self.unblockActions(); }
        );
        toolbarActionContext.status.busyIndicator.on();
      }

      switch (toolbarActionContext.commandSignature) {
        case 'CloseExpandedView':
          this.context.trigger("close:expanded", {widgetView: this});
          break;
      }

    },

    _toolbarActionTriggered: function (toolbarActionContext) {
      if (toolbarActionContext.status.busyIndicator) {
        toolbarActionContext.status.busyIndicator.off();
      }
    },
    initAllSelection: function () {
      this.allSelectedNodes = this.getCollectionWithSpecificModelId();

      this.listenTo(this.allSelectedNodes, 'remove', this.removeItemToAllSelectedItems)
          .listenTo(this.allSelectedNodes, 'add', this.addItemToAllSelectedItems)
          .listenTo(this.allSelectedNodes, 'reset', this.resetAllSelectedItems);
    },
    findNodeFromCollection: function (collection, node) {
      return collection.get(node) || collection.findWhere({id: node.get('id')});
    },
    getCollectionWithSpecificModelId: function () {
      var MultiSelectCollection = Backbone.Collection.extend({
            modelId: function (attr) {
              return attr.id;
            }
          }),
          allSelectedCollection = new MultiSelectCollection();
          if (this.collection && this.collection.modelId) {
            allSelectedCollection.modelId = this.collection.modelId;
          }
      return allSelectedCollection;
    },
    removeItemToAllSelectedItems: function (node) {
      var model = this.findNodeFromCollection(this.collection, node);   //  collection.get(node);
      if (model) {
        model.set('csuiIsSelected', false); // will be ignored if already false
      } else {
        node.set('csuiIsSelected', false);
      }
    },
    addItemToAllSelectedItems: function (node) {
      var model = this.findNodeFromCollection(this.collection, node);
      if (model) {
        model.set('csuiIsSelected', true); // will be ignored if already true
      } else {
        node.set('csuiIsSelected', true);
      }
    },
    resetAllSelectedItems: function () {
      var allSelectedNodes = this.allSelectedNodes;
      this.collection.each(_.bind(function (node) {
        var selectedNode = allSelectedNodes.get(node);
        node.set('csuiIsSelected', selectedNode !== undefined);// setting to same value is ignored
      }, this));
    },

    _setTableViewEvents: function () {
      this.listenTo(this.tableView, 'tableRowSelected', function (args) {
        this.tableView.cancelAnyExistingInlineForm.call(this.tableView);
        if (this.options.showSelectColumn && this.allSelectedNodes) {
          var selectedNodes  = args.nodes,
              selectedModels = [];
          _.each(selectedNodes, function (selectedNode) {
            if (!this.allSelectedNodes.get(selectedNode) && selectedNode.get('id') !== undefined) {
              selectedModels.push(selectedNode);
            }
          }, this);
          this.allSelectedNodes.reset(selectedModels.concat(this.allSelectedNodes.models));
        }
      });

      this.listenTo(this.tableView, 'tableRowUnselected', function (args) {
        if (this.options.showSelectColumn && this.allSelectedNodes) {
          var unselectedNodes = args.nodes;
          _.each(unselectedNodes, function (unselectedNode) {
            this.allSelectedNodes.remove(unselectedNode,{silent:true});
          }, this);
          this.allSelectedNodes.reset(_.clone(this.allSelectedNodes.models));
        }
      });

      return true;
    },

    _setTableRowSelectionToolbarEventListeners: function () {
      this.listenTo(this.allSelectedNodes, 'reset update', function () {
        if (!this._tableRowSelectionToolbarView.isDestroyed) {
          this.tableRowSelectionToolbarRegion.show(this._tableRowSelectionToolbarView);
        }
        this._onSelectionUpdateCssClasses(this.allSelectedNodes.length);
      });

    },

    _setToolBar: function () {
      var titleNodeModel = new NodeModel({
        "type": this.collection.node.get("type"),
        "type_name": this.collection.node.get("type_name"),
        "parent_id": this.collection.node.get("parent_id"),
        "image_url" : this.collection.titleIcon,
        "name": this.options.title
      }, {
        connector: this.collection.connector
      });
      this.tableToolbarView = new TableToolbarView({
        context: this.options.context,
        toolbarItems: this.options.toolbarItems,
        toolbarItemsMasks: this.options.toolbarItemsMasks,
        headermenuItems: this.options.headermenuItems,
        headermenuItemsMask: this.options.headermenuItemsMask,
        creationToolItemsMask: this.options.creationToolItemsMask,
        container: titleNodeModel,//this.container,//
        collection: this.collection,
        originatingView: this,
        blockingParentView: this.options.blockingParentView || this,
        addableTypes: this.addableTypes,
        toolbarCommandController: this.commandController
      });
      this.tableToolbarView.captionView.nameView.readonly = true;

      this.listenTo(this.collection,"sync", function() {
        if (this.collection.titleIcon!==titleNodeModel.get("image_url")) {
          titleNodeModel.set("image_url",this.collection.titleIcon);
        }
      });

      return true;
    },

    _setTableRowSelectionToolbar: function (options) {
      this._tableRowSelectionToolbarView = new TableRowSelectionToolbarView({
        toolItemFactory: options.toolItemFactory,
        toolbarItemsMask: options.toolbarItemsMask,
        toolbarCommandController: this.commandController,
        showCondensedHeaderToggle: options.showCondensedHeaderToggle,
        showSelectionCounter: options.showSelectionCounter,
        commands: this.defaultActionController.commands,
        selectedChildren: this.allSelectedNodes,
        container: this.collection.node,
        context: this.context,
        originatingView: this,
        collection: this.collection,
        scrollableParent: '.csui-table-tableview .csui-nodetable'
      });
      var toolbarView = this._tableRowSelectionToolbarView;
      this.listenTo(toolbarView, 'toggle:condensed:header', function () {
        if (this.$el && this.$el.hasClass('conws-table-rowselection-toolbar-visible')) {
          var showingBothToolbars = !this.$el.hasClass('csui-show-header');
          this.$el.addClass('csui-transitioning');
          this.tableToolbarRegion.$el.one('transitionend', function () {
            this.$el.removeClass('csui-transitioning');
            if (!showingBothToolbars) {
              this.tableToolbarRegion.$el.addClass('binf-hidden');
            }
          }.bind(this));

          if (showingBothToolbars) {
            this.tableToolbarRegion.$el.removeClass('binf-hidden');
            this.tableToolbarRegion.currentView.trigger(this.tableToolbarRegion.currentView, 'dom:refresh');
          }

          this.$el && this.$el.toggleClass('csui-show-header');
          toolbarView.trigger('toolbar:activity', true, showingBothToolbars);
        }
      });
    },

    _triggerToolbarActivityEvent: function (toolbarVisible, headerVisible) {
      var toolbarView = this._tableRowSelectionToolbarView;
      toolbarView.trigger('toolbar:activity', toolbarVisible, headerVisible);
    },

    _onSelectionUpdateCssClasses: function (selectionLength) {
      var self = this;
      var $rowSelectionToolbarEl = this.tableRowSelectionToolbarRegion.$el;

      function transitionEnd(headerVisible) {
        self.$el.removeClass('csui-transitioning');
        self._triggerToolbarActivityEvent(self._tableRowSelectionToolbarVisible, headerVisible);
        if (self._tableRowSelectionToolbarVisible) {
          if (!headerVisible) {
            self.tableToolbarRegion.$el.addClass('binf-hidden');
          }
        } else {
          self.tableRowSelectionToolbarRegion.$el.addClass('binf-hidden');
        }
      }

      var headerVisible;
      if (accessibleTable) {
        if (selectionLength > 0) {
          if (!this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = true;

            this.$el.addClass('csui-transitioning');
            $rowSelectionToolbarEl.removeClass('binf-hidden');
            this.$el.addClass('conws-table-rowselection-toolbar-visible');
            headerVisible = this.$el && this.$el.hasClass('csui-show-header');

            transitionEnd(headerVisible);
          }
        } else {
          if (this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = false;

            this.$el.addClass('csui-transitioning');
            this.$el && this.$el.removeClass('csui-show-header');
            this.tableToolbarRegion.$el.removeClass('binf-hidden');
            this.tableToolbarRegion.currentView.trigger(this.tableToolbarRegion.currentView,
              'dom:refresh');
            this.$el.removeClass('conws-table-rowselection-toolbar-visible');

            transitionEnd(false);
          }
        }
      } else {
        if (selectionLength > 0) {
          if (!this._tableRowSelectionToolbarVisible) {

            this.$el.addClass('csui-transitioning');

            this._tableRowSelectionToolbarVisible = true;

            headerVisible = this.$el && this.$el.hasClass('csui-show-header');
            $rowSelectionToolbarEl
              .removeClass('binf-hidden').redraw()
              .one('transitionend', function () {
                transitionEnd(headerVisible);
              }.bind(this));
            this.$el.addClass('conws-table-rowselection-toolbar-visible');
          }
        } else {
          if (this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = false;

            this.$el.addClass('csui-transitioning');
            this.$el && this.$el.removeClass('csui-show-header');

            this.tableToolbarRegion.$el.removeClass('binf-hidden').redraw();
            this.tableToolbarRegion.currentView.trigger(this.tableToolbarRegion.currentView,
                'dom:refresh');

            $rowSelectionToolbarEl
                .one('transitionend', function () {
                  transitionEnd(false);
                }.bind(this));
            this.$el.removeClass('conws-table-rowselection-toolbar-visible');
          }
        }
      }
    },
    _getCustomColumns: function (showError) {
      var customColumns = [], errors = [];
      if (this.options &&
          this.options.data &&
          this.options.data.expandedView &&
          this.options.data.expandedView.customColumns) {
        var unknownError = false;
        var seqnr = 500;
        this.options.data.expandedView.customColumns.forEach(function (cc) {
          var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g;
          var match = parameterPlaceholder.exec(cc.key);
          if (match) {
            customColumns.push(_.defaults({key:match[1],sequence:seqnr++},cc));
          } else {
            if (showError) {
              if (cc.key && cc.key.indexOf("{")>=0) {
                unknownError = true;
                log.error(lang.errorCustomColumnConfigInvalid, cc.key) && console.log(log.last);
              } else {
                log.error(lang.errorCustomColumnMissingBraces, cc.key) && console.log(log.last);
              }
              errors.push(cc.key)
            }
          }
        });
        if (showError && errors.length>0) {
          var errfmt = unknownError ? lang.errorCustomColumnConfigInvalid : lang.errorCustomColumnMissingBraces;
          ModalAlert.showError(_.str.sformat(errfmt, errors.join(", ")));
        }
      }
      return customColumns;
    },
    _getCustomColumnKeys: function () {
      var columns = this._getCustomColumns();
      return columns.length > 0 ? $.map(columns, function (val, i) {
        return val.key
      }) : [];
    },
    _getCoreColumnKeys: function () {
      var columns = WorkspacesColumns.models;
      return columns.length > 0 ? $.map(columns, function (val, i) {
        return val.get("key");
      }) : [];
    },
    getColumnsToFetch: function () {
      var columns         = this._getCustomColumnKeys(),
          coreColumns     = this._getCoreColumnKeys(),
          requiredColumns = ["id", "type", "container"];
      _.each(coreColumns, function (coreColumn) {
        if ($.inArray(coreColumn, columns) < 0) {
          columns.push(coreColumn);
        }
      });
      _.each(requiredColumns, function (requiredColumn) {
        if ($.inArray(requiredColumn, columns) < 0) {
          columns.push(requiredColumn);
        }
      });

      return columns.toString()
    },
    windowRefresh: function () {
      if (this.paginationView) {
        this.paginationView.triggerMethod('dom:refresh');
      }
    },
    onDomRefresh: function () {
      _.each(this.regionManager._regions, function (region) {
        if (region.currentView) {
          region.currentView.trigger('dom:refresh');
        }
      });
    },
    onShow: function () {
      _.each(this.regionManager._regions, function (region) {
        if (region.currentView) {
          region.currentView.trigger('show');
        }
      });
    },
    onAfterShow: function () {
      _.each(this.regionManager._regions, function (region) {
        if (region.currentView) {
          region.currentView.triggerMethod('after:show');
        }
      });
    }
  });

  return WorkspacesTableView;
});
