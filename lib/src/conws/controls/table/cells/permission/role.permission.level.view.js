/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore',
    'csui/controls/table/cells/permission/permission.level.view',
    'csui/utils/commands',
    'csui/controls/table/cells/cell.registry',
    'conws/utils/commands/permissions/permissions.util'
], function ($, _, PermissionLevelCellView, commands, cellViewRegistry, PermissionsUtil) {
    'use strict';

    var RolePermissionLevelCellView = PermissionLevelCellView.extend({

        constructor: function RolePermissionLevelCellView(options) {
            RolePermissionLevelCellView.__super__.constructor.apply(this, arguments);
            this.$ = $;
        },
        onClickPermissionLevel: function (e) {
            var command,
                isWorkspaceRole = PermissionsUtil.isWorkspaceRole(this.options.model),
                membersTypeSupport = [0, 1, 848];
            if (membersTypeSupport.indexOf(
                this.options.model.get("right_id_expand") &&
                this.options.model.get("right_id_expand").type) < 0 &&
                this.options.model.get("type") === "custom") {
                this._handlePermissionLevelFocus({ cellView: this });
            } else {
                command = isWorkspaceRole ? commands.get('EditRolePermission') : commands.get('EditPermission');
                this._handlePermissionLevelClicked({ cellView: this, command: command });
                this.trigger("cell:content:clicked", this);
            }
        }
    });

    cellViewRegistry.registerByColumnKey('permissions', RolePermissionLevelCellView);

    return RolePermissionLevelCellView;
});