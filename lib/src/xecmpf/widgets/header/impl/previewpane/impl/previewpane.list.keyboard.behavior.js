/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', 'csui/lib/marionette'
], function (module, _, $, log, Marionette) {
  'use strict';

  var TabPosition = {
    none: -1,
    list: 1
  };

  var PreviewPaneListKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function PreviewPaneListKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;
      this.tabableElements = [];

      var self = this;

      this.listenTo(view, 'show', function () {
        self.refreshTabableElements(view);
      });
      this.listenTo(view, 'click:item', function (item) {
        var selIndex = view.selectedIndex;
        var selectedElem = view.selectedIndexElem(selIndex);
        selectedElem && selectedElem.prop('tabindex', '-1');
        view.currentTabPosition = TabPosition.list;
        view.selectedIndex = view.collection.indexOf(item.model);
      });

      _.extend(view, {


        _focusList: function () {
          if (this.selectedIndex < 0 || this.selectedIndex === undefined) {
            this.selectedIndex = this.getSelectedIndex();
          }
          this.currentTabPosition = TabPosition.list;
          return this.getSelectedItem().$el;
        },

        _setFocus: function () {

            return this._focusList();
        },

        _listIsInFocus: function () {
          var inFocus = false;
          var i;
          for (i = 0; i < this.collection.length; i++) {
            var $elem = this.selectedIndexElem(i);
            if ($elem && $elem.is(":focus")) {
              inFocus = true;
              break;
            }
          }

          return inFocus;
        },

        _checkFocusAndSetCurrentTabPosition: function () {
          if (this._listIsInFocus()) {
            this.currentTabPosition = TabPosition.list;
          } else {
            this.currentTabPosition = TabPosition.none;
          }
        },
        _setFirstAndLastFocusable: function () {
          this.getSelectedItem() && this.getSelectedItem().$el.prop('tabindex', '0');
        },

        currentlyFocusedElement: function (event) {
          this._checkFocusAndSetCurrentTabPosition();
          this._setFirstAndLastFocusable();
          if (event && event.shiftKey) {
            return this._focusList();
          }
          if (this.currentTabPosition === TabPosition.list) {
            return this._focusList();
          } else {
            return this._setFocus();
          }
        },

        _resetFocusedListElem: function () {
          var selIndex, selectedElem;
          selIndex = this.selectedIndex;
          selectedElem = this.selectedIndexElem(selIndex);
          selectedElem && selectedElem.prop('tabindex', '-1');
          selIndex = this.getSelectedIndex();
          selectedElem = this.selectedIndexElem(selIndex);
          if (selectedElem) {
            selectedElem.prop('tabindex', '0');
            this.selectedIndex = selIndex;
          }
        },

        _moveTo: function (event, $elem, $preElem) {
          event.preventDefault();
          event.stopPropagation();
          setTimeout(_.bind(function () {
            $preElem && $preElem.prop('tabindex', '-1');
            $elem.prop('tabindex', '0');
            $elem.trigger("focus");
          }, this), 50);
        },

        onKeyInView: function (event) {
          this._checkFocusAndSetCurrentTabPosition();
          if (event.keyCode === 9) {
            if (event.shiftKey) {  // shift tab -> activate previous region
              setTimeout(_.bind(function () {
                this._resetFocusedListElem();
              }, this), 50);
            }
          } else if (event.keyCode === 32 || event.keyCode === 13) {
            if (this.currentTabPosition === TabPosition.list) {
              event.preventDefault();
              event.stopPropagation();
              this.selectAt(this.selectedIndex);
            }
          }
          else if (event.keyCode === 27) { // escape
            if (this.previewPane) {
              this.previewPane.hide();
              var but = this.previewPane.parent.$el.find('button');
              if (but){
                but.trigger("focus");
              }
            }
         }

        },

        onKeyDown: function (event) {
          if (this.config.debug === true) {
            console.log('preview-behavior: onKeydown - keyCode:' + event.which );
          }
          this._checkFocusAndSetCurrentTabPosition();
          if (this.currentTabPosition !== TabPosition.list) {
            this.onKeyInView(event);
            return;
          }

          var selIndex = this.selectedIndex;
          if (selIndex < 0 || selIndex === undefined) {
            selIndex = this.getSelectedIndex();
          }
          var $preElem = this.selectedIndexElem(selIndex);

          switch (event.which) {
          case 33: // page up
            this._moveTo(event, this._selectFirst(), $preElem);
            break;
          case 34: // page down
            this._moveTo(event, this._selectLast(), $preElem);
            break;
          case 38: // up
            this._moveTo(event, this._selectPrevious(), $preElem);
            break;
          case 40: // down
            this._moveTo(event, this._selectNext(), $preElem);
            break;
          default:
            this.onKeyInView(event);
            return; // exit this handler for other keys
          }
        },

        _selectFirst: function () {
          this.selectedIndex = 0;
          return this.selectedIndexElem(this.selectedIndex);
        },

        _selectLast: function () {
          this.selectedIndex = this.collection.length - 1;
          return this.selectedIndexElem(this.selectedIndex);
        },

        _selectNext: function () {
          if (this.selectedIndex < 0 || this.selectedIndex === undefined) {
            this.selectedIndex = this.getSelectedIndex();
          }
          if (this.selectedIndex < this.collection.length - 1) {
            this.selectedIndex++;
          }
          return this.selectedIndexElem(this.selectedIndex);
        },

        _selectPrevious: function () {
          if (this.selectedIndex < 0 || this.selectedIndex === undefined) {
            this.selectedIndex = this.getSelectedIndex();
          }
          if (this.selectedIndex > 0) {
            this.selectedIndex--;
          }
          return this.selectedIndexElem(this.selectedIndex);
        },

        selectAt: function (index) {
          if (index >= this.collection.length || index < 0) {
            return;
          }
          var $elem = this.selectedIndexElem(index);
          $elem && $elem.trigger("click");
        }

      });

    }, // constructor

    refreshTabableElements: function (view) {
      log.debug('PreviewPaneListKeyboardBehavior::refreshTabableElements ' +
                view.constructor.name) &&
      console.log(log.last);
      this.view.currentTabPosition = TabPosition.none;
      this.view.selectedIndex = -1;
    }

  });

  return PreviewPaneListKeyboardBehavior;
});
