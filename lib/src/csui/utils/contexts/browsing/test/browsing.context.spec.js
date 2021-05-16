/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



define('test-browsing.context.plugin', [
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
  'csui/utils/contexts/browsing/browsing.context',
  'csui/utils/contexts/factories/application.scope.factory'
], function (BrowsingContext, ApplicationScopeModelFactory) {
  'use strict';

  describe('BrowsingContext', function () {
    var context;

    beforeAll(function () {
      context = new BrowsingContext();
    });

    it('supports plugins', function () {
      expect(context.hasModel(ApplicationScopeModelFactory)).toBeTruthy();
    });

    it('calls the onCreate event callback', function () {
      expect(context.onCreateCalled).toBeTruthy();
    });
  });
});
