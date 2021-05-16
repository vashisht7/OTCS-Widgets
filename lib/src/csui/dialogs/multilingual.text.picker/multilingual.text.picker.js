/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/dialog/dialog.view',
  'i18n!csui/dialogs/multilingual.text.picker/impl/nls/lang',
  'csui/dialogs/multilingual.text.picker/impl/multilingual.form.view',
  'csui/utils/log',
  'csui/lib/binf/js/binf',
  'csui/lib/handlebars.helpers.xif'
], function (_, $, Backbone, Marionette, DialogView, lang, MultilingualFormView, log) {

  var defaultOptions = {
    dialogTitle: lang.dialogTitle,
  };

  function MultilingualTextPicker(options) {
    options || (options = {});
    this.options = _.defaults(options, defaultOptions);
  }

  _.extend(MultilingualTextPicker.prototype, {

    show: function () {
      this._showDialog();
      this._deferred = $.Deferred();
      return this._deferred.promise();
    },

    _showDialog: function () {
      this._view = this._createMultilingualForm();
      this._dialog = this._createDialog();
      this._dialog.show();

    },

    _createMultilingualForm: function () {
      var multilingualView = new MultilingualFormView(this.options);
      return multilingualView;
    },

    _createDialog: function () {
      var options = this.options,
          dialog  = new DialogView({
            title: options.dialogTitle,
            view: this._view,
            midSize: true,
            className: 'cs-multilingual-picker',
            attributes: {
              'aria-label': options.dialogTitle
            },
            buttons: [{
              id: 'done',
              label: lang.btnDone,
              'default': true,
              disabled: false,
              click: _.bind(this._onClickDoneButton, this, status)
            },
              {
                id: 'cancel',
                label: lang.btnCancel,
                close: true,
                click: _.bind(this.onClickCancelButton, this)
              }
            ]
          });

      dialog.listenTo(dialog, 'hide', _.bind(this._onHideDialog, this));
      return dialog;
    },

    _onClickDoneButton: function () {
      this._result = this._view.getData();
      this._dialog.destroy();
    },

    onClickCancelButton: function () {
    },

    _onHideDialog: function () {
      if (this._deferred) {
        if (this._result) {
          this._deferred.resolve(this._view.getData());
        } else if (this._deferred.state() === 'pending') {
          this._deferred.reject({
            cancelled: true
          });
        }
      }
    }
  });

  return MultilingualTextPicker;
});