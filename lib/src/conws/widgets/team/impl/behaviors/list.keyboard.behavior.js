/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette'
], function (module, _, $, Marionette) {
  'use strict';

  var ListKeyboardBehavior = Marionette.Behavior.extend({

    defaults: {
      'currentlyFocusedElementSelector': 'li:nth-child({0})'
    },

    constructor: function ListKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      _.extend(view, {
        selectedIndex: 0,
        onKeyDown: function (e) {
          var $preElem = this.currentlyFocusedElement();

          switch (e.keyCode) {
          case 38: // up
            this._moveTo(e, this._selectPrevious(), $preElem);
            break;
          case 40: // down
            this._moveTo(e, this._selectNext(), $preElem);
            break;
          }
        },

        _moveTo: function (event, $elem, $preElem) {
          event.preventDefault();
          event.stopPropagation();

          setTimeout(_.bind(function () {
            $preElem && $preElem.prop('tabindex', '-1');
            $elem.prop('tabindex', '0');
            $elem.trigger('focus');
          }, this), 50);
        },

        _selectNext: function () {
          var collection = this.model || this.collection;
          if (this.selectedIndex < collection.length - 1) {
            this.selectedIndex++;
          }
          return this.currentlyFocusedElement();
        },

        _selectPrevious: function () {
          if (this.selectedIndex > 0) {
            this.selectedIndex--;
          }
          return this.currentlyFocusedElement();
        },

        currentlyFocusedElementSelector: this.options.currentlyFocusedElementSelector,

        currentlyFocusedElement: function () {
          var collection = this.model || this.collection;
          if ((this.selectedIndex !== 0) && (this.selectedIndex >= collection.length)) {
            this.selectedIndex = collection.length - 1;
          }
          var $item = this.$(_.str.sformat(this.currentlyFocusedElementSelector, this.selectedIndex + 1));
          var elementOfFocus = ($item.length !== 0) ? this.$($item[0]) : null;
          return elementOfFocus;
        }
      });
    } // constructor
  });

  return ListKeyboardBehavior;
});
