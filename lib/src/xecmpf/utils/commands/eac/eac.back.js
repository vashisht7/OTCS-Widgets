/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["require", 'csui/lib/jquery', 'csui/utils/base', 'csui/lib/underscore',
  "i18n!csui/utils/commands/nls/localized.strings",
  "csui/utils/commandhelper", "csui/utils/commands/node",
  'csui/utils/command.error'
], function (require, $, base, _, lang, CommandHelper, NodeCommand, CommandError) {
  'use strict';

  var EACBackCommand = NodeCommand.extend({

    defaults: {
      signature: "EACBack",
      command_key: ['EACBack'],
    },

    enabled: function (status, options) {
      return true;
    },

    execute: function (status, options) {
    }
  });

  return EACBackCommand;

});
