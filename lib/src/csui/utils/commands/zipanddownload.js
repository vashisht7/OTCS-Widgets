/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "require", "csui/lib/underscore", "csui/lib/jquery",
  "i18n!csui/utils/commands/nls/localized.strings", "csui/utils/command.error",
  "csui/utils/commandhelper", "csui/models/command", "csui/utils/url"
], function (module, require, _, $, lang, CommandError, CommandHelper,
    CommandModel, URL) {
  'use strict';

  var config = _.extend({}, module.config());
  var GlobalMessage, PreFlightModel, StagesModel, ModalAlert, stageInterval = 2000;

  var ZipAndDownloadCommand = CommandModel.extend({

    defaults: {
      signature: "ZipAndDownload",
      command_key: ['ZipAndDownload', 'zipanddownload'],
      name: lang.CommandNameZipDownload,
      verb: lang.CommandVerbZipDownload,
      doneVerb: lang.CommandDoneVerbDownload,
      scope: "multiple",
      selfBlockOnly: true
    },

    enabled: function (status) {
      var flag = false;
      if(!status.nodes || !status.nodes.models){
        return false;
      }

      if (status.nodes.models.length === 1) {
        var node = CommandHelper.getJustOneNode(status),
            zipAndDownloadExists;
        for (var idx = 0; idx < status.nodes.models.length; idx++) {
          zipAndDownloadExists = _.filter(
              status.nodes.models && status.nodes.models[idx].actions &&
              status.nodes.models[idx].actions.models,
              function (action) { return action.id === "zipanddownload"; });
        }
        if (node.get("container") && zipAndDownloadExists.length > 0) {
          flag = true;
        }
      } else if (status.nodes.models.length > 1) {
        var count = 0;
        for (var index = 0; index < status.nodes.models.length; index++) {
          var downloadExists = _.filter(status.nodes.models && status.nodes.models[index].actions &&
                                        status.nodes.models[index].actions.models,
              function (action) { return action.id === "zipanddownload"; });
          if (downloadExists.length > 0) {
            count++;
          }
        }
        if (count > 0 && count === status.nodes.models.length) {
          flag = true;
        }
      }
      return flag;
    },

    execute: function (status, options) {
      this.set('isExecuting', true);
      if (this.stagesModel) {
        delete this.stagesModel;  // to prepare fresh model with new job id
      }
      var nodes = CommandHelper.getAtLeastOneNode(status),
          self  = this;
      this.options = options || {};
      this._deferred = $.Deferred();
      this.connector = this.options.connector ||
                       status.collection && status.collection.connector ||
                       status.container && status.container.connector ||
                       nodes.models && nodes.models[0].connector;

      require(['csui/controls/globalmessage/globalmessage',
        "csui/models/zipanddownload/zipanddownload.preflight",
        "csui/models/zipanddownload/zipanddownload.stages",
        "csui/dialogs/modal.alert/modal.alert"
      ], function () {
        GlobalMessage = arguments[0];
        PreFlightModel = arguments[1];
        StagesModel = arguments[2];
        ModalAlert = arguments[3];
        self.stageAndPrepeareDownload(status, nodes, {});
      });
      this._deferred.always(function () {
        self.set('isExecuting', false);
      });
      return this._deferred.promise();
    },

    _preFlightCheck: function (status, nodes) {
      var deferred = $.Deferred();
      var self     = this,
          formData = {
            id_list: nodes.pluck('id'),
            type: 'ZipAndDownload'
          };
      var preFlightModel = new PreFlightModel(formData, status);
      preFlightModel.preflight = true;
      var preflightXHR = preFlightModel.save(formData, {
        silent: true,
        wait: true
      }).done(function () {
        deferred.resolve(preFlightModel);
      }).fail(function (error) {
        var commandError = error ? new CommandError(error, preFlightModel) :
                           error;
        if (error.statusText !== 'abort') {
          ModalAlert.showError(commandError.message, lang.error);
        }
        self._deferred.reject({cancelled: true});
        deferred.reject(preFlightModel, commandError);
      });
      GlobalMessage.showLoader(preflightXHR, {
        label: lang.VerifyZipAndDownloadPrefetch
      });
      return deferred.promise();
    },

    _getJobId: function (status, nodes) {
      var url         = this.connector.getConnectionUrl().getApiBase('v2'),
          formData    = {
            id_list: nodes.pluck('id'),
            type: 'ZipAndDownload'
          },
          ajaxOptions = {
            url: URL.combine(url, 'zipanddownload'),
            type: 'POST',
            data: formData,
            contentType: 'application/x-www-form-urlencoded'
          };
      return this.connector.makeAjaxCall(ajaxOptions);
    },

    changeStageMessage: function (xhr) {
      var currentStage = this.stagesModel && this.stagesModel.get('current_stage') || 0;
      var message = currentStage === 0 ? lang.ExtractingZipAndDownload :
                    (currentStage === 1 ? lang.CompressingZipAndDownload :
                     lang.CleanUpZipAndDownload);
      GlobalMessage.changeLoaderMessage(message, xhr);
    },

    _checkStage: function (status, jobIdModel, deferred) {
      deferred = deferred || $.Deferred();
      this.stagesModel || (this.stagesModel = new StagesModel(jobIdModel, {
        connector: this.connector
      }));
      var self    = this,
          promise = deferred.promise(),
          xhr     = this.stagesModel.fetch();
      this.changeStageMessage(xhr);
      xhr.done(function () {
        if (self.stagesModel.get('complete')) {
          deferred.resolve(self.stagesModel);
        } else {
          if (self.stagesModel.get('stage_summary').some(function (stage) {
                return !stage.complete;
              })) {
            self.stageCheckTimeout = setTimeout(function () {
              clearTimeout(self.stageCheckTimeout);
              self.stageCheckTimeout = undefined;
              self._checkStage(status, jobIdModel, deferred);
            }, stageInterval);
          } else {
            deferred.resolve(self.stagesModel);
          }
        }
      });
      promise.abort = xhr.abort;   // helper for loader panel view cancel
      return promise;
    },

    _showdialogbox: function (view, status, nodes, dialogOptions) {
      var self = this;
      self._dialog = new view(_.extend(dialogOptions, {
        status: status,
        nodes: nodes,
        iconLeft: 'notification_warning'
      }));
      self._dialog.listenTo(self._dialog, 'hide', _.bind(self.onHideDialog, self));
      self._dialog.show();
    },

    onHideDialog: function () {
      if (this._deferred) {
        if (this._deferred.state() === 'pending') {
          this._deferred.reject({cancelled: true});
        }
      }
    },

    stageAndPrepeareDownload: function (status, nodes, preFlightModel) {
      var self         = this,
          deferred     = $.Deferred(),
          currentStage = self.stagesModel && self.stagesModel.get('current_stage') || 0;
      self._getJobId(status, nodes).done(function (jobIdModel) {
        jobIdModel = jobIdModel.results.data.jobs;
        var checkStage = self._checkStage(status, jobIdModel);
        GlobalMessage.showLoader(checkStage, {
          label: currentStage === 0 ? lang.ExtractingZipAndDownload :
                 (currentStage === 1 ? lang.CompressingZipAndDownload :
                  lang.CleanUpZipAndDownload),
          onDestroy: function (success) {
            if (self.stageCheckTimeout) {
              clearTimeout(self.stageCheckTimeout);
            }
            success ? self._deferred.resolve() : self._deferred.reject();
          }
        });
        checkStage.done(
            function (stagesModel) {
              deferred.resolve();
              if (stagesModel && stagesModel.get('complete') &&
                  stagesModel.get('current_stage') === stagesModel.get('stage_summary').length) {
                require([
                  'csui/controls/zipanddownload/impl/download.dialog/download.dialog.view'
                ], function (DownloadDialogView) {
                  deferred.resolve();
                  var dialogOptions = {
                    model: stagesModel,
                    status: status,
                    buttons: [
                      {
                        id: 'zipDownload',
                        label: lang.DownloadDialogBtnDownload,
                        click: _.bind(function () {
                          var archiveName = this._dialog.ui.fileName.val(),
                              isValidName = false;
                          if (/^[\W]+/.test(archiveName)) {
                            if (/[^\u0000-\u007F]/g.test(archiveName)) {
                              isValidName = true;
                            }
                          }
                          if (archiveName.trim().length === 0) {
                            this._dialog.ui.errorEl.html(
                                lang.TheArchiveNameCannotBeEmpty);
                          } else if (archiveName.trim().length > 248) {
                            this._dialog.ui.errorEl.html(
                                lang.TheArchiveNameMaxLength);
                          } else if (archiveName.search(
                                  /[\?\:<>\|\"\\\/\@\^\,\{\}\[\]\!\%\&\(\)\~]/g) !== -1) {
                            this._dialog.ui.errorEl.html(
                                lang.InvalidArchiveCharacters);
                          } else if (/^[\W]+/.test(archiveName) && !isValidName) {
                            this._dialog.ui.errorEl.html(lang.InvalidArchiveName);
                          } else {
                            if (this._dialog.options.status &&
                                this._dialog.options.status.originatingView) {
                              var toolItem = this._dialog.options.status.originatingView.$el.find(
                                  '[data-csui-command=' + this.get("signature").toLowerCase() +
                                  '] a.binf-disabled');
                              if (toolItem.length > 0) {
                                toolItem.removeClass("binf-disabled");
                              }
                            }
                            if (!/(.)+(.zip)$/i.test(archiveName)) {
                              archiveName += '.zip';
                            }
                            window.location.href = URL.appendQuery(URL.combine(
                                this.connector.connection.url.replace(/\/api\/v[1|2]/gi, ''),
                                stagesModel.get('link')),
                                'downloadName=' + encodeURIComponent(archiveName));
                            this._dialog.destroy();
                            delete this._dialog;
                          }
                        }, self),
                        'default': true,
                        disabled: stagesModel.get('total_completed') === 0
                      }, {
                        label: lang.DialogBtnCancel,
                        click: _.bind(self.onClickCancelButton, self)
                      }
                    ]
                  };
                  self._showdialogbox(DownloadDialogView, status, nodes, dialogOptions);
                });
              } else {
                ModalAlert.showError(stagesModel.get('status_formatted'));
              }
            }).fail(function (error) {
          GlobalMessage.showMessage('error', error.statusText);
          deferred.reject(error);
        });
      });
      if (this._dialog) {
        this._dialog.destroy();
        delete this._dialog;
      }
    },

    onClickCancelButton: function () {
      if (this._dialog.options.status && this._dialog.options.status.originatingView) {
        var toolItem = this._dialog.options.status.originatingView.$el.find(
            '[data-csui-command=' + this.get("signature").toLowerCase() +
            '] a.binf-disabled');
        if (toolItem.length > 0) {
          toolItem.removeClass("binf-disabled");
        }
      }
      this._dialog.destroy();
      delete this._dialog;
    }
  });
  return ZipAndDownloadCommand;
});
