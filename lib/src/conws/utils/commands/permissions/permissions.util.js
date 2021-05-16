/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/utils/url'
], function (Url) {
    'use strict';
    var PermissionsUtil = {
        getUrl: function (nodeRolePermissionModel) {
            var nodeId = nodeRolePermissionModel.nodeId,
                url = nodeRolePermissionModel.connector.connection.url.replace('/v1', '/v2');
            url = Url.combine(url, 'businessworkspaces', nodeId, 'roles');

            if (!!nodeRolePermissionModel.action) {
                var roleId;
                if (nodeRolePermissionModel.action === "delete" || nodeRolePermissionModel.action === "editperms") {
                    roleId = nodeRolePermissionModel.get("right_id");
                    url = Url.combine(url, roleId);
                }
                else if (nodeRolePermissionModel.action === "fetch" || nodeRolePermissionModel.action === "update") {
                    roleId = nodeRolePermissionModel.get("right_id");
                    var queryparameters = Url.combineQueryString({
                        fields: "members"
                    });
                    url = Url.combine(url, roleId);
                    url = url + "?" + queryparameters;
                }
            }
            return url;
        },

        isWorkspaceRole: function (model) {
            var isWorkspaceRole, right_id_expand = model.get('right_id_expand');
            if (!!right_id_expand) {
                isWorkspaceRole = !!right_id_expand.type && (right_id_expand.type === 848);
            }
            else {
                isWorkspaceRole = !!model.get('type') && (model.get('type') === 848);
            }
            return isWorkspaceRole;
        },

        isLeaderRole: function (nodeModel, model) {
            var isLeaderRole, isInheritedRole = this.isInheritedRole(nodeModel, model),
            right_id_expand = model.get('right_id_expand');
            if (!!right_id_expand) {
                isLeaderRole = !isInheritedRole && !!right_id_expand.id && !!right_id_expand.leader_id && (right_id_expand.id === right_id_expand.leader_id);   
            }
            else{
                isLeaderRole = !isInheritedRole && !!model.get("id") && !!model.get("leader_id") && (model.get("id") === model.get("leader_id"));   
            }
             
            return isLeaderRole;
        },

        isInheritedRole: function (nodeModel, model) {
            var isInheritedRole, right_id_expand = model.get('right_id_expand');
            if (!!right_id_expand) {
                isInheritedRole = !!right_id_expand.node_id &&
                    !!nodeModel && !!nodeModel.get("id") &&
                    (right_id_expand.node_id !== nodeModel.get("id"));
            }
            else {
                isInheritedRole = !!model.get('node_id') &&
                    !!nodeModel && !!nodeModel.get("id") &&
                    (model.get('node_id') !== nodeModel.get("id"));
            }
            return isInheritedRole;

        },

        isWorkspace: function (nodeModel) {
            return !!nodeModel && !!nodeModel.get("type") && (nodeModel.get("type") === 848);
        }
    };
    return PermissionsUtil;

});