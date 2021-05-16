/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/backbone', 'csui/lib/marionette', 'csui/models/node/node.model',
  'csui/models/actions', 'csui/utils/commands/browse', 'csui/models/nodes',
  'csui/utils/contexts/page/page.context', 'csui/behaviors/default.action/default.action.behavior'
], function (require, Backbone, Marionette, NodeModel, ActionCollection, BrowseCommand, NodeCollection, PageContext, DefaultActionBehavior) {
  'use strict';

  var DefaultActionController, CommandController;

  describe('DefaultActionController', function () {
    var defaultActionController, commandController;

    beforeAll(function (done) {
      require([
        'csui/behaviors/default.action/impl/defaultaction',
        'csui/behaviors/default.action/impl/command'
      ], function () {
        DefaultActionController = arguments[0];
        CommandController = arguments[1];
        done();
      });
    });

    beforeEach(function () {
      defaultActionController = new DefaultActionController();
      commandController = new CommandController();
    });

    it('chooses browsing for a container', function () {
      var node   = new NodeModel({
            id: 1,
            type: 0,
            container: true,
            actions: [
              {signature: 'open'}
            ]
          }),
          action = defaultActionController.getAction(node);
      expect(action).toBeDefined();
      expect(action.get('signature')).toBe('Browse');
    });

    it('chooses opening for a document', function () {
      var node   = new NodeModel({
            id: 1,
            type: 144,
            mime_type: 'text/plain',
            actions: [
              {signature: 'download'}
            ]
          }),
          action = defaultActionController.getAction(node);
      expect(action).toBeDefined();
      expect(action.get('signature')).toBe('OpenDocument');
    });

    it('chooses navigating for a URL', function () {
      var node   = new Backbone.Model({
            id: 1,
            type: 140
          }),
          action = defaultActionController.getAction(node);
      expect(action).toBeDefined();
      expect(action.get('signature')).toBe('Navigate');
    });

    describe('with a shortcut', function () {
      beforeAll(function () {
        this.node = new Backbone.Model({
          id: 1,
          type: 1
        });
        this.node.original = new Backbone.Model({
          id: 2,
          type: 0,
          container: true
        });
        this.node.original.actions = new ActionCollection();
      });
      describe('Command Controller execute action', function () {
        var nodeAction, nodeStatus, node;
        beforeAll(function () {
          node = new NodeModel({
            id: 1,
            type: 0,
            container: true,
            actions: [
              {signature: 'open'}
            ]
          });
          nodeStatus = {
            nodes: new NodeCollection([node]),
            context: new PageContext({
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
            })
          };
        });
        it('Execute command Controller', function () {
          nodeAction = defaultActionController.hasAction(node) &&
                       defaultActionController.getAction(node),
              expect(nodeAction).toBeDefined();
          commandController.executeAction(nodeAction, nodeStatus, "");
        });

        it('Test invalid command using commandController', function () {
          nodeAction = new Backbone.Model({
            signature: 'random'
          });
          expect(nodeAction).toBeDefined();
          commandController.executeAction(nodeAction, nodeStatus, "");

        });
      });
      describe('when checking if an action is enabled', function () {
        var checked;

        beforeAll(function () {
          var test = this;
          this.originalBrowserEnabled = BrowseCommand.prototype.enabled;
          BrowseCommand.prototype.enabled = function (status) {
            expect(status).toBeDefined();
            expect(status.nodes.first()).toBe(test.node.original);
            expect(status.shortcut).toBe(test.node);
            checked = true;
            return true;
          };
        });

        afterAll(function () {
          BrowseCommand.prototype.enabled = this.originalBrowserEnabled;
        });

        it('it passes the shortcut with the resolved original node along', function () {
          var action = defaultActionController.getAction(this.node);
          expect(action).toBeDefined();
          expect(action.get('signature')).toBe('Browse');
          expect(checked).toBeTruthy();
        });
      });

      describe('when executing an action', function () {
        var executed,view, defaultView;

        beforeAll(function () {
          var test = this;
          this.originalExecuteAction = CommandController.prototype.executeAction;
          CommandController.prototype.executeAction = function (action, status, options) {
            expect(action).toBeDefined();
            expect(action.get('signature')).toBe('Browse');
            expect(status).toBeDefined();
            expect(status.nodes.first()).toBe(test.node.original);
            expect(status.shortcut).toBe(test.node);
            executed = true;
          };
          view = Marionette.View.extend({
            behaviors: {
              DefaultAction: {
                behaviorClass: DefaultActionBehavior
              }
            }
          });
        });

        afterAll(function () {
          CommandController.prototype.executeAction = this.originalExecuteAction;
          defaultView.destroy();
        });

        it('it passes the shortcut with the resolved original node along', function () {
          defaultActionController.executeAction(this.node);
          expect(executed).toBeTruthy();
        });

        it('Execute default action for node', function() {
          executed = false;
          defaultView =  new view();
          defaultView.triggerMethod('execute:defaultAction', this.node);
          expect(executed).toBeTruthy();
        });
      });

    });
  });
});
