/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'conws/models/configurationvolume/configurationvolume.model', 'csui/utils/commands'
], function (module, $, Backbone, ModelFactory, ConnectorFactory,
    volumesModel, commands) {
  'use strict';

  var ConfigurationVolumeFactory = ModelFactory.extend({
    propertyPrefix: 'configurationvolume',

    constructor: function ConfigurationVolumeFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);
      var connector = context.getObject(ConnectorFactory, options);
      this.context = context;
      this.property = new volumesModel(options, {
        connector: connector
      });
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.ensureFetched(options);
    }
  });

  return ConfigurationVolumeFactory;
});
