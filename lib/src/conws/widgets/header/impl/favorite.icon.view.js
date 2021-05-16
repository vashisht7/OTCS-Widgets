/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/widgets/favorites/favorite.star.view',
  'css!conws/widgets/header/impl/favorite.icon'
], function (_, $, Marionette, TabableRegionBehavior, FavoriteStarView) {

  'use strict';

  var FavoriteIconView = FavoriteStarView.extend({

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function FavoriteIconView(options) {
      FavoriteStarView.prototype.constructor.call(this, options);
    },
    currentlyFocusedElement: function () {
      return this.$el.find('button');
    },
    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        event.preventDefault();
        event.stopPropagation();
        this.enabled() && this.toggleFavorite();
      }
    }
  });

  return FavoriteIconView;

});