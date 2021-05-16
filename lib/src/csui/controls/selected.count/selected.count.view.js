/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/dialogs/modal.alert/modal.alert',
  "csui/utils/base",
  'hbs!csui/controls/selected.count/impl/selected.count',
  'hbs!csui/controls/selected.count/impl/selected.list.item',
  'i18n!csui/controls/selected.count/impl/nls/lang',
  'css!csui/controls/selected.count/impl/selected.count'
], function (_, $, Backbone, Marionette, NodeTypeIconView,
    PerfectScrollingBehavior, TabableRegionBehavior, ModalAlert,
    base, selectedCountTemplate, selectedListItemTemplate, lang) {
  'use strict';

  var SelectedNodeItemView = Marionette.ItemView.extend({
    className: 'csui-selected-item',
    template: selectedListItemTemplate,
    tagName: 'li',
    events: {
      'keydown': 'onKeyInView'
    },

    modelEvents: {
      'change': 'onModelChange'
    },

    triggers: {
      'click .csui-deselcted-icon': 'remove:selected:item'
    },

    templateHelpers: function () {
      return {
        name: this.options.model.get('name'),
        clearItem: lang.clearItem
      };
    },

    constructor: function SelectedNodeItemView(options) {
      this.model = options.model;
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    onRender: function () {
      this._nodeIconView = new NodeTypeIconView({
        el: this.$('.csui-type-icon').get(0),
        node: this.model
      });
      this._nodeIconView.render();
      this.$el.attr('tabindex', "-1");
      this.$el.attr('role', 'menuitem');
    },

    onModelChange: function () {
      this.render();
    },

    onKeyInView: function (event) {
      this.trigger('keydown:item', event);
    }
  });

  var SelectedCountView = Marionette.CompositeView.extend({

    className: 'csui-selected-count',
    template: selectedCountTemplate,
    templateHelpers: function () {
      var selectedCount = this.collection && this.collection.length;
      return {
        selectedCount: selectedCount,
        clearall: lang.clearall,
        selectedLabel: lang.selectedLabel
      };
    },
    childViewContainer: ".csui-selected-items-dropdown",
    childView: SelectedNodeItemView,
    childEvents: {
      'remove:selected:item': 'onRemoveSelectedItem',
      'keydown:item': 'onKeydownItem'
    },

    ui: {
      selectedCountButton: '.csui-selected-counter-region button',
      selectedCountValue: '.csui-selected-counter-region .csui-selected-counter-value',
      dropdownContainer: '.csui-dropmenu-container',
      clearAll: '.csui-selected-count-clearall',
      ClearAllButton: '.csui-selected-count-clearall > span'
    },
    events: {
      'click @ui.selectedCountButton': 'onClickSelectedCount',
      'click @ui.ClearAllButton': 'onClickClearAll',
      'mouseenter @ui.selectedCountButton': 'onMouseEnterSelectedCounterView',
      'mouseleave @ui.selectedCountButton': 'onMouseLeaveSelectedCounterView',
      'mouseenter @ui.dropdownContainer': 'onMouseEnterSelectedCounterView',
      'mouseleave @ui.dropdownContainer': 'onMouseLeaveSelectedCounterView',
      'mouseup @ui.clearAll': 'onMouseUpClearAll',
      'blur  @ui.selectedCountButton': 'onBlurSelectedCountButton',
      'blur @ui.dropdownContainer': 'onBlurSelectedCounterView',
      'keydown': 'onKeydownSelectedCount',
      'keyup': 'onKeyupItem'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.csui-selected-items-dropdown',
        suppressScrollX: true,
        scrollYMarginOffset: 5
      }
    },

    currentlyFocusedElement: function () {
      return this.ui.selectedCountButton;
    },

    constructor: function SelectedCountView(options) {
      this.collection = options.collection;
      Marionette.CompositeView.prototype.constructor.apply(this, options);
      this.showClearAll = false;
      this.selectedItemInFocus = false;
      this.scrollableParent = options.scrollableParent;
      this.listenTo(this.collection, "reset remove add", function () {
        !this.isDestroyed && this.onCollectionUpdate();
      });
      this.selectedCount = this.collection.length;
      if (!!this.scrollableParent) {
        this.windowResizeHandler = _.bind(this.setDropdownCss, this);
        $(window).on('resize', this.windowResizeHandler);
      }
    },

    onRender: function () {
      if (!this.selectedCount) {
        this.$el.addClass('binf-hidden');
      } else {
        this.ui.dropdownContainer.addClass('binf-hidden');
        $(document).off("mouseup.csui.select.count");
      }
    },

    onDestroy: function () {
      this.stopListening(this.collection, 'reset remove add');
      if (!!this.windowResizeHandler) {
        $(window).off('resize', this.windowResizeHandler);
      }
    },

    onClickClearAll: function (event) {
      this.selectedItemInFocus = true;
      ModalAlert.confirmQuestion(
          _.str.sformat(lang.dialogTemplate, lang.dialogTitle), lang.dialogTitle, {})
          .always(_.bind(function (result) {
            if (result) {
              this.collection.reset([]);
            } else {
              this.ui.ClearAllButton.trigger('focus');
              this._moveTabindexToFocusedElement();
            }
            this.selectedItemInFocus = false;
          }, this));
    },

    onMouseUpClearAll: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.ui.ClearAllButton.trigger('focus');
    },

    isDDOpen: function () {
      return this.ui.dropdownContainer.is(":visible");
    },

    _focusOnSelectedCountButton: function () {
      this.ui.selectedCountButton.trigger('focus');
      this.selectedCountViewInFocus = true;
    },

    onMouseEnterSelectedCounterView: function () {
      this.selectedCountViewInFocus = true;
    },

    onMouseLeaveSelectedCounterView: function () {
      if (this.selectedItemInFocus === false) {
        this.selectedCountViewInFocus = false;
      }
    },

    onClickSelectedCount: function (event) {
      event.preventDefault();
      event.stopPropagation();
      var toggleDropdown = $('.binf-open>.binf-dropdown-toggle');
      if (toggleDropdown.length > 0) {
        toggleDropdown.binf_dropdown('toggle');
      }
      if (this.ui.dropdownContainer.hasClass('binf-hidden')) {
        this._showItemView();
      } else {
        this._hideItemView();
      }
    },

    _showItemView: function () {
      this.selectedCountViewInFocus = true;
      this.ui.dropdownContainer.removeClass('binf-hidden');
      this.ui.selectedCountButton.addClass('binf-open');
      this.ui.selectedCountButton.attr('aria-expanded', 'true');
      if (this.selectedCount > 4) {
        this.showClearAll = true;
        this.ui.clearAll.removeClass('binf-hidden');
      }
      if (!!this.scrollableParent) {
        this.setDropdownCss();
      }
      if (!this.perfectScrollingEnabled) {
        this.triggerMethod("ensure:scrollbar");  // for perfect scrollbar
        this.perfectScrollingEnabled = true;
      }
      if (this.ui.clearAll.hasClass('binf-hidden')) {
        this.ui.dropdownContainer.find('.csui-selected-item:first').trigger('focus');
      } else {
        this.ui.clearAll.find('.csui-selected-count-clearall-label').trigger('focus');
      }
      $(document).on("mouseup.csui.select.count", _.bind(this.onDocumentClick, this));
    },

    onDocumentClick: function (event) {
      if (this.$el[0] !== event.target && !(this.$el).has(event.target).length &&
          !this.selectedItemInFocus) {
        this._hideItemView();
      }
    },

    setDropdownCss: function () {
      var dropdownEle      = this.ui.dropdownContainer.find(".csui-selected-items-dropdown"),
          scrollableParent = $(this.scrollableParent),
          offsetDiff, scrollableParentHeight, elementSetBacks;
      if (!!scrollableParent && scrollableParent.length > 0) {
        scrollableParentHeight = scrollableParent.height();
        elementSetBacks = parseInt(scrollableParent.css("margin-top")) +
                          parseInt(scrollableParent.css("margin-bottom"));
        offsetDiff = dropdownEle.offset().top - scrollableParent.offset().top;
        var heightOfDD = Math.abs(scrollableParentHeight - elementSetBacks);
        dropdownEle.css({
          "max-height": heightOfDD - (24 + offsetDiff) + "px"
        });
        this.trigger("dom:refresh");
      }
    },

    _hideItemView: function (event) {
      this.selectedCountViewInFocus = false;
      this.ui.dropdownContainer.addClass('binf-hidden');
      this.ui.selectedCountButton.removeClass('binf-open');
      this.ui.selectedCountButton.attr('aria-expanded', 'false');
      $(document).off("mouseup.csui.select.count");
    },

    onRemoveSelectedItem: function (view) {
      var currentIndex = view._index, itemViews;
      this.selectedCountViewInFocus = true;
      this.collection.remove(view.model);
      itemViews = _.sortBy(this.children.toArray(), 'cid'); //IE11, returns wrong index and view in each loop;
      if (currentIndex === this.selectedCount) { //if last element
        itemViews[currentIndex - 1] &&
        itemViews[currentIndex - 1].$el.trigger('focus');
      } else {
        itemViews[currentIndex] &&
        itemViews[currentIndex].$el.trigger('focus');
      }
    },

    onCollectionUpdate: function () {
      this.selectedCount = this.collection.length;
      if (this.selectedCount && !this.isDDOpen()) {
        this.$el.removeClass('binf-hidden');
        this.ui.dropdownContainer.addClass('binf-hidden');
        this.trigger('show:counter', true);
      } else if (!this.selectedCount) {
        this.ui.selectedCountButton.removeClass('binf-open');
        this.$el.addClass('binf-hidden');
        $(document).off("mouseup.csui.select.count");
        this.trigger('show:counter', false);
      }
      this.ui.selectedCountValue.text(this.selectedCount);
      var titleText = _.str.sformat(lang.selectedTitle, this.selectedCount);
      this.ui.selectedCountButton.attr('aria-label', titleText);
      this.ui.selectedCountButton.attr('title', titleText);
      if (!this.showClearAll && this.selectedCount > 4) {
        this.showClearAll = true;
        this.ui.clearAll.removeClass('binf-hidden');
      } else if (this.selectedCount <= 4 && this.showClearAll) {
        this.showClearAll = false;
        this.ui.clearAll.addClass('binf-hidden');
      }
      if (this.selectedCount > 0) {
        this._moveTabindexToFocusedElement();
      }
    },

    _moveTabindexToFocusedElement: function () {
      this._focusableElements = base.findFocusables(this.el);
      for (var i = 0; i < this._focusableElements.length; i++) {
        this._focusableElements[i].setAttribute('tabindex', '0');
      }
    },

    onBlurSelectedCountButton: function (event) {
      if (!this.selectedCountViewInFocus) {
        this._hideItemView();
      }
    },

    onBlurSelectedCounterView: function (event) {
      if (!this.selectedCountViewInFocus) {
        this._hideItemView();
      }
    },

    onKeydownSelectedCount: function (event) {
      switch (event.keyCode) {
      case 9:  //tab
        if (this.ui.selectedCountButton.is(':not(:focus)')) {
          event.preventDefault();
          event.stopPropagation();
        }
        this.selectedCountViewInFocus = false;
        this.ui.selectedCountButton.trigger('focus');
        break;
      case 13: //Enter
      case 32: //Space
        if (this.ui.selectedCountButton.is(':focus')) {
          this.selectedCountViewInFocus = true;
          this.onClickSelectedCount(event);
        }
        break;
      case 46: //Delete
        if (this.ui.ClearAllButton.is(':focus')) {
          this.selectedCountViewInFocus = true;
          this.onClickClearAll(event);
        }
        break;
      case 40: //arrow down
        var itemViews = _.sortBy(this.children.toArray(), 'cid'); //IE11, returns wrong index and view in each loop;
        this.selectedCountViewInFocus = true;
        event.preventDefault();
        if (this.ui.ClearAllButton.is(':focus')) {
          itemViews[0].$el.trigger('focus');
        }
        break;
      case 37: //arrow left
        event.stopPropagation();
        break;
      case 39: //arrow right
        event.stopPropagation();
        break;

      }
    },

    onKeydownItem: function (view, event) {
      var itemViews = _.sortBy(this.children.toArray(), 'cid'); //IE11, returns wrong index and view in each loop;
      event.preventDefault();
      switch (event.keyCode) {
      case 46: //Delete
        this.onRemoveSelectedItem(view);
        event.stopPropagation();
        break;
      case 40: //arrow down
        this.selectedCountViewInFocus = true;
        view._index === (this.selectedCount - 1) ?
        itemViews[view._index].$el.trigger('focus') :
        itemViews[view._index + 1].$el.trigger('focus');
        event.stopPropagation();
        break;
      case 38: //arrow up
        this.selectedCountViewInFocus = true;
        view._index ? itemViews[view._index - 1].$el.trigger('focus') :
        this.ui.ClearAllButton.trigger('focus');
        event.stopPropagation();
        break;
      case 37: //arrow left
        event.stopPropagation();
        break;
      case 39: //arrow right
        event.stopPropagation();
        break;
      }
    },

    onKeyupItem: function (event) {
      if (event.keyCode === 27 && this.isDDOpen()) { //Esc on select counter view should close Drop-down first
        event.preventDefault();
        event.stopPropagation();
        this._hideItemView();
        this._focusOnSelectedCountButton();
      }
    }

  });
  return SelectedCountView;

});
