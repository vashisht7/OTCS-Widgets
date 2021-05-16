/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/models/commands',
    'xecmpf/utils/commands/myattachments/detach_myattachment',
    'xecmpf/utils/commands/myattachments/go_to_workspace',
    'xecmpf/utils/commands/myattachments/open_sap_object',
    'xecmpf/utils/commands/myattachments/add_myattachment'
], function (_, CommandCollection,
             DetachAttachmentCommand,
             GoToWorkspaceCommand,
             OpenSapCommand,
             AddAttachmentCommand
) {
    'use strict';

    var commands = new CommandCollection([
        new DetachAttachmentCommand(),
        new GoToWorkspaceCommand(),
        new OpenSapCommand(),
        new AddAttachmentCommand()
    ]);

    return commands;

});