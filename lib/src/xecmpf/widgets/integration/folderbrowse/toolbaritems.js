/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'i18n!xecmpf/widgets/integration/folderbrowse/impl/nls/localized.strings',
  'css!xecmpf/widgets/integration/folderbrowse/impl/folderbrowse'
], function (FolderBrowseLang) {
  var toolbarItems = {
    leftToolbar: [
      {
        signature: "WorkspaceHistory",
        name: FolderBrowseLang.BackButtonToolItem,
        icon: "icon arrow_back "
      }
    ],
    rightToolbar: [
      {
        signature: "SearchFromHere",
        name: FolderBrowseLang.SearchToolItem,
        icon: "icon xecmpf-icon-search",
        group: "main",
        className: "csui-search-button"
      },
      {
        signature: "WorkspacePage",
        name: FolderBrowseLang.PageWidgetToolItem,
        icon: "icon csui-icon-open-full-page",
        group: "main",
        options: {
          hAlign: "right"
        },
        commandData: {applyTheme: true}
      }
    ]
  };
  return toolbarItems;
});
