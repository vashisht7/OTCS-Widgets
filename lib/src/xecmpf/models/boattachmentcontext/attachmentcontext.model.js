/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
    "csui/utils/log",
    'csui/utils/contexts/context',
    'csui/utils/contexts/factories/node',
    'xecmpf/models/boattachmentcontext/attachmentcontext.node.factory',
    'xecmpf/models/boattachmentcontext/attachmentcontext.busobjinfo.factory',
    'xecmpf/models/boattachmentcontext/attachmentcontext.category.factory'

], function ($, _, Backbone,
             log,
             Context,
             NodeModelFactory,
             AttachmentContextNodeFactory,
             AttachmentContextBusinessObjectInfoFactory,
             AttachmentContexCategoryFactory) {

    var AttachmentContextModel = Context.extend({

        constructor: function AttachmentContextModel(attributes, options) {
            options || (options = {});

            Context.prototype.constructor.apply(this, arguments);

            this.options = options;

            this.attachmentSpecific = {};
            this.attachmentSpecific[NodeModelFactory.prototype.propertyPrefix] = true;
            this.attachmentSpecific[AttachmentContextNodeFactory.prototype.propertyPrefix] = true;
            this.attachmentSpecific[AttachmentContextBusinessObjectInfoFactory.prototype.propertyPrefix] = true;
            this.attachmentSpecific[AttachmentContexCategoryFactory.prototype.propertyPrefix] = true;

            this.attachmentSpecificFactories = [
                NodeModelFactory,
                AttachmentContextNodeFactory,
                AttachmentContextBusinessObjectInfoFactory,
                AttachmentContexCategoryFactory
            ];
            this.options.node = this.options.context.getModel(NodeModelFactory);
            this.wkspid = this.getModel(AttachmentContextNodeFactory,
                {data: this.options.data, node: this.options.node, connector: this.options.node.connector});
            this.node = this.getModel(NodeModelFactory);

            if (this.wkspid.get("id") === this.options.node.get("id")) {
                this.node.set(this.options.node.attributes);
            } else {
                this.node.set("id", this.wkspid.get("id"));
            }
        },

        setAttachmentSpecific: function (Factory) {
            this.attachmentSpecific[Factory.prototype.propertyPrefix] = true;
            if (!this._isAttachmentSpecificFactory(Factory)) {
                this.attachmentSpecificFactories.push(Factory);
            }
        },

        isAttachmentSpecific: function (Factory) {
            var found = false;
            if (this.attachmentSpecific[Factory.prototype.propertyPrefix]) {
                found = true;
            } else if (this._isAttachmentSpecificFactory(Factory)) {
                this.attachmentSpecific[Factory.prototype.propertyPrefix] = true;
                found = true;
            }
            return found;
        },

        _isAttachmentSpecificFactory: function (Factory) {
            var found = false;
            for (var ii = 0; ii < this.attachmentSpecificFactories.length; ii++) {
                if (this.attachmentSpecificFactories[ii] === Factory) {
                    found = true;
                    break;
                }
            }
            return found;
        },

        getOuterContext: function () {
            return this.options.context;
        },

        getModel: function () {
            return this._getAttachmentObject("getModel", arguments);
        },
        getCollection: function () {
            return this._getAttachmentObject("getCollection", arguments);
        },
        getObject: function () {
            return this._getAttachmentObject("getObject", arguments);
        },

        _getAttachmentObject: function (methodName, params) {
            var model;
            if (this.isAttachmentSpecific(params[0])) {
                model = Context.prototype[methodName].apply(this, params);
            } else {
                model = this.options.context[methodName].apply(this.options.context, params);
            }

            return model;
        },

        fetch: function (options) {
            this.fetched = false;
            var old_id = this.wkspid.get("id"),
                self   = this;

            return this.wkspid // get workspace id for given node
                .fetch()
                .then(function () {
                    self.fetched = true;
                    var new_id = self.wkspid.get("id");
                    var promises;
                    log.debug("wkspid old {0}, new {1}.", old_id, new_id) &&
                    console.log(log.last);
                    var factories = self.getFactories ? self.getFactories() : self._factories;
                    var obj = _.find(factories, function (f) {
                        return f.property === self.node
                    });
                    log.debug("going to fetch {0}.", obj.propertyPrefix) && console.log(log.last);
                    var nodepromise, isWksp;
                    if (new_id === self.options.node.get("id")) {
                        self.node.set(self.options.node.attributes);
                        if (self.wkspStatus && self.wkspStatus.wksp_id === new_id &&
                            self.wkspStatus.fetched) {
                            return $.Deferred()
                                .resolve(self, {}, options)
                                .promise();
                        }
                        isWksp = true
                    } else {
                        isWksp = false;
                        if (new_id) {
                            self.node.set("id", new_id);
                            self.node.set("type", 848);
                            if (obj.fetch) {
                                if (!old_id || (old_id && new_id && old_id !== new_id)) {
                                    nodepromise = obj.fetch();
                                }
                            }
                        } else { // container is not a workspace

                            self.node.set(self.options.node.attributes);
                        }
                    }
                    factories = self.getFactories ? self.getFactories() : self._factories;
                    promises = _.chain(factories)
                        .map(function (obj) {
                            log.debug("going to fetch {0}.", obj.propertyPrefix) &&
                            console.log(log.last);
                            if (obj.property !== self.wkspid &&
                                obj.property !== self.node) {

                                if (obj.fetch) {
                                    if (isWksp || !old_id ||
                                        (old_id && new_id && old_id !== new_id)) {
                                        return obj.fetch();
                                    }
                                }
                            }
                        })
                        .compact()
                        .value();
                    if (nodepromise) {
                        promises.unshift(nodepromise);
                    }
                    if (promises.length > 0) {
                        self.wkspStatus = {
                            wksp_id: new_id,
                            fetched: true
                        }
                    }

                    return $.when.apply($, promises);
                })
        }
    });

    return AttachmentContextModel;

});
