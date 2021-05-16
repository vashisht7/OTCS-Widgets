/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/models/command'
], function (CommandModel) {
  'use strict';

  var VersionSettingsCommand = CommandModel.extend({

    defaults: {
      signature: "VersionsControl",
      command_key: ['versionscontrol'],
      scope: "single",
      name: 'VersionsSettings'
    }
  });

  return VersionSettingsCommand;
});
