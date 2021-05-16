/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/behaviors/item.error/item.error.behavior',
  'csui/utils/contexts/factories/node',
  'csui/utils/defaultactionitems',
  'csui/utils/commands',
  'csui/utils/node.links/node.links',
  'hbs!csui/widgets/shortcuts/impl/shortcut/impl/small.shortcut',
  'hbs!csui/widgets/shortcuts/impl/shortcut/impl/medium.shortcut',
  'hbs!csui/widgets/shortcuts/impl/shortcut/impl/large.shortcut',
  'i18n!csui/widgets/shortcuts/impl/nls/lang',
  'css!csui/widgets/shortcuts/impl/shortcut/impl/shortcut',
  'css!csui/widgets/shortcuts/impl/shortcut/impl/small.shortcut',
  'css!csui/widgets/shortcuts/impl/shortcut/impl/medium.shortcut',
  'css!csui/widgets/shortcuts/impl/shortcut/impl/large.shortcut'
], function (
    _,
    $,
    Backbone,
    Marionette,
    base,
    DefaultActionBehavior,
    ItemErrorBehavior,
    NodeModelFactory,
    defaultActionItems,
    commands,
    nodeLinks,
    smallShortcutTemplate,
    mediumShortcutTemplate,
    largeShortcutTemplate,
    lang) {

  'use strict';
  var ShortcutView = Marionette.ItemView.extend({

    constructor: function MiniShortcutView(options) {
      options || (options = {});
      options.model = options.model || new Backbone.Model();
      options.model.set(_.defaults(options.model.attributes, {
        icon: ShortcutView.DEFAULT_ICON,
        theme: 'csui-shortcut-theme-grey-shade1',
        layout: 'small',
        id: '',
        displayName: ''
      }));

      Marionette.ItemView.prototype.constructor.call(this, options);
      this.node = this.model.get('node');
      if (!this.node) {
        this._ensureNode();
      }
      this._ensureNodeFetched();
      $(window).on('resize.' + this.cid, this._applyEllipsis.bind(this));
    },

    tagName: 'a',

    className: function () {
      var classArr = [];

      classArr.push('csui-shortcut-item');
      classArr.push('csui-acc-focusable');
      classArr.push(this.model.get('theme'));
      classArr.push('csui-' + this.model.get('layout'));

      return classArr.join(' ');
    },

    getTemplate: function () {
      switch (this.model.get('layout')) {
      case 'small':
        return smallShortcutTemplate;
      case 'medium':
        return mediumShortcutTemplate;
      default:
        return largeShortcutTemplate;
      }
    },

    templateHelpers: function () {
      var favName = this.getName();
      return {
        icon: this.model.get('icon') || ShortcutView.DEFAULT_ICON,
        name: favName,
        shortcutAria: lang.shortcutPrefixAria + " " + favName
      };
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      ItemError: {
        behaviorClass: ItemErrorBehavior,
        model: function () {
          return this.options.model.get('node');
        },
        errorViewOptions: function () {
          return {
            low: this.model.get('layout') === 'small'
          };
        }
      }
    },

    modelEvents: {
      change: 'render',
      'change:shortcutTheme': '_onThemeChange',
      'change:id': '_ensureNode',
      'change:type': '_ensureNode'
    },

    events: {
      'click': 'onClicked'
    },

    onRender: function () {
      this._updateElement();
      this._updateNodeState();
    },

    _updateElement: function() {
      if (!!this.node) {
        this.$el.attr('href', nodeLinks.getUrl(this.node));
      }
      this.$el.attr("class", _.result(this, 'className'));
    },

    onDomRefresh: function () {
      this._applyEllipsis();
    },

    _applyEllipsis: function () {
      var name = this.$el.find('.tile-title');
      base.applyEllipsis(name, 2);
    },

    onDestroy: function () {
      $(window).off('resize.' + this.cid, this._applyEllipsis.bind(this));
    },

    _onThemeChange: function () {
      this.trigger('change:shortcutTheme');
    },

    onClicked: function (event) {
      event.preventDefault();
      this.triggerMethod('execute:defaultAction', this.node);
    },

    getName: function () {
      if ((this.model.get('displayName') || "").trim().length > 0) {
        return this.model.get('displayName');
      } else {
        return this.node.fetched ? this.node.get('name') : lang.loadingText;
      }
    },

    _ensureNode: function () {
      this.node = this.options.context.getModel(NodeModelFactory, {
        attributes: {
          id: this.options.model.get('id') || 'volume',
          type: this.options.model.get('type') || 141
        }
      });
      ShortcutView.prepareModelToFetch(this.node);
      this.model.set('node', this.node, {silent: true});
      this.trigger('update:model', this.node);
      this._ensureNodeFetched();
    },

    _ensureNodeFetched: function () {
      this.listenToOnce(this.node, 'change', this.render);
      this.node.ensureFetched({suppressError: true});
    },
    _updateErrorState: function () {
      if (this.node.error) {
        this.$el.addClass('csui-failed');
      } else {
        this.$el.removeClass('csui-failed');
      }
    },
    _updateNodeState: function () {
      if (this.node.fetched && this.defaultActionController.hasAction(this.node)) {
        this.$el.removeClass('csui-disabled');
      } else {
        this.$el.addClass('csui-disabled');
      }
      this._updateErrorState();
    },

  }, {
    prepareModelToFetch: function (model) {
      model.excludeResources();
      model.resetFields();
      model.setFields({
        'properties': ['container', 'id', 'name', 'original_id', 'type', 'custom_view_search'],
        'versions.element(0)': ['mime_type']
      });
      model.resetExpand();
      model.setExpand({
        properties: ['original_id']
      });
      model.resetCommands();
      model.setCommands(defaultActionItems.getAllCommandSignatures(commands));
    },
    DEFAULT_ICON: 'icon-folder'
  });

  return ShortcutView;

});
