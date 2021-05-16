/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/models/command'
], function (CommandModel) {
  'use strict';

  var ToggleTableLayoutCommand = CommandModel.extend({
    defaults: {
      signature: "ToggleTableLayout"
    },

    enabled: function (status) {
      return true;
    },
  });

  return ToggleTableLayoutCommand;
});
