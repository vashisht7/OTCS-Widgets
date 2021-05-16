/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'i18n!csui/controls/tabletoolbar/nls/localized.strings',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  'csui/widgets/favorites/favorite.star.view',
  'csui/controls/versionsettings/version.settings.view',
  'csui-ext!csui/widgets/nodestable/toolbaritems'
], function (_, publicLang, lang, ToolItemsFactory, TooItemModel, FavoriteStarView,
    VersionSettingsView, extraToolItems) {
  'use strict';
  var toolbarItems = {

    filterToolbar: new ToolItemsFactory({
          filter: [
            {
              signature: "Filter",
              name: lang.ToolbarItemFilter,
              svgId: "themes--carbonfiber--image--generated_icons--action_filter32",
              svgIdForOn: "themes--carbonfiber--image--generated_icons--action_filter32.on",
              toolItemAria: lang.ToolbarItemFilterAria,
              toolItemAriaExpand: false
            }
          ]
        },
        {
          maxItemsShown: 2, // force toolbar to immediately start with a drop-down list
          dropDownIcon: "icon icon-toolbar-more",
          dropDownSvgId: "themes--carbonfiber--image--generated_icons--action_more32",
          dropDownText: lang.ToolbarItemMore,
          addTrailingDivider: false
        }),
    addToolbar: new ToolItemsFactory({
          add: []
        },
        {
          maxItemsShown: 0, // force toolbar to immediately start with a drop-down list
          dropDownIcon: "icon icon-toolbarAdd",
          dropDownSvgId: "themes--carbonfiber--image--generated_icons--action_add32",
          dropDownText: lang.ToolbarItemAddItem,
          addTrailingDivider: false
        }),
    leftToolbar: new ToolItemsFactory(
        {
          main: [
            {
              signature: "CollectionCanCollect",
              name: lang.ToolbarItemAddItem,
              icon: "icon icon-toolbarAdd",
              svgId: "themes--carbonfiber--image--generated_icons--action_add32"
            }
          ]
        },
        {
          maxItemsShown: 2,
          dropDownIcon: "icon icon-toolbar-more",
          dropDownSvgId: "themes--carbonfiber--image--generated_icons--action_more32",
          dropDownText: lang.ToolbarItemMore,
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
            {signature: "CopyLink", name: lang.ToolbarItemCopyLink}
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
    captionMenuToolbar: new ToolItemsFactory({
          other: [
            {signature: "Properties", name: lang.MenuItemInformation},
            {signature: "CopyLink", name: lang.MenuItemCopyLink},
            {signature: "EmailLink", name: lang.ToolbarItemEmailLinkShort},
            {signature: "permissions", name: lang.ToolbarItemPermissions},
            {signature: "Rename", name: lang.MenuItemRename},
            {signature: "Copy", name: lang.MenuItemCopy},
            {signature: "Move", name: lang.MenuItemMove},
            {signature: "Delete", name: lang.MenuItemDelete},
            {signature: "Collect", name: lang.ToolbarCollect}
          ]
        },
        {
          maxItemsShown: 0, // force toolbar to immediately start with a drop-down list
          dropDownIcon: "icon icon-expandArrowDown",
          dropDownSvgId: "themes--carbonfiber--image--generated_icons--action_caret_down32"
        }),
    inlineActionbar: new ToolItemsFactory({
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
              signature: "InlineEdit",
              name: lang.ToolbarItemRename,
              icon: "icon icon-toolbar-rename",
              svgId: "themes--carbonfiber--image--generated_icons--action_rename32"
            },
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
              svgId: "themes--carbonfiber--image--generated_icons--action_unreserve32"
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
              signature: "RemoveCollectedItems",
              name: lang.ToolbarItemRemoveCollectionItems,
              icon: "icon icon-toolbar-remove-collection-items",
              svgId: "themes--carbonfiber--image--generated_icons--action_collection_delete32"
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
    rightToolbar: new ToolItemsFactory({
      main: [
        {
          signature: "Thumbnail",
          name: lang.ToolbarItemThumbnail,
          icon: "icon icon-switch_thumbnails32",
          svgId: "themes--carbonfiber--image--generated_icons--action_switch_thumb32",
          commandData: {useContainer: true},
          title: lang.ThumbnailTitle
        },
        {
          signature: "ToggleDescription",
          name: lang.ToolbarItemShowDescription,
          icon: "icon icon-description-toggle",
          svgId: "themes--carbonfiber--image--generated_icons--action_reveal_description32",
          commandData: {useContainer: true}
        },
        {
          signature: "Comment",
          name: lang.ToolbarItemComment,
          icon: "icon icon-socialComment",
          svgId: "themes--carbonfiber--image--generated_icons--action_no_comment32",
          svgIdForOn: "themes--carbonfiber--image--generated_icons--action_comment32",
          className: "esoc-socialactions-comment",
          customView: true,
          commandData: {useContainer: true}
        },
        {
          signature: "VersionSettings",
          enabled: true,
          viewClass: VersionSettingsView,
          customView: true,
          commandData: {
            useContainer: true,
            viewOptions: {
              focusable: false
            }
          }
        },
        {
          signature: "Favorite2",
          enabled: true,
          viewClass: FavoriteStarView,
          customView: true,
          commandData: {
            useContainer: true,
            viewOptions: {
              focusable: false
            }
          }
        },
        {
          signature: "RestoreWidgetViewSize",
          name: lang.ToolbarItemRestoreWidgetViewSize,
          icon: "icon icon-tileCollapse",
          svgId: "themes--carbonfiber--image--generated_icons--action_minimize32",
          commandData: {useContainer: true}
        },
        {
          signature: "MaximizeWidgetView",
          name: lang.ToolbarItemMaximizeWidgetView,
          icon: "icon icon-tileExpand icon-perspective-open",
          svgId: "themes--carbonfiber--image--generated_icons--action_expand32",
          commandData: {useContainer: true}
        }
      ]
    }, {
      hAlign: "right",
      maxItemsShown: 5,
      dropDownIcon: "icon icon-toolbar-more",
      dropDownSvgId: "themes--carbonfiber--image--generated_icons--action_more32",
      dropDownText: lang.ToolbarItemMore,
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

  toolbarItems.clone = function () {
    return ToolItemsFactory.cloneToolbarItems(this);
  };

  return toolbarItems;
});
