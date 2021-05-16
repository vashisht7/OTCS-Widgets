/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/contexts/perspective/perspective.context',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/contexts/factories/previous.node',
  'csui/utils/contexts/factories/node', './perspective.context.mock.js'
], function (_, PerspectiveContext, ApplicationScopeModelFactory,
    NextNodeModelFactory, PreviousNodeModelFactory, NodeModelFactory, mock) {
  'use strict';

  describe('NodePerspectiveContextPlugin', function () {
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
    var perspectiveContext, fetchSpy, applicationScope, nextNode, previousNode;

    beforeAll(function () {
      mock.enable();
    });

    afterAll(function () {
      mock.disable();
    });

    function spyOnContext() {
      applicationScope = perspectiveContext.getModel(ApplicationScopeModelFactory);
      nextNode = perspectiveContext.getModel(NextNodeModelFactory);
      previousNode = perspectiveContext.getModel(PreviousNodeModelFactory);
      fetchSpy = spyOn(perspectiveContext, 'fetch');
      fetchSpy.and.callThrough();
    }

    beforeEach(function () {
      perspectiveContext = new PerspectiveContext({
        factories: factories
      });
      spyOnContext();
    });
    xdescribe('passes page URL parameters to the server as a custom header', function () {
      beforeAll(function () {
        this.originalLocation = window.location;
        window.location = {
          href: 'https://localhost:8888/path?flag=true',
          search: '?flag=true'
        };
      });

      afterAll(function () {
        window.location = this.originalLocation;
      });

      it('when the node with the perspective is fetched', function (done) {
        perspectiveContext.once('change:perspective', function () {
          var headers = nextNode.get('headers');
          expect(headers).toBeTruthy();
          expect(headers['X-OriginParams']).toEqual(location.search);
          done();
        });
        nextNode.set('id', 50);
      });
    });

    it('loads the node perspective when the context points to a node', function (done) {
      perspectiveContext.once('change:perspective', function () {
        var node50 = perspectiveContext.perspective.get('node.50');
        expect(node50).toBeTruthy();
        done();
      });
      nextNode.set('id', 50);
    });

    it('triggers no change:id event if the first page loads', function (done) {
      var triggered;
      perspectiveContext
          .on('change:perspective', function () {
            perspectiveContext.fetch();
          })
          .on('request', function () {
            var node = perspectiveContext.getModel('node');
            node.on('change:id', function () {
              triggered = true;
            });
          })
          .on('sync', function () {
            setTimeout(function () {
              expect(triggered).toBeFalsy();
              done();
            });
          });
      nextNode.set('id', 50);
    });

    it('triggers no change:id event if the perspective changes', function (done) {
      perspectiveContext.once('change:perspective', function () {
        var triggered;
        perspectiveContext
            .on('change:perspective', function () {
              perspectiveContext
                  .clear()
                  .fetch();
            })
            .on('request', function () {
              var node = perspectiveContext.getModel('node');
              node.on('change:id', function () {
                triggered = true;
              });
            })
            .on('sync', function () {
              setTimeout(function () {
                expect(triggered).toBeFalsy();
                done();
              });
            });
        nextNode.set('id', 60);
      });
      perspectiveContext.fetchPerspective();
    });

    it('triggers one change:id event if the perspective is refreshed', function (done) {
      perspectiveContext.once('change:perspective', function () {
        var triggered = 0;
        perspectiveContext
            .on('change:perspective', function () {
              perspectiveContext.fetch();
            })
            .on('sync', function () {
              setTimeout(function () {
                expect(triggered).toEqual(1);
                done();
              });
            });
        var node = perspectiveContext.getModel('node');
        node.on('change:id', function () {
          ++triggered;
        });
        nextNode.set('id', 60);
      });
      nextNode.set('id', 50);
    });

    it('opening another container, which has the same perspective as the current one, ' +
      'does not change the current perspective, but just re-fetches the data', function (done) {
      perspectiveContext.once('change:perspective', function () {
        perspectiveContext.clear();
        var node = perspectiveContext.getModel(NodeModelFactory);
        expect(node.get('id')).toEqual(50);
        perspectiveContext
            .once('change:perspective', function () {
              fail('Perspective should not change');
            })
            .once('sync', function () {
              expect(perspectiveContext.getModel(NodeModelFactory)).toBe(node);
              expect(node.get('id')).toEqual(60);
              expect(previousNode.get('id')).toEqual(50);
              expect(fetchSpy).toHaveBeenCalled();
              done();
            });
        nextNode.set('id', 60);
      });
      nextNode.set('id', 50);
    });

    it('opening another container, which has a different perspective that the current one, ' +
      'change the current perspective, and does not re-fetches the data', function (done) {
      perspectiveContext.once('change:perspective', function () {
        perspectiveContext.clear();
        var node = perspectiveContext.getModel(NodeModelFactory);
        expect(node.get('id')).toEqual(50);
        perspectiveContext.once('change:perspective', function () {
          perspectiveContext.clear();
          var node = perspectiveContext.getModel(NodeModelFactory);
          expect(node.get('id')).toEqual(70);
          expect(previousNode.get('id')).toEqual(50);
          expect(fetchSpy).not.toHaveBeenCalled();
          done();
        });
        nextNode.set('id', 70);
      });
      nextNode.set('id', 50);
    });

    it('going back from a node to the initial state loads the landing page', function (done) {
      perspectiveContext.once('change:perspective', function () {
        perspectiveContext.clear();
        var node = perspectiveContext.getModel(NodeModelFactory);
        expect(node.get('id')).toEqual(50);
        perspectiveContext.once('change:perspective', function () {
          perspectiveContext.clear();
          var landingPage = perspectiveContext.perspective.get('landing.page');
          expect(landingPage).toBeTruthy();
          var node = perspectiveContext.getModel(NodeModelFactory);
          expect(node.get('id')).toBeFalsy();
          expect(previousNode.get('id')).toEqual(50);
          done();
        });
        applicationScope.set('id', '');
      });
      nextNode.set('id', 50);
    });

    it('going to a non-node perspective and then back to the same node is possible', function (done) {
      perspectiveContext.once('change:perspective', function () {
        perspectiveContext.clear();
        var node = perspectiveContext.getModel(NodeModelFactory);
        expect(node.get('id')).toEqual(50);
        perspectiveContext.once('change:perspective', function () {
          perspectiveContext.clear();
          var node = perspectiveContext.getModel(NodeModelFactory);
          expect(node.get('id')).toBeFalsy();
          expect(previousNode.get('id')).toEqual(50);
          perspectiveContext.once('change:perspective', function () {
            perspectiveContext.clear();
            var node = perspectiveContext.getModel(NodeModelFactory);
            expect(node.get('id')).toEqual(50);
            expect(previousNode.get('id')).toBeFalsy();
            done();
          });
          nextNode.set('id', 50);
        });
        applicationScope.set('id', '');
      });
      nextNode.set('id', 50);
    });
  });
});
