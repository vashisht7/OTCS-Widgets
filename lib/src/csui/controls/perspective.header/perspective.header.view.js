/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'hbs!csui/controls/perspective.header/impl/perspective.header',
  'i18n!csui/controls/perspective.header/impl/nls/lang',
  'css!csui/controls/perspective.header/impl/perspective.header'
], function (_, $, Marionette, headerTemplate, lang) {

  var PerspectiveHeaderView = Marionette.ItemView.extend({

    className: 'csui-perspective-toolbar-container',

    template: headerTemplate,

    ui: {
      headerControl: '.cs-header-control'
    },

    events: {
      'keydown': 'onKeyInView',
      'click .cs-go-back': 'onBackButton'
    },

    templateHelpers: function () {
      return {
        icon: this.options.icon,
        title: this.options.title,
        backTitle: lang.backTitle
      };
    },

    constructor: function DialogHeaderView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);
    },

    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        this.onBackButton();
      }
    },

    onBackButton: function() {
      var context = this.options.context,
          viewStateModel = context && context.viewStateModel;
      if (viewStateModel) {
        viewStateModel.restoreLastRouter();
      }
    }
  });

  return PerspectiveHeaderView;
});
