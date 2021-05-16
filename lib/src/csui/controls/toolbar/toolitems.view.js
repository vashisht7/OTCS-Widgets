/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require',
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/toolbar/toolitem.view',
  'csui/controls/toolbar/flyout.toolitem.view',
  'csui/controls/toolbar/toolitem.custom.view',
  'csui/controls/toolbar/toolitems.factory',
  'hbs!csui/controls/toolbar/impl/flyout.toolitem',
  'i18n!csui/controls/toolbar/impl/nls/localized.strings'
], function (require, _, $, Backbone, Marionette, ToolItemView, FlyoutToolItemView,
    ToolItemCustomView, ToolItemsFactory, template, lang) {

  var ToolItemsView = Marionette.CollectionView.extend({
    tagName: "ul",
    attributes: function () {
      var attrs = {};
      if (this.options.role) {
        attrs.role = this.options.role;
      } else if (this.options.noMenuRoles) {
        attrs.role = 'presentation';
      } else {
        attrs.role = 'menu';
      }
      return attrs;
    },
    getChildView: function (item) {
      var customView = item.get('customView');
      var viewClass = item.get('viewClass');
      if (customView === true && viewClass && viewClass.prototype instanceof Backbone.View) {
        return ToolItemCustomView;
      }

      if (customView) {
        if (customView === true) {
          return item.get('commandData').customView || ToolItemView;
        }
        if (customView.prototype instanceof Backbone.View) {
          return customView;
        }
        if (typeof customView === 'string') {
        }
      }

      return item.get('flyout') ? FlyoutToolItemView : ToolItemView;
    },

    childViewOptions: function (model) {
      return {
        toolbarCommandController: this.options.toolbarCommandController,
        toolbarItemsMask: this.options.toolbarItemsMask,
        originatingView: this.options.originatingView,
        blockingParentView: this.options.blockingParentView,
        noMenuRoles: this.options.noMenuRoles,
        useIconsForDarkBackground: this.options.useIconsForDarkBackground
      };
    },
    constructor: function ToolItemsView(options) {
      options || (options = {});
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
    }
  });

  return ToolItemsView;

});