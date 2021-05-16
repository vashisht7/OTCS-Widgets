/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'i18n!csui/controls/version.control.dialog/nls/lang',
  'hbs!csui/controls/version.control.dialog/impl/document.version.control',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/version.control.dialog/behaviors/version.control.dialog.keyboard.navigation.behavior',
  'css!csui/controls/version.control.dialog/impl/version.control.dialog'
], function (_, $, Marionette, lang, template, TabableRegion, VersionControlDialogKeyboardNavigationBehavior) {
  'use strict';

  var DocumentVersionControlView = Marionette.ItemView.extend({
    constructor: function DocumentVersionControlView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },
    className: 'csui-document-version-control-view',
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
        majorMinorVersion: lang.majorAndMinorVersion,
        majorVersion: lang.majorVersion,
        majorMinorExample: lang.majorMinorExample,
        majorVersionExample: lang.majorVersionExample,
        uploadDocument: lang.uploadDocument
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
      return selected[0].value === lang.majorAndMinorVersion ? true : false;
    }
  });
  return DocumentVersionControlView;

});
