/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/lib/alpaca/js/alpaca',
  'csui/controls/form/fields/radiofield.view',
  'i18n!csui/controls/form/impl/nls/lang',
], function (_, $, Backbone, Marionette, Alpaca,
             RadioFieldView, lang) {
  'use strict';

  Alpaca.Fields.CsuiRadioField = Alpaca.Fields.RadioField.extend({
    constructor: function CsuiRadioField(container, data, options, schema, view,
                                         connector,
                                         onError) {
      this.base(container, data, options, schema, view, connector, onError);
    },

    getFieldType: function () {
      return 'radio';
    },

    setup: function() {
      var origData = this.data;
      this.base();

      if(origData!==this.data && this.isRequired() && (this.options.removeDefaultNone === true)) {
        this.data = origData;
      }
    },

    postRender: function (callback) {
      this.base(callback);
      this.showField();
      this.removeExtraDivs();
    },

    removeExtraDivs: function(){
      var colElements = this.fieldView.$el.closest('.binf-col-sm-9').siblings();
      colElements.each(function( index,element ) {
        if(this.tagName === 'DIV' && this.className === 'binf-col-sm-9' && _.isNull(element.firstChild)){
          if (typeof element.remove === 'function') {
            element.remove();
          } else {
            element.parentNode.removeChild(element);
          }
        }
      });
    },

    showField: function () {
      var collectionData = [];
      if (this.options.optionLabels) {
        collectionData = _.zip(this.schema['enum'], this.options.optionLabels, _.pluck(this.options.enum, "category")).map(
          function (cur) {
            return {id: cur[0], name: cur[1], category: cur[2], radioId: _.uniqueId('radio')};
          });
      }  else if (this.schema['enum']) {
        collectionData = this.schema['enum'].map(function (cur) {
          return {id: cur, name: cur, radioId: _.uniqueId('radio')};
        });
      }

      var collection = new Backbone.Collection(collectionData),
        selection = {},
        hasValue = true;
      if (this.data !== null && this.data !== "") {
        selection = new Backbone.Model({
          id: this.data,
          name: collection.get(this.data) && collection.get(this.data).get('name')
        });
      } else {
        selection = new Backbone.Model({
          id: null,
          name: '<' + lang.selectFieldDefaultLabel + '>'
        });
      }
      var id4Label,
        labelElement = $(this.field[0]).find('label');

      if (labelElement && labelElement.length === 1) {
        id4Label = labelElement.attr('for') + "Label";
        labelElement.attr('id', id4Label);
      }
      var id = this.id;
      this.fieldView = new RadioFieldView({
        model: new Backbone.Model({
          data: this.data,
          options: this.options,
          schema: this.schema,
          id: id
        }),
        id: _.uniqueId(id), // wrapper <div>
        alpacaField: this,
        labelId: id4Label, // this will remain undefined if the label does not exist
        selected: selection,
        collection: collection,
        mode: this.options.mode,
        path: this.path,
        dataId: this.name,
        alpaca: {
          data: this.data,
          options: this.options,
          schema: this.schema
        },
        hasValue: hasValue
      });
      var $field = $('<div>').addClass('alpaca-control');
      this.getControlEl().replaceWith($field);
      this.region = new Marionette.Region({el: $field});
      this.region.show(this.fieldView);
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

    _validator: function (callback) {
      var value = this.getValue();

      if (this.schema.required && value === "") {
        callback({
          "status": false,
          "message": "This field is required"
        });
      } else {
        callback({
          "status": true
        });
      }
    },

    validate: function () {
      var ret = this.base();
      this.validation = _.omit(this.validation, "invalidValueOfEnum");
      return ret;
    },

    setValue: function (value) {
      value === null ? this.base("") : this.base(value);
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

  Alpaca.registerFieldClass('radio', Alpaca.Fields.CsuiRadioField, 'bootstrap-csui');

  return Alpaca.Fields.CsuiRadioField;
});