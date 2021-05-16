/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/controls/dialog/dialog.view',
  'csui/controls/version.control.dialog/impl/version.control.dialog.header.view',
  'css!csui/controls/version.control.dialog/impl/version.control.dialog'
], function (_, $, Backbone, DialogView, VersionControlHeaderView) {
  "use strict";

  function VersionControlDialog(options) {
    this.options = options || {};
    this.deferred = $.Deferred();
    this.deferred.then(_.bind(this.destroy, this), _.bind(this.destroy, this));
  }

  _.extend(VersionControlDialog.prototype, Backbone.Events, {

    destroy: function () {
      this.options._view && this.options._view.destroy();
      this.options._view && this.options._view.off();
      this._dialog.destroy();
    },

    show: function () {
      this._dialog = this._createDialog();
      return this.deferred;
    },

    _createDialog: function () {
      var options = this.options,
          self    = this,
          headerView = new VersionControlHeaderView(options),
          dialog  = new DialogView({
            headerView: headerView,
            midSize: true,
            bodyMessage: options.bodyMessage,
            view: options._view,
            className: 'csui-version-control-dialog ' + options.dialogClassName,
            attributes: {
              'data-backdrop': "static"
            },
            buttons: [
              {
                id: 'add',
                label: options.actionBtnLabel,
                toolTip: options.actionBtnLabel,
                default: true,
                click: function () {
                  dialog.destroy();
                  self._resolutionComplete(options._view && options._view.getValue());
                }
              },
              {
                id: 'cancel',
                label: options.cancelBtnLabel,
                toolTip: options.cancelBtnLabel,
                click: function () {
                  dialog.destroy();
                  self.cancel();
                }
              }
            ],
            dialogTxtAria: options.title
          });

      dialog.on('hide', function () {
        dialog.off();
        this.cancel();
      }, this);

      dialog.show();
      return dialog;
    },

    cancel: function () {
      this.deferred.reject();
      return true;
    },

    _resolutionComplete: function (result) {
      this.deferred.resolve(result);
      return true;
    }

  });

  return VersionControlDialog;

});
