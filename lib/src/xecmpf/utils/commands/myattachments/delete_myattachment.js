/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/models/command',
  'csui/utils/commandhelper'
], function (CommandModel, CommandHelper) {
  'use strict';
  
  var DeleteAttachmentCommand = CommandModel.extend({

    defaults: {
      signature: 'delete_business_attachment',
      command_key: ['delete_business_attachment'],
      name: 'Delete Business Attachment',
      scope: 'single'
    },

    enabled: function(status) {
      return true;
    },

    execute: function (status, options) {
      throw new Error('Not implemented');
    }

  });

  return DeleteAttachmentCommand;

});
