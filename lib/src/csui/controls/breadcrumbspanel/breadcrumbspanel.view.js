/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette', 'csui/utils/contexts/factories/ancestors',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/controls/breadcrumbs/breadcrumbs.view',
  'hbs!csui/controls/breadcrumbspanel/impl/breadcrumbspanel',
  'i18n!csui/controls/breadcrumbs/impl/breadcrumb/impl/nls/lang',
  'css!csui/controls/breadcrumbspanel/impl/breadcrumbspanel'
], function (Marionette, AncestorCollectionFactory, ApplicationScopeModelFactory, BreadcrumbsView,
    BreadcrumbsPanelTemplate, lang) {
  'use strict';

  var BreadcrumbsPanelView = Marionette.LayoutView.extend({

    attributes: {id: 'breadcrumb-wrap'},

    className: 'binf-container-fluid',

    template: BreadcrumbsPanelTemplate,

    ui: {
      tileBreadcrumb: '.tile-breadcrumb',
      breadcrumbsWrap: '#breadcrumb-wrap'
    },

    regions: {
      breadcrumbsInner: '.breadcrumb-inner'
    },

    templateHelpers: function () {
      return {
        breadcrumbAria: lang.breadcrumbAria
      };
    },

    constructor: function BreadcrumbsPanelView(options) {

      Marionette.LayoutView.apply(this, arguments);

      this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);
      this.listenTo(this.applicationScope, 'change:breadcrumbsVisible',
          this._showOrHideBreadcrumbs);

      this.ancestors = this.options.context.getCollection(AncestorCollectionFactory);

      this.listenTo(this, 'dom:refresh', function () {
        if (this.breadcrumbs) {
          this.breadcrumbs.refresh(); // calls _adjustToFit
        }
      });
    },

    onRender: function () {
      this._showOrHideBreadcrumbs();
    },

    _showOrHideBreadcrumbs: function () {
      this._breadcrumbsVisible = this.applicationScope.get('breadcrumbsVisible');
      this._breadcrumbsAvailable = this.ancestors.isFetchable();
      if (this._breadcrumbsVisible && this._breadcrumbsAvailable) {
        if (!this.breadcrumbs) {
          this.breadcrumbs = new BreadcrumbsView({
            context: this.options.context,
            collection: this.ancestors,
            fetchOnCollectionUpdate: false
          });
          this.breadcrumbsInner.show(this.breadcrumbs);
          this.breadcrumbs.synchronizeCollections();
          this.$el.addClass('breadcrumb-wrap-visible');
          this.triggerMethod("tabable", this);
          this.breadcrumbs.triggerMethod("refresh:tabindexes");
        }
      } else {
        if (this.breadcrumbs) {
          this.$el.removeClass('breadcrumb-wrap-visible');
          this.breadcrumbsInner.empty();
          delete this.breadcrumbs;
        }
      }
    },

    hideBreadcrumbs: function () {
      if (this.breadcrumbs) {
        this.breadcrumbs.hideSubCrumbs();
      }
      this.$el.removeClass('breadcrumb-wrap-visible');
      this.triggerMethod("tabable:not", this);
      this.$el.hide();
    },

    showBreadcrumbs: function () {
      this.$el.addClass('breadcrumb-wrap-visible');
      this.triggerMethod("tabable", this);
      this.$el.show();
      this.breadcrumbs && this.breadcrumbs.triggerMethod("refresh:tabindexes");
    },

    isTabable: function () {
      if (this.breadcrumbs) {
        return this.ancestors.size() > 1;
      } else {
        return false;
      }
    }

  });

  return BreadcrumbsPanelView;
});
