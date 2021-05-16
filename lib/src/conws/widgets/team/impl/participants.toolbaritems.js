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
              signature: "AddParticipant",
              name: lang.CommandNameAddParticipant,
              icon: "binf-glyphicon binf-glyphicon-plus"
            }
          ],
          second: [
            {
              signature: "PrintParticipants",
              name: lang.CommandNamePrintParticipants,
              icon: "binf-glyphicon binf-glyphicon-print"
            },
            {
              signature: "ExportParticipants",
              name: lang.CommandNameExportParticipants,
              icon: "binf-glyphicon binf-glyphicon-download"
            }
          ],
          third: [
            {
              signature: "ShowRoles",
              name: lang.CommandNameShowRoles
            },
            {
              signature: "RemoveParticipant",
              name: lang.CommandNameRemoveParticipant
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
