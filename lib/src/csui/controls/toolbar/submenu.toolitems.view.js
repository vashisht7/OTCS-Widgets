/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/controls/toolbar/toolitems.view'
], function (_, $, Backbone, Marionette, ToolItemsView) {
  'use strict';

  var SubMenuToolItemsView = ToolItemsView.extend({

    childViewOptions: function (model) {
      return _.extend(ToolItemsView.prototype.childViewOptions.call(this, model), {
        collection: this.collection,
        renderIconAndText: this.options.renderIconAndText,
        renderTextOnly: this.options.renderTextOnly
      });
    },

    renderIconAndText: function () {
      _.each(this.children, function (toolItem) {
        toolItem.renderIconAndText();
      });
    },

    renderTextOnly: function () {
      _.each(this.children, function (toolItem) {
        toolItem.renderTextOnly();
      });
    },

  });

  return SubMenuToolItemsView;

});