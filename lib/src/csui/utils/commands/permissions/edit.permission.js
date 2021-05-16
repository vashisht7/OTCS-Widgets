/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', "csui/lib/backbone", 'csui/lib/jquery',
  'csui/utils/base',
  'csui/models/command', 'csui/utils/commandhelper', 'csui/utils/command.error',
  'i18n!csui/utils/commands/nls/localized.strings',
  'csui/utils/commands/permissions/permission.util'
], function (module, require, _, Backbone, $, base, CommandModel,
    CommandHelper, CommandError, lang, PermissionUtil) {
  'use strict';

  var config = _.extend({}, module.config());

  var EditPermissionCommand = CommandModel.extend({
    defaults: {
      signature: 'EditPermission',
      command_key: ['editpermissions', 'Edit Permissions']
    },

    enabled: function (status) {
      var permissionModel        = status.model,
          type                   = permissionModel && permissionModel.get('right_id_expand') &&
                                                      permissionModel.get('right_id_expand').type,
          collection             = permissionModel && permissionModel.collection,
          right_id               = permissionModel && permissionModel.get('right_id'),
          permissionType         = permissionModel && permissionModel.get('type'),
          filterId               = status.filterId,
          nodeModel              = status.nodeModel || (status.originatingView &&
                                                        status.originatingView.model),
          userHasEditPermissions = nodeModel && nodeModel.actions &&
                                    !!nodeModel.actions.get({signature: 'editpermissions'}),
          memberTypeSupport      = [0,1],
          isDisable              = (memberTypeSupport.indexOf(type) < 0) && permissionType === "custom";
      if (!isDisable) {
        return !filterId && permissionType && (right_id || permissionType === "public") &&
             collection &&
             collection.options && collection.options.node && !!collection.options.node.get('id') &&
             userHasEditPermissions;
      } else {
        return false;
      }
    },

    execute: function (status, options) {
      var self            = this,
          deferred        = $.Deferred(),
          permissionModel = status.model,
          collection      = permissionModel.collection,
          targetView      = status.targetView;

      self.targetView = targetView;
      status.suppressFailMessage = true;
      status.suppressSuccessMessage = true;

      var failureMsg = this._getMessageWithUserDisplayName(lang.EditPermissionCommandFailMessage,
          permissionModel);
      var userHasEditPermissions = collection && collection.options && collection.options.node &&
                                   collection.options.node.actions.get(
                                       {signature: 'editpermissions'});

      if (collection && !!userHasEditPermissions) {
        permissionModel.nodeId = collection.options && collection.options.node &&
                                 collection.options.node.get('id');

        require(
            ['csui/widgets/permissions/impl/edit/edit.permission.helper',
              'csui/utils/contexts/factories/user', 'csui/controls/globalmessage/globalmessage',
              'csui/utils/permissions/permissions.precheck'
            ],
            function (EditPermissionHelper, UserModelFactory, GlobalMessage, PermissionPreCheck) {
              var user = status.originatingView.context.getModel(UserModelFactory);
              self.loginUserId = user.get('id');
              self.editPermissionHelper = new EditPermissionHelper({
                permissionModel: permissionModel,
                popoverPlacement: "left",
                popoverAtBodyElement: status.originatingView ?
                                      !status.originatingView.options.isExpandedView : true,
                popoverTargetElement: status.targetView.permissions.$el,
                readonly: false,
                originatingView: status.originatingView,
                applyTo: status.applyTo
              });
              self.editPermissionHelper._showSelectPermissionLevelPopover();
              self.editPermissionHelper.listenTo(self.editPermissionHelper,
                  "permissions:selected", function (userSelection) {
                    var saveAttr = {
                      "permissions": userSelection.permissions,
                      "apply_to": userSelection.apply_to,
                      "include_sub_types": userSelection.apply_to > 0 ?
                                           PermissionPreCheck.includeSubTypes() : []
                    };
                    if (userSelection.right_id) {
                      saveAttr.right_id = userSelection.right_id;
                    }
                    permissionModel.save(saveAttr, {
                      patch: true,  // let form data be 'body:{"name":"Pictures"}' and uploadable
                      wait: true,
                      silent: true
                    }).done(function (response) {

                      permissionModel.set(saveAttr, {silent: true});
                      status.originatingView.trigger('permission:changed', status);
                      self.editPermissionHelper.destroy();
                      self.editPermissionHelper.unblockActions();
                      deferred.resolve();
                      if (status.originatingView.model.get('permissions_model') !== 'simple') {
                        PermissionUtil.generateSuccessMessage(response, GlobalMessage);
                      } 
                    }).fail(function (error) {
                      var commandError = error ? new CommandError(error, permissionModel) :
                                         error;
                      GlobalMessage.showMessage('error', commandError);
                      deferred.reject(permissionModel, commandError);
                    });
                  });

              self.editPermissionHelper.listenTo(self.editPermissionHelper,
                  "closed:permission:level:popover", function () {
                    deferred.reject(permissionModel);
                  });
            });
      } else {
        return deferred.reject(
            new CommandError(failureMsg, {errorDetails: lang.undefinedCollection}));
      }
      return deferred.promise();
    },

    _getMessageWithUserDisplayName: function (unformattedMsg, permissionModel) {
      var displayName;
      if (permissionModel.get("right_id_expand")) {
        displayName = base.formatMemberName(permissionModel.get("right_id_expand"));
      } else if (permissionModel.get("type") === "public") {
        displayName = lang.publicAccess;
      }
      var msg = _.str.sformat(unformattedMsg, displayName);
      return msg;
    }
  });

  return EditPermissionCommand;
});
