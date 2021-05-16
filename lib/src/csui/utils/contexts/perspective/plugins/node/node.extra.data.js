/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui-ext!csui/utils/contexts/perspective/plugins/node/node.extra.data'
], function (_, extraNodeData) {
  'use strict';

  return {
    getModelFields: function (options) {
      var modelFields = {};
      if (extraNodeData) {
        _.each(extraNodeData, function (nodeData) {
          if (nodeData.getModelFields) {
            _.mapObject(nodeData.getModelFields(options), function (val, key) {
              modelFields[key] = _.union(modelFields[key], val);
            });
          }
        });
      }
      return modelFields;
    },

    getModelExpand: function (options) {
      var modelExpands = {};
      if (extraNodeData) {
        _.each(extraNodeData, function (nodeData) {
          if (nodeData.getModelExpand) {
            _.mapObject(nodeData.getModelExpand(options), function (val, key) {
              modelExpands[key] = _.union(modelExpands[key], val);
            });
          }
        });
      }
      return modelExpands;
    }
  };

});
