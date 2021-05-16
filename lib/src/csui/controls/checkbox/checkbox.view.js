/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'i18n!csui/controls/checkbox/impl/nls/lang',
  'hbs!csui/controls/checkbox/impl/checkbox.view',
  'csui/controls/svg_sprites/symbol/sprite',
  'css!csui/controls/control/impl/control',
  'css!csui/controls/checkbox/impl/checkbox.view'
], function ($, _, Backbone, Marionette, lang, template, sprite) {
  'use strict';

  return Marionette.ItemView.extend({
    className: 'csui-control-view csui-checkbox-view',
    template: template,

    calculateIconClass: function () {
      var checked = this.model.get('checked');
      var disabled = this.model.get('disabled');
      this._iconClass = 'controls--checkbox--impl--images--checkbox';
      if (disabled) {
        switch (checked) {
        case 'true':
          this._iconClass = 'controls--checkbox--impl--images--checkbox_on24_dis';
          break;
        case 'mixed':
          this._iconClass = 'controls--checkbox--impl--images--checkbox_partial_dis';
          break;
        case 'false':
          this._iconClass = 'controls--checkbox--impl--images--checkbox_disabled';
          break;
        }
      } else {
        switch (checked) {
        case 'true':
          this._iconClass = 'controls--checkbox--impl--images--checkbox_selected';
          break;
        case 'mixed':
          this._iconClass = 'controls--checkbox--impl--images--checkbox_mixed';
          break;
        case 'false':
          this._iconClass = 'controls--checkbox--impl--images--checkbox';
          break;
        }
      }
      return this._iconClass;
    },

    templateHelpers: function () {
      this._iconClass = this.calculateIconClass();
      return {
        spritePath: this._spritePath,
        iconClass: this._iconClass,
        disabled: this.model.get('disabled') ? 'disabled' : '',
        ariaChecked: this.model.get('checked'),
        title: this.title !== undefined ? this.title : lang.title,
        ariaLabelledBy: this.ariaLabelledBy, // if ariaLabelledBy is set, the ariaLabel field will NOT be created
        ariaLabel: this.ariaLabel !== undefined ? this.ariaLabel : lang.ariaLabel
      };
    },

    modelEvents: {
      'change:disabled': '_handleDisableChanged',
      'change:checked': '_handleCheckedChanged'
    },

    ui: {
      cb: 'button.csui-control.csui-checkbox',
      iconUse: 'button.csui-control.csui-checkbox>svg.csui-icon>use'
    },

    events: {
      'click': '_toggleChecked'
    },

    constructor: function Checkbox(options) {
      options || (options = {});

      this._spritePath = sprite.getSpritePath();
      this.ariaLabel = options.ariaLabel;
      this.ariaLabelledBy = options.ariaLabelledBy;
      this.title = options.title;

      if (!options.model) {

        options.model = new Backbone.Model(
            {disabled: options.disabled === undefined ? false : options.disabled}
        );

      }
      Marionette.ItemView.prototype.constructor.call(this, options);
      this._setChecked(options.checked, {silent: true});
    },

    setDisabled: function (d) {
      this.model.set('disabled', !!d);
    },

    setChecked: function (state) {
      var options = {silent: false};
      if (this.model.get('disabled')) {
        options.silent = true;
      }
      this._setChecked(state, options);
    },

    _updateIcon: function () {
      this.calculateIconClass();
      this.ui.iconUse.attr('xlink:href', this._spritePath + '#' + this._iconClass);
    },

    _handleDisableChanged: function () {
      this._updateIcon();
      var disabled = this.model.get('disabled');
      this.ui.cb.prop('disabled', disabled);
    },

    _handleCheckedChanged: function () {
      this._updateIcon();
      var checked = this.model.get("checked");
      this.ui.cb.attr('aria-checked', checked);
    },

    _setChecked: function (state, options) {
      switch (state) {
      case 'true':
      case true:
        this.model.set('checked', 'true', options);
        break;
      case 'mixed':
        this.model.set('checked', 'mixed', options);
        break;
      default:
        this.model.set('checked', 'false', options);
        break;
      }
    },

    _toggleChecked: function () {
      if (this.model.get('disabled')) {
        return; // don't change checkbox and don't fire events, because it's disabled
      }
      var currentState = this.model.get('checked');
      var args = {sender: this, model: this.model};
      this.triggerMethod('clicked', args);

      if (!args.cancel) {
        if (!currentState || currentState === 'false' || currentState === 'mixed') {
          this.model.set('checked', 'true');
        } else {
          this.model.set('checked', 'false');
        }
      }
    }

  });
});