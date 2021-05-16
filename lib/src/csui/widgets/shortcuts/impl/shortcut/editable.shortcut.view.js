/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/widgets/shortcuts/impl/shortcut/shortcut.view',
  'csui/models/widget/widget.model',
  'i18n!csui/widgets/shortcuts/impl/nls/lang',
  'i18n!csui/widgets/shortcuts/impl/nls/shortcuts.manifest',
  'json!csui/widgets/shortcuts/impl/shortcut/shortcut.manifest.json',
], function (require, _,
    $,
    Backbone,
    Marionette,
    MiniShortcutView,
    WidgetModel,
    lang,
    manifestLang,
    shortcutManifest) {

  'use strict';
  shortcutManifest = WidgetModel.resolveLocalizedManifest('shortcut.manifest', shortcutManifest,
      manifestLang);
  var EditableMiniShortcutView = MiniShortcutView.extend({

    constructor: function EditableMiniShortcutView(options) {
      options || (options = {});
      options.model = options.model || new Backbone.Model();
      this._injectConfigurationBehaviour(options);
      if (options.container.options.data.___pman_isdropped &&
          options.collection.getShortcuts().length === 0) {
        options.model.set('___pman_opencallout', true, {silent: true});
      }
      MiniShortcutView.prototype.constructor.apply(this, arguments);
      this._registerEventHandlers();
    },
    tagName: 'div', 

    modelEvents: _.defaults({
      'refresh:mask': 'onRefreshMask',
    }, _.result(MiniShortcutView.prototype, 'modelEvents')),

    onRefreshMask: function () {
      var configOptions = this._getDefaultWidgetConfig();
      this.trigger('refresh:mask', configOptions);
    },
    attachElContent: function (html) {
      var flyoutConfig = this.$el.find('.csui-configure-perspective-widget .pman-widget-popover');
      if (flyoutConfig.length) {
        this.$el.children().not('.csui-configure-perspective-widget').remove();
        this.$el.prepend($(html));
      } else {
        this.$el.html(html);
      }
      return true;
    },

    _getDefaultWidgetConfig: function (options) {
      options || (options = this.options);
      var configOptions = {
        allowReplace: false,
        notifyUpdatesImmediatly: true
      };
      if (options.collection.getShortcuts().length > 1) {
        configOptions = _.extend(configOptions, {
          removeConfirmTitle: lang.removeShortcut,
          removeConfirmMsg: lang.removeShortcutCnfrmMsg,
          confirmOnRemove: false
        });
      }
      return configOptions;
    },

    _injectConfigurationBehaviour: function (options) {
      var configOptions = this._getDefaultWidgetConfig(options);
      this.behaviors = _.defaults({
        PerspectiveWidgetConfig: _.extend({ // For widget editing
          behaviorClass: require(
              'csui/perspective.manage/behaviours/pman.widget.config.behaviour'),
          widgetConfig: function () {
            return {
              options: options.model.attributes
            };
          },
          manifest: shortcutManifest
        }, configOptions)
      }, this.behaviors);
    },

    isShortcutValid: function (options) {
      var isValid = true;
      if (this.collection.getShortcuts().length === 0 && this.options.perspectiveMode === "edit") {
        isValid = this.isOptionsValid(options);
      }
      return isValid;
    },

    validateConfiguration: function (options) {
      var isValid = this.isShortcutValid(options);
      var action = !isValid ? 'addClass' : 'removeClass';
      this.$el.find(".tile-group")[action]('binf-hidden');
      this.$el[action]('csui-pman-shortcut-error');
      return isValid;
    },

    isOptionsValid: function (options) {
      return (!!options.id || !!options.type);
    },

    _updateShortcut: function (args) {
      if (this.isShortcutValid(args.options)) {
        this.$el.find('.csui-configure-perspective-widget').removeClass(
            'binf-perspective-has-error');
      }
    },

    _registerEventHandlers: function () {
      this.listenTo(this, 'delete:widget', function () {
        delete this.options.container.options.data.___pman_opencallout;
      });
      this.listenTo(this, 'update:widget:options', this._updateShortcut);
    },
    _updateElement: function () {
      this.$el.attr("class", _.result(this, 'className'));
    },

    _ensureNode: function () {
      if (!this._isNewPlaceholder()) {
        MiniShortcutView.prototype._ensureNode.apply(this, arguments);
      } else {
        this.node = new Backbone.Model();
      }
    },

    _ensureNodeFetched: function () {
      if (!this._isNewPlaceholder()) {
        this.isUpdating = true;
        MiniShortcutView.prototype._ensureNodeFetched.apply(this, arguments);
        delete this.isUpdating;
      }
    },

    _updateNodeState: function () {
      if (!this._isNewPlaceholder()) {
        MiniShortcutView.prototype._updateErrorState.apply(this, arguments);
      }
    },

    getName: function () {
      if (!this._isNewPlaceholder()) {
        return MiniShortcutView.prototype.getName.apply(this, arguments);
      } else {
        return lang.addShortcut;
      }
    },

    onRender: function () {
      MiniShortcutView.prototype.onRender.apply(this, arguments);
      if (this._isNewPlaceholder()) {
        this.$el.addClass('csui-pman-shortcut-new');
      }
      this.$el.addClass('csui-pman-editable-widget');
    },

    onClicked: function (event) {
      event.preventDefault();
      if (!this.$el.find('.pman-widget-popover').has(event.target).length) {
        event.stopPropagation();
      }
    },

    _isNewPlaceholder: function (options) {
      return (options || this.options).model.isAddShortcut();
    }
  });

  return EditableMiniShortcutView;

});
