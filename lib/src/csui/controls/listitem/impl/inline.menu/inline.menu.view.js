/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/globalmessage/globalmessage',
  'hbs!csui/controls/listitem/impl/inline.menu/inline.menu',
  'i18n!csui/controls/listitem/impl/inline.menu/nls/lang',
  'css!csui/controls/listitem/impl/inline.menu/inline.menu'
], function (require, _, $, Marionette, base, GlobalMessage, template, lang) {
  'use strict';

  var InlineMenuView = Marionette.ItemView.extend({

    tagName: 'span',
    className: 'csui-inline-menu',

    template: template,
    templateHelpers: function () {
      return {
        dropDownText: this.inlineActionbarOptions.dropDownText,
        dropDownIcon: this.inlineActionbarOptions.dropDownIcon,
        loadingTitle: _.str.sformat(lang.loadingActions, this.inlineActionbarOptions.dropDownText)
      };
    },

    ui: {
      moreToggle: '.csui-menu-btn',
      toolbarContainer: '.csui-menu-btn-region',
      dropdownToggle: '.csui-menu-btn-region .binf-dropdown .binf-dropdown-toggle',
      loadingContainer: '.csui-loading-parent-wrapper'
    },

    events: {
      'click @ui.moreToggle': 'onClickMenuButton',
      'click @ui.dropdownToggle': 'onClickMenuButton',
      'keydown @ui.moreToggle': 'onKeydownMenu',
      'keydown @ui.dropdownToggle': 'onKeydownMenu',
      'click': '_onClickInlineMenu'
    },

    constructor: function InlineMenuView(options) {
      options || (options = {});
      this.tileViewToolbarItems = options.tileViewToolbarItems || {};
      this.inlineActionbar = this.tileViewToolbarItems.inlineActionbar;
      this.inlineActionbarOptions = (this.inlineActionbar && this.inlineActionbar.options) || {};
      Marionette.ItemView.call(this, options);
    },

    onBeforeDestroy: function () {
      this._destroyInlineMenu();
    },

    _onClickInlineMenu: function (event) {
      event.stopPropagation();
      event.preventDefault();
    },

    onClickMenuButton: function (event) {
      event.preventDefault();
      event.stopPropagation();

      var lazyActionsAreRetrieved = !!this.model.get('csuiLazyActionsRetrieved'),
          nonPromotedCommands     = this.model.nonPromotedActionCommands;
      if (!lazyActionsAreRetrieved && nonPromotedCommands && nonPromotedCommands.length) {
        var self = this;
        this._toggleLoadingIcon(true);
        this.ui.loadingContainer.trigger('focus');
        this.model.setEnabledLazyActionCommands(true)
            .done(function () {
              setTimeout(function () {
                self._showInlineMenu(event);
              }, 300);
            })
            .fail(function (err) {
              self._toggleLoadingIcon(false);
              var error = new base.Error(err);
              GlobalMessage.showMessage('error', error.message);
            });
      } else {
        this._showInlineMenu(event);
      }
    },

    onKeydownMenu: function (event) {
      switch(event.which) {
        case 13: // Enter
        case 32: // Space
        case 40: // KeyDown
            this.onClickMenuButton(event);
            return false;
      }
    },

    acquireFocus: function() {
      this.$el.find("*[tabindex]:visible").first().trigger("focus");
    },

    _toggleLoadingIcon: function (showLoading) {
      this.$el.attr("aria-busy", !!showLoading);
      if (showLoading) {
        this.ui.moreToggle.addClass('binf-hidden');
        this.ui.loadingContainer.removeClass('binf-hidden');
      } else {
        this.ui.moreToggle.removeClass('binf-hidden');
        this.ui.loadingContainer.addClass('binf-hidden');
      }
    },

    _toggleMenuButton: function () {
      this.ui.moreToggle.addClass('binf-hidden');
      this.ui.loadingContainer.addClass('binf-hidden');
      this.ui.toolbarContainer.removeClass('binf-hidden');
    },

    _focusFirstItem: function (event) {
      if (event.type == "keydown") {
        this.$el.find('.binf-dropdown-menu li:first a').trigger("focus");
      }
    },

    closeDropdownMenuIfOpen: function () {
      if (this.inlineMenuBarView && this.inlineMenuBarView.closeDropdownMenuIfOpen()) {
        this._removeContainerShowingInlineMenuClass();
      }
    },

    _addContainerShowingInlineMenuClass: function () {
      this.$el.closest('.tile-content').addClass('showing-inline-menu');
      if (base.isEdge()) {
        this.inlineMenuBarView.$el.find('li.binf-dropdown a').each(function () {
          var title = $(this).attr('title');
          title && $(this).data('title', title).removeAttr('title');
        });
      }
    },

    _removeContainerShowingInlineMenuClass: function () {
      this.$el.closest('.tile-content').removeClass('showing-inline-menu');
      if (base.isEdge()) {
        this.inlineMenuBarView.$el.find('li.binf-dropdown a').each(function () {
          $(this).attr('title', $(this).data('title'));
        });
      }
    },

    _showInlineMenu: function (event) {
      if (this.isDestroyed) {
        return;
      }

      if (!!this.inlineMenuBarView) {
        this._addContainerShowingInlineMenuClass();
        this.inlineMenuBarView.toggleDropdownMenu();
        this._focusFirstItem(event);
        return;
      }

      var requiredModules = [
        'csui/controls/tableactionbar/tableactionbar.view'
      ];
      require(requiredModules, _.bind(function (TableActionBarView) {
        this.inlineMenuBarView = new TableActionBarView(_.extend({
          context: this.options.context,
          originatingView: this.options.originatingView,
          commands: this.options.commands,
          model: this.model,
          collection: this.inlineActionbar,
          containerCollection: this.model.collection,
          status: {originatingView: this.options.originatingView}
        }, this.inlineActionbarOptions));
        this._toggleMenuButton();
        var inlineBarElem   = this.$el.find('.csui-menu-btn-region'),
            inlineBarRegion = new Marionette.Region({el: inlineBarElem});
        inlineBarRegion.show(this.inlineMenuBarView);
        this.listenTo(this.inlineMenuBarView, 'before:execute:command', function (args) {
          this.trigger('before:execute:command', args);
        });
        this.listenTo(this.inlineMenuBarView, 'after:execute:command', function (args) {
          this.trigger('after:execute:command', args);
        });
        this.listenTo(this.inlineMenuBarView, 'destroy', function (args) {
          this._removeContainerShowingInlineMenuClass();
        });

        var dropdown = this.inlineMenuBarView.$el.find('li.binf-dropdown');
        dropdown.on('show.binf.dropdown', _.bind(function () {
          this._addContainerShowingInlineMenuClass();
        }, this));
        dropdown.on('hide.binf.dropdown', _.bind(function () {
          this._removeContainerShowingInlineMenuClass();
        }, this));

        this._addContainerShowingInlineMenuClass();
        this.inlineMenuBarView.toggleDropdownMenu(true);
        this._focusFirstItem(event);
      }, this));
    },

    _destroyInlineMenu: function () {
      this.inlineMenuBarView && this.inlineMenuBarView.destroy();
    }
  });

  return InlineMenuView;
});

