/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/contexts/perspective/perspective.context',
  './perspective.context.mock.js'
], function (_, PerspectiveContext, mock) {
  'use strict';

  describe('MetadataPerspectiveContextPlugin', function () {
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
    var perspectiveContext;

    beforeAll(function () {
      mock.enable();
    });

    afterAll(function () {
      mock.disable();
    });

    beforeEach(function () {
      perspectiveContext = new PerspectiveContext({
        factories: factories
      });
    });

    it('loads the landing page perspective when given no node', function (done) {
      perspectiveContext.once('change:perspective', function () {
        var landingPage = perspectiveContext.perspective.get('landing.page');
        expect(landingPage).toBeTruthy();
        done();
      });
      perspectiveContext.fetchPerspective();
    });
  });
});
