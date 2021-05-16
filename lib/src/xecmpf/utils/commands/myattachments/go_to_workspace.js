/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/models/command',
    'csui/utils/commandhelper',
    'csui/lib/underscore',
    'csui/lib/jquery',
    'i18n!xecmpf/utils/commands/nls/localized.strings'
], function (module, CommandModel, CommandHelper, _, $, lang) {
    'use strict';

    var GoToWorkspaceCommand = CommandModel.extend({

        defaults: {
            signature: 'go_to_workspace',
            command_key: ['go_to_workspace'],
            name: lang.CommandNameGoToWorkspace, 
            scope: 'single'
        },

        enabled: function (status) {
            var node = CommandHelper.getJustOneNode(status),
			signature = this.get('command_key'),
			action = this._getNodeActionForSignature(node, signature);
			if (action) {
				return true;
			} else {
				return false;
			}
        },

        execute: function (status, options) {
            var busAtt = CommandHelper.getJustOneNode(status);
            return this._navigateTo(busAtt, status, options);
        },

        _navigateTo: function (busAtt, status, options) {
            var deferred = $.Deferred(),
                context = status.context || status.originatingView.options.context,
                wkspNodeId = busAtt.get('wksp_id'); // Get BWs ID from the business attachment
            require(['csui/lib/backbone', 'csui/utils/contexts/factories/connector',
                'csui/models/node/node.model', 'csui/utils/commands/browse'
            ], function (Backbone, ConnectorFactory, NodeModel, BrowseCommand) {
                var connector = context.getObject(ConnectorFactory),
                    otherNode = new NodeModel({id: wkspNodeId}, {connector: connector}),
                    browseCommand = new BrowseCommand();
                browseCommand
                    .execute({
                        nodes: new Backbone.Collection([otherNode]),
                        context: context
                    });
            }, function(error) {
                console.log(error);
                deferred.reject();
            });
            return deferred.promise();
        }

    });

    return GoToWorkspaceCommand;

});
