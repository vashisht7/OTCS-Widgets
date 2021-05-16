/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  "csui/controls/toolbar/toolitem.model",
  'csui/controls/toolbar/toolitems.factory',
  'i18n!conws/utils/commands/nls/commands.lang'
], function (module, ToolItemModel, ToolItemsFactory, lang) {

  var toolbarItems = {

    otherToolbar: new ToolItemsFactory({
          first: [
            {
              signature: "AddRole",
              name: lang.CommandNameAddRole,
              icon: "binf-glyphicon binf-glyphicon-plus"
            }
          ],
          second: [
            {
              signature: "PrintRoles",
              name: lang.CommandNamePrintRoles,
              icon: "binf-glyphicon binf-glyphicon-print"
            },
            {
              signature: "ExportRoles",
              name: lang.CommandNameExportRoles,
              icon: "binf-glyphicon binf-glyphicon-download"
            }
          ],
          third: [
            {
              signature: "ShowDetails",
              name: lang.CommandNameShowDetails
            },
            {
              signature: "DeleteRoles",
              name: lang.CommandNameDeleteRole
            }
          ]
        },
        {
          maxItemsShown: 99,
          dropDownIcon: "icon icon-toolbar-more"
        })
  };

  return toolbarItems;

});
