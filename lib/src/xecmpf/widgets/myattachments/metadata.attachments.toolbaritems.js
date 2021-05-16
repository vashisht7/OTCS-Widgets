/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
    'i18n!xecmpf/widgets/myattachments/nls/myattachments.lang',
    'csui/controls/toolbar/toolitems.factory',
    'css!xecmpf/widgets/myattachments/metadata.attachments'
], function (_, lang, ToolItemsFactory) {

    var toolbarItems = {
        addToolbar: new ToolItemsFactory({
                add: [
                ]
            },
            {
                maxItemsShown: 0, // force toolbar to immediately start with a drop-down list
                dropDownIcon: "icon icon-toolbarAdd",
                dropDownText: lang.AddBusinessAttachment,
                addTrailingDivider: false

            }),

        otherToolbar: new ToolItemsFactory(
            {
                main: [
                    {
                        signature: "detach_business_attachment",
                        name: lang.DetachBusinessAttachment,
                        scope: "multiple",
                        verb: "detach_business_attachment"
                    },
                    {
                        signature: "open_sap_object",
                        name: lang.OpenSapObject
                    },
                    {
                        signature: "go_to_workspace",
                        name: lang.GoToWorkspace
                    }
                ]
            },
            {
                maxItemsShown: 5,
                dropDownIcon: "icon icon-toolbar-more"
            }),
        inlineActionbar: new ToolItemsFactory({
                other: [
                    {
                        signature: "detach_business_attachment",
                        name: lang.DetachBusinessAttachment,
                        verb: "detach_business_attachment",
                        icon: "icon icon-toolbar-detach"
                    },
                    {
                        signature: "open_sap_object",
                        name: lang.OpenSapObject,
                        icon: "icon icon-toolbar-preview"
                    },
                    {
                        signature: "go_to_workspace",
                        name: lang.GoToWorkspace,
                        icon: "icon icon-toolbar-workspace"
                    }
                ]
            },
            {
                maxItemsShown: 5,
                dropDownText: lang.ToolbarItemMore,
                dropDownIcon: "icon icon-toolbar-more"
            })
    };

    return toolbarItems;

});
