/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'hbs!csui/controls/version.control.dialog/impl/version.control.dialog.header',
  'i18n!csui/controls/version.control.dialog/nls/lang',
  'css!csui/controls/version.control.dialog/impl/version.control.dialog'
], function (_,
    $,
    Marionette,
    VersionControlHeaderTemplate) {
  "use strict";

  var VersionControlHeaderView = Marionette.ItemView.extend({

    template: VersionControlHeaderTemplate,

    templateHelpers: function () {
      return {
        title: this.options.title
      };
    },

    constructor: function VersionControlHeaderView(options) {
      options || (options = {});
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }
  });

  return VersionControlHeaderView;
});