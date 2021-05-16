/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore',
    'csui/models/command',
    'i18n!conws/utils/commands/nls/commands.lang'
], function (_, CommandModel, lang) {

    var ShowDetailsCommand = CommandModel.extend({

        defaults:{
            signature: 'ShowDetails',
            name: lang.CommandNameShowDetails,
            scope: 'single'
        },

        enabled: function(status){
            if (status && status.nodes && status.nodes.length === 1){
                return true;
            } else{
                return false;
            }
        },

        execute: function (status, options) {
            throw new Error('The \'' + this.get('signature') + '\' action must be handled by the caller.');
        }
    });

    return ShowDetailsCommand;
});


