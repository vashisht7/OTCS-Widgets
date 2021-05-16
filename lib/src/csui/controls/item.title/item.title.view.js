/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/log',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/item.title/impl/name/name.view',
  'csui/controls/item.title/impl/dropdown.menu/dropdown.menu.view',
  'csui/controls/item.title/impl/node.state/node.state.view',
  'hbs!csui/controls/item.title/impl/item.title',
  'css!csui/controls/item.title/impl/item.title'
], function ($, _, Backbone, Marionette, log,
    NodeTypeIconView,
    ItemTitleNameView,
    DropdownMenuView,
    NodeStateView,
    template) {
  'use strict';

  var ItemTitleView = Marionette.LayoutView.extend({
    className: 'csui-item-title',
    template: template,

    ui: {
      icon: '.csui-item-title-icon',
      name: '.csui-item-title-name',
      menu: '.csui-item-title-menu',
      nodeState: '.csui-item-title-node-state'
    },

    regions: {
      iconRegion: '@ui.icon',
      nameRegion: '@ui.name',
      menuRegion: '@ui.menu',
      nodeStateRegion: '@ui.nodeState'
    },

    constructor: function ItemTitleView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    initialize: function () {
      this.iconView = new NodeTypeIconView({
        node: this.options.model
      });

      this.nameView = new ItemTitleNameView({
        context: this.options.context,
        model: this.options.model,
        originatingView: this.options.originatingView
      });
      this.listenTo(this.nameView, 'changed:editmode', function (modeIsEditing) {
        if (modeIsEditing) {
          this.ui.menu.addClass('binf-hidden');
        } else {
          this.ui.menu.removeClass('binf-hidden');
        }
      });

      this.menuView = new DropdownMenuView({
        context: this.options.context,
        model: this.options.model,
        originatingView: this.options.originatingView,
        toolItems: this.options.toolItems,
        toolItemsMask: this.options.toolItemsMask,
        commands: this.options.commands
      });
      this.listenTo(this.menuView, 'rename', function () {
        this.nameView._toggleEditMode.call(this.nameView, true);
      });

      this.nodeStateView = new NodeStateView({
        context: this.options.context,
        model: this.options.model,
        tableView: this.options.originatingView
      });
    },

    onRender: function () {
      this.iconRegion.show(this.iconView);
      this.nameRegion.show(this.nameView);
      this.menuRegion.show(this.menuView);
      this.nodeStateRegion.show(this.nodeStateView);
    },

    onDomRefresh: function () {
      _.each(this.regionManager._regions, function (region) {
        if (region.currentView) {
          region.currentView.triggerMethod('dom:refresh');
        }
      });
    },

    onShow: function () {
      _.each(this.regionManager._regions, function (region) {
        if (region.currentView) {
          region.currentView.triggerMethod('show');
        }
      });
    },

    onAfterShow: function () {
      _.each(this.regionManager._regions, function (region) {
        if (region.currentView) {
          region.currentView.triggerMethod('after:show');
        }
      });
    },

    closeMenu: function () {
      this.menuView && this.menuView.trigger('close:menu');
    }

  });

  return ItemTitleView;
});
