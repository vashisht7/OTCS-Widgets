/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone', 'csui/models/node/node.model',
  'csui/utils/commands/open.document/open.document'
], function (Backbone, NodeModel, OpenDocumentCommand) {
  'use strict';

  describe('OpenDocumentCommand', function () {
    beforeAll(function () {
      this.command = new OpenDocumentCommand();
    });

    it('is enabled for openable documents', function () {
      var node = new NodeModel({
        id: 1,
        type: 144,
        mime_type: 'text/plain',
        openable: true
      });
      var status = { nodes: new Backbone.Collection([node]) };
      expect(this.command.enabled(status)).toBeTruthy();
    });
    xit('is disabled for documents which are not openable', function () {
      var node = new NodeModel({
        id: 1,
        type: 144,
        mime_type: 'text/plain'
      });
      var status = { nodes: new Backbone.Collection([node]) };
      expect(this.command.enabled(status)).toBeFalsy();
    });

    it('is disabled for other object types than documents', function () {
      var node = new NodeModel({ id: 1, container: true });
      var status = { nodes: new Backbone.Collection([node]) };
      expect(this.command.enabled(status)).toBeFalsy();
    });
  });
});
