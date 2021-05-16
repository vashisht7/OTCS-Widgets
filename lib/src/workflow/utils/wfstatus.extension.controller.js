/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/log'
], function (_, $, Backbone, log) {
  'use strict';
  function WfstatusExtensionController(options) {
    this.context = options.context;
  }
  _.extend(WfstatusExtensionController.prototype, {
    initialize: function () {},
    validate: function (type, sub_type) {
      return false;
    },
    execute: function (options) {
      var deferred = $.Deferred();
      deferred.resolve();
      return deferred.promise();
    },
    executeAction: function (options) {
      var deferred = $.Deferred();
      deferred.resolve();
      return deferred.promise();
    },
    customizeFooter: function (options) {
      var deferred = $.Deferred();
      deferred.resolve();
      return deferred.promise();
    }
  });

  WfstatusExtensionController.extend = Backbone.Model.extend;
  WfstatusExtensionController.ExtensionPoints = {
    AddSidebar: 1,
   
  };

  return WfstatusExtensionController;
});
