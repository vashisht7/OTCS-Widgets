/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/url', 'csui/models/form',
  'csui/models/mixins/node.connectable/node.connectable.mixin'
], function (_, Url, FormModel, NodeConnectableMixin) {
  'use strict';

  var AppliedCategoryFormModel = FormModel.extend({
    constructor: function AppliedCategoryFormModel(attributes, options) {
      FormModel.prototype.constructor.call(this, attributes, options);
      this.makeNodeConnectable(options);
      if (options) {
        this.action = this.options.action;
        this.categoryId = this.options.categoryId;
      }
    },

    clone: function () {
      return new this.constructor(this.attributes, {
        node: this.node,
        action: this.action,
        categoryId: this.categoryId
      });
    },

    url: function () {
      var url = _.str.sformat('forms/nodes/categories/{0}?id={1}&category_id={2}',
          this.action, this.node.get('id'), this.categoryId);
      return Url.combine(this.connector.connection.url, url);
    },

    parse: function (response, options) {
      var form = _.extend({
            data: {},
            schema: {},
            options: {}
          }, response.form || response.forms && response.forms[0] || response),
          title = form.title || this.get('title');

      form.options = _.omit(form.options, 'form');
      if (form.schema.title === undefined) {
        form.schema.title = title;
      }
      if (!form.title) {
        form.title = title;
      }
      if (form.role_name === undefined) {
        form.role_name = "categories";
      }

      var categoryId = form.categoryId || options && options.categoryId || this.categoryId;
      if (categoryId) {
        AppliedCategoryFormModel.updateInternalProperties(categoryId, form);
      }

      return form;
    }
  }, {
    updateInternalProperties: function (categoryId, form) {
      var categoryData = form.data;
      var categorySchema = form.schema;
      var categoryOptions = form.options;
      var stateId = categoryId + '_1';
      var stateData = categoryData[stateId] || {};
      var internalIds = Object.keys(stateData);
      var stateSchema = categorySchema.properties && categorySchema.properties[stateId];
      if (stateSchema) {
        stateSchema.readonly = false;
        stateSchema = stateSchema.properties || (stateSchema.properties = {});
        Object
          .keys(stateSchema)
          .forEach(function (propertyName) {
            stateSchema[propertyName].readonly = propertyName !== 'metadata_token';
          });
        internalIds.forEach(function (id) {
          if (!stateSchema[id]) {
            stateSchema[id] = {
              readonly: id !== 'metadata_token'
            };
          }
        });
      }
      var stateOptions = categoryOptions.fields && categoryOptions.fields[stateId];
      if (stateOptions) {
        stateOptions.hidden = true;
        stateOptions = stateOptions.fields || (stateOptions.fields = {});
        Object
          .keys(stateOptions)
          .forEach(function (fieldName) {
            stateOptions[fieldName].hidden = true;
          });
        internalIds.forEach(function (id) {
          if (!stateOptions[id]) {
            stateOptions[id] = {
              hidden: true
            };
          }
        });
      }
    }
  });

  NodeConnectableMixin.mixin(AppliedCategoryFormModel.prototype);

  return AppliedCategoryFormModel;
});
