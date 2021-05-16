/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/base', 'csui/models/command', 'csui/utils/commandhelper',
  'csui/utils/command.error', 'csui/utils/commands/confirmable',
  'i18n!csui/utils/commands/nls/localized.strings'
], function (module, require, $, _, Backbone, base, CommandModel, CommandHelper,
    CommandError, ConfirmableCommand, lang) {
  'use strict';

  var config = _.extend({}, module.config());

  var GlobalMessage;

  var DeletePermissionCommand = CommandModel.extend({
    defaults: {
      signature: 'DeletePermission',
      scope: 'single'
    },

    allowCollectionRefetch: false,

    _getConfirmTemplate: function (status, options) {
      return _.template(lang.DeleteCommandConfirmDialogHtml);
    },

    _getConfirmData: function (status, options) {
      var permissionModel      = status.model,
          confirmDialogMessage = lang.DeletePermissionCommandConfirmDialogSingleMessage;
      if (permissionModel.get("type") === "public") {
        confirmDialogMessage = lang.DeletePermissionCommandConfirmDialogPublicAccessMessage;
      }
      var msg = this._getMessageWithUserDisplayName(
          confirmDialogMessage, permissionModel);

      var title = this._getMessageWithUserDisplayName(
          lang.DeletePermissionCommandConfirmDialogTitle, permissionModel);

      return {
        title: title,
        message: msg
      };
    },

    _getMessageWithUserDisplayName: function (unformattedMsg, permissionModel) {
      var displayName;
      if (permissionModel.get("right_id_expand")) {
        displayName = base.formatMemberName(permissionModel.get("right_id_expand"));
      } else if (permissionModel.get("type") === "public") {
        displayName = lang.publicAccess;
      }
      var msg;
      if (permissionModel.get('results') && permissionModel.get('results').success > 0) {
        msg = _.str.sformat(unformattedMsg, displayName,
            base.formatMessage(permissionModel.get('results').success, lang));
      } else {
        msg = _.str.sformat(unformattedMsg, displayName);
      }
      return msg;
    },

    enabled: function (status) {
      var permissionModel   = status.model,
          type              = permissionModel && permissionModel.get('right_id_expand') &&
                                               permissionModel.get('right_id_expand').type,
          collection        = permissionModel && permissionModel.collection,
          right_id          = permissionModel && permissionModel.get('right_id'),
          permissionType    = permissionModel && permissionModel.get('type'),
          filterId          = status.filterId,
          nodeModel         = status.nodeModel || (collection && collection.options &&
                                                  collection.options.node)
                                               || (status.originatingView && 
                                                  status.originatingView.model),
          enabled           = !filterId && permissionType &&
                              (right_id || permissionType === "public") &&
                              nodeModel.get('id') &&
                              nodeModel.actions &&
                              !!nodeModel.actions.get(
                                  {signature: 'editpermissions'}),
          memberTypeSupport = [0,1],
          isDisable         = (memberTypeSupport.indexOf(type) < 0) && permissionType === "custom";
      if (enabled) {
        this.setCommandTitle(status.toolItem, permissionModel);
      }

      return isDisable ? false : enabled;
    },

    setCommandTitle: function (toolItem, permissionModel) {
      var type = permissionModel.get("type"),
          title;
      if (type === "owner") {
        title = lang.DeletePermissionCommandRemoveOwner;
      } else if (type === "group") {
        title = lang.DeletePermissionCommandRemoveGroup;
      } else if (type === "public") {
        title = lang.DeletePermissionCommandRemovePublicAccess;
      } else {
        title = lang.DeletePermissionCommandRemoveOther;
      }
      toolItem.set("name", title);
    }
  });

  _.extend(DeletePermissionCommand.prototype, ConfirmableCommand, {
    execute: function (status, options) {
      var deferred = $.Deferred(),
          self     = this;
      options || (options = {});
      status.suppressFailMessage = true;
      status.suppressSuccessMessage = true;

      require([
        'csui/controls/globalmessage/globalmessage',
        'csui/widgets/permissions/impl/edit/apply.permission/apply.permission.view',
        'csui/widgets/permissions/impl/edit/apply.permission/impl/header/apply.permission.header.view',
        'csui/controls/progressblocker/blocker',
        'csui/controls/dialog/dialog.view',
        'csui/utils/permissions/permissions.precheck'
      ], function (localGlobalMessage, ApplyPermissionView, ApplyPermissionHeaderView,
          BlockingView, DialogView, PermissionPreCheck) {
        GlobalMessage = localGlobalMessage;
        if (status.originatingView && status.originatingView.model &&
            status.originatingView.model.get("container")) {
          options.removePermission = true;
          self._executeDeletePermission(status, options, ApplyPermissionHeaderView,
              ApplyPermissionView, BlockingView, DialogView, PermissionPreCheck)
              .then(deferred.resolve, deferred.reject);
        } else {
          self._deletePermission(status, options).then(deferred.resolve, deferred.reject);
        }
      }, deferred.reject);
      return deferred.promise();
    },

    _deletePermission: function (status, options) {
      options || (options = {});
      return this._performActions(status, options);
    },

    _executeDeletePermission: function (status, options, ApplyPermissionHeaderView,
        ApplyPermissionView, BlockingView, DialogView, PermissionPreCheck) {
      options || (options = {});
      var deferred = $.Deferred();
      this.originatingView = status.originatingView;
      var headerView = new ApplyPermissionHeaderView({
        'removePermission': true,
        'permissionModel': status.model
      });
      this._view = new ApplyPermissionView({
        context: status.context,
        model: status.originatingView.model,
        permissionModel: status.model,
        removePermission: true,
        applyTo: status.applyTo,
        includeSubTypes: PermissionPreCheck.includeSubTypes(),
        originatingView: status.originatingView
      });
      var dialog = new DialogView({
        headerView: headerView,
        view: this._view,
        className: "csui-permissions-apply-dialog",
        midSize: true,
        buttons: [
          {
            id: 'apply',
            label: lang.applyButtonLabel,
            'default': true,
            click: function (args) {
              this._performActions(args).then(deferred.resolve, deferred.reject);
            }.bind(this)
          },
          {
            label: lang.cancelButtonLabel,
            close: true
          }
        ]
      });
      dialog.listenTo(dialog, 'hide', _.bind(this.onHideDialog, this));
      BlockingView.imbue(dialog);
      dialog.show();
      return deferred.promise();
    },

    onHideDialog: function () {
      var origView = this.originatingView;
      origView && origView.trigger("unblock:view:actions");
    },

    _performActions: function (status, options) {
      var self            = this,
          deferred        = $.Deferred(),
          permissionModel = status.dialog ? status.dialog.options.view.options.permissionModel :
                            status.model,
          permissionType  = permissionModel.get('type'),
          collection      = permissionModel.collection,
          failureMsg      = this._getMessageWithUserDisplayName(
              lang.DeletePermissionCommandFailMessage, permissionModel),
          deleteAttr;

      if (collection && collection.options && collection.options.node &&
          collection.options.node.actions.get({signature: 'editpermissions'})) {
        permissionModel.nodeId = collection.options && collection.options.node &&
                                 collection.options.node.get('id');
        var container           = collection.options && collection.options.node &&
                                  collection.options.node.get("container"),
            permissionModelType = collection.options && collection.options.node &&
                                  collection.options.node.get("permissions_model");
        if (status.dialog) {
          permissionModel.apply_to = (container && permissionModelType === "advanced") &&
                                     status.dialog.options.view.subFolderSelected ? 2 :
                                     (container && permissionModelType === "advanced") ? 3 : 0;
          permissionModel.include_sub_types = permissionModel.apply_to > 0 ?
                                              status.dialog &&
                                              status.dialog.options.view.options.includeSubTypes :
              [];
        }
        if (self.originatingView && self.originatingView.blockActions) {
          self.destroyDialog(status);
          self.originatingView.blockActions();
        }
        var jqxhr = permissionModel.destroy({
          wait: true
        }).done(function (response) {
          permissionModel.set('results', response.results);
          self.originatingView && self.originatingView.trigger('permission:changed', self);
          if (self.originatingView && self.originatingView.unblockActions) {
            self.originatingView.unblockActions();
          }
          var successMsg = self._getMessageWithUserDisplayName(
              permissionModel.get('results') && permissionModel.get('results').success > 0 ?
              lang.DeletePermissionCommandSuccessMessageWithCount :
              lang.DeletePermissionCommandSuccessMessage, permissionModel);
          GlobalMessage.showMessage('success', successMsg);
          if (permissionType === "owner" || permissionType === "group") {
            collection.processForEmptyOwner && collection.processForEmptyOwner();
          }
          deferred.resolve(permissionModel);

        }).fail(function (error) {
          var commandError = error ? new CommandError(error, permissionModel) :
                             error;
          self.handleFailure(commandError, failureMsg);
          deferred.reject(permissionModel, commandError);
          if (!error) {
            jqxhr.abort();
          }
        }).always(function () {
          if (self.originatingView && self.originatingView.unblockActions) {
            self.originatingView.unblockActions();
          }
        });
        return deferred.promise();
      }
      else {
        self.destroyDialog(status);
        return deferred.reject(
            new CommandError(failureMsg, {errorDetails: lang.undefinedCollection}));
      }
    },

    handleFailure: function (commandError, oneFileFailure) {
      var errObject = Backbone.Model.extend({
            defaults: {
              name: "",
              state: 'pending',
              commandName: 'ViewPermission'
            }
          }),
          errObjects;

      var failedPermissionsCollection = Backbone.Collection.extend({
        model: errObject
      });
      var errCollection = new failedPermissionsCollection();
      errObjects = new errObject({
        name: commandError,
        mime_type: '',
        state: 'rejected'
      });
      errCollection.add(errObjects);
      GlobalMessage.showPermissionApplyingProgress(errCollection, {oneFileFailure: oneFileFailure});
    },

    destroyDialog: function (status) {
      status.dialog && status.dialog.destroy();
    }

  });

  return DeletePermissionCommand;
});
