/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/contexts/factories/factory'
], function (module, _, Backbone, ModelFactory) {

  var MetadataModel = Backbone.Model.extend({});
  return ModelFactory.extend({

    MetadataModelPrefix: 'MetadataModel',
    propertyPrefix: 'MetadataModel',

    constructor: function PropertiesModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var metadataModel = this.options.MetadataModel || {};
      if (!(metadataModel instanceof Backbone.Model)) {
        var config = module.config();
        metadataModel = new MetadataModel(metadataModel.models, _.extend({},
            metadataModel.options, config.options));
      }
      this.property = metadataModel;
    }
  });
});
