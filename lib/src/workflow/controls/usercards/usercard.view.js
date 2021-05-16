/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/jquery', 'csui/utils/url', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/contexts/factories/connector',
  'csui/controls/toolbar/toolbar.view',
  'csui/controls/globalmessage/globalmessage',
  'csui/utils/user.avatar.color',
  'workflow/dialogs/action.dialog/action.dialog',
  'workflow/dialogs/action.dialog/action.dialog.model',
  'workflow/models/wfstatus/wfstatus.model.factory',
  'hbs!workflow/controls/usercards/impl/usercard',
  'i18n!workflow/controls/usercards/nls/lang',
  'css!workflow/controls/usercards/impl/usercard'
], function (require, $, Url, _, Backbone, Marionette, ConnectorFactory, ToolbarView, GlobalMessage, UserAvatarColor,
    ActionDialogView, ActionDialogModel, WFstatusModelFactory, Template, Lang) {
  'use strict';

  var UserCardView = Marionette.ItemView.extend({

    template: Template,

    className: 'wfstatus-usercard',

    constructor: function WFStatusUserCardView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.model.connector = this.options.context.getObject(ConnectorFactory, this.options);
    },

    events: {
      'mouseenter .wfstatus-mini-profile-user': 'showActions',
      'mouseleave .wfstatus-mini-profile-user': 'hideActions',
      'click .wfstatus-mini-profile-user-name, .wfstatus-user-profile-img': 'showUserProfileDialog',
      'click .wfstatus-reassignButton': 'showReassignDialogView'
    },

    templateHelpers: function () {
      var userBackgroundColor =  UserAvatarColor.getUserAvatarColor(this.model.attributes),
          WFStatusCollectionFactory = require(
          'workflow/models/wfstatus/wfstatus.collection.factory'),
          Utils                     = require('workflow/utils/workitem.util'),
          firstName                 = this.model.get('first_name') === null ? "" :
                                      this.model.get('first_name'),
          lastName                  = this.model.get('last_name') === null ? "" :
                                      this.model.get('last_name'),
          displayName               = firstName + " " + lastName,
          loginName                 = this.model.get('name'),
          phone                     = this.model.get('business_phone'),
          email                     = this.model.get('business_email'),
          photo                     = this.model.get('photo_url'),
          userId                    = this.model.get('id'),
          lastUserModel             = this.model.collection.at(this.model.collection.length - 1),
          lastUser                  = (lastUserModel.get("id") === this.model.get("id")) ? true :
                                      false,
          status                    = this.options.status,
          name                      = this.model.get('name'),
          wfStatusCollection        = this.options.context.getCollection(WFStatusCollectionFactory),
          chatSettings              = wfStatusCollection.options.chatSettings,
          isChatEnabled             = chatSettings ? chatSettings.chatEnabled : false,
          assigneeType              = this.model.get('type'),
          wfStatus                  = '',
          data                      = {},
          options                   = {},
          chatURI                   = '',
          displayReassign           = this.options.originatingView.model.get('hasReassignAction');
      if (this.options.nodeModel) {
        wfStatus = this.options.nodeModel.get('task_status');
      } else { // using originatingView to get workflow status in nodestable view
        wfStatus = this.options.originatingView.model.get('status_key');
      }
      options.domain = chatSettings.chatDomain;
      options.tguser = name;
      chatURI = Utils.getChatURI(options);
      if (assigneeType === 1) {
        data = {
          "name": name,
          "id": userId,
          "MultiUser": !this.model.get("singleUser"),
          "notLastUser": !lastUser
        };
      } else if (assigneeType === 0) {
        data = {
          "name": displayName === " " ? loginName : displayName,
          "business_phone": phone ? phone : "",
          "business_email": email ? email : "",
          "photoUrl": photo === null ? null : photo,
          "id": userId,
          "displayPic": photo === null ? 'hide' : 'show',
          "displayDefaultPic": photo === null ? 'show' : 'hide',
          "ChatLabel": Lang.ChatButtonLabel,
          "PhoneLabel": Lang.PhoneLabel,
          "MultiUser": !this.model.get("singleUser"),
          "notLastUser": !lastUser,
          "displayReassign": wfStatus !== 'completed' && wfStatus !== 'stopped' && displayReassign,
          "hasContactInfo": !!(phone || email),
          "initials": this.model.get("initials"),
          "userBackgroundColor": userBackgroundColor
        };
      }
      _.extend(data,
          {
            ReassignLabel: Lang.ReassignButtonLabel,
            status: status,
            assigneeType: assigneeType,
            isChatEnabled: isChatEnabled,
            chatURI: chatURI
          });
      return data;
    },

    showActions: function () {
      if (!this.model.get("singleUser")) {

        this.$el.find('.wfstatus-usercard-actions').addClass('wfstatus-usercard-footer');
        this.$el.find(".wfstatus-chatButton").show();
        this.$el.find(".wfstatus-reassignButton").show();
      }
    },

    hideActions: function () {

      if (!this.model.get("singleUser")) {

        this.$el.find(".wfstatus-chatButton").hide();
        this.$el.find(".wfstatus-reassignButton").hide();
        this.$el.find('.wfstatus-usercard-actions').removeClass('wfstatus-usercard-footer');
      }
    },

    onRender: function () {
      var Utils = require('workflow/utils/workitem.util'),
          self  = this;
      Utils.showProfilePic(this.model).always(function (response) {
        var photoUrl     = URL.createObjectURL(response),
            photoElement = $("#wfstatus-mini-profile-pic-" + self.model.get("id"));
        self.model.attributes.photoUrl = photoUrl;
        photoElement.attr("src", photoUrl);
      });

      this.firstUser = (this.model.collection.at(0).get("id") === this.model.get("id")) ? true :
                       false;

      var showActions = this.model.get("singleUser") ? false : this.firstUser;
      this.$el.find('.wfstatus-usercard-actions').addClass('wfstatus-usercard-footer');
      if (!showActions) {
        this.hideActions();
      }
    },

    showReassignDialogView: function (event) {

      var action        = this.model.set({id: 'Reassign'}),
          actionOptions = {
            requireAssignee: true,
            assigneeOptions: false,
            texts: {
              assigneeLabel: Lang.ReassignTo,
              commentPlaceholder: Lang.commentPlaceholder
            }
          };
      var dialogModel = new ActionDialogModel(_.extend({
        title: Lang.DialogHeaderMessage,
        requireComment: this.getOption('wfData').comments_on ?
                        this.getOption('wfData').comments_on :
                        this.getOption('originatingView').model.get('comments_on'),
        action: action
      }, actionOptions));
       this.actionDialog = new ActionDialogView({
        context: this.options.context,
        model: dialogModel,
        callback: _.bind(this.reAssignUser, this)
      });
      this.actionDialog.show();
    },

    updateReassignedStepCard: function (options) {
      var iterateStep = options.step,
          resp        = options.resp;
      iterateStep.task_assignees = resp.task_assignees;
      iterateStep.task_name = resp.task_name;
      iterateStep.task_status = resp.task_status;
    },

    reAssignUser: function (dialogModel, options) {

      var comment = dialogModel.get('comment');

      if (!_.isUndefined(comment) && comment.length !== 0) {
        this.model.set('comment', comment, {silent: true});
      }

      var assignee = dialogModel.get('assignee');
      if (!_.isUndefined(assignee)) {
        this.model.set('assignee', assignee.get('id'), {silent: true});
      }

      this.wfstatusmodel = this.options.context.getModel(WFstatusModelFactory);

      var that = this;
      that.wfstatusmodel.sendReAssignAction(that.options)
          .done(_.bind(function (response) {
            var Utils          = require('workflow/utils/workitem.util'),
                cellView       = that.options.originatingView,
                cellModel      = cellView.model,
                resp           = response.results[0],
                tableView      = cellView.options.tableView,
                stepCardModel  = that.options.nodeModel,
                isStepTypeNext = that.options.stepType === "next" ? true : false,
                listOfUsers    = {},
                userName;
            listOfUsers.assignedto = resp.task_assignees.assignedto;
            listOfUsers.assignees = resp.task_assignees.assignee;
            listOfUsers.isReassign = true;
            userName = Utils.getAssignee(listOfUsers);

            if (that.options.stepCardsListView || ( that.options.wfData &&
                                                    that.options.wfData.updateCurrentStepAssignee)) {

              var selectedTaskID, steplist,
                  parallelSteps = cellModel.get('parallel_steps');
              if ((this.options.wfData &&
                   this.options.wfData.updateCurrentStepAssignee)) {
                var taskName = resp.task_name;
                parallelSteps[0].task_assignees = resp.task_assignees;
                parallelSteps[0].task_name = taskName;
                parallelSteps[0].task_status = resp.task_status;
                cellModel.set('step_name', taskName);

              } else {

                selectedTaskID = that.options.nodeModel.get("task_id");
                var firstTaskId;
                if (!that.options.stepCardsListView.options.listViewMulCurrentSteps) {
                  steplist = that.options.stepCardsListView.options.step_list;
                  _.each([steplist, parallelSteps], function (steps) {
                    firstTaskId = steps[0].task_id;
                    _.any(steps, function (step) {
                      if (step.task_id === selectedTaskID) {
                        var options = {
                          steps: steps,
                          step: step,
                          resp: resp,
                          cellModel: cellModel,
                          firstTaskId: firstTaskId
                        };
                        that.updateReassignedStepCard(options);
                        return true;
                      }
                    });
                  });
                } else {

                  firstTaskId = parallelSteps[0].task_id;
                  _.any(parallelSteps, function (step) {
                    if (step.task_id === selectedTaskID) {
                      var options = {
                        steps: parallelSteps,
                        step: step,
                        resp: resp,
                        cellModel: cellModel,
                        firstTaskId: firstTaskId
                      };
                      that.updateReassignedStepCard(options);
                      return true;
                    }
                  });
                }

              }
            }

            if (isStepTypeNext || !selectedTaskID || (steplist && steplist.length === 1)) {
              that.updatingView(that, cellModel, resp, tableView, userName, isStepTypeNext);
            } else {
              var reassignedModel = cellModel.collection.where({
                process_id: cellModel.get("process_id"),
                subprocess_id: cellModel.get("subprocess_id"),
                task_id: selectedTaskID
              });
              if (reassignedModel && reassignedModel.length > 0) {
                that.updatingView(that, reassignedModel[0], resp, tableView, userName,
                    isStepTypeNext);
              }
            }
            if (stepCardModel) {
              stepCardModel.set("task_assignees", resp.task_assignees);
              stepCardModel.set("task_name", resp.task_name);
              stepCardModel.set("task_status", resp.task_status);

            }
            GlobalMessage.showMessage('success', Lang.SuccessMessage);
          }, this)).fail(_.bind(function (response) {
        GlobalMessage.showMessage('error',
            response.error === "" ? Lang.ErrorMessage : response.error);
      })).always(_.bind(function () {
        var Utils = require('workflow/utils/workitem.util');
        Utils.unbindPopover(options);

        if(!_.isUndefined(this.actionDialog)){
          this.actionDialog.destroy();
        }
      }, that));
    },
    updatingView: function (that, cellModel, resp, tableView, userName, isStepTypeNext) {
      var assigneeData = resp.task_assignees,
          wfstatus     = cellModel.collection.wfstatus;
      if (!isStepTypeNext) {
        if (_.has(assigneeData, "assignedto")) {
          assigneeData.assignedto.assignees = assigneeData.assignee;
          cellModel.set(
              {"assignedto": assigneeData.assignedto, "userId": assigneeData.assignedto.groupId});

          if (assigneeData.assignee.length > 0) {
            cellModel.set({"assignee_count": assigneeData.assigneeCount, "assignee": userName});

          } else {
            cellModel.set("assignee", "");
          }
        } else if (assigneeData.assignee.length === 1) {
          cellModel.unset("assignedto");
          cellModel.set({
            "assignee_count": assigneeData.assigneeCount,
            "assignee": userName,
            "userId": assigneeData.assignee[0].userId
          });
        }
        tableView.updateRow(cellModel);
        if (cellModel.collection.length === 1) {

          if (wfstatus) {
            wfstatus.get('data').assignee = assigneeData.assignee;
            wfstatus.trigger('change', wfstatus);
          } else {
            that.wfstatusmodel.get('data').assignee = assigneeData.assignee;
            that.wfstatusmodel.trigger('change');
          }
        }
      }
    },

    showUserProfileDialog: function (e) {

      var connector         = this.model.connector,
          context           = this.options.context,
          wfstatusExpandEle = $(".wfstatus.csui-expanded"),
          that              = this;
      this.model.attributes.display_name = this.model.get('name_formatted');

      require([
        'esoc/controls/userwidget/userwidget.view'
      ], function (UserWidgetView) {
        var options = {};
        options.model = that.model;
        options.connector = connector;
        options.userid = that.model.get('id');
        options.context = context;
        options.baseElement = undefined;
        options.showUserProfileLink = true;
        options.loggedUserId = that.model.get('id');
        options.dialogClassName = 'wfstatus-user-profile-dialog';
        options.dialogiconLeft = 'arrow_back wfstatus-user-widget-dialog-back';
        options.dialogiconRight = "wfstatus-no-righticon";

        bindUserWidgetEvents(UserWidgetView, options, true);

        function bindUserWidgetEvents(UserWidget, options, create) {

          var userWidgetInstace;
          if (create) {
            userWidgetInstace = new UserWidgetView(options);
          } else {
            userWidgetInstace = UserWidget;
          }
          userWidgetInstace.showUserProfileDialog();

          userWidgetInstace.off('userwidgetview.show.user.dialog').on(
              'userwidgetview.show.user.dialog',
              function (event) {
                var widgetOptions = _.extend({}, options);
                event.options.userid = event.options.model.id;

                var updatedOptions = _.extend(widgetOptions, event.options);
                delete updatedOptions["model"];
                updatedOptions.display_name = event.options.model.attributes.display_name;
                bindUserWidgetEvents(UserWidgetView, updatedOptions, true);
              });

          var esocUserProfileWidgetBackButtonEle = $('.wfstatus-user-profile-dialog' +
                                                     ' .esoc-user-widget-dialog-back');
          esocUserProfileWidgetBackButtonEle.off("click").on("click", function () {
            var prevUserview = userWidgetInstace.util.userStack.pop();
            if (prevUserview.model.id === userWidgetInstace.model.id) {
              prevUserview = userWidgetInstace.util.userStack.pop();
            }
            bindUserWidgetEvents(prevUserview, undefined, false);

          });

          var workflowUserProfileWidgetBackButtonEle = $(".wfstatus-user-widget-dialog-back");

          workflowUserProfileWidgetBackButtonEle.off("click").on("click", function () {

            if ($(".esoc-user-widget-dialog").is(':visible') ||
                $('.wfstatus-user-profile-dialog').is(':visible')) {
              $(".wfstatus-user-profile-dialog .cs-close").trigger('click');
            }
            wfstatusExpandEle.show();
          });

          var esocUserProfileWidgetCloseButtonEle = $('.esoc-user-widget-dialog' + ' .cs-close');
          esocUserProfileWidgetCloseButtonEle.off("click").on("click", function () {
            userWidgetInstace.util.userStack = [];
            wfstatusExpandEle.show();
          });

          if (userWidgetInstace.util.userDialog) {
            userWidgetInstace.util.userDialog.listenTo(userWidgetInstace.util.userDialog, 'destroy',
                function () {
                  wfstatusExpandEle.show();
                });
          }

        }
      });
    }
  });

  return UserCardView;

})
;