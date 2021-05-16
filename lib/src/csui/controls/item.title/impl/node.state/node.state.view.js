/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/marionette', 'csui/utils/base', 'csui/utils/log',
  'csui/controls/node.state/node.states.view',
  'csui/controls/node.state/node.state.icons'
], function (module, Marionette, base, log, NodeStateCollectionView, nodeStateIcons) {
  'use strict';

  log = log(module.id);

  var NodeStateView = Marionette.View.extend({
    className: 'csui-node-state',

    constructor: function NodeStateView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);
      this.cellRegion = new Marionette.Region({el: this.el});
      this.listenTo(this, 'before:render', this._destroyStateIcons)
          .listenTo(this, 'before:destroy', this._destroyStateIcons);
      this.listenTo(this.model, 'change', this.render);
    },

    _destroyStateIcons: function () {
      this.cellRegion.empty();
    },

    render: function () {
      this._ensureViewIsIntact();
      this.triggerMethod('before:render', this);
      this._renderContent();
      this.bindUIElements();
      this.triggerMethod('render', this);
      return this;
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
    },

    _renderContent: function () {
      this._renderValue();
    },

    _renderValue: function () {
      var enabledStateIcons = this._getEnabledNodeStateIcons();
      if (enabledStateIcons.length) {
        var iconsView = new NodeStateCollectionView({
          context: this.options.context,
          node: this.model,
          tableView: this.options.tableView,
          collection: enabledStateIcons
        });
        this.cellRegion.show(iconsView);
      }
    },

    onDomRefresh: function () {
      base.findFocusables(this.el).addClass('csui-acc-focusable');
    }
  });

  return NodeStateView;
});
