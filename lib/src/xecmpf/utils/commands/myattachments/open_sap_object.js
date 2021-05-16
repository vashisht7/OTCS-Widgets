/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/models/command',
    'csui/utils/commandhelper',
    'csui/lib/underscore',
    'csui/lib/jquery',
    'i18n!xecmpf/utils/commands/nls/localized.strings'
], function (module, CommandModel, CommandHelper, _, $, lang) {
    'use strict';

    var config = _.defaults({}, module.config(), {
        openInNewTab: true
    });

    var OpenSapObjectCommand = CommandModel.extend({

        defaults: {
            signature: 'open_sap_object',
            command_key: ['open_sap_object'],
            name: lang.CommandNameOpenSapObject,
            scope: 'single'
        },

        enabled: function (status) {
            var node = CommandHelper.getJustOneNode(status),
			signature = this.get('command_key'),
			action = this._getNodeActionForSignature(node, signature);
			if (action) {
				var currAction = node.actions && node.actions.findRecursively(signature);
				if (currAction.get('href')) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
        },

        execute: function (status, options) {
            var busAtt = CommandHelper.getJustOneNode(status);
            return this._navigateTo(busAtt, options);
        },

        openInNewTab: function () {
            return config.openInNewTab;
        },

        _navigateTo: function (busAtt, options) {
            var action = busAtt.actions.findRecursively(this.attributes.signature);
            var url = action.get('href');

            if (this.openInNewTab() === true) {
                var browserTab = window.open(url, '_blank');
                browserTab.focus();
            } else {
                location.href = url;
            }

            return $.Deferred().resolve().promise();
        }

    });

    return OpenSapObjectCommand;

});
