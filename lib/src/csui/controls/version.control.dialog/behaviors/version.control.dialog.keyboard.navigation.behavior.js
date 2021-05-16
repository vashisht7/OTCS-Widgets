/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette'
], function (_, $, Marionette) {
  'use strict';

var VersionControlDialogKeyboardNavigationBehavior = Marionette.Behavior.extend({

  events: {
    'keydown': 'onKeyInView'
  },

  initialize: function () {
    this.view.keyboardBehavior = this;
  },

  _rebuildFocusableElements: function () {
    this.focusables = this.view.$el.find('input[type="radio"]:checked, input[type="checkbox"]').filter(function (index, elem) {
      return $(elem).is(':visible');
    });
  },

  refreshFocusEngage: function () {
    this._rebuildFocusableElements();
  },

  getCurrentlyFocusedElement: function (shiftTab) {
    if(shiftTab.shiftKey) {
      return $(this.focusables[this.focusables.length - 1]);
    } else {
      return $(this.focusables[0]);
    }
  },

  setFocusInView: function () {
    $(this.focusables[0]).trigger('focus');
  },

  _makeRadiosChecked: function () {
    if(this.radioChanged) {
      this.radioChanged = false;
      this.view.$el.find('*[type="radio"]').filter(function (index, elem) {
        return elem.checked === true;
      }).attr('checked', true);
    }
  },

  isOnLastTabElement: function (shiftTab, event) {
    this._makeRadiosChecked();
    this._rebuildFocusableElements();
    return shiftTab ? event.target === this.focusables[0] : event.target === this.focusables[this.focusables.length - 1];
  },

  onKeyInView: function (event) {
    var keyCode    = event.keyCode;
    switch (keyCode) {
      case 37:
      case 38:
      case 39:
      case 40:
        if($(event.target).is(':radio')) {
          $(event.target).attr('checked', false);
          this.radioChanged = true;
        }
        break;
    }
  }
});

return VersionControlDialogKeyboardNavigationBehavior;

});
