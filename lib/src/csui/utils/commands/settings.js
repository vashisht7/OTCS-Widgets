/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/models/command'
], function (CommandModel) {
  'use strict';

  var SettingsCommand = CommandModel.extend({
    defaults: {
      signature: "Settings"
    },

    enabled: function (status) {
      return true;
    },
  });

  return SettingsCommand;
});
