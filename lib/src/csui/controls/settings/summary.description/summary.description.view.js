/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette3',
  'i18n!csui/controls/settings/impl/nls/lang',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/controls/settings/summary.description/impl/summary.descriptions',
  'hbs!csui/controls/settings/summary.description/impl/summary.description'
], function ($, _, Backbone, Marionette, lang, TabableRegionBehavior, template, itemTemplate) {
  'use strict';

  var SummaryDescriptionItemView = Marionette.View.extend({

    template: itemTemplate,

    className: 'column-item',
    templateContext: function () {
      return {
        name: this._nameResolver(),
        label: this.model.get('key'),
        checked: !!this.model.get('selected')
      };
    },

    ui: {
      itemContainer: '.column-item-container'
    },

    triggers: {
      'click @ui.itemContainer': 'click:itemContainer',
      'keydown @ui.itemContainer': {event: "keydown:itemContainer", stopPropagation:false, preventDefault: false}
    },

    constructor: function SummaryDescriptionItemView(options) {
      options || (options = {});
      this.options = options;
      Marionette.View.call(this, options);
      this.listenTo(this.model, 'change', this.render);
    },

    _nameResolver: function () {
      var key = this.model.get('key'), name;
      switch (key) {
        case 'SO': {
          name = lang.SummaryOnly;
          break;
        }
        case 'SP': {
          name = lang.SummaryPreferred;
          break;
        }
        case 'DO': {
          name = lang.DescriptionOnly;
          break;
        }
        case 'DP': {
          name = lang.DescriptionPreferred;
          break;
        }
        case 'SD': {
          name = lang.SummaryAndDescription;
          break;
        }
        default: {
          name = this.model.get('name');
        }
      }
      return name;
    }

  });

  var SummaryDescriptionCollectionView = Marionette.CollectionView.extend({

    childView: SummaryDescriptionItemView,

    childViewOptions: {
    },

    constructor: function SummaryDescriptionCollectionView(options) {
      options || (options = {});
      this.options = options;
      this.focusIndex = 0;
      Marionette.CollectionView.call(this, options);
    },

    onChildviewClickItemContainer: function (childView) {
      this.selectSummary(childView);
    },

    selectSummary: function (childView) {
      this.collection.findWhere({selected: true}).unset('selected');
      childView.model.set('selected', true);
      this.options.settingsView.options.data.summary_description = 
          childView.model.get('key');
      this.options.selectedCollection = childView.model.get('key');
      this.options.settingsView.model.get(
          'display').summary_description.selected = childView.model.get('key');
      childView.$el.find(".column-item-container").trigger('focus');
    },

    onChildviewKeydownItemContainer: function (childView, event) {
      var keyCode    = event.keyCode,
          focusables = this.$el.find('*[tabindex]');
      if (keyCode === 27) {
        this.$el.closest(".csui-search-settings").trigger('focus');
        this.options.settingsView.triggerMethod('close:menu', event);
      } else if (keyCode === 13 || keyCode === 32) {
        this.selectSummary(childView);
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
        if (event.keyCode === 9) {
          var backArrowElement = this.$el.parents(".csui-summary-description-list").find(
              '.arrow_back');
          backArrowElement.trigger('focus');
          event.stopPropagation();
          event.preventDefault();
        }
      }
    }

  });

  var SummaryDescriptionView = Marionette.View.extend({

    template: template,

    className: 'csui-summary-description-list',

    ui: {
      backArrow: '.arrow_back'
    },

    events: {
      'click @ui.backArrow': 'onClickBackArrow',
      'keydown @ui.backArrow': 'onKeyPressBackArrow',
      "keydown": "onKeyInView"
    },

    regions: {
      columnsList: '.columns-list'
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

    templateContext: function () {
      var self = this;
      _.each(this.options.availableCollection && this.options.availableCollection.models,
          function (model, index) {
            if (model.get('key') === self.options.selectedCollection) {
              model.set('selected', true);
              model.set('checked',true);
            }
          });
      return {
        label: lang.summaryDescriptionTitle,
        available: this.options.availableCollection && this.options.availableCollection.models,
        backButtonTitle: lang.SearchBackToolTip,
        backButtonAria: lang.SearchBackAria
      };
    },

    constructor: function SummaryDescriptionView(options) {
      options || (options = {});
      this.options = options;
      Marionette.View.call(this, options);
    },

    onClickBackArrow: function (event) {
      this.showSettingsView(event);
    },

    onKeyPressBackArrow: function (event) {
      var keyCode = event.keyCode;
      if (keyCode === 13 || keyCode === 32 || keyCode === 37) {
        this.showSettingsView(event);
        event.stopPropagation();
        event.preventDefault();
      }
    },

    showSettingsView: function (event) {
      this.options.settingsView.showSettings("settingsDropDownContainer",
          this.options.settingsView.settingsDropDownView);
    },

    onRender: function () {
      this.summaryDescriptionCollectionView = new SummaryDescriptionCollectionView(this.options);
      this.showChildView('columnsList', this.summaryDescriptionCollectionView);
    },

    onKeyInView: function (event) {
      var keyCode    = event.keyCode,
          focusables = this.$el.find('.column-item-container'),
          focusIndex = 0;
      if (keyCode === 27) {
        this.$el.closest(".csui-search-settings").trigger('focus');
        this.options.settingsView.triggerMethod('close:menu', event);
      } else if (focusables.length) {
        if (keyCode === 9 || keyCode === 16) { // tab
          if (event.shiftKey) {
            focusIndex = focusables.length - 1;
          } else {
            focusIndex = 0;
          }
          this.summaryDescriptionCollectionView.focusIndex = 0;
          $(focusables[focusIndex]).trigger('focus');
          event.stopPropagation();
          event.preventDefault();
        }
      }
    }
  });

  return SummaryDescriptionView;
});