/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/marionette',
  'csui/lib/numeral', 'csui/lib/moment', 'csui/lib/handlebars',
  'csui/behaviors/default.action/default.action.behavior',
  'i18n', 'hbs!conws/utils/previewpane/impl/previewheader',
  'css!conws/utils/icons/icons'
], function (_, Marionette, numeral, moment, Handlebars,
    DefaultActionBehavior, i18n, headerTemplate) {
  var PreviewHeaderView = Marionette.ItemView.extend({

    constructor: function PreviewHeaderView() {
      Marionette.ItemView.apply(this, arguments);
    },

    className: 'preview-header',
    template: headerTemplate,
    templateHelpers: function () {
      return {
        defaultActionUrl: DefaultActionBehavior.getDefaultActionNodeUrl(this.model)
      }
    }
  });

  return PreviewHeaderView;
});
