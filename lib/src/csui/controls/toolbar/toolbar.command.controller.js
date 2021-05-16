/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/log', 'csui/utils/commandhelper', 'csui/utils/commands'
], function (module, _, Backbone, log, CommandHelper, commands) {
  'use strict';

  log = log(module.id);

  function ToolbarCommandController(options) {
    options || (options = {});
    this.commands = options.commands || commands;
    this.nameAttribute = options.nameAttribute;
  }

  _.extend(ToolbarCommandController.prototype, Backbone.Events, {
    toolitemClicked: function (toolItem, status) {
      var signature = toolItem.get("signature");
      var command = this.commands.get(signature);

      var addableTypeName = toolItem.get("name");
      var addableType = toolItem.get("type");
      var data = _.extend({}, status.data, toolItem.get('commandData'));
      status = _.defaults({
        toolItem: toolItem,
        data: data
      }, status);
      var eventArgs = {
        status: status,
        commandSignature: signature,
        addableType: addableType,
        addableTypeName: addableTypeName,
        command: command
      };

      if (toolItem.get('execute') === false || !command.execute) {
        eventArgs.execute = false;
        eventArgs.toolItem = toolItem;
        this.trigger('before:execute:command', eventArgs);
        this.trigger('click:toolitem:action', eventArgs);
        return this.trigger('after:execute:command', eventArgs);
      }

      this.trigger('before:execute:command', eventArgs);
      Backbone.trigger('closeToggleAction');

      var self = this;
      self.commandSignature = signature;

      var executeOptions = {
        context: status.context,
        addableType: addableType,
        addableTypeName: addableTypeName,
        nameAttribute: self.nameAttribute
      };

      var promiseFromCommand;
      try {
        if (!command) {
          throw new Error('Command "' + signature + '" not found.');
        }
        promiseFromCommand = command.execute(status, executeOptions);
      } catch (error) {
        log.warn('Executing the command "{0}" failed.\n{1}',
            command.get('signature'), error.message) && console.warn(log.last);
        eventArgs.error = error;
        return this.trigger('after:execute:command', eventArgs);
      }
      if (!promiseFromCommand) {
        return this.trigger('after:execute:command', eventArgs);
      }
      return CommandHelper
          .handleExecutionResults(promiseFromCommand, {
            command: command,
            suppressSuccessMessage: status.forwardToTable || status.suppressSuccessMessage,
            suppressFailMessage: status.suppressFailMessage
          })
          .done(function (nodes) {
            if (nodes && !nodes[0].cancelled) {
              eventArgs.newNodes = nodes;
              self.trigger('after:execute:command', eventArgs);
            }
          })
          .fail(function (error) {
            if (error === undefined) {
              error = {
                cancelled: true,
                command: command,
                status: status,
                commandSignature: self.commandSignature
              };
            }
            self.trigger('after:execute:command', error);
          });
    }
  });

  ToolbarCommandController.extend = Backbone.View.extend;

  return ToolbarCommandController;
});
