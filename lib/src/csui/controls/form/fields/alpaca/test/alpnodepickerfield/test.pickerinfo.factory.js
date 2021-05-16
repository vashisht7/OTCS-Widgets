/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector',
  './test.pickerinfo.model.js'
], function (_,
  ModelFactory,
  ConnectorFactory,
  PickerInfoModel) {

  var PickerInfoFactory = ModelFactory.extend({

    propertyPrefix: 'pickerInfo',

    constructor: function PickerInfoFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var connector = options.pickerInfo.connector || context.getObject(ConnectorFactory, options);

      if (options.model) {
        this.property = new PickerInfoModel(options.model.attributes,{connector: connector});
        this.property.fetched = true;
      } else {
        this.property = new PickerInfoModel(options.attributes,{connector: connector});
        this.listenToOnce(this.property,"sync",function(){
            context.getModel(PickerInfoFactory,{attributes:{config_id:this.property.get("config_id")},model:this.property});
            context.getModel(PickerInfoFactory,{attributes:{object_id:this.property.get("object_id")},model:this.property});
          });
      }

    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return PickerInfoFactory;

});
