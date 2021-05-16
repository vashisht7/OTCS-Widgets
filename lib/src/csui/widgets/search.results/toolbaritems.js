/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'i18n!csui/widgets/search.results/nls/lang',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  'csui-ext!csui/widgets/search.results/toolbaritems',
  'csui/widgets/search.results/impl/toolbaritems'
], function (_, publicLang, lang, ToolItemsFactory, TooItemModel, extraToolItems,
    oldExtraToolItems) {
  'use strict';
  var toolbarItems = {

    filterToolbar: new ToolItemsFactory({
          filter: [
            {
              signature: "Filter",
              name: lang.ToolbarItemFilter,
              icon: "icon icon-toolbarFilter",
              svgId: "themes--carbonfiber--image--generated_icons--action_filter32"
            }
          ]
        },
        {
          addTrailingDivider: false
        }),
    tableHeaderToolbar: new ToolItemsFactory({
          info: [
            {
              signature: "Properties",
              name: lang.ToolbarItemInfo,
              icon: "icon icon-toolbar-metadata",
              svgId: "themes--carbonfiber--image--generated_icons--action_properties32"
            },
            {
              signature: "CopyLink",
              name: lang.ToolbarItemCopyLink
            }
          ],
          edit: [
            {signature: "Edit", name: lang.ToolbarItemEdit, flyout: "edit", promoted: true},
            {signature: "EditActiveX", name: "EditActiveX", flyout: "edit"},
            {signature: "EditOfficeOnline", name: "EditOfficeOnline", flyout: "edit"},
            {signature: "EditWebDAV", name: "EditWebDAV", flyout: "edit"}
          ],
          share: [
            {
              signature: 'SendTo',
              name: lang.ToolbarItemSendTo,
              flyout: 'sendto',
              group: 'share'
            },
            {
              signature: 'Share',
              name: lang.ToolbarItemShare,
              flyout: 'share',
              promoted: true,
              group: 'share'
            },
            {
              signature: 'EmailLink',
              name: lang.ToolbarItemEmailLink,
              flyout: 'sendto',
              promoted: true,
              group: 'share'
            }
          ],
          main: [
            {signature: "InlineEdit", name: lang.ToolbarItemRename, onlyInTouchBrowser: true},
            {signature: "permissions", name: lang.ToolbarItemPermissions},
            {signature: "Download", name: lang.ToolbarItemDownload},
            {signature: "ReserveDoc", name: publicLang.ToolbarItemReserve},
            {signature: "UnreserveDoc", name: publicLang.ToolbarItemUnreserve},
            {signature: "Copy", name: lang.ToolbarItemCopy},
            {signature: "Move", name: lang.ToolbarItemMove},
            {signature: "AddVersion", name: lang.ToolbarItemAddVersion},
            {signature: "Collect", name: lang.ToolbarCollect},
            {signature: "Delete", name: lang.ToolbarItemDelete},
            {signature: "RemoveCollectedItems", name: lang.ToolbarItemRemoveCollectionItems},
            {signature: "ZipAndDownload", name: lang.MenuItemZipAndDownload}
          ],
          shortcut: [
            {signature: "OriginalCopyLink", name: lang.ToolbarItemOriginalCopyLink},
            {signature: "OriginalEdit", name: lang.ToolbarItemOriginalEdit},
            {signature: "OriginalEmailLink", name: lang.ToolbarItemOriginalShare},
            {signature: "OriginalReserveDoc", name: publicLang.ToolbarItemOriginalReserve},
            {signature: "OriginalUnreserveDoc", name: publicLang.ToolbarItemOriginalUnreserve},
            {signature: "OriginalCopy", name: lang.ToolbarItemOriginalCopy},
            {signature: "OriginalMove", name: lang.ToolbarItemOriginalMove},
            {signature: "OriginalAddVersion", name: lang.ToolbarItemAddVersion},
            {signature: "OriginalDownload", name: lang.ToolbarItemOriginalDownload},
            {signature: "OriginalDelete", name: lang.ToolbarItemOriginalDelete}
          ]
        },
        {
          maxItemsShown: 15,
          dropDownIcon: "icon icon-toolbar-more",
          dropDownSvgId: "themes--carbonfiber--image--generated_icons--action_more32",
          dropDownText: lang.ToolbarItemMore,
          addGroupSeparators: false,
          lazyActions: true
        }),
    otherToolbar: new ToolItemsFactory({
          info: [
            {
              signature: "Properties",
              name: lang.ToolbarItemInfo,
              icon: "icon icon-toolbar-metadata",
              svgId: "themes--carbonfiber--image--generated_icons--action_properties32"
            },
            {
              signature: "CopyLink",
              name: lang.ToolbarItemCopyLink
            }
          ],
          edit: [
            {signature: "Edit", name: lang.ToolbarItemEdit, flyout: "edit", promoted: true},
            {signature: "EditActiveX", name: "EditActiveX", flyout: "edit"},
            {signature: "EditOfficeOnline", name: "EditOfficeOnline", flyout: "edit"},
            {signature: "EditWebDAV", name: "EditWebDAV", flyout: "edit"}
          ],
          share: [
            {
              signature: 'SendTo',
              name: lang.ToolbarItemSendTo,
              flyout: 'sendto',
              group: 'share'
            },
            {
              signature: 'Share',
              name: lang.ToolbarItemShare,
              flyout: 'share',
              promoted: true,
              group: 'share'
            },
            {
              signature: 'EmailLink',
              name: lang.ToolbarItemEmailLink,
              flyout: 'sendto',
              promoted: true,
              group: 'share'
            }
          ],
          main: [
            {signature: "permissions", name: lang.ToolbarItemPermissions},
            {signature: "Download", name: lang.ToolbarItemDownload},
            {signature: "ReserveDoc", name: publicLang.ToolbarItemReserve},
            {signature: "UnreserveDoc", name: publicLang.ToolbarItemUnreserve},
            {signature: "Copy", name: lang.ToolbarItemCopy},
            {signature: "Move", name: lang.ToolbarItemMove},
            {signature: "AddVersion", name: lang.ToolbarItemAddVersion},
            {signature: "Collect", name: lang.ToolbarCollect},
            {signature: "Delete", name: lang.ToolbarItemDelete},
            {signature: "ZipAndDownload", name: lang.MenuItemZipAndDownload}
          ]
        },
        {
          maxItemsShown: 5,
          dropDownText: lang.ToolbarItemMore,
          dropDownIcon: "icon icon-toolbar-more",
          dropDownSvgId: "themes--carbonfiber--image--generated_icons--action_more32",
          addGroupSeparators: false,
          lazyActions: true
        }),
    inlineToolbar: new ToolItemsFactory({
          info: [
            {
              signature: "Properties",
              name: lang.ToolbarItemInfo,
              icon: "icon icon-toolbar-metadata",
              svgId: "themes--carbonfiber--image--generated_icons--action_properties32"
            },
            {
              signature: "CopyLink",
              name: lang.ToolbarItemCopyLink,
              icon: "icon icon-toolbar-copylink",
              svgId: "themes--carbonfiber--image--generated_icons--action_copy_link32"
            }
          ],
          edit: [
            {
              signature: "Edit",
              name: lang.ToolbarItemEdit,
              icon: "icon icon-toolbar-edit",
              svgId: "themes--carbonfiber--image--generated_icons--action_edit32"
            }
          ],
          share: [
          ],
          other: [
            {
              signature: "permissions",
              name: lang.ToolbarItemPermissions,
              icon: "icon icon-toolbar-permissions",
              svgId: "themes--carbonfiber--image--generated_icons--action_view_perms32"
            },
            {
              signature: "Download",
              name: lang.ToolbarItemDownload,
              icon: "icon icon-toolbar-download",
              svgId: "themes--carbonfiber--image--generated_icons--action_download32"
            },
            {
              signature: "ReserveDoc",
              name: publicLang.ToolbarItemReserve,
              icon: "icon icon-toolbar-reserve",
              svgId: "themes--carbonfiber--image--generated_icons--action_reserve32"
            },
            {
              signature: "UnreserveDoc",
              name: publicLang.ToolbarItemUnreserve,
              icon: "icon icon-toolbar-unreserve",
              svgId: "themes--carbonfiber--image--generated_icons--action_reserve32"
            },
            {
              signature: "Copy",
              name: lang.ToolbarItemCopy,
              icon: "icon icon-toolbar-copy",
              svgId: "themes--carbonfiber--image--generated_icons--action_copy32"
            },
            {
              signature: "Move",
              name: lang.ToolbarItemMove,
              icon: "icon icon-toolbar-move",
              svgId: "themes--carbonfiber--image--generated_icons--action_move32"
            },
            {
              signature: "AddVersion",
              name: lang.ToolbarItemAddVersion,
              icon: "icon icon-toolbar-add-version",
              svgId: "themes--carbonfiber--image--generated_icons--action_add_version32"
            },
            {
              signature: "Collect",
              name: lang.ToolbarCollect,
              icon: "icon icon-toolbar-actioncollect",
              svgId: "themes--carbonfiber--image--generated_icons--action_collect32"
            },
            {
              signature: "Delete",
              name: lang.ToolbarItemDelete,
              icon: "icon icon-toolbar-delete",
              svgId: "themes--carbonfiber--image--generated_icons--action_delete32"
            },
            {
              signature: "ZipAndDownload",
              name: lang.MenuItemZipAndDownload,
              icon: "icon icon-toolbar-download",
              svgId: "themes--carbonfiber--image--generated_icons--action_download32"
            }
          ]
        },
        {
          maxItemsShown: 5,
          dropDownText: lang.ToolbarItemMore,
          dropDownIcon: "icon icon-toolbar-more",
          dropDownSvgId: "themes--carbonfiber--image--generated_icons--action_more32",
          addGroupSeparators: false
        }),
    tabularInlineToolbar: new ToolItemsFactory({
          info: [
            {
              signature: "Properties",
              name: lang.ToolbarItemInfo,
              icon: "icon icon-toolbar-metadata",
              svgId: "themes--carbonfiber--image--generated_icons--action_properties32"
            },
            {
              signature: "CopyLink",
              name: lang.ToolbarItemCopyLink,
              icon: "icon icon-toolbar-copylink",
              svgId: "themes--carbonfiber--image--generated_icons--action_copy_link32"
            }
          ],
          edit: [
            {
              signature: "Edit",
              name: lang.ToolbarItemEdit,
              icon: "icon icon-toolbar-edit",
              svgId: "themes--carbonfiber--image--generated_icons--action_edit32"
            }
          ],
          share: [
           
          ],       
          other: [
            {
              signature: "permissions",
              name: lang.ToolbarItemPermissions,
              icon: "icon icon-toolbar-permissions",
              svgId: "themes--carbonfiber--image--generated_icons--action_view_perms32"
            },
            {
              signature: "Download",
              name: lang.ToolbarItemDownload,
              icon: "icon icon-toolbar-download",
              svgId: "themes--carbonfiber--image--generated_icons--action_download32"
            },
            {
              signature: "ReserveDoc",
              name: publicLang.ToolbarItemReserve,
              icon: "icon icon-toolbar-reserve",
              svgId: "themes--carbonfiber--image--generated_icons--action_reserve32"
            },
            {
              signature: "UnreserveDoc",
              name: publicLang.ToolbarItemUnreserve,
              icon: "icon icon-toolbar-unreserve",
              svgId: "themes--carbonfiber--image--generated_icons--action_reserve32"
            },
            {
              signature: "Copy",
              name: lang.ToolbarItemCopy,
              icon: "icon icon-toolbar-copy",
              svgId: "themes--carbonfiber--image--generated_icons--action_copy32"
            },
            {
              signature: "Move",
              name: lang.ToolbarItemMove,
              icon: "icon icon-toolbar-move",
              svgId: "themes--carbonfiber--image--generated_icons--action_move32"
            },
            {
              signature: "AddVersion",
              name: lang.ToolbarItemAddVersion,
              icon: "icon icon-toolbar-add-version",
              svgId: "themes--carbonfiber--image--generated_icons--action_add_version32"
            },
            {
              signature: "Collect",
              name: lang.ToolbarCollect,
              icon: "icon icon-toolbar-actioncollect",
              svgId: "themes--carbonfiber--image--generated_icons--action_collect32"
            },
            {
              signature: "Delete",
              name: lang.ToolbarItemDelete,
              icon: "icon icon-toolbar-delete",
              svgId: "themes--carbonfiber--image--generated_icons--action_delete32"
            },
            {
              signature: "ZipAndDownload",
              name: lang.MenuItemZipAndDownload,
              icon: "icon icon-toolbar-download",
              svgId: "themes--carbonfiber--image--generated_icons--action_download32"
            }
          ]
        },
        {
          maxItemsShown: 5,
          dropDownText: lang.ToolbarItemMore,
          dropDownIcon: "icon icon-toolbar-more",
          dropDownSvgId: "themes--carbonfiber--image--generated_icons--action_more32",
          addGroupSeparators: false
        }),

    versionToolItems: ['properties', 'open', 'download', 'delete']
  };

  if (oldExtraToolItems) {
    addExtraToolItems(oldExtraToolItems);
  }

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
