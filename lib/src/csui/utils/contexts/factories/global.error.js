/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory'
], function (module, _, Backbone, ModelFactory) {
  'use strict';

  var GlobalError = Backbone.Model.extend({
    defaults: {
      message: null,
      details: null
    }
  });

  var GlobalErrorFactory = ModelFactory.extend({
    propertyPrefix: 'globalError',

    constructor: function GlobalErrorModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var globalError = this.options.globalError || {};
      if (!(globalError instanceof Backbone.Model)) {
        var config = module.config();
        globalError = new GlobalError(globalError.attributes, _.extend({},
            globalError.options, config.options));
        this.options.permanent = true;
      }
      this.property = globalError;
    }
  });

  return GlobalErrorFactory;
});
