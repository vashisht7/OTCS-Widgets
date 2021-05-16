/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/models/mixins/node.connectable/node.connectable.mixin',
  'csui/models/member',
  'csui/lib/jquery.when.all'
], function (_, $, Backbone, Url, NodeConnectableMixin, MemberModel) {

  var HeaderModel = Backbone.Model.extend({
    constructor: function HeaderModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      this.makeNodeConnectable(options);
      if (this.node.get("type") === 848) {
        this.set(this.node.attributes);
      }
      this.listenTo(this.node,"change:name",function(){
        if (this.node.get("type") === 848) {
          this.set("name",this.node.get("name"));
        }
      })
    },
    url: function () {
      return Url.combine(new Url(this.connector.connection.url).getApiBase('v2'),
          '/businessworkspaces/' + this.node.get('id') +
          '?metadata&fields=categories&include_icon=true&expand=' +
          encodeURIComponent('properties{create_user_id,modify_user_id,owner_group_id,owner_user_id,reserved_user_id}'));
    },
    parse: function (response) {
      this.actions = response.results.actions && response.results.actions.data;
      var data = response.results.data || {};
      this.display_urls = data.display_urls || {};
      this.business_properties = data.business_properties || {};
      if (this.business_properties.workspace_widget_icon_content) {
        this.icon = {
          content: this.business_properties.workspace_widget_icon_content,
          location: 'node'
        }
      } else if (this.business_properties.workspace_type_widget_icon_content) {
        this.icon = {
          content: this.business_properties.workspace_type_widget_icon_content,
          location: 'type'
        }
      } else {
        this.icon = {
          content: null,
          location: 'none'
        }
      }
      this.categories = data.categories || {};
      this.metadata = response.results.metadata || {};
      data.properties.workspace_type_id = this.business_properties.workspace_type_id;
      data.properties.workspace_type_name = this.business_properties.workspace_type_name;
      data.properties.workspace_widget_icon_content = this.icon.content;
      return data.properties;
    },
    isWorkspaceType: function () {
      return (this.get('workspace_type_id') !== undefined);
    },
    hasAction: function (name) {
      var ret;
      if (this.actions) {
        ret = this.actions[name];
      }
      return ret;
    },

    expandMemberValue: function (value) {
      var self = this;
      var key = value.name + '_expand';
      var category = key.split('_')[0];
      if (_.isUndefined(self.categories[category][key])) {
        var ids = _.isArray(value.value) ? value.value : [value.value];
        var values = ids.slice(0);

        var deferred = [];
        _.each(ids, function (id) {
          var member = new MemberModel({id: id}, {connector: self.connector});
          deferred.push(member.fetch({
            success: function (response) {
              values[_.indexOf(values, id)] = response.attributes;
            },
            error: function (response) {
              values[_.indexOf(values, id)] = id;
            }
          }));
        });
        $.whenAll.apply($, deferred).done(function () {
          self.categories[category][key] = values;
          self.trigger('change');
        });
      }
    }
  });

  NodeConnectableMixin.mixin(HeaderModel.prototype)
  return HeaderModel;

});
