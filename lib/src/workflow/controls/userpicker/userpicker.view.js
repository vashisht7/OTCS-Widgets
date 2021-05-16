/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/userpicker/userpicker.view'
], function (_, $, Marionette, TabableRegionBehavior, UserPickerView) {
  'use strict';
  var TabableUserPickerView = UserPickerView.extend({

    events: {
      'change @ui.searchbox': 'onChange'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function TabableUserPickerView(options) {
      UserPickerView.prototype.constructor.call(this, options);
      this.listenTo(this, 'item:change', this.onItemChanged);
    },
    currentlyFocusedElement: function () {
      return $(this.ui.searchbox);
    },
    onChange: function (e) {
      var name = this.model ? this.model.get('name_formatted') : '';
      if ((this.ui.searchbox.val() === "" && name) ||
          ((!!name && name !== this.ui.searchbox.val()) &&
          ((this.collection && this.collection.length === 0) ||
          this.$el.find('ul.typeahead.binf-dropdown-menu li.binf-active').length === 0))) {
        this.ui.searchbox.val('');
        this.triggerMethod('item:remove');
      }
    },

    onItemChanged: function (e) {
      this.model = e.item;
    }
  });
  return TabableUserPickerView;

});