/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/utils/commands/open.node.perspective', 'csui/utils/commandhelper'
], function (OpenNodePerspectiveCommand, CommandHelper) {
  'use strict';

  var BrowseCommand = OpenNodePerspectiveCommand.extend({
    defaults: {
      signature: 'Browse',
      command_key: ['default', 'open', 'browse', 'Browse'],
      scope: 'single'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get('container') && (
          node.get('openable')
          || this.checkPermittedActions(node));
    }
  });

  return BrowseCommand;
});
