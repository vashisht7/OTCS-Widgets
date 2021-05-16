/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/models/command'
], function (CommandModel) {
  'use strict';

  var RenameCommand = CommandModel.extend({
    defaults: {
      signature: 'Rename',
      command_key: ['rename', 'Rename'],
      scope: "single"
    },
    rename: function (node, name) {
      return node
          .save({name: name}, {
            wait: true,
            patch: true
          });
    },
  });

  return RenameCommand;
});
