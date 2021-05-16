/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/utils/usersettings/usersettings.tab.view',
  'i18n!csui/utils/usersettings/impl/nls/lang'], function (UserSettingsTabView, lang) {
  "use strict";

  return [{
    tabName: "usersettings",
    tabDisplayName: lang.settingsTabTitle,
    tabContentView: UserSettingsTabView,
    showTab: function (model, options) {
      if (options.enableSimpleSettingsModel === true && options.showUserSettings !== undefined) {
        return options.showUserSettings === true;
      }
      return false;
    }
  }];
});