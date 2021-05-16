/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/models/nodeconnectable',
  'csui/models/nodechildrencolumn',
  'csui/models/nodechildrencolumns',
  'csui/models/node/node.model',
  'csui/models/nodechildren',
  'conws/widgets/team/impl/cells/metadata',
  'conws/widgets/team/impl/participants.columns',
  'conws/widgets/team/impl/roles.model',
  'i18n!conws/widgets/team/impl/nls/team.lang'
], function (_, $, Backbone, Url, NodeConnectableModel, NodeChildrenColumnModel,
    NodeChildrenColumnCollection, NodeModel, NodeChildrenCollection, Metadata,
    ParticipantsTableColumnCollection, Roles, lang) {
  var ParticipantModel = NodeModel.extend({

    constructor: function ParticipantModel(attributes, options) {
      NodeModel.prototype.constructor.apply(this, arguments);
      this.set({
        'conws_participantname': this.displayName(),
        'conws_participantroles': this.displayRoles(),
        'conws_participantlogin': this.displayLogin(),
        'conws_participantemail': this.displayEmail(),
        'conws_participantdepartment': this.displayDepartment()
      });
    },

    parse: function (response, options) {
      if (!_.isUndefined(options.parse) && options.parse === false) {
        return this;
      }
      this.roles = new Roles(response.roles);

      return NodeModel.prototype.parse.call(this, response, options);
    },

    save: function (data, options) {

      if (!this.collection || !this.collection.node) {
        return;
      }

      var id = this.collection.node.get('id');
      var url = this.connector.connection.url.replace('/v1', '/v2');
      var memberId = this.get('id');

      var successRemove = [];
      var errorRemove = [];
      var successAdd = [];
      var errorAdd = [];
      _.each(data.add, function (role) {
        var roleId = role.get('id');
        var postUrl = Url.combine(url, 'businessworkspaces', id, 'roles', roleId, 'members');
        var formData = new FormData();
        formData.append('body', '{"id":' + memberId + '}');

        var options = {
          type: 'POST',
          url: postUrl,
          async: false, // set the call as synchronous, so that one call after the other is done and the results are collected
          data: formData,
          contentType: false,
          processData: false
        };
        this.connector && this.connector.extendAjaxOptions(options);
        this.connector.makeAjaxCall(options).done(_.bind(function (response) {
              successAdd.push({
                status: response.status,
                error: undefined,
                role: role
              });
            }, this))
            .fail(_.bind(function (response) {
              errorAdd.push({
                status: response.status,
                error: undefined,
                role: role
              });
            }, this));
      }, this);
      _.each(data.remove, function (role) {
        var roleId = role.get('id');
        var delUrl = Url.combine(url, 'businessworkspaces', id, 'roles', roleId, 'members',
            memberId);

        var options = {
          type: 'DELETE',
          url: delUrl,
          async: false // set the call as synchronous, so that one call after the other is done and the results are collected
        };
        this.connector && this.connector.extendAjaxOptions(options);
        this.connector.makeAjaxCall(options).done(_.bind(function (response) {
              successRemove.push({
                status: response.status,
                error: undefined,
                role: role
              });
            }, this))
            .fail(_.bind(function (response) {
              errorRemove.push({
                status: response.status,
                error: undefined,
                role: role
              });
            }, this));
      }, this);
      if (errorAdd.length <= 0 && errorRemove.length <= 0) {
        if (!_.isUndefined(options.success)) {
          options.success({successAdd: successAdd, successRemove: successRemove});
        }
      } else {
        if (!_.isUndefined(options.error)) {
          options.error({
            successAdd: successAdd,
            errorAdd: errorAdd,
            successRemove: successRemove,
            errorRemove: errorRemove
          });
        }
      }
    },

    displayName: function () {
      return this.get('display_name');
    },

    displayRoles: function () {
      var ret = this.getLeadingRole();
      if (ret) {
        var indicator = this.getRolesIndicator();
        if (indicator) {
          ret = ret + ' ' + indicator;
        }
      }
      return ret;
    },

    displayLogin: function () {
      var ret = '';
      if (this.getMemberType() === 'user') {
        ret = this.get('name');
      }
      return ret;
    },

    displayEmail: function () {
      var ret = this.get('business_email');
      if (_.isUndefined(ret) || _.isNull(ret)) {
        ret = '';
      }
      return ret;
    },

    displayTitle: function () {
      var ret = this.get('title');
      return ret;
    },

    displayOffice: function () {
      var ret = this.get('office_location');
      return ret;
    },

    displayDepartment: function () {
      var ret = this.get('group_name');
      if (_.isUndefined(ret)) {
        var group = this.get('group_id');
        if (_.isObject(group)) {
          ret = group.name;
        }
      }
      return ret;
    },

    getLeadingRole: function () {
      var first = '';
      var lead = '';
      var roles = this.roles;

      if (roles && (roles.length > 0)) {
        first = roles.at(0).get('name');
        roles.each(function (role) {
          if (role.get('leader')) {
            lead = role.get('name');
          }
        });
      }
      return lead || first;
    },

    canEdit: function () {
      var roles = this.collection.availableRoles;
      var edit = roles.find(function (role) {
        return (role.get('actions').actionEdit && _.isNull(role.get('inherited_from_id')));
      });
      return !_.isUndefined(edit);
    },

    canRemove: function () {
      var roles = this.roles;
      var editable = roles.filter(function (role) {
        return (role.get('actions').actionEdit && _.isNull(role.get('inherited_from_id')));
      });
      return (roles.length === editable.length);
    },

    getRolesIndicator: function () {
      var ret = '';
      if (this.roles.length > 1) {
        ret = '+' + (this.roles.length - 1);
      }
      return ret;
    },

    getMemberType: function () {
      var ret = 'user';
      if (this.get('type') !== 0) {
        ret = 'group';
      }
      return ret;
    },
    setIconUrl: function (url) {
      if (this.iconUrl !== url) {
        this.iconUrl = url;
        this.trigger('change', this, this.options);
      }
    },
    getIconUrl: function () {
      return this.iconUrl;
    }

  });

  return ParticipantModel;

});
