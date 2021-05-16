/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette', 'i18n',
  'csui/controls/versionsettings/impl/version.control.view',
  'i18n!csui/controls/versionsettings/impl/nls/lang',
  'hbs!csui/controls/versionsettings/impl/version.settings',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/utils/base',
  'csui/utils/url',
  'csui/utils/contexts/factories/next.node',
  'csui/themes/carbonfiber/svg_sprites/symbol/sprite',
  'css!csui/controls/versionsettings/impl/settings'
], function ($, _, Backbone, Marionette, i18n, VersionControlView, lang, template,
    LayoutViewEventsPropagationMixin, ModalAlert, base, Url,
    NextNodeModelFactory,
    sprite) {
  'use strict';
  var VersionSettingsView = Marionette.LayoutView.extend({

    constructor: function VersionSettingsView(options) {
      options || (options = {});
      _.defaults(options, {
        SvgId: "themes--carbonfiber--image--generated_icons--action_version_control32"
      });
      Marionette.LayoutView.prototype.constructor.call(this, options);
      if (this.options.useIconsForDarkBackground) {
        this.options.SvgId = this.options.SvgId + '.dark';
      }
      this.parentView = options.originatingView || options.parentView;
      this.context = options.context;
      this.listenTo(this.context.getModel(NextNodeModelFactory), 'before:change:id', function () {
        this.parentView._blockingCounter && this.parentView.unblockActions();
        this.isContainerChanged = true;
      });
      this.isSilentFetch = true;
      this.listenTo(this.parentView.collection, 'request', function () {
        this.isSilentFetch = false;
      });
    },
    template: template,
    templateHelpers: function () {
      return {
        enabled: this.enabled(),
        settingLabel: lang.versionSettings,
        spritePath: sprite.getSpritePath(),
        svgId: this.options.SvgId
      };
    },
    regions: {
      settingsRegion: '.csui-toolbar-control-settings-dropdown'
    },
    events: {
      'click': '_onClickView',
      'keydown': 'onKeyInView',
      'keyup': 'onKeyUpView'
    },

    _onClickView: function (event) {
      if (!this.enabled() ||
          (this.isSettingsViewOpen && this.versionControlSettings.$el.find(event.target).length >
           0)) {
        return;
      }
      this._toggleSettingsView(event);
    },

    _toggleSettingsView: function (options) {
      if (!this.versionControlSettings ||
          (this.versionControlSettings && this.versionControlSettings.isDestroyed)) {
        $(document).on('mouseup.csui-toolbar-control-settings-dropdown',
            _.bind(this._closeSettingsMenu, this));
        options = options || {};
        options.model = this.options.model;
        options.settingsView = this;
        this.versionControlSettings = new VersionControlView(options);
        this.isSettingsViewOpen = true;
        this.settingsRegion.show(this.versionControlSettings);
        this.settingsRegion.$el.addClass('binf-open');
      } else {
        this._saveAndDestroySettingsDropdown();
      }
    },

    _saveAndDestroySettingsDropdown: function () {
      var settings = this.versionControlSettings.settings,
          model = this.options.model;
      if (model.get('versions_control_advanced') !== settings.majorMinorVersion) {
        this.parentView._blockingCounter === 0 && this.parentView.blockActions();
        saveSettings.call(this).done(_.bind(function () {
          !this.isContainerChanged &&
          model.fetch({silent: this.isSilentFetch}).always(_.bind(function () {
            this.isSilentFetch = true;
          }, this));
          this.parentView.unblockActions();
        }, this)).fail(_.bind(function (request) {
          this.parentView.unblockActions();
          var errorMsg = new base.RequestErrorMessage(request);
          ModalAlert.showError(errorMsg.message);
        }, this));
      }
      this.destroyVesrionControlView();

      function saveSettings() {
        var settings = this.versionControlSettings.settings,
            model = this.options.model,
            connector = model.connector,
            data = {
              "versions_control_advanced": settings.majorMinorVersion.toString(),
              "apply_to": settings.permissionLevel
            };
        return model.save(undefined, {
          data: data,
          type: 'PUT',
          wait: true,
          silent: true,
          patch: true,
          contentType: 'application/x-www-form-urlencoded',
          url: Url.combine(connector.getConnectionUrl().getApiBase('v2'),
              'nodes/' + model.get("id"))
        });

      }
    },

    destroyVesrionControlView: function () {
      var versionControlSettings = this.versionControlSettings;
      if (versionControlSettings && !versionControlSettings.controlViewIsInFocus) {
        this.settingsRegion.$el.removeClass('binf-open');
        this.isSettingsViewOpen = false;
        versionControlSettings.destroy();
        $(document).off('mouseup.csui-toolbar-control-settings-dropdown');
      }
    },

    restoreFocusToView: function () {
      this.$el.parent().find('.csui-acc-focusable').trigger('focus');
    },

    _closeSettingsMenu: function (e) {
      if (($(e.target).find('.csui-toolbar-settings').length) ||
          e.target.classList.contains('csui-toolbar-settings') ||
          (this.versionControlSettings &&
           this.versionControlSettings.$el.has(e && e.target).length) ||
          this.versionControlSettings.controlViewIsInFocus) {
        e.stopPropagation();
        return;
      } else if (!(this.versionControlSettings && this.versionControlSettings.isDestroyed)) {
        this._saveAndDestroySettingsDropdown();
      }
    },

    enabled: function () {
      return this.options.model.actions.findWhere({signature: 'versionscontrol'});
    },

    saveAndDestroySettingsDropdown: function () {
      this._saveAndDestroySettingsDropdown();
    },

    onKeyInView: function (event) {
      switch (event.keyCode) {
      case 13:
        if (this.enabled()) {
          event.preventDefault();
          event.stopPropagation();
          this._toggleSettingsView(this.options);
        }
        break;
      case 9:
        !!this.isSettingsViewOpen && this.moveInRegions(event);
        break;
      case 37:
      case 39:
        if (!!this.isSettingsViewOpen) {
          event.preventDefault();
          event.stopPropagation();
        }
        break;
      case 38:
      case 40:
        !!this.isSettingsViewOpen && this.moveInSelectionRegion(event);
        break;
      }

    },

    onKeyUpView: function (event) {
      if (event.keyCode === 27) {
        this._saveAndDestroySettingsDropdown();
        this.restoreFocusToView();
      }
    },

    moveInRegions: function (event) {
      var tabableElements = this.versionControlSettings.tabableElements,
          currentlyFocusedElementIndex = tabableElements && tabableElements.indexOf(event.target);
      if (tabableElements && tabableElements.length === 1) {
        event.stopPropagation();
        event.preventDefault();
      } else if (tabableElements) {
        if (currentlyFocusedElementIndex === 0) {
          tabableElements[1].classList.contains('selected') ? tabableElements[1].focus() :
          tabableElements[2].focus();
        } else {
          tabableElements[0].focus();
        }
        event.stopPropagation();
        event.preventDefault();
      }
    },

    moveInSelectionRegion: function (event) {
      var tabableElements = this.versionControlSettings.tabableElements,
          currentlyFocusedElementIndex = tabableElements && tabableElements.indexOf(event.target);
      if (tabableElements && tabableElements.length === 1 || currentlyFocusedElementIndex === 0) {
        event.stopPropagation();
        event.preventDefault();
      } else if (tabableElements) {
        if (currentlyFocusedElementIndex === 1) {
          tabableElements[2].focus();
        } else {
          tabableElements[1].focus();
        }
        event.stopPropagation();
        event.preventDefault();
      }
    }
  });
  _.extend(VersionSettingsView.prototype, LayoutViewEventsPropagationMixin);
  return VersionSettingsView;
});
