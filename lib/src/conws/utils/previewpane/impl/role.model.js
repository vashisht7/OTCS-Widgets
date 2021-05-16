/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/base',
  'csui/utils/url',
  'csui/models/mixins/node.connectable/node.connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin'
], function (_, Backbone, base, Url, NodeConnectableMixin, FetchableMixin) {

  var RoleMemberModel = Backbone.Model.extend({

        constructor: function RoleMemberModel(attributes, options) {
            Backbone.Model.prototype.constructor.call(this, attributes.member, options);

            this.memberType = attributes.memberType;
            this.member = attributes.member;
            this.roles = attributes.roles;
            this.connector = options.connector;
        },

        getLeadingRole: function () {
            var first = '';
            var lead = '';
            var roles = this.roles;
            _.each(roles, function (role) {
                first = roles[0].name;
                if (role.leader){
                    lead = role.name;
                }
            });
            return lead || first;
        },

        getRolesIndicator: function () {
            var ret = '';
            if (this.roles.length > 1) {
                ret = '+' + (this.roles.length - 1);
            }
            return ret;
        },

        getMemberType: function(){
          var ret = 'user';
            var member = this.member;
            if (member && member.type !== 0){
                ret = 'group';
            }
            return ret;
        },
        setIconUrl: function(url){
            if (this.iconUrl !== url){
                this.iconUrl = url;
                this.trigger('change', this, this.options);
            }
        },
        getIconUrl: function(){
            return this.iconUrl;
        }
    });

    var RoleMemberCollection = Backbone.Collection.extend({

        model: RoleMemberModel,

        constructor: function RoleMemberCollection(models, options) {
            Backbone.Collection.prototype.constructor.apply(this, arguments);

            this.roleId = options.config.roleId;
            this.context = options && options.context ? options.context : undefined;
            this.makeNodeConnectable(options);
            this.makeFetchable(options);
        },

        url: function () {
            var id = this.node.get('id');
            var url = this.connector.connection.url.replace('/v1', '/v2');
            url = Url.combine(url, 'businessworkspaces', id, 'roles');
            url = url + '?fields=members';
            return url;
        },

        parse: function (response) {

            var team = {};

            var roles = response.results;

            var self = this;
            _.each(roles, function (role, i) {
                if(role && role.data && role.data.properties && self.roleId === role.data.properties.name) {
                  var r = _.clone(role.data.properties);
                  r = _.extend({display_name: r.name}, r);
                  var hasMembers = role.data.members.length;
                  if (hasMembers) {
                    _.each(role.data.members, function (member, j) {

                      var teamMember = team[member.id];
                      if (!teamMember) {
                        teamMember = {
                          data: {
                            properties: _.clone(member)
                          },
                          memberType: 'member',
                          member: _.clone(member),
                          roles: []
                        };
                        team[member.id] = teamMember;
                      }
                      teamMember.roles.push(r);
                    });
                  }
                }
            });
            var ret = _.values(team);
            ret.sort(function (a,b) {
              var ma  = a.member, mb = b.member;
              var ret = base.localeCompareString(ma.display_name  , mb.display_name  , {usage:'sort'}) ;
              return ret;
            });
            return ret;
        }
    });

    NodeConnectableMixin.mixin(RoleMemberCollection.prototype);
    FetchableMixin.mixin(RoleMemberCollection.prototype);

    return RoleMemberCollection;
});
