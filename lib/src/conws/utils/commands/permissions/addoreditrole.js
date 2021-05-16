/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/base',
  'csui/models/command',
  'conws/utils/commands/permissions/permissions.util',
  'i18n!conws/utils/commands/nls/commands.lang',

], function (require, _, $, base, CommandModel, PermissionsUtil, lang) {
  'use strict';
  var GlobalMessage;

  var AddOrEditRoleCommand = CommandModel.extend({
    defaults: {
      signature: "AddOrEditRole",
      name: lang.CommandNameAddRole
    },

    enabled: function (status) {
      var nodeModel = status.nodeModel || (status.originatingView && status.originatingView.model);
      if (PermissionsUtil.isWorkspace(nodeModel)) {
        if (status.nodeModel) {
          return true;
        }
        else if (!status.nodeModel && !!status.model && PermissionsUtil.isWorkspaceRole(status.model) &&
          !PermissionsUtil.isInheritedRole(nodeModel, status.model)) {
          return true;
        } else {
          return false;
        }
      }
      else {
        return false;
      }
    },

    execute: function (status, options) {
      var self = this;
      var deferred = $.Deferred();
      var context = status.context || options && options.context;
      status.addrole = !!status.nodeModel
      status.suppressSuccessMessage = true;
      require(['csui/models/permission/nodepermission.model',
        'csui/controls/globalmessage/globalmessage'
      ], function (NodePermissionModel) {
        GlobalMessage = arguments[1];

        if (!status.addrole && status.model) {
          status.model.action = "fetch";
          status.model.nodeId = status.originatingView && status.originatingView.model && status.originatingView.model.get("id");
          var url = PermissionsUtil.getUrl(status.model);
          status.model.fetch({
            url: url
          }).done(function () {
            if (status.model.get("results") && status.model.get("results").data &&
              status.model.get("results").data.members && status.model.get("results").data.properties) {
              status.model.set("members", status.model.get("results").data.members);
              status.model.get("right_id_expand").name = status.model.get("results").data.properties.name;
              status.model.get("right_id_expand").description = status.model.get("results").data.properties.description;
              status.model.get("right_id_expand").team_lead = status.model.get("results").data.properties.leader;
            }
            status.model.unset('links');
            status.model.unset('results');
            status.model.unset('addEmptyAttribute');

            self._selectAddOrEditRoleOptions(status, options)
              .done(function (selectedOptions) {
                var roleModelData = {
                  name: selectedOptions.role_name,
                  description: selectedOptions.role_description,
                  leader: selectedOptions.team_lead
                }
                if (!!selectedOptions.permissions) {
                  roleModelData.permissions = selectedOptions.permissions;
                  roleModelData.apply_to = selectedOptions.apply_to;
                  roleModelData.include_sub_types = selectedOptions.apply_to > 0 ? [204, 207, 215, 298, 3030202] : []
                }
                if (!!selectedOptions.participants) {
                  roleModelData.members = selectedOptions.participants;
                }
                status.model.action = "update";
                url = PermissionsUtil.getUrl(status.model);
                status.model.save(roleModelData, {
                  url: url,
                  patch: true,
                  wait: true,
                  silent: true
                }).done(function () {

                  var right_id_expand = status.model.get("right_id_expand");
                  if( right_id_expand.name !== selectedOptions.role_name ){
                    var memberModel = _.find(status.model.collection.extraMemberModels, { id: status.model.get("right_id") });
                    if( memberModel ){
                      memberModel.set("name", selectedOptions.role_name);
                      memberModel.set("name_formatted", selectedOptions.role_name);
                    }
                  }

                  right_id_expand.name = selectedOptions.role_name;
                  right_id_expand.name_formatted = selectedOptions.role_name;
                  right_id_expand.description = selectedOptions.role_description;
                  right_id_expand.team_lead = selectedOptions.team_lead;
                  if (selectedOptions.team_lead) {
                    var nodeModel = status.nodeModel || (status.originatingView && status.originatingView.model);
                    $.each(status.model.collection.models, function (index, model) {
                      PermissionsUtil.isWorkspaceRole(model) &&
                        !PermissionsUtil.isInheritedRole(nodeModel, model) &&
                        (model.get("right_id_expand").leader_id = right_id_expand.id);
                    });
                    right_id_expand.leader_id = right_id_expand.id;
                    $.each(status.model.collection.extraMemberModels, function (index, model) {
                      PermissionsUtil.isWorkspaceRole(model) &&
                        !PermissionsUtil.isInheritedRole(nodeModel, model) &&
                        model.set("leader_id", right_id_expand.id);
                    });
                  }
                  if (!!selectedOptions.permissions && !!selectedOptions.apply_to) {
                    right_id_expand.permissions = selectedOptions.permissions;
                    status.model.set("permissions", selectedOptions.permissions);
                    right_id_expand.apply_to = selectedOptions.apply_to;
                  }
                  if (!!selectedOptions.participants && selectedOptions.participants.length > 0) {
                    right_id_expand.members = selectedOptions.participants;
                    status.model.set("members", selectedOptions.participants);
                  }
                  status.model.set({
                    right_id_expand: right_id_expand,
                    type: 'custom'
                  }, { silent: true });

                  GlobalMessage.showMessage('success', self._getMessageWithRoleName(status.model));
                  if (status.originatingView && status.originatingView.unblockActions) {
                    status.originatingView.unblockActions();
                  }
                  if (status.originatingView && status.originatingView.permissionsContentView &&
                    status.originatingView.permissionsContentView.permissionsListView) {
                    status.originatingView.permissionsContentView.permissionsListView.trigger("update:table", status.model);
                  }
                  deferred.resolve(status.model);
                }).fail(function (response) {
                  var error = new base.Error(response);
                  if (status.originatingView && status.originatingView.unblockActions) {
                    status.originatingView.unblockActions();
                  }
                  GlobalMessage.showMessage('error', error);
                  deferred.reject(status.model, error);
                });
              }).fail(function (error) {
                deferred.reject(error);
              });
          }).fail(function (error) {
            deferred.reject(error);
          });
        }
        else {
          status.isWorkspaceRoleExists = status.permissionCollection.models.some(function (model) {
            return PermissionsUtil.isWorkspaceRole(model) && !PermissionsUtil.isInheritedRole(status.nodeModel, model);
          }, this);

          self._selectAddOrEditRoleOptions(status, options)
            .done(function (selectedOptions) {
              var apply_to = (selectedOptions.apply_to !== undefined) ? selectedOptions.apply_to : 2,
              roleModelData = {
                name: selectedOptions.role_name,
                description: selectedOptions.role_description,
                leader: selectedOptions.team_lead,
                members: selectedOptions.participants,
                permissions: (selectedOptions.permissions !== undefined) ? selectedOptions.permissions : NodePermissionModel.getReadPermissions(),
                apply_to: apply_to,
                include_sub_types: apply_to > 0 ? [204, 207, 215, 298, 3030202] : []
              },
                nodeRolePermissionModel = new NodePermissionModel(roleModelData, status);
              nodeRolePermissionModel.unset('addEmptyAttribute');
              nodeRolePermissionModel.action = "create";
              nodeRolePermissionModel.nodeId = status.nodeId;
              if (status.originatingView && status.originatingView.blockActions) {
                status.originatingView.blockActions();
              }
              var url = PermissionsUtil.getUrl(nodeRolePermissionModel);
              nodeRolePermissionModel.save(roleModelData, {
                url: url,
                silent: true,
                wait: true
              }).done(function (response) {
                var currentLeaderId, properties = response.results && response.results.data && response.results.data.properties,
                  right_id = properties && properties.id,
                  isLeader = properties && properties.leader,
                  nodeModel = status.nodeModel || (status.originatingView && status.originatingView.model);
                if (isLeader) {
                  $.each(status.permissionCollection.models, function (index, model) {
                    PermissionsUtil.isWorkspaceRole(model) &&
                      !PermissionsUtil.isInheritedRole(nodeModel, model) &&
                      (model.get("right_id_expand").leader_id = right_id);
                  });
                  $.each(status.permissionCollection.extraMemberModels, function (index, model) {
                    PermissionsUtil.isWorkspaceRole(model) &&
                      !PermissionsUtil.isInheritedRole(nodeModel, model) &&
                      model.set("leader_id", right_id);
                  });
                } else {
                  var filteredModels = _.filter(status.permissionCollection.models, function (model) {
                    return PermissionsUtil.isWorkspaceRole(model) && PermissionsUtil.isLeaderRole(nodeModel, model);
                  });
                  currentLeaderId = filteredModels.length && filteredModels[0].get("right_id_expand").leader_id;
                }

                nodeRolePermissionModel.set({
                  right_id_expand: {
                    id: right_id,
                    initials: selectedOptions.role_name[0],
                    leader_id: isLeader ? right_id : currentLeaderId,
                    name: selectedOptions.role_name,
                    name_formatted: selectedOptions.role_name,
                    type: 848,
                    node_id: status.nodeId,
                    type_name: lang.BusinessWorkspaceRole
                  },
                  type: 'custom',
                  right_id: right_id
                },
                  { silent: true });
                GlobalMessage.showMessage('success',
                  self._getMessageWithRoleName(nodeRolePermissionModel));
                if (status.originatingView && status.originatingView.unblockActions) {
                  status.originatingView.unblockActions();
                }
                deferred.resolve(nodeRolePermissionModel);
              }).fail(function (response) {
                var error = new base.Error(response);
                if (status.originatingView && status.originatingView.unblockActions) {
                  status.originatingView.unblockActions();
                }
                GlobalMessage.showMessage('error', error);
                deferred.reject(nodeRolePermissionModel, error);
              });
            })
            .fail(function (error) {
              deferred.reject(error);
            });
        }
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },

    _selectAddOrEditRoleOptions: function (status, options) {
      var self = this;
      var deferred = $.Deferred();
      require(['conws/dialogs/addoreditrole/addoreditrole.wizard'],
        function (AddOrEditRoleWizard) {
          var addOrEditRoleWizard = new AddOrEditRoleWizard({
            command: 'addoreditrole',
            context: status.context,
            connector: status.connector,
            dialogClass: 'cs-permission-role-picker',
            displayName: status.addrole ? lang.CommandNameAddRole : lang.CommandNameEditRole,
            dialogTitle: status.addrole ? lang.CommandNameAddRole : lang.CommandNameEditRole,
            addrole: status.addrole,
            nodeModel: status.addrole ? status.nodeModel : status.originatingView.model,
            model: status.model,
            addButtonLabel: lang.AddButtonLabel,
            availablePermissions: status.addrole ? status.permissionCollection.availablePermissions : status.originatingView.collection,
            applyTo: status.applyTo,
            isFirstRole: !status.isWorkspaceRoleExists
          });

          addOrEditRoleWizard
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

    _getMessageWithRoleName: function (permissionModel) {
      var msg, displayName;
      if (permissionModel.get("right_id_expand")) {
        displayName = base.formatMemberName(permissionModel.get("right_id_expand"));
      }
      if (!!permissionModel.action && permissionModel.action === "update") {
        msg = _.str.sformat(lang.EditRoleSuccess, displayName);
      }
      else {
        msg = _.str.sformat(lang.AddRoleSuccess, displayName);
      }

      return msg;
    }
  });

  return AddOrEditRoleCommand;
});