/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'module',
    "csui/controls/toolbar/toolitem.model",
    'csui/controls/toolbar/toolitems.factory',
    'i18n!xecmpf/widgets/boattachments/impl/nls/lang',
    'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
], function (module, ToolItemModel, ToolItemsFactory, lang, _lang) {

    var toolbarItems = {

        tableHeaderToolbar: new ToolItemsFactory({
                main: [
                    {signature: "Snapshot", name: lang.CommandSnapshot}
                ]
            },
            {
                maxItemsShown: 15,
                dropDownIcon: "icon icon-toolbar-more"
            })
    };

    return toolbarItems;

});
