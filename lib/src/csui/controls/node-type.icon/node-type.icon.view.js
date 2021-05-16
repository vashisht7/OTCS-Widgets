/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/nodesprites',
  'i18n!csui/controls/node-type.icon/impl/nls/lang',
  'hbs!csui/controls/node-type.icon/node-type.icon',
  'csui/themes/carbonfiber/svg_sprites/symbol/sprite'
], function (_, $, Backbone, Marionette, nodeSpriteCollection,
    lang, template, sprite) {
  'use strict';

  var NodeTypeIconModel = Backbone.Model.extend({
    constructor: function NodeTypeIconModel(attributes, options) {
      this.node = options.node;
      attributes = this._getAttributesFromNode();

      NodeTypeIconModel.__super__.constructor.call(this, attributes, options);

      this
          .listenTo(this.node, 'change:id', this._updateModelFromNode)
          .listenTo(this.node, 'change:type', this._updateModelFromNode)
          .listenTo(this.node, 'change:image_url', this._updateModelFromNode);
    },

    _getAttributesFromNode: function () {
      var node              = this.node,
          original          = node.original,
          exactNodeSprite   = nodeSpriteCollection.findByNode(node) || {},
          exactClassName    = exactNodeSprite.get('className'),
          exactSvgId        = exactNodeSprite.get('svgId'),
          mainClassName     = exactClassName,
          mainSvgId         = exactSvgId,
          overlayClassNames = [],
          overlaySvgIds = [];
      var mimeTypeFromNodeSprite;
      if (exactNodeSprite.attributes) {
        mimeTypeFromNodeSprite = exactNodeSprite.get('mimeType');
      }
      var title = mimeTypeFromNodeSprite || node.get("type_name") || node.get("type");

      if (original && original.get('id') && node.get("type") !== 1281 && node.get("type") !== 2) {
        var originalNodeSprite = nodeSpriteCollection.findByNode(original) || {};
        mainClassName = originalNodeSprite.get('className');
        mainSvgId = originalNodeSprite.get('svgId');
        overlayClassNames.push('csui-icon csui-icon-shortcut-overlay');
        overlaySvgIds.push('themes--carbonfiber--image--icons--shortcut-overlay');
        title = _.str.sformat(lang.shortcutTypeLabel,
            originalNodeSprite.get('mimeType') || original.get("type_name") ||
            lang.nodeTypeUnknown);
      }

      var attributes = {
        imageUrl: node.get("image_url"),
        title: title
      };
      if (exactSvgId) {
        attributes.spritePath = sprite.getSpritePath();
        attributes.svgId = exactSvgId;
        attributes.mainSvgId = mainSvgId;
        attributes.overlaySvgIds = overlaySvgIds;
      } else {
        attributes.className = exactClassName;
        attributes.mainClassName = mainClassName;
        attributes.overlayClassNames = overlayClassNames;
      }
      return attributes;
    },

    _updateModelFromNode: function () {
      var attributes = this._getAttributesFromNode();
      this.clear({silent: true});
      this.set(attributes);
    }
  });

  var NodeTypeIconView = Marionette.ItemView.extend({
    tagName: 'span',

    attributes: function () {
      var title = this.model.get('title');
      return {
        'class': 'csui-icon-group',
        'title': title,
        'aria-label': title
      };
    },

    template: template,

    constructor: function NodeTypeIconView(options) {
      options || (options = {});
      if (!options.model) {
        this.ownModel = true;
        options.model = new NodeTypeIconModel(undefined, {node: options.node});
      }

      NodeTypeIconView.__super__.constructor.call(this, options);
      if (options.el) {
        $(options.el).attr(_.result(this, 'attributes'));
      }

      this.listenTo(this.model, 'change', this.render);
    },

    onRender: function () {
      this._updateTitle();
    },

    onDestroy: function(){
      if (this.ownModel){
        this.model.stopListening();
      }
    },

    _updateTitle: function () {
      var title = this.model.get('title');
      this.$el
          .attr('title', title)
          .attr('aria-label', title);
    }
  });

  return NodeTypeIconView;
});
