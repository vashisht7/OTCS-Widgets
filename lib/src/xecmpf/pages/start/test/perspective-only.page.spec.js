/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/lib/jquery',
  'xecmpf/pages/start/perspective-only.page.view',
  'csui/pages/start/perspective.routing',
  'xecmpf/pages/start/test/perspective-only.page.mock.data',
  "css!csui/themes/carbonfiber/theme",
], function (_, $, PerspectiveOnlyPageView, PerspectiveRouting,
    PerspectiveOnlyPageMockData) {

  describe('PerspectiveView After Successful Signin', function () {
    var view, fetchSpy, deferred;

    beforeAll(function (done) {
      PerspectiveOnlyPageMockData.enable();

      require.config({
        config: {
          'csui/utils/contexts/factories/connector': {
            connection: {
              url: "//server/otcs/cs/api/v1",
              supportPath: '/img16',
              credentials: {
                username: '',
                password: ''
              }
            }
          }
        }
      });
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
      spyOn(PerspectiveRouting, 'routesWithSlashes').and.returnValue(false);
      deferred = $.Deferred();
      view = new PerspectiveOnlyPageView();
      fetchSpy = spyOn(view.perspectivePanel, "_showPerspective").and.callThrough();
      view.render();
      deferred = $.Deferred();
      view.perspectivePanel.options.context.on("sync", function () {
        setTimeout(function () {
          deferred.resolve();
          done();
        }, 1000);
      });
    });

    afterAll(function (done) {
      PerspectiveOnlyPageMockData.disable();
      view.destroy();
      var b = $('body');
      if ( b.length !== 1 ){// body was erased, add it for other tests again
          document.body = document.createElement('body');
      }
      done();
    });

    it('perspective fetch is successful', function (done) {
      deferred.promise().done(function () {
        expect(fetchSpy).toHaveBeenCalled();
        done();
      });
    });

    it('perspective view is rendered', function (done) {
      deferred.promise().done(function () {
        expect(view).toBeDefined();
        expect(view.$el.length).toBe(1);
        expect(view.$el.hasClass("binf-widgets") > 0).toBeTruthy();
        expect(view.$el.hasClass("xecm-page-widget") > 0).toBeTruthy();
        done();
      });
    });

    it('page has no header', function (done) {
      deferred.promise().done(function () {
        expect(view.$el.find('.csui-navbar').length > 0).toBeFalsy();
        done();
      });
    });

    it('page has no breadcrumb', function (done) {
      deferred.promise().done(function () {
        expect(view.$el.find('.breadcrumb-wrap').length).toBe(0);
        done();
      });
    });

    it('page has perspective panel', function (done) {
      deferred.promise().done(function () {
        expect(view.$el.find('.cs-perspective-panel').length).toBe(1);
        expect(view.$el.find('.cs-perspective').length).toBe(1);
        done();
      });
    });

  });

});
