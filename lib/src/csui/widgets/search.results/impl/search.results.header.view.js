/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/url', 'csui/utils/base',
  'csui/utils/contexts/factories/previous.node',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/namedsessionstorage',
  'csui/models/nodes',
  'csui/utils/contexts/factories/user',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/utils/accessibility',
  'csui/pages/start/perspective.routing',
  'csui/controls/settings/settings.view',
  'csui/controls/globalmessage/globalmessage',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/widgets/search.results/controls/sorting/sort.menu.view',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'hbs!csui/widgets/search.results/impl/search.results.header',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/widgets/search.results/impl/search.results.header.title.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/themes/carbonfiber/svg_sprites/symbol/sprite',
  'css!csui/widgets/search.results/impl/search.results'
], function (_, $, Backbone, Marionette, Url, base, PreviousNodeModelFactory, NextNodeModelFactory,
    NamedSessionStorage, NodeCollection, UserModelFactory, SearchQueryModelFactory, Accessibility,
    PerspectiveRouting, SettingsView, GlobalMessage, TabableRegionBehavior, SortingView, lang,
    headerTemplate, ApplicationScopeModelFactory, TitleView, ViewEventsPropagationMixin, sprite) {
  "use strict";
  var accessibleTable = Accessibility.isAccessibleTable(),
      searchSortingRegion;
  var SearchHeaderView = Marionette.LayoutView.extend({
    className: "csui-search-results-header",
    template: headerTemplate,
    templateHelpers: function () {
      var messages = {
        searchResults: lang.searchResults,
        clearAll: lang.clearAll,
        about: lang.about,
        searchBackTooltip: lang.searchBackTooltip,
        searchFilterTooltip: lang.filterExpandTooltip,
        filterAria: lang.filterExpandAria,
        enableSearchFilter: this.options.enableFacetFilter,
        tabularViewIconTitle: lang.tabularSearchView,
        descriptionTitle: lang.showDescription,
        showSettings: !!this.options.enableSearchSettings,
        settingsLabel: lang.searchSettings,
        tabularSearchView: this.collection.prevSearchDisplayStyle === "TabularView"
      };
      return {
        spritePath: sprite.getSpritePath(),
        messages: messages
      };
    },

    ui: {
      back: '.cs-go-back',
      parent: '.csui-search-arrow-back-parent',
      filter: '.csui-search-filter',
      filterParent: '.csui-search-facet-filter-parent',
      resultTitle: '.csui-results-title',
      searchHeaderTitle: '.csui-search-header-title',
      settingsMenu: '.csui-search-settings',
      toggleResultsView: '.csui-tabular-view',
      toggleDescription: '.icon-description-toggle'
    },

    events: {
      'click @ui.back': 'onClickBack',
      'click @ui.parent': 'onClickBack',
      'keypress @ui.back': 'onClickBack',
      'click @ui.filter': 'onClickFilter',
      'keypress @ui.filter': 'onClickFilter',
      'click @ui.filterParent': 'onClickFilter',
      'click @ui.settingsMenu': '_createSettingsDropdown',
      'keydown @ui.settingsMenu': 'showSettingsDropdown',
      'click @ui.toggleResultsView': 'toggleView',
      'keypress @ui.toggleResultsView': 'toggleView',
      'click @ui.toggleDescription': 'onToggleDescriptionClick',
      'keypress @ui.toggleDescription': 'onToggleDescriptionClick'
    },

    regions: {
      settingsRegion: '.csui-settings-dropdown'
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function (event) {
      var tabElements = this.$('*[tabindex]');
      if (tabElements.length) {
        tabElements.prop('tabindex', 0);
      }
      if (!!event && event.shiftKey) {
        return $(tabElements[tabElements.length - 1]);
      } else {
        return $(tabElements[0]).hasClass('csui-acc-focusable-active') ? this.ui.filter :
               $(tabElements[0]);
      }
    },
    namedSessionStorage: new NamedSessionStorage(),
    constructor: function SearchHeaderView(options) {
      options || (options = {});
      this.localStorage = options && options.localStorage;
      Marionette.LayoutView.prototype.constructor.call(this, options); // apply (modified)
      if (this.collection) {
        this.listenTo(this.collection, 'reset',
            this.updateHeader) // render after reset of collection
            .listenTo(this.collection, 'remove', this._collectionItemRemoved);
      }
      this.previousNode = options.context.getModel(PreviousNodeModelFactory).clone();
      this.nextNode = options.context.getModel(NextNodeModelFactory);
      this.searchQuery = options.context.getModel(SearchQueryModelFactory);
      this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);
      this.context = options.context;
      if (this.applicationScope.previous('id') === "" || this._isPreviousRouter("Landing")) {
        if (this.namedSessionStorage && this.namedSessionStorage.get("previousNodeId")) {
          this.namedSessionStorage.remove("previousNodeName");
          this.namedSessionStorage.remove("previousNodeId");
        }
      }
      if (this.localStorage.storage.getItem('PrevSearchDisplayStyle')) {
        this.showDescription = this.localStorage.get(
            this._createSearchDisplayStyleKey() + '_showDescription');
      }
    },

    initialize: function () {
      this.titleView = this.options.titleView || new TitleView({});
    },

    updateHeader: function () {
      this.renderTitleView();
      if (this.collection && this.collection.length) {
        this.ui.back.addClass('search_results_data');
        this.ui.filter.addClass('search_results_data');
        this.ui.toggleResultsView.removeClass("binf-hidden");
      } else {
        this.ui.back.addClass('search_results_nodata');
        this.ui.filter.addClass('search_results_nodata');
        this.ui.toggleResultsView.addClass("binf-hidden");
      }
      this.updateToggleIcon();
      this.updateToggleDescriptionIcon();
      this.updateToggleDescription();
      if (this.collection.prevSearchDisplayStyle === "TabularView") {
        this._createSortRegion();
        this._createSortingView();
      }
    },

    updateToggleDescriptionIcon: function () {
      if (this.collection.prevSearchDisplayStyle === "TabularView") {
        this.$el.find('.icon-description-toggle').removeClass(
            'search-settings-none');
        this.$el.find('.icon-description-toggle').removeClass(
            'binf-hidden');
        if (this.showDescription) {
          this.$el.find('.icon-description-toggle').attr("title",
              lang.hideDescription);
          this.$el.find('.icon-description-toggle').attr("aria-label",
              lang.hideDescription);
        } else {
          this.$el.find('.icon-description-toggle').attr("title",
              lang.showDescription);
          this.$el.find('.icon-description-toggle').attr("aria-label",
              lang.showDescription);
        }
      } else {
        this.$el.find('.icon-description-toggle').addClass(
            'binf-hidden');
        this.$el.find('.icon-description-toggle').removeClass(
            'icon-description-shown');
      }
    },

    updateToggleDescription: function () {
      if (this.options.originatingView &&
          this.options.originatingView.collection.prevSearchDisplayStyle === "TabularView") {
        if (accessibleTable && this.options.originatingView.targetView) {
          this.options.originatingView.getAdditionalColumns();
        } else {
          var descriptiveItems = this.options.originatingView.collection.filter(
              function (model) { return model.get('description') }),
              summaryItems = this.options.originatingView.collection.filter(
                  function (model) { return model.get('summary') }),
              showDescriptionFlag = this.localStorage.get(
                  this._createSearchDisplayStyleKey() + '_showDescription');
          this.selectedSettings = (this.selectedSettings) ? this.selectedSettings :
                                  this.collection.selectedSettings;
          switch (this.selectedSettings) {
          case 'DO': {
            if (descriptiveItems.length) {
              this.$el.find('.icon-description-toggle').removeClass('binf-hidden');
              this.trigger('toggle:description', {showDescriptions: showDescriptionFlag});
              if (showDescriptionFlag) {
                this.$el.find('.icon-description-toggle').removeClass(
                    'icon-description-hidden')
                    .addClass('icon-description-shown');
                this.$el.find('.csui-description-collapsed').removeClass(
                    'csui-description-collapsed');
              }
            } else if (!this.$el.find('.icon-description-toggle').hasClass('binf-hidden')) {
              this.$el.find('.icon-description-toggle').addClass('binf-hidden');
              this.trigger('toggle:description', {showDescriptions: false});
              this.options.originatingView && this.options.originatingView.targetView &&
              this.options.originatingView.targetView.$el.find('.cs-description').addClass(
                  'csui-description-collapsed');
            }
            break;
          }
          case 'SP':
          case 'DP':
          case 'SD': {
            if (descriptiveItems.length || summaryItems.length) {
              this.$el.find('.icon-description-toggle').removeClass('binf-hidden');
              this.trigger('toggle:description', {showDescriptions: showDescriptionFlag});
              if (showDescriptionFlag) {
                this.$el.find('.icon-description-toggle').removeClass(
                    'icon-description-hidden')
                    .addClass('icon-description-shown');
                this.$el.find('.csui-description-collapsed').removeClass(
                    'csui-description-collapsed');
              }
            } else if (!this.$el.find('.icon-description-toggle').hasClass('binf-hidden')) {
              this.$el.find('.icon-description-toggle').addClass('binf-hidden');
              this.trigger('toggle:description', {showDescriptions: false});
              this.options.originatingView && this.options.originatingView.targetView &&
              this.options.originatingView.targetView.$el.find('.cs-description').addClass(
                  'csui-description-collapsed');
            }
            break;
          }
          case 'SO': {
            if (summaryItems.length) {
              this.$el.find('.icon-description-toggle').removeClass('binf-hidden');
              this.trigger('toggle:description', {showDescriptions: showDescriptionFlag});
              if (showDescriptionFlag) {
                this.$el.find('.icon-description-toggle').removeClass(
                    'icon-description-hidden')
                    .addClass('icon-description-shown');
                this.$el.find('.csui-description-collapsed').removeClass(
                    'csui-description-collapsed');
              }
            } else if (!this.$el.find('.icon-description-toggle').hasClass('binf-hidden')) {
              this.$el.find('.icon-description-toggle').addClass('binf-hidden');
              this.trigger('toggle:description', {showDescriptions: false});
              this.options.originatingView && this.options.originatingView.targetView &&
              this.options.originatingView.targetView.$el.find('.cs-description').addClass(
                  'csui-description-collapsed');
            }
            break;
          }
          case 'NONE': {
            this.$el.find('.icon-description-toggle').addClass('search-settings-none');
            this.options.originatingView && this.options.originatingView.targetView &&
            this.options.originatingView.targetView.$el.find('.cs-description').addClass(
                'csui-description-collapsed');
            this.trigger('toggle:description', {showDescriptions: false});
            break;
          }
          }
        }
      }
    },
    onRender: function () {
      this.renderTitleView();
      if (this.collection && this.collection.length) {
        this.ui.back.addClass('search_results_data');
        this.ui.filter.addClass('search_results_data');
        this.ui.toggleResultsView.removeClass("binf-hidden");
      } else {
        this.ui.back.addClass('search_results_nodata');
        this.ui.filter.addClass('search_results_nodata');
        this.ui.toggleResultsView.addClass("binf-hidden");
      }

      this.rendered = true;
      this.$el.show();
      if (this.options.enableBackButton) {
        this.ui.back.attr('title', this.options.backButtonToolTip);
        this.ui.back.attr('aria-label', this.options.backButtonToolTip);
      } else if (PerspectiveRouting.getInstance(this.options).hasRouted() || history.state ||
                 this._isViewStateModelEnabled() ||
                 this.previousNode.get('id') ||
                 (!!this.namedSessionStorage && this.namedSessionStorage.get("previousNodeId")) ||
                 this._isPreviousRouter("Metadata")) {
        this._setBackButtonTitle();
      } else {
        this.ui.back.hide();
        this.ui.parent.hide();
      }
      if (!this.tableRowSelectionToolbarRegion) {

        this._createToolbarRegion();

        this.options.originatingView._updateToolbarActions();
      }
    },

    renderTitleView: function () {
      _.extend(this.titleView.options, {
        count: this.collection && this.collection.totalCount,
        useCustomTitle: !!this.options.useCustomTitle,
        searchHeaderTitle: this.collection && this.collection.searching ?
                           this.collection.searching.result_title : lang.searchResults
      });

      this.titleView.render();
      Marionette.triggerMethodOn(this.titleView, 'before:show', this.titleView, this);
      this.ui.searchHeaderTitle.append(this.titleView.el);
      Marionette.triggerMethodOn(this.titleView, 'show', this.titleView, this);
    },

    onBeforeDestroy: function () {
      this.titleView.destroy();
    },

    showSettingsDropdown: function (event) {
      var keyCode = event.keyCode;
      if (keyCode === 13 || keyCode === 32) {
        this._createSettingsDropdown(event);
        event.preventDefault();
        event.stopPropagation();
      }
    },

    _createSettingsDropdown: function (event) {
      var eventTarget = event.target;
      if (!eventTarget.classList.contains('csui-search-settings')) {
        return; // event bubbled from dropdown to toolbar item => ignore it
      }
      if (!this.settingsView || (this.settingsView && this.settingsView.isDestroyed())) {
        $(document).on('mouseup.dropdown' + this.cid, _.bind(this._closeSettingsMenu, this));
        this.data = {};
        this.settingsView = new SettingsView({
          model: this.options.settings,
          tableCollection: this.collection,
          data: this.data,
          isTabularView: this.collection.prevSearchDisplayStyle === 'TabularView'
        });
        this.listenTo(this.settingsView, 'close:menu', _.bind(function (event) {
          this._destroySettingsDropdown(event);
        }, this));
        this.settingsRegion.show(this.settingsView);
        this.propagateEventsToViews(this.settingsView);
        this.settingsView.$el.find('.binf-show').trigger('focus');
        this.settingsView.isVisible = true;
        this.listenTo(this.settingsView, 'update:showSummaryDescriptions', function () {
          this.selectedSettings = this.settingsView.model.get(
              'display').summary_description.selected;
          if (this.collection.prevSearchDisplayStyle === "TabularView") {
            this.options.originatingView.targetView.selectedSettings = this.selectedSettings;
            this.options.originatingView.targetView.options.descriptionRowViewOptions
                .showSummaryOnly = this.selectedSettings === 'SO';
            this.render();
            this.updateHeader();
            this._createSortRegion();
            this._createSortingView();
            this._createToolbarRegion();
            this.options.originatingView._updateToolbarActions();
            if (this.options.originatingView.collection.selectedItems &&
                this.options.originatingView.collection.selectedItems.length > 0) {
              this.options.originatingView.collection.selectedItems.reset(
                  this.options.originatingView.targetView._allSelectedNodes.models);
              this.options.originatingView.targetView._tableRowSelectionToolbarView.trigger(
                  'toggle:condensed:header');
            }
          } else {
            this.options.originatingView.targetView.render();
            this.options.originatingView.targetView.trigger('render:metadata');
          }
        });
      } else {
        this._destroySettingsDropdown();
      }
    },

    _destroySettingsDropdown: function (event) {
      this.settingsView.destroy();
      $(document).off('mouseup.dropdown' + this.cid);
      if (!!this.data.summary_description || !!this.data.display_regions) {
        this.options.originatingView.blockActions();
        this.collection.isSortOptionSelected = true;
        this.formData = new FormData();
        var self = this;
        _.mapObject(this.data, function (value, key) {
          if (key === 'display_regions') {
            self.formData.append(key, value);
          } else if (key === 'summary_description') {
            self.formData.append(key, value);
          }
        });
        this.settingsView.model.save(null, {
          parse: false,
          data: this.formData,
          processData: false,
          cache: false,
          contentType: false
        }).done(_.bind(function (response) {
          if (!!self.data.summary_description) {
            self.settingsView.model.get(
                'display').summary_description.selected = self.data.summary_description;
            self.settingsView.trigger('update:showSummaryDescriptions');
            self.options.originatingView.collection.settings_changed = false;
          }
          if (!!self.data.display_regions) {
            self.options.originatingView.unblockActions();
            self.options.originatingView.collection.settings_changed = true;
            self.settingsView.options.tableCollection.fetch();
          }
          if (!self.options.originatingView.collection.settings_changed) {
            self.options.originatingView.executeEndProcess();
            self.trigger('render:table');
          }
          this.$el.find(".csui-search-settings").trigger('focus');
        }, this)).fail(function (error) {
          error = new base.Error(error);
          GlobalMessage.showMessage('error', error.message);
          self.options.originatingView.unblockActions();
        });
        if (this.options.originatingView && this.options.originatingView.targetView &&
            this.options.originatingView.targetView.standardHeaderView) { 
          this.options.originatingView.targetView.standardHeaderView.expandAllView.pageChange();
          this.options.originatingView.targetView.standardHeaderView.expandAllView._isExpanded = false;
        }
      }
      if (this.settingsView.isChanged) {
        var regionModelCollection = this.settingsView.model.get(
            'display').display_regions.selected;
        _.each(this.options.originatingView.tableColumns.models, _.bind(function (model) {
          var key = model.get('key');
          if (key !== 'reserved' && key !== 'favorite') {
            var availableModel = regionModelCollection.findWhere({key: key});
            var newSequence = regionModelCollection.indexOf(availableModel);
            model.set('sequence', newSequence);
          }
        }, this));
        if (this.options.originatingView) {
          this.trigger('render:table');
          this.settingsView.isChanged = false;
        }
      }
    },

    _closeSettingsMenu: function (e) {
      if ((this.ui.settingsMenu.is && this.ui.settingsMenu.is(e && e.target)) ||
          (this.settingsView && this.settingsView.$el.has(e && e.target).length)) {
        e.stopPropagation();
      } else if (!(this.settingsView && this.settingsView.isDestroyed())) {
        this._destroySettingsDropdown(e);
        this.$el.find(".csui-search-settings").trigger('focus');
      }
    },

    onToggleDescriptionClick: function (e) {
      if ((e.type === 'keypress' && (e.keyCode === 13 || e.keyCode === 32)) ||
          (e.type === 'click')) {
        e.preventDefault();
        var originatingView = this.options.originatingView;
        if (!this.showDescription) {
          this.localStorage.set(this._createSearchDisplayStyleKey() + '_showDescription', true);
          originatingView.targetView.options.descriptionRowViewOptions.showDescriptions = true;
          this.$el.find('.icon-description-toggle').attr("title", lang.hideDescription);
          this.$el.find('.icon-description-toggle').attr("aria-label", lang.hideDescription);
          originatingView.$el.find('.icon-description-toggle').removeClass(
              'icon-description-hidden')
              .addClass('icon-description-shown');
          originatingView.$el.find('.csui-description-collapsed').removeClass(
              'csui-description-collapsed');
          this.showDescription = true;
          this.trigger('toggle:description', {showDescriptions: true});
        } else {
          this.localStorage.set(this._createSearchDisplayStyleKey() + '_showDescription', false);
          originatingView.targetView.options.descriptionRowViewOptions.showDescriptions = false;
          originatingView.$el.find('.icon-description-toggle').addClass('icon-description-hidden')
              .removeClass('icon-description-shown');
          this.$el.find('.icon-description-toggle').attr("title", lang.showDescription);
          this.$el.find('.icon-description-toggle').attr("aria-label", lang.showDescription);
          originatingView.$el.find('.cs-description').addClass('csui-description-collapsed');
          this.showDescription = false;
          this.trigger('toggle:description', {showDescriptions: false});
        }
        this.$el.find('.icon-description-toggle').trigger('focus');
      }
    },

    toggleView: function (e) {
      if ((e.type === 'keypress' && (e.keyCode === 13 || e.keyCode === 32)) ||
          (e.type === 'click')) {
        e.stopImmediatePropagation();
        e.preventDefault();
        if (this.collection.prevSearchDisplayStyle === "TabularView") {
          if (this.$el.parent('#header').hasClass('csui-show-header')) {
            this.$el.parent('#header').removeClass('csui-show-header');
          }
          this.$el.find('.csui-table-rowselection-toolbar').addClass('binf-hidden');
          this._prevSearchDisplayStyleLocalStorage("StandardView");
          this.collection.prevSearchDisplayStyle = "StandardView";
          searchSortingRegion && searchSortingRegion.$el.empty();
        } else {
          this._prevSearchDisplayStyleLocalStorage("TabularView");
          this.collection.prevSearchDisplayStyle = "TabularView";
          this._createSortRegion();
          this.collection.isSortOptionSelected = true;
          this._createSortingView();
          this._createToolbarRegion();
        }
        this.updateToggleIcon();
        this.updateToggleDescriptionIcon();
        this.updateToggleDescription();
        this.trigger('reload:searchForm');
      }
    },

    updateToggleIcon: function () {
      if (this.collection.prevSearchDisplayStyle === "TabularView") {
        this.ui.toggleResultsView.attr("title", lang.standardSearchView);
        this.ui.toggleResultsView.attr("aria-label", lang.standardSearchView);
        this.ui.toggleResultsView.find('.csui-icon-off').addClass('binf-hidden');
        this.ui.toggleResultsView.find('.csui-icon-on').removeClass('binf-hidden');
      } else {
        this.ui.toggleResultsView.attr("title", lang.tabularSearchView);
        this.ui.toggleResultsView.attr("aria-label", lang.tabularSearchView);
        this.ui.toggleResultsView.find('.csui-icon-on').addClass('binf-hidden');
        this.ui.toggleResultsView.find('.csui-icon-off').removeClass('binf-hidden');
      }

    },

    _createSortRegion: function () {
      searchSortingRegion = new Marionette.Region({
        el: '#csui-search-sorting'
      });
    },

    _createSortingView: function () {
      var originatingView = this.options.originatingView,
          sortingView;

      if (originatingView) {
        if (!originatingView.sortingView) {
          sortingView = new SortingView({
            collection: this.options.collection,
            enableSorting: this.options.enableSorting !== undefined ? this.options.enableSorting :
                           true
          });
        } else {
          sortingView = originatingView.sortingView;
        }
        searchSortingRegion.show(sortingView);
      }
    },

    _createToolbarRegion: function () {
      var tableRowSelectionToolbarRegion = new Marionette.Region({
        el: '.csui-search-results-header .csui-table-rowselection-toolbar'
      });
      this.tableRowSelectionToolbarRegion = tableRowSelectionToolbarRegion;
    },

    _isPreviousRouter: function (name) {
      var viewStateModel = this.context.viewStateModel;
      return viewStateModel && viewStateModel.get(viewStateModel.CONSTANTS.LAST_ROUTER) === name;
    },

    _syncStorage: function (name, id) {
      this.namedSessionStorage.set("previousNodeName", name);
      this.namedSessionStorage.set("previousNodeId", id);
    },

    _prevSearchDisplayStyleLocalStorage: function (searchDisplayStyle) {
      this.localStorage.set(this._createSearchDisplayStyleKey(), searchDisplayStyle);
    },

    _setBackButtonTitle: function () {
      var name;
      if (this._isPreviousRouter("Metadata")) {
        var viewStateModel = this.context.viewStateModel;
        var info = viewStateModel.get(viewStateModel.CONSTANTS.METADATA_CONTAINER);
        name = info.name;
        this._syncStorage(name, info.id);
      } else if (this.searchQuery.attributes.location_id1 === undefined &&
                 !this.previousNode.get('id') &&
                 !(this.namedSessionStorage && this.namedSessionStorage.get("previousNodeId"))) {
        name = lang.searchBackToHome;
        this.namedSessionStorage = null;
      } else {
        if (this.previousNode.get('id')) {
          name = this.previousNode.get('name');
          this._syncStorage(name, this.previousNode.get('id'));
        } else {
          name = this.namedSessionStorage.get("previousNodeName");
        }
      }
      this.ui.back.attr('title', _.str.sformat(lang.searchBackTooltipTo, name));
      this.ui.back.attr('aria-label', _.str.sformat(lang.searchBackTooltipTo, name));
    },

    setCustomSearchTitle: function (title) {
      !!this.titleView.setCustomSearchTitle &&
      this.titleView.setCustomSearchTitle(title);
    },

    _collectionItemRemoved: function () {
      var originalCount = this.collection.totalCount;
      this.collection.totalCount = --this.collection.totalCount;
      if (this.collection.prevSearchDisplayStyle === "TabularView" && this.tableRowSelectionToolbarRegion) {
        delete this.tableRowSelectionToolbarRegion;
      }
      this.render();
      this.collection.totalCount = originalCount;
    },

    onClickBack: function (event) {
      if (this.backButtonClicked) {
        return;
      }
      this.backButtonClicked = true;
      if ((event.type === 'keypress' && event.keyCode === 13) || (event.type === 'click')) {
        if (this.options.enableBackButton) {
          event.stopPropagation();
          this.trigger("go:back");
        } else if (this._isViewStateModelEnabled()) {
          this.context.viewStateModel.restoreLastRouter();
        } else if (this.previousNode.get('id') ||
                   (!!this.namedSessionStorage && this.namedSessionStorage.get("previousNodeId"))) {
          this.nextNode.set('id', undefined, {silent: true});
          this.nextNode.set('id', this.namedSessionStorage.get("previousNodeId"));
        } else {
          this.applicationScope.set('id', '');
        }
      }
    },

    _isViewStateModelEnabled: function () {
      return this.context && this.context.viewStateModel;
    },

    onClickFilter: function (event) {
      if ((event.type === 'keypress' && event.keyCode === 13) || (event.type === 'click')) {
        event.preventDefault();
        event.stopPropagation();
        this.trigger("toggle:filter", this.options.originatingView);
        this.trigger("focus:filter", this.options.originatingView);
      }
    },

    _createSearchDisplayStyleKey: function () {
      var context = this.context || (this.options && this.options.context),
          srcUrl = new Url().getAbsolute(),
          userID = context && context.getModel(UserModelFactory).get('id'), hostname;
      if (srcUrl) {
        hostname = srcUrl.split('//')[1].split('/')[0].split(':')[0];
      }
      return hostname + userID;
    }
  });
  _.extend(SearchHeaderView.prototype, ViewEventsPropagationMixin);
  return SearchHeaderView;
});