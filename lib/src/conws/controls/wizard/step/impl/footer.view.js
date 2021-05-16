/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/wizard/step/impl/footer.view'
], function (Marionette, TabableRegion, WizardStepFooterView) {

  var ConwsButtonView = Marionette.ItemView.extend({

    tagName: 'button',

    className: 'binf-btn',

    template: false,

    triggers: {
      'click': 'click'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegion
      }
    },

    constructor: function ButtonView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);
    },

    isTabable: function () {
      return this.$el.is(':not(:disabled)') && this.$el.is(':not(:hidden)');
    },
    currentlyFocusedElement: function () {
      if (this.$el.prop('tabindex') === -1) {
        this.$el.prop('tabindex', 0);
      }
      return this.$el;
    },

    onRender: function () {
      var button = this.$el,
        attributes = this.model.attributes;
      if (typeof attributes.isButton === 'undefined') {
        button.text(attributes.label);
        button.addClass('binf-btn');
        button.addClass(
          attributes['default'] ? 'binf-btn-primary cs-add-button' : 'binf-btn-default');
        if (attributes.toolTip) {
          button.attr('title', attributes.toolTip);
        }
        if (attributes.separate) {
          button.addClass('cs-separate');
        }
      }
      else {
        button.addClass('arrow_back button_image');
        if (attributes.toolTip) {
          button.attr({ 'title': attributes.toolTip, 'aria-label': attributes.toolTip, 'role': 'link' });
        }
        if (attributes.id === 'next') {
          button.addClass("button_image_next");
        }
      }
      this.updateButton(attributes);
    },

    updateButton: function (attributes) {
      var $button = this.$el;

      attributes || (attributes = {});
      if (attributes.hidden !== undefined) {
        if (attributes.hidden) {
          $button.addClass('binf-hidden');
        } else {
          $button.removeClass('binf-hidden');
        }
      }
      if (attributes.disabled !== undefined) {
        $button.prop('disabled', attributes.disabled);
      }
    }
  });

  var ConwsWizardStepFooterView = WizardStepFooterView.extend({

    childView: ConwsButtonView,

    constructor: function ConwsWizardStepFooterView(options) {
      WizardStepFooterView.prototype.constructor.apply(this, arguments);
    }
  });

  return ConwsWizardStepFooterView;
});
