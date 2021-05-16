/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/perspective/perspective.context',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/factories/next.node',
  'csui/controls/perspective.panel/impl/perspective.with.breadcrumb.view',
  './perspective.panel.mock.js'
], function (_, Backbone, PerspectiveContext, ApplicationScopeModelFactory,
    NextNodeModelFactory, PerspectiveWithBreadcrumbView, mock) {
  'use strict';

  describe('PerspectiveWithBreadcrumbView', function () {
    var perspectiveContext, perspectiveView, applicationScope, nextNode;

    function createPerspectiveContext() {
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
    }

    function createPerspectiveView() {
      perspectiveContext.clear();
      perspectiveView = new PerspectiveWithBreadcrumbView({
        context: perspectiveContext,
        perspectiveView: new Backbone.View()
      });
      perspectiveView.render();
    }

    beforeAll(function () {
      mock.enable();
    });

    afterAll(function () {
      mock.disable();
    });

    beforeEach(function () {
      createPerspectiveContext();
    });

    function checkAvailableBreadcrumb() {
      expect(applicationScope.get('breadcrumbsAvailable')).toBeTruthy();
      expect(perspectiveView.breadcrumbRegion.currentView).toBeTruthy();
    }

    function checkNotAvailableBreadcrumb() {
      expect(applicationScope.get('breadcrumbsAvailable')).toBeFalsy();
      expect(perspectiveView.breadcrumbRegion.currentView).toBeFalsy();
    }

    it('does not enable breadcrumb on the landing page', function () {
      createPerspectiveView();
      checkNotAvailableBreadcrumb();
    });

    it('enables breadcrumb on a node perspective', function () {
      nextNode.set('id', 2000);
      createPerspectiveView();
      checkAvailableBreadcrumb();
    });

    it('enables breadcrumbs when navigating from landing page to a node perspective', function (done) {
      perspectiveContext.once('change:perspective', function () {
        createPerspectiveView();
        checkNotAvailableBreadcrumb();
        perspectiveContext.on('change:perspective', function () {
          createPerspectiveView();
          checkAvailableBreadcrumb();
          done();
        });
        nextNode.set('id', 2000);
      });
      applicationScope.set('id', '');
    });

    it('disables breadcrumbs when navigating from a node perspective to the landing page', function (done) {
      perspectiveContext.once('change:perspective', function () {
        createPerspectiveView();
        checkAvailableBreadcrumb();
        perspectiveContext.on('change:perspective', function () {
          createPerspectiveView();
          checkNotAvailableBreadcrumb();
          done();
        });
        applicationScope.set('id', '');
      });
      nextNode.set('id', 2000);
    });

    it('retains breadcrumbs when navigating from a node perspective to another node perspective', function (done) {
      perspectiveContext.once('change:perspective', function () {
        createPerspectiveView();
        checkAvailableBreadcrumb();
        perspectiveContext.on('change:perspective', function () {
          createPerspectiveView();
          checkAvailableBreadcrumb();
          done();
        });
        nextNode.set('id', 2003);
      });
      nextNode.set('id', 2000);
    });

    it('retains breadcrumbs when navigating to other node refreshing the same node perspective', function (done) {
      perspectiveContext.once('change:perspective', function () {
        createPerspectiveView();
        checkAvailableBreadcrumb();
        perspectiveContext.on('retain:perspective', function () {
          checkAvailableBreadcrumb();
          done();
        });
        nextNode.set('id', 2001);
      });
      nextNode.set('id', 2000);
    });
  });
});
