/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/node',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/contexts/factories/previous.node',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/perspective/perspective.context.plugin',
  'csui/utils/contexts/perspective/node.perspectives',
  'csui/utils/classic.nodes/classic.nodes',
  'csui/utils/contexts/impl/delayed.actions.for.node',
  'csui/utils/contexts/perspective/plugins/node/node.extra.data',
  'csui/models/perspective/personalization.model'
], function (module, _, Backbone, NodeModelFactory, NextNodeModelFactory,
    PreviousNodeModelFactory, ApplicationScopeModelFactory,
    PerspectiveContextPlugin, nodePerspectives, classicNodes,
    delayedActions, nodeExtraData, PersonalizationModel) {
  'use strict';

  var config = module.config();
  var sendOriginParams  = config.sendOriginParams;

  var nodeOptions = {
    fields: nodeExtraData.getModelFields(),
    expand: nodeExtraData.getModelExpand(),
    includeResources: ['metadata', 'perspective']
  };

  var NodePerspectiveContextPlugin = PerspectiveContextPlugin.extend({
    constructor: function NodePerspectiveContextPlugin(options) {
      PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context
          .getModel(ApplicationScopeModelFactory);

      this.nextNodeFactory = this.context.getFactory(NextNodeModelFactory, {
        options: nodeOptions,
        permanent: true,
        detached: true
      });
      this.nextNode = this.nextNodeFactory.property;
      delayedActions.relayActionEvents(this);
      this.nextNode.on('change:id', this._fetchNodePerspective, this);
      this.previousNode = this.context
          .getModel(PreviousNodeModelFactory, {
            permanent: true,
            detached: true
          });
      createNodeModel.call(this);
    },

    onClear: function () {
      this._clearModels(true);
    },

    onRefresh: function () {
      this._clearModels(false);
    },

    isFetchable: function (factory) {
      return factory.property !== this.node;
    },

    _clearModels: function (recreateNode) {
      if (this.applicationScope.id !== 'node') {
        clearCurrentNode.call(this);
        return this.nextNode.clear({silent: true});
      }

      clearCurrentNode.call(this);
      var delayChangeEvents = !recreateNode && (
          this.context.hasCollection('children') ||
          this.context.hasCollection('children2'));
      this.node.set(this.nextNode.attributes, {silent: delayChangeEvents});

      if (delayChangeEvents) {
        var children = this.context.hasCollection('children') &&
                       this.context.getCollection('children') ||
                       this.context.hasCollection('children2') &&
                       this.context.getCollection('children2');
        children.once('reset update', function () {
          this.node.triggerAllChanges();
          delayedActions.updateNodeActions(this);
          delayedActions.resumeRelayingActionEvents(this);
        }, this);
      } else {
        delayedActions.updateNodeActions(this);
        delayedActions.resumeRelayingActionEvents(this);
      }

      function clearCurrentNode() {
        this.previousNode.clear({silent: true});
        this.previousNode.set(this.node.attributes, {silent: true});
        if (recreateNode) {
          createNodeModel.call(this);
        } else {
          this.node.clear({silent: true});
        }
      }
    },

    _fetchNodePerspective: function () {
      Backbone.trigger('closeToggleAction');
      var nextNodeId = this.nextNode.get('id');
      if (nextNodeId == null || nextNodeId <= 0) {
        return;
      }
      this.context.triggerMethod('request:perspective', this);
      this.applicationScope.set('id', 'node');
      delayedActions.suppressRelayingActionEvents(this);
      var options = {
        success: _.bind(this._onNodeFetchSuccess, this, this.nextNode),
        error: _.bind(this.context.rejectPerspective, this.context)
      };
      if (sendOriginParams) {
        options.headers = { 'X-OriginParams': location.search };
      }
      this.nextNodeFactory.fetch(options);
    },

    _onNodeFetchSuccess: function (node) {
      var that = this;
      PersonalizationModel.loadPersonalization(node, this.context)
          .then(
              _.bind(this._changePerspective, this, node),
              _.bind(this.context.rejectPerspective, this.context));
    },

    _changePerspective: function (sourceModel, personalization) {
      var classicUrl = classicNodes.getUrl(sourceModel);
      if (classicUrl) {
        window.location.replace(classicUrl);
        return;
      }

      var perspectiveModule,
          perspective = nodePerspectives.findByNode(sourceModel);
      if ((_.isEmpty(sourceModel.get('perspective')) && _.isEmpty(personalization)) ||
          !sourceModel.get('container') ||
          perspective.get('important')) {
        perspectiveModule = perspective.get('module');
      }
      if (perspective) {
        sourceModel.set({"persist": perspective.get("persist")}, {silent: true});
      }
      if (perspectiveModule) {
        return this.context.overridePerspective(sourceModel, perspectiveModule);
      }

      this.context.applyPerspective(sourceModel, false, personalization);
    }
  });

  function createNodeModel() {
    this.node = this.context
        .getModel(NodeModelFactory, {
          options: nodeOptions
        });
  }

  return NodePerspectiveContextPlugin;
});
