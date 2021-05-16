/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/utils/base',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  'csui-ext!csui/widgets/permissions/impl/permissions.list/toolbaritems'
], function (_, base, lang, ToolItemsFactory, TooItemModel, extraToolItems) {
  'use strict';
  var toolbarItems = {

    inlineToolbar: new ToolItemsFactory({
          other: [
            {
              signature: "ChangeOwnerPermission",
              name: lang.ToolbarItemChangeOwnerPermission,
              icon: "icon icon-owner-change",
              svgId: "themes--carbonfiber--image--generated_icons--action_change_owner32"
            },
            {
              signature: "DeletePermission",
              name: lang.ToolbarItemDeletePermission,
              icon: "icon icon-toolbar-delete",
              svgId: "themes--carbonfiber--image--generated_icons--action_delete32"
            },
            {
              signature: "EditPermission",
              name: lang.ToolbarItemEditPermission,
              icon: "icon icon-toolbar-edit",
              svgId: "themes--carbonfiber--image--generated_icons--action_edit32"
            },
            {
              signature: "ApplyPermission",
              name: lang.ToolbarItemApplyPermission,
              icon: "icon icon-toolbar-share",
              svgId: "themes--carbonfiber--image--generated_icons--action_share32"
            }
          ]
        },
        {
          maxItemsShown: base.isHybrid() ? 1 : 3,
          dropDownText: lang.ToolbarItemMore,
          dropDownIcon: "icon icon-toolbar-more",
          dropDownSvgId: "themes--carbonfiber--image--generated_icons--action_more32"
        })

  };

  if (extraToolItems) {
    addExtraToolItems(extraToolItems);
  }

  function addExtraToolItems(extraToolItems) {
    _.each(extraToolItems, function (moduleToolItems) {
      _.each(moduleToolItems, function (toolItems, key) {
        var targetToolbar = toolbarItems[key];
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
