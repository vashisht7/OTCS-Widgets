/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/models/command',
    'csui/utils/commandhelper',
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/utils/commands/confirmable',
    'i18n!xecmpf/utils/commands/nls/localized.strings'
], function (require, CommandModel, CommandHelper, $, _, ConfirmableCommand, lang) {
    'use strict';

    var AttachmentModel;
    var messageHelper;
    var globalMessage;
    var commandError;
    var base;
    var globals = {};

    var AddAttachmentCommand = CommandModel.extend({

        defaults: {
            signature: 'add_business_attachment',
            command_key: ['add_business_attachment'],
            name: lang.CommandNameAttach,
            scope: 'multiple',
            doneVerb: lang.CommandDoneVerbAttached,
            successMessages: {
                formatForNone: lang.AttachBusAttsNoneMessage,
                formatForOne:  lang.AttachOneBusAttSuccessMessage,
                formatForTwo:  lang.AttachSomeBusAttsSuccessMessage,
                formatForFive: lang.AttachManyBusAttsSuccessMessage
            },
            errorMessages: {
                formatForNone: lang.AttachBusAttsNoneMessage,
                formatForOne:  lang.AttachOneBusAttFailMessage,
                formatForTwo:  lang.AttachSomeBusAttsFailMessage,
                formatForFive: lang. AttachManyBusAttsFailMessage
            }
        },

        _getConfirmTemplate: function (status, options) {
            return _.template(lang.AttachBusAttsCommandConfirmDialogHtml);
        },

        _getConfirmData: function (status, options) {
            var nodes = CommandHelper.getAtLeastOneNode(status);
            return {
                title: lang.AttachBusAttsCommandConfirmDialogTitle,
                message: nodes.length === 1 ?
                         _.str.sformat(lang.AttachBusAttsCommandConfirmDialogSingleMessage,
                             nodes.at(0).get('name')) :
                         _.str.sformat(lang.AttachBusAttsCommandConfirmDialogMultipleMessage, nodes.length)
            };
        },

        enabled: function (status) {
            if (status.container.busatts.actions) {
                var add = _.has(status.container.busatts.actions.data, this.defaults.signature);
                if (add) {
                    return true;
                }
                else {

                    return false;
                }
            }
            return false;
        },
    });

    _.extend( AddAttachmentCommand.prototype, ConfirmableCommand, {
        execute: function (status, options) {

            return (this._referenceSearchOpen(status, options));

        },

        _referenceSearchOpen: function (status, options) {
            var deferred = $.Deferred();
            var self = this;
            require([
                    'csui/utils/contexts/factories/connector',
                    'i18n!xecmpf/widgets/myattachments/nls/myattachments.lang',
                    'xecmpf/widgets/myattachments/metadata.attachment.model',
                    'xecmpf/controls/bosearch/bosearch.model',
                    'xecmpf/controls/bosearch/bosearch.dialog.controller',
                    'csui/utils/command.error',
                ], function (ConnectorFactory, lang, AttachmentModelLocal,
                             BoSearchModel, BOSearchDialogController, CommandError) {
                    AttachmentModel = AttachmentModelLocal;
                    commandError = CommandError;
                    self.connector = options.context.getObject(ConnectorFactory);
                    self.collection = status.data.collection;

                    self.boSearchModel = new BoSearchModel(status.data.boType, {
                        connector: self.connector
                    });
                    var htmlPlace;
                    htmlPlace = ".cs-metadata:has(> .metadata-content-wrapper)";

                    self.boSearchDialogController = new BOSearchDialogController({
                        context: options.context,
                        htmlPlace: htmlPlace,
                        multipleSelect: true,
                        mode: 'business_attachment_add',
                        boSearchModel: self.boSearchModel,
                        title: lang.BOSearchTitle
                    });
                    self.status = status;
                    self.listenTo(self.boSearchModel, "boresult:select", self._referenceSearchAttach);
                    self.boSearchModel.trigger("reference:search");
                    deferred.resolve();
                },
                function (error) {
                    console.log(error);
                    deferred.reject(error);
                });
            return deferred.promise();
        },

        _referenceSearchAttach: function (selected) {
            var deferred = $.Deferred(),
                self = this;
            require(['csui/utils/page.leaving.blocker',
                    'csui/models/fileuploads',
                    "csui/utils/commands/multiple.items",
                    'csui/controls/globalmessage/globalmessage',
                    'csui/utils/messagehelper',
                    'csui/utils/command.error',
                    'csui/utils/base'
                ], function (PageLeavingBlocker, UploadFileCollection, MultipleItemsCommand, GlobalMessage, MessageHelper, CommandError, base) {
                    messageHelper = MessageHelper;
                    globalMessage = GlobalMessage;
                    commandError = CommandError;
                    base = base;
                    var options;
                    self.PageLeavingBlocker = arguments[1];
                    self.boSearchModel.trigger("reference:selected");
                    if (selected.selectedItems) {
                        var models = selected.selectedItems;
                        var nodes = _.map(models, function (node) {
                            return {
                                name: node.get('businessObjectId'),
                                state: 'pending',
                                count: 0,
                                total: 1,
                                node: node
                            };
                        });
                        var connector = models && models[0] && models[0].connector;
                        var uploadCollection = new UploadFileCollection(nodes, {connector: connector});
                        var newStatus = _.defaults({nodes: uploadCollection}, status);
                        newStatus.suppressMultipleFailMessage = true;
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
                    }
                },
                function (error) {
                    console.log(error);
                    deferred.reject(error);
                });
            return deferred.promise();

        },

        startGlobalMessage: function (uploadCollection) {
            globalMessage.showFileUploadProgress(uploadCollection, {
                oneFileTitle: lang.AttachingOneBusAtt,
                oneFileSuccess: lang.AttachOneBusAttSuccessMessage,
                multiFileSuccess: lang.AttachManyBusAttsSuccessMessage,
                oneFilePending: lang.AttachingOneBusAtt,
                multiFilePending: lang.AttachBusAtts,
                oneFileFailure: lang.AttachOneBusAttFailMessage,
                multiFileFailure: lang.AttachManyBusAttsFailMessage2,
                someFileSuccess: lang.AttachSomeBusAttsSuccessMessage,
                someFilePending: lang.AttachingSomeBusAtts,
                someFileFailure: lang.AttachSomeBusAttsFailMessage2,
                enableCancel: false
            });

        },
        _performAction: function (model, options) {
            var node = model.node;
            var d = $.Deferred();
            var self = this;
            if (this.collection) {
                var ext_system_id = this.boSearchModel.get('ext_system_id'),
                    bo_type = this.boSearchModel.get('bo_type'),
                    comment = '';

                var bo_id = node.get('businessObjectId');
                var id = ext_system_id + bo_type + bo_id;
                var obody = {
                    "ext_system_id": ext_system_id,
                    "bo_type": bo_type,
                    "bo_id": bo_id,
                    "comment": comment
                };
                var busAttModel = new AttachmentModel(obody, { collection: this.collection, connector: this.connector});
                busAttModel.isLocallyCreated = true;

                busAttModel.save({wait: true, silent: true})
                    .done(function (args) {
                        self.collection.add(busAttModel, {at: 0});
                        model.set('count', 1);
                        model.deferred.resolve(model);
                        d.resolve(node);
                    })
                    .fail(function (error) {
                        var cmdError = error ? new commandError(error, node) : error;
                        model.deferred.reject(model, cmdError);
                        d.reject(cmdError);
                    });
                return d.promise();
            }
            else {
                return d.reject(
                    new commandError(_.str.sformat(lang.CommandFailedSingular, node.get('name'),
                        lang.CommandVerbAttach), {errorDetails: "collection is undefined"}));
            }
        },


        _announceStart: function (status) {
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
            if (this.get('pageLeavingWarning')) {
                this.PageLeavingBlocker.disable();
            }
            var originatingView = status.originatingView;
            if (originatingView && originatingView.unblockActions) {
                originatingView.unblockActions();
            }
        }

    });


    return AddAttachmentCommand;

})
;
