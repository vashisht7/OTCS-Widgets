/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/contexts/factories/connector',
  'i18n!conws/dialogs/addoreditrole/impl/nls/lang',
  'csui/utils/log',
  'csui/controls/progressblocker/blocker',
  'csui/models/permission/nodepermission.model',
  'conws/controls/wizard/wizard.view',
  'conws/dialogs/addoreditrole/impl/roledetails/roledetails.view',
  'conws/dialogs/addoreditrole/impl/rolepermissions/rolepermissions.view',
  'conws/dialogs/addoreditrole/impl/roleparticipants/roleparticipants.view',
], function (_, $, ConnectorFactory, lang, log, BlockingView, NodePermissionModel, WizardView, RoleDetailsView, RolePermissionsView, RoleParticipantsView) {
  "use strict";

  var defaultOptions = {
    initialSelection: [],
    dialogTitle: lang.dialogTitle
  };

  function addOrEditRoleWizard(options) {
    options || (options = {});
    this.options = _.defaults(options, defaultOptions);
    this.options.connector || (this.options.connector = this._getConnector(this.options));

    if (!this.options.connector) {
      var msg = lang.missingConnector;
      log.error(msg) && console.error(msg);
      throw new Error(msg);
    }
  }

  _.extend(addOrEditRoleWizard.prototype, {

    show: function () {
      this._showWizard();
      this._deferred = $.Deferred();
      return this._deferred.promise();
    },

    _showWizard: function () {
      this._steps = this._createWizardSteps();
      this._wizard = new WizardView({ steps: this._steps });
      BlockingView.imbue(this._wizard);
      this._wizard.show(this._wizard.options);
      this._wizard.on('save:result', this.onClickFinishButton, this);
      this._wizard.on('closing:wizard', this.onClickCancelButton, this);
    },

    _RoleDetailsView: function () {
      var roleDetailsView = new RoleDetailsView({
        addrole: this.options.addrole,
        teamLead: true,
        isFirstRole: this.options.isFirstRole
      });
      if (!this.options.addrole && this.options.model && this.options.model.get("right_id_expand")) {
        roleDetailsView.options.name = this.options.model.get("right_id_expand").name,
          roleDetailsView.options.description = this.options.model.get("right_id_expand").description,
          roleDetailsView.options.team_lead = this.options.model.get("right_id_expand").team_lead
      }
      roleDetailsView.on('required:field:changed', function () {
        var rolename_length = roleDetailsView.LeftRegion.currentView.$el.find("div[data-alpaca-container-item-name='role_name']").find("input[type='text']").val().length;
        if (rolename_length) {
          this._wizard.currentView.updateButton('next', { disabled: false });
          this._wizard.currentView.updateButton('done', { disabled: false });
        } else {
          this._wizard.currentView.updateButton('next', { disabled: true });
          this._wizard.currentView.updateButton('done', { disabled: true });
        }
      }, this);
      return roleDetailsView;
    },

    _RolePermissionsView: function () {
      var rolePermissionsView = new RolePermissionsView({
        addrole: this.options.addrole,
        model: this.options.model,
        isContainer: this.options.nodeModel ? this.options.nodeModel.get('container') : true,
        nodeModel: this.options.nodeModel
      });
      return rolePermissionsView;
    },

    _RoleParticipantsView: function () {
      var roleParticipantsView = new RoleParticipantsView(this.options);
      return roleParticipantsView;
    },

    dialogClassName: function () {
      var className = 'target-browse';
      if (this.options && this.options.userClassName) {
        className = className + " " + this.options.userClassName;
      }
      return className;
    },

    _createWizardSteps: function () {
      var options = this.options,
        rolePickerTitleId = 'rolePickerHeader',
        permissionLevelDescId = _.uniqueId('permissionLevel'),
        step1, step2, step3;
      step1 = {
        title: options.dialogTitle,
        view: this._RoleDetailsView(),
        className: this.dialogClassName() + ' csui-permissions-level conws-addoreditrole-dialog',
        nextButton: true,
        disableNext: this.options.addrole ? true : false,
        doneButtonLabel: lang.doneButtonLabel,
        disableDone: this.options.addrole ? true : false,
        doneButton: true,
        largeSize: true,
        attributes: { 'aria-labelledby': rolePickerTitleId }
      };
      step2 = {
        title: options.dialogTitle,
        nextButtonLabel: lang.nextButtonLabel,
        nextButton: true,
        disableNext: false,
        doneButtonLabel: lang.doneButtonLabel,
        disableDone: false,
        doneButton: true,
        largeSize: true,
        view: this._RolePermissionsView(),
        className: this.dialogClassName() + ' csui-permissions-level conws-addoreditrole-dialog',
        attributes: {
          'aria-labelledby': rolePickerTitleId,
          'aria-describedby': permissionLevelDescId
        }
      };
      step3 = {
        title: options.dialogTitle,
        doneButtonLabel: lang.doneButtonLabel,
        disableDone: false,
        doneButton: true,
        largeSize: true,
        view: this._RoleParticipantsView(),
        className: this.dialogClassName() + ' csui-permissions-level conws-addoreditrole-dialog',
        attributes: { 'aria-labelledby': rolePickerTitleId }
      };
      return [step1, step2, step3];
    },

    onHideDialog: function () {
      if (this._deferred) {
        if (this._result) {
          this._deferred.resolve(this._result);
        } else if (this._deferred.state() === 'pending') {
          this._deferred.reject({ cancelled: true });
        }
      }
    },

    onClickCancelButton: function () {
      this.onHideDialog();
    },

    onClickFinishButton: function () {
      var role_name, role_description, team_lead, permissions, applyToSubItems, isContainer, participants;
      if (this) {
        var roleDetailsView = this.getRoleDetailsView(),
          rolePermissionsView = this.getPermissionsView();
        if (roleDetailsView.LeftRegion && roleDetailsView.LeftRegion.currentView) {
          role_name = roleDetailsView.LeftRegion.currentView.getValues().role_name;
          role_description = roleDetailsView.LeftRegion.currentView.getValues().role_description;
        }
        team_lead = roleDetailsView.RightRegion && roleDetailsView.RightRegion.currentView &&
          roleDetailsView.RightRegion.currentView.getValues().team_lead;
        if (rolePermissionsView.PickerRegion && rolePermissionsView.PickerRegion.currentView) {
          permissions = rolePermissionsView.PickerRegion.currentView.getSelectedPermissions();
          if (permissions === null && !!rolePermissionsView.lastSelectedPermLevel &&
            rolePermissionsView.lastSelectedPermLevel === NodePermissionModel.PERMISSION_LEVEL_CUSTOM) {
            permissions = rolePermissionsView.lastSelectedCustomPermissions;
          }
          isContainer = (this.options.nodeModel && this.options.nodeModel.get("container")) ? true : false;
          if (rolePermissionsView.RightRegion && rolePermissionsView.RightRegion.currentView) {
            applyToSubItems = 0;
            if (isContainer) {
              applyToSubItems = rolePermissionsView.RightRegion.currentView.getValues().subitems_inherit ? 2 : 0;
            }
          }
        }
        if (this.getParticipantsView().participants) {
          participants = [];
          _.each(this.getParticipantsView().participants.models, function (participantModel) {
            participants.push(participantModel.get("id"));
          })
        }
        this._result = {
          role_name: role_name,
          role_description: role_description,
          team_lead: team_lead,
          permissions: permissions,
          apply_to: applyToSubItems,
          participants: participants
        };
        this._wizard.destroy();
        this.onHideDialog();
      }
      else {
        this._wizard.currentView.updateButton('next', { disabled: true });
      }
    },
    _getConnector: function (options) {
      var connector;
      if (options.context) {
        connector = options.context.getObject(ConnectorFactory);
      } else if (options.initialSelection || options.initialContainer) {
        var initalSelection = options.initialSelection,
          nodes = initalSelection ? (_.isArray(initalSelection) ? initalSelection :
            initalSelection.models) : undefined,
          node = options.initialContainer || nodes[0];
        connector = node && node.connector;
      }
      return connector;
    },

    getRoleDetailsView: function () {
      return this._steps[0].view;
    },

    getPermissionsView: function () {
      return this._steps[1].view;
    },

    getParticipantsView: function () {
      return this._steps[2].view;
    }

  });

  return addOrEditRoleWizard;

});
