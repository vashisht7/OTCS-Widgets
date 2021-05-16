/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/form/impl/fields/csformfield.view',
  'csui/utils/url',
  'csui/utils/contexts/factories/connector',
  'i18n!csui/controls/form/impl/nls/lang',
  'hbs!csui/controls/form/impl/fields/multilingual.textfield/multilingual.textfield',
  'css!csui/controls/form/impl/fields/multilingual.textfield/multilingual.textfield',
  'csui/lib/binf/js/binf',
  'csui/lib/handlebars.helpers.xif'
], function (_, $, Backbone, Marionette, FormFieldView, Url, ConnectorFactory, lang, template) {
  "use strict";

  var i18n         = csui.require.s.contexts._.config.config.i18n,
      defaultLocal = (i18n && i18n.locale) || 'en-US';

  var MultilingualTextFieldView = FormFieldView.extend({

    constructor: function MultilingualTextFieldView(options) {
      FormFieldView.apply(this, arguments);
      var data = this.model.get('data');
      this.editVal = data || {};
      this.oldVal = data;
      this._isReadyToSave = true;
    },

    getDisplayValue: function () {
      return this.getEditValue();
    },

    className: 'cs-formfield cs-multilingualfield',

    template: template,

    events: {
      'keypress @ui.readField': 'onKeyPressRead',
      'click @ui.writeField': 'onWiteFieldClick',
      'click .multilingual-icon': 'onWiteFieldClick',
      'keydown @ui.writeField': 'onKeyDownWrite'
    },

    templateHelpers: function () {
      var multiFieldLabel        = "",
          data                   = lang.noValue,
          readModeAria           = "", // better default value?
          readModeMultiFieldAria = "", // better default value?
          isReadOnly             = this.mode === "readonly",
          requiredTxt            = "",

          isRequired             = this.options.alpacaField &&
                                   this.options.alpacaField.isRequired();
      requiredTxt = isRequired ? lang.requiredField : "";

      if (!!this.model.get('data')) {
        data = this.model.get('data');
      }
      if (this.alpacaField && this.alpacaField.options &&
          this.alpacaField.options.isMultiFieldItem) {
        multiFieldLabel = (this.alpacaField.parent && this.alpacaField.parent.options) ?
                          this.alpacaField.parent.options.label : "";
      }
      if (this.model.get('options')) {
        readModeAria = isReadOnly ?
                       _.str.sformat(lang.fieldReadOnlyAria, this.model.get('options').label,
                           data[defaultLocal]) + requiredTxt :
                       _.str.sformat(lang.fieldEditAria, this.model.get('options').label,
                           data[defaultLocal]) +
                       requiredTxt;
      }

      readModeMultiFieldAria = isReadOnly ?
                               _.str.sformat(lang.fieldReadOnlyAria, multiFieldLabel,
                                   data[defaultLocal]) +
                               requiredTxt :
                               _.str.sformat(lang.fieldEditAria, multiFieldLabel,
                                   data[defaultLocal]) +
                               requiredTxt;

      return _.extend(FormFieldView.prototype.templateHelpers.apply(this), {
        inputType: 'text',
        idBtnLabel: this.options.labelId,
        idBtnDescription: this.options.descriptionId,
        readModeAria: readModeAria,
        readModeMultiFieldAria: readModeMultiFieldAria,
        multiFieldLabel: multiFieldLabel,
        ariaRequired: isRequired,
        multilangEnValue: data[defaultLocal]
      });
    },

    getEditValue: function () {
      return this.editVal;
    },

    getOldValue: function () {
      return this.oldVal;
    },

    isReadyToSave: function () {
      return this._isReadyToSave;
    },

    onKeyDownWrite: function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        event.stopPropagation();
        this._showLanguageTextPicker();
      }
    },

    onWiteFieldClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this._showLanguageTextPicker();
    },

    _showLanguageTextPicker: function () {
      if (!this._isReadyToSave) {
        return;
      }
      this._isReadyToSave = false;

      var self = this;

      require(['csui/dialogs/multilingual.text.picker/multilingual.text.picker'],
          function (MultilingualTextPicker) {
            var pickerOptions = {
              connector: self.connector,
              data: self.model.get('data')
            };
            var picker = new MultilingualTextPicker(pickerOptions);
            picker.show()
                .done(_.bind(self._handlePickerSuccess, self))
                .fail(_.bind(self._handlePickerCancel, self))
                .always(function () {
                  self.ui.writeField.trigger('focus');
                  self._isReadyToSave = true;
                });
          });
    },

    _handlePickerSuccess: function (data) {
      this.editVal = data;
      this.setValue(data, true);
      this.render();
    },

    _handlePickerCancel: function (cancelData) {

    }

  });

  return MultilingualTextFieldView;

});