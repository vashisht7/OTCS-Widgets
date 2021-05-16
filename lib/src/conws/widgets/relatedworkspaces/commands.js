/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/models/commands',
  'csui/utils/commands',
  'conws/utils/workspaces/close.expanded.view'
], function (
    CommandCollection,
    commands,
    CloseExpandedViewCommand) {
    var relatedWorkspacesCommands = new CommandCollection([
      new CloseExpandedViewCommand()
    ].concat(commands.models));

  return relatedWorkspacesCommands;
});
