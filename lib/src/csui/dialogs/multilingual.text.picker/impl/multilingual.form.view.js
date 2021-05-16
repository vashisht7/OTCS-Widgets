/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/form/impl/fields/csformfield.view',
  'csui/utils/contexts/factories/connector',
  'csui/dialogs/multilingual.text.picker/languages',
  'i18n!csui/dialogs/multilingual.text.picker/impl/nls/lang',
  'hbs!csui/dialogs/multilingual.text.picker/impl/multilingual.form',
  'css!csui/dialogs/multilingual.text.picker/impl/multilingual.form',
  'csui/lib/binf/js/binf',
  'csui/lib/handlebars.helpers.xif'
], function (_, $, Backbone, Marionette, FormFieldView, ConnectorFactory, Languages, lang, template) {

  var i18n = csui.require.s.contexts._.config.config.i18n, 
    fallbakLang = i18n.locale || 'en-US';
  var loadableLocales = (i18n && i18n.loadableLocales);
  if (!loadableLocales) {
    loadableLocales[fallbakLang] = true;
  }

  var MultiLingualFormView = Marionette.LayoutView.extend({
    template: template,
    className: 'cs-multilingual-form',

    templateHelpers: function () {
      return {
        formHeading: lang.formHeading,
        languages: this.languages,
        data: this.data
      };
    },

    constructor: function MultiLingualForm(options) {
      Marionette.LayoutView.apply(this, arguments);
      this._prepareLanguages();
      this.data = _.extend({}, options.data || {});
    },

    _prepareLanguages: function () {
      this.languages = _.map(loadableLocales, function (enabled, lang) {
        return _.defaults({}, Languages[lang], {
          LanguageCode: lang,
          LanguageName: lang,
          LanguageNameLocal: lang
        });
      });
    },

    getData: function () {
      var that = this,
        data = this.data;
      _.each(this.languages, function (lang) {
        data[lang.LanguageCode] = that.$el.find('#input-' + lang.LanguageCode).val();
      });
      return data;
    }
  });
  return MultiLingualFormView;
});