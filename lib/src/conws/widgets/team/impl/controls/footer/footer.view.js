/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'hbs!conws/widgets/team/impl/controls/footer/impl/footer',
  'hbs!conws/widgets/team/impl/controls/footer/impl/button',
  'css!conws/widgets/team/impl/controls/footer/impl/footer'
], function (_, $, Marionette, Handlebars, TabableRegionBehavior, LayoutViewEventsPropagationMixin,
    templateFooter, templateButton) {

  var ButtonView = Marionette.ItemView.extend({

    tagName: 'span',
    templateHelpers: function () {
      return {
        label: this.model.get('label'),
        css: this.model.get('css'),
        disabled: this.model.get('disabled'),
        close: this.model.get('close')
      };
    },

    template: templateButton,

    ui: {
      button: '.btn-footer'
    },

    events: {
      'click @ui.button': 'onClick'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    onClick: function (e) {
      var callback = this.model.get('click');
      if (callback && _.isFunction(callback)) {
        callback(e);
      }
    },

    constructor: function ButtonView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.model, 'change', this.render);
    },

    isTabable: function () {
      return $(this.ui.button).is(':enabled');
    },

    currentlyFocusedElement: function () {
      return this.ui.button;
    }
  });

  var FooterView = Marionette.LayoutView.extend({

    regions: {
      resetRegion: '.conws-roles-edit-reset-region',
      submitRegion: '.conws-roles-edit-save-region',
      cancelRegion: '.conws-roles-edit-cancel-region'
    },

    template: templateFooter,

    constructor: function FooterView(options) {
      this.buttons = options.collection.models;
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.listenTo(this , 'updateButton', this.updateButton);
      this.propagateEventsToRegions();
    },

    onRender: function () {
      var self = this;
      _.each(this.buttons, function (button) {
        if (button.id === 'reset') {
          self.resetView = new ButtonView({
            model: button,
            initialActivationWeight: button.get('initialActivationWeight')
          });
          self.resetRegion.show(self.resetView);
        } else if (button.id === 'submit') {
          self.submitView = new ButtonView({
            model: button,
            initialActivationWeight: button.get('initialActivationWeight')
          });
          self.submitRegion.show(self.submitView);
        } else if (button.id === 'cancel') {
          self.cancelView = new ButtonView({
            model: button,
            initialActivationWeight: button.get('initialActivationWeight')
          });
          self.cancelRegion.show(self.cancelView);
        }
      });
    },

    updateButton: function () {
      var self = this;
      _.each(self.collection.models, function (button) {
        if (!button.get('disabled')) {
          if (button.id === 'submit') {
            self.submitView.currentlyFocusedElement().focus();
          } else if (button.id === 'cancel') {
            self.cancelView.currentlyFocusedElement().focus();
          } else if (button.id === 'reset') {
            self.resetView.currentlyFocusedElement().focus();
          }
        }
      });
    }
  });
  _.extend(FooterView.prototype, LayoutViewEventsPropagationMixin);
  return FooterView;
});