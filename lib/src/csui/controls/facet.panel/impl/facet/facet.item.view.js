/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery", "csui/utils/base", "csui/lib/underscore", "csui/lib/marionette",
  "csui/controls/checkbox/checkbox.view",
  "hbs!csui/controls/facet.panel/impl/facet/facet.item",
  'i18n!csui/controls/facet.panel/impl/nls/lang',
  "css!csui/controls/facet.panel/impl/facet/facet.item"
], function ($, base, _, Marionette, CheckboxView, template, lang) {

  var FacetItemView = Marionette.ItemView.extend({

    template: template,
    className: 'csui-facet-item',

    constructor: function FacetItemView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.showInputOnHover =  !base.isTouchBrowser();
    },

    triggers: {
      'click .csui-filter-name': 'single:filter:select'
    },

    ui: {
      name: '.csui-name'
    },

    events: {
      'click .csui-checkbox': 'onToggleCheckbox',
      'change .csui-checkbox': 'onChangeValue',
      'focus .csui-facet-item-checkbox': 'onFocus',
      'blur .csui-facet-item-checkbox': 'onBlur',
      'keyup .csui-facet-item-checkbox': 'onToggleCheckbox',
      'keydown .csui-filter-name': 'onToggleCheckbox'
    },

    templateHelpers: function(){
      var showOnHover = this.showInputOnHover? '' : 'csui-showAlways',
          count = this.options.model.get('count') ? this.options.model.get('count') : this.options.model.get('total');
      var filterTitleAria = _.str.sformat(lang.filterTitleAria, this.options.model.get('name'), count);
      var filterCheckboxAria = _.str.sformat(lang.filterCheckboxAria, this.options.model.get('name'), count);

      return {
        showOnHover: showOnHover,
        count: count,
        enableCheckBox: this.options.enableCheckBoxes,
        displayCount: this.options.displayCount,
        filterTitleAria: filterTitleAria,
        filterCheckboxAria: filterCheckboxAria
      };
    },

    onToggleCheckbox: function(event){
      var keyCode = event.keyCode,
          target = $(event.target);

      event.preventDefault();

      if (!keyCode) {
        this.triggerMethod('multi:filter:select');
      }

      switch (keyCode) {
        case 32:
        case 13:
          var checkbox = event.target;
          var checkboxView = this._checkboxRegion && this._checkboxRegion.currentView;
          var isChecked = checkbox && checkbox.getAttribute('aria-checked');
          if (isChecked === "true") {
            checkboxView && checkboxView.setChecked(false);
          } else {
            checkboxView && checkboxView.setChecked(true);
          }
          if (checkboxView) {
            this.triggerMethod('multi:filter:select');
          } else {
            this.triggerMethod('single:filter:select');
          }
          break;
        case 39:
        case 37:
          break;
        case 38:
        case 40:
          this.trigger('keyupdown', keyCode === 38, target);
          break;
        default:
          return true;
      }

      return false;
    },

    onChangeValue: function(event) {
      var checkbox = event.target;
      this._checkboxRegion.currentView.setDisabled(checkbox.disabled);
    },

    onDomRefresh: function() {
      if (this.options.enableCheckBoxes) {
        var checkboxDiv = this.$el.find(".csui-facet-item-checkbox");
        var checkboxTitle = _.str.sformat(lang.filterCheckboxAria, this.model.get('name'), this.model.get('total'));
        var checkboxAriaLabel = _.str.sformat(lang.filterCheckboxAria, this.model.get('name'), this.model.get('total'));
        if (!this._checkboxRegion) {
          var checkboxView = new CheckboxView({
            checked: false,
            disabled: false,
            ariaLabel: checkboxAriaLabel,
            title: checkboxTitle
          });

          this._checkboxRegion = new Marionette.Region({el: checkboxDiv});
          this._checkboxRegion.show(checkboxView);
        }
      }
    },

    onFocus: function (event) {
      var facet = $(event.target).closest('.csui-facet');
      if (facet.length > 0) {
        facet.addClass('csui-focus');
      }
    },

    onBlur: function (event) {
      var facet = $(event.target).closest('.csui-facet');
        if (facet.length > 0) {
          facet.removeClass('csui-focus');
        }
    },

    getIndex: function(){
      return this._index;
    }

  });

  return FacetItemView;

});
