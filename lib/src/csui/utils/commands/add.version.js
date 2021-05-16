/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/jquery', 'csui/lib/underscore',
  'i18n!csui/utils/commands/nls/localized.strings',
  'csui/models/command', 'csui/utils/commandhelper',
  'csui/dialogs/file.open/file.open.dialog'
], function (module, require, $, _, lang, CommandModel, CommandHelper,
    FileOpenDialog) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    actionType: 'ADD_VERSION'
  });

  var GlobalMessage;
  var AddVersionCommand = CommandModel.extend({
    defaults: {
      signature: "AddVersion",
      command_key: "addversion",
      name: lang.CommandNameAddVersion,
      scope: "single"
    },

    execute: function (status, options) {
      status || (status = {});
      var deferred = $.Deferred(),
          self     = this;

      this.trigger('close:dialogView:form');
      require([
        'csui/controls/globalmessage/globalmessage'
      ], function () {
        GlobalMessage = arguments[0];
        if (GlobalMessage.isActionInProgress(config.actionType, lang.AddVersionNotAllowed, lang.CommandNameAddVersion)) {
          return deferred.resolve();
        }
        if (!!status.tableView) {
          status.tableView.lockedForOtherContols = false;
        }
        self._pickFileAndUpload(status, options).done(deferred.resolve);
        status.suppressSuccessMessage = true;
        var file = status.file;

        if (file) {
          self
              ._addVersionController(file, status)
              .done(deferred.resolve)
              .fail(deferred.reject);
        }
      });
      return deferred.promise();
    },

    _pickFileAndUpload: function (status, options) {
      var fileOpenDialog = new FileOpenDialog({multiple: false}),
          deferred       = $.Deferred(),
          self           = this;
      deferred.resolve();
      fileOpenDialog
          .listenTo(fileOpenDialog, 'add:files', function (files) {
            self._addVersionController(files[0], status)
                .done(deferred.resolve)
                .always(function () {
                  fileOpenDialog.destroy();
                });
          })
          .show();
      return deferred.promise();
    },

    _addVersionController: function (file, status) {
      var deferred = $.Deferred();
      require([
        'csui/controls/fileupload/impl/addversion.controller'
      ], function (AddVersionController) {
        var node = CommandHelper.getJustOneNode(status);
        var addVersionController = new AddVersionController({
          status: status,
          view: status.originatingView,
          selectedNode: node
        });

        return addVersionController
            .uploadFile(file, config.actionType).done(deferred.resolve);

      }, function (error) {
        deferred.reject(error);
      });

      return deferred.promise();
    },

  });

  return AddVersionCommand;
});
