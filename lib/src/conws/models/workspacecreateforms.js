/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/utils/log", "csui/utils/base", "csui/models/nodeforms"
], function (module, $, _, Backbone, log, base, NodeFormCollection) {
  "use strict";
  function copyWritables(dst,dst_options,dst_schema,src,src_options, src_schema) {
    var iskey = _.reduce(_.keys(dst),function(iskey,key){iskey[key]=true;return iskey;},{});
    _.each(src,function(src_val,key) {
      if (iskey[key]) {
        var copyValue = true,
            new_options = dst_options && dst_options.fields && (dst_options.fields[key] ? dst_options.fields[key] : dst_options.fields.item ),
            new_schema  = dst_schema && (dst_schema.properties ? dst_schema.properties[key] : dst_schema.items),
            old_options = src_options && src_options.fields && (src_options.fields[key] ? src_options.fields[key] : src_options.fields.item ),
            old_schema = src_schema && (src_schema.properties ? src_schema.properties[key] : src_schema.items);
        if (new_options && new_options.readonly || new_schema && new_schema.readonly ||
            old_options && old_options.readonly || old_schema && old_schema.readonly) {
          copyValue = false;
        }
        if (copyValue) {
          var dst_val = dst[key],
              is_dst_obj = _.isObject(dst_val),
              is_src_obj = _.isObject(src_val);
          if (is_dst_obj && is_src_obj) {
            copyWritables(dst_val,new_options,new_schema,src_val,old_options,old_schema);
          } else if (!is_dst_obj && !is_src_obj) {
            dst[key] = src[key];
          }
        }
      }
    });
  }

  var WorkspaceCreateFormCollection = NodeFormCollection.extend({

        constructor: function WorkspaceCreateFormCollection(models, options) {
          NodeFormCollection.prototype.constructor.apply(this, arguments);
          this.type = options.type;
          this.actionContext = options.actionContext;
          if (this.type === undefined) {
            throw new Error(WorkspaceCreateFormCollection.ERR_CONSTRUCTOR_NO_TYPE_GIVEN);
          }
          if (this.options.wsType === undefined) {
            throw new Error(WorkspaceCreateFormCollection.ERR_CONSTRUCTOR_NO_WSTYPE_GIVEN);
          }
        },

        url: function () {
          var path = 'forms/businessworkspaces/create',
              wsType = this.options.wsType,
              template = this.options.template,
              params = {
                parent_id: this.node.get("id"),
                type: this.type,
                wksp_type_id: wsType.id,
                template_id: template ? template.id : undefined,
                bo_type_id: this.bo_type_id /*can be set by caller before fetch*/,
                bo_id: this.bo_id /*can be set by caller before fetch*/
              },
              resource = path + '?' + $.param(_.omit(params,function (value) {
                    return value === null || value === undefined || value === '';
                  })),
              url = this.node.connector.connection.url;
          return base.Url.combine(url&&url.replace('/v1', '/v2')||url, resource);
        },

        parse: function (response) {
          var forms = response.forms;
          _.each(forms, function (form) {
            form.id = form.schema.title;
          });
          forms.length && (forms[0].id = "general");

          if (forms.length>0) {
            var forms_map = _.reduce(forms, function (map,form) {form.role_name && (map[form.role_name] = form); return map;},{}),
                schema_map = _.reduce(this.formsSchema, function (map,form) {form.role_name && (map[form.role_name] = form); return map;},{}),
                general = forms[0];
            if (general && general.schema && general.schema.properties && general.schema.properties.name) {
              if (general.schema.properties.name.readonly && general.schema.properties.name.required) {
                if (!general.data || !general.data.name) {
                  general.schema.properties.name.required = false;
                }
              }
            }
            if (general && general.data && general.data.bo_type_id) {
              if (!forms_map.categories) {
                forms_map.categories = { role_name: "categories" };
                forms.push(forms_map.categories);
              }
              _.each(forms, function (form) {
                if (form.role_name) {
                  form.schema || (form.schema = {});
                  form.schema.additionalProperties = false;
                }
              });
            }

            if (general && general.data) {
              var old = this.at(0) && this.at(0).get("data") || {};
              _.defaults(general.data,{bo_id:this.bo_id},_.pick(old,"bo_id","bo_type_id","bo_type_name","ext_system_id","ext_system_name"));
            }
            if (this.formsValues) {
              var role_options, role_schema;
              if (general && general.data) {
                role_options = this.formsSchema && this.formsSchema[0] && this.formsSchema[0].options;
                role_schema = this.formsSchema && this.formsSchema[0] && this.formsSchema[0].schema;
                copyWritables(general.data,general.options,general.schema,
                    {
                      name: this.formsValues.name,
                      description: this.formsValues.description
                    },role_options,role_schema);
              }
              if (this.formsValues.roles) {
                _.each(this.formsValues.roles, function(role_data,role_name) {
                  var role_form = forms_map[role_name];
                  if (role_form) {
                    role_options = schema_map[role_name] && schema_map[role_name].options;
                    role_schema = schema_map[role_name] && schema_map[role_name].schema;
                    copyWritables(
                        role_form.data,role_form.options,role_form.schema,
                        role_data, role_options, role_schema
                    );
                  }
                }, this);
              }
            }
          }

          this.serverForms = forms;
          return forms;
        }

      },
      {
        ERR_CONSTRUCTOR_NO_TYPE_GIVEN: "No creation type given in constructor",
        ERR_CONSTRUCTOR_NO_WSTYPE_GIVEN: "No workspace type given in constructor"
      });

  _.extend(WorkspaceCreateFormCollection, {
    version: '1.0'
  });

  return WorkspaceCreateFormCollection;

});


