/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/base',
  'csui/models/command',
  'csui/utils/command.error',
  'csui/utils/commands/permissions/permission.util',
  'conws/utils/commands/permissions/permissions.util',
  'i18n!csui/utils/commands/nls/localized.strings'
], function (require, _, $, base, CommandModel, CommandError, PermissionUtil, ConwsPermissionsUtil, lang ) {
  'use strict';
  
    var EditRolePermissionCommand = CommandModel.extend({
      defaults: {
        signature: 'EditRolePermission',
        command_key: ['editpermissions', 'Edit Permissions']
      },
  
      enabled: function (status) {
        var permissionModel = status.model,
            permissionType  = permissionModel && permissionModel.get('type'),
            nodeModel       = status.nodeModel || (status.originatingView && 
                                                  status.originatingView.model),
            enabled         = permissionType && permissionType === "custom" &&
                              ConwsPermissionsUtil.isWorkspaceRole(permissionModel) &&
                              nodeModel.actions && !!nodeModel.actions.get({signature: 'editpermissions'});
  
        return enabled;
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
              ['conws/utils/commands/permissions/edit.role.permission.helper',
                'csui/utils/contexts/factories/user', 'csui/controls/globalmessage/globalmessage',
                'csui/utils/permissions/permissions.precheck'
              ],
              function (EditRolePermissionHelper, UserModelFactory, GlobalMessage, PermissionPreCheck) {
                var user = status.originatingView.context.getModel(UserModelFactory);
                self.loginUserId = user.get('id');
                self.editRolePermissionHelper = new EditRolePermissionHelper({
                  permissionModel: permissionModel,
                  popoverPlacement: "left",
                  popoverAtBodyElement: status.originatingView ?
                                        !status.originatingView.options.isExpandedView : true,
                  popoverTargetElement: status.targetView.permissions.$el,
                  readonly: false,
                  originatingView: status.originatingView,
                  applyTo: status.applyTo
                });
                self.editRolePermissionHelper._showSelectPermissionLevelPopover();
                self.editRolePermissionHelper.listenTo(self.editRolePermissionHelper,
                    "permissions:selected", function (userSelection) {
                      var url, saveAttr = {
                        "permissions": userSelection.permissions,
                        "apply_to": userSelection.apply_to,
                        "include_sub_types": userSelection.apply_to > 0 ?
                                             PermissionPreCheck.includeSubTypes() : []
                      },
                      nodeModel = ( self.targetView && self.targetView.options && self.targetView.options.nodeModel ) ||
                      ( self.targetView && self.targetView.permissions && self.targetView.permissions.options && self.targetView.permissions.options.nodeModel );

                      if (userSelection.right_id) {
                        saveAttr.right_id = userSelection.right_id;
                      }
                      if ( ConwsPermissionsUtil.isWorkspace(nodeModel) && ConwsPermissionsUtil.isWorkspaceRole(permissionModel) ) {
                        permissionModel.action = 'editperms';
                        url = ConwsPermissionsUtil.getUrl(permissionModel);
                      }
                      permissionModel.save(saveAttr, {
                        url: url,
                        patch: true,
                        wait: true,
                        silent: true
                      }).done(function (response) {
  
                        permissionModel.set(saveAttr, {silent: true});
                        status.originatingView.trigger('permission:changed', status);
                        self.editRolePermissionHelper.destroy();
                        self.editRolePermissionHelper.unblockActions();
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
  
                self.editRolePermissionHelper.listenTo(self.editRolePermissionHelper,
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
  
    return EditRolePermissionCommand;
  });
  