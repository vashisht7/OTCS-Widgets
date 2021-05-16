/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/models/node/node.model', 'csui/models/nodeforms',
  'csui/models/form', 'csui/models/appliedcategoryform'
], function (_, NodeModel, NodeFormCollection, FormModel, AppliedCategoryFormModel) {
  'use strict';

  function UpdateFormModelFactory (attributes, options) {
    if (attributes.role_name === 'categories') {
      return new AppliedCategoryFormModel(attributes, options);
    }
    return new FormModel(attributes, options);
  }

  var NodeUpdateFormCollection = NodeFormCollection.extend({
    constructor: function NodeUpdateFormCollection(models, options) {
      NodeFormCollection.prototype.constructor.apply(this, arguments);
      this.makeNodeResource(options);
    },

    model: UpdateFormModelFactory,

    clone: function () {
      return new this.constructor(this.models, {
        node: this.node
      });
    },

    url: function () {
      return _.str.sformat('{0}/forms/nodes/update?id={1}', this.connector.connection.url,
        this.node.get('id'));
    },

    parse: function (response) {
      var forms = [];
      (response.forms || []).forEach(this._parseForm.bind(this, forms));
      return forms;
    },

    _parseForm: function (forms, form) {
      if (form.role_name === 'categories') {
        this._parseCategory(forms, form);
      } else {
        forms.push(form);
      }
    },

    _parseCategory: function (forms, form) {
      var formData = form.data || {};
      var formSchema = form.schema && form.schema.properties || {};
      var formOptions = form.options && form.options.fields || {};
      Object
        .keys(formSchema)
        .forEach(function (categoryId) {
          if (NodeModel.usesIntegerId) {
            categoryId = +categoryId;
          }
          var categoryData = formData[categoryId] || {};
          var categorySchema = formSchema[categoryId] || {};
          var categoryOptions = formOptions[categoryId] || {};
          var categoryName = categorySchema['title'];
          var removeable = categoryOptions.removeable !== false;
          forms.push({
            id: categoryId,
            name: categoryName,
            title: categoryName,
            data: categoryData,
            role_name: 'categories',
            removeable: removeable,
            allow_delete: removeable,
            categoryId: categoryId,
            options: categoryOptions,
            schema: categorySchema
          });
        });
    }
  });

  return NodeUpdateFormCollection;
});
