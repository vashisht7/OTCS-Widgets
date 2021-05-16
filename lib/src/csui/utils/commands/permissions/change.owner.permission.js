/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', "csui/lib/marionette",
  'csui/models/command', 'csui/utils/command.error',
  'i18n!csui/utils/commands/nls/localized.strings'
], function (module, _, $, Marionette, CommandModel, CommandError, lang) {
  'use strict';

  var config = _.extend({}, module.config());

  var ChangeOwnerPermissionCommand = CommandModel.extend({

    defaults: {
      signature: 'ChangeOwnerPermission',
      scope: 'single'
    },

    enabled: function (status) {
      var permissionModel    = status.model,
          type               = permissionModel && permissionModel.get('right_id_expand') &&
                                               permissionModel.get('right_id_expand').type,
          permissionType     = permissionModel && permissionModel.get('type'),
          nodeModel          = status.nodeModel || (status.originatingView &&
                                                 status.originatingView.model),
          enabled            = (permissionType &&
                               (permissionType === "owner" ||
                               permissionType === "group")) &&
                               (nodeModel && nodeModel.actions &&
                               !!nodeModel.actions.get({signature: 'editpermissions'})),
          title              = (enabled && permissionType === "owner") ?
                               lang.ChangeOwnerPermissionCommand :
                               lang.ChangeOwnerGroupPermissionCommand,
          memberTypeSupport  = [0,1],
          isDisable          = (memberTypeSupport.indexOf(type) < 0) && permissionType === "custom";
      if (permissionType === "group" && status.toolItem.attributes &&
          status.toolItem.attributes.icon) {
        status.toolItem.attributes.icon = "icon icon-group-change";
      }
      status.toolItem && status.toolItem.set('name', title);

      return isDisable ? false : enabled;
    },

    execute: function (status, options) {
      var deferred          = $.Deferred(),
          permissionModel   = status.model,
          permissionType    = permissionModel.get("type"),
          collection        = permissionModel.collection,
          userExpandDetails = permissionModel.get("right_id_expand"),
          currentRow        = status.targetView.$el,
          self              = this;
      self.targetView = status.originatingView.permissionsContentView;
      var userHasEditPermissions = collection && collection.options && collection.options.node &&
                                   collection.options.node.actions.get(
                                       {signature: 'editpermissions'});

      if (collection && userHasEditPermissions) {
        permissionModel.nodeId = collection.options && collection.options.node &&
                                 collection.options.node.get('id');
        require(['csui/controls/table/inlineforms/permissions/user.picker/user.picker.view',
              'csui/utils/contexts/factories/member', 'csui/models/permission/nodepermission.model',
              'csui/utils/contexts/factories/user', 'csui/utils/permissions/permissions.precheck'],
            function (UserPickerView, MemberModelFactory, NodePermissionModel, UserModelFactory,
                PermissionPreCheck) {
              var user = status.originatingView.context.getModel(UserModelFactory);
              self.loginUserId = user.get('id');
              var memberFilter = status.context.getModel(MemberModelFactory);
              var userPickerView = new UserPickerView({
                context: status.options ? status.options.context : status.context,
                userPickerModel: memberFilter,
                currentRow: currentRow,
                connector: status.connector,
                memberFilter: {type: (permissionType === 'owner' ? [0] : [1])}
              });
              currentRow.addClass("csui-changeowner-permission");
              currentRow.find(".member-info").addClass("binf-hidden");
              var userpickerRegion = new Marionette.Region({
                el: currentRow.find(".csui-inline-owner-change")
              });
              userpickerRegion.show(userPickerView);
              userPickerView.listenTo(userPickerView,
                  "change:completed", function (permissions) {
                    userpickerRegion.currentView.destroy();
                    deferred.resolve();
                  });
              userPickerView.listenTo(userPickerView, "member:selected:save",
                  function (args) {
                    var permissions = NodePermissionModel.getReadPermissions(),
                        saveAttr    = {
                          "permissions": permissionModel.get("permissions"),
                          "right_id": args.get("id"),
                          "include_sub_types": PermissionPreCheck.includeSubTypes()
                        };
                    permissionModel.set({'right_id_expand': args}, {silent: true});
                    permissionModel.save(saveAttr, {
                      patch: true,  // let form data be 'body:{"name":"Pictures"}' and uploadable
                      wait: true,
                      silent: true
                    }).done(function () {
                      permissionModel.set(saveAttr, {silent: true});
                      userpickerRegion.currentView.destroy();
                      currentRow.removeClass("csui-changeowner-permission");
                      currentRow.find(".member-info").removeClass(
                          "binf-hidden");

                      deferred.resolve();
                    }).fail(function (error) {
                      var commandError = error ? new CommandError(error, permissionModel) :
                                         error;
                      permissionModel.set({'right_id_expand': userExpandDetails}, {silent: true});
                      deferred.reject(permissionModel, commandError);
                    });
                  });
            });
      } else {
        var msg = _.str.sformat(lang.EditPermissionCommandFailMessage, lang.Owner);
        return deferred.reject(
            new CommandError(msg, {errorDetails: lang.undefinedCollection}));
      }
      return deferred.promise();
    }
  });
  return ChangeOwnerPermissionCommand;
});