/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'i18n!csui/controls/thumbnail/impl/nls/lang',
  'hbs!csui/controls/thumbnail/content/text/impl/text',
  'css!csui/controls/thumbnail/content/text/impl/text'
], function (module, $, _, Backbone, Marionette, lang, template) {

  var config = _.extend({
    multiValueSeparator: ', '
  }, module.config());

  var TextContentView = Marionette.ItemView.extend({

    className: 'csui-thumbnail-generic',
    template: template,

    templateHelpers: function () {
      var text    = this.getValueText(),
          column  = this.options.column;
      return {
        value: text,
        displayLabel: this.options.displayLabel,
        label: this.options.displayLabel ? column.title || column.name : ""
      };
    },

    getValueText: function () {
      var column = this.options.column;
      if (column) {
        var columnName = column.name,
            model      = this.model,
            value      = model.get(columnName + "_formatted");
        if (value === null || value === undefined) {
          value = model.get(columnName);
          if (value === null || value === undefined) {
            value = '';
          }
        }
        return this.getSingleOrMultipleValueText(value);
      }
      return '';
    },

    getSingleOrMultipleValueText: function (propertyValue, formatter) {
      var value;

      formatter = this._validateFormater(formatter);
      if (Array.isArray(propertyValue)) {
        value = this.concatenateTextValues(propertyValue, formatter);
      } else {
        value = formatter(propertyValue);
      }
      return value;
    },

    concatenateTextValues: function (array, formatter) {
      formatter = this._validateFormater(formatter);
      return array.map(formatter).join(config.multiValueSeparator);
    },

    _validateFormater: function (formatter) {
      return formatter || function (value) { return value };
    },

    constructor: function TextContentView(options) {
      options || (options = {});
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }
  });
  return TextContentView;
});