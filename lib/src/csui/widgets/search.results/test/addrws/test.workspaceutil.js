/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/jquery',
  'csui/lib/underscore'
], function ($, _, Backbone, NodeModel) {

  function WorkspaceUtil () {}

  _.extend(WorkspaceUtil.prototype,{

    orderByAsString: function (orderBy,defCol,defOrd) {
      var sc;

      var ret, order = {sc:defCol, so:defOrd};
      if (orderBy) {
        order = _.defaults({sc:orderBy.sortColumn,so:orderBy.sortOrder},order);
      }
      if (order.sc) {
        var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g;
        var match = parameterPlaceholder.exec(order.sc);
        if (match) {
          order.sc = match[1];
        } else {
          order.sc = undefined;
        }
      }
      if (order.sc || order.so) {
        ret = _.str.sformat("{0} {1}", order.sc?order.sc:"name", order.so?order.so:"asc");
      }
      return ret;
    },

    getFilterValueString: function(colattrs,colvalue,allowempty) {
      var format = filter_map[type_key(colattrs.type)];
      if (!format) {
        if (allowempty) {
          return undefined;
        }
        format = "{0}";
      }
      return _.str.sformat(format,colvalue);
    },

    getFormFieldTemplate: function (colattrs) {
      if (colattrs.type!==-1) {
        return undefined;
      }
      return template_map[type_key(colattrs.type,colattrs.persona)] || template_map[type_key(colattrs.type)];
    }

  });

  function type_key(type,persona) {
    return [type,persona].toString();
  }

  var filter_map = {};
  filter_map[type_key(-1,"")] = "contains_{0}";

  var template_map = {};
  template_map[type_key(-1,"")] = {
    options: { type: "text"},
    schema: { type: "string" } };
  template_map[type_key(2,"")] =  {
    options: { type: "integer" },
    schema: { type: "integer" }
  };
    undefined; 
  template_map[type_key(2,"node")] =
    undefined/*= not supported */; 
  template_map[type_key(2,"user")] = {
    options: {
      "type": "otcs_user_picker",
      "type_control": {
        "action": "api/v1/members",
        "method": "GET",
        "name": "user001",
        "parameters": {
          "filter_types": [
            0
          ],
          "select_types": [
            0
          ]
        }
      }
    },
    schema: {
      "type": "otcs_user_picker"
    }
  };
  template_map[type_key(14,"user")] = template_map[type_key(2,"user")];
  template_map[type_key(-7,"")] = {
    options: { type: "date" },
    schema: { type: "string" }
  };
  template_map[type_key(5,"")] = {
    options: { type: "checkbox" },
    schema: { type: "boolean" }
  };

  return new WorkspaceUtil();
});
