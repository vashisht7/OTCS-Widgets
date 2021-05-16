/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/controls/toolbar/toolitem.view',
  'hbs!csui/controls/toolbar/impl/flyout.toolitem',
  'i18n!csui/controls/toolbar/impl/nls/localized.strings'
], function (_, $, Marionette, ToolItemView, template, lang) {
  'use strict';

  var FlyoutMenuItemView = ToolItemView.extend({
    constructor: function FlyoutMenuItemView() {
      ToolItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'render', this._promote);
    },

    _promote: function () {
      var method = this.model.get('promoted') ? 'addClass' : 'removeClass';
      this.$el[method]('csui-promoted');
    }
  });

  var FlyoutToolItemView = Marionette.CompositeView.extend({
    tagName: 'li',
    className: 'csui-flyout binf-dropdown',
    attributes: function () {
      var signature = this.model.get('signature') || '';
      var attrs = {};
      attrs['data-csui-command'] = signature.toLowerCase();
      if (this.options.role) {
        attrs.role = this.options.role;
      } else if (this.options.noMenuRoles) {
        attrs.role = 'presentation';
      } else {
        attrs.role = 'menuitem';
      }
      return attrs;
    },

    template: template,
    templateHelpers: function () {
      var name                = this.model.get('name'),
          signature           = this.model.get('signature'),
          promoted            = this.model.get('promoted') || this.model.toolItems.findWhere({
            promoted: true
          }),
          flyoutArrowDisabled = this.model.toolItems.length < 1,
          disabled = (signature === 'disabled');
      if (!name) {
        name = (promoted || this.model.toolItems.first()).get('name');
      }
      return {
        name: name,
        disabled: disabled,
        expandTitle: lang.showMoreLabel,
        flyoutArrowDisabled: flyoutArrowDisabled
      };
    },

    childViewContainer: '.binf-dropdown-menu',
    childView: FlyoutMenuItemView,
    childEvents: {
      'toolitem:action': function (childView, args) {
        this.triggerMethod('toolitem:action', args);
      }
    },

    events: {
      'click > a': function (event) {
        event.preventDefault();
        var onlyPromotedActionHastoBeExecuted = this.model.toolItems.length < 1;
        if (this.$el.find('.csui-button-icon.icon-expandArrowDown.binf-hidden').length) {
          onlyPromotedActionHastoBeExecuted = true;
        }
        if (onlyPromotedActionHastoBeExecuted) {
            var args = {toolItem: this.model};
            this.triggerMethod('toolitem:action', args);
        }
      }
    },

    constructor: function FlyoutToolItemView(options) {
      this.options = options || {};
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.collection, 'add change reset', function (models) {
        this.render();
      });
    },

    onKeyInView: function (event) {
      var target = $(event.target);
      if (event.keyCode === 13) {
        this._handleClick(event);
        return false;
      }
    },
  });

  return FlyoutToolItemView;
});
