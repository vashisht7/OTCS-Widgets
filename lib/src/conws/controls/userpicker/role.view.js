/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/utils/base',
  'csui/controls/userpicker/impl/group.view',
  'conws/utils/commands/permissions/permissions.util',
  'i18n!conws/controls/userpicker/nls/role.lang',
  'hbs!conws/controls/userpicker/role'
], function (Base, GroupView, PermissionsUtil, lang, roleTemplate) {

  var RoleView = GroupView.extend({

    getTemplate: function () {
      var template;
      if (!!this.isWorkspaceRole && this.isWorkspaceRole) {
        template = roleTemplate;
      }
      else {
        template = this.template;
      }
      return template;
    },

    templateHelpers: function () {
      return {
        'name': Base.formatMemberName(this.model),
        'role-title': lang.roleViewGroupTitle,
        'isWorkspace': this.isWorkspace,
        'leader': this.isLeaderRole,
        'leader-title': lang.roleViewLeaderTitle,
        'isInheritedRole': this.isInheritedRole,
        'isInheritedRole-title': lang.inheritedrole,
        'disabled': this.model.get('disabled'),
        'disabled-message': this.options.disabledMessage,
        'lightWeight': !!this.options.lightWeight
      };
    },

    constructor: function RoleView(options) {
      GroupView.prototype.constructor.call(this, options);
      if (!!this.model && !!this.model.nodeModel) {
        this.isWorkspace = PermissionsUtil.isWorkspace(this.model.nodeModel);
        this.isWorkspaceRole = PermissionsUtil.isWorkspaceRole(this.model);
        this.isLeaderRole = PermissionsUtil.isLeaderRole(this.model.nodeModel, this.model);
        this.isInheritedRole = PermissionsUtil.isInheritedRole(this.model.nodeModel, this.model)
      }

    }

  });

  return RoleView;
});
