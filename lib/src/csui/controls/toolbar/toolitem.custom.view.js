/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette', 'csui/utils/commandhelper',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'hbs!csui/controls/toolbar/impl/toolitem.custom', 'csui/utils/log', 'csui/lib/binf/js/binf'
], function (module, $, _, Marionette, CommandHelper, LayoutViewEventsPropagationMixin, template, log) {
  'use strict';

  log = log(module.id);
  var ToolItemCustomView = Marionette.LayoutView.extend({

    tagName: 'li',

    attributes: function () {
      var attrs = {id: _.uniqueId(this.model.get("signature"))};
      if (this.options.noMenuRoles) {
        attrs.role = 'presentation';
      } else {
        attrs.role = 'menuitem';
      }
      return attrs;
    },

    template: template,

    regions: {
      customViewRegion: '.custom-view-region'
    },

    ui: {
      customViewDiv: '.custom-view-region'
    },

    events: {
      'keydown': 'onKeyInView',
      'click': '_clickToolItem'
    },

    constructor: function ToolItemCustomView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.propagateEventsToRegions();
    },

    className: function () {
      var className = this.model.get("className") || '';
      return className;
    },

    _disable: function () {
      this.$el.addClass('binf-hidden');
      this.ui.customViewDiv.removeClass('csui-acc-focusable');
    },

    onRender: function () {
      var customViewClass = this.model.get('viewClass');
      if (customViewClass) {
        var model;
        var status = this.model.status;
        var commandData = this.model.get('commandData');
        if (commandData && commandData.useContainer === true) {
          model = status && status.container;
        } else {
          model = status && CommandHelper.getJustOneNode(status);
        }
        var context = this.options.context || (status && status.context);
        var options = {
          model: model,
          context: context,
          status: status,
          toolbarCommandController: this.options.toolbarCommandController,
          toolbarItemsMask: this.options.toolbarItemsMask,
          originatingView: this.options.originatingView,
          blockingParentView: this.options.blockingParentView,
          useIconsForDarkBackground: this.options.useIconsForDarkBackground
        };
        if (commandData && commandData.viewOptions) {
          _.extend(options, commandData.viewOptions);
        }
        this.customView = new customViewClass(options);
        if (this.customView.enabled) {
          try {
            if (this.customView.enabled()) {
              this.customView.render();
              this.customViewRegion.show(this.customView);
            } else {
              this._disable();
            }
          } catch (error) {
            log.warn('Rendering an custom toolitem view failed.\n{0}',
                error.message) && console.warn(log.last);
          }
        } else {
          this.customView.render();
          this.customViewRegion.show(this.customView);
        }
      } else {
        this._disable();
      }
    },

    onShow: function () {
      _.each(this.regionManager._regions, function (region) {
        if (region.currentView) {
          region.currentView.triggerMethod('show');
        }
      });
    },

    onAfterShow: function () {
      _.each(this.regionManager._regions, function (region) {
        if (region.currentView) {
          region.currentView.triggerMethod('after:show');
        }
      });
    },

    _clickToolItem: function (e) {
      e.preventDefault();
      this.ui.customViewDiv.prop('tabindex', '0');
      this.ui.customViewDiv.trigger('focus');
      this._closeDropdownToggleOnClick();
      if (this.customView.el !== e.target && this.customView.$el.find(e.target).length === 0) {
        this.customView.$el.trigger('click');
      }
    },

    _closeDropdownToggleOnClick: function () {
      var dropdownEl = this.$el.closest('li.binf-dropdown.binf-open');
      var dropdownToggleEl = dropdownEl.find('.binf-dropdown-toggle');
      dropdownToggleEl.binf_dropdown('toggle');  // close the dropdown menu before triggering the event
    },

    onKeyInView: function (event) {
      var $target = $(event.target);
      if (event.keyCode === 32 || event.keyCode === 13) {  // space (32) or enter (13)
        this._clickToolItem(event);
      }
    }

  });

  _.extend(ToolItemCustomView.prototype, LayoutViewEventsPropagationMixin);

  return ToolItemCustomView;

});
