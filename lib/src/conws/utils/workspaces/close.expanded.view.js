/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/jquery', 'csui/utils/base', 'csui/lib/underscore',
  'csui/utils/commandhelper', 'csui/models/command'
], function (require, $, base, _, CommandHelper, CommandModel) {
  'use strict';
  var CloseExpandedViewCommand = CommandModel.extend({

    defaults: {
      signature: "CloseExpandedView",
      scope: "single"
    },

    enabled: function (status, options) {
      return true;
    },

    execute: function (status, options) {
    }

  });

  return CloseExpandedViewCommand;

});
