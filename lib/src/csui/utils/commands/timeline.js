/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/models/command'
], function (CommandModel) {
  'use strict';

  var TimelineCommand = CommandModel.extend({
    defaults: {
      signature: "Timeline"
    },

    enabled: function (status) {
      if (status) {
        return status.nodes !== undefined;
      } else {
        return false;
      }
    },
  });

  return TimelineCommand;
});
