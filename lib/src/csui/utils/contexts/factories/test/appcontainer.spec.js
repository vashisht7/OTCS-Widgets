/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/utils/contexts/context', 'csui/utils/contexts/factories/appcontainer',
  'csui/models/node/node.addable.type.factory', 'csui/utils/contexts/factories/ancestors',
  'csui/utils/contexts/factories/children2', 'csui/utils/contexts/factories/node',
  './appcontainer.mock.js'
], function (Context, AppContainerFactory, AddableTypeCollectionFactory,
    AncestorCollectionFactory, Children2CollectionFactory, NodeModelFactory, mock) {
  'use strict';

  describe('AppContainerFactory', function () {
    beforeAll(mock.enable);
    afterAll(mock.disable);

    beforeEach(function () {
      this.context = new Context({
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
      this.node = this.context.getModel(NodeModelFactory);
      this.node.set({id: 2000});
      this.addableTypes = this.context.getCollection(AddableTypeCollectionFactory, {
        detached: true
      });
      this.ancestors = this.context.getCollection(AncestorCollectionFactory);
      this.children = this.context.getCollection(Children2CollectionFactory, {
        detached: true,
        useSpecialPaging: true
      });
      this.appContainer = this.context.getModel(AppContainerFactory, {
        models: {
          container: this.node,
          addableTypes: this.addableTypes,
          children: this.children
        }
      });
    });

    it('detaches ancestors from the context to prevent its fetching', function (done) {
      this.context
          .once('request', function () {
            var ancestorsFactory = this.context.getFactory('ancestors');
            expect(ancestorsFactory.options.detached).toBeTruthy();
            done();
          }, this)
          .fetch();
    });

    it('prevents fetching of addable types, ancestors and children', function (done) {
      var collections = ['addableTypes', 'ancestors', 'children'];
      var fetchSpies = collections.map(function (collection) {
        return spyOn(this[collection], 'fetch');
      }, this);

      this.context
          .once('sync', function () {
            fetchSpies.forEach(function (fetchSpy) {
              expect(fetchSpy).not.toHaveBeenCalled();
            });
            done();
          })
          .fetch();
    });

    it('triggers request and sync events on addable types, ancestors and children', function (done) {
      var eventCounts = {};
      function countCalls(collection) {
        if (eventCounts[collection] === undefined) {
          eventCounts[collection] = 1;
        } else {
          ++eventCounts[collection];
        }
      }

      var collections = ['addableTypes', 'ancestors', 'children'];
      collections.forEach(function (collection) {
        this[collection].on('request sync', countCalls.bind(null, collection));
      }, this);

      this.context
          .once('sync', function () {
            collections.forEach(function (collection) {
              expect(eventCounts[collection]).toEqual(2);
            });
            done();
          })
          .fetch();
    });

    it('populates the children at first, before the other two collections', function (done) {
      var eventHandlers = [];
      function rememberCalls(collection) {
        eventHandlers.push(collection);
      }

      var collections = ['addableTypes', 'ancestors', 'children'];
      collections.forEach(function (collection) {
        this[collection].on('reset', rememberCalls.bind(null, collection));
      }, this);

      this.context
          .once('sync', function () {
            expect(eventHandlers.length).toEqual(3);
            expect(eventHandlers[0]).toEqual('children');
            done();
          })
          .fetch();
    });

    it('triggers change events after the collections are populated', function (done) {
      function rememberCalls(collection) {
        expect(this[collection].length).toEqual(1);
      }

      var collections = ['addableTypes', 'ancestors', 'children'];
      collections.forEach(function (collection) {
        this[collection].on('reset', rememberCalls.bind(this, collection));
      }, this);

      this.context
          .once('sync', done)
          .fetch();
    });
  });
});
