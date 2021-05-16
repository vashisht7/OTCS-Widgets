/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/controls/toolbar/toolitems.filtered.model',
  'csui/controls/toolbar/toolbar.view',
  'csui/controls/toolbar/toolbar.command.controller',
  'hbs!xecmpf/controls/headertoolbar/impl/headertoolbar',
  'css!xecmpf/controls/headertoolbar/impl/headertoolbar'
], function (_, $, Backbone, Marionette, FilteredToolItemsCollection, ToolbarView,
    ToolbarCommandController, template) {

  var HeaderToolbarView = Marionette.LayoutView.extend({
    className: 'xecmpf-header-toolbar',

    template: template,

    regions: {
      FilterToolbarRegion: '.filter-toolbar',
      AddToolbarRegion: '.add-toolbar',
      OtherToolbarRegion: '.other-toolbar'
    },

    constructor: function HeaderToolbarView(options) {
      this.commands = options.commands;
      this.commandController = options.commandController ? options.commandController :
                               new ToolbarCommandController({
                                 commands: this.commands
                               });
      this.originatingView = options.originatingView ? options.originatingView : this;

      this.context = options.context;
      this.nodes = options.selectedNodes;
      this.container = options.container;
      this.collection = options.collection;
      this.addableTypes = options.addableTypes;

      this.toolbarNames = ['Filter', 'Add', 'Other'];
      this.toolbarItems = options.toolbarItems || [];

      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    initialize: function (options) {
      var status = {
        context: this.context,
        nodes: this.selectedNodes,
        container: this.container,
        collection: this.collection,
        originatingView: this.originatingView,
        data: {
          addableTypes: this.addableTypes
        }
      };

      _.each(this.toolbarNames, function (toolbarName) {
        var fullToolbarName = toolbarName + 'Toolbar',
            toolItemFactory = this.toolbarItems[fullToolbarName];
        if (toolItemFactory) {
          _.any(toolItemFactory.collection.models, function (model) {
            if (model.attributes.signature === 'disabled') {
              toolItemFactory.collection.remove(model);
              return true;
            }
          });

          var filteredCollection = new FilteredToolItemsCollection(
              toolItemFactory, {
                status: status,
                commands: this.commandController.commands
              });
          var toolbarView = new ToolbarView(_.extend({
            collection: filteredCollection,
            toolbarName: toolbarName,
            originatingView: this.originatingView
          }, toolItemFactory.options));
          this[toolbarName + 'ToolbarView'] = toolbarView;
          this.listenTo(toolbarView, 'childview:toolitem:action',
              this._toolbarItemClicked);
        }
      }, this);

    },

    onRender: function () {
      _.each(this.toolbarNames, function (toolbarName) {
        if (this[toolbarName + 'ToolbarView']) {
          this[toolbarName + 'ToolbarRegion'].show(this[toolbarName + 'ToolbarView']);
        }
      }, this);
    },
    _toolbarItemClicked: function (toolItemView, args) {
      this.options.toolItemView = toolItemView;
      this.commandController.toolitemClicked(args.toolItem, this.options);
    }

  });

  return HeaderToolbarView;

});