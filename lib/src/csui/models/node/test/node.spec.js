/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/models/node/node.model',
  'csui/models/node.children2/node.children2', 'csui/models/nodes',
  'csui/utils/connector', './node.mock.js'
], function (require, _, NodeModel, NodeChildrenCollection, NodeCollection,
    Connector, mock) {
  'use strict';

  describe('NodeModel', function () {
    var connector;

    beforeAll(function () {
      connector = new Connector({
        connection: {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/support',
          session: {
            ticket: 'dummy'
          }
        }
      });
    });

    beforeEach(function () {
      mock.enable();
    });

    afterEach(function () {
      mock.disable();
    });

    it('enables fetching only common properties by default', function () {
      var node = new NodeModel({id: 1}, {connector: connector}),
          url = node.url();
      expect(url.indexOf('fields=properties')).toBeGreaterThan(0);
    });

    it('enables fetching only common properties, if other data were requested', function () {
      var node = new NodeModel({id: 1}, {
            connector: connector,
            fields: {
              columns: []
            }
          }),
          url = node.url();
      expect(url.indexOf('fields=properties')).toBeGreaterThan(0);
    });

    it('let limit fetching the common properties', function () {
      var node = new NodeModel({id: 1}, {
            connector: connector,
            fields: {
              properties: ['id']
            }
          }),
          url = node.url();
      expect(url.indexOf('fields=properties%7Bid%7D')).toBeGreaterThan(0);
      expect(url.indexOf('fields=properties[^%]')).toEqual(-1);
    });

    it('claims, that it is fetchable, if it has an integer ID', function () {
      var node = new NodeModel({id: 2000}, {connector: connector});
      expect(node.isFetchable()).toBeTruthy();
      expect(node.isFetchableDirectly()).toBeTruthy();
    });

    it('claims, that it is indirectly fetchable, it is a volume', function () {
      var node = new NodeModel({
        id: 'volume',
        type: 141
      }, {connector: connector});
      expect(node.isFetchable()).toBeTruthy();
      expect(node.isFetchableDirectly()).toBeFalsy();
    });

    it('fetches node information for a concrete node ID', function (done) {
      var node = new NodeModel({id: 2000}, {connector: connector}),
          promise = node.fetch();
      expect(node.fetching).toBeTruthy();
      expect(node.fetched).toBeFalsy();
      promise
          .always(function () {
            expect(node.fetching).toBeFalsy();
            expect(node.fetched).toBeTruthy();
            expect(node.get('type')).toBe(141);
          })
          .always(done);
    }, 5000);

    it('fetches node information for Enterprise Workspace by its subtype', function (done) {
      var node = new NodeModel({id: 'volume', type: 141}, {connector: connector}),
          promise = node.fetch();
      expect(node.fetching).toBeTruthy();
      expect(node.fetched).toBeFalsy();
      promise
          .always(function () {
            expect(node.fetching).toBeFalsy();
            expect(node.fetched).toBeTruthy();
            expect(node.get('id')).toBe(2000);
          })
          .always(done);
    }, 5000);

    it('does not clone the fetching status', function () {
      var original = new NodeModel({id: 2000}, {connector: connector});
      original.fetching = {};
      original.fetched = true;
      original.error = new Error();
      var clone = original.clone();
      expect(clone.fetching).toBeFalsy();
      expect(clone.fetched).toBeTruthy();
      expect(clone.error).toBeTruthy();
    });

    it('parses the v1 REST API response', function (done) {
      var node = new NodeModel({id: 2001}, {connector: connector});
      node
          .fetch({url: '//server/otcs/cs/api/v1/nodes/2001'})
          .always(function () {
            expect(node.get('name')).toBeDefined();
          })
          .always(done);
    }, 5000);

    xit('parses the v2 REST API response', function (done) {
      var node = new NodeModel({id: 2001}, {connector: connector});
      node
          .fetch({url: '//server/otcs/cs/api/v2/nodes/2001'})
          .always(function () {
            expect(node.get('name')).toBeDefined();
          })
          .always(done);
    }, 5000);

    it('connects aggregated models in constructor', function (done) {
      var node = new NodeModel({id: 2006}, {connector: connector});
      node
          .fetch()
          .done(function () {
            node = new NodeModel(node.attributes, {connector: connector});
            expect(node.original).toBeTruthy();
            expect(node.original.connector).toBeTruthy();
            expect(node.parent).toBeTruthy();
            expect(node.parent.connector).toBeTruthy();
            expect(node.volume).toBeTruthy();
            expect(node.volume.connector).toBeTruthy();
          })
          .done(done);
    }, 5000);

    describe('when serving as a parent to inherit another model from', function () {
      var SpecializedNodeModel = NodeModel.extend({});

      it('the inherited model includes all methods from the parent prototype', function () {
        var specializedNode = new SpecializedNodeModel();
        expect(specializedNode.isFetchable).toBeDefined();
      });
    });

    describe('when expanding a shortcut original', function () {
      it('it carries permitted actions if server sent them', function (done) {
        var node = new NodeModel({id: 2002}, {connector: connector});
        node
            .fetch()
            .done(function () {
              expect(node.original.actions.length).toEqual(1);
              expect(node.original.actions.first().get('signature')).toEqual('download');
            })
            .done(done);
      }, 5000);

      it('it carries no permitted action if server did not send them', function (done) {
        var node = new NodeModel({id: 2003}, {connector: connector});
        node
            .fetch()
            .done(function () {
              expect(node.original.actions.length).toEqual(0);
            })
            .done(done);
      });
    });

    describe('when expanding a node parent', function () {
      it('it carries permitted actions if server sent them', function (done) {
        var node = new NodeModel({id: 2004}, {connector: connector});
        node
            .fetch()
            .done(function () {
              expect(node.parent.actions.length).toEqual(1);
              expect(node.parent.actions.first().get('signature')).toEqual('properties');
            })
            .done(done);
      }, 5000);

      it('it can be always opened, if server sent no actions (!!!)', function (done) {
        var node = new NodeModel({id: 2005}, {connector: connector});
        node
            .fetch()
            .done(function () {
              expect(node.parent.actions.length).toEqual(1);
              expect(node.parent.actions.first().get('signature')).toEqual('open');
            })
            .done(done);
      }, 5000);
    });

    describe('when speaking about permitted actions', function () {
      it('it does not delay action fetching by default', function (done) {
        var node = new NodeModel({id: 2007}, {connector: connector});
        expect(node.delayRestCommands).toBeFalsy();
        node
            .fetch()
            .done(function () {
              expect(node.actions.length).toEqual(1);
              var properties = node.actions.first();
              expect(properties.get('signature')).toEqual('properties');
              expect(properties.get('custom')).toEqual('test');
              expect(node.delayedActions.fetching).toBeFalsy();
              expect(node.delayedActions.fetched).toBeFalsy();
            })
            .done(done);
      });

      it('it delays action fetching action, if enabled', function (done) {
        var node = new NodeModel({id: 2007}, {
          connector: connector,
          delayRestCommands: true,
          commands: ['properties', 'delete'],
          defaultActionCommands: ['properties']
        });
        expect(node.delayRestCommands).toBeTruthy();
        node.delayedActions.on('sync', function () {
          expect(node.actions.length).toEqual(2);
          var properties = node.actions.first();
          expect(properties.get('signature')).toEqual('properties');
          expect(properties.get('custom')).toEqual('test');
        done();
        });
        node.fetch({
          success: function () {
            expect(node.actions.length).toEqual(1);
            var properties = node.actions.first();
            expect(properties.get('signature')).toEqual('properties');
            expect(properties.get('custom')).toEqual('test');
          }
        });
      });

      it('it fetches actions in parallel with info, if requested', function (done) {
        var node = new NodeModel({id: 2008}, {
          connector: connector,
          separateCommands: true,
          commands: ['properties', 'delete', 'test1', 'test2', 'test3',
            'test4', 'test5', 'test6', 'test7', 'test8', 'test9']
        });
        node.fetch({
          success: function () {
            expect(node.get('name')).toEqual('Test');
            expect(node.actions.length).toEqual(11);
            var properties = node.actions.first();
            expect(properties.get('signature')).toEqual('properties');
            expect(properties.get('custom')).toEqual('test');
            done();
          }
        });
      });

      it('it does not fail fetching if separate actions are requested with no action signatures', function (done) {
        var node = new NodeModel({id: 2008}, {
          connector: connector,
          separateCommands: true
        });
        node.fetch({
          success: function () {
            expect(node.get('name')).toEqual('Test');
            expect(node.actions.length).toEqual(0);
            done();
          }
        });
      });

      it('it uses URL parameters decided by the parent collection', function (done) {
        var collection = new NodeChildrenCollection(undefined, {
          connector: connector,
          fields: {
            properties: [],
            other: []
          },
          commands: ['properties', 'delete', 'test1', 'test2', 'test3',
            'test4', 'test5', 'test6', 'test7', 'test8', 'test9']
        });
        var node = new NodeModel({id: 2008}, {
          connector: connector,
          separateCommands: true
        });
        collection.add(node);
        node.fetch({
          success: function () {
            var query = node.get('query');
            expect(query).toMatch(/\bfields=other\b/);
            expect(query).not.toMatch(/\bactions=/);
            expect(node.get('name')).toEqual('Test');
            expect(node.actions.length).toEqual(11);
            var properties = node.actions.first();
            expect(properties.get('signature')).toEqual('properties');
            expect(properties.get('custom')).toEqual('test');
            done();
          }
        });
      });

      it('it ignores the collection parameters if teh parent collection is not a v2-fetching but only a selection collection', function (done) {
        var collection = new NodeCollection();
        var node = new NodeModel({id: 2008}, {
          connector: connector,
          fields: {
            properties: [],
            other: []
          },
          commands: ['properties', 'delete', 'test1', 'test2', 'test3',
            'test4', 'test5', 'test6', 'test7', 'test8', 'test9'],
          separateCommands: true
        });
        collection.add(node);
        node.fetch({
          success: function () {
            var query = node.get('query');
            expect(query).toMatch(/\bfields=other\b/);
            expect(query).not.toMatch(/\bactions=/);
            expect(node.get('name')).toEqual('Test');
            expect(node.actions.length).toEqual(11);
            var properties = node.actions.first();
            expect(properties.get('signature')).toEqual('properties');
            expect(properties.get('custom')).toEqual('test');
            done();
          }
        });
      });

      it('it fetches actions together with info, if below threshold', function (done) {
        var node = new NodeModel({id: 2007}, {
          connector: connector,
          separateCommands: true,
          commands: ['properties']
        });
        node.fetch({
          success: function () {
            expect(node.get('name')).toEqual('Test');
            expect(node.actions.length).toEqual(1);
            var properties = node.actions.first();
            expect(properties.get('signature')).toEqual('properties');
            expect(properties.get('custom')).toEqual('test');
            done();
          }
        });
      });
    });

    describe('if constructed with a string identifier', function () {

      function setIntegerIdUsage(enable, done) {
        window.csui.requirejs.config({
          config: {
            'csui/models/node/node.model': {
              usesIntegerId: enable
            }
          }
        });
        window.csui.requirejs.undef('csui/models/node/node.model');
        require(['csui/models/node/node.model'], function (NewNodeModel) {
          NodeModel = NewNodeModel;
          done();
        });
      }

      beforeAll(function (done) {
        setIntegerIdUsage(false, done);
      }, 5000);

      afterAll(function (done) {
        setIntegerIdUsage(true, done);
      });

      beforeAll(function () {
        this.node = new NodeModel({id: 'test'}, {connector: connector});
      });

      it('claims, that it is not new', function () {
        expect(this.node.isNew()).toBeFalsy();
      });

      it('claims, that it is fetchable', function () {
        expect(this.node.isFetchable()).toBeTruthy();
      });

      it('fetches the right data', function (done) {
        var node = this.node;
        node.fetch()
            .then(function () {
              expect(node.get('name')).toEqual('Test');
              done();
            });
      });
    });
  });
});
