/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/base',
  'i18n!csui/utils/commands/nls/localized.strings', 'csui/utils/log',
  'csui/models/command', 'csui/utils/command.error'
], function (module, require, _, $, base, lang, log, CommandModel, CommandError) {
  'use strict';
  var GlobalMessage, ModalAlert;
  var config = module.config();

  var AddOwnerOrOwnerGroupCommand = CommandModel.extend({
    defaults: {
      signature: "addownerorgroup",
      name: lang.CommandNameAddOwnerOrOwnerGroup
    },

    enabled: function (status) {
      var collection     = status.originalCollection ? status.originalCollection :
                           status.permissionCollection,
          owner          = collection.findWhere({type: 'owner'}),
          noOwnerOrGroup = (owner && owner.get('permissions') === null),
          noGroup        = !collection.findWhere({type: 'group'}),
          enabled        = collection && (status.nodeModel && status.nodeModel.actions
                           && !!status.nodeModel.actions.get({signature: 'editpermissions'})) &&
                           (noOwnerOrGroup ||
                            noGroup || !owner),
          adminPrivilege = status.authUser &&
                           status.authUser.get('privilege_system_admin_rights');

      if (!adminPrivilege && config &&
          ((config.AdminRestoreOwner && config.AdminRestoreOwnerGroup) ||
           (!noOwnerOrGroup && noGroup && config.AdminRestoreOwnerGroup) ||
           (!noOwnerOrGroup && !noGroup && config.AdminRestoreOwner))) {
        enabled = adminPrivilege;
      }

      if (enabled && !!status.toolItem) {
        if (noOwnerOrGroup) {
          if (adminPrivilege) {
            status.toolItem.set('name', lang.AddOwnerOrGroup);
          } else {
            if (config && config.AdminRestoreOwner) {
              if (config && !config.AdminRestoreOwnerGroup) {
                status.toolItem.set('name', lang.AddOwnerGroup);
              }
            } else {
              if (config && config.AdminRestoreOwnerGroup) {
                status.toolItem.set('name', lang.AddOwner);
              } else {
                status.toolItem.set('name', lang.AddOwnerOrGroup);
              }
            }
          }
        } else if (noGroup) {
          status.toolItem.set('name', lang.AddOwnerGroup);
        } else {
          status.toolItem.set('name', lang.AddOwner);
        }
      }
      return enabled;
    },

    execute: function (status, options) {
      var self = this;
      var deferred = $.Deferred();
      var context = status.context || options && options.context;
      status.suppressSuccessMessage = true;
      require(['csui/models/permission/nodepermission.model',
        'csui/utils/permissions/permissions.precheck',
        'csui/controls/globalmessage/globalmessage',
        'csui/dialogs/modal.alert/modal.alert'
      ], function (NodePermissionModel, PermissionPreCheck) {
        GlobalMessage = arguments[2];
        ModalAlert = arguments[3];

        self._selectAddOwnerOrOwnerGroupOptions(status, options)
            .done(function (selectedOptions) {
              var selectedMember      = selectedOptions.members,
                  selectedPermissions = selectedOptions.permissions,
                  type                = selectedMember.get('type') === 0 ? 'owner' : 'group',
                  permissionModelData = {
                    type: type,
                    right_id: selectedMember.get('id'),
                    permissions: selectedPermissions,
                    apply_to: selectedOptions.apply_to,
                    include_sub_type: selectedOptions.apply_to > 0 ?
                                      PermissionPreCheck.includeSubTypes() : []
                  },
                  saveAttr            = {
                    right_id: selectedMember.get('id'),
                    apply_to: selectedOptions.apply_to,
                    permissions: selectedPermissions
                  },
                  nodePermissionModel = new NodePermissionModel(permissionModelData, status);

              nodePermissionModel.nodeId = status.nodeModel ? status.nodeModel.get("id") :
                                           status.nodeId;
              if (status.originatingView && status.originatingView.blockActions) {
                status.originatingView.blockActions();
              }
              nodePermissionModel.save(saveAttr, {
                patch: true,
                silent: true,
                wait: true
              }).done(function () {
                nodePermissionModel.set(
                    {
                      right_id_expand: _.clone(selectedMember.attributes),
                      type: type,
                      addOwnerGroup: true
                    },
                    {silent: true});
                if (status.originatingView && status.originatingView.unblockActions) {
                  status.originatingView.unblockActions();
                }
                GlobalMessage.showMessage('success',
                    self._getMessageWithUserDisplayName(nodePermissionModel));
                deferred.resolve(nodePermissionModel);
              }).fail(function (error) {
                var commandError = error ? new CommandError(error, nodePermissionModel) :
                                   error;
                if (status.originatingView && status.originatingView.unblockActions) {
                  status.originatingView.unblockActions();
                }
                GlobalMessage.showMessage('error', commandError);
                deferred.reject(nodePermissionModel, commandError);
              });
            }).fail(function (error) {
          deferred.reject(error);
        });
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },

    _selectAddOwnerOrOwnerGroupOptions: function (status, options) {
      var self              = this,
          deferred          = $.Deferred(),
          owner             = status.originalCollection ?
                              status.originalCollection.findWhere({type: 'owner'}) :
                              status.permissionCollection.findWhere({type: 'owner'}),
          displayName       = lang.allUsersAndGroups,
          selectableTypes, title, startLocation, startLocations,
          authUser = status.authUser || status.originatingView.options.authUser ||
                              (status.context && status.context._user);
      if (owner && owner.get('permissions') === null) {
        selectableTypes = [0, 1];
        title = lang.AddOwnerOrGroupDialogTitle;
        startLocation = 'all.members';
        startLocations = ['all.members', 'member.groups'];
        if (config && config.AdminRestoreOwner && !config.AdminRestoreOwnerGroup &&
            !(authUser.get('privilege_system_admin_rights'))) {
          startLocation = 'all.groups';
          displayName = lang.allGroups;
          selectableTypes = [1];
          startLocations = ['all.groups', 'member.groups'];
        } else if (config && !config.AdminRestoreOwner && config.AdminRestoreOwnerGroup &&
                   !(authUser.get('privilege_system_admin_rights'))) {
          startLocation = 'all.members';
          displayName = lang.allUsersAndGroups;
          selectableTypes = [0];
          startLocations = ['all.members', 'member.groups'];
        }

      }
      else {
        selectableTypes = owner ? [1] : [0];
        title = owner ? lang.AddOwnerGroupDialogTitle : lang.AddOwnerDialogTitle;
        displayName = owner ? lang.allGroups : displayName;
        startLocation = owner ? 'all.groups' : 'all.members';
        startLocations = owner ? ['all.groups', 'member.groups'] : ['all.members', 'member.groups'];
      }
      require(['csui/dialogs/members.picker/members.picker.wizard'],
          function (MembersPickerDialog) {
            var membersPickerDialog = new MembersPickerDialog({
              command: 'addownerorownergroup',
              context: status.context,
              connector: status.connector,
              dialogClass: 'cs-permission-group-picker',
              displayName: displayName,
              dialogTitle: title,
              startLocation: startLocation,
              nodeModel: status.nodeModel,
              availablePermissions: status.permissionCollection.availablePermissions,
              adduserorgroup: true,
              addButtonLabel: lang.AddButtonLabel,
              startLocations: startLocations,
              selectableTypes: selectableTypes,              
              applyTo: status.applyTo
            });
            membersPickerDialog
                .show()
                .done(function () {
                  deferred.resolve.apply(deferred, arguments);
                }).fail(function (error) {
              deferred.reject.apply(deferred, arguments);
            });
          }, function (error) {
            deferred.reject(error);
          });
      return deferred.promise();
    },

    _getMessageWithUserDisplayName: function (permissionModel) {
      var displayName;
      if (permissionModel.get("right_id_expand")) {
        displayName = base.formatMemberName(permissionModel.get("right_id_expand"));
      }
      var msg;
      if (permissionModel.get('results') && permissionModel.get('results').success > 0) {
        msg = _.str.sformat(lang.AddUserOrGroupSuccessWithCount, displayName,
            base.formatMessage(permissionModel.get('results').success, lang));
      } else {
        msg = _.str.sformat(lang.AddUserOrGroupSuccess, displayName);
      }
      return msg;
    }
  });

  return AddOwnerOrOwnerGroupCommand;
});