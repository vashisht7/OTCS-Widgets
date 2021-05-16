/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
    "csui/utils/log", "csui/utils/base", 'csui/utils/url',
    "csui/models/appliedcategoryform",
    'csui/models/mixins/node.connectable/node.connectable.mixin',
    'csui/models/mixins/fetchable/fetchable.mixin'
], function (module, $, _, Backbone, log, base, Url, AppliedCategoryFormModel,
    NodeConnectableMixin, FetchableMixin) {

    "use strict";

    var CategoryFormCollection = Backbone.Collection.extend({

        constructor: function CategoryFormCollection(models, options) {

            this.isReadOnly = true;
            this.options = options;
            Backbone.Collection.prototype.constructor.apply(this, arguments);

            this.makeNodeConnectable(options);
            this.makeFetchable(options);
        },

        sync: function (method, model, options) {

            if (method === 'read') {
                if (this.node.get("id")) {
                    options.categoryFilter = this.options.categoryFilter;
                    return this._getMetadataForms(method, model, options);
                }
            } else {
                return Backbone.Collection.prototype.sync.apply(this, arguments);
            }

        },
        _getMetadataForms: function (method, model, options) {

            var deferred = $.Deferred();

            model.trigger('request', model, undefined, options);
            var categoryFilter = options.categoryFilter;
            var node = this.node;
            var catsUrl = Url.combine(node.urlBase(), 'categories');
            this.connector.makeAjaxCall(this.connector.extendAjaxOptions({
                type: 'GET',
                url: catsUrl
            }))
                .done(_.bind(function (data) {
                    var actionsUrl = Url.combine(node.urlBase(), 'categories/actions');
                    this.connector.makeAjaxCall(this.connector.extendAjaxOptions({
                        type: 'GET',
                        url: actionsUrl
                    }))
                        .done(_.bind(function (data2) {

                            this.isReadOnly = data2.data === null || !data2.data.hasOwnProperty("categories_add");
                            var promises = [],
                                forms = [];
                            _.each(data.data, function (curCategory) {
                                if (!categoryFilter || _.contains(categoryFilter, curCategory.id)) {
                                    var nodeId = node.get('id');
                                    var categoryId = curCategory.id;
                                    var catModel = new AppliedCategoryFormModel({
                                        id: curCategory.id,
                                        title: curCategory.name,
                                        allow_delete: true
                                    }, {
                                        node: node,
                                        categoryId: categoryId,
                                        action: 'update'
                                    });
                                    if (this.options.reset || this.options.autoreset) {
                                        forms.push(catModel);
                                    } else {
                                        this.add(catModel);
                                    }
                                    promises.push(catModel.fetch());
                                }
                            }, this);

                            $.when.apply($, promises).then(
                                _.bind(function () {
                                    if (options.success) {
                                        options.success(forms, 'success');
                                    }
                                    deferred.resolve();
                                }, this),
                                _.bind(function () {
                                    if (options.error) {
                                        options.error.apply(options.error, arguments);
                                    }
                                    deferred.reject();
                                }));

                        }, this))
                        .fail(_.bind(function () {
                            deferred.reject();
                        }, this));

                }, this))
                .fail(_.bind(function () {
                    deferred.reject();
                }, this));

            return deferred.promise();

        },

    });

    NodeConnectableMixin.mixin(CategoryFormCollection.prototype);
    FetchableMixin.mixin(CategoryFormCollection.prototype);

    return CategoryFormCollection;

});
