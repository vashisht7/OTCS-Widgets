/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/models/command',
    'csui/utils/commandhelper',
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/utils/commands/confirmable',
    'csui/utils/command.error',
    'i18n!xecmpf/utils/commands/nls/localized.strings'
], function (module, CommandModel, CommandHelper, $, _, ConfirmableCommand, CommandError, lang) {
    'use strict';

    var messageHelper;
    var globalMessage;
    var base;
    var globals = {};

    var DetachAttachmentCommand = CommandModel.extend({

        defaults: {
            signature: 'detach_business_attachment',
            command_key: ['detach_business_attachment'],
            name: lang.CommandNameDetach,
            pageLeavingWarning: lang.DetachPageLeavingWarning,
            scope: 'multiple',
            doneVerb: lang.CommandDoneVerbDetached,
            successMessages: {
                formatForNone: lang.DetachBusAttsNoneMessage,
                formatForOne: lang.DetachOneBusAttSuccessMessage,
                formatForTwo: lang.DetachSomeBusAttsSuccessMessage,
                formatForFive: lang.DetachManyBusAttsSuccessMessage
            },
            errorMessages: {
                formatForNone: lang.DetachBusAttsNoneMessage,
                formatForOne: lang.DetachOneBusAttFailMessage,
                formatForTwo: lang.DetachSomeBusAttsFailMessage,
                formatForFive: lang.DetachManyBusAttsFailMessage
            }
        },

        _getConfirmTemplate: function (status, options) {
            return _.template("<span class='msgIcon WarningIcon'><%- message %></span>");
        },

        _getConfirmData: function (status, options) {
            var nodes = CommandHelper.getAtLeastOneNode(status);
            return {
                title: lang.DetachBusAttsCommandConfirmDialogTitle,
                message: nodes.length === 1 ?
                    _.str.sformat(lang.DetachBusAttsCommandConfirmDialogSingleMessage,
                        nodes.at(0).get('name')) :
                    _.str.sformat(lang.DetachBusAttsCommandConfirmDialogMultipleMessage, nodes.length)
            };
        },

        enabled: function (status, options) {
            var node = CommandHelper.getJustOneNode(status),
			signature = 'delete_business_attachment',
			action = this._getNodeActionForSignature(node, signature);
			if (action) {
				return true;
			} else {
				return false;
			}
        },
        _performAction: function (model, options) {
            var self = this;
            var node = model.node;
            var d = $.Deferred();
            var collection = node.collection;
            if (collection) {
                var jqxhr = node.destroy({
                    wait: true
                })
                    .done(function () {
                        model.set('count', 1);
                        model.deferred.resolve(model);
                        d.resolve(node);
                    })
                    .fail(function (error) {
                        var cmdError = error ? new CommandError(error, node) : error;
                        model.deferred.reject(model, cmdError);
                        if (!error) {
                            jqxhr.abort();
                        }
                        d.reject(cmdError);
                    });
                return d.promise();
            }
            else {
                return d.reject(
                    new CommandError(_.str.sformat(lang.CommandFailedSingular, node.get('name'),
                        lang.CommandVerbDetach), {errorDetails: "collection is undefined"}));
            }
        },

        startGlobalMessage: function (uploadCollection) {
            globalMessage.showFileUploadProgress(uploadCollection, {
                oneFileTitle: lang.DetachingOneBusAtt,
                oneFileSuccess: lang.DetachOneBusAttSuccessMessage,
                multiFileSuccess: lang.DetachManyBusAttsSuccessMessage,
                oneFilePending: lang.DetachingOneBusAtt,
                multiFilePending: lang.DetachBusAtts,
                oneFileFailure: lang.DetachOneBusAttFailMessage,
                multiFileFailure: lang.DetachManyBusAttsFailMessage2,
                someFileSuccess: lang.DetachSomeBusAttsSuccessMessage,
                someFilePending: lang.DetachingSomeBusAtts,
                someFileFailure: lang.DetachSomeBusAttsFailMessage2,
                enableCancel: false
            });

        },

        _removeBusAtt: function (model) {
            return (model.destroy({wait: true}));
        },

        _getRespError: function (resp) {
            var error = '';
            if (resp && resp.responseJSON && resp.responseJSON.error) {
                error = resp.responseJSON.error;
            } else if (base.messageHelper.hasMessages()) {
                error = $(base.messageHelper.toHtml()).text();
                base.messageHelper.clear();
            }
            return error;
        },

        _announceStart: function (status) { //, PageLeavingBlocker) {
            var originatingView = status.originatingView;
            if (originatingView && originatingView.blockActions) {
                originatingView.blockActions();
            }
            var pageLeavingWarning = this.get('pageLeavingWarning');
            if (pageLeavingWarning) {
                this.PageLeavingBlocker.enable(pageLeavingWarning);
            }
        },

        _announceFinish: function (status) {
            var pageLeavingWarning = this.get('pageLeavingWarning');
            if (pageLeavingWarning) {
                this.PageLeavingBlocker.disable();
            }
            var originatingView = status.originatingView;
            if (originatingView && originatingView.unblockActions) {
                originatingView.unblockActions();
            }
        }
    });

    _.extend(DetachAttachmentCommand.prototype, ConfirmableCommand, {
        execute: function (status, options) {
            var nodes    = CommandHelper.getAtLeastOneNode(status),
                node     = nodes.length === 1 && nodes.first(),
                deferred = $.Deferred(),
                commandData = status.data || {};
            var showProgressDialog = (commandData.showProgressDialog != null)? commandData.showProgressDialog: true;
            this.showProgressDialog = showProgressDialog;
            status.suppressFailMessage = true;
            status.suppressSuccessMessage = true;
            status.suppressMultipleFailMessage = true;
            ConfirmableCommand.execute
                .apply(this, arguments)
                .done(function (results) {
                    showProgressDialog && globalMessage.hideFileUploadProgress();
                    deferred.resolve(results);
                })
                .fail(function (args) {
                    var oneSuccess = args && _.find(args, function (result) {
                            return !(result instanceof CommandError);
                        });
                    var rejectResults = oneSuccess ? oneSuccess: args;
                    deferred.reject(rejectResults);
                });
            return deferred.promise();
        },

        _performActions: function (status, options) {
            var deferred = $.Deferred(),
                self = this;
            require(['csui/utils/taskqueue', 'csui/utils/page.leaving.blocker', 'csui/models/fileuploads',
                    "csui/utils/commands/multiple.items",
                    'csui/controls/globalmessage/globalmessage',
                    'csui/utils/messagehelper',
                    'csui/utils/base'
                ], function (TaskQueue, PageLeavingBlocker, UploadFileCollection, MultipleItemsCommand, GlobalMessage, MessageHelper, base) {
                    messageHelper = MessageHelper;
                    globalMessage = GlobalMessage;
                    base = base;
                    self.PageLeavingBlocker = arguments[1];

                    var busAtts = CommandHelper.getAtLeastOneNode(status);
                    var models = busAtts.models;
                    var nodes = _.map(models, function (node) {
                        return {
                            name: node.get('name'),
                            state: 'pending',
                            count: 0,
                            total: 1,
                            node: node
                        };
                    });
                    var connector = models && models[0] && models[0].connector;
                    var uploadCollection = new UploadFileCollection(nodes, {connector: connector});
                    var newStatus = _.defaults({nodes: uploadCollection}, status);
                    uploadCollection.each(function (fileUpload) {
                        var node = fileUpload.get('node');
                        fileUpload.node = node;
                        fileUpload.unset('node');
                    });
                    self.startGlobalMessage(uploadCollection);
                    MultipleItemsCommand._performActions.call(self, newStatus, options)
                        .done(function (results) {
                            globalMessage.hideFileUploadProgress();
                            deferred.resolve(results);
                        })
                        .fail(function (errors) {
                            deferred.reject(errors);
                        });
                },
                function (error) {
                    console.log(error);
                    deferred.reject(error);
                });
            return deferred.promise();

        }
        
    });
    
    return DetachAttachmentCommand;

});

