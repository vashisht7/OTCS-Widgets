/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'i18n!conws/widgets/header/impl/nls/header.lang',
  'hbs!conws/widgets/header/impl/editicon',
  'css!conws/widgets/header/impl/editicon'
], function (require, _, $, Marionette, lang, template) {

  var EditIconView = Marionette.ItemView.extend({

    classname: 'conws-popover',

    template: template,

    triggers: {
      'click .reset > a': 'click:reset',
      'click .upload': 'click:upload',
      'click .cancel': 'click:cancel'
    },

    events: {
      'keydown': 'onKeyDown'
    },
    constructor: function EditIconView(options) {
      options || (options = {});
      options.title = options.title || lang.changeIconDialogTitle;
      options.message = options.message || lang.changeIconDialogMessage;
      options.resetButton = options.resetButton !== undefined ? options.resetButton : true;
      options.uploadButton = options.uploadButton !== undefined ? options.uploadButton : true;
      this.tabableElements = [];
      if ((_.isFunction(options.resetButton) && options.resetButton()) ||
          options.resetButton === true) {
        this.tabableElements.push('.reset > a');
      }
      this.tabableElements.push('.upload', '.cancel');
      var self = this;
      $('.conws-header-edit').on('shown.binf.popover', function () {
        self._currentlyFocusedElement = self.tabableElements[0];
        self.$el.find(self._currentlyFocusedElement).focus();
        $('.conws-header-edit').off('shown.binf.popover');
      });
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    templateHelpers: function () {
      return {
        title: this.options.title,
        message: this.options.message,
        resetButton: this.options.resetButton,
        reset: lang.changeIconDialogBtnReset,
        resetTitle: lang.changeIconDialogBtnResetTitle,
        uploadButton: this.options.uploadButton,
        upload: lang.changeIconDialogBtnUpload,
        uploadTitle: lang.changeIconDialogBtnUploadTitle,
        cancel: lang.changeIconDialogBtnCancel,
        cancelTitle: lang.changeIconDialogBtnCancelTitle
      };
    },

    _focusNextElement: function (backwards) {
      var success = true;
      var idx = _.indexOf(this.tabableElements, this._currentlyFocusedElement);
      if (!backwards) {
        if (++idx === this.tabableElements.length) {
          idx = 0;
        }
      } else {
        if (--idx < 0) {
          idx = this.tabableElements.length - 1;
        }
      }
      var next = this.tabableElements[idx];
      var elem = this.$el.find(next);
      if ((elem.length === 1) && (elem.is(':visible'))) {
        this._currentlyFocusedElement = next;
        elem.focus();
      }
      return success;
    },

    onKeyDown: function (e) {
      switch (e.keyCode) {
      case 9:
        if (this._focusNextElement(e.shiftKey)) {
          e.preventDefault();
          e.stopPropagation();
        }
        break;
      case 27:
        e.preventDefault();
        e.stopPropagation();
        $('.cancel').click();
        break;
      }
    },

    onClick: function (action) {
      if (typeof this.options.callback === 'function') {
        this.options.callback(action);
      }
    },

    onClickReset: function (e) {
      this.onClick('reset');
    },

    onClickUpload: function (e) {
      this.onClick('upload');
    },

    onClickCancel: function (e) {
      this.onClick('cancel');
    }
  });

  return EditIconView;
});
