/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery', 'csui/lib/underscore',
    'csui/lib/backbone', 'csui/lib/marionette', 'csui/utils/base',
    'csui/behaviors/default.action/default.action.behavior',
    'csui/utils/contexts/factories/connector',
    'csui/controls/table/table.view', 'csui/controls/pagination/nodespagination.view',
    'csui/dialogs/modal.alert/modal.alert',
    'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
    'csui/utils/commands', 'csui/controls/table/rows/description/description.view',
    'xecmpf/widgets/boattachments/impl/boattachment.table/toolbaritems',
    'xecmpf/widgets/boattachments/impl/boattachment.table/boattachments.columns',
    'xecmpf/widgets/boattachments/impl/headertoolbaritems',
    'xecmpf/controls/dialogheader/dialogheader.view',
    'xecmpf/controls/headertoolbar/headertoolbar.view',
    'xecmpf/controls/title/title.view',
    'xecmpf/behaviors/toggle.header/toggle.header.behavior',
    'i18n!xecmpf/widgets/boattachments/impl/nls/lang',
    'hbs!xecmpf/widgets/boattachments/impl/boattachment.table/boattachmentstable',
    'css!xecmpf/widgets/boattachments/impl/boattachment.table/boattachmentstable'
], function (module, $, _, Backbone, Marionette, base,
    DefaultActionBehavior,
    ConnectorFactory,
    TableView, PaginationView,
    ModalAlert,
    LayoutViewEventsPropagationMixin,
    commands, DetailsRowView,
    toolbarItems,
    AttachmentsColumns,
    HeaderToolbarItems,
    HeaderView,
    HeaderToolbarView,
    TitleView,
    ToggleHeaderBehavior,
    lang, template) {

    var config = module.config();

    _.defaults(config, {
        defaultPageSize: 30,
        orderBy: {
            sortColumn: '{name}',
            sortOrder: 'asc'
        }
    });

    var BOAttachmentTableView = Marionette.LayoutView.extend({

        className: 'xecmpf-boattachments-table',

        template: template,

        regions: {
            tableHeaderRegion: '.xecmpf-widget-table-header',
            tableRegion: '#botableview',
            paginationRegion: '#bopaginationview'
        },

        behaviors: {
            DefaultAction: {
                behaviorClass: DefaultActionBehavior
            },
            ToggleHeader: {
                behaviorClass: ToggleHeaderBehavior,
                tableHeader: '.xecmpf-widget-table-header',
                alternatingTableContainer: '.xecmpf-alternating-toolbars',
                tableToolbar: '.xecmpf-rowselection-toolbar'
            }
        },

        constructor: function BOAttachmentTableView(options) {
            options || (options = {});

            _.defaults(options, {
                data: {},
                pageSize: config.defaultPageSize,
                toolbarItems: toolbarItems,
                toolbarItemsMasks: {
                    toolbars: {}
                }
            });

            _.defaults(options.data, {
                pageSize: config.defaultPageSize,
                orderBy: config.orderBy
            });

            this.context = options.context;
            this.collection = options.collection;
            this.titleBarIcon = options.titleBarIcon;
            this.title = options.title;
            this.extId = options.extId;
            this.boId = options.boId;
            this.boType = options.boType;

            Marionette.LayoutView.prototype.constructor.apply(this, arguments);
            this.propagateEventsToRegions();
        },

        initialize: function (options) {
            this.setHeaderView();
            this.setTableView();
            this.setPagination();

            if (options.collection) {
                this.collection.fetched = false;
            }
        },

        setTableView: function () {
            this.columns = this.collection.columns;
            this.connector = (this.collection.node && this.collection.node.connector) ||
                this.context.getObject(ConnectorFactory);
            var columnsWithSearch = [''];
            _.each(this.columns.models, function (model) {
                if (model.get('sort') === true && model.get('type') === -1) {
                    columnsWithSearch.push(model.get('column_key'));
                }
            });
            var tableColumns = AttachmentsColumns.clone();

            this.tableView = new TableView({
                context: this.options.context,
                haveDetailsRowExpandCollapseColumn: true,
                descriptionRowView: DetailsRowView,
                descriptionRowViewOptions: {
                    firstColumnIndex: 2,
                    lastColumnIndex: 2,
                    showDescriptions: true,
                    collapsedHeightIsOneLine: true
                },
                connector: this.connector,
                collection: this.collection,
                columns: this.columns,
                tableColumns: tableColumns,
                columnsWithSearch: columnsWithSearch,
                selectColumn: true,
                pageSize: this.options.data.pageSize,
                orderBy: this.collection.options.boAttachments.attributes.sortExpanded || this.collection.orderBy,
                nameEdit: false,
                tableTexts: {
                    zeroRecords: lang.noAttachmentsFound
                },
                maxColumnsDisplayed: 10
            });

            this.listenTo(this.tableView, 'execute:defaultAction', function (node) {
                var args = {
                    node: node
                };
                this.trigger('before:defaultAction', args);
                if (!args.cancel) {
                    this.defaultActionController.executeAction(node, {
                        context: this.options.context,
                        originatingView: this
                    }).done(function () {
                        this.trigger('executed:defaultAction', args);
                    }.bind(this));
                }
            });
        },

        setPagination: function () {
            this.paginationView = new PaginationView({
                collection: this.collection,
                pageSize: this.options.data.pageSize
            });
        },

        onRender: function () {
            this.collection.fetch({
                reload: true
            });
            this.tableHeaderRegion.show(this.headerView);
            this.tableRegion.show(this.tableView);
            this.paginationRegion.show(this.paginationView);
        },

        onBeforeShow: function () {
            this._renderTitleIconWaterMark();
        },

        _renderTitleIconWaterMark: function () {
            var titleImgEl = this.$el.find('.tile-type-image img')[0];
      
            if (titleImgEl) {
                $(titleImgEl).after('<span class="csui-icon xecmpf-icon-boattachment-overlay" ' +
                    'title="' + lang.businessAttachments + '"></span>');
            }
        },

        setHeaderView: function () {
            var headerToolbarView = new HeaderToolbarView({
              commands: commands,
              originatingView: this,
              context: this.context,
              collection: this.collection,
              toolbarItems: HeaderToolbarItems,
              data: {
                extId: this.extId,
                boType: this.boType,
                boid: this.boId
              }
            });

            var titleIcon = this.titleBarIcon;
            var titleView = new TitleView({
              imageUrl: titleIcon.src,
              imageClass: titleIcon.cssClass,
              title: this.title
            });

            this.headerView = new HeaderView({
              iconRight: 'icon-tileCollapse',
              leftView: headerToolbarView,
              centerView: titleView
            });
        }
    });

    _.extend(BOAttachmentTableView.prototype, LayoutViewEventsPropagationMixin);

    return BOAttachmentTableView;
});