/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette', 'csui/lib/jquery',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/factories/metadata.factory',
  'csui/utils/contexts/perspective/perspective.context.plugin',
  'csui/utils/contexts/factories/node',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/log',
  'csui/models/node/node.model'
], function (module, _, Backbone, Marionette, $, ApplicationScopeModelFactory,
    MetadataModelFactory, PerspectiveContextPlugin, NodeModelFactory, NextNodeModelFactory, log) {
  'use strict';

  log = log(module.id);

  var MetadataPerspectiveContextPlugin = PerspectiveContextPlugin.extend({

    constructor: function MetadataPerspectiveContextPlugin(options) {
      PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);
      this.metadataModel = this.context
          .getModel(MetadataModelFactory, {
            permanent: true,
            detached: true
          })
          .on('change:metadata_info', this._fetchMetadataPerspective, this);

      this.listenTo(this.context, "clear", this._prepareContext);
    },

    _prepareContext: function () {
      if (this.applicationScope.get('id') === 'properties') {

        this.node = this.context.getModel(NodeModelFactory);
        var nodeId = this.metadataModel.get('metadata_info').id;
        this.node.set('id', nodeId);

        var metadata_info = this.metadataModel.get('metadata_info'),
            contextSync = false;

        if (this.containerNode && this.containerNode.get('id')) {
          this._syncContextToNode(this.containerNode);
          contextSync = true;
        }

        if (!metadata_info.navigator) {
          this.node.fetch({
            success: function() {
              if (!contextSync) {
                this._syncContextToNode(this.node);
              }
            }.bind(this),
            error: _.bind(this._errorFetchingNode, this, this.node)
          });
        } else {
          if (!contextSync) {
            this.node.fetch({
              success: _.bind(this._doneFetchingNode, this, this.node),
              error: _.bind(this._errorFetchingNode, this, this.node)
            });
          }
        }

        this.listenTo(this.node, "change:id", this._contextNodeIdChanged);
      }
    },

    _doneFetchingNode: function() {
      var parentNode = this.node.clone();
      this._contextNodeIdChanged();
      parentNode.set('id', this.node.get('parent_id'));
      parentNode.fetch({
        success: _.bind(this._syncContextToNode, this, parentNode),
        error: _.bind(this._errorFetchingNode, this, parentNode)
      });
    },

    _syncContextToNode: function (node) {
      var context = this.context,
          viewStateModel = context.viewStateModel;

      context.triggerMethod('sync:perspective', this.context, node);
      viewStateModel.set(viewStateModel.CONSTANTS.METADATA_CONTAINER, {
        id: node.get('id'),
        name: node.get('name')
      });
    },

    _errorFetchingNode: function (node) {
      log.error('Unable to fetch node {%0}. ', this.node.get('id'));
    },

    _contextNodeIdChanged: function () {
      var metadata_info = _.clone(this.metadataModel.get('metadata_info'));
      metadata_info.id = this.node.get('id');
      metadata_info.model = this.node;
      this.metadataModel.set('metadata_info', metadata_info);
    },

    _fetchMetadataPerspective: function () {
      var metadata_info = this.metadataModel.get('metadata_info');
      var model = metadata_info.model;
      if (this.applicationScope.get('id') === 'properties') {
        if (model) {
          this.node.set( model.attributes);
        } else {
          var node = this.context.getModel(NodeModelFactory);
          node.set('id', metadata_info.id);
          node.fetch({
            success: function () {
              this.node = node.clone();
               metadata_info.model = this.node;
            }.bind(this),
            error: _.bind(this._errorFetchingNode, this, node)
          });
        }
        return;
      }
      this.containerNode = this.context.getFactory(NextNodeModelFactory).property;
      if (this.containerNode && this.containerNode.get('id')) {
        this.containerNode = this.containerNode.clone();
      }

      this.applicationScope.set('id', 'properties');

      var perspectivePath = 'json!csui/utils/contexts/perspective/impl/perspectives/',
          perspectiveName;
      if (metadata_info.navigator) {
        perspectiveName = 'metadata.navigation.json';
      } else {
        perspectiveName = 'metadata.json';
      }

      this.context.loadPerspective(perspectivePath + perspectiveName);
    }

  });

  return MetadataPerspectiveContextPlugin;

});
