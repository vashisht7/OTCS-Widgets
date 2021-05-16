/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require',
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/marionette',
    'xecmpf/widgets/workspaces/controllers/dialog.controller'
], function (require, $, _,
             Marionette,
             DialogController) {

    var DialogRouter = Marionette.AppRouter.extend({

        appRoutes: {
            "": "selectWorkspace",
            "updateWorkspace/": "updateWorkspace",
            "selectWorkspace/": "selectWorkspace",
            "displayWorkspace/": "displayWorkspace",
            "newWorkspace/": "createWorkspace"
        },

        constructor: function DialogRouter(options) {
            this.controller = new DialogController(options);
            Marionette.AppRouter.prototype.constructor.apply(this, arguments);

        },
        execute: function (callback, args, name) {
            if (callback) {
                callback.apply(this, args);
            }
        }

    });

    return DialogRouter;
});

