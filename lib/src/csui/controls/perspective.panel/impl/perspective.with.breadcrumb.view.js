/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/marionette',
  'csui/utils/namedlocalstorage',
  'csui/utils/contexts/factories/user',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/controls/breadcrumbspanel/breadcrumbspanel.view',
  'csui/utils/contexts/factories/ancestors',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'hbs!csui/controls/perspective.panel/impl/perspective.with.breadcrumb'
], function (_, Marionette,
    NamedLocalStorage,
    UserModelFactory,
    ApplicationScopeModelFactory,
    BreadcrumbsPanelView,
    AncestorCollectionFactory,
    LayoutViewEventsPropagationMixin,
    template) {
  'use strict';

  var PerspectiveWithBreadcrumbView = Marionette.LayoutView.extend({
    className: 'cs-perspective-with-breadcrumb-view',

    template: template,

    regions: {
      breadcrumbRegion: '.csui-perspective-breadcrumb',
      perspectiveRegion: '.csui-perspective-view'
    },

    constructor: function PerspectiveWithBreadcrumbView(options) {
      options || (options = {});
      this.perspectiveView = options.perspectiveView;
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

      this.propagateEventsToRegions(); // propagate dom:refresh to child views
      this._supportMaximizeWidget = this.perspectiveView._supportMaximizeWidget;
      this._supportMaximizeWidgetOnDisplay = this.perspectiveView._supportMaximizeWidgetOnDisplay;
      if (_.isFunction(this.perspectiveView.serializePerspective)) {
        this.serializePerspective = function (perspectiveModel) {
          return this.perspectiveView.serializePerspective.apply(
              this.perspectiveView, arguments);
        };
      }
      this.widgetsResolved = this.perspectiveView.widgetsResolved;

      var perspectiveType = this.options.context.perspective.get('type');
      var perspectiveMarginClass;

      switch (perspectiveType) {
      case 'left-center-right':
        perspectiveMarginClass = 'cs_perspective_no_left_right_margin';
        break;
      default:
        perspectiveMarginClass = 'cs_perspective_with_left_right_margin';
      }

      this.$el.addClass(perspectiveMarginClass);

      this.user = this.options.context.getModel(UserModelFactory);
      this.listenTo(this.user, 'change', this.updateUserPreferences);
      this.applicationScope = this.options.context.getModel(ApplicationScopeModelFactory);

      this.listenTo(this.applicationScope, 'change:breadcrumbsVisible',
          this._showOrHideBreadcrumbs);
    },

    onRender: function () {
      var ancestors = this.options.context.getCollection(AncestorCollectionFactory);
      var breadcrumbsAvailable = ancestors.isFetchable();
      this.applicationScope.set('breadcrumbsAvailable', breadcrumbsAvailable);
      if (breadcrumbsAvailable) {
        var breadcrumbsPanel = new BreadcrumbsPanelView({
          context: this.options.context
        });
        this.breadcrumbRegion.show(breadcrumbsPanel);
      }

      this.perspectiveRegion.show(this.perspectiveView);
    },

    onDomRefresh: function () {
      this.updateUserPreferences();
    },

    updateUserPreferences: function () {
      var userId = this.user.get('id');
      this.userPreferences = userId ? new NamedLocalStorage(
          'userPreferences:' + userId) : undefined;
      if (this._isRendered && this.userPreferences) {
        var prefVisible = this.userPreferences.get('breadcrumbs-visible');
        if (prefVisible === undefined) {
          prefVisible = true;
        }
        this._setBreadcrumbsVisibility(prefVisible);
      } else {
        this._setBreadcrumbsVisibility(false);
      }
    },

    _showOrHideBreadcrumbs: function (args1, args2) {
      var breadcrumbsVisible = this.applicationScope.get('breadcrumbsVisible');
      this._setBreadcrumbsVisibility(breadcrumbsVisible);
    },

    _setBreadcrumbsVisibility: function (visible) {
      var breadcrumbsAvailable = this.applicationScope.get('breadcrumbsAvailable');
      if (visible && breadcrumbsAvailable) {
        this.$el.addClass('csui-breadcrumbs-visible');
        this.perspectiveView.$el.addClass('csui-breadcrumbs-visible');
      } else {
        this.$el.removeClass('csui-breadcrumbs-visible');
        this.perspectiveView.$el.removeClass('csui-breadcrumbs-visible');
      }
      if (this.userPreferences) {
        this.userPreferences.set('breadcrumbs-visible', visible);
      }
      this.applicationScope.set('breadcrumbsVisible', visible);
    }
  });

  _.extend(PerspectiveWithBreadcrumbView.prototype, LayoutViewEventsPropagationMixin);

  return PerspectiveWithBreadcrumbView;
});
