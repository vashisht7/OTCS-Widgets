/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore',
    'csui/lib/marionette',
    'csui/models/form',
    'conws/dialogs/addoreditrole/impl/tabbable.form.view',
    'i18n!conws/dialogs/applyrolepermissions/impl/nls/lang',
    'hbs!conws/dialogs/applyrolepermissions/impl/apply.role.permissions',
    'css!conws/dialogs/applyrolepermissions/impl/apply.role.permissions'
], function (_, Marionette, FormModel, TabbableFormView, lang, template) {

    ApplyRolePermissionsView = Marionette.LayoutView.extend({

        template: template,

        ui: {
            applyRolePermissionMsg: '.conws-apply-role-permission-message'
        },

        regions: {
            ContentRegion: '.conws-apply-role-permission-switch'
        },

        templateHelpers: function () {
            return {
                title: this.model.get('title')
            }
        },

        constructor: function ApplyRolePermissionsView(options) {
            Marionette.LayoutView.prototype.constructor.apply(this, arguments);
            this.listenTo(this.model, 'change', this.render);
        },

        onRender: function () {

            var message = "";
            if (this.options.removePermission) {
                if (!!this.options.permissionModel && this.options.permissionModel.isRoleDelete !== undefined && !this.options.permissionModel.isRoleDelete) {
                    message = _.str.sformat(lang.removeToItem, this.options.model.get("name"));
                } else {
                    var roleName = this.options.permissionModel.get("right_id_expand") &&
                        this.options.permissionModel.get("right_id_expand").name_formatted;
                    message = _.str.sformat(lang.deleteToItem, roleName, this.options.model.get("name"));
                }
            }
            else {
                message = _.str.sformat(lang.applyToItem, this.options.model.get("name"));
            }
            this.ui.applyRolePermissionMsg.html(message);

            var SubItemsInheritForm = {
                "data": {
                    "subitems_inherit": true
                },
                "options": {
                    "fields": {
                        "subitems_inherit": {
                            "hidden": false,
                            "hideInitValidationError": true,
                            "label": lang.SubItemsInherit,
                            "readonly": false,
                            "type": "checkbox"
                        }
                    },
                    "label": ""
                },
                "schema": {
                    "properties": {
                        "subitems_inherit": {
                            "readonly": false,
                            "required": false,
                            "title": lang.SubItemsInherit,
                            "type": "boolean"
                        }
                    },
                    "type": "object"
                }
            },

                SubItemsInheritFormView = new TabbableFormView({
                    model: new FormModel(SubItemsInheritForm),
                    mode: "create"
                });

            if (this.options.removePermission) {
                if (!!this.options.permissionModel && this.options.permissionModel.isRoleDelete !== undefined && !this.options.permissionModel.isRoleDelete) {
                    this.ContentRegion.show(SubItemsInheritFormView);
                }
            } else {
                this.ContentRegion.show(SubItemsInheritFormView);
            }
        }
    });

    return ApplyRolePermissionsView;
});