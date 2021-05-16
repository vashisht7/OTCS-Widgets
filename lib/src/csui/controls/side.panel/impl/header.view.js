/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/controls/side.panel/impl/header',
  'i18n!csui/controls/side.panel/impl/nls/lang',
  'css!csui/controls/side.panel/impl/side.panel'
], function (_, $, Marionette, TabableRegion, template, lang) {

  var SidePanelHeaderView = Marionette.ItemView.extend({

    template: template,

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegion
      }
    },

    isTabable: function () {
      return this.$('*[tabindex]').length > 0;
    },

    currentlyFocusedElement: function (event) {
      return this.$('*[tabindex]')[0];
    },

    onLastTabElement: function (shiftTab, event) {
      return (shiftTab && event.target === this.$('*[tabindex]')[0]);
    },

    onKeyInView: function (event) {
      var keyCode = event.keyCode;
      if (keyCode === 13 || keyCode === 32) {
        $(event.target).trigger('click');
      }
    },

    className: 'cs-header-control',

    ui: {
      title: '.csui-sidepanel-title .csui-sidepanel-heading',
      subTitle: '.csui-sidepanel-title .csui-sidepanel-subheading',
      closeBtn: '.csui-sidepanel-close'
    },

    events: {
      'keydown': 'onKeyInView'
    },

    triggers: {
      "click @ui.closeBtn": "close:click"
    },

    templateHelpers: function () {
      return {
        closeTooltip: lang.closeBtnTooltip,
        closeAria: lang.closeBtnTooltip // the actual title is not yet known at this point
      };
    },

    constructor: function SidePanelHeaderView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    update: function (slide) {
      this.ui.title.text(slide.title);
      this.ui.title.attr({'title': slide.title});
      this.ui.closeBtn.attr('aria-label', _.str.sformat(lang.closeBtnAria, slide.title));
      if (!!slide.subTitle) {
        this.ui.subTitle.removeClass('binf-hidden');
        this.ui.subTitle.text(slide.subTitle);
        this.ui.subTitle.attr({'title': slide.subTitle});
      } else {
        this.ui.subTitle.addClass('binf-hidden');
      }
    }

  });

  return SidePanelHeaderView;
});