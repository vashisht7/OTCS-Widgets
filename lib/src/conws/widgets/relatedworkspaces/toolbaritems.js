/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'i18n!conws/utils/workspaces/impl/nls/lang',
  'i18n!conws/widgets/relatedworkspaces/impl/nls/lang',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  'csui/widgets/favorites/favorite.star.view',
  'csui-ext!conws/widgets/relatedworkspaces/toolbaritems'
], function (_, wksplang, lang, ToolItemsFactory, TooItemModel, FavoriteStarView,
    extraToolItems) {
  'use strict';
  var toolbarItems = {

    addToolbar: new ToolItemsFactory(
        {
          main: [
            {
              signature: "AddRelation",
              name: lang.ToolbarItemAddRelation,
              icon: "icon icon-toolbarAdd"
            }
          ]
        },
        {
          maxItemsShown: 2,
          dropDownIcon: "icon icon-toolbar-more",
          dropDownText: "...",
          addTrailingDivider: false
        }),
    tableHeaderToolbar: new ToolItemsFactory({
        main: [
          {
            signature: "RemoveRelation",
            name: lang.ToolbarItemRemoveRelation
          }
        ]
      },
      {
        maxItemsShown: 15,
        dropDownIcon: "icon icon-toolbar-more",
        dropDownText: "...",
        addGroupSeparators: false,
        lazyActions: true
      }),
    rightToolbar: new ToolItemsFactory({
      main: [
        {
          signature: "CloseExpandedView",
          name: wksplang.ToolbarItemCloseExpandedView,
          icon: "icon icon-tileCollapse"
        }
     ]
    }, {
      hAlign: "right",
      maxItemsShown: 5,
      dropDownIcon: "icon icon-toolbar-more",
      dropDownText: "...",
      addTrailingDivider: false
    })
  };

  if (extraToolItems) {
    _.each(extraToolItems, function (moduleToolItems) {
      _.each(moduleToolItems, function (toolItems, key) {
        var targetToolbar = toolbarItems[key];
        if (!targetToolbar && key === 'otherToolbar') {
          targetToolbar = toolbarItems['tableHeaderToolbar'];
        }
        if (!targetToolbar) {
          throw new Error('Invalid target toolbar: ' + key);
        }
        _.each(toolItems, function (toolItem) {
          toolItem = new TooItemModel(toolItem);
          targetToolbar.addItem(toolItem);
        });
      });
    });
  }

  return toolbarItems;
});
