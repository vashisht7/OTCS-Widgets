/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'hbs!conws/widgets/header/impl/collapse/collapse',
  'i18n!conws/widgets/header/impl/nls/header.lang',
  'css!conws/widgets/header/impl/collapse/collapse'
], function ($, _, Marionette, template, lang) {
  'use strict';

  var CollapseView = Marionette.ItemView.extend({

    className: 'conws-collapse',

    template: template,

    events: {
      'keydown': 'onKeyInView',
      'click': '_executeCollapse'
    },

    constructor: function CollapseView(options) {
      this.options = options || {};
      this.options.title = lang.CollapsePageOverlay;
      this.options.icon = "icon conws-collapse-icon";
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },
    templateHelpers: function () {
      var obj = {
        title: this.options.title,
        icon: this.options.icon
      };
      return obj;
    },

    onKeyInView: function (event) {
      var target = $(event.target);
      if (event.keyCode === 13 || event.keyCode === 32) {  // enter(13) and space(32)
        this._executeCollapse(event);
      }
    },

    _executeCollapse: function (e) {
      var parent = window.opener ? window.opener :
                   window !== window.parent ? window.parent : undefined
      if (parent) {
        parent.postMessage({"status": "closeDialog"}, "*");
      }
    }
  });
  return CollapseView;
});