/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/base',
  'csui/utils/url',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/node.connectable/node.connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/nodechildrencolumn',
  'csui/models/nodechildrencolumns',
  'csui/models/node/node.model',
  'csui/models/nodechildren',
  'csui/models/browsable/client-side.mixin',
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/widgets/team/impl/cells/metadata',
  'conws/widgets/team/impl/participant.model',
  'conws/widgets/team/impl/participants.columns',
  'conws/widgets/team/impl/roles.model',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'csui/utils/deepClone/deepClone'
], function (_, $, Backbone, base, Url, ConnectableMixin, NodeConnectableMixin, FetchableMixin,
    NodeChildrenColumnModel, NodeChildrenColumnCollection, NodeModel, NodeChildrenCollection,
    ClientSideBrowsableMixin, WorkspaceContextFactory, Metadata, ParticipantModel,
    ParticipantsTableColumnCollection, Roles, lang) {

  var ParticipantsColumnModel = NodeChildrenColumnModel.extend({
    constructor: function ParticipantsColumnModel() {
      NodeChildrenColumnModel.prototype.constructor.apply(this, arguments);
    }
  });

  var ParticipantsColumnCollection = NodeChildrenColumnCollection.extend({

    model: ParticipantsColumnModel,
    getColumnModels: function (columnKeys, definitions) {
      var columns = NodeChildrenColumnCollection.prototype.getColumnModels.call(
          this, columnKeys, definitions);
      _.each(columns, function (column) {
        var columnKey = column['column_key'];
        if (columnKey !== ParticipantsTableColumnCollection.columnNames.avatar) {
          column.sort = true;
        }
      });
      return columns;
    }
  });
  var ParticipantCollection = Backbone.Collection.extend({

        model: ParticipantModel,
        availableRoles: new Roles(),

        constructor: function ParticipantCollection(attributes, options) {
          _.defaults(options, {orderBy:  ParticipantsTableColumnCollection.columnNames.name + ' asc'});
          Backbone.Collection.prototype.constructor.apply(this, arguments);
          if (options) {
            this.options = _.pick(options, ['connector', 'context', 'autoreset', 'node',
              'includeResources', 'fields', 'expand', 'commands']);
          }
          this.makeConnectable(options)
              .makeNodeConnectable(options)
              .makeFetchable(options)
              .makeClientSideBrowsable(options);
          if (options !== undefined) {
            if (!options.workspaceContext) {
              options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
            }
            this.workspaceContext = options.workspaceContext;
          }
          this.columns = new ParticipantsColumnCollection();
        },

        url: function () {
          var id = this.node.get('id');
          var url = this.connector.connection.url.replace('/v1', '/v2');
          return Url.combine(url, 'businessworkspaces', id, 'roles?fields=members');
        },

        parse: function (response) {

          var team = {};
          var availableRoles = [];
          var roles = response.results;
          _.each(roles, function (role, i) {

            var r = _.clone(role.data.properties);
            var a = {};
            a.actionDelete = !_.isUndefined(role.actions.data['delete-role']);
            a.actionEdit = !_.isUndefined(role.actions.data['edit-role']);
            r = _.extend({actions: a}, r);
            r = _.extend({display_name: r.name}, r);
            availableRoles.push(r);

            var hasMembers = role.data.members.length;
            if (hasMembers) {
              _.each(role.data.members, function (member, j) {

                var teamMember = team[member.id];
                if (!teamMember) {
                  teamMember = {
                    data: {
                      properties: member
                    },
                    member: member,
                    roles: []
                  };
                  team[member.id] = teamMember;
                }
                teamMember.roles.push(r);
              });
            }
          });
          var metadata = {
            conws_participantavatar: Metadata.integer(
                ParticipantsTableColumnCollection.columnNames.avatar,
                lang.participantAvatarColTitle),
            conws_participantname: Metadata.string(
                ParticipantsTableColumnCollection.columnNames.name,
                lang.participantNameColTitle),
            conws_participantroles: Metadata.string(
                ParticipantsTableColumnCollection.columnNames.roles,
                lang.participantRolesColTitle),
            conws_participantlogin: Metadata.string(
                ParticipantsTableColumnCollection.columnNames.login,
                lang.participantLoginColTitle),
            conws_participantemail: Metadata.string(
                ParticipantsTableColumnCollection.columnNames.email,
                lang.participantEmailColTitle),
            conws_participantdepartment: Metadata.string(
                ParticipantsTableColumnCollection.columnNames.department,
                lang.participantDepartmentColTitle)
          };
          this.columns && this.columns.resetCollection(
              this.columns.getColumnModels(_.keys(metadata), metadata), this.options);
          this.availableRoles = new Roles(availableRoles);
          return _.values(team);
        },

        clone: function () {
          var clone = new this.constructor(this.models, this.options);
          if (this.columns) {
            clone.columns.reset(this.columns.toJSON());
          }
          clone.actualSkipCount = this.actualSkipCount;
          clone.totalCount = this.totalCount;
          clone.filteredCount = this.filteredCount;
          return clone;
        },

        addNewParticipant: function (model) {
          var clone = model.clone();

          var exist = false;
          if (!_.isUndefined(this.newParticipants) && this.newParticipants.length > 0) {
            for (var participant in this.newParticipants) {
              if (this.newParticipants[participant].get('id') === clone.get('id')) {
                exist = true;
                break;
              }
            }
          }
          if (!exist) {
            clone.set({isNew: true});
            this.newParticipants.push(clone);
          }
        },

        setNewParticipant: function () {
          if (!_.isUndefined(this.newParticipants) && this.newParticipants.length > 0) {
            for (var participant in this.newParticipants) {
              for (var item in this.models) {
                if (this.models[item].get('id') ===
                    this.newParticipants[participant].get('id')) {
                  this.models[item].set({isNew: true});
                }
              }
            }
          }
        }
      }
  );
  ClientSideBrowsableMixin.mixin(ParticipantCollection.prototype);
  ConnectableMixin.mixin(ParticipantCollection.prototype);
  NodeConnectableMixin.mixin(ParticipantCollection.prototype);
  FetchableMixin.mixin(ParticipantCollection.prototype);
  return ParticipantCollection;

});
