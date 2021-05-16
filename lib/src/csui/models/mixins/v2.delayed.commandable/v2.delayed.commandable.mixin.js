/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/models/node.actions',
  'csui/models/mixins/v2.commandable/v2.commandable.mixin', 'csui/utils/promoted.actionitems',
  'csui/utils/deepClone/deepClone'
], function (_, $, Backbone, NodeActionCollection, CommandableV2Mixin, promotedActionItems) {
  'use strict';

  var DelayedCommandableV2Mixin = {
    mixin: function (prototype) {
      CommandableV2Mixin.mixin(prototype);

      var originalPrepareModel = prototype._prepareModel;

      return _.extend(prototype, {
        makeDelayedCommandableV2: function (options) {
          options || (options = {});
          var defaultActionCommands = options.defaultActionCommands;
          var promotedActionCommands = options.promotedActionCommands ||
                                       promotedActionItems.getPromotedCommandsSignatures();
          var nonPromotedActionCommands = options.nonPromotedActionCommands || [];
          if (typeof defaultActionCommands === 'string') {
            defaultActionCommands = defaultActionCommands.split(',');
          }
          this.defaultActionCommands = defaultActionCommands || [];
          this.promotedActionCommands = promotedActionCommands;
          this.nonPromotedActionCommands = nonPromotedActionCommands || [];
          this.delayedActions = new NodeActionCollection(undefined, {
            connector: options.connector
          });

          this.nonPromotedActions = new NodeActionCollection(undefined, {
            isNonPromoted: true,
            connector: options.connector
          });

          this.additionalActions = new NodeActionCollection(undefined, {
            isNonPromoted: true,
            connector: options.connector
          });

          this.setEnabledDelayRestCommands(options.delayRestCommands,
              options.promoteSomeRestCommands);

          this.delayRestCommandsForModels = options.delayRestCommandsForModels;

          this.promotedActionItemsFromControler = promotedActionItems;

          return this.makeCommandableV2(options);
        },

        setEnabledDelayRestCommands: function (enable, promoted) {
          if (enable) {
            this._enableDelayRestCommands();
          } else {
            this._disableDelayRestCommands();
          }
          this.promoteSomeRestCommands = promoted !== false;
        },

        setEnabledLazyActionCommands: function (enable) {
          var deferred = $.Deferred();
          if (enable) {
            this._enableNonPromotedRestCommands();
            this._requestsNonPromotedRestActions()
                .done(function (node) {
                  deferred.resolve(node);
                })
                .fail(function (error) {
                  deferred.reject(error);
                });
          } else {
            this._disableNonPromotedRestCommands();
          }
          return deferred.promise();
        },
        getAdditionalActionCommands: function (signatures, retrievedFlagOnNode) {
          var deferred = $.Deferred();
          this._requestAdditionalActions(signatures, retrievedFlagOnNode)
              .done(_.bind(function (node) {
                deferred.resolve(node);
              }, this))
              .fail(function (error) {
                deferred.reject(error);
              });
          return deferred.promise();
        },

        _enableDelayRestCommands: function () {
          if (!this.delayRestCommands) {
            this.delayRestCommands = true;
            this.on('sync', this._requestRestActions, this);
          }
        },

        _disableDelayRestCommands: function () {
          if (this.delayRestCommands) {
            this.delayRestCommands = false;
            this.off('sync', this._requestRestActions, this);
          }
        },

        _enableNonPromotedRestCommands: function () {
          if (!this.enableNonPromotedCommands) {
            this.enableNonPromotedCommands = true;
            this.on('sync', this._requestsNonPromotedRestActions, this);
          }
        },

        _disableNonPromotedRestCommands: function () {
          this.enableNonPromotedCommands = false;
          this.off('sync', this._requestsNonPromotedRestActions, this);
        },

        _requestRestActions: function (model, resp, options) {
          if (model !== this || this instanceof Backbone.Collection && !this.length) {
            return;
          }
          if (options.xhr &&
              (options.xhr.settings.type !== 'GET' && options.xhr.settings.type !== 'POST')) {
            return;
          }
          if (this.promoteSomeRestCommands) {
            this._requestPromotedActions(model, resp, options);
          } else {
            this._requestDelayedActions(model, resp, options);
          }
        },

        _requestDelayedActions: function () {
          var defaultActionCommands = this.defaultActionCommands;
          var restCommands = _.reject(this.commands, function (command) {
            return _.contains(defaultActionCommands, command);
          });
          if (restCommands.length) {
            var delayedActions = this.delayedActions;
            delayedActions.resetCommands();
            delayedActions.setCommands(restCommands);
            delayedActions.resetNodes();
            if (this instanceof Backbone.Collection) {
              delayedActions.setNodes(this.pluck('id'));
            } else {
              delayedActions.setNodes([this.get('id')]);
            }
            if (!delayedActions.connector) {
              this.connector.assignTo(delayedActions);
            }
            delayedActions.parent_id = !!this.node ? this.node.get("id") : this.get("id");
            delayedActions
                .once('sync', _.bind(this._updateOriginalActions, this))
                .fetch({reset: true});
          }
        },

        _requestPromotedActions: function (model) {
          var defaultActionCommands  = this.defaultActionCommands,
              promotedActionCommands = this.promotedActionCommands;
          var restCommands        = _.reject(this.commands, function (command) {
                return _.contains(defaultActionCommands, command);
              }),
              promotedCommands    = [],
              nonPromotedCommands = [];
          _.each(restCommands, function (command) {
            if (_.contains(promotedActionCommands, command)) { //CurrentPromotedActions
              promotedCommands.push(command); // Delay Commands
            }
            else {
              nonPromotedCommands.push(command); // nonpromoted Commands
            }
          });

          this.promotedActionCommands = promotedCommands;
          this.nonPromotedActionCommands = nonPromotedCommands;
          if (promotedCommands.length) {
            var delayedActions = this.delayedActions;
            delayedActions.resetCommands();
            delayedActions.setCommands(promotedCommands);
            delayedActions.resetNodes();
            if (this instanceof Backbone.Collection) {
              var restNodes = [];
              this.each(function (model) {
                model.nonPromotedActionCommands = nonPromotedCommands;
                model.promotedActionCommands = promotedCommands;
                if (!model.get('csuiDelayedActionsRetrieved')) {
                  restNodes.push(model.get('id'));
                }
              });
              delayedActions.setNodes(restNodes);
            } else {
              model.nonPromotedActionCommands = nonPromotedCommands;
              model.promotedActionCommands = promotedCommands;
              delayedActions.setNodes([this.get('id')]);
            }
            delayedActions.parent_id = !!this.node ? this.node.get("id") : this.get("id");
            if (delayedActions.nodes.length > 0) {
              if (!delayedActions.connector) {
                this.connector.assignTo(delayedActions);
              }
              delayedActions
                  .fetch({
                    reset: true,
                    success: _.bind(this._updateOriginalActions, this)
                  });
            }
          } else {
            if (this instanceof Backbone.Collection) {
              this.each(function (model) {
                model.nonPromotedActionCommands = nonPromotedCommands;
                model.promotedActionCommands = promotedCommands;
              });
            } else {
              model.nonPromotedActionCommands = nonPromotedCommands;
              model.promotedActionCommands = promotedCommands;
            }
          }
        },

        _requestsNonPromotedRestActions: function () {
          var deferred = $.Deferred();
          var nonPromotedActions        = this.nonPromotedActions,
              nonPromotedActionCommands = this.nonPromotedActionCommands.length ?
                                          this.nonPromotedActionCommands :
                                          this.collection.nonPromotedActionCommands;
          nonPromotedActions.resetCommands();
          nonPromotedActions.setCommands(nonPromotedActionCommands);
          nonPromotedActions.resetNodes();
          if (this instanceof Backbone.Collection) {
            var restNodes = [];
            this.each(function (model) {
              if (!model.get('csuiLazyActionsRetrieved') && !model.isLocallyCreated) {
                restNodes.push(model.get('id'));
              }
            });
            nonPromotedActions.parent_id = this.length && this.models[0].get("reference_id");
            nonPromotedActions.setNodes(restNodes);
          } else {
            nonPromotedActions.setNodes([this.get('id')]);
            nonPromotedActions.parent_id = this.get("reference_id");
          }

          if (!nonPromotedActions.connector) {
            this.connector.assignTo(nonPromotedActions);
          }
          if (nonPromotedActions.commands.length && nonPromotedActions.nodes.length) {
            nonPromotedActions
                .fetch({
                  reset: true,
                  success: _.bind(function () {
                    this._updateOriginalActionsAfterLazyActions();
                    deferred.resolve(this);
                  }, this),
                  error: _.bind(function (error) {
                    this.attributes.csuiLazyActionsRetrieved = false;
                    deferred.reject(error);
                  }, this)
                });
          } else {
            if (this instanceof Backbone.Collection) {
              this.each(function (model) {
                model.set('csuiLazyActionsRetrieved', true);
              });
            } else {
              this.set('csuiLazyActionsRetrieved', true);
            }
            deferred.resolve(this);
          }
          return deferred.promise();
        },

        _requestAdditionalActions: function (signatures, retrievedFlagOnNode) {
          var deferred = $.Deferred();
          var additionalActions = this.additionalActions;
          additionalActions.resetCommands();
          additionalActions.setCommands(signatures);
          additionalActions.resetNodes();
          if (this instanceof Backbone.Collection) {
            var restNodes = [];
            this.each(function (model) {
              if (!model.get(retrievedFlagOnNode) && !model.isLocallyCreated) {
                restNodes.push(model.get('id'));
              }
            });
            additionalActions.parent_id = this.length && this.models[0].get("reference_id");
            additionalActions.setNodes(restNodes);
          } else {
            additionalActions.setNodes([this.get('id')]);
            additionalActions.parent_id = this.get("reference_id");
          }

          if (!additionalActions.connector) {
            this.connector.assignTo(additionalActions);
          }
          if (additionalActions.commands.length && additionalActions.nodes.length) {
            additionalActions
                .fetch({
                  reset: true,
                  success: _.bind(function () {
                    this._updateOriginalActionsAfterAdditionalActions(retrievedFlagOnNode);
                    deferred.resolve(this);
                  }, this),
                  error: _.bind(function (error) {
                    this.attributes[retrievedFlagOnNode] = false;
                    deferred.reject(error);
                  }, this)
                });
          } else {
            if (this instanceof Backbone.Collection) {
              this.each(function (model) {
                model.set(retrievedFlagOnNode, true);
              });
            } else {
              this.set(retrievedFlagOnNode, true);
            }
            deferred.resolve(this);
          }
          return deferred.promise();
        },

        _updateOriginalActions: function () {
          var delayedActions = this.delayedActions;

          function updateNodeActions(node) {
            var actionNode = delayedActions.get(node.get('id'));
            if (actionNode) {
              node.actions.add(actionNode.actions.models);
              node.set('csuiDelayedActionsRetrieved', true);
            }
          }

          if (this instanceof Backbone.Collection) {
            this.each(updateNodeActions);
          } else {
            updateNodeActions(this);
          }
        },

        _updateOriginalActionsAfterLazyActions: function () {
          var nonPromotedActions = this.nonPromotedActions,
              updateNodeActions  = function (node) {
                node.attributes.csuiLazyActionsRetrieved = true;
                var actionNode = nonPromotedActions.get(node.get('id'));
                if (actionNode) {
                  _.each(actionNode.actions.models, function (action) {
                    action.attributes.csuiNonPromotedAction = true;
                  });
                  node.actions.add(actionNode.actions.models);
                }
              };

          if (this instanceof Backbone.Collection) {
            this.each(updateNodeActions);
          } else {
            updateNodeActions(this);
          }
        },

        _updateOriginalActionsAfterAdditionalActions: function (retrievedFlagOnNode) {
          var additionalActions = this.additionalActions,
              updateNodeActions = function (node) {
                node.attributes[retrievedFlagOnNode] = true;
                var actionNode = additionalActions.get(node.get('id'));
                if (actionNode) {
                  _.each(actionNode.actions.models, function (action) {
                    action.attributes.csuiNonPromotedAction = true;
                  });
                  node.actions.add(actionNode.actions.models);
                }
              };

          if (this instanceof Backbone.Collection) {
            this.each(updateNodeActions);
          } else {
            updateNodeActions(this);
          }
        },

        setDefaultActionCommands: function (name) {
          if (!_.isArray(name)) {
            name = name.split(',');
          }
          _.each(name, function (name) {
            if (!_.contains(this.defaultActionCommands, name)) {
              this.defaultActionCommands.push(name);
            }
          }, this);
        },

        resetDefaultActionCommands: function (name) {
          if (name) {
            if (!_.isArray(name)) {
              name = name.split(',');
            }
            _.each(name, function (name) {
              var index = _.indexOf(this.defaultActionCommands, name);
              if (index >= 0) {
                this.defaultActionCommands.splice(index, 1);
              }
            }, this);
          } else {
            this.defaultActionCommands.splice(0, this.defaultActionCommands.length);
          }
        },

        getRequestedCommandsUrlQuery: function () {
          var commands = this.delayRestCommands ?
                         this.defaultActionCommands : this.commands;
          return commands.length && {actions: commands};
        },

        getAllCommandsUrlQuery: function () {
          var commands = this.commands;
          return commands.length && {actions: commands};
        },
        _prepareModel: function (attrs, options) {
          var delayRestCommands, delayRestCommandsForModels,
              promoteSomeRestCommands;
          options || (options = {});
          delayRestCommands = options.delayRestCommands;
          delayRestCommandsForModels = options.delayRestCommandsForModels;
          promoteSomeRestCommands = options.promoteSomeRestCommands;
          if (this.delayedActions) {
            if (delayRestCommands === undefined) {
              delayRestCommands = this.delayRestCommands;
            }
            if (delayRestCommandsForModels === undefined) {
              delayRestCommandsForModels = this.delayRestCommandsForModels;
            }
            if (promoteSomeRestCommands === undefined) {
              promoteSomeRestCommands = this.promoteSomeRestCommands;
            }
          }
          options.delayRestCommands = delayRestCommandsForModels;
          options.delayRestCommandsForModels = false;
          options.promoteSomeRestCommands = promoteSomeRestCommands;
          var model = originalPrepareModel.call(this, attrs, options);
          options.delayRestCommands = delayRestCommands;
          options.delayRestCommandsForModels = delayRestCommandsForModels;
          return model;
        }
      });
    }
  };

  return DelayedCommandableV2Mixin;
});
