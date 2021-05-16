/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'i18n!csui/widgets/navigation.header/controls/breadcrumbs/impl/nls/localized.strings',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/utils/contexts/factories/ancestors',
  'csui/utils/contexts/factories/application.scope.factory',
  'hbs!csui/widgets/navigation.header/controls/breadcrumbs/impl/breadcrumbs',
  'css!csui/widgets/navigation.header/controls/breadcrumbs/impl/breadcrumbs'
], function (_, $, Marionette, localizedStrings, TabableRegionBehavior,
    AncestorCollectionFactory, ApplicationScopeModelFactory,
    template) {
  'use strict';

  var BreadcrumbsView = Marionette.ItemView.extend({
    tagName: 'div',

    className: 'breadcrumbs-handle',

    ui: {
      caretShowBreadcrumbs: '.caret-show-breadcrumb',
      btnShowBreadcrumbs: '.btn-show-breadcrumb',
      caretHideBreadcrumbs: '.caret-hide-breadcrumb',
      btnHideBreadcrumbs: '.btn-hide-breadcrumb'
    },

    serializeData: function () {
      return {
        showBreadcrumbs: localizedStrings.ShowBreadcrumbs,
        showBreadcrumbsAria: localizedStrings.ShowBreadcrumbs,
        hideBreadcrumbs: localizedStrings.HideBreadcrumbs,
        hideBreadcrumbsAria: localizedStrings.HideBreadcrumbs
      };
    },

    template: template,

    events: {
      'keydown': 'onKeyInView',
      'click @ui.caretShowBreadcrumbs': '_showBreadcrumbs',
      'click @ui.btnShowBreadcrumbs': '_showBreadcrumbs',
      'click @ui.caretHideBreadcrumbs': '_hideBreadcrumbs',
      'click @ui.btnHideBreadcrumbs': '_hideBreadcrumbs'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function () {
      if (this._breadcrumbsVisible) {
        return this.$el;
      }
      return undefined;
    },
    
    onRender: function () {
      if (matchMedia) {
        this._mq = window.matchMedia("(max-width: 1024px)");
        this._mq.addListener(_.bind(this._windowsWidthChange, this));
        this._windowsWidthChange(this._mq);
      }
    },
    
    constructor: function BreadcrumbsView(options) {
      Marionette.ItemView.call(this, options);

      this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);
      this.listenTo(this.applicationScope, 'change:breadcrumbsVisible',
          this._breadcrumbVisibilityChanged);
      this.listenTo(this.applicationScope, 'change:breadcrumbsAvailable',
          this._breadcrumbAvailabilityChanged);
      this._breadcrumbVisibilityChanged();
      this._breadcrumbAvailabilityChanged();
    },

    _breadcrumbVisibilityChanged: function () {
      this._breadcrumbsVisible = this.applicationScope.get('breadcrumbsVisible');
      if (this._breadcrumbsVisible) {
        this.$el.removeClass('csui-breadcrumbs-hidden');
        this.triggerMethod('refresh:tabindexes');
      } else {
        this.$el.addClass('csui-breadcrumbs-hidden');
      }
    },

    _breadcrumbAvailabilityChanged: function () {
      this._breadcrumbsAvailable = this.applicationScope.get('breadcrumbsAvailable');
      if (this._breadcrumbsAvailable) {
        this.$el.removeClass('csui-breadcrumbs-not-available');
        this.triggerMethod('refresh:tabindexes');
      } else {
        this.$el.addClass('csui-breadcrumbs-not-available');
      }
    },

    _showBreadcrumbs: function () {
      this.applicationScope.set('breadcrumbsVisible', true);
    },

    _hideBreadcrumbs: function () {
      this.applicationScope.set('breadcrumbsVisible', false);
    },

    _windowsWidthChange: function(mq) {
      if (mq.matches) {
        this._previousBreadcrumbState =  this.applicationScope.get('breadcrumbsVisible');
        this.applicationScope.set('breadcrumbsVisible', true);
      } else {
        this.applicationScope.set('breadcrumbsVisible', this._previousBreadcrumbState);
      }  
    },

    onKeyInView: function (event) {
      switch (event.keyCode) {
      case 9:
        this.ignoreFocusBlur = false;
        break;
      case 13:
      case 32:
        this.ignoreFocusBlur = false;
        this.applicationScope.set('breadcrumbsVisible', !this._breadcrumbsVisible);
        break;
      }
    }

  });

  return BreadcrumbsView;
});
