/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base', 'csui/utils/url',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/utils/contexts/factories/search.results.factory',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/widgets/search.results/impl/search.results.header.view',
  'csui/widgets/search.results/impl/standard/standard.search.results.view',
  'csui/widgets/search.results/impl/tabular/tabular.search.results.view',
  'csui/controls/table/table.view',
  'csui/controls/table/rows/description/search.description.view',
  'csui/models/widget/search.results/search.metadata/search.columns',
  'csui/models/nodechildrencolumn',
  'csui/controls/table.rowselection.toolbar/table.rowselection.toolbar.view',
  'csui/controls/pagination/nodespagination.view',
  'csui/controls/progressblocker/blocker',
  'csui/widgets/search.results/toolbaritems',
  'csui/widgets/search.results/toolbaritems.masks',
  'csui/widgets/search.custom/impl/search.object.view',
  'csui/utils/contexts/factories/search.settings.factory',
  'csui/controls/globalmessage/globalmessage',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'csui/controls/tableactionbar/tableactionbar.view',
  'csui/utils/contexts/factories/search.results.facets.factory',
  'csui/models/node/node.model',
  'csui/models/nodes',
  'csui/utils/commands/properties',
  'csui/utils/contexts/factories/user',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/utils/contexts/factories/search.metadata.factory',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/toolbar/toolbar.command.controller',
  'hbs!csui/widgets/search.results/impl/search.results',
  'csui/utils/defaultactionitems',
  'csui/utils/commands',
  'csui/utils/namedlocalstorage',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/facet.panel/facet.panel.view',
  'csui/controls/facet.bar/facet.bar.view',
  'csui/utils/accessibility',
  'csui/lib/handlebars.helpers.xif',
  'css!csui/widgets/search.results/impl/search.results',
  'csui/lib/jquery.mousehover',
  'csui/lib/jquery.redraw'
], function (module, _, $, Backbone, Marionette, base, Url, SearchQueryModelFactory,
    SearchResultsCollectionFactory, LayoutViewEventsPropagationMixin, HeaderView,
    StandardSearchResultsView, TabularSearchResultsView,
    TableView, DescriptionRowView, tableColumns,
    NodeChildrenColumnModel, TableRowSelectionToolbarView, PaginationView,
    BlockingView, toolbarItems, ToolbarItemsMasks,
    SearchObjectView, SearchSettingsFactory,
    GlobalMessage, lang, TableActionBarView, SearchResultFacetCollectionFactory, NodeModel, NodeCollection,
    PropertiesCommand, UserModelFactory, DefaultActionBehavior, SearchMetadataFactory, PerfectScrollingBehavior,
    ToolbarCommandController, layoutTemplate, defaultActionItems,
    commands, NamedLocalStorage, ModalAlert, FacetPanelView, FacetBarView, Accessibility) {
  'use strict';

  var accessibleTable = Accessibility.isAccessibleTable(),
      STANDARD_VIEW = 'StandardView',
      TABULAR_VIEW = 'TabularView';

  var config = _.extend({
    enableFacetFilter: true, // LPAD-60082: Enable/disable facets
    enableBreadcrumb: true,
    enableSearchSettings: true, // global enable/disable search settings, but LPAD 81034 ctor can overrule
    showInlineActionBarOnHover: !accessibleTable,
    forceInlineActionBarOnClick: false,
    inlineActionBarStyle: "csui-table-actionbar-bubble"
  }, module.config());

  var SearchResultsView = Marionette.LayoutView.extend({

    className: 'csui-search-results binf-panel binf-panel-default',
    template: layoutTemplate,
    templateHelpers: function () {
      var messages = {
        customSearchTab: lang.customSearchTab,
        searchFilterTab: lang.searchFilterTab,
        enableCustomSearch: this.enableCustomSearch
      };
      return {
        messages: messages,
        enableCustomSearch: this.enableCustomSearch,
        loadingMessage: lang.loadingSearchResultMessage,
        showFacetPanel: this.options.showFacetPanel !== false
      };
    },

    ui: {
      toolBarContainer: '.csui-search-tool-container',
      customSearchContainer: '.csui-search-results-custom',
      facetView: '#facetview',
      customViewTab: '.csui-search-custom-tab',
      facetViewTab: '.csui-search-facet-tab',
      searchResultsContent: '.csui-search-results-content',
      searchResultsBody: ".csui-search-results-body",
      searchSidePanel: ".csui-search-left-panel",
      loadingEle: '.csui-search-loading-wrapper'
    },

    events: {
      'click @ui.customViewTab': 'openCustomView',
      'click @ui.facetViewTab': 'openFacetView',
      'keypress @ui.customViewTab': 'openCustomView',
      'keypress @ui.facetViewTab': 'openFacetView',
      'mouseup @ui.toggleDetails': 'onToggleOrChangePageSize',
      'keypress @ui.toggleDetails': 'onToggleOrChangePageSize',
      'mouseup .csui-paging-navbar > ul > li:not(.csui-overflow) > a': 'onChangePage',
      'keypress .csui-paging-navbar > ul > li:not(.csui-overflow) > a': 'onChangePage',
      'mouseup .csui-pagesize-menu ul.csui-dropdown-list a': 'onToggleOrChangePageSize',
      'keypress .csui-pagesize-menu ul.csui-dropdown-list a': 'onToggleOrChangePageSize',
      'click': 'stopClosingSearchBox'
    },

    regions: {
      headerRegion: '#header',
      resultsRegion: '#results',
      paginationRegion: '#pagination',
      standardHeaderRegion: '#csui-standard-header-view',
      customSearchRegion: '#csui-search-custom-container',
      facetBarRegion: '#facetbarview',
      facetRegion: '#facetview',
      tableRowSelectionToolbarRegion: '.csui-table-rowselection-toolbar'
    },

    behaviors: {

      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.csui-result-list',
        suppressScrollX: true,
        scrollYMarginOffset: 15
      },
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }

    },

    namedLocalStorage: new NamedLocalStorage('PrevSearchDisplayStyle'),

    getPageSize: function() {
      var pageSize = this.namedLocalStorage.get(
          this._createSearchDisplayStyleKey() + '_PrevSRPageSize');
      return pageSize || 10;
    },

    constructor: function SearchResultsView(options) {
      options || (options = {});
      this.context = options.context;
      options.pageSize = this.getPageSize();
      options.data || (options.data = {});

      options.toolbarItems || (options.toolbarItems = toolbarItems);
      options.toolbarItemsMasks || (options.toolbarItemsMasks = new ToolbarItemsMasks());
      this.context = options.context;

      if (!options.query) {
        options.query = this.context.getModel(SearchQueryModelFactory);
      }

      if (options.collection) {
        if (!options.collection.fetched) {
          this._originalScope = options.collection.getResourceScope();
        }
      } else {
        options.collection = this.context.getModel(SearchResultsCollectionFactory, options);
      }

      var doLoadSearchSettings = (options.enableSearchSettings !== undefined) ?
                                 options.enableSearchSettings : config.enableSearchSettings;

      if (doLoadSearchSettings) {
        var templateId = options.query ? options.query.get("query_id") : undefined;
        this.loadSearchSettings(templateId);
      }

      if (!options.collection.fetched) {
        options.collection.setResourceScope(
            SearchResultsCollectionFactory.getDefaultResourceScope());
        options.collection.setDefaultActionCommands(
            defaultActionItems.getAllCommandSignatures(commands));
        options.collection.setEnabledDelayRestCommands(true);
        if (options.collection.delayedActions) {
          this.listenTo(options.collection.delayedActions, 'error',
              function (collection, request, options) {
                var error = new base.Error(request);
                GlobalMessage.showMessage('error', error.message);
              });
        }
      }

      options.collection.isSortOptionSelected = true;

      Marionette.LayoutView.prototype.constructor.call(this, options);


      this.collection.selectedItems = new Backbone.Collection();
      this.metadata = options.metadata ||
                      this.context.getCollection(SearchMetadataFactory, options);
      this.query = options.query;

      this.collection.setLimit(0, options.pageSize, false);

      this._toggleCustomSearch();

      this.commandController = new ToolbarCommandController({commands: commands});
      this.listenTo(this.commandController, 'before:execute:command', this._beforeExecuteCommand);
      this.listenTo(this.commandController, 'after:execute:command', this._toolbarCommandExecuted);

      var PrevSearchDisplayStyle = this.namedLocalStorage.get(this._createSearchDisplayStyleKey());
      this.collection.prevSearchDisplayStyle = PrevSearchDisplayStyle || STANDARD_VIEW;

      this.setSearchHeader();
      var self = this;
      this.listenTo(this.headerView, "go:back", function () {
        self.trigger("go:back");
      });

      this.tableColumns = options.tableColumns ? options.tableColumns : tableColumns.deepClone();

      this.listenTo(this.headerView, "toggle:filter", this._completeFilterCommand);

      this.listenTo(this.headerView, "focus:filter", this._focusFilter);

      this.listenTo(this.headerView, "reload:searchForm", this._resetTargetView);
      this.listenTo(this.headerView, "render:table", _.bind(function () {
        this.columns = this.collection.searching && this.collection.searching.sortedColumns;
        this.getAdditionalColumns();
         this.trigger('render:table');
      }, this));

      this.listenTo(this.headerView, 'toggle:description', function (args) {
        this.trigger('toggle:description', args.showDescriptions);
      });
      if (!options.collection.searchFacets) {
        options.collection.searchFacets = this.context.getModel(SearchResultFacetCollectionFactory,
            {
              options: {
                query: this.options.query,
                topCount: 1
              },
              detached: true
            });
      }

      this.facetFilters = options.collection.searchFacets;

      if (this.enableCustomSearch) {
        this.setCustomSearchView();
        this.listenTo(this.customSearchView, "change:title", this.updateHeaderTitle);
      }
      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }

      this.listenTo(this.settings, 'sync', _.bind(function () {
        var isLocationColumnAvailable = false,
            selectedSettings          = false;

        if (this.settings &&
            this.settings.get("display")) {
          if (this.settings.get("display").display_regions &&
              this.settings.get("display").display_regions.selected) {
            isLocationColumnAvailable = _.findIndex(
                this.settings.get("display").display_regions.selected.models,
                function (column, index) {
                  return column.get("key") === 'OTLocation';
                });
          }

          selectedSettings = this.settings.get("display").summary_description &&
                             this.settings.get("display").summary_description.selected;

        }
        this.collection.isLocationColumnAvailable = isLocationColumnAvailable > -1;
        this.collection.selectedSettings = selectedSettings;
      }, this));

      this.listenTo(this.collection, 'sync', function () {
        if (!this.enableCustomSearch) {
          this.$el.parents(".search-results-container").addClass("csui-global-search");
        }
      });
      this.listenTo(this.query, 'change', function () {
        if (this.query.get('forcePerspectiveChange')) {
          return;
        }
        this.collection.isSortOptionSelected = true;
        this._updatePanels();
        if (doLoadSearchSettings) {
          var templateId = this.query ? this.query.get("query_id") : undefined;
          this.loadSearchSettings(templateId);
        }
        if (this.collection.isFetchable()) {
          var fetchFacets = config.csui && config.csui.fetchFacets;
          this.facetFilters.clearFilter(fetchFacets);
          this.facetFilters.fetched = false;
          this.paginationView.nodeChange();
          this.collection.fetch({
            error: _.bind(this.onSearchResultsFailed, this, options)
          });
          this.trigger('query:changed');
          this.resetScrollToTop();
        }
        this.collection.selectedItems.reset([]);
      });

      this.listenTo(this.options.context, 'request', this.blockActions)
          .listenTo(this.options.context, 'sync', this._persistState)
          .listenTo(this.options.context, 'error', this.unblockActions)
          .listenTo(this.collection, "request", this.executePreProcess)
          .listenTo(this.collection, "error", this.unblockActions)
          .listenTo(this.collection, "destroy", this.unblockActions)
          .listenTo(this.collection, "new:page", this.resetScrollToTop);

      var prevPageSize = this.namedLocalStorage && this.namedLocalStorage.get(
            this._createSearchDisplayStyleKey() + '_PrevSRPageSize');
      this.options.pageSize = (prevPageSize) ? prevPageSize : 10;

      this.setPagination();

      this.listenTo(this.collection, 'sync', this.executeEndProcess);
      this.listenTo(this, 'target:view:changed', this.executeEndProcess);

      !base.isMozilla() && this.propagateEventsToRegions();
      this.onWinRefresh = _.bind(this.windowRefresh, this);
      $(window).on("resize.app", this.onWinRefresh);
      if (this.enableCustomSearch) {
        this.listenToOnce(this, 'dom:refresh', _.bind(function () {
          if (this.$el.width() > 1023) {
            this.ui.searchSidePanel.addClass('csui-is-visible');
            this.ui.searchResultsBody.addClass('csui-search-results-body-right');
          } else {
            this.ui.searchSidePanel.addClass("search-side-panel-overlay");
            this.ui.searchSidePanel.addClass("search-side-panel-auto");
          }
        }, this));
      }
    },

    executePreProcess: function () {
        if (this.$el.is(':visible')) {
      var completeArea = this.el,
          resultsArea  = completeArea.getElementsByClassName('csui-result-list')[0];
      if (resultsArea.getBoundingClientRect().left !== completeArea.getBoundingClientRect().left) {
        this.ui.loadingEle.addClass('csui-side-panel-exists');
      }
      this.ui.loadingEle.removeClass('binf-hidden');
      }
      this.blockActions();
    },

    executeEndProcess: function () {
      if (!this.targetView) {
        this.setTargetView();

        this.paginationRegion.show(this.paginationView);
        this.targetView.trigger('set:inline:actionbar:events');
        this._setFacetBarView();
        if (this.facetBarView && this.options.showFacetPanel !== false) {
          this.facetBarRegion.show(this.facetBarView);
        }
        this.correctFilterAria();
      }

      if (this.collection.length) {
        this.trigger('render:metadata');
        this.columns = this.collection.searching && this.collection.searching.sortedColumns;
        this.getAdditionalColumns();
        this.targetView.trigger('set:tablerow:assets');
        if(!!this.collection.settings_changed && this.collection.prevSearchDisplayStyle === 'TabularView') {
          this.trigger('render:table');
          this.collection.settings_changed = false;
        }
      }

      this.updateActionToolBar();
      this.updateScrollbar();
      this.unblockSearchResultsActions();
    },

    unblockSearchResultsActions: function () {
      this.ui.loadingEle.removeClass('csui-side-panel-exists');
      this.ui.loadingEle.addClass('binf-hidden');
      this.unblockActions();
    },

    collectionEvents: {'reset': 'updateLayoutView'},

    updateLayoutView: function () {
      var prevPageSize = this.namedLocalStorage && this.namedLocalStorage.get(
              this._createSearchDisplayStyleKey() + '_PrevSRPageSize');
      prevPageSize = (prevPageSize) ? prevPageSize : 10;
      this.paginationView.options.pageSize = prevPageSize;
      this.paginationView.selectedPageSize = prevPageSize;
    },

    stopClosingSearchBox: function (event) {
      if ($(event.target).closest('.binf-dropdown').length
          || $(event.target).hasClass('binf-dropdown')
          || $(event.target).hasClass('arrow_back')) {
        return;
      }
      event.stopPropagation();
    },

    setPagination: function () {
      this.paginationView = new PaginationView({
        collection: this.collection,
        pageSize: this.options.pageSize,
        defaultDDList: [10, 25, 50, 100] // LPAD-48290, to make consistent with classic console
      });

      this.listenTo(this.paginationView, 'pagesize:updated', function (paginationView) {
        this.paginationView.pageSize = paginationView.pageSize;
        this.namedLocalStorage.set(this._createSearchDisplayStyleKey() + '_PrevSRPageSize',
            this.paginationView.pageSize);
      });
      return true;
    },

    onToggleOrChangePageSize: function (event) {
      if ((event.type === 'keypress' && (event.keyCode === 13 || event.keyCode === 32)) ||
          (event.type === 'mouseup')) {
        this.collection.isSortOptionSelected = true;
      }
    },

    onChangePage: function (event) {
      var targetPageTab = $(event.currentTarget),
          pageNum       = parseInt(targetPageTab.attr('data-pageid'), 10);
      if (pageNum + 1 !== this.paginationView.currentPageNum) {
        this.onToggleOrChangePageSize(event);
      }
    },
    _persistState: function () {
      this.unblockActions();
    },

    loadSearchSettings: function (templateId) {
      this.options.templateId = templateId;
      if (this.settings && this.settings.options) {
        this.settings.options.templateId = templateId;
      }
      this.settings = this.options.settings ||
                      this.context.getCollection(SearchSettingsFactory, this.options);
      this.settings.fetch();
    },

    _createSearchDisplayStyleKey: function () {

      var context = this.context || (this.options && this.options.context),
          srcUrl  = new Url().getAbsolute(),
          userID  = context && context.getModel(UserModelFactory).get('id'), hostname;
      if (srcUrl) {
        hostname = srcUrl.split('//')[1].split('/')[0].split(':')[0];
      }

      return hostname + userID;

    },

    setTargetView: function() {
      this.columns = this.collection.searching && this.collection.searching.sortedColumns;
      if (accessibleTable) {
        this.getAdditionalColumns();
      }
      this.collection.columns = (this.columns) ? this.columns : this.tableColumns;
      if (this.settings && this.settings.get('display')) {
        var selectedSummary = this.settings.get('display').summary_description.selected;
        this.showSummaryOnly = (selectedSummary === 'SO') ? true : false;
      }

      var currentTemplate = this.collection.prevSearchDisplayStyle;

      if (currentTemplate === TABULAR_VIEW) {
        this.ui.toolBarContainer.addClass('binf-hidden');
        this.targetView = this.setTabularSearchView();
        this.targetView.trigger('set:tablerow:assets');
      } else {
        this.ui.toolBarContainer.removeClass('binf-hidden');
        this.targetView = this.setStandardSearchView();
      }

      this.resultsRegion.show(this.targetView, this);
      if (currentTemplate === STANDARD_VIEW) {
        this.standardHeaderRegion.show(this.targetView.standardHeaderView);
        this.targetView.standardHeaderView._removeAllSelections();
      } else {
        this.trigger('toggle:description', this.headerView.showDescription);
      }

    },

    _resetTargetView: function() {
      this.targetView.trigger('destroy:header:view');
      this.targetView.destroy();
      this.targetView = undefined;
      this.resultsRegion.empty();

      this.setTargetView();
      this.executeEndProcess();
      this.resetScrollToTop();
    },



    setStandardSearchView: function() {
      var args = _.extend(this.options, {
        collection: this.collection,
        originatingView: this,
        headerEle: this.ui.toolBarContainer,
        context: this.context,
        metadata: this.metadata
      });
      return new StandardSearchResultsView(args);
    },

    setTabularSearchView: function() {
      var args = _.extend(this.options, {
        collection: this.collection,
        columns: this.columns,
        tableColumns: this.tableColumns,
        originatingView: this,
        container: this.container,
        defaultActionController: this.defaultActionController,
        config: config,
        customLabels: {
          emptyTableText: lang.noSearchResultMessage
        }
      });
      return new TabularSearchResultsView(args);
    },



    _focusFilter: function (view) {
      !!view && view.headerView.ui.filter.trigger('focus');
      this.correctFilterAria(view);
      var tabElements = this.facetView && this.facetView.$('.csui-facet');
      if (tabElements && tabElements.length) {
        tabElements.prop('tabindex', 0);
      }
    },
    correctFilterAria: function (view) {
      if (!!view && !!view.headerView) {
        if (this.ui.searchSidePanel.hasClass('csui-is-visible')) {
          view.headerView.ui.filter
              .attr("title", lang.filterCollapseTooltip)
              .addClass('icon-toolbarFilterCollapse')
              .attr("aria-label", lang.filterCollapseAria);
        } else {
          view.headerView.ui.filter
              .attr("title", lang.filterExpandTooltip)
              .removeClass('icon-toolbarFilterCollapse')
              .attr("aria-label", lang.filterExpandAria);
        }
      }
    },
    onSearchResultsFailed: function (model, request, message) {
      var error = new base.RequestErrorMessage(message);
      ModalAlert.showError(error.toString());
    },
    updateScrollbar: function () {
      this.triggerMethod('update:scrollbar', this);
    },

    resetScrollToTop: function () {
      var scrollContainer = this.$('#results');
      scrollContainer.scrollTop(0);
    },

    updateActionToolBar: function () {
      if (this.collection.length === 0) {
        this.ui.toolBarContainer.addClass('binf-hidden');
        if (!this.enableCustomSearch) {
          this.ui.customSearchContainer.addClass('binf-hidden');
        }
      } else if (this.collection.prevSearchDisplayStyle === "StandardView") {
        this.ui.toolBarContainer.removeClass('binf-hidden');
        this.ui.customSearchContainer.removeClass('binf-hidden');
      }
    },

    openVersionHistory: function (args) {
      var nodes = new NodeCollection();
      nodes.push(args.model);
      var status = {
        nodes: nodes,
        container: args.model.collection.node,
        collection: args.model.collection,
        selectedTab: new Backbone.Model({title: 'Versions'})
      };
      status = _.extend(status, {originatingView: this});
      var propertiesCmd = new PropertiesCommand();
      propertiesCmd.execute(status, this.options)
          .always(function (args) {
          });
    },

    onPropertiesViewDestroyed: function () {
      this.onMetadataNavigationViewDestroyed();
      var showDescription = this.namedLocalStorage.get(
          this._createSearchDisplayStyleKey() + '_showDescription');
      if (this.collection.prevSearchDisplayStyle === TABULAR_VIEW) {
        this.headerView.updateToggleDescription();
        this.tableView && this.tableView.render();
      }
      this.paginationView && this.paginationView.collectionChange();
    },

    onPermissionViewDestroyed: function () {
      this.onPropertiesViewDestroyed();
    },

    onMetadataNavigationViewDestroyed: function () {
      if (!!this.collection.inMetadataNavigationView && this.isTabularView) {
        this.collection.inMetadataNavigationView = false;
      }
    },

    _toggleCustomSearch: function () {
      this.enableCustomSearch = !!this.options.customSearchViewModel ||
                                !!this.options.customSearchView || this.query.get("query_id") &&
                                                                   Object.keys(
                                                                       this.query.attributes).length >
                                                                   1;
      if (this.enableCustomSearch) {
        this.$el.find("#csui-search-custom-container").addClass('csui-search-custom-container');
        this.$el.find("#csui-search-custom-results").addClass("csui-search-custom-results");
        this.$el.find(".csui-search-custom-tab").addClass('binf-active');
        this.$el.find(".csui-search-custom-tab > a").attr('aria-selected', 'true');
      } else {
        if (this.customSearchView && this.query.get("where")) {
          this.customSearchRegion.empty();
          this.$el.find("#csui-search-custom-container").removeClass(
              'csui-search-custom-container');
          this.$el.find("#csui-search-custom-results").removeClass("csui-search-custom-results");
        }
      }
    },

    _updatePanels: function () {
      this._toggleCustomSearch();
      if (!this.enableCustomSearch) {
        if (this.ui.searchSidePanel.hasClass('csui-is-visible')) {
          var view = this;
          this.ui.searchSidePanel.one(this._transitionEnd(),
              function () {
                view.$el.find(".csui-search-results-custom").addClass('binf-hidden');
                view.$el.find(".csui-search-left-panel-tabs").addClass('binf-hidden');
                if (!view.ui.searchSidePanel.hasClass('csui-is-visible')) {
                  view.ui.searchSidePanel.addClass('csui-is-hidden');
                }
                view.ui.facetView.removeClass('binf-hidden');
              });
          this.ui.searchResultsBody.removeClass("csui-search-results-body-right");
          this.ui.searchSidePanel.removeClass("csui-is-visible");
        } else {
          this.$el.find(".csui-search-results-custom").addClass('binf-hidden');
          this.$el.find(".csui-search-left-panel-tabs").addClass('binf-hidden');
          this.ui.facetView.removeClass('binf-hidden');
        }
      } else {
        this.$el.find(".csui-search-results-custom").removeClass('binf-hidden');
        this.$el.find(".csui-search-left-panel-tabs").removeClass('binf-hidden');
        this.ui.searchResultsBody.addClass("csui-search-results-body-right");
      }
      if (this.headerView) {
        this.headerView.options.useCustomTitle = this.enableCustomSearch;
      }
      if (this.facetView) {
        this.facetView.options.data.showTitle = !this.enableCustomSearch;
        this.facetView.render();
      }
    },

    openCustomView: function (e) {
      if (this.enableCustomSearch) {
        if ((e.type === 'keypress' && e.keyCode === 13) || (e.type === 'click')) {
          this.ui.facetView.addClass('binf-hidden');
          this.$el.find(".csui-search-results-custom").removeClass('binf-hidden');
          this.$el.find(".csui-search-facet-tab").removeClass('binf-active');
          this.$el.find(".csui-search-facet-tab > a").removeAttr('aria-selected');
          this.$el.find(".csui-search-custom-tab").addClass('binf-active');
          this.$el.find(".csui-search-custom-tab > a").attr('aria-selected', 'true');
          e.stopPropagation();
        }
      }
    },

    openFacetView: function (e) {
      if (this.enableCustomSearch) {
        this.facetFilters.ensureFetched();
        this._ensureFacetPanelViewDisplayed();
        if ((e.type === 'keypress' && e.keyCode === 13) || (e.type === 'click')) {
          this.$el.find(".csui-search-results-custom").addClass('binf-hidden');
          this.ui.facetView.removeClass('binf-hidden');
          this.$el.find(".csui-search-custom-tab").removeClass('binf-active');
          this.$el.find(".csui-search-custom-tab > a").removeAttr('aria-selected');
          this.$el.find(".csui-search-facet-tab").addClass('binf-active');
          this.$el.find(".csui-search-facet-tab > a").attr('aria-selected', 'true');
          e.stopPropagation();
          this.facetView.triggerMethod('dom:refresh');
        }
      }
    },

    onDestroy: function () {
      $(window).off("resize.app", this.onWinRefresh);
      if (this._originalScope) {
        this.options.collection.setResourceScope(this._originalScope);
      }
      this.tableView && this.tableView.destroy();
    },
    windowRefresh: function () {
      this.facetView && this.facetView.triggerMethod('dom:refresh');
      this.targetView && this.targetView.triggerMethod('dom:refresh');
      var panelPosition = this.ui.searchSidePanel.css("position");
      if (panelPosition != "absolute") {
        if (this.$el.width() > 1023 &&
            this.ui.searchSidePanel.hasClass("search-side-panel-overlay")) {
          this.ui.searchSidePanel.removeClass("search-side-panel-overlay");
          if (this.ui.searchSidePanel.hasClass("search-side-panel-auto")) {
            this.ui.searchSidePanel.removeClass("search-side-panel-auto");
            this._completeFilterCommand(this, true);
          }
        }
      } else if (!this.ui.searchSidePanel.hasClass("search-side-panel-auto") &&
                 !this.ui.searchSidePanel.hasClass("search-side-panel-overlay")) {
        this.ui.searchSidePanel.addClass("search-side-panel-overlay");
        if (this.ui.searchSidePanel.hasClass("csui-is-visible")) {
          this.ui.searchSidePanel.addClass("search-side-panel-auto");
          this._completeFilterCommand(this, true);
        }
      }
    },

    setSearchHeader: function () {
      var showSearchSettingsButton = (this.options.enableSearchSettings !== undefined) ?
                                     this.options.enableSearchSettings :
                                     config.enableSearchSettings;
      this.headerView = new HeaderView({
        collection: this.collection,
        filter: this.options.searchString,
        context: this.options.context,
        enableBackButton: this.options.enableBackButton,
        backButtonToolTip: this.options.backButtonToolTip,
        enableFacetFilter: config.enableFacetFilter, // LPAD-60082: Enable/disable facets
        useCustomTitle: this.enableCustomSearch,
        commands: commands,
        originatingView: this,
        titleView: this.options.titleView,
        localStorage: this.namedLocalStorage,
        enableSearchSettings: showSearchSettingsButton,
        settings: !!this.settings ? this.settings : false
      });
      return true;
    },


    getSettings: function() {
      return this.settings;
    },

    setCustomSearchView: function () {
      this.customSearchView = this.options.customSearchView || new SearchObjectView({
            context: this.options.context,
            savedSearchQueryId: this.query.get("query_id"),
            customValues: this.query,
            parentView: this,
            query: this.query,
            model: this.options.customSearchViewModel
          });
      return true;
    },

    getAdditionalColumns: function () {
      if (accessibleTable) {
        var selectedSettings = this.headerView && this.headerView.selectedSettings;
        selectedSettings = (selectedSettings) ? selectedSettings :
                           this.settings && this.settings.get(
                               'display').summary_description.selected;
        switch (selectedSettings) {
        case 'SD' :
        case 'SP' :
        case 'DP' :
        {
          if (this.tableView && !this.tableView.columns.findWhere({column_key: 'description'}) ||
              !this.columns.findWhere({column_key: 'description'})) {
            this.getDescriptionColumn();
          }
          if (this.tableView && !this.tableView.columns.findWhere({column_key: 'summary'}) ||
              !this.columns.findWhere({column_key: 'summary'})) {
            this.getSummaryColumn();
          }
          break;
        }
        case 'SO' :
        {
          this.removeDescriptionColumn();
          if (this.tableView && !this.tableView.columns.findWhere({column_key: 'summary'}) ||
              !this.columns.findWhere({column_key: 'summary'})) {
            this.getSummaryColumn();
          }
          break;
        }
        case 'DO' :
        {
          this.removeSummaryColumn();
          if (this.tableView && !this.tableView.columns.findWhere({column_key: 'description'}) ||
              !this.columns.findWhere({column_key: 'description'})) {
            this.getDescriptionColumn();
          }
          break;
        }
        case 'NONE' :
        {
          this.removeSummaryColumn();
          this.removeDescriptionColumn();
        }
        }
      }
    },

    getDescriptionColumn: function () {
      this.columns.push(new NodeChildrenColumnModel({
        column_key: 'description',
        name: lang.descriptionColumnTitle,
        sortable: false,
        permanentColumn: true,
        type: -1,
        definitions_order: 505
      }));
    },

    getSummaryColumn: function () {
      this.columns.push(new NodeChildrenColumnModel({
        column_key: 'summary',
        name: lang.summaryColumnTitle,
        sortable: false,
        permanentColumn: true,
        type: -1,
        definitions_order: 506
      }));
    },

    removeDescriptionColumn: function () {
      if (this.tableView && this.tableView.columns.findWhere({column_key: 'description'})) {
        this.tableView.columns.findWhere({column_key: 'description'}).destroy();
      }
    },

    removeSummaryColumn: function () {
      if (this.tableView && this.tableView.columns.findWhere({column_key: 'summary'})) {
        this.tableView.columns.findWhere({column_key: 'summary'}).destroy();
      }
    },

    _beforeExecuteCommand: function (args) {
      !!this.collection.selectedItems && this.collection.selectedItems.each(function (model) {
        model.collection = args.status.collection;
      });
      if (args.command && args.command.get('selfBlockOnly')) {
        args.status && args.status.toolItemView
        && args.status.toolItemView.$el.find('a').addClass('binf-disabled');
      }
    },
    _toolbarCommandExecuted: function (context) {
      if (context && context.commandSignature) {

        this.targetView && this.targetView.trigger('update:tool:items');
        if (!!context.command && !!context.command.allowCollectionRefetch &&
            this.collection.totalCount > this.collection.topCount) {
          this.collection.fetch();
        }
        if ((context.commandSignature === "Delete" || context.commandSignature === "Move") &&
            (this.collection.models.length === 0 || this.collection.totalCount < this.collection.topCount)) {
          if(context.commandSignature === "Move") {
            this.collection.selectedItems.remove(this.collection.selectedItems.models);
          }
          this.collection.trigger('sync');
        }
      }
    },

    _updateToolbarActions: function () {
      this.targetView && this.targetView.trigger('set:tablerow:assets');
    },

    _showInlineActionBar: function (args) {
      if (!!args) {
        this._savedHoverEnterArgs = null;

        var parentId = args.node.get('parent_id');
        if (parentId instanceof Object) {
          parentId = args.node.get('parent_id').id;
        }
        var parentNode = new NodeModel({id: parentId},
            {connector: args.node.connector});

        this.inlineToolbarView = new TableActionBarView(_.extend({
              context: this.options.context,
              commands: commands,
              delayedActions: this.collection.delayedActions,
              collection: this.options.toolbarItems.inlineToolbar || [],
              toolItemsMask: this.options.toolbarItemsMasks.toolbars.inlineToolbar,
              container: parentNode,
              containerCollection: this.collection,
              model: args.node,
              originatingView: this,
              notOccupiedSpace: 0
            }, this.options.toolbarItems.inlineToolbar &&
               this.options.toolbarItems.inlineToolbar.options)
        );

        this.listenTo(this.inlineToolbarView, 'after:execute:command',
            this._toolbarCommandExecuted);
        this.inlineToolbarView.render();
        this.listenTo(this.inlineToolbarView, 'destroy', function () {
          this.inlineToolbarView = undefined;
          if (this._savedHoverEnterArgs) {
            this._showInlineActionBarWithDelay(this._savedHoverEnterArgs);
          }
        }, this);
        $(args.target).append(this.inlineToolbarView.$el);
        this.inlineToolbarView.triggerMethod("show");
      }
    },

    _showInlineActionBarWithDelay: function (_view, args) {
      if (this._showInlineActionbarTimeout) {
        clearTimeout(this._showInlineActionbarTimeout);
      }
      var self = this;
      this._showInlineActionbarTimeout = setTimeout(function () {
        self._showInlineActionbarTimeout = undefined;
          self._showInlineActionBar.call(self, args);
      }, 200);
    },

    _actionBarShouldDestroy: function (_view, args) {
      if (this._showInlineActionbarTimeout) {
        clearTimeout(this._showInlineActionbarTimeout);
        this._showInlineActionbarTimeout = undefined;
      }
      if (this.inlineToolbarView) {
        this.inlineToolbarView.destroy();
      }
    },

    _destroyInlineActionBar: function () {
      if (this.inlineToolbarView) {
        this.inlineToolbarView.destroy();
        this.inlineToolbarView = undefined;
      }
    },

    onRender: function () {
      var self = this;
      this.headerRegion.show(this.headerView);



      if (this.enableCustomSearch) {
        this.customSearchRegion.show(this.customSearchView);
      }
      if (this.enableCustomSearch) {
        this.ui.facetView.addClass('binf-hidden');
        this.ui.searchSidePanel.removeClass('csui-is-hidden');
      } else {
        this.ui.searchSidePanel.removeClass('csui-is-visible');
        var view = this;
        this.ui.searchSidePanel.one(this._transitionEnd(),
            function () {
              if (!view.ui.searchSidePanel.hasClass('csui-is-visible')) {
                view.ui.searchSidePanel.addClass('csui-is-hidden');
              }
            });
      }
      this._toggleCustomSearch();
      this.$('.csui-result-list').on('scroll', function () {
        self.trigger('scroll');
      });
    },

    _ensureFacetPanelViewDisplayed: function () {
      if (this.facetView === undefined && this.options.showFacetPanel !== false) {
        this._setFacetPanelView();
        this.facetRegion.show(this.facetView);
      }
    },

    _setFacetPanelView: function () {
      this.facetView = new FacetPanelView({
        collection: this.facetFilters,
        blockingLocal: true,
        showTitle: !this.enableCustomSearch
      });
      this.listenTo(this.facetView, 'remove:filter', this._removeFacetFilter)
          .listenTo(this.facetView, 'remove:all', this._removeAll)
          .listenTo(this.facetView, 'apply:filter', this._checkSelectionAndApplyFilter);
    },

    _removeFacetPanelView: function () {
      this.facetRegion.empty();
      this.facetView = undefined;
    },

    _setFacetBarView: function () {
      this.facetBarView = new FacetBarView({
        collection: this.facetFilters
      });
      this.listenTo(this.facetBarView, 'remove:filter', this._removeFacetFilter)
          .listenTo(this.facetBarView, 'remove:all', this._removeAll)
          .listenTo(this.facetBarView, 'facet:bar:visible', this._handleFacetBarVisible)
          .listenTo(this.facetBarView, 'facet:bar:hidden', this._handleFacetBarHidden);
    },

    _checkSelectionAndApplyFilter: function (filter) {
      if (this.collection.selectedItems.length) {
        ModalAlert.confirmQuestion(
            _.str.sformat(lang.dialogTemplate, lang.dialogTitle), lang.dialogTitle, {})
            .done(_.bind(function () {
              this.collection.selectedItems.reset([]);
              this._addToFacetFilter(filter);
            }, this));
      }
      else {
        this._addToFacetFilter(filter);
      }
    },

    _addToFacetFilter: function (filter) {
      this.facetFilters.addFilter(filter, false);
      this.collection.setDefaultPageNum();
      this.collection.fetch({fetchFacets: true});
      this.resetScrollToTop();
    },

    _removeFacetFilter: function (filter) {
      this.facetFilters.removeFilter(filter, false);
      this.collection.setDefaultPageNum();
      this.collection.fetch({fetchFacets: true});
      this.resetScrollToTop();
    },

    _removeAll: function () {
      this.facetFilters.clearFilter(false);
      this.collection.setDefaultPageNum();
      this.collection.fetch({fetchFacets: true});
      this.resetScrollToTop();
    },

    _completeFilterCommand: function (view, flag) {
      var panelPosition = view.ui.searchSidePanel.css("position"),
          self          = this;
      if (panelPosition === "absolute" && flag === undefined) {
        view.ui.searchSidePanel.removeClass("search-side-panel-auto");
        view.ui.searchSidePanel.addClass("search-side-panel-overlay");
      }
      view.showSidePanel = !view.ui.searchSidePanel.hasClass("csui-is-visible");
      if (view.showSidePanel) {
        view.facetFilters.ensureFetched();
        view._ensureFacetPanelViewDisplayed();
        view.ui.searchSidePanel.removeClass('csui-is-hidden');
        view.ui.searchSidePanel.one(view._transitionEnd(),
            function () {
              if (base.isMSBrowser()) {
                if (view.ui.searchSidePanel.hasClass('csui-is-visible')) {
                  view.ui.searchResultsBody.addClass('csui-search-results-body-right');
                }
              }
              view.triggerMethod('dom:refresh');
              if (view.paginationView) {
                view.paginationView.triggerMethod('dom:refresh');
              }
              self.targetView && self.targetView.triggerMethod("dom:refresh");
              view.facetView.triggerMethod('dom:refresh');
              self.targetView.trigger('facet:opened', true);
            }).addClass('csui-is-visible');
        if (!base.isMSBrowser()) {
          if (view.ui.searchSidePanel.hasClass('csui-is-visible')) {
            view.ui.searchResultsBody.addClass('csui-search-results-body-right');
          }
        }
      } else {
        view.ui.searchSidePanel.one(view._transitionEnd(),
            function () {
              if (!view.ui.searchSidePanel.hasClass('csui-is-visible')) {
                view.ui.searchSidePanel.addClass('csui-is-hidden');
              }
              view.triggerMethod('dom:refresh');
              view._removeFacetPanelView();
              if (view.paginationView) {
                view.paginationView.triggerMethod('dom:refresh');
              }
              self.targetView && self.targetView.triggerMethod("dom:refresh");
              self.headerView.currentlyFocusedElement();
              self.headerView.trigger('focus:filter', self);
              self.targetView.trigger('facet:opened', false);
            }).removeClass('csui-is-visible');
        view.ui.searchResultsBody.removeClass('csui-search-results-body-right');
      }
      this.facetView && this.facetView.triggerMethod('dom:refresh');
      this.listenTo(this.facetView, 'dom:refresh', function () {
        this.headerView.currentlyFocusedElement();
        this.headerView.trigger('focus:filter', this);
      });
    },
    _transitionEnd: _.once(
        function () {
          var transitions = {
                transition: 'transitionend',
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend'
              },
              element     = document.createElement('div'),
              transition;
          for (transition in transitions) {
            if (typeof element.style[transition] !== 'undefined') {
              return transitions[transition];
            }
          }
        }
    ),

    updateHeaderTitle: function () {
      this.headerView.setCustomSearchTitle(this.options.title);
    },

    _handleFacetBarVisible: function () {
      this.ui.searchResultsContent.addClass('csui-facetbarviewOpened');
      this.ui.searchResultsContent.find(".csui-facet-list-bar .csui-facet-item:last a").trigger(
          'focus');
    },

    _handleFacetBarHidden: function () {
      this.ui.searchResultsContent.removeClass('csui-facetbarviewOpened');
      this.headerView.trigger("refresh:tabindexes");
    }
  }, {
    RowStatesSelectedRows: 'selected'
  });

  _.extend(SearchResultsView.prototype, LayoutViewEventsPropagationMixin);

  return SearchResultsView;
});