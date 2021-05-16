/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
    'csui/lib/underscore',
    'csui/utils/commandhelper',
    'csui/utils/commands/open.classic.page',
    'workflow/models/workitem/workitem.model.factory'
], function ($, _, CommandHelper, OpenClassicPageCommand, WorkitemModelFactory) {
    'use strict';

    var EditWorkflowMapCommand = OpenClassicPageCommand.extend({

        defaults: {
            signature: 'EditWorkflowMap',
            command_key: ['editworkflowmap'],
            scope: 'single'
        },

        execute: function (status, options) {
            var node = CommandHelper.getJustOneNode(status);
            options = options || {};
            return this._navigateTo(node, options);
        },

        getUrlQueryParameters: function (node, options) {
            var urlParams;
            urlParams = {};
            urlParams.func = 'll';
            urlParams.objAction = 'paint';
            urlParams.objId = node.get('id');
            return urlParams;
        }
    });

    return EditWorkflowMapCommand;

});