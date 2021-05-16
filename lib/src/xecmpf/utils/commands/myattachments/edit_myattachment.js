/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/models/command',
  'csui/utils/commandhelper'
], function (CommandModel, CommandHelper) {
  'use strict';
  
  var EditAttachmentCommand = CommandModel.extend({

    defaults: {
      signature: 'edit_business_attachment',
      command_key: ['edit_business_attachment'],
      name: 'Edit Business Attachment',
      scope: 'single'
    },

    enabled: function(status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get('perm_modify') !== false;
    },
    
    execute: function (status, options) {
      throw new Error('Not implemented');
    }

  });

  return EditAttachmentCommand;

});
