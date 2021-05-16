/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore", 'csui/lib/marionette',
    'csui/controls/tabletoolbar/tabletoolbar.view',
    'csui/controls/tableactionbar/tableactionbar.view',
    'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
    'csui/controls/table/table.view', 'csui/controls/pagination/nodespagination.view',
    'xecmpf/utils/commands/myattachments', 'csui/models/columns',
    'xecmpf/widgets/myattachments/metadata.nodeattachments.model', 'xecmpf/widgets/myattachments/metadata.attachment.model',
    'xecmpf/widgets/myattachments/metadata.attachments.columns',
    'xecmpf/widgets/myattachments/metadata.attachments.toolbaritems',
    'hbs!xecmpf/widgets/myattachments/metadata.attachments',
    'csui/controls/toolbar/toolitem.model',
    'csui/controls/globalmessage/globalmessage',
    'csui/controls/toolbar/toolbar.command.controller',
    'csui/utils/url',
    'csui/utils/base',
    'i18n!xecmpf/widgets/myattachments/nls/myattachments.lang',
    'csui/controls/tile/behaviors/perfect.scrolling.behavior',
    'css!xecmpf/widgets/myattachments/metadata.attachments'

], function (module, $, _, Marionette,
             TableToolbarView,
             TableActionBarView,
             LayoutViewEventsPropagationMixin,
             TableView,
             PaginationView,
             commands,
             NodeColumnCollection,
             NodeAttachmentsCollection,
             AttachmentModel,
             metadataAttachmentsColumns,
             toolbarItems,
             template,
             ToolItemModel,
             GlobalMessage,
             ToolbarCommandController,
             Url,
             base,
             lang,
             PerfectScrollingBehavior) {
    'use strict';

    var config = module.config();
    _.defaults(config, {
        defaultPageSize: 30,
        showInlineActionBarOnHover: !base.isTouchBrowser(),
        forceInlineActionBarOnClick: false,
        inlineActionBarStyle: "csui-table-actionbar-bubble",
        clearFilterOnChange: true,
        resetOrderOnChange: false,
        resetLimitOnChange: true,
        fixedFilterOnChange: false
    });


    var MetadataAttachmentsTableView = Marionette.LayoutView.extend({

        className: 'metadata-inner-wrapper',
        template: template,

        ui: {
            tableView: '#att-tableview',
            childContainer: '#att-tableview',
            paginationView: '#att-paginationview'
        },

        regions: {
            tableToolbarRegion: '#att-tabletoolbar',
            tableRegion: '#att-tableview',
            paginationRegion: '#att-paginationview'
        },

        constructor: function MetadataAttachmentsTableView(options) {
            MetadataAttachmentsTableView.__super__.constructor.call(this, options);

            this.options.data || (this.options.data = {});
            _.defaults(this.options.data, {
                pageSize: config.defaultPageSize || 30,
            });

            this.commands = commands;
            this.collection = new NodeAttachmentsCollection(undefined, {
                node: this.options.model,
                autoreset: true,
                expand: "user",
                commands: this.commands,
                onlyClientSideDefinedColumns: true  // ignore columns sent by server
            });
            this.commandController = new ToolbarCommandController({commands: this.commands});
            this.listenTo(this.commandController, 'after:execute:command', this._toolbarActionTriggered);

            this.behaviors = _.extend({
                PerfectScrolling: {
                    behaviorClass: PerfectScrollingBehavior,
                    contentParent: '> .tab-content',
                    scrollXMarginOffset: 30,
                    scrollYMarginOffset: 15
                }
            }, this.behaviors);

            this.options.model.busatts = this.collection;  // connect bus.attachment collection with node

            this._setToolBar();
            this._setTableView();
            this._setPagination();

            this.setActionBarEvents();

            this.collection.fetch();
            this.propagateEventsToRegions();
        },

        onRender: function () {
            this.tableToolbarRegion.show(this.tableToolbarView);
            this.tableRegion.show(this.tableView);
            this.paginationRegion.show(this.paginationView);
        },
        _toolbarActionTriggered: function (toolbarActionContext) {
            if (toolbarActionContext) {
                switch (toolbarActionContext.commandSignature) {
                case 'detach_business_attachment':
                    this.collection.fetch();
                    break;
                }
            }
        },

        _buildToolbarItems: function () {
            var deferred = $.Deferred();
            var getBoTypesUrl = Url.combine(this.model.urlBase(), 'addablebotypes');
            getBoTypesUrl = getBoTypesUrl.replace('/v1', '/v2');
            var ajaxOptions = {
                type: 'GET',
                url: getBoTypesUrl
            };

            var that = this;
            this.model.connector.makeAjaxCall(ajaxOptions)
                .done(function (response, statusText, jqxhr) {
                    var toolItems = [];
                    if (response && response.results && response.results.length > 0) {                        
                        response.results.forEach(function (boTypeRes) {
                            var toolItem = new ToolItemModel({
                                signature: 'add_business_attachment',
                                name: boTypeRes.data.properties.bo_type_name,
                                type: 123, //addType,
                                group: 'add',
                                commandData: {
                                    boType: boTypeRes.data.properties,
                                    node_id: that.model.get('id'),
                                    collection: that.collection
                                }
                            });
                            toolItems.push(toolItem);
                        });
                        if (toolItems.length > 0) {
                            toolItems.sort(function (a, b) {
                                var aname = a.get("name"),
                                    bname = b.get("name"),
                                    result = base.localeCompareString(aname, bname, {usage: "sort"});
                                return result;
                            });
                        }                        
                    }
                    toolbarItems.addToolbar.reset(toolItems);
                    deferred.resolve.apply(deferred, arguments);
                })
                .fail(function (jqXHR, statusText, error) {
                    var linesep = "\r\n",
                        lines = [];
                    if (statusText !== "error") {
                        lines.push(statusText);
                    }
                    if (jqXHR.responseText) {
                        var respObj = JSON.parse(jqXHR.responseText);
                        if (respObj && respObj.error) {
                            lines.push(respObj.error);
                        }
                    }
                    if (error) {
                        lines.push(error);
                    }
                    var errmsg = lines.length > 0 ? lines.join(linesep) : undefined;
                    GlobalMessage.showMessage("error", lang.ErrorLoadingAddItemMenu, errmsg);
                    deferred.reject.apply(deferred, arguments);
                });
        },

        _setToolBar: function () {
            var originatingView = this;
            if (this.options && this.options.metadataView && this.options.metadataView.options &&
                this.options.metadataView.options.metadataNavigationView) {
                originatingView = this.options.metadataView.options.metadataNavigationView;
            }
            this._buildToolbarItems();

            this.tableToolbarView = new TableToolbarView({
                context: this.options.context,
                commands: commands,
                toolbarItems: toolbarItems,
                collection: this.collection,
                originatingView: originatingView,
                toolbarCommandController: this.commandController
            });
        },

        _updateToolItems: function () {
            if (this.tableToolbarView) {
                this.tableToolbarView.updateForSelectedChildren(this.tableView.getSelectedChildren());
            }
        },

        _setTableView: function () {
            this.options || (this.options = {});

            var args = _.extend({
                tableColumns: metadataAttachmentsColumns,
                context: this.options.context,
                connector: this.model.connector,
                collection: this.collection,
                columns: this.collection.columns,
                pageSize: this.options.data.pageSize,
                columnsWithSearch: ['name', 'bo_id'],
                orderBy: "bo_id asc",
                commands: commands,
                customLabels: {
                    zeroRecordsMsg: lang.noBusinessAttachmentsAvailable,
                    emptySearchTable: lang.tableColumnSearchNoResult
                }
            }, this.options);

            this.tableView = new TableView(args);

            this.listenTo(this.tableView, "tableRowSelected", this._updateToolItems);
            this.listenTo(this.tableView, "tableRowUnselected", this._updateToolItems);
            this.listenTo(this.collection, "reset", this._updateToolItems);
            this.listenTo(this.collection, "change", this._updateToolItems);
            this.listenTo(this.collection, "remove", this._updateToolItems);
            this.listenTo(this.collection, "add", this._buildToolbarItems);
            this.listenTo(this.collection, "remove", this._buildToolbarItems);
        },

        _setPagination: function () {
            this.paginationView = new PaginationView({
                collection: this.collection,
                pageSize: this.options.data.pageSize
            });
            return true;
        },

        setActionBarEvents: function () {
            if (config.forceInlineActionBarOnClick) {
                this.listenTo(this.tableView, 'row:clicked', function (args) {
                    if (this.tableActionBarView) {
                        var oldModelId = this.tableActionBarView.model.get('id');
                        var newModelId = args.node.get('id');
                        if (oldModelId === newModelId) {
                            return;
                        }
                    }
                    this._destroyOldAndCreateNewActionBarWithoutDelay(args);
                });
            } else {
                if (config.showInlineActionBarOnHover) {
                    this.listenTo(this.tableView, 'enterTableRow', this._showActionBarWithDelay);
                    this.listenTo(this.tableView, 'leaveTableRow', this._actionBarShouldDestroy);
                }
            }
            this.listenTo(this.collection, "reset", this._destroyActionBar);
            if (this.collection.node) {
                this.listenTo(this.collection.node, 'change:id', this._destroyActionBar);
            }
        },

        _showActionBar: function (args) {
            var selectedItems = this.tableView.getSelectedChildren();
            if (selectedItems.length > 0) {
                return;
            }
            if (this.tableActionBarView) {
                this._savedHoverEnterArgs = args;
            } else {
                this._savedHoverEnterArgs = null;

                this.tableActionBarView = new TableActionBarView(_.extend({
                        context: this.options.context,
                        commands: /*this.defaultActionController.*/commands,
                        collection: toolbarItems.inlineActionbar,
                        delayedActions: this.collection.delayedActions,
                        container: this.collection.node,
                        model: args.node,
                        originatingView: this
                    }, toolbarItems.inlineActionbar.options, {
                        inlineActionBarStyle: config.inlineActionBarStyle
                    })
                );
                this.tableActionBarView.render();
                this.listenToOnce(this.tableActionBarView, 'destroy', function () {
                    if (this.tableActionBarView) {
                        this.stopListening(this.tableActionBarView);
                    }
                    if (this._savedHoverEnterArgs) {
                        this._showActionBarWithDelay(this._savedHoverEnterArgs);
                    }
                }, this);
                var abEl = this.tableActionBarView.$el;

                var nameCell = this.tableView.getNameCell(args.target);
                if (nameCell && nameCell.length === 1) {
                    var actionBarDiv = nameCell.find('.csui-table-cell-name-appendix');
                    actionBarDiv.append(abEl);
                    actionBarDiv.addClass('csui-table-cell-name-appendix-full');
                    this.tableActionBarView.triggerMethod("after:show");
                }
            }
        },

        _showActionBarWithDelay: function (args) {
            if (this._showActionbarTimeout) {
                clearTimeout(this._showActionbarTimeout);
            }
            var self = this;
            this._showActionbarTimeout = setTimeout(function () {
                self._showActionbarTimeout = null;
                if (!self.tableView.lockedForOtherContols) {
                    self._showActionBar.call(self, args);
                }
            }, 200);
        },

        _destroyOldAndCreateNewActionBarWithoutDelay: function (args) {
            this._actionBarShouldDestroy();
            if (!this.tableView.lockedForOtherContols) {
                this._showActionBar.call(this, args);
            }
        },

        _actionBarShouldDestroy: function () {
            if (this._showActionbarTimeout) {
                clearTimeout(this._showActionbarTimeout);
                this._showActionbarTimeout = null;
            }
            this._destroyActionBar();
        },

        _destroyActionBar: function () {
            if (this.tableActionBarView) {
                var actionBarDiv = this.tableActionBarView.$el.parent();
                actionBarDiv.removeClass('csui-table-cell-name-appendix-full');

                this.tableActionBarView.destroy();
                this.tableActionBarView = null;
            }
        },

    });
    _.extend(MetadataAttachmentsTableView.prototype, LayoutViewEventsPropagationMixin);

    return MetadataAttachmentsTableView;

});
