/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'hbs!xecmpf/widgets/eac/impl/actionplan.header/impl/actionplan.header',
  'i18n!xecmpf/widgets/eac/impl/nls/lang',
  'css!xecmpf/widgets/eac/impl/actionplan.header/impl/actionplan.header'
], function (_, $, Marionette, template, lang) {

  var ActionPlanHeaderView = Marionette.ItemView.extend({

    className: 'xecmpf-actionplan-header',

    template: template,

    events: {
      'keydown .xecmpf-back-button-container': 'onKeyInView',
      'click .cs-go-back': 'onClickBackButton'
    },

    templateHelpers: function () {
      return {
        title: this.model.get('event_name'),
        backTitle: lang.backTitle
      };
    },

    constructor: function ActionPlanHeaderView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        this.onClickBackButton();
      }
    },

    onClickBackButton: function() {
      this.trigger('actionplan:click:back');
    }
  });

  return ActionPlanHeaderView;
});
