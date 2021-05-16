/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'i18n!csui/widgets/navigation.header/controls/favorites/impl/nls/localized.strings',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/widgets/navigation.header/controls/favorites/impl/favorites',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/widgets/favorites/favorites.view', 'csui/utils/contexts/factories/favorites2',
  'css!csui/widgets/navigation.header/controls/favorites/impl/favorites'
], function (_, $, Marionette, localizedStrings, TabableRegionBehavior, template,
    LayoutViewEventsPropagationMixin, FavoritesView) {
  'use strict';

  var FavoritesButtonView = Marionette.LayoutView.extend({
    className: 'csui-favorites-view',

    template: template,

    templateHelpers: function () {
      return {
        title: localizedStrings.FavoritesIconTitle,
        favoritesTitleAria: localizedStrings.FavoritesTitleAria
      };
    },

    regions: {
      favoritesViewContainerRegion: '.csui-favorites-view-container'
    },

    ui: {
      favoritesButtonContainer: '.csui-favorites-icon-container',
      favoritesViewContainer: '.csui-favorites-view-container'
    },

    events: {
      'dragenter': '_hideFavoritesView',
      'keydown': 'onKeyInView',
      'mouseenter .csui-favorites-view-container': 'onMouseEnterFavoritesView',
      'mouseenter .csui-favorites-icon-container': 'onMouseEnterFavoritesView',
      'mouseleave .csui-favorites-view-container': 'onMouseLeaveFavoritesView',
      'mouseleave .csui-favorites-icon-container': 'onMouseLeaveFavoritesView',
      'mouseenter .clicked-no-hover': 'onMouseEnterClickedNoHoverItem',
      'focus .csui-favorites-icon-container': 'onFocusButton',
      'blur .csui-favorites-icon-container': 'onBlurButton',
      'blur .csui-favorites-view-container': 'onBlurFavoritesViewContainer',
      'click .csui-favorites-icon-container': 'onClickFavoritesIcon'
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function (event) {
      var $favoriteSearch = this.ui.favoritesViewContainer.find(
        '.content-tile .cs-search-button');
      if (event.shiftKey && $favoriteSearch .length > 0) {
        return this.favoritesView._focusSearchButton();
      } else {
        return this.ui.favoritesButtonContainer;
      }
    },

    constructor: function FavoritesButtonView(options) {
      Marionette.LayoutView.call(this, options);
      
      this.propagateEventsToRegions();
      this.listenTo(options.context, 'change:perspective', this._hideFavoritesView);
    },

    onBeforeDestroy: function () {
      this.favoritesView && this.favoritesView.destroy();
    },

    onRender: function () {
      this.ui.favoritesViewContainer.addClass('binf-hidden');
    },

    onFocusButton: function () {
      this.$el.find('.csui-icon-favorites').addClass('fav_header42_mo');
    },

    onBlurButton: function () {
      this.$el.find('.csui-icon-favorites').removeClass('fav_header42_mo');
      if (this.favoritesViewInFocus !== true &&
          document.activeElement !== this.ui.favoritesButtonContainer[0]) {
        this._hideFavoritesView();
      }
    },

    onBlurFavoritesViewContainer: function (event) {
      if (this.favoritesViewInFocus !== true && this.keyboardAction !== true) {
        this._hideFavoritesView();
      }
    },

    onMouseEnterFavoritesView: function () {
      this.favoritesViewInFocus = true;
    },

    onMouseLeaveFavoritesView: function () {
      this.favoritesViewInFocus = false;
    },

    onMouseEnterClickedNoHoverItem: function (event) {
      event && event.target && $(event.target).removeClass('clicked-no-hover');
    },

    onKeyInView: function (event) {
      switch (event.keyCode) {
      case 9:  // tab
        var favoritesButtonInFocus = this.ui.favoritesButtonContainer.is(':focus');
        if (favoritesButtonInFocus && event.shiftKey !== true &&
            !this.ui.favoritesViewContainer.hasClass('binf-hidden')) {
          this._focusOnFavoriteSearch(event);
        } else if (!favoritesButtonInFocus && event.shiftKey) {
          event.preventDefault();
          event.stopPropagation();
          this._focusOnFavoriteButton();
        } else if (!$(event.target).closest('.tile-header').length){
          this._hideFavoritesView();
        }
        break;
      case 13:  // enter
      case 32:  // space
        if (!$(event.target).closest('.tile-header').length) {
        this.triggerMethod('click:favorites:icon', event);
          if (!this.ui.favoritesViewContainer.hasClass('binf-hidden')) {
            this._focusOnFavoriteSearch(event);
          }
        }
        break;
      case 40:  // arrow down
        if (!this.favoritesView || this.ui.favoritesViewContainer.hasClass('binf-hidden')) {
          this.triggerMethod('click:favorites:icon', event);
          this._focusOnFavoriteSearch(event);
        } else if (this.favoritesViewInFocus !== true) {
          this._focusOnFavoriteSearch(event);
        }
        break;
      case 27:  // escape
        this._focusOnFavoriteButton();
        this._hideFavoritesView();
        break;
      }
    },

    _focusOnFavoriteButton: function () {
      this.ui.favoritesButtonContainer.trigger('focus');
      this.favoritesViewInFocus = false;
    },

    _focusOnFavoriteSearch: function (event) {
      var $favoriteSearch = this.ui.favoritesViewContainer.find(
        '.content-tile .cs-search-button');
      if ($favoriteSearch.length > 0) {
        event.preventDefault();
        event.stopPropagation();
        this.favoritesViewInFocus = true;
        this.favoritesView._moveTo(event, this.favoritesView._focusSearchButton());
      }
    },

    _focusOnFavoriteList: function (event) {
      var $favorites     = this.ui.favoritesViewContainer.find(
          '> .content-tile > .tile-content > .binf-list-group'),
          $favoriteItems = this.favoritesView.showFlatList ?
                           $favorites.find('> .binf-list-group-item') :
                           $favorites.find('> .cs-simpletreelistitem');
      if ($favoriteItems.length > 0) {
        event.preventDefault();
        event.stopPropagation();
        this.favoritesViewInFocus = true;
        this.favoritesView._moveTo(event, this.favoritesView._focusList());
      }
    },

    _handleClickEvent: function (event) {
      if (!$(event.target).parents('.csui-favorites-view-container').length &&
          !$(event.target).parents('.csui-favorites-icon-container').length) {
        this._hideFavoritesView();
      }
    },

    _toggleFavoritesView: function () {
      if (this.ui.favoritesViewContainer.hasClass('binf-hidden')) {
        this._showFavoritesView();
      } else {
        this._hideFavoritesView();
      }
    },

    _showFavoritesView: function () {
      this.ui.favoritesViewContainer.removeClass('binf-hidden');
      this.ui.favoritesButtonContainer.attr('aria-expanded', 'true');
      this.$el.addClass('showing-favorites-view');
      this.favoritesViewContainerRegion.show(this.favoritesView);
      $(document).off('click.' + this.cid).on('click.' + this.cid,
          _.bind(this._handleClickEvent, this));
    },

    _hideFavoritesView: function () {
      $(document).off('click.' + this.cid);
      if (this.favoritesView && this.favoritesView.isSearchOpen()) {
        this.favoritesView.searchClicked(event); // reset search to default
      }
      this.favoritesViewInFocus = false;
      this.ui.favoritesViewContainer.addClass('binf-hidden');
      this.ui.favoritesButtonContainer.attr('aria-expanded', 'false');
      this.$el.removeClass('showing-favorites-view');
    },

    onClickFavoritesIcon: function (event) {
      event.preventDefault();
      event.stopPropagation();
      var toggleDropdown = $('.binf-open>.binf-dropdown-toggle');
      if (toggleDropdown.length > 0) {
        toggleDropdown.binf_dropdown('toggle');
      }
      this._ensureFavoritesView();
      this._toggleFavoritesView();
      this._focusOnFavoriteSearch(event);
    },

    _ensureFavoritesView: function () {
      if (!this.favoritesView) {
        var self = this;
        var options = _.extend(this.options, {showInlineActionBar: true, avoidOpenPerspectiveOnHeader: true});
        this.favoritesView = new FavoritesView(options);
        this.listenTo(this.favoritesView, 'childview:click:tree:item', function (target, src) {
          src.$el && src.$el.addClass('clicked-no-hover');
          self._hideFavoritesView();
          self._focusOnFavoriteButton();
        });
        this.listenTo(this.favoritesView, 'childview:click:item', function (src) {
          src.$el && src.$el.addClass('clicked-no-hover');
          self._hideFavoritesView();
          self._focusOnFavoriteButton();
        });
        this.listenTo(this.favoritesView, 'childview:before:execute:command', function (src) {
          self._hideFavoritesView();
          self._focusOnFavoriteButton();
        });
        this.listenTo(this.favoritesView,
            'before:keyboard:change:focus childview:before:keyboard:change:focus', function () {
              self.keyboardAction = true;
            });
        this.listenTo(this.favoritesView,
            'after:keyboard:change:focus childview:after:keyboard:change:focus', function () {
              self.keyboardAction = false;
            });

        this.listenTo(this.favoritesView, 'open:favorites:perspective', function() {
          this._hideFavoritesView();
        });
      }
    }
  });

  _.extend(FavoritesButtonView.prototype, LayoutViewEventsPropagationMixin);

  return FavoritesButtonView;
});
