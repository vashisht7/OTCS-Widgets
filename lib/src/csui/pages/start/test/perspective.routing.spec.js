/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone',
  'csui/utils/contexts/perspective/perspective.context',
  'csui/pages/start/perspective.routing',
  'csui/utils/contexts/factories/metadata.factory',
  'csui/utils/contexts/factories/next.node',
  'csui/pages/start/impl/location',
  'csui/pages/start/impl/metadata.perspective.router',
  'csui/pages/start/impl/node.perspective.router',
  './perspective.routing.mock.js'

], function (Backbone, PerspectiveContext, PerspectiveRouting, MetadataFactory, NextNodeModelFactory,
    location, MetadataPerspectiveRouter, NodePerspectiveRouter, mock) {
  'use strict';

  function activateRouter(routers, constructorName) {
    routers.some(function(router){
      if (router instanceof constructorName) {
        router.activate();
        return true;
      }
    });
  }

  xdescribe('PerspectiveRouting', function () {
    var context, routing,
        factories = {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          },
          node: {
            attributes: {id: 2000}
          }
        };

    beforeAll(function () {
      mock.enable();
      context = new PerspectiveContext({factories: factories});
      routing = PerspectiveRouting.getInstance({context: context});
    });

    afterAll(function() {
      mock.disable();
    });

    afterEach(function () {
      context.clear();
    });

    it('Metadata routing with navigation', function (done) {
      var spyOnLocationSearch = spyOnProperty(location, 'search', 'get');
      spyOnLocationSearch.and.callFake(function() {
        return '?routing&page=30_0&filter=a&order_by=name_asc';
      });

      var metadataModel = context.getModel(MetadataFactory);
      var navigateSpy = spyOn(Backbone.Router.prototype, 'navigate');
      navigateSpy.and.callFake(function (fragment) {
        expect(fragment).toEqual('nodes/123/metadata/navigator?dropdown=properties&routing=');
        done();
      });

      activateRouter(routing._routers, NodePerspectiveRouter);

      metadataModel.set('metadata_info', {
        id: 123,
        navigator: true
      });
    });

    it('Metadata routing without navigation', function (done) {
      var spyOnLocationSearch = spyOnProperty(location, 'search', 'get');
      spyOnLocationSearch.and.callFake(function() {
        return '?routing&page=30_0&filter=a&order_by=name_asc';
      });

      activateRouter(routing._routers, NodePerspectiveRouter);

      var metadataModel = context.getModel(MetadataFactory);
      var navigateSpy = spyOn(Backbone.Router.prototype, 'navigate');
      navigateSpy.and.callFake(function (fragment) {
        expect(fragment).toEqual('nodes/456/metadata?dropdown=properties&routing=');
        done();
      });

      metadataModel.set('metadata_info', {id: 456});
    });

    it('Nodes perspective routing', function (done) {
      var spyOnLocationSearch = spyOnProperty(location, 'search', 'get');
      spyOnLocationSearch.and.callFake(function() {
        return '?dropdown=properties&routing';
      });

      var navigateSpy = spyOn(Backbone.Router.prototype, 'navigate');
      navigateSpy.and.callFake(function (fragment) {
        expect(fragment).toEqual('nodes/123?order_by=name_asc&page=30_0&routing=');
        done();
      });

      activateRouter(routing._routers, MetadataPerspectiveRouter);

      var nextNode = context.getModel(NextNodeModelFactory);
      nextNode.set('id', '123');
    });

  });

});
