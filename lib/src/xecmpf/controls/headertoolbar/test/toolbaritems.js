/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'csui/controls/toolbar/toolitems.factory'
], function (module, ToolItemsFactory, lang) {

  var toolbarItems = {

    FilterToolbar: new ToolItemsFactory({
          main: [
            {
              signature: "test_filter",
              name: "Filter",
              icon: "icon icon-toolbarFilter"
            }
          ]
        },
        {
          maxItemsShown: 1, // force toolbar to immediately start with a drop-down list
          dropDownIcon: "icon icon-toolbar-more"
        }),
    AddToolbar: new ToolItemsFactory({
          main: [
            {
              signature: "test_add",
              name: "Add",
              icon: "icon icon-toolbarAdd"
            }
          ]
        },
        {
          maxItemsShown: 5, // force toolbar to immediately start with a drop-down list
          dropDownIcon: "icon icon-toolbar-more"
        })

  };

  return toolbarItems;

});