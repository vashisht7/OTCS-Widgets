/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!xecmpf/controls/dialogheader/impl/dialogheader',
  'i18n!xecmpf/controls/dialogheader/impl/nls/lang',
  'css!xecmpf/controls/dialogheader/impl/dialogheader'
], function (_, $, Backbone, Marionette, TabableRegion, template, lang) {

  var DialogHeaderView = Marionette.LayoutView.extend({

    className: 'xecmpf-header',
    template: template,

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegion
      }
    },

    regions: {
      LeftRegion: '.left-section',
      CenterRegion: '.center-section',
      RightRegion: '.right-section'
    },

    events: {
      'keydown': 'onKeyInView'
    },

    templateHelpers: function () {
      return {
        iconRight: !!this.options.iconRight ? this.options.iconRight : 'cs-icon-cross',
        dialogCloseButtonTooltip: lang.dialogCloseButtonTooltip,
        ariaDialogClose: lang.ariaDialogClose,
        hideDialogClose: this.options.hideDialogClose ? this.options.hideDialogClose : false
      };
    },

    constructor: function DialogHeaderView(options) {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    onRender: function (){
      var leftView = this.options.leftView,
          centerView = this.options.centerView,
          rightView = this.options.rightView;

      if (leftView) {
        this.LeftRegion.show(leftView);
      }

      if (centerView) {
        this.CenterRegion.show(centerView);
      }

      if (rightView) {
        this.RightRegion.show(rightView);
      }
    },

    isTabable: function () {
      return this.$('*[tabindex]').length > 0;
    },

    currentlyFocusedElement: function (event) {
      var tabElements = this.$('*[tabindex]');
      if (tabElements.length) {
        tabElements.prop('tabindex', 0);
      }
      if (!!event && event.shiftKey) {
        return $(tabElements[tabElements.length - 1]);
      } else {
        return $(tabElements[0]);
      }
    },

    onLastTabElement: function (shiftTab, event) {
      return (shiftTab && event.target === this.$('*[tabindex]')[0]);
    },

    onKeyInView: function (event) {
      var keyCode = event.keyCode;
      if (keyCode === 13 || keyCode === 32) {
        $(event.target).trigger("click");
      }
    }

  });

  return DialogHeaderView;

});