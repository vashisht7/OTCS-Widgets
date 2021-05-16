/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/contexts/perspective/perspective.context',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/perspective/perspective.context.plugin',
  'csui/utils/contexts/context.plugin', './perspective.context.mock.js'
], function (_, $, PerspectiveContext, ApplicationScopeModelFactory,
    NextNodeModelFactory, Factory, PerspectiveContextPlugin, ContextPlugin, mock) {
  'use strict';

  describe('PerspectiveContext', function () {
    var TestObjectFactory = Factory.extend({
      propertyPrefix: 'test',
      constructor: function TestObjectFactory(context, options) {
        Factory.prototype.constructor.apply(this, arguments);
        this.property = {};
      }
    });

    var factories = {
      connector: {
        connection: {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/support',
          session: {
            ticket: 'dummy'
          }
        }
      }
    };
    var perspectiveContext, fetchSpy, applicationScope, nextNode;

    beforeAll(function () {
      mock.enable();
    });

    afterAll(function () {
      mock.disable();
    });

    function spyOnContext() {
      applicationScope = perspectiveContext.getModel(ApplicationScopeModelFactory);
      nextNode = perspectiveContext.getModel(NextNodeModelFactory);
      fetchSpy = spyOn(perspectiveContext, 'fetch');
      fetchSpy.and.callThrough();
    }

    beforeEach(function () {
      perspectiveContext = new PerspectiveContext({
        factories: factories
      });
      spyOnContext();
    });

    it('retains the internal contextual objects when the perspective is changed', function () {
      perspectiveContext.clear();
      var initialFactoryCount = _.keys(perspectiveContext._factories).length;
      perspectiveContext.getObject(TestObjectFactory);
      var fullFactoryCount = _.keys(perspectiveContext._factories).length;
      perspectiveContext.clear();
      var clearedFactoryCount = _.keys(perspectiveContext._factories).length;
      expect(fullFactoryCount)
          .toBe(initialFactoryCount + 1, 'Model count in context before clear');
      expect(clearedFactoryCount)
          .toBe(initialFactoryCount, 'Model count in context after clear');
    });

    it('survives an empty context plugin', function (done) {
      var EmptyContextPlugin = ContextPlugin.extend({});
      perspectiveContext = new PerspectiveContext({
        plugins: [EmptyContextPlugin],
        factories: factories
      });
      spyOnContext();
      perspectiveContext.once('change:perspective', function () {
        var landingPage = perspectiveContext.perspective.get('landing.page');
        expect(landingPage).toBeTruthy();
        perspectiveContext.once('sync', done);
        applicationScope.trigger('change:id', applicationScope);
        applicationScope.trigger('change', applicationScope);
      });
      perspectiveContext.fetchPerspective();
    });

    describe('with a perspective context plugin', function () {
      var onCreate, onApply, onClear, onRefresh;
      var testPlugin;

      var TestPerspectiveContextPlugin = PerspectiveContextPlugin.extend({
        constructor: function TestPerspectiveContextPlugin() {
          PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);
          testPlugin = this;
          onCreate = spyOn(testPlugin, 'onCreate');
          onApply = spyOn(testPlugin, 'onApply');
          onClear = spyOn(testPlugin, 'onClear');
          onRefresh = spyOn(testPlugin, 'onRefresh');
        }
      });

      beforeEach(function () {
        perspectiveContext = new PerspectiveContext({
          plugins: [TestPerspectiveContextPlugin],
          factories: factories
        });
        spyOnContext();
      });

      function loadAndReloadPerspective(done) {
        var perspectiveRequested, perspectiveSynced;
        perspectiveContext
          .once('request:perspective', function () {
            perspectiveRequested = true;
          })
          .once('sync:perspective', function () {
            perspectiveSynced = true;
          })
          .once('change:perspective', function () {
            expect(perspectiveRequested).toBeTruthy();
            expect(perspectiveSynced).toBeTruthy();
            perspectiveContext.clear();
            var landingPage = perspectiveContext.perspective.get('landing.page');
            expect(landingPage).toBeTruthy();
            perspectiveContext.once('sync', function () {
              expect(onCreate).toHaveBeenCalledTimes(1);
              expect(onApply).toHaveBeenCalledTimes(2);
              expect(onClear).toHaveBeenCalledTimes(1);
              expect(onRefresh).toHaveBeenCalledTimes(1);
              done();
            });
            applicationScope.trigger('change:id', applicationScope);
            applicationScope.trigger('change', applicationScope);
          });
        perspectiveContext.fetchPerspective();
      }

      it('calls event callbacks on perspective navigation and reuse', loadAndReloadPerspective);

      it('continues applying perspective on a resolved promise from onApply', function (done) {
        var onApply = testPlugin.onApply;
        testPlugin.onApply = function () {
          onApply.apply(this, arguments);
          return $.Deferred().resolve().promise();
        };
        loadAndReloadPerspective(done);
      });

      function abortApplyingPerspective(done) {
        perspectiveContext.once('request:perspective', function () {
          var perspectiveSynced, perspectiveChanged;
          perspectiveContext
            .once('sync:perspective', function () {
              perspectiveSynced = true;
            })
            .once('change:perspective', function () {
              perspectiveChanged = true;
            });
          setTimeout(function () {
            expect(perspectiveSynced).toBeTruthy();
            expect(perspectiveChanged).toBeUndefined();
            expect(onClear).toHaveBeenCalledTimes(0);
            expect(onRefresh).toHaveBeenCalledTimes(0);
            done();
          }, 50);
        });
        perspectiveContext.fetchPerspective();
      }

      it('aborts applying perspective on `false` returned from onApply', function (done) {
        testPlugin.onApply = function () {
          return false;
        };
        abortApplyingPerspective(done);
      });

      it('aborts applying perspective on a rejected promise from onApply', function (done) {
        testPlugin.onApply = function () {
          return $.Deferred().reject().promise();
        };
        abortApplyingPerspective(done);
      });

      it('fails a perspective on a promise from onApply rejected with an error', function (done) {
        var applyError = new Error('Test');
        testPlugin.onApply = function () {
          return $.Deferred().reject(applyError).promise();
        };
        perspectiveContext.once('request:perspective', function () {
          perspectiveContext.once('error:perspective', function (context, error) {
            expect(context).toBe(perspectiveContext);
            expect(error).toBe(applyError);
            done();
          });
        });
        perspectiveContext.fetchPerspective();
      });
    });

    describe('handles server errors well', function () {
      beforeAll(function () {
        mock.enable();
        mock.enableErrors();
      });

      afterAll(function () {
        mock.disable();
      });

      function expectError(done) {
        perspectiveContext.once('error:perspective', function (error) {
          expect(error).toBeDefined();
          done();
        });
        applicationScope.clear({silent: true});
      }

      it('when loading the landing page', function (done) {
        expectError(done);
        applicationScope.clear({silent: true});
        applicationScope.set('id', '');
      });

      it('when loading a node perspective', function (done) {
        expectError(done);
        nextNode.set('id', 10);
      });
    });
  });
});
