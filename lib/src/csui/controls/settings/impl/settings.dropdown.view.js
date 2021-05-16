/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette3',
  'i18n!csui/controls/settings/impl/nls/lang',
  'csui/controls/settings/selected.columns/selected.columns.view',
  'csui/controls/settings/summary.description/summary.description.view',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/controls/settings/impl/settings.dropdown'
], function ($, _, Backbone, Marionette, lang, SelectedColumnsView, SummaryDescriptionView,
    TabableRegionBehavior, template) {
  'use strict';

  var SettingsDropDownOptionView = Marionette.View.extend({
    tagName: 'li',
    template: template,
    className: 'binf-list-group-item',
    triggers: {
      'click a': {event: "show:settings"},
      'keydown a': {event: "show:settings:dropdown", preventDefault: false}
    },

    constructor: function SettingsDropDownOptionView(options) {
      options || (options = {});
      this.options = options;
      Marionette.View.call(this, options);
    },

    showColumnsSettings: function (event) {
      var display = this.model && this.model.get('display'),
          selectedColumnsCollection, availableColumnsCollection;
      if (display && display.display_regions) {
        selectedColumnsCollection = display.display_regions.selected;
        availableColumnsCollection = display.display_regions.available;
      }
      selectedColumnsCollection && selectedColumnsCollection.where({
        isNew: true
      }).map(function (model) {
        model.set({
          isNew: false
        }, {
          silent: true
        });
      });
      this.options.showSettings('selectedColumnsContainer', new SelectedColumnsView({
        settingsDropDownView: this,
        tableCollection: this.options.tableCollection,
        collection: selectedColumnsCollection,
        availableColumnsCollection: availableColumnsCollection,
        settings: this.model
      }));
    },

    showSummaryOrDescription: function (event) {
      var display = this.model && this.model.get('display'),
          availableCollection, selectedCollection;
      if (display.summary_description && display.summary_description.available) {
        availableCollection = display.summary_description.available;
        selectedCollection = display.summary_description.selected;
      }
      this.options.originatingView.showSettings('summaryOrDescriptionContainer',
          new SummaryDescriptionView({
            settingsDropDownView: this,
            selectedCollection: selectedCollection,
            availableCollection: availableCollection,
            collection: availableCollection,
            settings: this.model
          }));
    }

  });

  var SettingsDropDownView = Marionette.CollectionView.extend({
    constructor: function SettingsDropDownView() {
      this.focusIndex = 0;
      Marionette.CollectionView.apply(this, arguments);
    },

    className: 'binf-list-group',

    tagName: 'ul',

    childView: SettingsDropDownOptionView,

    childViewEvents: {
      'show:settings:dropdown': 'onShowSettingsDropdown',
      'show:settings': 'onShowSettings'
    },

    childViewOptions: function () {
      return {
        settingsView: this.options.settingsView
      };
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
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

    onShowSettings: function (view, event) {
      this.options.settingsView.showSettings(view.model.get('id'), view.model.get(
          'view'));
    },

    onShowSettingsDropdown: function (view, event) {
      var keyCode    = event.keyCode,
          focusables = this.$el.find('a[tabindex]');
      if (keyCode === 27) {
        this.$el.closest(".csui-search-settings").trigger('focus');
        this.options.settingsView.triggerMethod('close:menu', event);
      } else if (keyCode === 13 || keyCode === 32 || keyCode === 39) {
        this.onShowSettings(view, event);
      } else if (focusables.length) {
        if (keyCode === 38 || keyCode === 40) {
          if (keyCode === 38) { //up arrow
            this.focusIndex > 0 && --this.focusIndex;
          }
          else {//down arrow
            this.focusIndex < (focusables.length - 1) && ++this.focusIndex;
          }
          $(focusables[this.focusIndex]).trigger('focus');
          event.stopPropagation();
          event.preventDefault();
        }
      }
    }
  });
  return SettingsDropDownView;
});