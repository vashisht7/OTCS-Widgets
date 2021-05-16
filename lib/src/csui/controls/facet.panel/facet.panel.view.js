/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/models/facets',
  'csui/controls/list/simplelist.view',
  'csui/controls/facet.panel/impl/facet/facet.view',
  'csui/behaviors/collection.state/collection.state.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/facet.panel/impl/facet.panel.key.navigation',
  'csui/controls/progressblocker/blocker',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'hbs!csui/controls/facet.panel/impl/facet.panel',
  'i18n!csui/controls/facet.panel/impl/nls/lang',
  'css!csui/controls/facet.panel/impl/facet.panel'
], function (_, $, FacetCollection, SimpleListView, FacetView,
    CollectionStateBehavior, TabableRegionBehavior, KeyEventNavigation,
    BlockingView, ViewEventsPropagationMixin, template, lang) {
  'use strict';

  var FacetPanelView = SimpleListView.extend({

    template: template,

    className: 'cs-simplelist csui-facet-panel',

    behaviors: {

      CollectionState: {
        behaviorClass: CollectionStateBehavior,
        collection: function () {
          if (this.facets.length) {
            var availableFacets = this._getAvailableFacets();
            this.facets.models = availableFacets.models;
            this.facets.length = availableFacets.length;
          }
          return this.facets;
        },
        stateMessages: function () {
          return {
            empty: _.isEmpty(this.facets.filters) ?
                   lang.emptyFacetMessage :
                   lang.emptyFilteredFacetMessage,
            loading: lang.loadingFacetMessage,
            failed: lang.failedFacetMessage
          };
        }
      },

      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }

    },

    childView: FacetView,

    childViewOptions: function () {
      return {
        blockingParentView: this.options.blockingParentView
      };
    },

    childEvents: {
      'apply:filter': 'applyFilter',
      'activate:facet': 'setActiveFacet',
      'facet:size:change': '_updateScrollbar',
      'escape:focus': 'resetFacetFocus'
    },

    events: {
      'keydown': 'onKeyInView'
    },

    templateHelpers: function () {
      var showTitle = this.options.data.showTitle;
      var title = this.options.data.title;
      return {
        showTitle: showTitle,
        title: title
      };
    },

    onAddChild: function (childView) {
      var $child = childView.$el,
          self = this;
      if (childView.getIndex() === (this.collection.length - 1)) {
        $child.css('border-bottom', '0px');
      }
      $child.on('focus', function () {
        self.onSetNextChildFocus(childView);
      });
      this.propagateEventsToViews(childView);
    },

    constructor: function FacetPanelView(options) {
      this.facets = options.collection;
      this.originatingView = options.originatingView;
      options.collection = this._getAvailableFacets();

      SimpleListView.prototype.constructor.apply(this, arguments);
      this.options.data.title = lang.facetsTitle;
      this.options.data.showTitle = this.options.showTitle === undefined ? true :
                                    this.options.showTitle;
      this._onRemoveKeyboardFocus = _.bind(this._removeKeyboardFocus, this);

      if (this.options.blockingParentView && !this.options.blockingLocal) {
        BlockingView.delegate(this, this.options.blockingParentView);
        this.listenTo(this.facets, "request", this.blockActions)
            .listenTo(this.facets, "sync", this.unblockActions)
            .listenTo(this.facets, "error", this.unblockActions);
      } else {
        BlockingView.imbue({
          parent: this,
          local: this.options.blockingLocal
        });
      }
    },

    _getAvailableFacets: function () {
      var availableFacets = this.facets.getAvailableFacets();
      this.listenTo(this.facets, 'reset', function () {
        var availableFacets = this.facets.getAvailableFacets();
        this.collection.reset(availableFacets);
      });
      var self = this;
      this.listenTo(this.facets, "request", function() {
        self.originatingView && self.originatingView.blockActions();
      });
      this.listenTo(this.facets, "sync", function(){
        self.originatingView && self.originatingView.unblockActions();
      });
      this.listenTo(this.facets, "destroy", function(){
        self.originatingView && self.originatingView.unblockActions();
      });
      this.listenTo(this, "destroy", function(){
        self.originatingView && self.originatingView.unblockActions();
      });
      return new FacetCollection(availableFacets);
    },

    isTabable: function () {
      return !(this.$el.parent().hasClass('binf-hidden') || this.$el.parent().hasClass('csui-facetview-hidden'));
    },

    onRenderCollection: function () {
      this.trigger('refresh:tabindexes');
    },

    onBeforeDestroy: function () {
      $(document).off('mousedown', this._onRemoveKeyboardFocus);
    },

    applyFilter: function (facet) {
      this.trigger('apply:filter', facet.newFilter);
    },
    setActiveFacet: function (facet) {
      if (facet.selectItems.length > 0) {
        this.children.each(function (view) {
          if (view.getIndex() !== facet.getIndex()) {
            view.$el.find('.csui-facet-content').addClass('facet-disabled');
          }
        });
      }
      else {
        this.$el.find('.csui-facet-content').removeClass('facet-disabled');
      }
    },

    _updateScrollbar: function () {
      this.triggerMethod('update:scrollbar', this);
    }

  });

  _.extend(FacetPanelView.prototype, KeyEventNavigation);
  _.extend(FacetPanelView.prototype, ViewEventsPropagationMixin);
  return FacetPanelView;

});
