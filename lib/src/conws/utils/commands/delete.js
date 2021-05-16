/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/utils/commands/delete'
], function ($, _, DeleteCommand, lang) {
    var origEnabled = DeleteCommand.prototype.enabled;
    var DeleteCommandRelatedWorkspaceCheck = DeleteCommand.extend({
        enabled: function (status) {
            if (status.container === undefined ||
                status.container.get("type") !== 854) {
                return origEnabled.call(this, status);
            } else {
                return false;
            }
        }
    });
    DeleteCommand.prototype = DeleteCommandRelatedWorkspaceCheck.prototype;
    return DeleteCommand;
});