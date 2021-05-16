/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
    'conws/models/workspacecontext/workspacecontext.factory',
    'xecmpf/widgets/header/impl/completenesscheck/impl/missingdocuments.factory',
    'csui-ext!xecmpf/widgets/header/completenesscheck/completenesscheck.factory',
    'xecmpf/widgets/header/impl/previewpane/previewpane.view',
    'hbs!xecmpf/widgets/header/impl/completenesscheck/impl/completenesscheckitem',
    'hbs!xecmpf/widgets/header/impl/completenesscheck/impl/completenesscheck',
    'i18n!xecmpf/widgets/header/impl/completenesscheck/impl/nls/lang',
    'css!xecmpf/widgets/header/impl/completenesscheck/impl/completenesscheck'
], function (_, $, Backbone, Marionette, WorkspaceContextFactory,
    MissingDocumentsFactory, extraItems,
    PreviewPaneView, itemTemplate, layoutTemplate, lang) {

        var OUTDATED_DOCUMENTS_FACTORY = "selfserviceOutdatedCollection",
            INPROCESS_DOCUMENT_FACTORY = "selfserviceQueuedCollection";

        var DocsCheckItemView = Marionette.ItemView.extend({

            className: 'docs-check-list-item',

            constructor: function DocsCheckItemView(options) {
                options || (options = {});
                Marionette.ItemView.prototype.constructor.apply(this, arguments);

                this.listenTo(this.options.collection, 'change', this.render);

                if (this.options && this.options.preview) {
                    this.previewPane = new PreviewPaneView({
                        parent: this,
                        context: this.options.workspaceContext,
                        config: this.options.preview,
                        collection: this.options.collection,
                        headerTitle: this.options.title,
                        enableIcon: this.options.enableIcon,
                        headerColor: options.headerColor,
                        enableDescription: options.enableDescription,
                        info: this.options.info,
                        cancelDefaultAction: this.options.cancelDefaultAction,
                        customPopoverClass: this.options.customPopoverClass
                    });
                }
            },

            template: itemTemplate,

            templateHelpers: function () {
                return {
                    icon: this.options.icon,
                    docsCount: this.options.collection.length,
                    docsCountWithText: _.str.sformat(this.options.label, this.options.collection.length)
                }
            },

            onBeforeDestroy: function () {
                if (this.previewPane) {
                    this.previewPane.destroy();
                    delete this.previewPane;
                }
            }
        });

        var CompletenessCheckView = Marionette.LayoutView.extend({

            className: 'xecmpf-completenesscheck',

            constructor: function CompletenessCheckView(options) {
                options || (options = {});
                Marionette.LayoutView.prototype.constructor.apply(this, arguments);

                if (!options.workspaceContext) {
                    options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
                }
                options.workspaceContext.setWorkspaceSpecific(MissingDocumentsFactory);

                this.missingDocsCollection = !options.hideMissingDocsCheck ?
                    options.workspaceContext.getCollection(MissingDocumentsFactory) :
                    undefined;


            },

            template: layoutTemplate,

            templateHelpers: function () {
                return {
                    hideMissingDocsCheck: this.options.hideMissingDocsCheck
                }
            },

            onRender: function () {
                this.showCompletenessCheck({
                    collection: this.missingDocsCollection,
                    title: lang.missingDocsTitle,
                    label: lang.missingReportName,
                    icon: 'missing-icon',
                    index: 0,
                    enableIcon: false,
                    region: this.missingDocsRegion,
                    enableDescription: false,
                    cancelDefaultAction: true,
                    customPopoverClass: 'xecmpf-missing-docs-check'
                });
                this.showExternalViews(this.options);
            },

            regions: {
                missingDocsRegion: '.missing-docs-check'
            },

            showCompletenessCheck: function (options) {
                if (options.collection) {
                    if (options.collection.fetched === true && options.collection.length > 0) {
                        this._showCompletenessCheck(options);
                        this._completenessCheckAvailable();
                    }
                    this.listenToOnce(options.collection, 'sync', function () {
                        if (options.collection.length > 0) {
                            options.collection.fetched = true;
                            options.title = (options.collection.options && options.collection.options.name) ?
											options.collection.options.name : options.title;
                            options.label = (options.collection.options && options.collection.options.label) ?
											options.collection.options.label : options.label;
                            options.icon = (options.collection.options && options.collection.options.iconClass) ?
											options.collection.options.iconClass : options.icon;
                            options.customPopoverClass = (options.collection.options &&
														 options.collection.options.customPopoverClass ) ?
														options.collection.options.customPopoverClass :
														options.customPopoverClass;
														 
                            this._showCompletenessCheck(options);
                            this._completenessCheckAvailable();
                        }
                    });
                }
            },

            _completenessCheckAvailable: function () {
                this.trigger('completeness:check:available');
                if (this.options.originatingView) {
                    this.options.originatingView.trigger('completeness:check:available');
                }
            },

            _showCompletenessCheck: function (options) {
                this.showRegion = true;
                if (!options.region) {
                    var regionClass0 = this.regionManager.completenesscheck_view0;
                    var regionClass1 = this.regionManager.completenesscheck_view1;
                    if ((regionClass0 && options.index === 0) || (regionClass1 && options.index === 1)) {
                        this.showRegion = false;
                    } else {
                        var newRegion = 'completenesscheck_view' + options.index;
                        this.addRegion(newRegion);
                        options.region = this.regionManager[newRegion]
                    }
                }
                if (this.showRegion) {
                    options.region.show(new DocsCheckItemView({
                        workspaceContext: this.options.workspaceContext,
                        collection: options.collection,
                        preview: { debug: false },
                        title: options.title,
                        label: options.label,
                        icon: options.icon,
                        headerColor: options.headerColor,
                        enableIcon: options.enableIcon,
                        enableDescription: options.enableDescription,
                        cancelDefaultAction: options.cancelDefaultAction,
                        customPopoverClass: options.customPopoverClass
                    }));
                }
            },
            showExternalViews: function (options) {
                if (extraItems && extraItems.length > 0) {
                    var collection,
                        that = this;
                    _.each(extraItems, function (item, index) {
                        if (options.hideOutdatedDocsCheck &&
                            item.prototype.propertyPrefix === OUTDATED_DOCUMENTS_FACTORY) { return; }
                        if (options.hideInProcessDocsCheck &&
                            item.prototype.propertyPrefix === INPROCESS_DOCUMENT_FACTORY) { return; }
                        if (!options.workspaceContext) {
                            options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
                        }
                        options.workspaceContext.setWorkspaceSpecific(item);
                        collection = options.workspaceContext.getCollection(item);
                        that.showCompletenessCheck({
                            collection: collection,
                            title: collection.options.name,
                            label: collection.options.label ? collection.options.label : collection.options.name,
                            icon: collection.options.iconClass,
                            headerColor: collection.options.headerColor,
                            enableIcon: collection.options.enableIcon,
                            enableDescription: collection.options.enableDescription,
                            index: index,
                            cancelDefaultAction: collection.options.cancelDefaultAction,
                            customPopoverClass: collection.options.customPopoverClass
                        });

                    });
                }
            },
            addRegion: function (regionName) {
                if (!this.regionManager) {
                    this.regionManager = {};
                }
                var that = this;
                var $el = $(this.el);
                $el.append($('<div></div>').attr({ class: regionName }));
                var temRegion = Marionette.Region.buildRegion({ el: $el.find('.' + regionName) }, Marionette.Region);
                temRegion.getEl = function (selector) {
                    return that.$(selector);
                };
                this.regionManager[regionName] = temRegion;
            }
        });
        return CompletenessCheckView;
    });