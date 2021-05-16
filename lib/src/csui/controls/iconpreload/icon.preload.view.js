/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/non-emptying.region/non-emptying.region', 'csui/lib/binf/js/binf'
], function (module, _, $, Marionette, NonEmptyingRegion) {
  'use strict';

  var iconClasses = module.config().iconClasses || {};
  iconClasses = Array.prototype.concat.apply([], _.values(iconClasses));

  var IconPreloadView = Marionette.ItemView.extend({
    id: 'csui-icon-preload',
    template: false,

    onRender: function () {
      this._preloadIcons();
    },

    constructor: function IconPreloadView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    _preloadIcons: function () {
      _.each(iconClasses, function (icon) {
        this.$el.append('<span class="csui-icon ' + icon +
                        '" style="position:fixed;top:-100px;left:-100px;"></span>');
      }, this);
    }
  });

  IconPreloadView.ensureOnThePage = function () {
      if (!$("#csui-icon-preload").length) {
        var iconPreloadView = new IconPreloadView(),
            binfContainer   = $.fn.binf_modal.getDefaultContainer(),
            region          = new NonEmptyingRegion({el: binfContainer});
        region.show(iconPreloadView);
      }
  };

  return IconPreloadView;
});