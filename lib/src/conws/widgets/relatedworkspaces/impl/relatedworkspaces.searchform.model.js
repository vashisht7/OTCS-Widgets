/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(["csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  'conws/utils/workspaces/impl/workspaceutil'
], function ($, _, Backbone, WorkspaceUtil) {
  "use strict";

  var RelatedWorkspacesSearchFormModel = Backbone.Model.extend({

        constructor: function RelatedWorkspacesSearchFormModel(attributes, options) {
          options || (options = {});

          attributes = _.extend({data:{},options:{},schema:{}},attributes);
          Backbone.Model.prototype.constructor.call(this, attributes, options);
          this.setFromColumns(options.columns,options.tableColumns);
          this.listenTo(options.columns,"reset update",function() {
              this.setFromColumns(options.columns,options.tableColumns);
          });

        },

        setFromColumns: function(columns,tableColumns) {
            var models = tableColumns && tableColumns.sortBy('sequence').reduce(function(models,column){
                return models.concat([columns.get(column.get("key"))]);
              },[]);
            models = models ? _.compact(models) : columns.models;
            var searchform = FormObject();
            SetField(searchform,"dummy","dummy",{type:"hidden"},{type:"string"});
            var data = this.get("data");
            models.forEach(function(col) {
              var col_key = col.get("column_key");
              if (!blacklist[col_key]) {
                var col_data = (data && data.search) ? data.search[col_key] : undefined /*any default value anywhere?*/;
                var fieldform = FormField(col,col_data);
                if (fieldform) {
                  SetField(searchform,col_key,fieldform.data,fieldform.options,fieldform.schema);
                }
              }
            });
            var form = FormObject();
            SetField(form,"search",searchform.data,searchform.options,searchform.schema);
            this.set(form);
        }

      });

      function SetField(form, key, data, options, schema) {
        form.data[key] = data;
        form.options.fields[key] = options;
        form.schema.properties[key] = schema;
      }

      function FormField(col,data) {
        var form;
        var template = WorkspaceUtil.getFormFieldTemplate(col.attributes);
        if (template) {
          form = _.deepClone(template);
          form.data = data;
          form.options.label = col.get("name");
          form.schema.title = col.get("name");
        }
        return form;
      }

      function FormObject(name) {
        var form = {
          data: { },
          options: { type: "object", fields: { } },
          schema: { type: "object", properties: { } }
        };
        if (name) {
          form.options.label = name;
          form.schema.title = name;
        }
        return form;
      }

      var blacklist = {
        "favorite": "true",
        "id": true,
        "modify_date": true,
        "size": true,
        "type": true
      };



  return RelatedWorkspacesSearchFormModel;

});
