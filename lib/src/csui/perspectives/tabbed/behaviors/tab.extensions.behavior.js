/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/non-emptying.region/non-emptying.region'
], function (module, _, $, Marionette, NonEmptyingRegion) {
  'use strict';

  var TabExtensionsBehavior = Marionette.Behavior.extend({

    constructor: function TabExtensionsBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.listenTo(view, 'render', this.renderExtension);
      this.listenTo(view, 'before:destroy', this.destroyExtension);
      this.listenTo(view, 'dom:refresh', this.refreshTab);
    },

    renderExtension: function () {
      var options                         = this.view.options,
          tabBarLeftExtensionViewClass    = options.tabBarLeftExtensionViewClass,
          tabBarLeftExtensionViewOptions  = options.tabBarLeftExtensionViewOptions,
          tabBarRightExtensionViewClass   = options.tabBarRightExtensionViewClass,
          tabBarRightExtensionViewOptions = options.tabBarRightExtensionViewOptions,
          tabLeftExtensionIndex           = 0, // left extension if present, index is 0
          tabRightExtensionIndex;//right extension if present,index can be either 1(no left extension or 2( with left extension)

      this.tabBarLeftExtensionsRegion = this.showExtension(tabBarLeftExtensionViewClass,
          tabBarLeftExtensionViewOptions, tabLeftExtensionIndex);
      tabRightExtensionIndex = !!this.tabBarLeftExtensionsRegion ? 2 : 1;
      this.tabBarRightExtensionsRegion = this.showExtension(tabBarRightExtensionViewClass,
          tabBarRightExtensionViewOptions, tabRightExtensionIndex);
      this.view._initializeToolbars();
    },

    showExtension: function (viewClass, viewOptions, index) {
      var viewRegion;
      if (!!viewClass) {
        if (typeof (viewClass) === "function") {
          this.tabBarExtensionView = new viewClass(viewOptions);
          this.tabBarExtensionView.$el.addClass("tab-extension");
          if (!!viewOptions.customClass) {
            this.tabBarExtensionView.$el.addClass(viewOptions.customClass);
          }
          viewRegion = new NonEmptyingRegion({
            el: this.view.el,
            index: index
          });
          viewRegion.show(this.tabBarExtensionView);
        }
      }
      return viewRegion;
    },

    refreshTab: function () {
      this.view._enableToolbarState();

      if(this.tabBarExtensionView){
        this.tabBarExtensionView.triggerMethod("dom:refresh");
      }
    },

    destroyExtension: function () {
      if (!!this.tabBarLeftExtensionsRegion) {
        this.tabBarLeftExtensionsRegion.empty();
      }
      if (!!this.tabBarRightExtensionsRegion) {
        this.tabBarRightExtensionsRegion.empty();
      }
    }
  });

  return TabExtensionsBehavior;

});
