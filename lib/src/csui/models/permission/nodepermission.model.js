/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/uploadable/uploadable.mixin'
], function (module, _, $, Backbone, Url, ConnectableMixin, UploadableMixin) {
  'use strict';

  var config = _.extend({
    idAttribute: null
  }, module.config());

  var NodePermissionModel = Backbone.Model.extend({
    idAttribute: config.idAttribute,

    defaults: {
      "addEmptyAttribute": true
    },

    constructor: function NodePermissionModel(attributes, options) {
      attributes || (attributes = {});
      options || (options = {});

      Backbone.Model.prototype.constructor.call(this, attributes, options);

      this.options = _.pick(options, ['connector']);
      this.makeConnectable(options)
          .makeUploadable(options);
    },

    isNew: function () {
      return !this.get('type') || !(this.has('right_id') || this.get('type') === 'public');
    },

    urlBase: function () {
      var type              = this.get('type'),
          right_id          = this.get('right_id'),
          nodeId            = this.nodeId,
          apply_to          = this.apply_to,
          include_sub_types = this.include_sub_types,
          queryString       = "",
          url               = this.options.connector.getConnectionUrl().getApiBase('v2');
      if (!_.isNumber(nodeId) || nodeId > 0) {
        url = Url.combine(url, 'nodes', nodeId, 'permissions');
        if (apply_to) {
          queryString = Url.combineQueryString(queryString, {apply_to: apply_to});
        }
        if (include_sub_types) {
          _.each(include_sub_types, function (subtype) {
            queryString = Url.combineQueryString(queryString, {include_sub_types: subtype});
          });
        }

        queryString = queryString.length > 0 ? "?" + queryString : queryString;
        if (!type) {
          url = Url.combine(url, 'custom' + queryString);
        } else if (type !== 'custom') {
          url = Url.combine(url, type + queryString);
        } else if (!_.isNumber(right_id) || right_id > 0) {
          url = Url.combine(url, type, right_id + queryString);
        } else {
          throw new Error('Unsupported permission type or user id');
        }
      } else {
        throw new Error('Unsupported id value');
      }
      return url;
    },

    url: function () {
      var url   = this.urlBase(),
          query = null;
      return query ? url + '?' + query : url;
    },

    parse: function (response, options) {
      if (this.collection) {
        var addItemsOptionIndex        = response.permissions ?
                                         response.permissions.indexOf('add_items') : -1,
            addMajorVersionOptionIndex;
        if (!this.collection.isContainer) {
          if (addItemsOptionIndex !== -1) {
            response.permissions.splice(addItemsOptionIndex, 1);
          }
          addMajorVersionOptionIndex = response.permissions ?
                                         response.permissions.indexOf("add_major_version") : -1;
          if (!(this.collection.options.node &&
              this.collection.options.node.get('advanced_versioning')) &&
              addMajorVersionOptionIndex !== -1) {
            response.permissions.splice(addMajorVersionOptionIndex, 1);
          }
        } else {
          addMajorVersionOptionIndex = response.permissions ?
                                         response.permissions.indexOf("add_major_version") : -1;
          if (!(this.collection.options.node &&
              this.collection.options.node.get('advancedVersioningEnabled')) &&
              addMajorVersionOptionIndex !== -1) {
            response.permissions.splice(addMajorVersionOptionIndex, 1);
          }
        }
      }
      return response;
    },

    getPermissionLevel: function () {
      return NodePermissionModel.getPermissionLevel(this.get("permissions"), this.collection.isContainer, this.collection.options.node &&
           this.collection.options.node.get('advanced_versioning'), this.collection.options.node);
    }
  }, {
    getPermissionLevel: getPermissionLevel,
    getReadPermissions: getReadPermissions,
    getWritePermissions: getWritePermissions,
    getFullControlPermissions: getFullControlPermissions,
    getPermissionsByLevelExceptCustom: getPermissionsByLevelExceptCustom
  });

  function getPermissionLevel(permissions, isContainer, versionControlAdvanced, node) {
    var value            = NodePermissionModel.PERMISSION_LEVEL_NONE,
        permissionsCount = 9;
    if (isContainer) {
      permissionsCount++;
      if (!node.get('advancedVersioningEnabled')) {
        permissionsCount--;
      }
    } else if (!versionControlAdvanced) {
      permissionsCount--;
    }
    if (permissions && permissions.length > 0 && (node.get('permissions_model') !== 'simple')) {
      if (permissions.indexOf("edit_permissions") >= 0 &&
          permissions.length === permissionsCount) {
        value = NodePermissionModel.PERMISSION_LEVEL_FULL_CONTROL;
      } else if (permissions.indexOf("edit_permissions") < 0 &&
                 permissions.indexOf("delete") >= 0 &&
                 permissions.length === (permissionsCount - 1)) {
        value = NodePermissionModel.PERMISSION_LEVEL_WRITE;
      } else if (permissions.indexOf("see_contents") >= 0 &&
                 permissions.length === 2) {
        value = NodePermissionModel.PERMISSION_LEVEL_READ;
      } else {
        value = NodePermissionModel.PERMISSION_LEVEL_CUSTOM;
      }
    } else if (permissions && permissions.length > 0 &&
               (node.get('permissions_model') === 'simple')) {
      if (permissions.indexOf("edit_permissions") >= 0) {
        value = NodePermissionModel.PERMISSION_LEVEL_FULL_CONTROL;
      } else if (permissions.indexOf("edit_permissions") < 0 &&
                 permissions.indexOf("delete") >= 0) {
        value = NodePermissionModel.PERMISSION_LEVEL_WRITE;
      } else if (permissions.indexOf("see_contents") >= 0 &&
                 permissions.length === 2) {
        value = NodePermissionModel.PERMISSION_LEVEL_READ;
      }
    }
    return value;
  }

  function getReadPermissions() {
    return ["see", "see_contents"];
  }

  function getWritePermissions(isContainer, versionControlAdvanced, advancedVersioningEnabled) {
    var permissions = ["see", "see_contents", "modify", "edit_attributes", "add_items", "reserve",
      "add_major_version", "delete_versions", "delete"];
    if (!isContainer) {
      permissions.splice(permissions.indexOf('add_items'), 1);
      if (!versionControlAdvanced) {
        permissions.splice(permissions.indexOf('add_major_version'), 1);
      }
    } else {
      if (!advancedVersioningEnabled) {
        permissions.splice(permissions.indexOf('add_major_version'), 1);
      }
    }
    return permissions;
  }

  function getFullControlPermissions(isContainer, versionControlAdvanced,
      advancedVersioningEnabled) {
    var permissions = ["see", "see_contents", "modify", "edit_attributes", "add_items", "reserve",
      "add_major_version", "delete_versions", "delete", "edit_permissions"];
    if (!isContainer) {
      permissions.splice(permissions.indexOf('add_items'), 1);
      if (!versionControlAdvanced) {
        permissions.splice(permissions.indexOf('add_major_version'), 1);
      }
    } else {
      if (!advancedVersioningEnabled) {
        permissions.splice(permissions.indexOf('add_major_version'), 1);
      }
    }
    return permissions;
  }

  function getPermissionsByLevelExceptCustom(level, isContainer, versionControlAdvanced,
      advancedVersioningEnabled) {
    var permissions = null;
    switch (level) {
    case NodePermissionModel.PERMISSION_LEVEL_NONE:
      permissions = [];
      break;
    case NodePermissionModel.PERMISSION_LEVEL_READ:
      permissions = getReadPermissions();
      break;
    case NodePermissionModel.PERMISSION_LEVEL_WRITE:
      permissions = getWritePermissions(isContainer, versionControlAdvanced,
          advancedVersioningEnabled);
      break;
    case NodePermissionModel.PERMISSION_LEVEL_FULL_CONTROL:
      permissions = getFullControlPermissions(isContainer, versionControlAdvanced,
          advancedVersioningEnabled);
      break;
    }
    return permissions;
  }

  NodePermissionModel.prototype.PERMISSION_LEVEL_NONE = NodePermissionModel.PERMISSION_LEVEL_NONE = 0;
  NodePermissionModel.prototype.PERMISSION_LEVEL_READ = NodePermissionModel.PERMISSION_LEVEL_READ = 1;
  NodePermissionModel.prototype.PERMISSION_LEVEL_WRITE = NodePermissionModel.PERMISSION_LEVEL_WRITE = 2;
  NodePermissionModel.prototype.PERMISSION_LEVEL_FULL_CONTROL = NodePermissionModel.PERMISSION_LEVEL_FULL_CONTROL = 3;
  NodePermissionModel.prototype.PERMISSION_LEVEL_CUSTOM = NodePermissionModel.PERMISSION_LEVEL_CUSTOM = 4;

  NodePermissionModel.prototype.getReadPermissions = NodePermissionModel.getReadPermissions;
  NodePermissionModel.prototype.getWritePermissions = NodePermissionModel.getWritePermissions;
  NodePermissionModel.prototype.getFullControlPermissions = NodePermissionModel.getFullControlPermissions;
  NodePermissionModel.prototype.getPermissionsByLevelExceptCustom = NodePermissionModel.getPermissionsByLevelExceptCustom;

  ConnectableMixin.mixin(NodePermissionModel.prototype);
  UploadableMixin.mixin(NodePermissionModel.prototype);

  return NodePermissionModel;
});
