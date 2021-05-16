/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/controls/table/cells/user/user.view',
  'csui/controls/table/cells/cell.registry',
  'csui/models/member',
  'conws/utils/commands/permissions/permissions.util',
  'hbs!conws/controls/table/cells/role/impl/role',
  'css!conws/controls/table/cells/role/impl/role'
], function (_, UserCellView, cellViewRegistry, MemberModel, PermissionsUtil, roleTemplate) {

  var RoleCellView = UserCellView.extend({

    renderValue: function () {
      var data = this.getValueData(),
        template = this.getTemplate(),
        html = data ? template(data) : '';
      this.$el.html(html);
    },

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

    getValueData: function () {
      return _.extend(RoleCellView.__super__.getValueData.apply(this, arguments), {
        isWorkspaceRole: this.isWorkspaceRole
      })
    },

    constructor: function RoleCellView(options) {
      RoleCellView.__super__.constructor.apply(this, arguments);

      if (!!this.model && !!this.model.collection) {

        this.isWorkspaceRole = PermissionsUtil.isWorkspaceRole(this.model);

        if (!this.model.collection.extraMemberModels) {
          this.model.collection.extraMemberModels = [];
        }
        if (this.isWorkspaceRole) {
          var isModelExist = this.model.collection.extraMemberModels.some(function (memberModel) {
            return memberModel.get("id") === this.model.get("right_id_expand").id
          }, this);
          if (!isModelExist) {
            var memberModel = new MemberModel(this.model.get("right_id_expand"))
            memberModel.nodeModel = this.options.nodeModel;
            this.model.collection.extraMemberModels.push(memberModel);
          }
        }
      }
    }
  });
  cellViewRegistry.registerByColumnKey('right_id', RoleCellView);
  return RoleCellView;
});
