/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/models/command', 'csui/utils/commandhelper',
  'csui/utils/commands/open.document/delegates/open.document.delegates'
], function (_, CommandModel, CommandHelper, openDocumentDelegates) {
  'use strict';

  var OpenDocumentCommand = CommandModel.extend({
    defaults: { signature: 'OpenDocument' },

    enabled: function (status, options) {
      var node = CommandHelper.getJustOneNode(status);
      if (!node) {
        return false;
      }
      var type = node.get('type');
      if (!(type && _.contains(['144', '749', '736'], type.toString()))) {
        return false;
      }
      var fallbackCommand = openDocumentDelegates.last().get('command');
      return fallbackCommand.enabled(status, options);
    },

    execute: function (status, options) {
      var delegatedCommand = chooseDelegatedCommand(status, options);
      return delegatedCommand.execute(status, options);
    }
  });

  function chooseDelegatedCommand (status, options) {
    var node = CommandHelper.getJustOneNode(status);
    return node && openDocumentDelegates.findByNode(node, status, options);
  }

  return OpenDocumentCommand;
});
