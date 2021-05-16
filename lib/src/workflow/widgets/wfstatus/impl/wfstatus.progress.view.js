/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/globalmessage/globalmessage',
  'csui/controls/progressblocker/blocker',
  'workflow/widgets/wfstatus/impl/wfstatusitem.body.view',
  'workflow/models/wfstatus/tabpanel.model',
  'workflow/widgets/wfstatus/impl/wfstatusitem.tabpanel.view',
  'workflow/widgets/wfstatus/impl/wfstatusitem.details.view',
  'workflow/widgets/wfstatus/impl/wfstatusitem.attachments.view',
  'workflow/models/wfstatus/wfstatusinfo.model.factory',
  'workflow/utils/wfstatus.extension.controller',
  'hbs!workflow/widgets/wfstatus/impl/wfstatus.progress',
  'i18n!workflow/widgets/wfstatus/impl/nls/lang',
  'csui-ext!workflow/widgets/wfstatus/impl/wfstatus.progress.view',
  'css!workflow/widgets/wfstatus/impl/wfstatus.progress'
 
], function (require, $, _, Backbone, Marionette, ModalAlert, GlobalMessage, BlockingView, WFStatusItemBodyView, TabpanelCollection,
    WFStatusItemTabPanelView, WFStatusItemDetailsView, WFStatusItemAttachmentsView,
    WFStatusInfoModelFactory, WfstatusExtensionController, template, lang, viewExtensions) {
  'use strict';

  var WFStatusProgressView = Marionette.LayoutView.extend({

    className: 'wfstatus-progress-view',

    template: template,

    regions: {
      body: '.wfstatusitem-body',
      tabPanel: '.wfstatusitem-tabpanel'
    },
    events: {
      'click .wfstatusitem-body, .wfstatusitem-tabpanel': 'destroyUserCardPopovers',
      'click .wfstatusitem-stop-btn': 'stopWorkflow',
      'click .wfstatusitem-delete-btn' : 'deleteWorkflow'
    },
    constructor: function WFStatusProgressView(options) {

      var Utils        = require('workflow/utils/workitem.util'),
          cellModel    = options.model,
          processId    = cellModel.get('process_id') ? cellModel.get('process_id') : 0,
          subProcessId = cellModel.get('subprocess_id') ? cellModel.get('subprocess_id') : 0,
          taskId       = cellModel.get('task_id') ? cellModel.get('task_id') : 0,
          wfStatusInfo = options.context.getModel(WFStatusInfoModelFactory);
      this.utils = Utils;

      wfStatusInfo.set({'process_id': processId, 'subprocess_id': subProcessId, 'task_id': taskId});
      this.dataFetched = false;
      var ext = viewExtensions;
      if (options.viewExtensions) {
        ext = options.viewExtensions;
      }
      this.extensions = _.chain(ext)
          .flatten(true)
          .map(function (ViewExtension) {
            return new ViewExtension(options);
          }).value();


      wfStatusInfo.fetch()
          .done(_.bind(function () {
            this.dataFetched = true;
            var wfDetails    = wfStatusInfo.get('wf_details'),
                displayName  = wfDetails.initiator.firstName + " " + wfDetails.initiator.lastName,
                loginName    = wfDetails.initiator.loginName,
                dueDateVal   = wfDetails.due_date,
                startDateVal = wfDetails.date_initiated,
                stoppedDate  = wfDetails.stopped_date,
                statusResult = Utils.formatStatus({
                  dueDate: dueDateVal,
                  status: wfDetails.status
                }),
                workID = wfDetails.work_workID,
                details = {
                  wf_name: wfDetails.wf_name,
                  due_date: (dueDateVal) ? Utils.dateConversion(dueDateVal) : '',
                  status_key: statusResult.status,
                  initiator: displayName === " " ? loginName : displayName,
                  date_initiated: (startDateVal) ? Utils.dateConversion(startDateVal) : '',
                  userId: wfDetails.initiator.userId,
                  end_date: dueDateVal,
                  start_date: startDateVal,
                  work_workID: workID,
                  stoppedDate: stoppedDate,
                  wfStatusKey : wfDetails.status
                },
                perm = wfStatusInfo.get('permissions');
            wfStatusInfo.set('details', details);//Once backend ready with details,we can remove
            this.model = wfStatusInfo;
            this.viewOptions = {
              model: this.model,
              context: this.options.context,
              cellView: this.options.cellView
            };

            this.tabpanelCollection = new TabpanelCollection([{
              title: lang.details,
              viewToRender: WFStatusItemDetailsView,
              viewToRenderOptions: this.viewOptions,
              id: _.uniqueId('wfstatusitem-tab')
            }]);
            if (perm && perm.SeeDetail && (!_.isEmpty(this.model.get("attachments")))) {
              this.tabpanelCollection.add({
                title: lang.attachments,
                viewToRender: WFStatusItemAttachmentsView,
                viewToRenderOptions: this.viewOptions,
                id: _.uniqueId('wfstatusitem-tab')
              });
            }
            var dataPackages = this.model.get('data_packages');
            var allPackagesExecuted = [];
            _.each(dataPackages, function (dataPackage) {
              var packageExecuted = $.Deferred();
              allPackagesExecuted.push(packageExecuted.promise());
              var controller = _.find(this.extensions, function (ext) {
                return ext.validate(dataPackage.TYPE, dataPackage.SUBTYPE);
              });
              if (controller) {
                controller.execute({
                  extensionPoint: WfstatusExtensionController.ExtensionPoints.AddSidebar,
                  model: this.model,
                  data: dataPackage.data,
                  parentView: this
                }).done(_.bind(function (args) {
                  if (args) {
                    args.type = dataPackage.type;
                    args.sub_type = dataPackage.sub_type;
                    if (args.viewToRender) {
                      this.tabpanelCollection.add(_.extend(args, { id: _.uniqueId('workflow-tab') }));
                    }
                  }
                  packageExecuted.resolve();
                }, this)).fail(_.bind(function (args) {
                  var errorMsg = lang.ErrorMessageLoadExtension;
                  if (args && args.errorMsg && args.errorMsg.length > 0) {
                    errorMsg = args.errorMsg;
                  }
                  GlobalMessage.showMessage('error', errorMsg);
                  packageExecuted.resolve();
                }, this));
              }
              else {
                packageExecuted.resolve();
              }
            }, this);
  
            this.render();
          }, this));

      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

    },

    templateHelpers: function () {

      if (this.model.get('details')) {
        var model  = this.model,
            status = model.get('details').wfStatusKey,
            perm   = this.model.get('permissions'),
            actionName, wfstatusActionLabel, permAction;

        if (status && (status === 'stopped' || status === 'completed')) {
          if (perm.Delete) {
            actionName = 'delete';
            wfstatusActionLabel = lang.deleteActionLabel;
          }          
        } else if (perm.Stop) {
          actionName = 'stop';
          wfstatusActionLabel = lang.stopActionLabel;
        }
        permAction = actionName ? true : false;
        this.model.set({'hasPermision': permAction, 'hasReassignAction': perm.ChangeAttr}, {silent:true});
        return {
          wfstatusAction: actionName,
          wfstatusActionLabel: wfstatusActionLabel,
          permAction: permAction
        };
      }
    },

    onRender: function () {
      if (this.dataFetched) {
        this._renderBody();
        this._renderTabPanel();
      }
      BlockingView.imbue(this);
    },

    destroyUserCardPopovers: function (e) {
      if ($(".wfstatus-popover").length > 0) {
        var Utils = require('workflow/utils/workitem.util');
        Utils.unbindPopover();
      }
    },

    stopWorkflow: function () {
      var self = this;
      var options = {centerVertically: true, buttons: ModalAlert.buttons.OkCancel};
      ModalAlert.confirmQuestion(lang.workflowStopDialogMessage, lang.workflowStopDialogTitle,
          options)
          .always(function (result) {
            if (result) {
              self.blockActions();
              self._acceptStopWorkflow();
            }
          });
    },

    _acceptStopWorkflow: function () {
      var self    = this,
          options = {
            process_id: this.model.get('process_id'),
            subprocess_id: this.model.get('process_id'),
            action: 'stop'
          };
      this.model.stopWorkflow(options).done(function (response) {
        var results = response.results;
        self._updateProgressPanel(results);
        GlobalMessage.showMessage('success', lang.stoppedWorkflowMessage);
      }).fail(function (response) {
        var error;
        if (response.errorDetail) {
          error = response.errorDetail;
        } else {
          error = response.error;
        }
        ModalAlert.showError(error);
      }).always(_.bind(function () {
        this.unblockActions();
      }, this));
    },

    _updateProgressPanel: function (results) {
      var wfDetails = results.wf_details,
        statusResult = this.utils.formatStatus({ status: wfDetails.status });
      this.model.set({
        attachments: results.attachments,
        step_list: results.step_list,
        wf_details: wfDetails
      });

      _.extend(this.model.get('details'),
          {
            status_key: statusResult.status,
            workflowStopped: true,
            stoppedDate: wfDetails.stopped_date,
            wfStatusKey: wfDetails.status
          });
      this.render();
    },

    updateWfstatusViews: function (options) {
      var self     = this,
          model    = self.options.cellView.model,
          wfstatus = model.collection.wfstatus,
          wfstatusModel, wfstatusExtendedView;

      wfstatusModel = wfstatus ? wfstatus : self.wfstatusModel;
      wfstatusModel.fetch().done(function (response) {
        self.utils.progressDialog.trigger('destroy', function () {
          wfstatusExtendedView = self.options.cellView.options.tableView.options.originatingView.options.extendedView;
          wfstatusExtendedView.render();
        });
      });
    },

    deleteWorkflow: function (event) {
      var self    = this,
          options = {centerVertically: true, buttons: ModalAlert.buttons.OkCancel};
      ModalAlert.confirmQuestion(lang.deleteWorkflowDialogMessage, lang.deleteWorkflowDialogTitle,
          options)
          .always(function (result) {
            if (result) {
              self.blockActions();
              self._onDeleteWorkflow();
            }
          });
    },
    _onDeleteWorkflow: function () {
      var self  = this,
          model = self.model;
      model.deleteWorkflow(model.get('process_id')).done(function (response) {
        self.updateWfstatusViews();
        GlobalMessage.showMessage('success', lang.deletedWorkflowMessage);

      }).fail(function (response) {
        var error;
        if (response.errorDetail && response.errorDetail === "ErrCode_Accept_Task") {
          error = lang.MemberAcceptErrorDescription;
        } else {
          error = response.error;
        }
        ModalAlert.showWarning(error, lang.MemberAcceptErrorTitle).always(function () {
          self._leaveWorkitemPerspective();
        });
      }).always(function () {
        self.unblockActions();
      });
    },

    onDomRefresh: function () {

      if ($('.wfstatusitem-bar').length > 0 && ($('.wfstatus-progress-view')[0].offsetHeight) > 0) {
        var stepList                = this.model.get('step_list'),
            currentStepListLength   = (stepList && stepList.current) ? stepList.current.length : 0,
            stoppedStepListLength   = (stepList && stepList.stopped) ? stepList.stopped.length : 0,
            completedStepListLength = (stepList && stepList.completed) ? stepList.completed.length :
                                      0,
            type                    = 'current',
            noOfNodes;

        if (currentStepListLength === 0 && stoppedStepListLength === 0) {
          noOfNodes = 2;
          type = 'completed';
        } else {
          if (stoppedStepListLength !== 0) {
            type = 'stopped';
            if (completedStepListLength === 0) {
              noOfNodes = 2;
            } else {
              noOfNodes = 3;
            }
          } else {
            if (completedStepListLength === 0) {
              noOfNodes = 3;
            } else {
              noOfNodes = 4;
            }
          }
        }

        this.body.currentView.onClickStep(type);
        this.body.currentView.adjustStepCardPosition(noOfNodes);
      }
    },

    _renderBody: function () {
      this.body.show(new WFStatusItemBodyView(this.viewOptions));
    },

    _renderTabPanel: function () {

      if (this.tabpanelCollection.models.length > 0) {
        var wfStatusItemTabPanelView = new WFStatusItemTabPanelView({
          collection: this.tabpanelCollection
        });
        this.tabPanel.show(wfStatusItemTabPanelView);
      }
    },
    onBeforeDestroy: function () {
      $(window).off("resize.app");
      this.model.reset();
      var Utils = require('workflow/utils/workitem.util');
      Utils.unbindPopover();
    }

  });

  return WFStatusProgressView;
});
