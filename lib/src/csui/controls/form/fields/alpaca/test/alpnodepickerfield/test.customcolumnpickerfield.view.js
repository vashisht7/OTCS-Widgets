/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/jquery', 'csui/lib/underscore',
    'csui/controls/form/fields/nodepickerfield.view',
    './test.pickerinfo.factory.js'
  ], function ($, _,
    NodePickerFieldView,
    PickerInfoFactory
    ) {
    'use strict';
  
    var CustomColumnPickerFieldView = NodePickerFieldView.extend({
  
      constructor: function CustomColumnPickerFieldView(options) {
        $.extend(true, options.model.get('options'), { type_control: { parameters: {
          select_types: [902],
          globalSearch: false
        } } });
        NodePickerFieldView.apply(this, arguments);
      },

      mapFieldValueToNodeId: function(data) {
        if (data) {
          var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g;
          var match = parameterPlaceholder.exec(data);
          var columnId = match && match[1];
          var customColumnModel = this.options.context.getModel(PickerInfoFactory,{
              attributes: {
                config_id: columnId,
                picker_type: "otconws_customcolumn"
              }
            });
          return customColumnModel.ensureFetched().then(function(){
            return $.Deferred().resolve(customColumnModel.get('object_id')).promise();
          },function(){
            return $.Deferred().resolve().promise();
          });
        } else {
          return $.Deferred().resolve().promise();
        }
      },
  
      mapNodeIdToFieldValue: function(nodeId) {
        if (nodeId) {
          var customColumnModel = this.options.context.getModel(PickerInfoFactory,{
              attributes: {
                object_id: nodeId,
                picker_type: "otconws_customcolumn"
              }
            });
          return customColumnModel.ensureFetched().then(function() {
              return $.Deferred().resolve('{'+customColumnModel.get('config_id')+'}').promise();
            },function(){
              return $.Deferred().resolve().promise();
            });
          } else {
          return $.Deferred().resolve().promise();
        }
      },

      _getNodePicker: function() {
        $.extend(true, this.model.get('options'), { type_control: { parameters: {
          startLocation: this.model.get('data')
                          ? 'csui/dialogs/node.picker/start.locations/current.location'
                          : 'src/controls/form/fields/alpaca/test/alpnodepickerfield/test.facets.volume',
          startLocations: [
            'csui/dialogs/node.picker/start.locations/current.location',
            'src/controls/form/fields/alpaca/test/alpnodepickerfield/test.facets.volume'
          ]
        } } });
        return NodePickerFieldView.prototype._getNodePicker.apply(this,arguments);
      }
    });

    return CustomColumnPickerFieldView;
  });
  