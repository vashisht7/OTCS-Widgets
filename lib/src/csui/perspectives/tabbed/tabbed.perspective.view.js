/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/jquery', 'csui/lib/marionette', 'csui/utils/base',
  'csui/controls/tab.panel/tab.panel.view', 'csui/controls/grid/grid.view',
  'csui/behaviors/widget.container/widget.container.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/utils/contexts/factories/active.tab.factory',
  'csui/controls/tab.panel/tab.links.ext.scroll.mixin',
  'csui/controls/tab.panel/tab.links.ext.view',
  'csui/perspectives/tabbed/behaviors/tab.extensions.behavior',
  'csui/controls/mixins/view.state/node.view.state.mixin',
  'csui/utils/contexts/factories/next.node',
  'hbs!csui/perspectives/tabbed/impl/tabbed.perspective',
  'css!csui/perspectives/impl/perspective',
  'css!csui/perspectives/tabbed/impl/tabbed.perspective'
], function (module, _, Backbone, $, Marionette, base, TabPanelView, GridView, WidgetContainerBehavior,
    LayoutViewEventsPropagationMixin, ActiveTabModelFactory, TabLinksScrollMixin,
    TabLinkCollectionViewExt, TabExtensionsBehavior, NodeViewStateMixin, NextNodeModelFactory, perspectiveTemplate) {
  'use strict';
  var config = module.config();

  var NODE_TYPES_TO_RESET_TAB = ['Business Workspace'];

  var GridRowWidgetContainerView = GridView.RowView.extend({

    cellView: function (model) {
      var widget = model.get('widget');
      if (widget) {
        var view = widget.view;
        if (!view) {
          throw new Marionette.Error({
            name: 'UnresolvedWidgetError',
            message: 'Widget "' + widget.type + '" not resolved: ' +
                     widget.error
          });
        }
        return view;
      }
    },

    cellViewOptions: function (model) {
      var widget = model.get('widget');
      return {
        context: this.options.context,
        data: widget && widget.options || {},
        model: undefined
      };
    },

    constructor: function GridRowWidgetContainerView() {
      GridView.RowView.prototype.constructor.apply(this, arguments);
    }

  });

  var TabWidgetContainerView = TabPanelView.extend({

    contentView: GridRowWidgetContainerView,

    contentViewOptions: function (model) {
      return {
        context: this.options.context,
        columns: model.get('columns')
      };
    },

    constructor: function TabWidgetContainerView(options) {
      options || (options = {});
      _.defaults(options, {
        delayTabContent: false,
        toolbar: true,
        TabLinkCollectionViewClass: TabLinkCollectionViewExt,
        tabBarLeftExtensionViewClass: options.tabBarLeftExtensionViewClass,
        tabBarLeftExtensionViewOptions: options.tabBarLeftExtensionViewOptions,
        tabBarRightExtensionViewClass: options.tabBarRightExtensionViewClass,
        tabBarRightExtensionViewOptions: options.tabBarRightExtensionViewOptions
      });

      if (options.tabs) {
        _.each(options.tabs, function (tab, tabIndex) {
          _.each(tab.columns, function (col, columnIndex) {
            col.widget.cellAddress = 'tab' + tabIndex + ':r0:c' + columnIndex;
          });
        });
      }
      this.behaviors = _.extend({
        TabExtensionsBehavior: {
          behaviorClass: TabExtensionsBehavior
        }
      }, this.behaviors);

      $(window).on('resize', {view: this}, this._onWindowResize);
      TabPanelView.prototype.constructor.call(this, options);
    },

    _onWindowResize: function (event) {
      if (event && event.data && event.data.view) {
        event.data.view._enableToolbarState();
      }
    }

  });

  _.extend(TabWidgetContainerView.prototype, TabLinksScrollMixin);

  var TabbedPerspectiveView = Marionette.LayoutView.extend({

    className: 'cs-tabbed-perspective cs-perspective binf-container-fluid',
    template: perspectiveTemplate,

    behaviors: {
      WidgetContainer: {
        behaviorClass: WidgetContainerBehavior
      }
    },

    regions: {
      headerRegion: '> .cs-header',
      contentRegion: '> .cs-content'
    },

    constructor: function TabbedPerspectiveView(options) {
      options || (options = {});
      options = $.extend(true, {}, options);
      
      this.context = options.context;
      
      this.activeTab =  this._initActiveTabFromViewState();
      var viewStateModel = this.context && this.context.viewStateModel;
      viewStateModel && viewStateModel.set(viewStateModel.CONSTANTS.ALLOW_WIDGET_URL_PARAMS, false);
      viewStateModel && viewStateModel.addUrlParameters(['tab'], this.context);
      
      var widget = options && options.header && options.header.widget;
      if (widget) {
        options.header.widget = base.filterUnSupportedWidgets(widget, config);
      }
      if (options.tabs) {
        options.tabs = _.each(options.tabs, function (tab, tabIndex) {
          tab.columns = _.filter(tab.columns, function (col, columnIndex) {
			return base.filterUnSupportedWidgets(col.widget, config) != undefined;
          });
        });
      }

      Marionette.LayoutView.prototype.constructor.call(this, options);

      this.listenTo(this.context.viewStateModel, 'change:state', this.onViewStateChanged);

      this.nextNode = this.context.getModel(NextNodeModelFactory);
      this.listenTo(this.nextNode, 'change:id', this._resetTab);
      this.listenTo(this.context, 'retain:perspective', this._onPerspectiveRetainedOrChanged);
      this.listenTo(this.context, 'change:perspective', this._onPerspectiveRetainedOrChanged);
      
      this.propagateEventsToRegions();
    },

    onRender: function () {
      this.navigationHeader = this.options.header.widget ?
                              this._createWidget(this.options.header.widget) : {};
      this.tabPanel = new TabWidgetContainerView(_.extend({
        activeTab: this.activeTab,
        delayTabContent: this.options.delayTabContent,
        tabBarLeftExtensionViewClass: this.navigationHeader.tabBarLeftExtensionView,
        tabBarLeftExtensionViewOptions: this.navigationHeader.tabBarLeftExtensionViewOptions,
        tabBarRightExtensionViewClass: this.navigationHeader.tabBarRightExtensionView,
        tabBarRightExtensionViewOptions: this.navigationHeader.tabBarRightExtensionViewOptions,
        disableExtensionOnFirstTab: this.navigationHeader.disableExtensionOnFirstTab,
        disableExtensionOnOtherTabs: this.navigationHeader.disableExtensionOnOtherTabs
      }, this.options));
      this._updateToggleHeaderState();
      this.listenTo(this.tabPanel, 'activate:tab', this._onActiveTab);
      if (!_.isEmpty(this.navigationHeader)) {
        this.headerRegion.show(this.navigationHeader);
      }
      this.contentRegion.show(this.tabPanel);
      this.headerRegion.$el.on(this._transitionEnd(), _.bind(function (event) {
        if (event.target === this.headerRegion.el) {
          this.$el.removeClass('cs-toggling');
          this.triggerMethod('dom:refresh');
        }
      }, this));

      var viewStateModel = this.context.viewStateModel;
      viewStateModel.set('browsing', viewStateModel.BROWSING_TYPE.none);
    },

    _onActiveTab: function(tabContent, tabPane, tabLink){
      this._updateToggleHeaderState(tabContent, tabPane, tabLink);
      this._notifyHeader();
    },

    _notifyHeader: function(tabContent, tabPane, tabLink){
      var tabIndex = this.tabPanel.activeTab.get('tabIndex');
      var isCollapsed = this.tabPanel.activeTab.get('isCollapsed');
      this.navigationHeader.triggerMethod("active:tab", {'tabIndex':tabIndex, 'isCollapsed': isCollapsed});
    },

    onBeforeRender: function () {
      if (this.headerRegion && this.headerRegion.$el) {
        this.headerRegion.$el.off(this._transitionEnd());
      }
    },

    onBeforeDestroy: function () {
      this.setViewStateTabIndex(0, {default: true});
      if (this.headerRegion && this.headerRegion.$el) {
        this.headerRegion.$el.off(this._transitionEnd());
      }
    },

    enumerateWidgets: function (callback) {
      var widget = this.options && this.options.header && this.options.header.widget;
      widget && callback(widget);
      _.each(this.options.tabs, function (tab) {
        _.each(tab.columns || [], function (column) {
          column.widget && callback(column.widget);
        });
      });
    },

    _createWidget: function (widget) {
      var Widget = widget.view;
      if (!Widget) {
        throw new Marionette.Error({
          name: 'UnresolvedWidgetError',
          message: 'Widget not resolved: "' + widget.type + '"'
        });
      }
      return new Widget({
        context: this.options.context,
        data: widget.options || {}
      });
    },

    _updateToggleHeaderState: function (tabContent, tabPane, tabLink) {
      var tabIndex    = tabLink ? tabLink.model.collection.indexOf(tabLink.model) :
                        this.activeTab && this.activeTab.get('tabIndex') || 0,
          method      = tabIndex === 0 ? 'removeClass' : 'addClass',
          isCollapsed = this.$el.hasClass('cs-collapse');
      if (method === 'removeClass' && isCollapsed ||
          method === 'addClass' && !isCollapsed) {
        this.$el.addClass('cs-toggling');
        this.$el[method]('cs-collapse');
      }
      this.tabPanel.activeTab.set('isCollapsed', (tabIndex > 0) );

      if (this.tabPanel && this.tabPanel.tabLinks) {
        this.setViewStateTabIndex(tabIndex);
      }
    },

    onDomRefresh: function () {
      this.onViewStateChanged();
    },

    _initActiveTabFromViewState: function () {
      var tabIndex = this.getViewStateTabIndex();
      if (tabIndex) {
        return new Backbone.Model({tabIndex: tabIndex});
      }
    },

    onViewStateChanged: function (forceActivation) {
      var tabIndex = this.getViewStateTabIndex() || 0,
          tabPanel = this.tabPanel,
          tabLinks = tabPanel && this.tabPanel.tabLinks,
          self     = this;
      function isTabContentCreated(index) {
        var tabPanels = tabPanel.el.querySelectorAll('[role=tabpanel]');
        if (tabPanels && tabPanels.length > index) {
          return $(tabPanels[index]).height() > 0;
        }
      }

      function activateTabWhenReady(tab, tabIndex) {
        if (isTabContentCreated(tabIndex)) {
          tab.activate();
        } else {
          setTimeout(activateTabWhenReady.bind(self, tab, tabIndex), 50);
        }
      }

      if (tabLinks) {
        var tab = tabLinks.children.findByIndex(tabIndex);
        if (tab && !tab.isActive()) {
          activateTabWhenReady(tab, tabIndex);
        }
      }
    },

    _onPerspectiveRetainedOrChanged: function (/*perspective, sourceModel*/) {
      var viewStateModel = this.context.viewStateModel;
      if (NODE_TYPES_TO_RESET_TAB.indexOf(this.nextNode.get('type_name')) !== -1) {
        if (viewStateModel.get('browsing') !== viewStateModel.BROWSING_TYPE.breadcrumbs) {
          this.setViewStateTabIndex(0, {default: true});
        }
        viewStateModel.set('browsing', viewStateModel.BROWSING_TYPE.none);
      }
    },

    _resetTab: function () {
      var viewStateModel = this.context.viewStateModel;
      if (viewStateModel.get('browsing')) {
        if (viewStateModel.get('browsing') !== viewStateModel.BROWSING_TYPE.breadcrumbs) {
          viewStateModel.set('browsing', viewStateModel.BROWSING_TYPE.none);
        }
        return;
      }
      this.setViewStateTabIndex(0, {default: true});
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

    _supportMaximizeWidget: true

  });

  _.extend(TabbedPerspectiveView.prototype, LayoutViewEventsPropagationMixin);
  _.extend(TabbedPerspectiveView.prototype, NodeViewStateMixin);

  return TabbedPerspectiveView;
});
