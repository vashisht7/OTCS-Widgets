/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery', 'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/lib/marionette',
    'csui/utils/log',
    'csui/utils/base',

    'csui/utils/contexts/factories/connector',
    'csui/controls/progressblocker/blocker',
    'csui/controls/table/cells/name/name.view',
    'csui/behaviors/default.action/default.action.behavior',
    'xecmpf/widgets/workspaces/factories/workspace.factory',
    'csui/utils/contexts/factories/columns',
    'csui/controls/table/table.view',
    'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',

    'xecmpf/widgets/workspaces/controls/workspaces.table/tabletoolbar.view',
    'xecmpf/widgets/workspaces/controls/workspaces.table/table.columns',
    'xecmpf/widgets/workspaces/controls/workspaces.table/toolbaritems',
    'csui/controls/pagination/nodespagination.view',

    'i18n!xecmpf/widgets/workspaces/controls/workspaces.table/impl/nls/lang',
    'hbs!xecmpf/widgets/workspaces/controls/workspaces.table/impl/workspacestable',
    'css!xecmpf/widgets/workspaces/controls/workspaces.table/impl/workspacestable'
], function (module, $, _, Backbone,
             Marionette, log, base,
             ConnectorFactory,
             BlockingView,
             NameCellView,
             DefaultActionBehavior,
             WorkspacesCollectionFactory,
             ColumnCollectionFactory,
             TableView,
             LayoutViewEventsPropagationMixin,
             TableToolbarView,
             TableColumns,
             ToolbarItems,
             PaginationView,
             lang, template, css) {

    var config = module.config();

    _.defaults(config, {
        defaultPageSize: 30,
        clearFilterOnChange: true,
        resetOrderOnChange: false,
        resetLimitOnChange: true,
        fixedFilterOnChange: false
    });

    NameCellView.prototype.getValueData = function () {

        var column = this.options.column,
            node = this.model,
            name = node.get(column.name);

        return {
            defaultAction: 'displayWorkspace',
            defaultActionUrl: '',
            contextualMenu: column.contextualMenu,
            name: name,
            inactive: node.get('inactive')
        };
    };

    var WorkspacesTableView = Marionette.LayoutView.extend({
        template: template,
        className: 'xecmpf_workspacestable',
        regions: {
            tableToolbarRegion: '#tabletoolbar',
            tableRegion: '#tableview',
            paginationRegion: '#paginationview'
        },
        ui: {
            outerTableContainer: '#outertablecontainer',
            innerTableContainer: '#innertablecontainer',
            tableView: '#tableview',
            paginationView: '#paginationview'
        },
        behaviors: {
            DefaultAction: {
                behaviorClass: DefaultActionBehavior
            }
        },

        constructor: function WorkspacesTableView(options) {
            options || (options = {});
            _.defaults(options, {
                data: {},
                pageSize: config.defaultPageSize,
                toolbarItems: ToolbarItems,
                defaultPageSize: config.defaultPageSize,
                clearFilterOnChange: config.clearFilterOnChange,
                resetOrderOnChange: config.resetOrderOnChange,
                resetLimitOnChange: config.resetLimitOnChange,
                fixedFilterOnChange: config.fixedFilterOnChange
            });

            this.context = options.context;
            this.connector = this.context.getObject(ConnectorFactory);

            var height = options.data.height || options.height;
            if (height) {
                this.$el.height(height);
            }
            BlockingView.imbue(this);
            Marionette.LayoutView.prototype.constructor.apply(this, arguments); // sets this.options

            this.collection = this.options.collection = this.context.getCollection(
                WorkspacesCollectionFactory, {
                    attributes: 'early'
                });
            this.columns = this.collection.columns;
            this.tableColumns = TableColumns.deepClone();
            this._setToolBar(ToolbarItems);
            this.defaultActionController.executeAction = function (node) {
                return $.Deferred().resolve();
            }

            this._setTableView();
            this._setPagination();
            this.propagateEventsToRegions();
        },

        _setTableView: function () {

            this.tableView = new TableView({
                selectRows: "none",
                context: this.options.context,
                connector: this.connector,
                collection: this.collection,
                columns: this.columns,
                selectColumn: false,
                tableColumns: this.tableColumns,
                pageSize: this.options.data.pageSize,
                originatingView: this,
                columnsWithSearch: ["name"],
                orderBy: this.options.orderBy,
                filterBy: this.options.filterBy,
                blockingParentView: this,
                tableTexts: {
                    zeroRecords: lang.NodeTableNoFilteredItems
                }
            });
            this.listenTo(this.tableView, 'render', function () {
                this.tableView.$el.append($('<div>')[0]);
            });

            this._setTableViewEvents();
        },
        _setTableViewEvents: function () {

            this.listenTo(this.tableView, 'dom:refresh', function () {
                $('.csui-nodetable')[0] && !$('.csui-not-ready')[0]  && $('.csui-nodetable').trigger("focus");
            });

            this.listenTo(this.tableView, 'execute:defaultAction', function (node) {
                var args = {node: node};
                this.trigger('before:defaultAction', args);
                if (!args.cancel) {
                    var self = this;
                    this.defaultActionController
                        .executeAction(node, {
                            context: this.options.context,
                            originatingView: this
                        })
                        .done(function () {
                            self.trigger('executed:defaultAction', args);
                        });
                }
            });

            return true;
        },
        _setToolBar: function (toolItems) {
            this.tableToolbarView = new TableToolbarView(
                _.defaults(this.options, {
                    context: this.options.context,
                    toolbarItems: toolItems,
                    collection: this.collection,
                    originatingView: this,
                }));

            this.listenTo(this.tableToolbarView, 'before:execute:command', this._beforeExecuteCommand);
            this.listenTo(this.tableToolbarView, 'after:execute:command', this._toolbarActionTriggered);
            this.listenTo(this.tableToolbarView, 'toolbarItem:clicked',
                function (args) {
                    this.trigger('toolbarItem:clicked', args);
                }
            );

            return true;
        },

        _setPagination: function () {
            this.paginationView = new PaginationView({
                collection: this.collection,
                pageSize: this.options.data.pageSize || this.options.pageSize,
                defaultDDList: this.options.ddItemsList,
                externalWidget: this.options.externalWidget
            });

            return true;
        },
        onShow: function () {
            _.each(this.regionManager._regions, function (region) {
                if (region.currentView) {
                    region.currentView.triggerMethod('show');
                }
            });
        },

        onAfterShow: function () {
            _.each(this.regionManager._regions, function (region) {
                if (region.currentView) {
                    region.currentView.triggerMethod('after:show');
                }
            });
        },
        onRender: function () {
            this.tableToolbarRegion.show(this.tableToolbarView);
            this.tableRegion.show(this.tableView);
            this.paginationRegion.show(this.paginationView);
        }
    });
    _.extend(WorkspacesTableView.prototype, LayoutViewEventsPropagationMixin);
    return WorkspacesTableView;
});

