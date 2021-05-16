/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/utils/base',
    'csui/controls/toolbar/toolitems.factory',
    'i18n!xecmpf/widgets/workspaces/controls/workspaces.table/impl/nls/lang',
], function (_, base, ToolItemsFactory, lang ) {

    var toolbarItems = {

        addToolbar: new ToolItemsFactory({
                add: []
            },
            {
                maxItemsShown: 0, // force toolbar to immediately start with a drop-down list
                dropDownIcon: "icon icon-toolbarAdd",
                dropDownText: lang.createNewTooltip,
                addTrailingDivider: false
            })

    };

    return toolbarItems;

});
