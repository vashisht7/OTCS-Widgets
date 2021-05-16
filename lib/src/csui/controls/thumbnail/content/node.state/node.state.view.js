/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/log',
  'csui/controls/thumbnail/content/content.registry',
  'csui/controls/node.state/node.states.view',
  'csui/controls/node.state/node.state.icons',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'hbs!csui/controls/thumbnail/content/node.state/impl/node.state',
  'i18n!csui/controls/thumbnail/content/node.state/impl/nls/localized.strings'
], function ($, _, Backbone, Marionette, log, ContentRegistry, NodeStateCollectionView,
    nodeStateIcons, FieldsV2Mixin, template, lang) {
  'use strict';

  var ThumbnailNodeStateView = Marionette.LayoutView.extend({
    template: template,
    className: 'csui-thumbnail-nodestate-container',

    regions: {
      nodeStateRegion: '.csui-thumbnail-nodestate'
    },

    events: {
      'keydown' : '_onKeyInView'
    },

    constructor: function ThumbnailNodeStateView(options) {
      options || (options = {});
      this.options = options;
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },
    onRender: function () {
      var enabledStateIcons = this._getEnabledNodeStateIcons(),
          message           = enabledStateIcons.length ?
                              lang.someStateIconsAria : lang.noStateIconsAria,
          title             = this.options.displayTitle ? lang.nodeStateTitle_thumbnail : "";
      this.el.setAttribute('aria-label', message);
      this.el.setAttribute('title', title);
      if (enabledStateIcons.length) {
        var iconsView = new NodeStateCollectionView({
          context: this.options.context,
          node: this.model,
          tableView: this.options.originatingView,
          targetView: this.options.targetView,
          collection: enabledStateIcons
        });
        this.nodeStateRegion.show(iconsView);
        if (this.options.displayTitle) {
          iconsView.$el.find("button").attr("tabindex", "-1");
        }
      }
    },

    _onKeyInView: function(event) {
      if (event.keyCode === 27) { //esc key
        event.preventDefault();
        event.stopPropagation();
        var $container = this.$el.parents('.binf-popover');
        $container.trigger('close:popover');
      }
    },

    _getEnabledNodeStateIcons: function () {

      var nodeStateIconsPrototype;
      var enabledNodeStateIcons;

      nodeStateIconsPrototype = Object.getPrototypeOf(nodeStateIcons);
      enabledNodeStateIcons = new nodeStateIconsPrototype.constructor(
          nodeStateIcons.filter(function (iconModel) {
            var IconView = iconModel.get('iconView');
            try {
              return IconView && (!IconView.enabled || IconView.enabled({
                    context: this.options.context,
                    node: this.model
                  }));
            } catch (error) {
              log.warn('Evaluating an icon view failed.\n{0}',
                  error.message) && console.warn(log.last);
            }
          }, this));

      return enabledNodeStateIcons;
    }
  });
  ContentRegistry.registerByKey('reserved', ThumbnailNodeStateView);
  return ThumbnailNodeStateView;
});