/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/behaviors/default.action/impl/command',
  'csui/models/nodes', 'csui/utils/defaultactionitems', 'csui/utils/log'
], function (module, _, CommandController, NodeCollection, defaultActionItems, log) {
  'use strict';

  log = log(module.id);

  var DefaultActionController = CommandController.extend({

    constructor: function DefaultActionController(options) {
      CommandController.prototype.constructor.apply(this, arguments);
      options || (options = {});
      this.actionItems = options.actionItems || defaultActionItems;
    },

    executeAction: function (node, options) {
      var shortcut, fakedActions;
      if (node.original && node.original.get('id') > 0) {
        shortcut = node;
        fakedActions = this._fakeActions(node.original);
        if (node.get('type') === 1) {
          node = node.original;
        }
      }
      var action = this.getAction(node),
          status = {
            nodes: new NodeCollection([node]),
            shortcut: shortcut
          };
      if (fakedActions) {
        this._resetFakedActions(node);
      }
      return action && CommandController.prototype.executeAction.call(
              this, action, status, options);
    },

    getAction: function (node) {
      var type = node.get('type'),
          shortcut, fakedActions;
      if ((type === 1 || ((!window.csui || !window.csui.mobile) && type === 2))
          && node.original && node.original.get('id') > 0) {
        shortcut = node;
        node = node.original;
        fakedActions = this._fakeActions(node);
      }
      var status = {
            nodes: new NodeCollection([node]),
            shortcut: shortcut
          },
          enabled = false,
          action = this.actionItems.find(function (actionItem) {
            if (actionItem.enabled(node)) {
              var command = this.commands.findWhere({
                signature: actionItem.get("signature")
              });
              try {
                enabled = command && command.enabled(status);
              } catch (error) {
                log.warn('Evaluating the command "{0}" failed.\n{1}',
                    command.get('signature'), error.message) && console.warn(log.last);
              }
              return true;
            }
          }, this);
      if (fakedActions) {
        this._resetFakedActions(node);
      }
      return enabled && action;
    },

    hasAction: function (node) {
      return !!this.getAction(node);
    },

    _fakeActions: function (node) {
      if (!node.actions.length) {
        var actions = _.map(
            this.actionItems.getAllCommandSignatures(this.commands),
            function (signature) {
              return {signature: signature};
            });
        node.actions.reset(actions, {silent: true});
        return true;
      }
    },

    _resetFakedActions: function (node) {
      node.actions.reset([], {silent: true});
    }

  });

  DefaultActionController.version = "1.0";

  return DefaultActionController;

});
