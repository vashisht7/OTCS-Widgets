/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  'csui-ext!conws/widgets/relatedworkspaces/headermenuitems'
], function (_, lang, ToolItemsFactory, TooItemModel, extraMenuItems) {

  var toolbarItems = {
    headerMenuToolbar: new ToolItemsFactory({
          other: [] // empty list. no menu is displayed.
        },
        {
          maxItemsShown: 0, // force toolbar to immediately start with a drop-down list
          dropDownIcon: "icon icon-expandArrowDown"
        }
    )
  };

  if (extraMenuItems) {
    _.each(extraMenuItems, function (moduleMenuItems) {
      _.each(moduleMenuItems, function (menuItems, key) {
        var targetToolbar = toolbarItems[key];
        if (!targetToolbar) {
          throw new Error('Invalid target toolbar: ' + key);
        }
        _.each(menuItems, function (menuItem) {
          menuItem = new TooItemModel(menuItem);
          targetToolbar.addItem(menuItem);
        });
      });
    });
  }

  return toolbarItems;

});
