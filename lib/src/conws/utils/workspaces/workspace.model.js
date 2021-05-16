/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'module',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/models/node/node.model'
], function (module, $, _, Backbone, NodeModel) {

  var WorkspaceModel = NodeModel.extend({

    constructor: function WorkspaceModel(attributes, options) {
      options || (options = {});
      if (!options.connector) {
        options.connector = options.collection && options.collection.connector || undefined;
      }

      NodeModel.prototype.constructor.call(this, attributes, options);
    },
    idAttribute: 'id',
    parse: function (response, options) {
      var node = NodeModel.prototype.parse.call(this, response, options);
      if (!node.container) {
        node.container = true;
      }

      return node;
    }

  });

  return WorkspaceModel;
});
