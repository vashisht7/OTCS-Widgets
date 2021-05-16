/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/models/command'
], function (CommandModel) {
  'use strict';

  var OriginalCommand = CommandModel.extend({
    defaults: {
      signature: "Original"
    },
  });

  return OriginalCommand;
});
