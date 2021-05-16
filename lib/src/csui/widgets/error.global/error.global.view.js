/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/utils/base',
  'csui/utils/contexts/factories/global.error', 'csui/utils/contexts/factories/application.scope.factory',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/widgets/error.global/impl/error.global',
  'i18n!csui/widgets/error.global/impl/nls/lang',
  'css!csui/widgets/error.global/impl/error.global'
], function (_, $, Marionette, base, GlobalErrorModelFactory,
    ApplicationScopeModelFactory, TabableRegionBehavior, template, lang) {
  'use strict';

  var GlobalErrorView = Marionette.ItemView.extend({
    className: 'csui-global-error',

    template: template,
    templateHelpers: function () {
      return {
        errorMessage: lang.errorMessage,
        backText: lang.backText,
        backTooltip: lang.backTooltip,
        homeText: lang.homeText,
        homeTooltip: lang.homeTooltip,
        msgId: _.uniqueId('msg')
      };
    },

    TabableRegion: {
      behaviorClass: TabableRegionBehavior,
      initialActivationWeight: 100
    },

    ui: {
      errorMessage: '.error-message > span'
    },

    events: {
      'keydown': 'onKeyInView',
      'click .go-home-button': 'onClickHome',
      'click .go-home-text': 'onClickHome',
      'click .go-back-button': 'onClickBack',
      'click .go-back-text': 'onClickBack'
    },

    constructor: function GlobalErrorView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      if (!this.model) {
        this.model = options.context.getModel(GlobalErrorModelFactory, options);
      }
      this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);
      if (base.isIE11()) {
        var self = this;
        var resizeHandler = function () {
          self.render();
        };
        $(window).on('resize', resizeHandler);
        this.once('before:destroy', function () {
          $(window).off('resize', resizeHandler);
        });
      }
    },

    currentlyFocusedElement: function (event) {
      return this.ui.errorMessage;
    },

    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        event.preventDefault();
        event.stopPropagation();
        $(event.target).trigger('click');
      }
    },

    onClickHome: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.applicationScope && this.applicationScope.set('id', '');
    },

    onClickBack: function (event) {
      event.preventDefault();
      event.stopPropagation();
      window.history.back();
    }

  });

  return GlobalErrorView;
});
