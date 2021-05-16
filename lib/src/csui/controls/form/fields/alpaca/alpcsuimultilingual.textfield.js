/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/lib/alpaca/js/alpaca', 'csui/models/form',
  'csui/controls/form/fields/multilingual.textfield.view', 'csui/utils/base'
], function (module, _, $, Backbone, Marionette, Alpaca, FormModel, MultilingualTextFieldView,
    base) {

  Alpaca.Fields.CsuiMultilingualTextField = Alpaca.Fields.TextField.extend({

    constructor: function CsuiTextField(container, data, options, schema, view, connector,
        onError) {
      this.base(container, data, options, schema, view, connector, onError);
    },

    getFieldType: function () {
      return 'otcs_multilingual_string';
    },

    postRender: function (callback) {
      this.base(callback);
      this.showField();
      this.field.parent().addClass("csui-field-" + this.getFieldType());
    },

    showField: function () {

      var id = this.id;
      var id4Label,
          id4Description = this.options ? this.options.descriptionId : '',
          labelElement   = $(this.field[0]).find('label');

      if (labelElement && labelElement.length == 1) {
        id4Label = labelElement.attr('for') + "Label";
        labelElement.attr('id', id4Label);
      }
      this.fieldView = new MultilingualTextFieldView({
        model: new Backbone.Model({
          data: this.data,
          options: this.options,
          schema: this.schema,
          inputType: 'text',
          id: id // <input type=text
        }),
        id: _.uniqueId(id), // wrapper <div>
        alpacaField: this,
        labelId: id4Label,
        descriptionId: id4Description,
        value: this.data,
        readonly: true,
        dataId: this.name,
        path: this.path,
        alpaca: {
          data: this.data,
          options: this.options,
          schema: this.schema
        }
      });
      var $field = $('<div>').addClass('alpaca-control');
      this.getControlEl().replaceWith($field);
      this.region = new Marionette.Region({el: $field});
      this.region.show(this.fieldView);

      return;
    },

    setValueAndValidate: function (value, validate) {
      this.setValue(value);
      var bIsValid = true;
      if (validate) {
        bIsValid = this.validate();
        this.refreshValidationState(false);
      }
      return bIsValid;
    },

    getValue: function () {
      return this.data;
    },

    focus: function () {
      this.fieldView.setFocus();
    },

    destroy: function () {
      this.base();
      if (this.region) {
        this.region.destroy();
      }
    }
  });

  Alpaca.registerFieldClass('otcs_multilingual_string', Alpaca.Fields.CsuiMultilingualTextField,
      'bootstrap-csui');
  Alpaca.registerFieldClass('otcs_multilingual_string', Alpaca.Fields.CsuiMultilingualTextField,
      'bootstrap-edit-horizontal');

  return $.alpaca.Fields.CsuiMultilingualTextField;
})
;
