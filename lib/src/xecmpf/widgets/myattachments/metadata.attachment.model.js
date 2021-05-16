/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
    'csui/utils/log', 'csui/utils/url', 'csui/models/actions',
    'csui/models/mixins/expandable/expandable.mixin',
    'csui/models/mixins/resource/resource.mixin',
    'csui/models/mixins/uploadable/uploadable.mixin',
    'csui/lib/jquery'
], function (module, _, Backbone, log, Url, ActionCollection,
             ExpandableMixin, ResourceMixin, UploadableMixin, $) {
    'use strict';

    var AttachmentModel = Backbone.Model.extend({

        constructor: function AttachmentModel(attributes, options) {
            attributes || (attributes = {});
            options = _.extend({expand: 'user'}, options);

            if (!attributes.actions) {
				this._setCollectionProperty('actions', ActionCollection,
					attributes, options);
			}

            Backbone.Model.prototype.constructor.call(this, attributes, options);

            this.makeResource(options)
                .makeUploadable(options)
                .makeExpandable(options);
        },

        set: function (key, val, options) {
            var attrs;
            if (key == null) {
                return this;
            }
            if (key.actions) {
                this.actions = key.actions;
                this._setCollectionProperty('actions', ActionCollection, key, options);
            }
            if (typeof key === 'object') {
                if (key.data) {
                    if (key.data.properties) {
                        attrs = key.data.properties;
                        this.id = attrs.ext_system_id + attrs.bo_type + attrs.bo_id;
                        options = val;
                    }
                }
                else {
                    attrs = key;
                    options = val;
                }
            } else {
                (attrs = {})[key] = val;
            }

            options || (options = {});
            return Backbone.Model.prototype.set.call(this, attrs, options);

        },

        isNew: function () {
            if (this.id) {
                return false;
            }
            else {
                return true;
            }
        },

        isFetchable: function () {
            return !!(this.get('id') && this.get('bo_id'));
        },

        url: function () {
            var url = Url.combine(this.collection.node.urlBase(), 'businessattachments');
            if (!this.isNew()) {
                url = Url.combine(url, encodeURIComponent(this.get('ext_system_id')), encodeURIComponent(this.get('bo_type')), encodeURIComponent(this.get('bo_id')));
            }
            url = url.replace('/v1', '/v2');
            return url;
        },

        parse: function (response) {
            var attachment;
            if ( $.isArray(response.results) ){
                attachment = response.results[0];
            }
            else {
               attachment = response;
            }

            var attachmentActions = _.map(attachment, function (value, key) {
				return {
				  id: key,
				  actions: _.map(value.data, function (value, key) {
					value.signature = key;
					return value;
				  })
				};
			}, {});
			
			attachment.actions = attachmentActions[0].actions;

            return attachment;
        },

        _setCollectionProperty: function (attribute, Class, attributes, options) {
            var property   = _.str.camelize(attribute),
                models     = attributes[attribute];			  
            this[property] = new Class(models, {
                connector: this.connector || options && options.connector
            });
          }

    });

    ExpandableMixin.mixin(AttachmentModel.prototype);
    UploadableMixin.mixin(AttachmentModel.prototype);
    ResourceMixin.mixin(AttachmentModel.prototype);

    return AttachmentModel;

});

