/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/commandhelper'
], function (_, Backbone, CommandHelper) {

  var CommandModel = Backbone.Model.extend({
    idAttribute: 'signature',

    constructor: function CommandModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },

    enabled: function (status, options) {
      var scope = this.get('scope');
      var nodes = this._getNodesByScope(status, scope);
      if (scope && !(nodes && nodes.length)) {
        return false;
      }

      var types = this.get('types') || [];
      if (types.length && !this.checkTypes(nodes, types)) {
        return false;
      }

      var openable = this.get('openable');
      if (openable && this.checkOpenability(nodes)) {
        return true;
      }

      var signatures = this.get('command_key') || [];
      if (openable && !signatures.length) {
        return false;
      }
      return !signatures.length || this.checkPermittedActions(nodes, signatures);
    },

    isNonPromoted: function (status) {
      var scope         = this.get("scope"),
          nodes         = this._getNodesByScope(status, scope),
          signatures    = this.get("command_key"),
          isNonPromoted = false;
      if (nodes && nodes.length) {
        var checkFn = this._getNonPromotedCheckFunctionsForSignatures(signatures);
        if (checkFn) {
          _.find(nodes, function (node) {
            var action = checkFn(node);
            if (action && action.get('csuiNonPromotedAction') === true) {
              isNonPromoted = true;
              return true;
            }
          });
        }
      }
      return isNonPromoted;
    },

    _getNodesByScope: function (status, scope) {
      var nodes;
      switch (scope) {
      case "single":
        nodes = CommandHelper.getJustOneNode(status);
        nodes && (nodes = [nodes]);
        break;
      default: // without a specific scope, use case "multiple"
        nodes = CommandHelper.getAtLeastOneNode(status).models;
        break;
      }
      return nodes;
    },

    _getCheckFunctionsForSignatures: function (signatures) {
      if (signatures && signatures.length) {
        if (_.isArray(signatures)) {
          return function (node) {
            return _.any(signatures, function (signature) {
              return node.actions && node.actions.findRecursively(signature);
            });
          };
        }
        return function (node) {
          return node.actions && node.actions.findRecursively(signatures);
        };  
      }
    },

    _getNonPromotedCheckFunctionsForSignatures: function (signatures) {
      var checkFn;
      if (signatures) {
        if (_.isArray(signatures) && signatures.length) {
          checkFn = function (node) {
            var action;
            _.find(signatures, function (signature) {
              action = node.actions && node.actions.findRecursively(signature);
              return !!action;
            });
            return action;
          };
        } else if (_.isString(signatures)) {
          checkFn = function (node) {
            return node.actions && node.actions.findRecursively(signatures);
          };
        }
      }
      return checkFn;
    },

    checkTypes: function (nodes, types) {
      if (nodes) {
        if (!_.isArray(nodes)) {
          nodes = [nodes];
        }
        if (nodes.length) {
          return nodes.every(function (node) {
            return types.indexOf(node.get('type')) >= 0;
          });
        }
      }
      return false;
    },

    checkOpenability: function (nodes) {
      if (nodes) {
        if (!_.isArray(nodes)) {
          nodes = [nodes];
        }
        if (nodes.length) {
          return nodes.every(function (node) {
            return node.get('openable');
          });
        }
      }
      return false;
    },

    checkPermittedActions: function (nodes, signatures) {
      if (nodes) {
        if (!_.isArray(nodes)) {
          nodes = [nodes];
        }
        if (nodes.length) {
          if (!signatures) {
            signatures = this.get('command_key') || [];
          }
          var checkNode = this._getCheckFunctionsForSignatures(signatures);
          return !checkNode || _.all(nodes, checkNode);
        }
      }
      return false;
    },

    _getNodeActionForSignature: function (node, signatures) {
      var action;
      if (node) {
        var checkNode = this._getCheckFunctionsForSignatures(signatures);
        if (!!checkNode) {
          action = checkNode.call(this, node);
        }
      }
      return action;
    }
  });

  return CommandModel;
});
