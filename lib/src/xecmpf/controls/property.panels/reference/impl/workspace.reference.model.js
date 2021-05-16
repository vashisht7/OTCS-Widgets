/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  "csui/utils/url",
  "csui/models/mixins/node.connectable/node.connectable.mixin"
], function (_, $, Backbone, Url,
    NodeConnectableMixin) {
  'use strict';

  var WorkspaceReferenceModel = Backbone.Model.extend({

    constructor: function WorkspaceReferenceModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeNodeConnectable(options);

    },

    sync: function (method, model, options) {
      var node_id, path, baseurl, url, bo_id, params, bo_type_id;
      if (method === "read") {
        node_id = this.get("id");
        path = _.str.sformat('businessworkspaces/{0}', node_id);
        baseurl = this.connector.connection.url;
        url = Url.combine(baseurl && baseurl.replace('/v1', '/v2') || baseurl, path);
        options.url = url;
      } else if (method === "update") {
        node_id = this.get("id");
        path = _.str.sformat('businessworkspaces/{0}/workspacereferences', node_id);
        bo_id = this.get("bo_id");
        bo_type_id = this.get("bo_type_id");
        params = {bo_id: bo_id, bo_type_id: bo_type_id};
        baseurl = this.connector.connection.url;
        url = Url.combine(baseurl && baseurl.replace('/v1', '/v2') || baseurl, path);
        options.url = url;
        options.data = $.param(params);
      } else if (method === "delete") {
        var ext_system_id, queryParams;
        node_id = this.get("id");
        bo_id = this.get("bo_id");
        bo_type_id = this.get("bo_type_id");
        ext_system_id = this.get("ext_system_id");
        params = {bo_id: bo_id, bo_type_id: bo_type_id, ext_system_id: ext_system_id};
        queryParams = $.param(params);
        path = _.str.sformat('businessworkspaces/{0}/workspacereferences?{1}', node_id, queryParams);
        baseurl = this.connector.connection.url;
        url = Url.combine(baseurl && baseurl.replace('/v1', '/v2') || baseurl, path);
        options.url = url;
      }
      return Backbone.sync(method, model, options);
    },

    parse: function (response) {
      var data       = response && response.results && response.results.data || {},
          actions    = response && response.results && response.results.actions &&
                       response.results.actions.data || {},
          properties = data.properties || {},
          business   = data.business_properties || {};
      business.business_object_id && (properties.bo_id = business.business_object_id);
      business.business_object_type_id &&
      (properties.bo_type_id = business.business_object_type_id);
      business.business_object_type_name &&
      (properties.bo_type_name = business.business_object_type_name);
      business.external_system_id && (properties.ext_system_id = business.external_system_id);
      business.external_system_name && (properties.ext_system_name = business.external_system_name);
      business.workspace_type_id && (properties.workspace_type_id = business.workspace_type_id);
      business.workspace_type_name &&
      (properties.workspace_type_name = business.workspace_type_name);
      properties.change_reference = !!actions['change-reference'];
      properties.complete_reference = !!actions['complete-reference'];

      return properties;
    }

  });

  NodeConnectableMixin.mixin(WorkspaceReferenceModel.prototype);

  return WorkspaceReferenceModel;

});
