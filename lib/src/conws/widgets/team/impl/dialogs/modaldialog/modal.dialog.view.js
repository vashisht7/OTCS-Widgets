/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'hbs!conws/widgets/team/impl/dialogs/modaldialog/impl/modal.dialog.view',
  'css!conws/widgets/team/impl/dialogs/modaldialog/impl/modal.dialog.view'
], function (_, $, Backbone, Marionette, TabablesBehavior, template) {

  var NonEmptyingRegion = Marionette.Region.extend({

    constructor: function NonEmptyingRegion(options) {
      Marionette.Region.prototype.constructor.apply(this, arguments);
    },

    attachHtml: function (view) {
      this.el.appendChild(view.el);
    }
  });

  var ModalDialogView = Marionette.LayoutView.extend({

    className: 'cs-dialog binf-modal binf-fade conws-modal-dialog-parent',

    attributes: {
      'tabindex': '-1',
      'role': 'dialog',
      'aria-hidden': 'true'
    },

    template: template,

    templateHelpers: function () {
      return {
        existsHeader: !_.isUndefined(this.options.header),
        existsBody: !_.isUndefined(this.options.body),
        existsFooter: !_.isUndefined(this.options.footer),
        modalClassName: this.options.modalClassName
      }
    },

    behaviors: {
      TabablesBehavior: {
        behaviorClass: TabablesBehavior,
        recursiveNavigation: true,
        containTabFocus: true
      }
    },

    ui: {
      header: '.dialog-header',
      body: '.dialog-body',
      footer: '.dialog-footer'
    },

    regions: {
      header: '.dialog-header',
      body: '.dialog-body',
      footer: '.dialog-footer'
    },

    events: {
      'keydown': 'onKeyDown',
      'hidden.binf.modal': 'onHidden',
      'shown.binf.modal': 'onShown'
    },
    constructor: function ModalDialogView(options) {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    show: function () {
      var container = $.fn.binf_modal.getDefaultContainer ? $.fn.binf_modal.getDefaultContainer() : document.body,
          region = new NonEmptyingRegion({el: container});
      region.show(this);
      return this;
    },

    destroy: function () {
      if (this.$el.is(':visible')) {
        this.$el.binf_modal('hide');
      } else {
        ModalDialogView.__super__.destroy.apply(this, arguments);
      }
      $('body').addClass('binf-modal-open');
      return this;
    },

    kill: function () {
      ModalDialogView.__super__.destroy.apply(this, arguments);
      return true;
    },

    onRender: function () {
      if (this.options.dialogTxtAria) {
        this.$el.attr({
            'aria-label': this.options.dialogTxtAria
          });
      }
      if (this.options.body) {
        this.body.show(this.options.body);
      }
    },

    onShow: function () {
      this.$el.binf_modal({
        backdrop: 'static',
        keyboard: false
      });
    },

    onKeyDown: function (e) {
      if (e.keyCode === 27 && e.target.id !== 'filtersearch') {
          this.destroy();
      }
    },

    onHidden: function () {
      this.destroy();
    },

    onShown: function () {
      if (this.options.body) {
        this.options.body.triggerMethod('dom:refresh');
        this.options.body.triggerMethod('after:show');
      }
    }
  });

  return ModalDialogView;

});