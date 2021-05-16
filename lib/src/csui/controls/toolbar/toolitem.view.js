/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'i18n',
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/toolbar/toolitem.model',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'hbs!csui/controls/toolbar/toolitem',
  'csui/themes/carbonfiber/svg_sprites/symbol/sprite',
  'csui/lib/binf/js/binf'
], function (require, i18n, $, _, Backbone, Marionette, base, ToolItemModel,
    PerfectScrollingBehavior, template, carbonfiberSprite) {
  'use strict';

  var ToolItemView = Marionette.ItemView.extend({
    tagName: 'li',

    className: function () {
      var className = this.model.get('className') || '';
      if (this.model.isSeparator()) {
        className += ' binf-divider';
      }
      if (this._isSubmenu()) {
        className += ' binf-dropdown-submenu';
      }
      return className;
    },

    attributes: function () {
      var attrs = {};
      if (this.model.isSeparator()) {
        attrs['aria-hidden'] = 'true';
      } else {
        var signature = this.model.get('signature') || '';
        attrs['data-csui-command'] = signature.toLowerCase();

        if (this.options.role) {
          attrs.role = this.options.role;
        } else if (this.options.noMenuRoles) {
          attrs.role = 'presentation';
        } else {
          attrs.role = 'menuitem';
        }
      }
      return attrs;
    },

    ui: {
      link: 'a',
      iconUseNormal: 'svg.csui-svg-icon-normal>use',
      iconUseHover: 'svg.csui-svg-icon-hover>use',
      iconUseActive: 'svg.csui-svg-icon-active>use'
    },

    template: template,

    templateHelpers: function () {
      var spritePath = '';
      if (this._svgId) {
        if (this._svgId.indexOf('#') < 0) {
          spritePath = carbonfiberSprite.getSpritePath();
        } else {
        }
      }
      var data    = {
            renderIconAndText: this.options.renderIconAndText === true,
            renderTextOnly: this.options.renderTextOnly === true,
            isSeparator: this.model.isSeparator(),
            toolItemAria: this.model.get("toolItemAria"),
            hasToolItemAriaExpand: this.model.get("toolItemAriaExpand") !== undefined,
            toolItemAriaExpand: this.model.get("toolItemAriaExpand"),
            submenu: this._isSubmenu(),
            hasIcon: this.model.get('icon') || this._svgId,
            spritePath: spritePath,
            svgId: this._svgId
          },
          command = this.options.command;
      data.disabledClass = command && command.get('selfBlockOnly') && command.get('isExecuting') ?
                           'binf-disabled' : '';
      data.title = !!this.model.get('title') ? this.model.get('title') : this.model.get('name');
      return data;
    },

    events: {
      'click a': '_handleClick',
      'keydown': 'onKeyInView'
    },

    _calculateSvgId: function () {
      if (this.model.get('stateIsOn')) {
        this._svgId = this.model.get('svgIdForOn');
        if (!this._svgId) {
          this._svgId = this.model.get('svgId');  // default back to non on state icon
        }
      } else {
        this._svgId = this.model.get('svgId');
      }
      if (this._svgId) {
        if (this.options.useIconsForDarkBackground) {
          this._svgId = this._svgId + '.dark';
        }
      }
    },

    constructor: function ToolItemView(options) {
      this.options = options || {};
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this._calculateSvgId();
      this.listenTo(this.model, 'change:stateIsOn', function () {
        this._calculateSvgId();
        var spritePath = carbonfiberSprite.getSpritePath();
        this.ui.iconUseNormal.attr('xlink:href', spritePath + '#' + this._svgId);
        this.ui.iconUseHover.attr('xlink:href', spritePath + '#' + this._svgId + '.hover');
        this.ui.iconUseActive.attr('xlink:href', spritePath + '#' + this._svgId) + '.active';
      });
    },

    onKeyInView: function (event) {
      var target = $(event.target);
      if (event.keyCode === 13 || event.keyCode === 32) {  // enter(13) and space(32)
        this._handleClick(event);
        if (!this._isSubmenu()) {
          return false;
        }
      }
      if ((event.keyCode === 39) && this._isSubmenu() &&
          this.submenu.$el.has(event.target).length) {
        event.stopPropagation();
      }
    },

    renderIconAndText: function () {
      this.options.renderIconAndText = true;
      this.render();  // re-render
      this.options.renderIconAndText = false;
    },

    renderTextOnly: function () {
      this.options.renderTextOnly = true;
      this.render();  // re-render
      this.options.renderTextOnly = false;
    },
    isSeparator: function () {
      return this.model.isSeparator();
    },

    closeDropdown: function () {
      var dropdownEl = this.$el.closest('li.binf-dropdown.binf-open');
      var dropdownToggleEl = dropdownEl.find('.binf-dropdown-toggle');
      dropdownToggleEl.binf_dropdown('toggle');
    },

    _handleClick: function (event) {
      if (this._isSubmenu()) {
        return;
      }
      event.preventDefault();
      if (this.model.get('menuWithMoreOptions') === true) {
        event.stopPropagation();
      } else {
        this.closeDropdown();
      }

      var args = {toolItem: this.model};
      this.triggerMethod('before:toolitem:action', args);
      if (!args.cancel) {
        this.triggerMethod('toolitem:action', args);
      }
    },

    _isSubmenu: function () {
      return this.model.has('subItems');
    },

    onRender: function () {
      if (this._isSubmenu()) {
        this.renderSubmenu();
      }
    },

    onDomRefresh: function () {
      if (this._isSubmenu()) {
        this._doSubmenuDomRefresh();
      }
    },

    _doSubmenuDomRefresh: function () {
      if (this.$el.parent('.csui-toolbar, .csui-table-actionbar > ul.binf-nav').length) {
        this.$el.addClass('binf-pull-down');
      } else {
        this.$el.removeClass('binf-pull-down');
      }
      if (this.$el.hasClass('binf-open')) {
        this.$el.trigger('click'); // Hide dropdown
      }
    },

    renderSubmenu: function () {
      var that           = this,
          collection     = new Backbone.Collection(this.model.get('subItems'),
              {model: ToolItemModel}),
          submenuOptions = _.defaults({collection: collection}, this.options);
      require(['csui/controls/toolbar/submenu.toolitems.view'], function (SubmenuToolItemsView) {
        that.createSubmenu.call(that, SubmenuToolItemsView, submenuOptions);
      });
      this.$el.off('dom:refresh.submenu').on('dom:refresh.submenu',
          _.bind(this._doSubmenuDomRefresh, this));
    },

    createSubmenu: function (SubmenuToolItemsView, submenuOptions) {
      this.$el.binf_dropdown_submenu();
      this.submenu && this.submenu.destroy();
      this.submenu = new SubmenuToolItemsView(submenuOptions);
      this.submenu.render();
      this.submenu.$el.addClass('binf-dropdown-menu');
      this.$el.append(this.submenu.$el);
      this.listenTo(this.submenu, 'childview:before:toolitem:action', function (childView, args) {
        this.triggerMethod('before:toolitem:action', args);
      });
      this.listenTo(this.submenu, 'childview:toolitem:action', function (childView, args) {
        this.triggerMethod('toolitem:action', args);
      });
      this.$el.off('binf.dropdown.submenu.after.show')
          .on('binf.dropdown.submenu.after.show', _.bind(this._positionSubmenu, this));
    },

    _positionSubmenu: function () {
      var $dropdown           = this.submenu.$el,
          isRtl               = i18n && i18n.settings.rtl,
          viewportWidth       = (window.innerWidth || document.documentElement.clientWidth),
          bounding            = this.el.getBoundingClientRect(),
          isPullDown          = this.$el.hasClass('binf-pull-down'),
          startPosition       = isPullDown === isRtl ? bounding.right : bounding.left,
          rightSpaceAvailable = isRtl ? startPosition : (viewportWidth - startPosition),
          leftSpaceAvailable  = isRtl ? (viewportWidth - bounding.right) : bounding.left;
      this.$el.removeClass("binf-dropdown-menu-left binf-dropdown-menu-right");
      $dropdown.css({'left': '', 'right': '', 'top': '', 'bottom': '', 'position': ''});
      $dropdown.removeAttr('style');
      $dropdown.removeClass(
          'csui-fixed-submenu csui-perfect-scrolling csui-normal-scrolling csui-no-scroll-x');
      if (rightSpaceAvailable < $dropdown.width() ||
          (this.$el.parent().closest('.binf-dropdown-submenu').hasClass(
              'binf-dropdown-menu-left') && leftSpaceAvailable > $dropdown.width())) {
        this.$el.addClass('binf-dropdown-menu-left');

      }
      this.$el.removeClass("binf-dropup"); // Default toward down

      var ulOffset = $dropdown.offset();
      var spaceUp = (ulOffset.top - $dropdown.outerHeight()) - $(window).scrollTop();
      var spaceDown = $(window).scrollTop() + $(window).height() -
                      (ulOffset.top + $dropdown.outerHeight());
      if ((spaceDown < 0 && (spaceUp >= 0 || spaceUp > spaceDown)) ||
          (this.$el.parent().closest('.binf-dropdown-submenu').hasClass('binf-dropup') && spaceUp >
           spaceDown)) {
        this.$el.addClass("binf-dropup");
      }
      var scrollOffset = this.$el.parent().scrollTop();
      this.$el.parent().css('overflow', 'visible');
      var viewportOffset = $dropdown[0].getBoundingClientRect(),
          top            = viewportOffset.top - scrollOffset,
          left           = viewportOffset.left,
          documentOffset = $dropdown.offset();
      this.$el.parent().css('overflow', '');
      if (!base.isIE11()) {
        var modalContentElem      = this.$el.parents(".binf-modal-content"),
            closestPerspectivePan = this.$el.closest(".cs-perspective-panel"),
            perspective           = closestPerspectivePan.length > 0 ? closestPerspectivePan :
                                    this.$el.closest(".cs-perspective");
        if (modalContentElem.length > 0) {
          var modalOffset = modalContentElem.offset();
          top = documentOffset.top - modalOffset.top - scrollOffset;
          left = documentOffset.left - modalOffset.left;
        } else if (perspective.length > 0) {
          var perspectiveOffset = perspective.offset();
          top = documentOffset.top - perspectiveOffset.top - scrollOffset;
          left = documentOffset.left - perspectiveOffset.left;
        }
      }
      this.$el.parent().css('overflow', 'visible');
      if (this.$el.hasClass('binf-dropdown-menu-left')) {
        left += (!isPullDown ? this.$el.width() - $dropdown.width() : 0);
      }
     this.$el.parent().css('overflow', '');
      $dropdown.addClass('csui-fixed-submenu');
      $dropdown.css({
        position: 'fixed',
        top: top,
        left: left
      });
      if (PerfectScrollingBehavior.usePerfectScrollbar()) {
        $dropdown.addClass('csui-perfect-scrolling');
        $dropdown.perfectScrollbar({suppressScrollX: true, includePadding: true});
      } else {
        $dropdown.addClass('csui-normal-scrolling csui-no-scroll-x');
      }
      var $scrollParent = this.$el.closest('.binf-dropdown-menu');
      $scrollParent.off('scroll.csui.submenu')
          .on('scroll.csui.submenu', _.bind(function (event) {
            !$dropdown.is(':hidden') && this.$el.binf_dropdown_submenu('hide');
            $scrollParent.off('scroll.csui.inline.actions');
          }, this));
    }
  });

  return ToolItemView;
});
