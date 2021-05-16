/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone', 'csui/models/command', 'csui/models/node/node.model'
], function (Backbone, CommandModel, NodeModel) {

  describe("CommandModel", function () {
    it('is enabled by default', function () {
      var command = new CommandModel();
      var status = { nodes: new Backbone.Collection() };
      expect(command.enabled(status)).toBeTruthy();
    });

    describe('with the scope "single"', function () {
      beforeAll(function () {
        this.command = new CommandModel({ scope: 'single' });
      });

      it('is disabled with no node', function () {
        var status = { nodes: new Backbone.Collection() };
        expect(this.command.enabled(status)).toBeFalsy();
      });

      it('is enabled with a single node', function () {
        var status = { nodes: new Backbone.Collection([{}]) };
        expect(this.command.enabled(status)).toBeTruthy();
      });

      it('is disabled with two nodes', function () {
        var status = { nodes: new Backbone.Collection([{}, {}]) };
        expect(this.command.enabled(status)).toBeFalsy();
      });
    });

    describe('with the scope "multiple"', function () {
      beforeAll(function () {
        this.command = new CommandModel({ scope: 'multiple' });
      });

      it('is disabled with no node', function () {
        var status = { nodes: new Backbone.Collection() };
        expect(this.command.enabled(status)).toBeFalsy();
      });

      it('is enabled with a single node', function () {
        var status = { nodes: new Backbone.Collection([{}]) };
        expect(this.command.enabled(status)).toBeTruthy();
      });

      it('is enabled with two nodes', function () {
        var status = { nodes: new Backbone.Collection([{}, {}]) };
        expect(this.command.enabled(status)).toBeTruthy();
      });
    });

    describe('with the "openable" attribute', function () {
      beforeAll(function () {
        this.command = new CommandModel({
          openable: true,
          scope: 'multiple'
        });
      });

      it('is disabled with no openable node', function () {
        var status = { nodes: new Backbone.Collection([{}]) };
        expect(this.command.enabled(status)).toBeFalsy();
      });

      it('is enabled with an openable node', function () {
        var status = { nodes: new Backbone.Collection([{ openable: true }]) };
        expect(this.command.enabled(status)).toBeTruthy();
      });

      it('is disabled with some openable and some not openable nodes', function () {
        var status = { nodes: new Backbone.Collection([{ openable: true }, {}]) };
        expect(this.command.enabled(status)).toBeFalsy();
      });

      it('is disabled with all openable nodes', function () {
        var status = { nodes: new Backbone.Collection([{ openable: true }, { openable: true }]) };
        expect(this.command.enabled(status)).toBeTruthy();
      });
    });

    describe('with the "types" attribute', function () {
      beforeAll(function () {
        this.command = new CommandModel({
          types: [1, 2],
          scope: 'multiple'
        });
      });

      it('is disabled with a node of an incompatible type', function () {
        var status = { nodes: new Backbone.Collection([{}]) };
        expect(this.command.enabled(status)).toBeFalsy();
      });

      it('is enabled with a node of a compatible type', function () {
        var status = { nodes: new Backbone.Collection([{ type: 1 }]) };
        expect(this.command.enabled(status)).toBeTruthy();
      });

      it('is disabled with some compatible and some not compatible node types', function () {
        var status = { nodes: new Backbone.Collection([{ type: 1 }, { type: 3 }]) };
        expect(this.command.enabled(status)).toBeFalsy();
      });

      it('is disabled with all compatible node types', function () {
        var status = { nodes: new Backbone.Collection([{ type: 1 }, { type: 2 }]) };
        expect(this.command.enabled(status)).toBeTruthy();
      });
    });

    describe('with the "command_key" attribute', function () {
      beforeAll(function () {
        this.command = new CommandModel({
          command_key: ['default', 'open'],
          scope: 'multiple'
        });
      });

      it('is disabled with a node with no actions permitted', function () {
        var node = new NodeModel({ actions: [] });
        var status = { nodes: new Backbone.Collection([node]) };
        expect(this.command.enabled(status)).toBeFalsy();
      });

      it('is enabled with a node with at least one action permitted', function () {
        var node = new NodeModel({ actions: [{ signature: 'open' }] });
        var status = { nodes: new Backbone.Collection([node]) };
        expect(this.command.enabled(status)).toBeTruthy();
      });

      it('is disabled with an unrecognised permitted action', function () {
        var node = new NodeModel({ actions: [{ signature: 'other' }] });
        var status = { nodes: new Backbone.Collection([node]) };
        expect(this.command.enabled(status)).toBeFalsy();
      });

      it('command\'s own permitted actions are checked by default', function () {
        var node = new NodeModel({ actions: [{ signature: 'open' }] });
        expect(this.command.checkPermittedActions(node)).toBeTruthy();
      });

      it('permitted actions to check can be specified explicitly', function () {
        var node = new NodeModel({ actions: [{ signature: 'other' }] });
        expect(this.command.checkPermittedActions(node)).toBeFalsy();
        expect(this.command.checkPermittedActions(node, ['other'])).toBeTruthy();
      });
    });
  });
});
