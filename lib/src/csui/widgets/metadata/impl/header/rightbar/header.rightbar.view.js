/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/commands', 'csui/controls/tabletoolbar/tabletoolbar.view',
  'csui/widgets/metadata/impl/header/rightbar/toolbaritems',
  'csui/widgets/metadata/impl/header/rightbar/toolbaritems.masks',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'hbs!csui/widgets/metadata/impl/header/rightbar/header.rightbar',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/controls/form/fields/booleanfield.view',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'css!csui/widgets/metadata/impl/header/rightbar/header.rightbar'
], function (_, $, Backbone, Marionette, commands, TableToolbarView,
    toolbarItems, ToolbarItemsMasks, ViewEventsPropagationMixin, template, lang,
    ApplicationScopeModelFactory, BooleanFieldView, TabableRegionBehavior) {

  var MetadataHeaderRightBarView = Marionette.LayoutView.extend({

    className: 'metadata-header-right-bar',

    template: template,
    templateHelpers: function () {
      var templateValues = {
        show_close_icon: this.options.showCloseIcon,
        close_metadata_button_tooltip: lang.closeMetadataButtonTooltip
      };
      if (this.options.showShortcutSwitch && this.options.shortcutNode) {
        var right_static_label = lang.viewOriginalMessage;
        if (this.options.shortcutNode.original === this.node) {
          right_static_label = lang.viewShortcutMessage;
        }
        return _.extend(templateValues, {
          is_shortcut: true,
          right_label: right_static_label
        });
      } else {
        return templateValues;
      }
    },

    regions: {
      extraToolbarRegion: '.csui-extra-header-wrapper'
    },

    behaviors: function () {
      if ((this.options.showShortcutSwitch && this.options.shortcutNode) ||
          this.options.showCloseIcon) {
        return {
          TabableRegionBehavior: {
            behaviorClass: TabableRegionBehavior
          }
        };
      } else {
        return {};
      }
    },

    ui: {
      shortcutSwitchLabel: 'a.shortcut-switch',
      closeIcon: '.cs-metadata-close'
    },

    events: {
      'keydown': 'onKeyInView',
      'click @ui.shortcutSwitchLabel': 'onClickShortcutSwitch',
      'click @ui.closeIcon': 'onClickClose'
    },

    constructor: function MetadataHeaderRightBarView(options) {
      options || (options = {});
      this.options = options;
      this.node = this.options.model;
      if (!options.toolbarItemsMasks) {
        options.toolbarItemsMasks = new ToolbarItemsMasks();
      }

      if (!options.toolbarItems) {
        options.toolbarItems = toolbarItems;
      }
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    onRender: function () {
      if (this.options.showExtraRightActionBar) {
        this.options.parent.$el.addClass("extended-headers");
        this._showExtraRightActionBar();
      }
    },

    _showExtraRightActionBar: function (args) {
      var collection       = this.collection || this.options.model.collection,
          container        = this.options.container || collection ?
                             (collection.node ? collection.node :
                              this.options.model) : this.options.model,
          applicationScope = this.options.context &&
                             this.options.context.getModel(ApplicationScopeModelFactory),
          removeContainer  = false;
      if (applicationScope && applicationScope.get("id") === "search") {
        removeContainer = true;
      }
      this.toolbarView = new TableToolbarView({
        toolbarItems: this.options.toolbarItems,
        toolbarItemsMasks: this.options.toolbarItemsMasks,
        collection: collection,
        model: this.options.model,
        originatingView: this.options.originatingView,
        context: this.options.context,
        container: container,
        removeContainer: removeContainer
      });
      this.extraToolbarRegion.show(this.toolbarView);
    },

    onKeyInView: function (e) {
      var event = e || window.event;
      var target = event.target || event.srcElement;
      if (event.keyCode === 13 || event.keyCode === 32) {
        event.preventDefault();
        event.stopPropagation();
        setTimeout(function () {
          $(target).trigger('click');
        }, 200);
      }
    },

    currentlyFocusedElement: function () {
      if (this.options.showShortcutSwitch && this.options.shortcutNode) {
        return $(this.ui.shortcutSwitchLabel);
      } else if (this.options.showCloseIcon) {
        return $(this.ui.closeIcon);
      } else {
        return undefined;
      }
    },

    onClickShortcutSwitch: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this.trigger('shortcut:switch');
    },

    onClickClose: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this.trigger("metadata:close");
    }

  });

  _.extend(MetadataHeaderRightBarView.prototype, ViewEventsPropagationMixin);

  return MetadataHeaderRightBarView;

});
