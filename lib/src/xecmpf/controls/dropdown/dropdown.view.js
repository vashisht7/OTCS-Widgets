/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/lib/binf/js/binf',
  'xecmpf/controls/dropdown/dropdownitem.view',
  'hbs!xecmpf/controls/dropdown/impl/dropdown',
  'css!xecmpf/controls/dropdown/impl/dropdown'
], function (_, $, Backbone, Marionette, BinfJS,
    DropdownItemView, template, css) {

  var DropdownView;

  DropdownView = Marionette.CompositeView.extend({

    className: 'xecmpf-dropdown binf-dropdown',

    constructor: function DropdownView(options) {
      options || (options = {});
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      this.label = this.options.label;
    },

    template: template,

    templateHelpers: function () {
      return {
        dropdownLabel: this.label || 'Dropdown'
      }
    },

    ui: {
      control: '.binf-dropdown-toggle',
      label: '.dropdown-label'
    },

    childView: DropdownItemView,

    childViewContainer: 'ul.binf-dropdown-menu',

    childEvents: {
      'render': 'onRenderChild',
      'click:item': 'onClickItem'
    },

    onRenderChild: function (childView) {
      var currModel = childView.model;
      if (currModel.get('active') === true) {
        childView.$el
            .addClass('binf-active')
            .siblings().removeClass('binf-active');
        this.currModel = currModel;
      }
      if (currModel.get('hide') === true) {
        childView.$el.addClass('binf-hidden');
      }
    },

    onClickItem: function (childView) {
      if (!childView.$el.hasClass('binf-active')) {
        var newModel = childView.model,
            args     = {
              currModel: this.currModel,
              newModel: newModel
            };
        this.triggerMethod('change:dropdown:item', args);
        if (args.change !== false) {
          childView.$el
              .addClass('binf-active')
              .siblings().removeClass('binf-active');
          this.currModel = newModel;
        }
        this.hideDropdownMenu();
      }
    },

    showDropdownMenu: function () {
      this.$el.addClass('binf-open');
      this.ui.control.attr('aria-expanded', true);
    },

    hideDropdownMenu: function () {
      this.$el.removeClass('binf-open');
      this.ui.control.attr('aria-expanded', false);
    },

    updateLabel: function (newLabel) {
      if (newLabel && typeof newLabel === 'string') {
        this.ui.label.text(newLabel);
      }
    },

    setModelActive: function (model) {
      if (model instanceof Backbone.Model) {
        model.unset('active', {silent: true});
        model.set('active', true);
      }
    },

    setModelHide: function (model) {
      if (model instanceof Backbone.Model) {
        model.unset('hide', {silent: true});
        model.set('hide', true);
      }
    },

    onRender: function () {
      this.ui.control.binf_dropdown();
    }
  });

  return DropdownView;
});
