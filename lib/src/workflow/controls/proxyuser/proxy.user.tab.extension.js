/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore',
    'csui-ext!workflow/controls/proxyuser/proxy.user.tab.extension',
    'workflow/controls/proxyuser/proxy.user.tab.view',
    'i18n!workflow/controls/proxyuser/impl/nls/lang'
  ],
  function (_, RegisterdTabs, ProxyTabView, lang) {
    'use strict';
    var workflowTab = {
        tabName: "proxyTab",
        tabDisplayName: lang.ProxiesTabDisplayName,
        tabContentView: ProxyTabView
      },
      extraTabs = [],
      egovProxyTab;

    if (RegisterdTabs) {
      extraTabs = _.flatten(RegisterdTabs, true);
      egovProxyTab = _.find(extraTabs, function (tab) {
        return tab.isEgovProxyTab;
      });
    }
    if (!egovProxyTab) {
      extraTabs.push(workflowTab);
    }
    return extraTabs;
  });