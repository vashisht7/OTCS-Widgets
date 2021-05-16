/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'i18n!csui/utils/commands/nls/lang',
  'i18n!csui/utils/commands/nls/localized.strings',
  'csui/utils/commandhelper', 'csui/utils/commands/node',
  "csui/models/command"
], function (publicLang, lang, CommandHelper, NodeCommand, CommandModel) {
  'use strict';

  var UnreserveCommand = NodeCommand.extend({
    defaults: {
      signature: 'UnreserveDoc',
      command_key: ['unreserve', 'UnreserveDoc'],
      name: publicLang.CommandNameUnreserve,
      verb: lang.CommandVerbUnreserve,
      pageLeavingWarning: lang.UnreservePageLeavingWarning,
      scope: 'multiple',
      successMessages: {
        formatForNone: publicLang.UnreserveItemsNoneMessage,
        formatForOne: publicLang.UnreserveOneItemSuccessMessage,
        formatForTwo: publicLang.UnreserveSomeItemsSuccessMessage,
        formatForFive: publicLang.UnreserveManyItemsSuccessMessage
      },
      errorMessages: {
        formatForNone: publicLang.UnreserveItemsNoneMessage,
        formatForOne: publicLang.UnreserveOneItemFailMessage,
        formatForTwo: publicLang.UnreserveSomeItemsFailMessage,
        formatForFive: publicLang.UnreserveManyItemsFailMessage
      }
    },
    enabled: function (status, options) {
      var nodes = CommandHelper.getAtLeastOneNode(status);
      if (nodes && nodes.length) {
        var isOlderVersion = nodes.some(function (node) {
          return node.has('versions') && node.get('versions').current_version === false;
        });
        if (isOlderVersion) {
          return false;
        }
      }
      return CommandModel.prototype.enabled.apply(this, arguments);
    },

    _performAction: function (node, options) {
      node.isUnreservedClicked = true;
      return CommandHelper.updateNode(node, {
        reserved_user_id: null
      });
    }
  });

  return UnreserveCommand;
});
