/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/table/table.view',
  'csui/controls/table/rows/description/search.description.view',
  'csui/controls/table.rowselection.toolbar/table.rowselection.toolbar.view',
  'csui/controls/tableactionbar/tableactionbar.view',
  'csui/utils/accessibility',
  'csui/lib/jquery.mousehover',
  'csui/lib/jquery.redraw',
], function (module, _, $, Backbone, Marionette, base, TableView, DescriptionRowView,
  TableRowSelectionToolbarView, TableActionBarView, Accessibility) {
  'use strict';

  var accessibleTable = Accessibility.isAccessibleTable();

  var TabularSearchResultsView = TableView.extend({

    ui: {
      toggleDetails: '.csui-table-cell-_toggledetails.sorting_disabled'
    },

    events: {
      'mouseup @ui.toggleDetails': 'onToggleOrChangePageSize',
      'keypress @ui.toggleDetails': 'onToggleOrChangePageSize',
      'mouseup .binf-table > thead > tr > th:not(.sorting_disabled)': 'onTableSortClick',
      'keypress .binf-table > thead > tr > th:not(.sorting_disabled)': 'onTableSortClick'
    },

    constructor: function TabularSearchResultsView(options) {

      this.collection = options.collection;
      this.options = options;

      this.columns = this.collection.searching && this.collection.searching.sortedColumns;
      if (options.accessibleTable) {
        this.getAdditionalColumns();
      }
      this.collection.columns = (this.columns) ? this.columns : this.tableColumns;

      this.settings = this.options.originatingView.getSettings();
      if (this.settings && this.settings.get('display')) {
        var selectedSummary = this.settings.get('display').summary_description.selected;
        this.showSummaryOnly = (selectedSummary === 'SO') ? true : false;
      }
      this.defaultActionController = this.options.defaultActionController;
      var args = _.extend({
        context: this.options.context,
        connector: this.collection.options.connector,
        collection: this.collection,
        columns: this.options.columns,
        enableSorting: this.options.enableSorting !== undefined ? this.options.enableSorting : true,
        tableColumns: this.options.tableColumns,
        pageSize: this.options.data.pageSize || this.options.pageSize,
        originatingView: this.options.originatingView,
        container: this.options.container,
        orderBy: this.collection.orderBy,
        filterBy: this.options.filterBy,
        actionItems: this.defaultActionController.actionItems,
        descriptionRowView: DescriptionRowView,
        descriptionRowViewOptions: {
          firstColumnIndex: 2,
          lastColumnIndex: 2,
          showDescriptions: false,
          showSummary: true,
          collapsedHeightIsOneLine: true,
          displayInEntireRow: true,
          showSummaryOnly: this.showSummaryOnly,
          descriptionColspan: 7
        },
        commands: this.defaultActionController.commands,
        blockingParentView: this.options.originatingView,
        parentView: this.options.originatingView,
        inlineBar: {
          viewClass: TableActionBarView,
          options: _.extend({
            collection: this.options.toolbarItems.tabularInlineToolbar || [],
            toolItemsMask: this.options.toolbarItemsMasks.toolbars.tabularInlineToolbar,
            delayedActions: this.collection.delayedActions,
            container: this.container,
            containerCollection: this.collection
          }, this.options.toolbarItems.tabularInlineToolbar &&
             this.options.toolbarItems.tabularInlineToolbar.options, {
            inlineBarStyle: this.options.config.inlineActionBarStyle,
            forceInlineBarOnClick: this.options.config.forceInlineActionBarOnClick,
            showInlineBarOnHover: this.options.config.showInlineActionBarOnHover
          })
        },
        allSelectedNodes: this.collection.selectedItems,
        customLabels: this.options.customLabels
      });

      options = _.extend(options, args);

      TableView.prototype.constructor.call(this, options);
      this.selectedSettings = this.collection.selectedSettings;
      this._showEmptyViewText = !this.collection.length;
      this.listenTo(this.options.originatingView, 'render:table',function () {
        this.columns = this.options.originatingView.columns;
        this.render();
      });
      this.listenTo(this.options.originatingView, 'toggle:description', function (showDescription) {
        this.showDetailRowDescriptions(showDescription);
        this.trigger('update:scrollbar');
      });

      this._setTableViewEvents();

      this.listenTo(this, 'set:tablerow:assets', function() {
        this.columns = this.options.originatingView.columns;
        this.setTableRowSelectionToolbar({
          toolItemFactory: this.options.toolbarItems.tableHeaderToolbar || [],
          toolbarItemsMask: this.options.toolbarItemsMasks.toolbars.tableHeaderToolbar,
          showSelectionCounter: true
        });
        this._setTableRowSelectionToolbarEventListeners();
      });

      
      this.listenTo(this.options.originatingView, "properties:view:destroyed", this.onPropertiesViewDestroyed);
      
      this.listenTo(this.options.originatingView, "permissions:view:destroyed", this.onPropertiesViewDestroyed);

      this.listenTo(this.collection, 'remove', function () {
        if (!this.collection.selectedItems.length && (this.collection.models.length === 0 || 
              this.collection.totalCount < this.collection.topCount)) {
          this.collection.trigger('sync');
        }
      });
    },

    onRender: function () {
      if (this.collection.selectedItems.length) {
        this.collection.selectedItems.trigger('reset');
      }
    },

    _setTableViewEvents: function () {
      this.listenTo(this, 'tableRowSelected', function (args) {
        this.cancelAnyExistingInlineForm.call(this);
        if (this.collection.selectedItems) {
          var selectedNodes  = args.nodes,
              selectedModels = this.collection.selectedItems.models.slice(0);
          _.each(selectedNodes, function (selectedNode) {
            if (!this.collection.selectedItems.get(selectedNode)) {
              selectedModels.push(selectedNode);
            }
          }, this);
          this.collection.selectedItems.reset(selectedModels);
        }
      });
      if (this.container) {
        this.listenTo(this.container, 'change:id', function () {
          if (this.options.fixedFilterOnChange) {
            this.collection.clearFilter(false);
            this.collection.setFilter(this.options.fixedFilterOnChange, false);
          }
          else if (this.options.clearFilterOnChange) {
            this.collection.clearFilter(false);
          }
          if (this.options.resetOrderOnChange) {
            this.collection.resetOrder(false);
          }
          if (this.options.resetLimitOnChange) {
            this.collection.resetLimit(false);
          }
        });
      }
      this.listenTo(this.collection.selectedItems, 'reset', function () {
        if (this.tableToolbarView) {
          this.options.originatingView.headerView.tableRowSelectionToolbarRegion.show(this._tableRowSelectionToolbarView);
          this._onSelectionUpdateCssClasses(this.collection.selectedItems.length);
        }
        var selectedItems = this.collection.selectedItems;
        this.collection.each(function (node) {
          var selectedItem = selectedItems.get(node.get('id'));
          node.set('csuiIsSelected', selectedItem !== undefined);
        });
      });

      this.listenTo(this, 'tableRowUnselected', function (args) {
        if (this.collection.selectedItems) {
          var unselectedNodes = args.nodes;
          _.each(unselectedNodes, function (unselectedNode) {
            this.collection.selectedItems.remove(unselectedNode, {silent: true});
          }, this);
          this.collection.selectedItems.reset(_.clone(this.collection.selectedItems.models));
        }
      });

      this.listenTo(this, 'execute:defaultAction', function (node) {
        var args = {node: node};
        this.trigger('before:defaultAction', args);
        if (!args.cancel) {
          var self = this;
          this.defaultActionController
              .executeAction(node, {
                context: this.options.context,
                originatingView: this.options.originatingView
              })
              .done(function () {
                self.trigger('executed:defaultAction', args);
              });
        }
      });
      if (this.enableDragNDrop) {
        this.listenTo(this, 'tableRowRendered', function (row) {
          var rowdragNDrop = this.setDragNDrop(row);
          this._assignDragArea(rowdragNDrop, $(row.target));
          this._assignDragArea(rowdragNDrop, row.expandedRows);
        });
      }
      return true;
    },

    setTableRowSelectionToolbar: function (options) {
      this._tableRowSelectionToolbarView = new TableRowSelectionToolbarView({
        toolItemFactory: options.toolItemFactory,
        toolbarItemsMask: options.toolbarItemsMask,
        toolbarCommandController: this.options.originatingView.commandController,
        showCondensedHeaderToggle: options.showCondensedHeaderToggle,
        showSelectionCounter: true,
        scrollableParent: '.csui-nodetable tbody',
        commands: this.defaultActionController.commands,
        selectedChildren: this.collection.selectedItems,
        container: this.collection.node,
        context: this.context,
        originatingView: this.options.originatingView,
        collection: this.collection
      });
      var toolbarView = this._tableRowSelectionToolbarView;
      this.listenTo(toolbarView, 'toggle:condensed:header', function () {
        this.options.originatingView.headerView.$el.find('.csui-search-header').toggleClass('csui-show-header');
        this.showingBothToolbars = this.options.originatingView.headerView &&
        this.options.originatingView.headerView.$el.find('.csui-search-header').hasClass(
                                      'csui-show-header');
        if (this.showingBothToolbars) {
          this.options.originatingView.headerView.$el.find('.csui-search-header').removeClass(
              'csui-table-rowselection-toolbar-visible');
              this.options.originatingView.headerView.$el.parent('#header').addClass('csui-show-header');
        } else {
          this.options.originatingView.headerView.$el.find('.csui-search-header').addClass(
              'csui-table-rowselection-toolbar-visible');
              this.options.originatingView.headerView.$el.parent('#header').removeClass('csui-show-header');
        }
        toolbarView.trigger('toolbar:activity', true, this.showingBothToolbars);
      });

      this.listenTo(toolbarView, 'render', function () {
          this.listenTo(toolbarView._selectedCountView.collection,'remove', function (models) {
            var model = this.collection.findWhere({id: models.get('id')});
            if (model) {
              model.set('csuiIsSelected', false);
            } else {
              models.set('csuiIsSelected', false);
            }
            this._onSelectionUpdateCssClasses(this.collection.selectedItems.length);
          });
      });
    },

    _setTableRowSelectionToolbarEventListeners: function () {
      this.listenTo(this.collection.selectedItems, 'reset', function () {
          var headerView = this.options.originatingView && this.options.originatingView.headerView;
          headerView.tableRowSelectionToolbarRegion &&
             headerView.tableRowSelectionToolbarRegion.$el.removeClass('binf-hidden');
          this._tableRowSelectionToolbarView._rightToolbarView.options.showCondensedHeaderToggle = true;
          headerView.tableRowSelectionToolbarRegion &&
          headerView.tableRowSelectionToolbarRegion.show(this._tableRowSelectionToolbarView);
          this._onSelectionUpdateCssClasses(this.collection.selectedItems.length);
      });

    },

    _onSelectionUpdateCssClasses: function (selectionLength, stopTriggerToolbarActivity) {
      var $rowSelectionToolbarEl = this.options.originatingView.headerView.tableRowSelectionToolbarRegion.$el;
      var headerVisible = this.options.originatingView.headerView &&
      this.options.originatingView.headerView.$el.find('.csui-search-header').hasClass(
                              'csui-show-header');
      this._tableRowSelectionToolbarVisible = !selectionLength;
      if (accessibleTable) {
        if (selectionLength > 0) {
          if (!this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = true;
            if (!headerVisible && !this.showingBothToolbars) {
              this.options.originatingView.headerView.$el.find('.csui-search-header').addClass(
                  'csui-table-rowselection-toolbar-visible');
            }
            $rowSelectionToolbarEl.removeClass('binf-hidden');
            $rowSelectionToolbarEl.addClass('csui-table-rowselection-toolbar-visible');
          }
          this._tableRowSelectionToolbarView.trigger('toolbar:activity',
              this._tableRowSelectionToolbarVisible, headerVisible);
        } else {
          this.showingBothToolbars = false;
          if (this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = false;
            this.options.originatingView.headerView.$el.find('.csui-search-header').removeClass('csui-show-header');
            this.options.originatingView.headerView.$el.find('.csui-search-header').removeClass('binf-hidden');
            this.options.originatingView.headerView.$el.find('.csui-search-header').removeClass(
                'csui-table-rowselection-toolbar-visible');
            $rowSelectionToolbarEl.removeClass('csui-table-rowselection-toolbar-visible');
            this.options.originatingView.headerView.$el.parent('#header').removeClass('csui-show-header');
          }
        }
      } else {
        if (selectionLength > 0) {
          if (!this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = true;
            $rowSelectionToolbarEl
                .removeClass('binf-hidden').redraw()
                .addClass('csui-table-rowselection-toolbar-visible');
            if (!headerVisible && !this.showingBothToolbars) {
              this.options.originatingView.headerView.$el.find('.csui-search-header').addClass(
                  'csui-table-rowselection-toolbar-visible');
            }
          }
          this._tableRowSelectionToolbarView.trigger('toolbar:activity',
              this._tableRowSelectionToolbarVisible, headerVisible);
        } else {
          this.showingBothToolbars = false;
          if (this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = false;
            this.options.originatingView.headerView.$el.find('.csui-search-header').removeClass('csui-show-header');
            $rowSelectionToolbarEl
                .removeClass('csui-table-rowselection-toolbar-visible');
            this.options.originatingView.headerView.$el.find('.csui-search-header').removeClass(
                'csui-table-rowselection-toolbar-visible');
                this.options.originatingView.headerView.$el.parent('#header').removeClass('csui-show-header');
          }
        }
      }
    },

    onTableSortClick: function (event) {
      if ((event.type === 'keypress' && (event.keyCode === 13 || event.keyCode === 32)) ||
      (event.type === 'mouseup')) {
        this.collection.isSortOptionSelected = false;
      }
    },

    onToggleOrChangePageSize: function (event) {
      if ((event.type === 'keypress' && (event.keyCode === 13 || event.keyCode === 32)) ||
          (event.type === 'mouseup')) {
        this.collection.isSortOptionSelected = true;
      }
    },

    onPropertiesViewDestroyed: function () {
      this.onMetadataNavigationViewDestroyed();
      this.options.originatingView.headerView.updateToggleDescription();
      this.render();
    },

    onMetadataNavigationViewDestroyed: function () {
      if (!!this.collection.inMetadataNavigationView && this.isTabularView) {
        this.collection.inMetadataNavigationView = false;
      }
    },

  });

  return TabularSearchResultsView;
});