/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette', 'csui/lib/backbone', 'csui/lib/jquery',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/connector', 'csui/models/node/node.model',
  'csui/models/nodes', 'csui/utils/commands/execute.saved.query',
  'csui/utils/commands', 'csui/controls/globalmessage/globalmessage',
  './execute.saved.query.mock.js',
  '../../../utils/testutils/async.test.utils.js'
], function (Marionette, Backbone, $, PageContext, ConnectorFactory, NodeModel,
    NodeCollection, ExecuteSavedQuery, commands, GlobalMessage, Mock, TestUtils) {
  'use strict';

  describe('Edit perspective Command', function () {

    var executeSavedQueryCommand, context, connector;

    beforeAll(function () {
      executeSavedQueryCommand = commands.get('ExecuteSavedQuery');
      Mock.enable();
    });

    afterAll(function () {
      $('body').empty();
      Mock.disable();
    });

    it('can be constructed', function () {
      var helloCommand = new ExecuteSavedQuery();
      expect(helloCommand instanceof ExecuteSavedQuery).toBeTruthy();
    });

    it('is registered by default', function () {
      expect(executeSavedQueryCommand).toBeDefined();
    });

    it('signature is "ExecuteSavedQuery"', function () {
      expect(executeSavedQueryCommand.get('signature')).toEqual('ExecuteSavedQuery');
      expect(executeSavedQueryCommand.get('command_key')).toBeUndefined();
    });

    describe('when executed with a node', function () {

      var status;

      afterAll(function () {
        TestUtils.restoreEnvironment();
      });

      beforeEach(function () {
        var node = new NodeModel({id: 2001, type: 200}, {connector: connector});
        context = new PageContext({
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
        connector = context.getObject(ConnectorFactory);
        status = {
          context: context,
          nodes: new NodeCollection([node])
        };
      });

      it('disabled when node is not type 258', function () {
        expect(executeSavedQueryCommand.enabled(status)).toBeFalsy();
      });

      it('disabled when node is not openable', function () {
        status.nodes = new NodeCollection(new NodeModel({id: 2001, type: 258, openable: false},
            {connector: connector}));
        expect(executeSavedQueryCommand.enabled(status)).toBeFalsy();
      });

      it('enable when node is type 258 and openable', function () {
        status.nodes = new NodeCollection(new NodeModel({id: 2001, type: 258, openable: true},
            {connector: connector}));
        expect(executeSavedQueryCommand.enabled(status)).toBeTruthy();
      });

      it('Open side panel if "custom_view_search" is available', function (done) {
        status.nodes = new NodeCollection(new NodeModel({
              id: 2001,
              type: 258,
              openable: true,
              custom_view_search: true
            },
            {connector: connector}));
        executeSavedQueryCommand.execute(status).done(function () {
          TestUtils.asyncElement(document.body,
              ".csui-sidepanel.csui-sidepanel-visible").done(function () {
                expect($('.csui-sidepanel.csui-sidepanel-visible').length > 0).toBeTruthy();
                done();
              });
        });
      });
    });

  });

});

