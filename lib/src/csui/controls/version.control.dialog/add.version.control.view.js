/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'hbs!csui/controls/version.control.dialog/impl/add.version.update',
  'i18n!csui/controls/version.control.dialog/nls/lang',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/version.control.dialog/behaviors/version.control.dialog.keyboard.navigation.behavior',
  'css!csui/controls/version.control.dialog/impl/version.control.dialog'
], function (_, $, Marionette, template, lang, TabableRegion, VersionControlDialogKeyboardNavigationBehavior) {
  'use strict';

  var AddVersionControlView = Marionette.ItemView.extend({

    constructor: function AddVersionControlView(options) {
      this.options = options || (options = {});
      this.fileName = options.fileName;
      this.latestMinor = options.latestVersion.get('version_number_major') + "."
                         + (options.latestVersion.get('version_number_minor') + 1);
      this.latestMajor = (options.latestVersion.get('version_number_major') + 1).toFixed(1);
      this.reserved = options.reserved;
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },
    className: 'csui-add-version-update',
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
      var selectVersionlabel = _.str.sformat(lang.selectVersionlabel, this.fileName);
      return {
        minorVersion: this.latestMinor,
        majorVersion: this.latestMajor,
        unreserve: lang.unreserveDocument,
        selectVersionlabel: selectVersionlabel,
        isNotReserved: !this.reserved
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
      return {
        "promoteToMajor": document.querySelector('input[name="version"]').checked ? false : true,
        "reserved": (this.reserved && document.querySelector('input[name="reserve"]').checked) ?
                    true : false
      };
    }
  });
  return AddVersionControlView;
});
