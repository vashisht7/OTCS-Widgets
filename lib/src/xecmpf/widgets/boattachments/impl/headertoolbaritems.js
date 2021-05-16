/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/controls/toolbar/toolitems.factory',
  'i18n!xecmpf/widgets/boattachments/impl/nls/lang'
], function (ToolItemsFactory, lang) {

  var headerToolbarItems = {
    AddToolbar: new ToolItemsFactory({
          main: [
            {
              signature: "BOAttachmentsCreate",
              name: lang.addBusinessAttachment,
              icon: "icon icon-toolbarAdd"
            }
          ]
        },
        {
          maxItemsShown: 1,
          dropDownIcon: "icon icon-toolbar-more"
        })
  };

  return headerToolbarItems;

});
