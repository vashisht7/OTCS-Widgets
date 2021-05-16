/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/controls/toolbar/toolitems.factory',
  'i18n!xecmpf/widgets/eac/impl/nls/lang',
  'css!xecmpf/widgets/eac/impl/eac'
], function (ToolItemsFactory, lang) {
  var toolbarItems = {

    leftToolbar: {
      OtherToolbar: new ToolItemsFactory({
        main: [{
          signature: "EACBack",
          name: lang.ToolbarItemBack,
          toolItemAria: lang.ToolbarItemBackAria,
          icon: "icon icon-arrowBack"

        }, {
          signature: "Filter",
          name: lang.ToolbarItemFilter,
          icon: "icon icon-toolbarFilter",
          toolItemAria: lang.ToolbarItemFilterAria,
          toolItemAriaExpand: false
        }]
      })
    },


    rightToolbar: {
      OtherToolbar: new ToolItemsFactory({
        main: [{
          signature: "EACRefresh",
          name: lang.ToolbarItemRefresh,
          icon: "icon icon-refresh",
          toolItemAria: lang.ToolbarItemRefreshAria,
          commandData: { useContainer: true }
        }]
      })
    }
  };
  return toolbarItems;
});
