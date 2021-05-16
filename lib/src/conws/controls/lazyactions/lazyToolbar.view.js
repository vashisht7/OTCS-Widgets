/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',  
  'csui/models/nodes', 'csui/controls/toolbar/toolitems.filtered.model',  
  'csui/utils/commands',   
  'csui/controls/toolbar/delayed.toolbar.view',
  'csui/controls/toolbar/toolbar.command.controller',
  'hbs!conws/controls/lazyactions/impl/lazy.loading.template'
], function (module, _, $, Backbone,   NodeCollection,
  FilteredToolItemsCollection,   commands,
  DelayedToolbarView, ToolbarCommandController, lazyLoadingTemplate) {
    'use strict';

    var LazyToolbarView = DelayedToolbarView.extend({

      constructor: function LazyToolbarView(options) {

        options = options || {};
        var node = options.node;

        if (!options.nodes) {
          var nodes = new NodeCollection(node);
          nodes.connector = node.connector;
          options.nodes = nodes;
        }

        this.connector = options.connector || options.nodes.connector || node.connector;

        if (!options.status) {
          options.status = {
            context: options.context,
            nodes: options.nodes,
            container: options.container,
            originatingView: options.originatingView
          };
        }
        this.status = options.status;

        this.commandController = options.commandController ||
          new ToolbarCommandController({
            commands: options.commands || commands
          });

        if (!options.collection) {

          options.collection = new FilteredToolItemsCollection(
            options.toolbarItems, {
              status: this.status,
              commands: this.commandController.commands,
              delayedActions: node.delayedActions,
              mask: options.toolbarItemsMask
            });
        }
        this.collection = options.collection;

        DelayedToolbarView.prototype.constructor.apply(this, arguments);
        
        this.listenTo(this, 'delayed:toolbar:refresh', this._refreshLazyToolbar);
        this.listenTo(this, 'childview:toolitem:action', this._toolbarItemClicked);
      },
      
      events: {
        'show.binf.dropdown': 'onBeforeShowDropDown'
       },

      onBeforeShowDropDown: function (obj) {
        var selectedNodes;
        var lazyActionsRetrieved, isLocallyCreatedNode;
        var nonPromotedActionCommands = [];

        if (this.lazyActionsRetrieved) {
          return;
        }

        this.$el.find(".csui-more-dropdown-menu").append(lazyLoadingTemplate);

        if (this.status.nodes instanceof NodeCollection) {
          selectedNodes = this.status.nodes;
        } else {
          if (this.status.nodes instanceof Backbone.Collection) {
            selectedNodes = new NodeCollection(this.status.nodes.models);
          } else {
            if (_.isArray(this.status.nodes)) {
              selectedNodes = new NodeCollection(this.status.nodes);
            } else {
              selectedNodes = new NodeCollection();
            }
          }
        }
        if (!selectedNodes.connector) {
          selectedNodes.connector = this.connector;
        }

        selectedNodes.each(function (selectedNode) {
          lazyActionsRetrieved = lazyActionsRetrieved &&
            selectedNode.get('csuiLazyActionsRetrieved');
          isLocallyCreatedNode = isLocallyCreatedNode && selectedNode.isLocallyCreated;
          nonPromotedActionCommands = nonPromotedActionCommands.length ?
            nonPromotedActionCommands :
            selectedNode.nonPromotedActionCommands;
        });

        selectedNodes.nonPromotedActionCommands = nonPromotedActionCommands;
        selectedNodes.lazyActionsRetrieved = lazyActionsRetrieved;

        if (!lazyActionsRetrieved && !isLocallyCreatedNode &&
          nonPromotedActionCommands.length) { 
          selectedNodes.lazyActionsRetrieved = this.lazyActionsRetrieved;
          this._renderLazyActions(selectedNodes);     
        }
        this.lazyActionsRetrieved = true;        
      },

      _onDomRefresh: function(){ 
      },

      _refreshLazyToolbar: function(){
        DelayedToolbarView.prototype._onDomRefresh.call(this);
      },

      _toolbarItemClicked: function (toolItemView, args) {
        this.commandController.toolitemClicked(args.toolItem, this.options);
      },

    })
    return LazyToolbarView;
  });