/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/commandhelper'
], function (_, $, Backbone, CommandHelper) {
  'use strict';

  function ToolbarCommandController(options) {
    options || (options = {});
    this.commands = options.commands || [];
  }

  _.extend(ToolbarCommandController.prototype, Backbone.Events, {

    toolitemClicked: function (toolItem, executionContext) {
      var signature = toolItem.get("signature");
      var command = this.commands.findWhere({
        signature: signature
      });

      var addableTypeName = toolItem.get("name");
      var addableType = toolItem.get("type");

      var status = executionContext;
      var commandData = toolItem.get('commandData');
      if (commandData) {
        _.extend(executionContext, {data: commandData});
      }

      var eventArgs = {
        status: status,
        commandSignature: signature,
        addableType: addableType,
        addableTypeName: addableTypeName
      };
      this.trigger('before:execute:command', eventArgs);
      Backbone.trigger('closeToggleAction');  // don't copy this to newer code! This is ugly

      var self = this;
      try {

        var executeOptions = {
          context: executionContext.context,
          addableType: addableType,
          addableTypeName: addableTypeName
        };
        var promiseFromCommand = command.execute(status, executeOptions);

        CommandHelper.handleExecutionResults(
            promiseFromCommand, {
              command: command,
              suppressSuccessMessage: status.forwardToTable || status.suppressSuccessMessage,
              suppressFailMessage: status.suppressFailMessage
            }).done(function (nodes) {
          if (nodes && !nodes[0].cancelled) {
            eventArgs.newNodes = nodes;
            self.trigger('after:execute:command', eventArgs);
          }
        });
      }
      catch (e) {
        self.trigger('after:execute:command', eventArgs);
      }

    }
  });

  ToolbarCommandController.extend = Backbone.View.extend;

  return ToolbarCommandController;
});
