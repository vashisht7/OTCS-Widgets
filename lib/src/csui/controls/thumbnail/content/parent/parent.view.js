/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/models/node/node.model',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/utils/node.links/node.links',
  'csui/utils/contexts/factories/next.node',
  'csui/controls/thumbnail/content/content.registry',
  'i18n!csui/controls/thumbnail/content/parent/impl/nls/localized.strings',
  'hbs!csui/controls/thumbnail/content/parent/impl/parent',
  'css!csui/controls/thumbnail/content/parent/impl/parent'
], function ($, _, Backbone, Marionette, NodeModel, NodeTypeIconView, nodeLinks, NextNodeModelFactory,
   ContentRegistry, lang, template) {
  'use strict';

  var ParentView = Marionette.ItemView.extend({
    template: template,
    className: 'csui-thumbnail-parent-container',

    templateHelpers: function () {
      var parent           = this.model.get("parent_id_expand"),
          parentModel      = new NodeModel(parent, {connector: this.model.connector}),
          name             = parentModel.get("name"),
          defaultActionUrl = nodeLinks.getUrl(parentModel);
      return {
        label: lang.ColumnTitle,
        name: name,
        defaultActionUrl: defaultActionUrl,
        displayLabel: this.options.displayLabel
      };
    },

    events: {
      "keydown": "onKeyInView"
    },

    constructor: function ParentView(options) {
      options || (options = {});
      this.options = options;
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      if (this.options.displayIcon) {
        this.listenTo(this, 'render', this._createNodeTypeIcon)
            .listenTo(this, 'before:render', this._destroyNodeTypeIcon)
            .listenTo(this, 'before:destroy', this._destroyNodeTypeIcon);
      }
    },

    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        this.trigger('execute:defaultAction', event);
      }
    },

    _createNodeTypeIcon: function () {
      var parent      = this.model.get("parent_id_expand"),
          parentModel = new NodeModel(parent, {connector: this.model.connector}),
          iconView    = new NodeTypeIconView({node: parentModel});
      this.typeIconRegion = new Marionette.Region({el: this.$('.csui-thumbnail-parent-icon')});
      this.typeIconRegion.show(iconView);
    },

    _destroyNodeTypeIcon: function () {
      if (this.typeIconRegion) {
        this.typeIconRegion.empty();
        this.typeIconRegion = null;
      }
    },

    onRender: function () {
      var self = this;
      self.nextNode = self.options.context.getModel(NextNodeModelFactory);
      this.$el.find(".csui-thumbnail-parent-default-action").on('click', function (event) {
        if (self.nextNode.get('id') !== self.model.parent.get('id')) {
          self.trigger('execute:defaultAction', event);
        } else {
          event.preventDefault();
          event.stopPropagation();
        }
      });
    }
  });
  ContentRegistry.registerByKey('parent_id', ParentView);
  return ParentView;
});