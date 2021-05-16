/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/models/node/node.model'
], function (module, $, _, Backbone, Url, NodeModel) {

  var config = module.config();

  var PreviewAttributesModel = Backbone.Model.extend({
    constructor: function PreviewAttributesModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      options || (options={});
      if (options && options.connector) {
        options.connector.assignTo(this);
      }

      this.categoryId = options.categoryId;
    },

    isFetchable: function () {
      return true;
    },
    url: function () {
      return Url.combine(
        this.connector.connection.url,
        '/forms/nodes/categories/update?id=' + this.get('id') + '&category_id=' + this.categoryId);
    },
    parse: function (response) {
      return response.forms[0];
    }
  });
  return PreviewAttributesModel;
});
