/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/models/facettopics',
  'csui/models/nodefacets2',
  'csui/controls/facet.panel/impl/facet/facet.key.navigation',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/facet.panel/impl/facet/facet.item.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/controls/globalmessage/globalmessage',
  'csui/controls/progressblocker/blocker',
  'hbs!csui/controls/facet.panel/impl/facet/facet',
  'i18n!csui/controls/facet.panel/impl/nls/lang',
  'css!csui/controls/facet.panel/impl/facet/facet'
], function (_, $, Marionette, base, FacetTopicCollection, NodeFacet2Collection,
    KeyEventNavigation, TabableRegionBehavior, FacetItemView, ViewEventsPropagationMixin,
    GlobalMessage, BlockingView, template, lang) {

  var FacetView = Marionette.CompositeView.extend({

    childView: FacetItemView,
    template: template,
    className: 'csui-facet',

    childViewContainer: '.cs-filter-group',

    ui: {
      facetContent: '.csui-facet-content',
      facetHeader: '.csui-facet-header',
      facetHeaderIcon: '.csui-facet-header > .cs-icon',
      facetSubmitControls: '.csui-facet-controls',
      facetCollapseControls: '.csui-facet-collapse-controls',
      facetMoreText: '.csui-more-text',
      facetMoreIcon: '.csui-filter-more .cs-icon',
      facetMore: '.csui-filter-more',
      apply: '.csui-facet-controls .csui-apply',
      cancel: '.csui-facet-controls .csui-clear',
      selectCount: '.header-count'
    },

    childEvents: {
      'single:filter:select': 'onSingleFilterSelect',
      'multi:filter:select': 'onMultiFilterSelect',
      'keyupdown': 'cursorNextFilter',
      'keyleftright': 'cursorInsideFilter'
    },

    events: {
      'click .csui-filter-more:not(.binf-disabled)': 'onShowMore',
      'click .csui-facet-header': 'onShowFacet',
      'mouseleave': 'onMouseLeave',
      'keydown': 'onKeyInView'
    },

    triggers: {
      'click .csui-clear': 'clear:all',
      'click .csui-apply': 'apply:all'
    },

    templateHelpers: function () {
      var moreLabel       = this.showAll ? lang.showLess : lang.showMore,
          moreFiltersAria = this.showAll ? lang.showLessAria : lang.showMoreAria;
      return {
        'more': this.haveMore ? moreLabel : undefined,
        'moreFiltersAria': moreFiltersAria,
        'more-icon': this.showAll ? 'icon-expandArrowUp' : 'icon-expandArrowDown',
        'apply': lang.apply,
        'applyFiltersAria': lang.applyFiltersAria,
        'clear': lang.clear,
        'clearFiltersAria': lang.clearFiltersAria,
        'show-controls': this.selectItems.length > 0 ? 'csui-multi-select' : '',
        'show-content': this.showFacet ? '' : 'binf-hidden',
        'showFacetAria': this.showFacet ? lang.hideFacetAria : lang.showFacetAria
      };
    },

    childViewOptions: function () {
      return {
        enableCheckBoxes: this.model.get('select_multiple'),
        displayCount: this.model.get('display_count')
      };
    },

    constructor: function FacetView(options) {
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      this.$el.attr('tabindex', 0);
      this.options = options || {};
      this.collection = new FacetTopicCollection();
      this.itemsToShow = this.model.get('items_to_show');
      this.nodeFacetsCollection = this.model.get('nodeFacetsCollection');
      this.showAll = false;
      this._fillCollection();
      var totalDisplayable = this.model.has('total_displayable') ?
                             this.model.get('total_displayable') : this.model.topics.length;
      this.haveMore = totalDisplayable > this.collection.length;
      this.showFacet = true;
      this.selectItems = [];
      this.listenTo(this, 'add:child', this.propagateEventsToViews);

      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      }
    },

    onClearAll: function () {
      var checkboxes = this.$el.find(".csui-checkbox[aria-checked='true']");
      checkboxes.trigger('click');

      this.selectItems = [];
      this.ui.facetCollapseControls.removeClass('multi-select');
      this._setDisabledFilters(0);
      this.$el.removeClass('multi-select');
      this._updateFacetSubmitControls();
      this.ui.facetHeader.removeClass('binf-disabled');
      this.trigger('activate:facet', this);
    },

    onApplyAll: function () {
      var facet   = this.model,
          filters = this._getFilterArray();

      this.newFilter = {
        id: facet.get('id'),
        values: filters
      };
      this.trigger('apply:filter');
    },

    onRender: function () {
      if (this.collection.length === 0) {
        this.$el.hide();
      }
      this.$el.attr('role', 'menu');
      this.$el.attr('aria-label', _.str.sformat(lang.facetTitleAria, this.model.get('name')));
    },

    onSingleFilterSelect: function (filter) {
      if (!filter.$el.hasClass('binf-disabled')) {
        if (this.$el.hasClass('multi-select')) {
          filter.$el.find('.csui-checkbox').trigger('click');
        } else {
          var facet = this.model;
          this.newFilter = {
            id: facet.get('id'),
            values: [{
              id: filter.model.get('value')
            }]
          };
          this.trigger('apply:filter');
        }
      }
    },

    onShowMore: function (event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.showAll = !this.showAll;

      var self = this;
      this._fillCollection()
          .done(function () {
            var newSelectItems = [];
            self.children.each(function (child, childIndex) {
              if(!!self.selectItems[childIndex]) {
                child._checkboxRegion.currentView.setChecked(true);
                newSelectItems[childIndex] = child;
              } else {
                if (!!child._checkboxRegion) {
                  child._checkboxRegion.currentView.setChecked(false);
                }
              }
            });

            self.selectItems = newSelectItems;

            var numCheckedItems = self.$el.find(".csui-checkbox[aria-checked='true']").length;
            self._setDisabledFilters(numCheckedItems);

            self._setMoreLabel(self.showAll);
            self.trigger('facet:size:change');
          })
          .fail(function () {
            self.showAll = !self.showAll;
          });
    },

    onShowFacet: function (event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.showFacet = !this.showFacet;
      if (this.showFacet) {
        this.ui.facetContent.removeClass('binf-hidden');
        this.ui.facetCollapseControls.removeClass('multi-select');
        this.ui.facetHeaderIcon[0].className = 'cs-icon csui-button-icon icon-expandArrowUp';
        this.ui.facetHeaderIcon[0].setAttribute('aria-label', lang.hideFacetAria);
        this.ui.facetHeaderIcon[0].setAttribute('title', lang.hideFacetAria);
      } else {
        var numCheckedItems = this.$el.find(".csui-checkbox[aria-checked='true']").length;
        this.ui.facetContent.addClass('binf-hidden');
        this.ui.facetHeaderIcon[0].className = 'cs-icon csui-button-icon icon-expandArrowDown';
        this.ui.facetHeaderIcon[0].setAttribute('aria-label', lang.showFacetAria);
        this.ui.facetHeaderIcon[0].setAttribute('title', lang.showFacetAria);
        if (numCheckedItems) {
          this.ui.facetCollapseControls.addClass('multi-select');
        }
      }
      this.trigger('facet:size:change');
    },

    onMouseLeave: function (event) {
      event.preventDefault();
      event.stopPropagation();
    },

    getIndex: function () {
      return this._index;
    },

    onMultiFilterSelect: function (childView) {
      var numCheckedItems = this.$el.find(".csui-checkbox[aria-checked='true']").length;
      this._updateSelectList(childView);
      this._updateFacetSubmitControls(numCheckedItems);
      this._setDisabledFilters(numCheckedItems);
      this.selectItems = (numCheckedItems === 0) ? [] : this.selectItems;
      this.trigger('activate:facet', this);
    },

    _updateFacetSubmitControls: function () {
      var numCheckedItems = this.$el.find(".csui-checkbox[aria-checked='true']").length;

      if (numCheckedItems > 0) {
        this.ui.facetSubmitControls.addClass('csui-multi-select');
        this.$el.addClass('multi-select');
        this.ui.facetHeader.addClass('binf-disabled');
      } else {
        this.ui.facetSubmitControls.removeClass('csui-multi-select');
        this.$el.removeClass('multi-select');
        this.ui.facetHeader.removeClass('binf-disabled');
      }
    },

    _updateSelectList: function (childView) {
      var childIndex = childView.getIndex();
      if (this.selectItems[childIndex]) {
        delete this.selectItems[childIndex];
      } else {
        this.selectItems[childIndex] = childView;
      }
    },

    _setDisabledFilters: function (numCheckedItems) {
      var unselectedItems = this.$el.find(".csui-checkbox[aria-checked='false']");

      if (numCheckedItems < 5) {
        unselectedItems.prop('disabled', false).trigger('change');
        unselectedItems.parent().parent().removeClass('binf-disabled');
      } else {
        unselectedItems.prop('disabled', true).trigger('change');
        unselectedItems.parent().parent().addClass('binf-disabled');
      }

      this.ui.selectCount.text(numCheckedItems);
    },

    _setMoreLabel: function (showAll) {
      var moreItems = this.$el.find('.csui-facet-item.more');
      if (this.ui.facetMoreIcon[0]) {
        if (showAll) {
          this.ui.facetMoreIcon[0].className = 'cs-icon icon-expandArrowUp';
          this.ui.facetMoreText.text(lang.showLess);
          this.ui.facetMore[0].setAttribute('aria-label', lang.showLessAria);
          this.ui.facetMoreText[0].setAttribute('aria-expanded', 'true');
        } else {
          this.ui.facetMoreIcon[0].className = 'cs-icon icon-expandArrowDown';
          this.ui.facetMoreText.text(lang.showMore);
          this.ui.facetMore[0].setAttribute('aria-label', lang.showMoreAria);
          this.ui.facetMoreText[0].setAttribute('aria-expanded', 'false');
        }
      }
      this.trigger('facet:size:change');
    },

    _getFilterArray: function () {
      var filters = [];
      _.each(this.selectItems, function (item) {
        if (item) {
          filters.push({
            id: item.model.get('value')
          });
        }
      });
      return filters;
    },

    _fillCollection: function () {
      var self     = this,
          deferred = $.Deferred();

      if (this.showAll) {
        if (this.model.get('total_displayable') > this.model.topics.length) {
          var facetId    = this.model.get('id'),
              options    = {
                filters: this.nodeFacetsCollection.filters,
                facetIds: [facetId],
                node: this.nodeFacetsCollection.node
              },
              nodeFacets = new NodeFacet2Collection(null, options);

          this.blockActions && this.blockActions();
          nodeFacets.fetch()
              .always(function () {
                self.unblockActions && self.unblockActions();
              })
              .done(function () {
                self.model.topics.reset(nodeFacets.get(facetId).topics.models, {silent: true});
                self.collection.reset(self.model.topics.models);
                deferred.resolve();
              })
              .fail(function (err) {
                var error = new base.Error(err);
                GlobalMessage.showMessage('error', error.message);
                deferred.reject(error);
              });
          return deferred.promise();
        } else {
          this.collection.reset(this.model.topics.models);
        }
      } else {
        var topics = this.model.topics.first(this.itemsToShow);
        this.collection.reset(topics);
      }

      return deferred.resolve().promise();
    }

  });

  _.extend(FacetView.prototype, KeyEventNavigation);
  _.extend(FacetView.prototype, ViewEventsPropagationMixin);

  return FacetView;
});
