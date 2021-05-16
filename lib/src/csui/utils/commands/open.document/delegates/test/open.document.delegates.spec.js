/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone', 'csui/models/node/node.model',
  'csui/utils/commands/open.document/delegates/open.document.delegates'
], function (Backbone, NodeModel, openDocumentDelegates) {
  'use strict';

  describe('openDocumentDelegates', function () {
    it('include the document perspective navigation as the last (fallback) command', function () {
      var lastRule = openDocumentDelegates.last();
      expect(lastRule).toBeDefined();
      var command = lastRule.get('command');
      expect(command.get('signature')).toEqual('OpenSpecificNodePerspective');
    });

    function checkOpenDocumentSelection (signature) {
      it('the command "' + signature + '" is selected by default', function () {
        var status = { nodes: new Backbone.Collection([this.node]) };
        var command = openDocumentDelegates.findByNode(this.node, status);
        expect(command.get('signature')).toEqual(signature);
      });
    }

    describe('given a document with the openable flag set', function () {
      beforeEach(function () {
        this.node = new NodeModel({
          id: 1,
          type: 144,
          mime_type: 'text/plain',
          openable: true
        });
      });
  
      checkOpenDocumentSelection('Open');
    });

    describe('given a document with the download action permitted', function () {
      beforeEach(function () {
        this.node = new NodeModel({
          id: 1,
          type: 144,
          mime_type: 'text/plain',
          actions: [{ signature: 'download' }]
        });
      });
  
      checkOpenDocumentSelection('Open');
    });
    xdescribe('given a document without permissions', function () {
      beforeEach(function () {
        this.node = new NodeModel({
          id: 1,
          type: 144,
          mime_type: 'text/plain'
        });
      });
  
      checkOpenDocumentSelection('OpenSpecificNodePerspective');
    });
  });
});
