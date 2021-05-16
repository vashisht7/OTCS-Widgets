/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['i18n!conws/utils/commands/nls/commands.lang'
], function (lang) {
    'use strict';
    return {
        inlineToolbar: [
            {
                signature: "AddOrEditRole",
                name: lang.CommandNameEditRole,
                icon: "icon icon-toolbar-edit-role",
                svgId: "themes--carbonfiber--image--generated_icons--action_view_column32"
            },
            {
                signature: "DeleteRole",
                name: lang.DeleteRoleTitleSingle,
                icon: "icon icon-toolbar-delete",
                svgId: "themes--carbonfiber--image--generated_icons--action_delete32"
            },
            {
                signature: "EditRolePermission",
                name: lang.ToolbarItemEditRolePermission,
                icon: "icon icon-toolbar-edit",
                svgId: "themes--carbonfiber--image--generated_icons--action_edit32"
            }
        ]
    };

});