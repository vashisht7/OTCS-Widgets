/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore'
], function (module, _) {
  'use strict';

  var developmentPage = module.config().developmentPage;
  readOldSettings('csui/pages/start/perspective.routing');
  readOldSettings('csui/pages/start/impl/perspective.router');

  function readOldSettings(moduleName) {
    if (developmentPage === undefined) {
      var oldConfig = window.csui.requirejs.s.contexts._.config
        .config[moduleName] || {};
      developmentPage = oldConfig.developmentPage;
    }
  }

  return {
    routesWithSlashes: function () {
      return /\/app(?:\/.*)?$/.test(location.pathname) || !developmentPage;
    }  
  };
});
