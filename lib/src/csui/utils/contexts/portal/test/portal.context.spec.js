/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



define('test-portal.context.plugin', [
  'csui/utils/contexts/context.plugin',
  'csui/utils/contexts/factories/application.scope.factory'
], function (ContextPlugin, ApplicationScopeModelFactory) {
  'use strict';

  var TestContextPlugin = ContextPlugin.extend({
    constructor: function TestContextPlugin(options) {
      ContextPlugin.prototype.constructor.apply(this, arguments);
      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);
    },

    onCreate: function () {
      this.context.onCreateCalled = true;
    }
  });

  return TestContextPlugin;
});

define([
  'csui/utils/contexts/portal/portal.context',
  'csui/utils/contexts/factories/application.scope.factory'
], function (PortalContext, ApplicationScopeModelFactory) {
  'use strict';

  describe('PortalContext', function () {
    var context;

    beforeAll(function () {
      context = new PortalContext();
    });

    it('supports plugins', function () {
      expect(context.hasModel(ApplicationScopeModelFactory)).toBeTruthy();
    });

    it('calls the onCreate event callback', function () {
      expect(context.onCreateCalled).toBeTruthy();
    });
  });
});
