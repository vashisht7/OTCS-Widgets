/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/handlebars',
  'csui/lib/marionette', 'csui/controls/form/impl/fields/csformfield.states.behavior',
  "csui/utils/log",   'csui/utils/base'
], function (_, $, Handlebars, Marionette, FormFieldStatesBehavior, log, base) {
  "use strict";

  var FormArrayFieldStatesBehavior = FormFieldStatesBehavior.extend({

    constructor: function FormArrayFieldStatesBehavior(options, view) {
      FormFieldStatesBehavior.apply(this, arguments);
    },

    _setStateWrite: function (validate, focus) {
      var MN = '----{0}:_setStateWrite {1} {2} {3}';
      log.debug(MN, this.constructor.name, 'enter', validate, focus) && console.log(log.last);

      this.ui.readArea.addClass('binf-hidden');

      this.ui.writeArea.removeClass('binf-hidden');

      if (this.view.options.model.attributes.options.isMultiFieldItem) {
        this.ui.writeArea.find(".icon-container").addClass("binf-hidden");
      }

      if (focus && !this.hasWriteFocus() &&
           !(base.isLandscape() && this.$el.find('.icon-date_picker').length > 0)) {
        this.view.ui.writeField.trigger('focus').trigger('focus');
      } else if ((base.isLandscape() && this.$el.find('.icon-date_picker').length > 0)){
        this.$el.find('.icon-date_picker').trigger('focus');
      }
      focus && !this.view.options.model.attributes.options.isMultiFieldItem ?
      this.view.ui.writeField.select() : "";

      log.debug(MN, this.constructor.name, 'return') && console.log(log.last);
      return;
    }

  });

  return FormArrayFieldStatesBehavior;

});
