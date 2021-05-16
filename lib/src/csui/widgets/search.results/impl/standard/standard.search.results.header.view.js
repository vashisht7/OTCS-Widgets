/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/tabletoolbar/tabletoolbar.view',
  'csui/widgets/search.results/controls/expandall/expandall.view',
  'csui/controls/checkbox/checkbox.view',
  'csui/widgets/search.results/controls/sorting/sort.menu.view',
  'csui/controls/selected.count/selected.count.view',
  'csui/models/node/node.model',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'hbs!csui/widgets/search.results/impl/standard/standard.search.results.header',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'css!csui/widgets/search.results/impl/search.results'
], function (_, $, Backbone, Marionette, TableToolbarView, ExpandAllView, CheckboxView, SortingView,
    SelectedCountView, NodeModel, lang, template, ViewEventsPropagationMixin) {
  'use strict';
  var StandardSearchResultsHeaderView = Marionette.LayoutView.extend({
    template: template,
    regions: {
      expandAllRegion: '#expandAllArrow',
      sortRegion: '#csui-search-sort',
      selectAllRegion: '#selectAllCheckBox',
      toolbarRegion: '#toolbar',
      selectedCounterRegion: '#SelectedItemsCounter'
    },
    constructor: function StandardSearchResultsHeaderView(options) {
      options || (options = {});
      this.collection = options.collection;
      this.resultsView = options.view;
      this.options = options.options;
      this.localStorage = options.localStorage;
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.listenTo(this.collection, 'remove', this._updateToolItems)
          .listenTo(this.collection, 'sync', this._updateToolItems);
      this.setSelectAllView();
      this.setSortingView();
      this.setExpandAllView();
      this._setToolBar();
      this._setSelectionCounterView();
      this.listenTo(this.collection, "sync", this._removeAllSelections);
      this.listenTo(this.collection, 'reset', function () {
         this.expandAllView.pageChange();
      });
      this.listenTo(this, 'dom:refresh', this._refreshEle);
      this.listenTo(this.options.originatingView, 'query:changed', function () {
        if (this.expandAllView) {
          this.expandAllView._isExpanded = false;
        }
      });
    },

    _refreshEle: function() {
      if(this.toolbarView){
        this.toolbarView.trigger('dom:refresh');
      }
      if (this._selectAllView) {
        this._selectAllView.triggerMethod('dom:refresh');
      }
      if (this.expandAllView) {
        this.expandAllView.triggerMethod('dom:refresh');
      }
    },

    onRender: function () {
        this.sortRegion.show(this.sortingView);
        this.expandAllRegion.show(this.expandAllView);
        this.selectedCounterRegion.show(this.selectedCounterView);
        this.selectAllRegion.show(this._selectAllView);
        this.toolbarRegion.show(this.toolbarView);
        this._updateToolItems();
    },
    _setToolBar: function () {
      var self       = this,
          parentNode = new NodeModel({id: undefined},
              {connector: this.collection.connector});
      this.collection.node = parentNode;
      this.toolbarView = new TableToolbarView({
        toolbarItems: this.options.toolbarItems,
        toolbarItemsMasks: this.options.toolbarItemsMasks,
        collection: this.collection,
        originatingView: this.options.originatingView,
        container: this.container,
        context: this.options.context,
        toolbarCommandController: this.options.originatingView.commandController,
        events: function () {
          return _.extend({}, TableToolbarView.prototype.events, {
            'keydown': self.onKeyInViewInToolbarView
          });
        }
      });
      this.listenTo(this.toolbarView, 'refresh:tabindexes', function () {
        this.toolbarView.$el.find('.csui-otherToolbar>ul>li>a:visible').attr('tabindex', 0);
      });
    },

    _updateToolItems: function () {
      if (this.toolbarView) {
        var nodes = this.collection.selectedItems.models;
        if (nodes && nodes.length === 1) {
          this.toolbarView.options.collection.node = nodes[0].parent;
        } else {
          this.toolbarView.options.collection.node = new NodeModel({id: undefined},
              {connector: this.collection.connector});
        }
        this.toolbarView.updateForSelectedChildren(nodes);
      }
    },

    onKeyInViewInToolbarView: function (event) {
      switch (event.keyCode) {
      case 37:
      case 39:
        event.preventDefault();
        event.stopPropagation();
        break;
      }
    },
    _setSelectionCounterView: function () {
      this.selectedCounterView = new SelectedCountView({
        collection: this.collection.selectedItems,
        scrollableParent: '.csui-result-list'
      });
      this.listenTo(this.collection.selectedItems, 'remove reset add', this._updateToolItems);
      this.listenTo(this.selectedCounterView.collection, 'remove', this._updateRowsState);
      this.listenTo(this.selectedCounterView.collection, 'reset', _.bind(function () {
        if (this.collection.prevSearchDisplayStyle === "StandardView") {
          this.resultsView._rowStates.set(StandardSearchResultsHeaderView.RowStatesSelectedRows,
              []);
        }
      }, this));
    },

    _updateRowsState: function (models) {
      var updateModels = [];
      if (!(models instanceof Array)) {
        updateModels.push(models);
      } else {
        updateModels = models;
      }
      if (this.collection.prevSearchDisplayStyle === 'StandardView') {
        _.each(updateModels, function (model) {
          var newSelectedModelIds = this.resultsView._rowStates.get(
              StandardSearchResultsHeaderView.RowStatesSelectedRows);
          newSelectedModelIds = _.without(newSelectedModelIds, model.get('id'));
          this.collection.selectedItems.remove(model);
          this.resultsView._rowStates.set(StandardSearchResultsHeaderView.RowStatesSelectedRows,
              newSelectedModelIds);
        }, this);

      }
    },
    setSelectAllView: function () {
      this._selectAllView = new CheckboxView({
        checked: this._calculateSelectAllCheckedStatus(),
        disabled: this.collection.length === 0,
        ariaLabel: lang.selectAllAria,
        title: lang.selectAll
      });

      this.listenTo(this._selectAllView, 'clicked', function (e) {
        e.cancel = true;  // don't update checkbox immediately

        var checked = this._selectAllView.model.get('checked'); // state before clicking cb

        switch (checked) {
        case 'true':
          var updateModels = [],
              modelId      = this.resultsView._rowStates.get(
                  StandardSearchResultsHeaderView.RowStatesSelectedRows);
          modelId.forEach(function (modelID) {
            var model = this.collection.selectedItems.findWhere({id: modelID});
            this.collection.selectedItems.remove(model);
          }, this);
          this.resultsView._rowStates.set(StandardSearchResultsHeaderView.RowStatesSelectedRows,
              []);
          break;
        default:
          var selectedModelIds = [];
          var newlySelected = this.collection.filter(function (model) {
            if (model.get('selectable') !== false) {
              selectedModelIds.push(model.get('id'));
              if (!this.collection.selectedItems.findWhere({id: model.get('id')})) {
                return true;
              }
            }
            return false;
          }, this);
          this.collection.selectedItems.add(newlySelected);
          this.resultsView._rowStates.set(StandardSearchResultsHeaderView.RowStatesSelectedRows,
              selectedModelIds);
        }
      });

      this.listenTo(this.resultsView._rowStates,
          'change:' + StandardSearchResultsHeaderView.RowStatesSelectedRows,
          function () {
            this._updateSelectAllCheckbox();
          });

      this.listenTo(this.collection, 'reset', function () {
        this._updateSelectAllCheckbox();
      });
    },

    _updateSelectAllCheckbox: function () {
      if (this._selectAllView) {
        this._selectAllView.setChecked(this._calculateSelectAllCheckedStatus());
        this._selectAllView.setDisabled(this.collection.length === 0);
      }
    },

    _removeAllSelections: function () {
      var selectedItemCollection = [];
      this.collection.each(_.bind(function (model) {
        if (!!this.collection.selectedItems.findWhere({id: model.get('id')})) {
          selectedItemCollection.push(model.get('id'));
        }
      }, this));
      selectedItemCollection.length &&
      this.resultsView._rowStates.set({'selected': []}, {'silent': true});
      this.resultsView._rowStates.set(StandardSearchResultsHeaderView.RowStatesSelectedRows,
          selectedItemCollection);
    },

    _calculateSelectAllCheckedStatus: function () {
      var selected = this.resultsView._rowStates.get(
          StandardSearchResultsHeaderView.RowStatesSelectedRows);
          if (selected && selected.length) {
                  var all  = selected.length === this.collection.length;
            if (selected.length > 0 && !all) {
              return 'mixed';
            } else {
              return selected.length > 0;
            }
          }
    },
    setSortingView: function () {
      this.sortingView = new SortingView({
        collection: this.collection,
        enableSorting: this.options.enableSorting !== undefined ? this.options.enableSorting : true
      });
      return true;
    },
    setExpandAllView: function () {
      this.expandAllView = new ExpandAllView({
        collection: this.collection,
        view: this.resultsView,
        _eleCollapse: "icon-expandArrowUp",
        _eleExpand: "icon-expandArrowDown"
      });
      return this.expandAllView;
    },
  }, {
    RowStatesSelectedRows: 'selected'
  });

  _.extend(StandardSearchResultsHeaderView.prototype, ViewEventsPropagationMixin);
  return StandardSearchResultsHeaderView;
});