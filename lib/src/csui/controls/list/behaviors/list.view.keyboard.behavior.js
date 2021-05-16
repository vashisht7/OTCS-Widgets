/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', 'csui/lib/marionette'
], function (module, _, $, log, Marionette) {
  'use strict';
  var TabPosition = {
    none: -1,
    search: 0,
    open_perspective: 1,
    list: 2,
    footer: 3
  };

  function stopEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  return Marionette.Behavior.extend({

    constructor: function ListViewKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;
      this.tabableElements = [];

      var self = this;
      this.listenTo(view, 'show', function () {
        self.refreshTabableElements(view);
      });
      this.listenTo(view, 'childview:click:item childview:click:tree:header', function (item) {
        var selIndex = view.selectedIndex;
        var selectedElem = view.getElementByIndex(selIndex);
        selectedElem && selectedElem.prop('tabindex', '-1');
        view.currentTabPosition = TabPosition.list;
        view.selectedIndex = view.collection.indexOf(item.model);
        selectedElem = view.getElementByIndex(view.selectedIndex);
        selectedElem && selectedElem.prop('tabindex', '0');
      });
      this.listenTo(view, 'change:filterValue', function () {
        self.refreshTabableElements(view);
      });
      this.listenTo(view, 'before:collection:scroll:fetch', function () {
        view._beforeCollectionScrollFetch();
      });
      this.listenTo(view, 'collection:scroll:fetch', function () {
        view._afterCollectionScrollFetch();
      });

      _.extend(view, {

        _focusSearchButton: function (event) {
          this.currentTabPosition = TabPosition.search;
          var shiftTab = event && event.shiftKey;
          if (shiftTab) {
            return $(this.ui.searchButton);
          } else if (this._isSearchInputVisible()) {
            return $(this.ui.searchInput);
          } else {
            return $(this.ui.searchButton);
          }
        },

        _isSearchInputVisible: function () {
          return this.ui.searchInput.css &&
                 this.ui.searchInput.css('display') !== 'none';
        },

        _isOpenPerspectiveButtonFocusable: function() {
          return this.ui.openPerspectiveButton.css &&
                 this.ui.openPerspectiveButton.hasClass('cs-open-perspective-button') &&
                 this.ui.openPerspectiveButton.css('display') !== 'none';
        },

        _focusOpenPerspectiveButton:function(/*event*/) {
          this.currentTabPosition = TabPosition.open_perspective;
          return $(this.ui.openPerspectiveButton);
        },

        _focusList: function (event) {
          this.currentTabPosition = TabPosition.list;
          if (this.selectedIndex < 0 || this.selectedIndex > this.collection.length - 1) {
            this.selectedIndex = 0;
          }
          return this.getElementByIndex(this.selectedIndex, event);
        },

        _focusFooter: function () {
          this.currentTabPosition = TabPosition.footer;
          return $(this.ui.tileExpand);
        },

        currentlyFocusedElement: function (event) {
          if (this.isDestroyed) {
            return this.$el;
          }
          var currentTabPosition = this._getCurrentTabPosition();
          if (_.isUndefined(currentTabPosition) || currentTabPosition === TabPosition.none) {
            if (event && event.shiftTab) {
              if (this._isFooterVisible()) {
                currentTabPosition = TabPosition.footer;
              } else {
                currentTabPosition = TabPosition.list;
              }
            } else {
               if (!this.hideSearch) {
                currentTabPosition = TabPosition.search;
              } else {
                 if (this._enableOpenPerspective) {
                  currentTabPosition = TabPosition.open_perspective;
                 } else {
                  currentTabPosition = TabPosition.list;
                 }
              }
            }
          }
          return this._setFocusAtTabPosition(currentTabPosition);
        },

        _setFocusAtTabPosition: function(tabPosition) {
          switch(tabPosition) {
            case TabPosition.search:
                return this._focusSearchButton();
            case TabPosition.open_perspective:
                return this._focusOpenPerspectiveButton();
            case TabPosition.list:
                return this._focusList();
            case TabPosition.footer:
                return this._focusFooter();
          }
        },

        _isFooterInFocus: function () {
          return this.currentTabPosition === TabPosition.footer || this.ui.tileExpand.is(":focus");
        },

        _isFooterVisible: function () {
          return this.ui.tileExpand.css &&
                  this.ui.tileExpand.css('display') !== 'none' &&
                  !this.ui.tileExpand.hasClass('binf-hidden') &&
                  this.ui.tileExpand.hasClass("tile-expand");
        },

        _isFooterFocusable: function() {
          return this._isFooterVisible();
        },

        isMoreActionsDropdownOpen: function () {
          return this.$el.find('.csui-table-cell-name-appendix .csui-table-actionbar' +
                               ' .binf-dropdown-menu').is(':visible');
        },

        _isSearchInFocus: function () {
          return this.currentTabPosition === TabPosition.search ||
                 this.ui.searchButton.is(":focus") ||
                 this.ui.searchInput.is(":focus") ||
                 this.ui.clearer.is(":focus");
        },

        _isOpenPerspectiveButtonInFocus: function () {
          return this.currentTabPosition === TabPosition.title ||
                 this.ui.headerTitle.is(":focus");
        },

        _isSearchButtonVisible: function () {
          return this.ui.searchButton.css &&
                 this.ui.searchButton.css('display') !== 'none' ||
                 (this.ui.searchButton.hasClass && !this.ui.searchButton.hasClass('binf-hidden'));
        },

        _isSearchButtonFocusable: function() {
          return this._isSearchButtonVisible();
        },

        _beforeCollectionScrollFetch: function () {
          this.selectedIndexInFocus = false;
          if (this.selectedIndex >= 0 && this.selectedIndex < this.collection.length) {
            var $elem = this.getElementByIndex(this.selectedIndex);
            if ($elem && $elem.is(":focus")) {
              $elem.prop('tabindex', '-1');
              this.selectedIndexInFocus = true;
            }
          }
        },

        _afterCollectionScrollFetch: function () {
          if (this.selectedIndexInFocus === true &&
              this.selectedIndex >= 0 &&
              this.selectedIndex < this.collection.length) {
            setTimeout(this._setFocusToListElement.bind(this, this.selectedIndex), 100);
          }
        },

        _setFocusToListElement: function(selectedIndex) {
          var $elem = this.getElementByIndex(selectedIndex);
          if ($elem) {
            $elem.prop('tabindex', '0');
            $elem.focus();
          }
        },

        _onKeyInSearchArea: function (event) {
          if (this.ui.searchButton.is(":focus") || this.ui.clearer.is(":focus")) {
            stopEvent(event);
            $(event.target).trigger('click');
          } else if (this.ui.searchInput.is(":focus") && event.keyCode === 13) {  // Enter (13)
            stopEvent(event);
            this.filterChanged(event);
          }
        },

        _moveTo: function (event, $elem, $preElem) {
          stopEvent(event);
          this.trigger('before:keyboard:change:focus');
          $preElem && $preElem.prop('tabindex', '-1');
          $elem && $elem.prop('tabindex', '0');
          $elem && $elem.trigger('focus');
          this.trigger('changed:focus');
          this.trigger('after:keyboard:change:focus');
        },

        onKeyInView: function (event) {
          if (event.keyCode === 9) {  // tab (9)
            this._onTabKey(event);
          } else if (event.keyCode === 32 || event.keyCode === 13) {  // space (32) or enter (13)
            this._onEnterOrSpace(event);
          } else if (event.keyCode === 27) {  // escape (27)
            this._onEscape(event);
          }
        },

        _onTabKey: function (event) {
          if (this._isSearchInFocus() && !this.ui.searchButton.is(":focus")) {
            return;
          }

          this._moveToTabPosition(event, this._getNextTabPosition(event));
        },

        _isListFocusable: function() {
          return this.collection.length > 0;
        },

        _getCurrentTabPosition: function() {
          var curPos = this.currentTabPosition;
          if (this._isSearchInFocus()) {
            curPos = TabPosition.search;
          } else if (this._isOpenPerspectiveButtonInFocus()) {
            curPos = TabPosition.open_perspective;
          } else if (this._isFooterInFocus()) {
            curPos = TabPosition.footer;
          }
          return curPos;
        },

        _isTabPositionFocusable: function(tabPosition) {
          switch(tabPosition) {
            case TabPosition.footer:
              return this._isFooterFocusable();
            case TabPosition.list:
              return this._isListFocusable();
            case TabPosition.open_perspective:
              return this._isOpenPerspectiveButtonFocusable();
            case TabPosition.search:
              return this._isSearchButtonFocusable();
          }
          return false;
        },

        _getFirstTabPosition: function() {
          return TabPosition.search;
        },

        _getLastTabPosition: function() {
          return TabPosition.footer;
        },

        _getValidTabPosition: function (curPos, shiftKey) {
          var i,
              firstTabPosition = this._getFirstTabPosition(),
              lastTabPosition  = this._getLastTabPosition();

          if (shiftKey) {
            for (i = lastTabPosition; i >= firstTabPosition; i--) {
              if (curPos === i && !this._isTabPositionFocusable(i)) {
                curPos--;
              }
            }
          } else {
            for (i = firstTabPosition; i <= lastTabPosition; i++) {
              if (curPos === i && !this._isTabPositionFocusable(i)) {
                curPos++;
              }
            }
          }

          if (curPos < firstTabPosition || curPos > lastTabPosition) {
            return TabPosition.none;
          }

          return curPos;
        },

        _getNextTabPosition: function (event) {
          var curPos = this._getCurrentTabPosition(),
              shiftKey = event.shiftKey;
          if (curPos === TabPosition.none) {
            return;
          }
          shiftKey ? curPos-- : curPos++;
          return this._getValidTabPosition(curPos, shiftKey);
        },

        _moveToTabPosition: function (event, curPos) {
          var func;
          switch (curPos) {
            case TabPosition.search:
              func = this._focusSearchButton;
              break;
            case TabPosition.open_perspective:
              func = this._focusOpenPerspectiveButton;
              break;
            case TabPosition.list:
              func = this._focusList;
              break;
            case TabPosition.footer:
              func = this._focusFooter;
              break;
          }
          if (func) {
              var element = func.apply(this, event);
              if (element && element.length > 0) {
                return this._moveTo(event, element);
              }
          }
        },

        _onEnterOrSpace: function (event) {
          if (this._isSearchInFocus()) {
            this.currentTabPosition = TabPosition.search;
            this._onKeyInSearchArea(event);
          } else {
            stopEvent(event);
            $(event.target).trigger('click');
          }
        },

        _onEscape: function (event) {
          if (this.isMoreActionsDropdownOpen()) {
            return false;
          } else if (this._isSearchInFocus()) {
            var bIsSearchVisible = this.ui.searchInput.is(":visible");
            if (bIsSearchVisible) {
              stopEvent(event);
              this.searchClicked(event);
              setTimeout(_.bind(function () {
                this.ui.searchButton.prop('tabindex', '0');
                this.ui.searchButton.focus();
              }, this), 250);
            }
          }
        },

        onKeyDown: function (event) {
          if (this._isSearchInFocus() || this._isFooterInFocus()) {
            this.onKeyInView(event);
            return;
          }

          var $preElem;  // get this $preElem before any _select*() method call
          switch (event.which) {
          case 33: // page up (30)
          case 36: // home (36)
            $preElem = this.getElementByIndex(this.selectedIndex);
            this._moveTo(event, this._selectFirstListElement(), $preElem);
            break;
          case 34: // page down (34)
          case 35: // end (35)
            $preElem = this.getElementByIndex(this.selectedIndex);
            this._moveTo(event, this._selectLastListElement(event), $preElem);
            break;
          case 38: // arrow up (38)
            if (this.selectedIndex > 0) {
              $preElem = this.getElementByIndex(this.selectedIndex);
              this._moveTo(event, this._selectPreviousListElement(event), $preElem);
            } else {
              stopEvent(event);
            }
            break;
          case 40: // arrow down (40)
            if (this.selectedIndex < this.collection.length - 1) {
              $preElem = this.getElementByIndex(this.selectedIndex);
              this._moveTo(event, this._selectNextListElement(), $preElem);
            } else {
              stopEvent(event);
            }
            break;
          default:
            this.onKeyInView(event);
            return; // exit this handler for other keys
          }
        },

        _selectFirstListElement: function () {
          this.selectedIndex = 0;
          return this.getElementByIndex(this.selectedIndex);
        },

        _selectLastListElement: function (event) {
          var focusableItem;
          var currentIndex = this.selectedIndex;
          if (currentIndex < 0 || currentIndex >= this.collection.length) {
            currentIndex = 0;
          }
          var focusableIndex = this.collection.length;
          while (focusableIndex > currentIndex && !focusableItem) {
            focusableIndex--;
            focusableItem = this.getElementByIndex(focusableIndex, event);
          }
          if (focusableItem) {
            this.selectedIndex = focusableIndex;
            return focusableItem;
          }
          return this.getElementByIndex(this.selectedIndex);  // no change of focus
        },

        _selectNextListElement: function () {
          var focusableItem;
          var focusableIndex = this.selectedIndex;
          if (focusableIndex < 0 || focusableIndex >= this.collection.length) {
            focusableIndex = -1;
          }
          while (focusableIndex < this.collection.length - 1 && !focusableItem) {
            focusableIndex++;
            focusableItem = this.getElementByIndex(focusableIndex);
          }
          if (focusableItem) {
            this.selectedIndex = focusableIndex;
            return focusableItem;
          }
          return this.getElementByIndex(this.selectedIndex);  // no change of focus
        },

        _selectPreviousListElement: function (event) {
          if (this.selectedIndex > 0) {
            this.selectedIndex--;
          }
          return this.getElementByIndex(this.selectedIndex, event);
        }

      });

    }, // constructor

    refreshTabableElements: function (view) {
      log.debug('ListViewKeyboardBehavior::refreshTabableElements ' + view.constructor.name) &&
      console.log(log.last);
      this.view.currentTabPosition = TabPosition.none;
      this.view.selectedIndex = -1;
    }

  });

});
