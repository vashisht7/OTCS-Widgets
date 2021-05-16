/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/lib/marionette',
  'i18n!workflow/controls/proxyuser/impl/nls/lang',
  'hbs!workflow/controls/proxyuser/impl/proxy.user.empty',
  'css!workflow/controls/proxyuser/impl/proxyuser'
], function (_, Marionette, lang, Template) {
  'use strict';
  var EmptyProxyUserView = Marionette.ItemView.extend({
    template: Template,
    className: 'wf-proxy-user-empty',
    templateHelpers: function () {
      return {
        NoProxyUser: lang.NoProxyUser
      };
    },
    constructor: function EmptyProxyUserView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }
  });
  return EmptyProxyUserView;
});