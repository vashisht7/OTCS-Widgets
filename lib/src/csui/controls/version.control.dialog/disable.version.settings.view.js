/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'i18n!csui/controls/version.control.dialog/nls/lang',
  'hbs!csui/controls/version.control.dialog/impl/disable.version.settings',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/version.control.dialog/behaviors/version.control.dialog.keyboard.navigation.behavior'
], function (_, $, Marionette, lang, template, TabableRegion, VersionControlDialogKeyboardNavigationBehavior) {
  'use strict';

  var DisableVersioningView = Marionette.ItemView.extend({
    constructor: function DisableVersioningView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },
    className: 'csui-version-control-dialog-view',
    template: template,

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegion
      },
      VersionControlDialogKeyboardNavigationBehavior: {
        behaviorClass: VersionControlDialogKeyboardNavigationBehavior
      }
    },

    templateHelpers: function () {
      return {
        disableVersioningTitle: lang.disableVersioningTitle,
        currentFolder: lang.currentFolder,
        currentAndSubfolder: lang.currentAndSubfolder
      };
    },

    onAfterShow: function () {
      this.$el.find('*[tabindex]').prop('tabindex', 0);
      this.keyboardBehavior.setFocusInView();
    },

    onDomRefresh: function () {
      this.keyboardBehavior.refreshFocusEngage();
    },

    currentlyFocusedElement: function (shiftTab) {
      return this.keyboardBehavior.getCurrentlyFocusedElement(shiftTab);
    },

    onLastTabElement: function (shiftTab, event) {
      return this.keyboardBehavior.isOnLastTabElement(shiftTab, event);
    },

    getValue: function () {
      var selected = _.filter(document.querySelectorAll('input[name="versioncontrol"]'),
          function (element) {
            return element.checked;
          });
      return selected[0].value === lang.currentFolder ? 0 : 2;
    }
  });
  return DisableVersioningView;

});
