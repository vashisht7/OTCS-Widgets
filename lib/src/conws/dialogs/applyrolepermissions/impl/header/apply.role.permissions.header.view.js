/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore',
    'csui/widgets/permissions/impl/edit/apply.permission/impl/header/apply.permission.header.view',
    'i18n!conws/dialogs/applyrolepermissions/impl/nls/lang'
], function (_, ApplyPermissionHeaderView,
    lang) {
        "use strict";

        var ApplyRolePermissionHeaderView = ApplyPermissionHeaderView.extend({

            templateHelpers: function () {
                var headerTitle = "";
                if (this.options.removePermission && this.options.permissionModel) {
                    var memberName = this.options.permissionModel.get("right_id_expand") &&
                        this.options.permissionModel.get("right_id_expand").name_formatted;
                    if (this.options.permissionModel.isRoleDelete) {
                        headerTitle = _.str.sformat(lang.deleteRolePermissionHeaderTitle, memberName);
                    } else {
                        headerTitle = _.str.sformat(lang.removeRolePermissionHeaderTitle, memberName);
                    }
                } else {
                    headerTitle = lang.applyRolePermissionHeaderTitle;
                }
                return {
                    title: headerTitle
                };
            },

            constructor: function ApplyRolePermissionHeaderView(options) {
                options || (options = {});
                ApplyPermissionHeaderView.prototype.constructor.apply(this, arguments);
            }
        });

        return ApplyRolePermissionHeaderView;
    });