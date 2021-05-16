/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery',
  'csui/controls/perspective.panel/perspective.panel.view',
  'csui/utils/contexts/perspective/perspective.context',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/factories/next.node',
  './perspective.panel.mock.js', 'csui/lib/jquery.mockjax'
], function (_, $, PerspectivePanelView, PerspectiveContext,
    ApplicationScopeModelFactory, NextNodeModelFactory, mock, mockjax) {
  'use strict';

  describe('PerspectivePanelView', function () {
    var perspectivePanelView, perspectiveContext, applicationScope, nextNode;

    function ensurePerspective(options) {
      if (!perspectiveContext) {
        perspectiveContext = new PerspectiveContext({
          factories: {
            connector: {
              connection: {
                url: '//server/otcs/cs/api/v1',
                supportPath: '/support',
                session: {
                  ticket: 'dummy'
                }
              }
            }
          }
        });
        applicationScope = perspectiveContext.getModel(ApplicationScopeModelFactory);
        nextNode = perspectiveContext.getModel(NextNodeModelFactory);
        perspectivePanelView = new PerspectivePanelView(_.extend({
          context: perspectiveContext
        }, options));
        perspectivePanelView.render();
      }
    }

    function reloadPerspective(options) {
      perspectiveContext = undefined;
      if (perspectivePanelView) {
        perspectivePanelView.destroy();
      }
      ensurePerspective(options);
    }

    beforeAll(function () {
      mock.enable();
    });

    afterAll(function () {
      if (perspectivePanelView) {
        perspectivePanelView.destroy();
      }
      mock.disable();
    });

    beforeEach(function () {
      ensurePerspective();
    });

    function isBlocked() {
      return perspectivePanelView.blockingView.counter > 0;
    }

    function checkBlockingView() {
      var contextTriggerCount = 0;
      perspectivePanelView
        .once('before:create:perspective', function () {
          expect(isBlocked()).toBeTruthy();
        });
      perspectiveContext
        .once('request:perspective sync:perspective', function () {
          expect(isBlocked()).toBeTruthy();
          ++contextTriggerCount;
        })
        .once('change:perspective retain:perspective', function () {
          expect(isBlocked()).toBeTruthy();
          ++contextTriggerCount;
        })
        .once('request', function () {
          expect(isBlocked()).toBeTruthy();
          ++contextTriggerCount;
        })
        .once('sync', function () {
          expect(contextTriggerCount).toEqual(4);
          expect(isBlocked()).toBeFalsy();
        });
    }

    function checkEventFlow() {
      var eventsCaught = 0;
      perspectiveContext
        .once('request:perspective', function () {
          ++eventsCaught;
        })
        .once('change:perspective retain:perspective', function () {
          ++eventsCaught;
        })
        .once('request', function () {
          ++eventsCaught;
        })
        .once('sync', function () {
          expect(eventsCaught).toEqual(3);
        });
    }

    function checkAJAXCallCount(count) {
      var initialMockedCalls = mockjax.mockedAjaxCalls().length;
      perspectiveContext.once('sync', function () {
        var finalMockedCalls = mockjax.mockedAjaxCalls().length;
        expect(finalMockedCalls - initialMockedCalls)
            .toBe(count, count + ' server calls should follow:');
      });
    }

    function checkAnimationEffect(done) {
      var checked;
      perspectivePanelView
        .once('before:swap:perspective before:show:perspective', function (perspectivePanelView, args) {
          var perspectiveView = args.newPerspectiveView;
          expect(perspectivePanelView.$el.hasClass('csui-in-transition')).toBeFalsy();
          expect(perspectiveView.$el.hasClass('cs-on-stage-right')).toBeFalsy();
          expect(perspectiveView.$el.hasClass('csui-fading')).toBeFalsy();
          checked = true;
        })
        .once('swap:perspective show:perspective', function () {
          expect(checked).toBeTruthy();
          done();
        });
    }

    function checkPerspectiveChanges(expectedCount, done) {
      var changeCount = 0;
      perspectivePanelView.once('before:swap:perspective before:show:perspective', function () {
        ++changeCount;
      });
      perspectiveContext.once('sync', function () {
        expect(changeCount).toEqual(expectedCount);
        done();
      });
    }

    it('loading the default landing page makes 7 server calls', function (done) {
      checkBlockingView();
      checkEventFlow();
      checkAJAXCallCount(7);
      checkAnimationEffect(done);
      applicationScope.set('id', '');
    });

    it('switching to the default container page makes 5 server calls', function (done) {
      checkBlockingView();
      checkEventFlow();
      checkAnimationEffect(done);
      checkAJAXCallCount(5);
      nextNode.set({id: 2000});
    });

    it('reloading the default container page makes 8 server calls', function (done) {
      reloadPerspective();
      checkBlockingView();
      checkEventFlow();
      checkAJAXCallCount(8);
      checkAnimationEffect(done);
      nextNode.set({id: 2000});
    });

    it('opening another container makes 4 server calls', function (done) {
      checkBlockingView();
      checkEventFlow();
      checkAJAXCallCount(4);
      checkPerspectiveChanges(0, done);
      nextNode.set({id: 2001});
    });

    it('later fetched context does not swap perspective once more', function (done) {
      reloadPerspective({waitForData: false});
      checkEventFlow();
      checkAJAXCallCount(8);
      checkPerspectiveChanges(1, done);
      nextNode.set({id: 2000});
    });
  });
});
