/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base',
  'csui/models/utils/v1tov2',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/columns',
  'csui/utils/contexts/factories/children',
  'csui/utils/contexts/factories/columns2',
  'csui/utils/contexts/factories/children2',
  'csui/utils/contexts/factories/node',
  'csui/models/node/node.addable.type.factory',
  'csui/models/node/node.facet2.factory',
  'csui/utils/contexts/factories/appcontainer',
  'csui/utils/contexts/factories/user',
  'csui/models/node/node.model',
  'csui/models/nodes',
  'csui/controls/progressblocker/blocker',
  'csui/controls/tabletoolbar/tabletoolbar.view',
  'csui/controls/table/inlineforms/inlineform.factory',
  'csui/controls/facet.panel/facet.panel.view',
  'csui/controls/facet.bar/facet.bar.view',
  'csui/controls/table/table.view',
  'csui/controls/table/table.columns',
  'csui/controls/table/rows/description/description.view',
  'i18n!csui/widgets/nodestable/impl/nls/lang',
  'i18n!csui/utils/commands/nls/localized.strings',
  'i18n!csui/controls/table/impl/nls/lang',
  'csui/controls/pagination/nodespagination.view',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/utils/defaultactionitems',
  'csui/utils/toolitem.masks/children.toolitems.mask',
  'csui/utils/toolitem.masks/creation.toolitems.mask',
  'csui/widgets/nodestable/toolbaritems',
  'csui/widgets/nodestable/toolbaritems.masks',
  'csui/widgets/nodestable/headermenuitems',
  'csui/widgets/nodestable/headermenuitems.mask',
  'csui/utils/commands',
  'csui/controls/table.rowselection.toolbar/table.rowselection.toolbar.view',
  'csui/controls/tableactionbar/tableactionbar.view',
  'csui/controls/toolbar/toolbar.command.controller',
  'csui/controls/draganddrop/draganddrop.view',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/mixins/view.state/node.view.state.mixin',
  'csui/controls/globalmessage/globalmessage',
  'csui/controls/thumbnail/thumbnail.view',
  'csui/controls/thumbnail/thumbnail.content',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/utils/dragndrop.supported.subtypes',
  'csui/utils/accessibility',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/namedlocalstorage',
  'csui/behaviors/item.error/item.error.behavior',
  'hbs!csui/widgets/nodestable/impl/nodestable',
  'csui/lib/jquery.when.all',
  'csui/lib/jquery.redraw', 'css!csui/widgets/nodestable/impl/nodestable'
], function (module, $, _, Backbone, Marionette, log, base, v1tov2,
    ConnectorFactory,
    ColumnCollectionFactory,
    ChildrenCollectionFactory,
    Column2CollectionFactory,
    Children2CollectionFactory,
    NodeModelFactory,
    AddableTypeCollectionFactory,
    Facet2CollectionFactory,
    AppContainerFactory,
    UserModelFactory,
    NodeModel,
    NodeCollection,
    BlockingView,
    TableToolbarView,
    inlineFormViewFactory,
    FacetPanelView,
    FacetBarView,
    TableView,
    tableColumns,
    DescriptionRowView,
    lang,
    cmdLang,
    controlLang,
    PaginationView,
    DefaultActionBehavior,
    defaultActionItems,
    ChildrenToolItemsMask,
    CreationToolItemsMask,
    toolbarItems,
    ToolbarItemsMasks,
    headermenuItems,
    HeaderMenuItemsMask,
    commandsCollection,
    TableRowSelectionToolbarView,
    TableActionBarView,
    ToolbarCommandController,
    DragAndDrop,
    LayoutViewEventsPropagationMixin,
    NodeViewStateMixin,
    GlobalMessage,
    ThumbnailView,
    thumbnailColumns,
    ModalAlert,
    DragndropSupportedSubtypes,
    Accessibility,
    NextNodeModelFactory,
    NamedLocalStorage,
    ItemErrorBehavior,
    template) {
  'use strict';

  var accessibleTable = Accessibility.isAccessibleTable();
  var fast = /\bfast\b(?:=([^&]*)?)?/i.exec(location.search);
  fast = fast ? fast[1] !== 'false' : undefined;

  var globalConfig = module.config();
  _.defaults(globalConfig, {
    useV2RestApi: false,
    persistSortOrderState: true
  });

  var NodesTableView = Marionette.LayoutView.extend({

    className: function () {
      var className = 'csui-nodestable';
      if (accessibleTable) {
        className += ' csui-no-animation';
      }
      return className;
    },
    template: template,

    ui: {
      facetTableContainer: '.csui-facet-table-container',
      outerTableContainer: '.csui-outertablecontainer',
      innerTableContainer: '.csui-innertablecontainer',
      tableView: '.csui-table-tableview',
      thumbnail: '.csui-thumbnail-wrapper',
      toolbarContainer: '.csui-alternating-toolbars',
      facetView: '.csui-table-facetview',
      paginationView: '.csui-table-paginationview'
    },

    regions: {
      facetBarRegion: '.csui-table-facetbarview',
      tableToolbarRegion: '.csui-table-tabletoolbar',
      tableRowSelectionToolbarRegion: '.csui-table-rowselection-toolbar',
      facetRegion: '.csui-table-facetview',
      tableRegion: '.csui-table-tableview',
      thumbnailRegion: '.cs-thumbnail-wrapper',
      paginationRegion: '.csui-table-paginationview'
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      ItemError: {
        behaviorClass: ItemErrorBehavior,
        model: function () {
          return this.container;
        },
      }
    },

    constants: {
      DEFAULT_SORT: "name asc"
    },

    constructor: function NodesTableView(options) {
      this.options = options;
      this.context = options.context;
      var currentUserId = options.context.getModel(UserModelFactory).get('id');
      if (!currentUserId) {
        var userFactory = options.context.getFactory(UserModelFactory);
        if (userFactory && userFactory.initialResponse) {
          currentUserId = userFactory.initialResponse.data.id;
        }
      }
      var container = this.options.container || this.context.getModel(NodeModelFactory);
      if (container && container.get("persist")) {
        this.namedLocalStorage = new NamedLocalStorage('nodestablePreferences:' + currentUserId);
      }
      var config = module.config();
      _.defaults(config, {
        defaultPageSize: 30,
        defaultPageSizes: [30, 50, 100],
        showInlineActionBarOnHover: !accessibleTable,
        forceInlineActionBarOnClick: false,
        inlineActionBarStyle: "csui-table-actionbar-bubble",
        clearFilterOnChange: true,
        resetOrderOnChange: false,
        resetLimitOnChange: true,
        fixedFilterOnChange: false,
        useV2RestApi: globalConfig.useV2RestApi,
        useAppContainer: false,
        showCondensedHeaderToggle: true,
        resetOrderByOnBrowse: true
      });
      this.persistSortOrderState = this.options.persistSortOrderState || globalConfig.persistSortOrderState;
      if (fast !== undefined) {
        config.useAppContainer = fast;
      }

      options || (options = {});
      _.defaults(options, config, {
        data: {},
        pageSize: config.defaultPageSize,
        ddItemsList: config.defaultPageSizes,
        toolbarItems: toolbarItems.clone(),
        headermenuItems: headermenuItems.clone(),
        clearFilterOnChange: config.clearFilterOnChange,
        resetOrderOnChange: config.resetOrderOnChange,
        resetLimitOnChange: config.resetLimitOnChange,
        fixedFilterOnChange: config.fixedFilterOnChange,
        showDescriptions: this.getContainerPrefs('isDescriptionShown'),
        isDragNDropSuppoertedWidget: true,
        showSelectionCounter: true,
        resetOrderByOnBrowse: config.resetOrderByOnBrowse,
        urlParamsList: ['order_by', 'page', 'filter']
      });

      this._addUrlParametersSupport(options.context);
      var pageSize  = options.data.pageSize || options.pageSize,
          pageSizes = options.data.pageSizes || options.ddItemsList;

      if (this.namedLocalStorage && this.namedLocalStorage.get('pageSize') !== undefined) {
        pageSize = this.namedLocalStorage.get('pageSize');
        if (options.data.pageSize) {
          options.data.pageSize = pageSize;
        } else {
          options.pageSize = pageSize;
        }
      }

      if (!_.contains(pageSizes, pageSize)) {
        pageSizes.push(pageSize);
        options.data.pageSizes = pageSizes.sort();
      }

      this.tableColumns = tableColumns.deepClone();

      this.commands = options.commands || commandsCollection;

      this.commandController = new ToolbarCommandController({commands: this.commands});
      this.listenTo(this.commandController, 'before:execute:command', this._beforeExecuteCommand);
      this.listenTo(this.commandController, 'after:execute:command', this._afterExecuteCommand);
      this.listenTo(this.commandController, 'click:toolitem:action', this._toolbarActionTriggered);

      if (!options.connector) {
        options.connector = this.context.getObject(ConnectorFactory);
      }
      this.connector = options.connector;

      if (!options.toolbarItemsMasks) {
        options.toolbarItemsMasks = new ToolbarItemsMasks();
      }
      if (!options.headermenuItemsMask) {
        options.headermenuItemsMask = new HeaderMenuItemsMask();
      }
      if (options.blockingParentView) {
        BlockingView.delegate(this, options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }

      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.onWinRefresh = _.bind(this.windowRefresh, this);
      $(window).on("resize.app", this.onWinRefresh);

      this.propagateEventsToRegions();

      this.listenTo(this, 'before:regions:reinitialize', this.initialize.bind(this, this.options))
          .listenTo(this, 'dom:refresh', this._refreshTableToolbar)
          .listenTo(this, 'enable:blocking', this._rememberFocusInTable)
          .listenTo(this, 'disable:blocking', this._restoreFocusInTable);
      this.listenTo(this.collection, 'change', function (model) {
        if (!!model.inlineFormView) {
          this.changedModelIndex = this.collection.indexOf(model);
        }
      });
      if (this.collection.delayedActions) {
        this.listenTo(this.collection.delayedActions, 'sync', _.bind(function () {
          if (this.$el.find('.csui-facetview-hidden').length === 0) {
            this.addFilterCommandAria();
          }
        }, this));
      }

      this.listenTo(this.collection, 'sync', this._restoreSelectedNodesFromSessionViewSate);
      this.listenTo(this.collection, 'reset', _.bind(function () {
        if (this.paginationView && this.namedLocalStorage) {
          this.paginationView.options.pageSize = this.paginationView.selectedPageSize;
          this.namedLocalStorage.set('pageSize', this.paginationView.selectedPageSize);
          if (this.tableView) {
            this.tableView.options.descriptionRowViewOptions.showDescriptions =
                this.options.showDescriptions =
                    !accessibleTable && this.getContainerPrefs('isDescriptionShown');
          }
        }

        if (!this.container || container.get('id') === this.container.get('id')) {
          var orderBy = this.getContainerPrefs('orderBy');
          if (!this.options.isContainerChanged) {
            orderBy = this.collection.orderBy;
          }
          this.options.isContainerChanged = false;
          this.setContainerPrefs({orderBy: orderBy});
        }
      }, this));

      this.listenTo(this.context, 'request', this._resetSortOrderBy);

      this.isDragNDropSuppoertedWidget = options.isDragNDropSuppoertedWidget || true;

      this.enableMetadataPerspective = !options.isExpandedView;

      this.enforceDescriptionColumnInAccessibleMode = true;
    },

    initialize: function (options) {
      function updateToolbarItemsMasks() {
        _.each(this.options.toolbarItemsMasks.toolbars, function (mask, key) {
          mask.restoreAndResetMask(this.options.childrenToolItemsMask);
        }, this);
      }
      var defaultActionCommands = this.defaultActionController.commands,
          defaultActionItems    = this.defaultActionController.actionItems;

      if (this.options.container) {
        this.container = this.options.container;
      } else if (this.options.data.containerId) {
        this.container = this.context.getModel(NodeModelFactory, {
          node: {
            attributes: {id: this.options.data.containerId}
          }
        });
      }
      this.trigger('update:model', this.container);

      this.initAllSelection();

      if (!this.collection) {
        var collectionStateOptions = this._restoreCollectionState();
        this.collection = this.context.getCollection(
            ChildrenCollectionFactory, {
              options: _.defaults({
                commands: this._getCommands(),
                defaultActionCommands: this.options.useAppContainer ? [] :
                                       defaultActionItems.getAllCommandSignatures(
                                           defaultActionCommands),
                delayRestCommands: true,
                node: this.container,
              }, collectionStateOptions),
              attributes: this.options.data.containerId ? {id: this.options.data.containerId} :
                          undefined,
              detached: this.options.useAppContainer,
              useSpecialPaging: this.options.useAppContainer
            });
      }
      if (this.options.data.containerId && !this.collection.node.get('id')) {
        this.collection.node.set('id', this.options.data.containerId);
      }
      var viewStateModel = this.context.viewStateModel;
      this.listenTo(this.collection, 'filter:clear', this._collectionFilterChanged)
          .listenTo(viewStateModel, 'change:state', this.onViewStateChanged);

      if (this.collection.node) {
        this.listenTo(this.collection.node, 'change:id', function () {
          this._allSelectedNodes && this._allSelectedNodes.reset([]);
          if (this.thumbnailViewState !== this.getContainerPrefs('isThumbnailEnabled')) {
            this.thumbnailViewState = this.getContainerPrefs('isThumbnailEnabled');
            this.enableThumbnailView();
          }
        });
      }

      this.listenTo(this.context.getModel(NextNodeModelFactory), 'before:change:id', function () {
        this.options.isContainerChanged = true;
        this.removeOrderBy();
      });

      if (!this.container) { // if not created before when this.collection was undefined
        this.container = options.container || this.collection.node;
      }
      if (this.collection.delayedActions) {
        this.listenTo(this.collection.delayedActions, 'error',
            function (collection, request, options) {
              var error = new base.Error(request);
              GlobalMessage.showMessage('error', error.message);
            });
      }
      this.columns = options.columns ||
                     this.context.getCollection(ColumnCollectionFactory, {
                       options: {
                         node: this.container
                       },
                       attributes: this.options.data.containerId ?
                       {id: this.options.data.containerId} :
                                   undefined
                     });
      this.addableTypes = options.addableTypes ||
                          this.context.getCollection(AddableTypeCollectionFactory, {
                            options: {
                              node: this.container
                            },
                            attributes: this.options.data.containerId ?
                            {id: this.options.data.containerId} :
                                        undefined,
                            detached: this.options.useAppContainer
                          });

      var initialFacetFilter = this._formatFacetFilter(this.collection.filters);
      if (initialFacetFilter) {
        this.showFacetPanelOnLoad = true;
      }
      this.facetFilters = options.facetFilters ||
                          this.context.getCollection(
                              Facet2CollectionFactory, {
                                options: {
                                  node: this.container,
                                  filters: initialFacetFilter,
                                  itemsToShow: 5  // by design and PM decision, show 5 items first
                                },
                                attributes: this.options.data.containerId ?
                                {id: this.options.data.containerId} :
                                            undefined,
                                detached: true
                              });
      if (this.getContainerPrefs('orderBy') !== undefined) {
        var orderBy = this.getContainerPrefs('orderBy');
        this.options.orderBy = orderBy;
      }

      if (this.options.useAppContainer) {
        var acOptions = {
          models: {
            container: this.container,
            addableTypes: this.addableTypes,
            children: this.collection
          }
        };
        this.appContainer = this.context.getObject(AppContainerFactory, acOptions);
      }

      if (this.container) {
        if (!this.options.childrenToolItemsMask) {
          this.options.childrenToolItemsMask = new ChildrenToolItemsMask({
            context: this.context,
            node: this.container
          });
        }
        updateToolbarItemsMasks.call(this);
        this.listenTo(this.options.childrenToolItemsMask, 'update', updateToolbarItemsMasks);
        if (!this.options.creationToolItemsMask) {
          this.options.creationToolItemsMask = new CreationToolItemsMask({
            context: this.context,
            node: this.container
          });
        }
        this._lastContainerId = this.container.get('id');
        this.listenTo(this.context, 'request', function () {
          var currentContainerId = this.container.get('id');
          if (currentContainerId !== this._lastContainerId) {
            this._lastContainerId = currentContainerId;
            this._changingContainer();
          }
        });
        this.listenTo(this.container, 'change:id', function () {
          var currentContainerId = this.container.get('id');
          if (currentContainerId !== this._lastContainerId) {
            this._lastContainerId = currentContainerId;
            this._changingContainer();
          }
        });
        if (this.collection.filters && this.collection.filters.facet) {
          this._showOrHideLocationColumn(true);
        } else {
          this._showOrHideLocationColumn();
        }
      }
      this._setFacetBarView();
      this._setToolBar();
      this.setTableView({
        enableDragNDrop: true
      });
      this.setTableRowSelectionToolbar({
        toolItemFactory: this.options.toolbarItems.tableHeaderToolbar,
        toolbarItemsMask: this.options.toolbarItemsMasks.toolbars.tableHeaderToolbar,
        showCondensedHeaderToggle: this.options.showCondensedHeaderToggle,
        showSelectionCounter: this.options.showSelectionCounter
      });

      this.thumbnailViewState = this.getContainerPrefs('isThumbnailEnabled');

      this._setTableRowSelectionToolbarEventListeners();
      this.setPagination();
      this.setDragNDrop();

      this._updateZeroRecordsMessage();
    },

    _restoreCollectionState: function () {
      var pageInfo = this.getViewStatePage();
      if (pageInfo && pageInfo.top && pageInfo.skip) {
        try {
          pageInfo.top = parseInt(pageInfo.top);
          pageInfo.skip = parseInt(pageInfo.skip);
          this.options.pageSize = this.options.data.pageSize = pageInfo.top;
          this.options.pageNumber = pageInfo.skip / pageInfo.top;
        } catch (error) {
          log.error('invalid page info in url.');
        }
      }

      var viewStateFilter = this.getViewStateFilter();
      var viewStateOrder = this.getViewStateOrderBy() || this.getDefaultViewStateOrderBy();

      return {
        top: pageInfo && pageInfo.top,
        skip: pageInfo && pageInfo.skip,
        filter: viewStateFilter,
        orderBy: viewStateOrder
      };
    },
    initAllSelection: function () {
      this._allSelectedNodes = this.getCollectionWithSpecificModelId();

      this.listenTo(this._allSelectedNodes, 'remove', this.removeItemToAllSelectedItems)
          .listenTo(this._allSelectedNodes, 'add', this.addItemToAllSelectedItems)
          .listenTo(this._allSelectedNodes, 'reset', this.resetAllSelectedItems);
    },
    findNodeFromCollection: function (collection, node) {
      return collection.get(node) || collection.findWhere({id: node.get('id')});
    },
    getCollectionWithSpecificModelId: function () {
      var MultiSelectCollection = Backbone.Collection.extend({
            modelId: function (attr) {
              return attr.id;
            }
          }),
          allSelectedCollection = new MultiSelectCollection();
      if (this.collection && this.collection.modelId) {
        allSelectedCollection.modelId = this.collection.modelId;
      }
      return allSelectedCollection;
    },
    removeItemToAllSelectedItems: function (node) {
      var model = this.findNodeFromCollection(this.collection, node);   //  collection.get(node);
      if (model) {
        model.set('csuiIsSelected', false); // will be ignored if already false
      } else {
        node.set('csuiIsSelected', false);
      }
      if (this.thumbnailViewState && this._allSelectedNodes.length === 0) {
        this.thumbnail.$el.find(".csui-thumbnail-select").removeClass('csui-checkbox');
      }
    },
    addItemToAllSelectedItems: function (node) {
      var model = this.findNodeFromCollection(this.collection, node);
      if (model) {
        model.set('csuiIsSelected', true); // will be ignored if already true
      } else {
        node.set('csuiIsSelected', true);
      }
    },
    resetAllSelectedItems: function () {
      var allSelectedNodes = this._allSelectedNodes;
      this.collection.each(_.bind(function (node) {
        var selectedNode = allSelectedNodes.get(node);
        node.set('csuiIsSelected', selectedNode !== undefined);// setting to same value is ignored
      }, this));
      if (this.thumbnailViewState && this._allSelectedNodes.length === 0) {
        this.thumbnail.$el.find(".csui-thumbnail-select").removeClass('csui-checkbox');
      }
    },

    _setThumbnailView: function (options) {
      if (!this.tableView.allColumns) {
        this.tableView._getColumns();
      }
      this.collection.orderBy = this.getContainerPrefs('orderBy') || (this.persistSortOrderState ?
                                        (this.options.orderBy || this.constants.DEFAULT_SORT) : this.collection.orderBy);
      options || (options = {});
      var args = _.defaults({
        originatingView: this,
        context: this.context,
        collection: this.collection,
        columns: this.columns,
        thumbnailColumns: this.tableView.columns,
        columnsWithSearch: ["name"],
        orderBy: this.collection.orderBy,
        filterBy: this.options.filterBy,
        selectedChildren: new NodeCollection(),
        actionItems: this.defaultActionController.actionItems,
        commands: this.defaultActionController.commands,
        tableColumns: thumbnailColumns,
        inlineBar: this.tableView.options.inlineBar,
        blockingParentView: this.options.blockingParentView || this,
        displayedColumns: this.tableView.displayedColumns,
        allColumns: this.tableView.allColumns,
        allSelectedNodes: this._allSelectedNodes,
        enableViewState: this.enableViewState
      }, options);
      this.thumbnail = new ThumbnailView(args);
      this.listenTo(this.thumbnail, 'execute:defaultAction', function (node) {
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

      this.thumbnail.listenTo(this.thumbnail, 'thumbnailItemRendered', _.bind(function (itemView) {
        if (!itemView.target.isEventSet && itemView.node.get('id')) {
          var itemdragNDrop = this.setDragNDrop(itemView);
          this._assignDragArea(itemdragNDrop, $(itemView.target));
          itemView.target.isEventSet = true;
        }
      }, this));
      this.listenTo(this, "properties:view:destroyed", this.thumbnail.closeInlineForm);
      this.listenTo(this, "permissions:view:destroyed", this.thumbnail.closeInlineForm);
      return true;
    },

    setThumbnailRowSelectionToolbar: function (options) {
      this._thumbnailRowSelectionToolbarView = new TableRowSelectionToolbarView({
        toolItemFactory: options.toolItemFactory,
        toolbarItemsMask: options.toolbarItemsMask,
        toolbarCommandController: this.commandController,
        showCondensedHeaderToggle: options.showCondensedHeaderToggle,
        showSelectionCounter: options.showSelectionCounter,
        commands: this.defaultActionController.commands,
        selectedChildren: this._allSelectedNodes,
        container: this.collection.node,
        context: this.context,
        originatingView: this,
        scrollableParent: '.csui-thumbnail-results',
        collection: this.collection
      });
      var toolbarView = this._thumbnailRowSelectionToolbarView;
      this.listenTo(toolbarView, 'toggle:condensed:header', function () {
        if (this.tableToolbarRegion.$el.hasClass('csui-table-rowselection-toolbar-visible')) {
          this.ui.toolbarContainer && this.ui.toolbarContainer.toggleClass('csui-show-header');

          var showingBothToolbars = this.ui.toolbarContainer &&
                                    this.ui.toolbarContainer.hasClass('csui-show-header');
          if (showingBothToolbars) {
            this.tableToolbarRegion.$el.removeClass('binf-hidden');
            this.tableToolbarRegion.currentView.trigger(this.tableToolbarRegion.currentView,
                'dom:refresh');
          }
          toolbarView.trigger('toolbar:activity', true, showingBothToolbars);
        }
      });
    },

    enableThumbnailView: function () {
      var tableView       = this.tableView,
          self            = this,
          deferred        = $.Deferred(),
          container       = this.container,
          context         = this.context,
          originatingView = this.originatingView;
      if (this.dragNDrop) {
        this.dragNDrop.stopListeningDragEvent(".csui-innertablecontainer", this);
        this.dragNDrop.stopListeningDragEvent(".csui-alternating-toolbars", this);
      }
      if (this.thumbnailViewState) {
        if (this.tableView.selectedChildren && this.tableView.selectedChildren.models.length > 0) {
          this.tableView.selectedChildren.models = [];
        }
        this._onSelectionUpdateCssClasses(this._allSelectedNodes.length, true);
        this._setThumbnailView(this.options);
        this._setThumbnailRowSelectionToolbarEventListeners();
      } else {
        this._onSelectionUpdateCssClasses(this._allSelectedNodes.length, true);
        this._setTableRowSelectionToolbarEventListeners();
      }
      if (this.tableView.options.inlineBar.options.maxItemsShown !== 1) {
        this.collection.defaultInlineMaxItemsShown = this &&
                                                     this.tableView.options.inlineBar.options.maxItemsShown;
      }
      if (this.thumbnailViewState) {
        this.tableView.options.inlineBar.options.maxItemsShown = 1;
        this.$el.find('table.dataTable').addClass("csui-thumbnail-view");
        this.thumbnailView = true;
      } else {
        this.thumbnailView = false;
        this.tableView.options.inlineBar.options.maxItemsShown = this.collection.defaultInlineMaxItemsShown;
        this.$el.find('table.dataTable').removeClass("csui-thumbnail-view");
      }

      this._saveThumbnailViewState();
      var _showOriginatingView, $csThumbnail;
      var $originatingView = this.$el.find(".csui-table-tableview");
      $csThumbnail = $(this.thumbnailRegion.el)[0];
      $csThumbnail = $($csThumbnail);
      if (!this.thumbnailViewState) {
        var sortingstate = this.getContainerPrefs('orderBy') || (this.persistSortOrderState ?
                                          (this.options.orderBy || this.constants.DEFAULT_SORT) : this.collection.orderBy);
        this.setViewStateOrderBy([sortingstate], {silent: true});
        sortingstate = this._formatOrderBy(sortingstate);
        var listArrowState = sortingstate;
        this.thumbnail && this.thumbnail.destroy();
        this.res = listArrowState && listArrowState.split(" ");
        if (this.res && this.res[1] === 'asc') {
          this.collection.orderstate = 'icon-sortArrowDown';
        } else {
          if (this.res && this.res[1] === 'desc') {
            this.collection.orderstate = 'icon-sortArrowUp';
          }
        }
        this.setTableView({
          enableDragNDrop: true
        });
        this.collection.state = this.res ? this.res[1] + "_" + this.res[0] : undefined;
        if (this.collection.sorting && this.collection.sorting.sort.length > 0 &&
            this.collection.sorting.sort[0].value) {
          this.collection.sorting.sort[0].value = this.res[1] + "_" + this.res[0];
        }
        this.setTableRowSelectionToolbar({
          toolItemFactory: this.options.toolbarItems.tableHeaderToolbar,
          toolbarItemsMask: this.options.toolbarItemsMasks.toolbars.tableHeaderToolbar,
          showCondensedHeaderToggle: this.options.showCondensedHeaderToggle,
          showSelectionCounter: this.options.showSelectionCounter
        });
        if (!this.thumbnailViewState && this.tableToolbarView.filterToolbarView) {
          this.tableToolbarView.filterToolbarView.collection.status.thumbnailViewState = this.tableView.thumbnailView;
        }
        this.tableToolbarView.rightToolbarView &&
        this.tableToolbarView.rightToolbarView.collection.refilter();
        if (this.tableView.collection && this.tableView.collection.length === 0) {
          this.tableView._showEmptyViewText = true;
        }
        this._updateZeroRecordsMessage();
        this.tableRegion.show(this.tableView);
        this.setDragNDrop();
        if (this.csuiDropMessage) {
          this.csuiDropMessage.remove();
          this.csuiDropMessage = undefined;
        }
        this._assignDragArea(this.dragNDrop, '.csui-innertablecontainer');
        this._assignDragArea(this.dragNDrop, '.csui-alternating-toolbars');
        $csThumbnail.hide('blind', {
          direction: 'right',
          complete: function () {
            $originatingView.show('blind',
                {
                  direction: 'left',
                  complete: function () {
                    self.tableView.triggerMethod('dom:refresh');
                  }
                },
                100);
          }
        });
        this.tableRowSelectionToolbarRegion.show(this._tableRowSelectionToolbarView);
      } else {
        var gridArrowState = this.getContainerPrefs('orderBy') || (this.persistSortOrderState ?
                                                      (this.options.orderBy || this.constants.DEFAULT_SORT) : this.collection.orderBy);
        this.setViewStateOrderBy([gridArrowState], {silent: true});
        this.tableView.destroy();
        if (gridArrowState) {
          this.res = gridArrowState.split(" ");
          if (this.res[1] === 'asc') {
            this.collection.orderstate = 'icon-sortArrowUp';
          } else if (this.res[1] === 'desc') {
            this.collection.orderstate = 'icon-sortArrowDown';
          }
          if (this.collection.sorting && this.collection.sorting.sort.length > 0 && this.collection.sorting.sort[0].value) {
            this.collection.sorting.sort[0].value = this.res[1] + '_' + this.res[0];
          }
        }
        this.setThumbnailRowSelectionToolbar({
          toolItemFactory: this.options.toolbarItems.tableHeaderToolbar,
          toolbarItemsMask: this.options.toolbarItemsMasks.toolbars.tableHeaderToolbar,
          showCondensedHeaderToggle: true,
          showSelectionCounter: this.options.showSelectionCounter
        });
        this.thumbnailRegion.show(this.thumbnail);
        this.setDragNDrop();
        if (this.csuiDropMessage) {
          this.csuiDropMessage.remove();
          this.csuiDropMessage = undefined;
        }
        this._assignDragArea(this.dragNDrop, '.csui-innertablecontainer');
        this._assignDragArea(this.dragNDrop, '.csui-alternating-toolbars');
        this.tableToolbarView.rightToolbarView &&
        this.tableToolbarView.rightToolbarView.collection.refilter();
        var isUpdated = this.thumbnail._maintainNodeState(this.collection.at(0));
        if (!isUpdated && !!this.changedModelIndex) {
          this.thumbnail._maintainNodeState(this.collection.at(this.changedModelIndex));
        }
        Marionette.triggerMethodOn(this.thumbnail, 'before:show');
        if (this.collection && this.collection.models &&
            this.collection.models.length >= 0) {
          if ($csThumbnail.length === 0) {
            $csThumbnail = $($(this.thumbnailRegion.el)[0]);
            Marionette.triggerMethodOn(this.thumbnail, 'before:show');
            $csThumbnail.append(this.thumbnail.el);
            $originatingView.hide('blind', {
              direction: 'left',
              complete: function () {
                $csThumbnail.show('blind',
                    {
                      direction: 'right',
                      complete: function () {
                        Marionette.triggerMethodOn(self.thumbnail, 'show');
                      }
                    }, 100);
              }
            }, 100);
          } else {
            $originatingView.hide('blind', {
              direction: 'left',
              complete: function () {
                $csThumbnail.show('blind',
                    {
                      direction: 'right',
                      complete: function () {
                        self.thumbnail.resultsView.triggerMethod('show');
                        if (self.thumbnail.$el.is(':visible')) {
                          self.thumbnail.trigger('dom:refresh');
                        }
                      }
                    }, 100);
              }
            }, 100);
            self.thumbnail.onAfterShow();
          }
        }
        this.tableRowSelectionToolbarRegion.show(this._thumbnailRowSelectionToolbarView);
      }
      if (this.thumbnail) {
        this.listenTo(this.thumbnail.thumbnailHeaderView, 'selectOrUnselect.all',
            _.bind(function (isSelectAll) {
              if (isSelectAll) {
                var selectedNodes  = this.thumbnail.collection.models,
                    selectedModels = [];
                _.each(selectedNodes, function (selectedNode) {
                  if (!this._allSelectedNodes.get(selectedNode) && selectedNode.get('id') !==
                                                                   undefined) {
                    selectedModels.push(selectedNode);
                  }
                }, this);
                this._allSelectedNodes.reset(selectedModels.concat(this._allSelectedNodes.models));
              } else if (isSelectAll != null && !isSelectAll) {
                var unselectedNodes = this.thumbnail.collection.models;
                _.each(unselectedNodes, function (unselectedNode) {
                  this._allSelectedNodes.remove(unselectedNode, {silent: true});
                }, this);
                this._allSelectedNodes.reset(_.clone(this._allSelectedNodes.models));
              }
            }, this));
      }
    },

    _saveThumbnailViewState: function () {
      var viewStateModel = this.context.viewStateModel;
      viewStateModel && viewStateModel.setSessionViewState('thumbnailView', this.thumbnailView);
    },

    onDestroy: function () {
      $(window).off("resize.app", this.onWinRefresh);
      if (this.dragNDrop) {
        this.dragNDrop.destroy();
      }
    },

    windowRefresh: function () {
      if (this._isRendered && this.isDisplayed) {
        this.facetView && this.facetView.triggerMethod('dom:refresh');
      }
    },

    _getCommands: function () {
      function getSignatures(toolItems) {
        var sigArray = [];
        _.mapObject(toolItems, function (val, key) {
          sigArray = _.union(sigArray, _.without(val.collection.pluck('signature'), 'disabled'));
        });
        return sigArray;
      }
      var signatures = _.union(
          ['Add', 'EditPermission'],  // special dropdown toolbar signature and Edit permission of node
          _.without(defaultActionItems.pluck('signature'), 'Disabled'),
          getSignatures.call(this, this.options.headermenuItems),
          getSignatures.call(this, this.options.toolbarItems));
      var commands = commandsCollection.clone();
      var commandsToRemove = [];
      commands.each(function (command) {
        if (signatures.indexOf(command.get('signature')) === -1) {
          commandsToRemove.push(command);
        }
      });
      commands.remove(commandsToRemove, {silent: true});

      return commands;
    },

    _refreshTableToolbar: function () {
      if (this.tableToolbarView && this.tableToolbarView.rightToolbarView) {
        this.tableToolbarView.rightToolbarView.collection.refilter();
      }
    },

    onRender: function () {
      if (this.facetBarView) {
        this.facetBarRegion.show(this.facetBarView);
      }
      this.tableToolbarRegion.show(this.tableToolbarView);

      if (this.tableRowSelectionToolbarRegion) {
        if (!this.thumbnailView && this._tableRowSelectionToolbarView) {
          this.tableRowSelectionToolbarRegion.show(this._tableRowSelectionToolbarView);
        } else if (this._thumbnailRowSelectionToolbarView) {
          this.tableRowSelectionToolbarRegion.show(this._thumbnailRowSelectionToolbarView);
        }
        this.tableRowSelectionToolbarRegion.$el.find('ul').attr('aria-label',
            controlLang.selectedItemActionBarAria);
      }

      if (this.showFacetPanelOnLoad) {
        this._showFacetPanelView();
      }
      var viewStateModel = this.context.viewStateModel;
      if (this.thumbnailViewState ||  (viewStateModel &&
        viewStateModel.getSessionViewState('thumbnailView'))) {
        this.enableThumbnailView();
      } else {
        this.tableRegion.show(this.tableView);
        this._assignDragArea(this.dragNDrop, '.csui-innertablecontainer');
        this._assignDragArea(this.dragNDrop, '.csui-alternating-toolbars');
      }
      this.paginationRegion.show(this.paginationView);

      this.listenTo(this, 'csui.description.toggled', function (args) {
        this.tableView.showDetailRowDescriptions(args.showDescriptions);
        this.tableView.trigger('update:scrollbar');
      });
      this.addFilterCommandAria();
    },

    _restoreSelectedNodesFromSessionViewSate: function () {
      var self = this;

      function resetSelection(nodeModels) {
        if (self.el.querySelector('.binf-table')) {
          self._allSelectedNodes.reset(nodeModels);
        } else {
          setTimeout(resetSelection.bind(self, nodeModels), 50);
        }
      }

      var viewStateModel = this.context && this.context.viewStateModel;
      if (viewStateModel && viewStateModel.get('enabled')) {
        var ids = viewStateModel.getSessionViewState('selected_nodes');
        if (ids && ids.length > 0) {
          this._getNodesFromCollection(this.collection, ids).done(function (nodeModels) {
            var sessionState = viewStateModel.get('session_state');
            if (nodeModels && sessionState && nodeModels[0].get('parent_id') === sessionState.id) {
              resetSelection(nodeModels);
            }
          });
        }
      }
    },

    _resetSortOrderBy: function () {
      var container = this.options.container || this.context.getModel(NodeModelFactory);
      if (!this.container || container.get('id') === this.container.get('id')) {
        this.options.orderBy = this.getContainerPrefs('orderBy');
        if (this.options.orderBy && this.options.orderBy.length) {
          this.collection.orderBy = this.options.orderBy;
          var sortValue = this.options.orderBy.split(" ");
          if (this.collection.sorting) {
            this.collection.sorting.sort[0].value = sortValue[1] + "_" + sortValue[0];
          }
        } else {
          if (this.getViewStateOrderBy() &&
              this.getDefaultViewStateOrderBy() !== this.getViewStateOrderBy()) {
            return;
          }
          this.collection.resetOrder(false);
        }
      }
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

      this._restoreSelectedNodesFromSessionViewSate();
    },

    getSelectedNodes: function () {
      return new NodeCollection(this.tableView.getSelectedChildren());
    },

    setActionBarEvents: function () {
      log.warn('The method \'setActionBarEvents\' has been deprecated and will be removed.') &&
      console.warn(log.last);
    },

    _updateToolItems: function () {
      log.warn('The method \'_updateToolItems\' has been deprecated and will be removed.') &&
      console.warn(log.last);
    },

    setDragNDrop: function (row) {
      var rowNode            = row && row.node,
          isSupportedRowView = isSupportedRowNode(rowNode),
          context            = this.options.context,
          currentHoverView   = isSupportedRowView ? row.target : this,
          target             = isSupportedRowView ? rowNode : this.container,
          highlightedTarget  = isSupportedRowView ? currentHoverView : '.csui-innertablecontainer';

      currentHoverView.dragNDrop = new DragAndDrop({
        container: target,
        collection: this.collection,
        addableTypes: this.addableTypes,
        context: context,
        highlightedTarget: highlightedTarget,
        originatingView: this,
        isSupportedRowView: isSupportedRowView

      });

      this.listenTo(currentHoverView.dragNDrop, 'drag:over', this._addDragDropBorder);
      this.listenTo(currentHoverView.dragNDrop, 'drag:leave', this._removeDragDropBorder);
      if (this.container) {
        this.listenTo(this.container, 'change:id', this._updateZeroRecordsMessage);
        this.listenTo(this.addableTypes, 'reset', this._updateZeroRecordsMessage);
      }

      function isDragNDropSuppoertedRow(rowNode) {
        return $.inArray(rowNode.get('type'), DragndropSupportedSubtypes) !== -1;
      }

      function isSupportedRowNode(rowNode) {
        if (rowNode && rowNode.get('type') && rowNode.get('type') === 144) {
          if (base.isSafari() || base.isIE11()) {
            return false;
          }
        }
        return rowNode && rowNode.get('id') && isDragNDropSuppoertedRow(rowNode);
      }

      return currentHoverView.dragNDrop;
    },

    _updateZeroRecordsMessage: function () {
      var canAddItemsToContainer = this.canAddItems(),
          addItemsPermissions    = this.addItemsPermissions();
      this.tableView.canAddItemsToContainer = canAddItemsToContainer;
      this.tableView.addItemsPermissions = addItemsPermissions;

      this.tableView.setCustomLabels({
        zeroRecords: !!canAddItemsToContainer && !!addItemsPermissions && lang.dragAndDropMessage
      });
    },

    addItemsPermissions: function () {
      return this.dragNDrop && this.dragNDrop.canAdd();
    },

    canAddItems: function () {
      return (DragndropSupportedSubtypes.indexOf(this.container.get('type')) !== -1);
    },

    _assignDragArea: function (draganddropView, currentEl) {
      if (draganddropView) {
        draganddropView.setDragParentView(this, currentEl);
      }
    },

    _addDragDropBorder: function (view, options) {
      var disableMethod     = options && options.disabled ? 'addClass' : 'removeClass',
          highlightedTarget = '.csui-innertablecontainer';
      highlightedTarget = options && options.highlightedTarget ? options.highlightedTarget :
                          highlightedTarget;
      $(highlightedTarget).addClass('drag-over')[disableMethod]('csui-disabled');
    },

    _removeDragDropBorder: function (options) {
      var highlightedTarget = '.csui-innertablecontainer';
      options && options.highlightedTarget && options.valid ?
      $(options.highlightedTarget).removeClass('drag-over') :
      $(highlightedTarget).removeClass('drag-over');
    },

    setTableView: function (options) {
      options || (options = {});
      this.collection.orderBy = this.getContainerPrefs('orderBy') || (this.persistSortOrderState ?
                                                    (this.options.orderBy || this.constants.DEFAULT_SORT) : this.collection.orderBy);
      this.collection.orderBy &&
      this.setViewStateOrderBy([this.collection.orderBy], {default: true});
      var args = _.extend({
        context: this.options.context,
        connector: this.connector,
        collection: this.collection,
        columns: this.columns,
        tableColumns: this.tableColumns,
        descriptionRowView: DescriptionRowView,
        descriptionRowViewOptions: {
          firstColumnIndex: 2,
          lastColumnIndex: 2,
          showDescriptions: !accessibleTable && this.options.showDescriptions,
          collapsedHeightIsOneLine: true,
          displayInEntireRow: true
        },
        enforceDescriptionColumnInAccessibleMode: this.enforceDescriptionColumnInAccessibleMode,
        pageSize: this.options.data.pageSize || this.options.pageSize,
        originatingView: this,
        columnsWithSearch: ["name"],
        orderBy: this.collection.orderBy,
        filterBy: this.options.filterBy,
        actionItems: this.defaultActionController.actionItems,
        commands: this.defaultActionController.commands,
        blockingParentView: this.options.blockingParentView || this,
        parentView: this,
        showSelectionCounter: this.options.showSelectionCounter,
        inlineBar: {
          viewClass: TableActionBarView,
          options: _.extend({
            collection: this.options.toolbarItems.inlineActionbar,
            toolItemsMask: this.options.toolbarItemsMasks.toolbars.inlineActionbar,
            delayedActions: this.collection.delayedActions,
            container: this.container,
            containerCollection: this.collection
          }, this.options.toolbarItems.inlineActionbar.options, {
            inlineBarStyle: this.options.inlineActionBarStyle,
            forceInlineBarOnClick: this.options.forceInlineActionBarOnClick,
            showInlineBarOnHover: this.options.showInlineActionBarOnHover
          })
        },
        allSelectedNodes: this._allSelectedNodes,
        enableViewState: this.enableViewState
      }, options);
      this.tableView = new TableView(args);

      this._ensureRequestingMetadata();
      this.listenTo(this.tableView, 'render', function () {
        this.tableView.$el.append($('<div>')[0]);
      });
      this.enableDragNDrop = !!options.enableDragNDrop;
      this.listenTo(this.tableView.collection, 'sync', _.bind(function () {
        if (this.showFilter !== undefined) {
          this.addFilterCommandAria();
        }
        this._allSelectedNodes && this.getSelectedNodes().each(_.bind(function (model) {
          var targetModel = this._allSelectedNodes.get(model),
              index       = this._allSelectedNodes.findIndex(targetModel);
          if (index !== -1 && this._allSelectedNodes.at(index) !== model) {
            this._allSelectedNodes.remove(this._allSelectedNodes.at(index));
            this._allSelectedNodes.add(model, {at: index});
          }
          if (this.tableToolbarView && this.tableToolbarView.filterToolbarView &&
              this.tableToolbarView.filterToolbarView.collection) {
            this.tableToolbarView.filterToolbarView.collection.status.thumbnailViewState = this.thumbnailView;
          }

          this._saveSelectedNodesInSessionViewState();

        }, this));
      }, this));
      this._setTableViewEvents();
    },
    _ensureRequestingMetadata: function () {
      var container = this.container;
      if (container && container.makeFieldsV2) {
        ensureColumnInformation();
        this.listenTo(this.tableView, 'columnDefinitionsBuilt',
            ensureColumnInformation);
      }

      function ensureColumnInformation() {
        container.setFields('columns');
        container.includeResources('metadata');
      }
    },

    _setTableViewEvents: function () {
      this.listenTo(this.tableView, 'tableRowSelected', function (args) {
        this.tableView.cancelAnyExistingInlineForm.call(this.tableView);
        if (this.options.showSelectionCounter && this._allSelectedNodes) {
          var selectedNodes  = args.nodes,
              selectedModels = this._allSelectedNodes.models.slice(0);
          _.each(selectedNodes, function (selectedNode) {
            if (!this._allSelectedNodes.get(selectedNode) && selectedNode.get('id') !== undefined) {
              selectedModels.push(selectedNode);
            }
          }, this);
          this._allSelectedNodes.reset(selectedModels);
        }
      });

      this.listenTo(this.tableView, 'tableRowUnselected', function (args) {
        if (this.options.showSelectionCounter && this._allSelectedNodes) {
          var unselectedNodes = args.nodes;
          _.each(unselectedNodes, function (unselectedNode) {
            this._allSelectedNodes.remove(unselectedNode, {silent: true});
          }, this);
          this._allSelectedNodes.reset(_.clone(this._allSelectedNodes.models));
        }
      });
      this.listenTo(this._allSelectedNodes, 'reset update', function () {
        if (this.tableToolbarView) {
          this.tableToolbarView.filterToolbarView.collection.status.thumbnailViewState = this.tableView.thumbnailView;
          !this._tableRowSelectionToolbarView.isDestroyed &&
          this.tableRowSelectionToolbarRegion.show(this._tableRowSelectionToolbarView);
          this._onSelectionUpdateCssClasses(this._allSelectedNodes.length);
        }

        this._saveSelectedNodesInSessionViewState();
      });

      this.listenTo(this.tableView, 'execute:defaultAction', function (node) {
        var args = {node: node};
        this.trigger('before:defaultAction', args);
        if (!args.cancel) {
          var self = this;
          this.context.viewStateModel.set('browsing', true);
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
      if (this.enableDragNDrop) {
        this.listenTo(this.tableView, 'tableRowRendered', function (row) {
          var rowdragNDrop = this.setDragNDrop(row);
          this._assignDragArea(rowdragNDrop, $(row.target));
          this._assignDragArea(rowdragNDrop, row.expandedRows);
        });
      }

      return true;
    },

    _changingContainer: function () {
      var status = {container: this.container};
      var isFilterEnabled = this.commands.get('Filter').enabled(status);
      if (isFilterEnabled && this.facetFilters) {
        if (this.options.clearFilterOnChange) {
          this.facetFilters.clearFilter();
          this.triggerMethod('remove:filter');
        }
        this.facetFilters.invalidateFetch();
        if (this.showFilter) {
          this.facetFilters.ensureFetched();
        }
      }

      this._showOrHideLocationColumn(false);

      if (this.options.fixedFilterOnChange) {
        this.collection.clearFilter(false);
        this.collection.setFilter(this.options.fixedFilterOnChange, false);
      } else if (this.options.clearFilterOnChange) {
        this.collection.clearFilter(false);
      }
      if (this.options.resetOrderOnChange) {
        this.collection.resetOrder(false);
      }
      if (this.options.resetLimitOnChange) {
        this.collection.resetLimit(false);
      }
    },

    _saveSelectedNodesInSessionViewState: function () {
      var viewStateModel = this.context && this.context.viewStateModel;
      viewStateModel &&
      viewStateModel.setSessionViewState('selected_nodes',
          this._allSelectedNodes.models.map(function (model) {
            return model.get('id');
          }));
    },

    _getNodesFromCollection: function (collection, ids) {
      var deferred      = $.Deferred(),
          nodesNotFound = [];

      var nodes = ids.map(function (id) {
        var node = collection.find({id: id});
        if (!node) {
          node = new collection.model({id: id}, {connector: this.options.connector});
          nodesNotFound.push(node);
        }
        return node;
      }.bind(this));

      if (nodesNotFound.length === 0) {
        return deferred.resolve(nodes);
      } else {
        this.blockActions();
        this._fetchNodes(nodesNotFound, collection).done(function () {
          deferred.resolve(nodes);
          this.unblockActions();
        }.bind(this));
      }

      return deferred.promise();
    },

    _fetchNodes: function (nodes, collection) {
      var deferred  = $.Deferred(),
          deferreds = [];
      nodes.forEach(function (node) {
        deferreds.push(node.fetch({collection: collection}));
      });

      $.whenAll.apply($, deferreds).always(function () {
        deferred.resolve();
      });

      return deferred.promise();
    },

    _setToolBar: function () {
      this.tableToolbarView = new TableToolbarView({
        context: this.options.context,
        toolbarItems: this.options.toolbarItems,
        toolbarItemsMasks: this.options.toolbarItemsMasks,
        headermenuItems: this.options.headermenuItems,
        headermenuItemsMask: this.options.headermenuItemsMask,
        creationToolItemsMask: this.options.creationToolItemsMask,
        container: this.container,
        collection: this.collection,
        originatingView: this,
        blockingParentView: this.options.blockingParentView || this,
        addableTypes: this.addableTypes,
        toolbarCommandController: this.commandController
      });
      return true;
    },

    setTableRowSelectionToolbar: function (options) {
      this._tableRowSelectionToolbarView = new TableRowSelectionToolbarView({
        toolItemFactory: options.toolItemFactory,
        toolbarItemsMask: options.toolbarItemsMask,
        toolbarCommandController: this.commandController,
        showCondensedHeaderToggle: options.showCondensedHeaderToggle,
        showSelectionCounter: options.showSelectionCounter,
        commands: this.defaultActionController.commands,
        selectedChildren: this._allSelectedNodes,
        container: this.collection.node,
        context: this.context,
        originatingView: this,
        collection: this.collection,
        scrollableParent: '.csui-table-tableview .csui-nodetable'
      });
      var toolbarView = this._tableRowSelectionToolbarView;
      this.listenTo(toolbarView, 'toggle:condensed:header', function () {
        if (this.tableToolbarRegion.$el.hasClass('csui-table-rowselection-toolbar-visible')) {
          this.ui.toolbarContainer && this.ui.toolbarContainer.toggleClass('csui-show-header');

          var showingBothToolbars = this.ui.toolbarContainer &&
                                    this.ui.toolbarContainer.hasClass('csui-show-header');
          if (showingBothToolbars) {
            this.tableToolbarRegion.$el.removeClass('binf-hidden');
            this.tableToolbarRegion.currentView.trigger(this.tableToolbarRegion.currentView,
                'dom:refresh');
          }
          toolbarView.trigger('toolbar:activity', true, showingBothToolbars);
        }
      });
    },

    _triggerToolbarActivityEvent: function (toolbarVisible, headerVisible) {
      var toolbarView = this.thumbnailView ?
                        this._thumbnailRowSelectionToolbarView : this._tableRowSelectionToolbarView;
      toolbarView.trigger('toolbar:activity', toolbarVisible, headerVisible);
    },

    _onSelectionUpdateCssClasses: function (selectionLength, stopTriggerToolbarActivity) {
      var self = this;
      var $rowSelectionToolbarEl = this.tableRowSelectionToolbarRegion.$el;

      function transitionEnd(headerVisible, stopTriggerToolbarActivity) {
        if (stopTriggerToolbarActivity !== true) {
          self._triggerToolbarActivityEvent(self._tableRowSelectionToolbarVisible, headerVisible);
        }
        if (self._tableRowSelectionToolbarVisible) {
          if (!headerVisible) {
            self.tableToolbarRegion.$el.addClass('binf-hidden');
          }
        } else {
          self.tableRowSelectionToolbarRegion.$el.addClass('binf-hidden');
        }
      }

      var headerVisible;
      if (accessibleTable) {
        if (selectionLength > 0) {
          if (!this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = true;
            this.tableToolbarRegion.$el.addClass('csui-table-rowselection-toolbar-visible');
            $rowSelectionToolbarEl.removeClass('binf-hidden');
            $rowSelectionToolbarEl.addClass('csui-table-rowselection-toolbar-visible');
            headerVisible = this.ui.toolbarContainer &&
                            this.ui.toolbarContainer.hasClass('csui-show-header');

            transitionEnd(headerVisible);
          }
        } else {
          if (this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = false;
            this.ui.toolbarContainer && this.ui.toolbarContainer.removeClass('csui-show-header');
            this.tableToolbarRegion.$el.removeClass('binf-hidden');
            this.tableToolbarRegion.currentView.trigger(this.tableToolbarRegion.currentView,
                'dom:refresh');
            this.tableToolbarRegion.$el.removeClass('csui-table-rowselection-toolbar-visible');
            $rowSelectionToolbarEl.removeClass('csui-table-rowselection-toolbar-visible');

            transitionEnd(false, stopTriggerToolbarActivity);
          }
        }
      } else {
        if (selectionLength > 0) {
          if (!this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = true;

            headerVisible = this.ui.toolbarContainer &&
                            this.ui.toolbarContainer.hasClass('csui-show-header');
            $rowSelectionToolbarEl
                .removeClass('binf-hidden').redraw()
                .one('transitionend', function () {
                  transitionEnd(headerVisible);
                }.bind(this))
                .addClass('csui-table-rowselection-toolbar-visible');
            this.tableToolbarRegion.$el.addClass('csui-table-rowselection-toolbar-visible');
          }
        } else {
          if (this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = false;
            this.ui.toolbarContainer && this.ui.toolbarContainer.removeClass('csui-show-header');

            this.tableToolbarRegion.$el.removeClass('binf-hidden').redraw();
            this.tableToolbarRegion.currentView.trigger(this.tableToolbarRegion.currentView,
                'dom:refresh');

            $rowSelectionToolbarEl
                .one('transitionend', function () {
                  transitionEnd(false, stopTriggerToolbarActivity);
                }.bind(this))
                .removeClass('csui-table-rowselection-toolbar-visible');
            this.tableToolbarRegion.$el.removeClass('csui-table-rowselection-toolbar-visible');
          }
        }
      }
    },

    _setTableRowSelectionToolbarEventListeners: function () {
      this.listenTo(this._allSelectedNodes, 'reset update', function () {
        this.tableToolbarView.filterToolbarView.collection.status.thumbnailViewState = this.thumbnailView;
        !this._tableRowSelectionToolbarView.isDestroyed &&
        this.tableRowSelectionToolbarRegion.show(this._tableRowSelectionToolbarView);
        this._onSelectionUpdateCssClasses(this._allSelectedNodes.length);
      });

    },
    _setCommonRowSelectionToolbarEventListeners: function (selectedChildren) {
      this.listenTo(selectedChildren, 'reset', function () {
        this.tableToolbarView.filterToolbarView.collection.status.thumbnailViewState = this.thumbnailView;
        this.tableRowSelectionToolbarRegion.show(this._tableRowSelectionToolbarView);
        this._onSelectionUpdateCssClasses(selectedChildren.length);
      });

    },

    _setThumbnailRowSelectionToolbarEventListeners: function () {
      this.listenTo(this._allSelectedNodes, 'reset', function () {
        this.tableToolbarView.filterToolbarView.collection.status.thumbnailViewState = this.thumbnailView;
        !this._thumbnailRowSelectionToolbarView.isDestroyed &&
        this.tableRowSelectionToolbarRegion.show(this._thumbnailRowSelectionToolbarView);
        this._onSelectionUpdateCssClasses(this._allSelectedNodes.length);
      });
    },

    setPagination: function () {
      this.paginationView = new PaginationView({
        collection: this.collection,
        pageSize: this.options.data.pageSize || this.options.pageSize,
        pageNumber: this.options.data.pageNumber || this.options.pageNumber,
        defaultDDList: this.options.ddItemsList
      });
      this.listenTo(this.collection, 'add', function () {
        if (this.collection.length > 0 && this.collection.length > this.collection.topCount) {
          var first = this.collection.first();
          if (first.isLocallyCreated) {
            this.collection.isPoped = true;
            this.collection.pop();
          }
        }
      });
      return true;
    },

    _handleFacetBarVisible: function () {
      this.facetBarView.$el.find(".csui-facet-list-bar .csui-facet-item:last a").trigger('focus');
    },

    _handleFacetBarHidden: function () {
    },

    _showOrHideLocationColumn: function (show) {
      var subType = this.container && this.container.get('type');
      show = !!show || (!!subType && (subType === 899 || subType === 298));

      var expand = {properties: ['parent_id']};
      if (!this.useV2RestApi) {
        expand = v1tov2.expandsV2toV1(expand);
      }

      if (show) {
        if (!this.tableColumns.get('parent_id')) {
          this.tableColumns.add([
            {
              key: 'parent_id',
              title: lang.columnTitleLocation,
              sequence: 800,
              permanentColumn: false
            }
          ]);
          this.collection.setExpand(expand);
        }
      } else {
        this.tableColumns.remove('parent_id');
        this.collection.resetExpand(expand);
      }
    },

    _ensureFacetPanelViewDisplayed: function () {
      if (this.facetView === undefined) {
        this._setFacetPanelView();
        this.facetRegion.show(this.facetView);
      }
    },

    _setFacetPanelView: function () {
      this.facetView = new FacetPanelView({
        collection: this.facetFilters,
        blockingParentView: this.options.blockingParentView || this,
        blockingLocal: true,
        originatingView: this
      });
      this.listenTo(this.facetView, 'remove:filter', this._removeFacetFilter)
          .listenTo(this.facetView, 'remove:all', this._removeAll)
          .listenTo(this.facetView, 'apply:filter', this._checkSelectionAndApplyFilter)
          .listenTo(this.facetView, 'apply:all', this._setFacetFilter);
    },

    _removeFacetPanelView: function () {
      !!this.thumbnailViewState ? this.thumbnail._adjustThumbnailWidth() : '';
      this.facetRegion.empty();
      this.facetView = undefined;
    },

    _setFacetBarView: function () {
      this.facetBarView = new FacetBarView({
        collection: this.facetFilters,
        context: this.options.context,
        showSaveFilter: true
      });
      this.listenTo(this.facetBarView, 'remove:filter', this._removeFacetFilter)
          .listenTo(this.facetBarView, 'remove:all', this._removeAll)
          .listenTo(this.facetBarView, 'facet:bar:visible', this._handleFacetBarVisible)
          .listenTo(this.facetBarView, 'facet:bar:hidden', this._handleFacetBarHidden);
    },

    _checkSelectionAndApplyFilter: function (filter) {
      if (this._allSelectedNodes.length) {
        ModalAlert.confirmQuestion(
            _.str.sformat(lang.dialogTemplate, lang.dialogTitle), lang.dialogTitle, {})
            .done(_.bind(function () {
              this._allSelectedNodes.reset([]);
              this._addToFacetFilter(filter);
            }, this));
      }
      else {
        this._addToFacetFilter(filter);
      }
    },

    _addToFacetFilter: function (filter) {
      this.facetFilters.addFilter(filter);
      var facetValues = this.facetFilters.getFilterQueryValue();
      this._showOrHideLocationColumn(true);
      this.collection.resetLimit(false);
      this.collection.setFilter({facet: facetValues});
    },

    _setFacetFilter: function (filter) {
      this.facetFilters.setFilter(filter);
      var facetValues = this.facetFilters.getFilterQueryValue();
      this._showOrHideLocationColumn(true);
      this.collection.resetLimit(false);
      this.collection.setFilter({facet: facetValues});
    },

    _removeFacetFilter: function (filter) {
      this.facetFilters.removeFilter(filter);
      var facetValues     = this.facetFilters.getFilterQueryValue(),
          accountForFacet = facetValues.length === 0 ? false : true;
      this.collection.resetLimit(false);
      this.collection.setFilter({facet: facetValues});
      this._showOrHideLocationColumn(accountForFacet);
    },

    _removeAll: function () {
      this.facetFilters.clearFilter();
      this.collection.resetLimit(false);
      this.collection.setFilter({facet: []});
      this._showOrHideLocationColumn(false);
    },

    _beforeExecuteCommand: function (toolbarActionContext) {
      !!this._allSelectedNodes && this._allSelectedNodes.each(function (model) {
        model.collection = toolbarActionContext.status.collection;
      });
      if (toolbarActionContext && toolbarActionContext.commandSignature !== "Thumbnail" &&
          !this.thumbnailViewState) {
        this.tableView.cancelAnyExistingInlineForm.call(this.tableView);
      } else if (toolbarActionContext && toolbarActionContext.commandSignature !== "Thumbnail" &&
                 this.thumbnailViewState) {
        this.thumbnail.cancelAnyExistingInlineForm.call(this.thumbnail);
      }
      if (toolbarActionContext.commandSignature === 'Delete' ||
          toolbarActionContext.commandSignature === 'RemoveCollectedItems' ||
          toolbarActionContext.commandSignature === 'Move') {
        this.deletingNodes = true;
        this.tableView.setDeletingNodesState(true);
      }
    },
    _toolbarActionTriggered: function (args) {
      switch (args.commandSignature) {
      case 'Filter':
        this._completeFilterCommand();
        args.toolItem.set('stateIsOn', this.showFilter);
        break;
      }
    },
    _afterExecuteCommand: function (toolbarActionContext) {
      if (!toolbarActionContext || toolbarActionContext.cancelled) {
        return;
      }
      if (toolbarActionContext.status.forwardToTable) {
        var inlineFormView = inlineFormViewFactory.getInlineFormView(
            toolbarActionContext.addableType);
        if (inlineFormView) {
          if (!toolbarActionContext.newNodes[0].error) {
            if (!this.thumbnailView) {
              this.tableView.startCreateNewModel(toolbarActionContext.newNodes[0], inlineFormView);
            } else {
              this.thumbnail.startCreateNewModel(toolbarActionContext.newNodes[0], inlineFormView);
            }
          }
        }
      }
      if (!!toolbarActionContext.command && !!toolbarActionContext.command.allowCollectionRefetch
          && toolbarActionContext.commandSignature !== 'Delete') {
        this.collection.fetch();
      }

      switch (toolbarActionContext.commandSignature) {
      case 'Move':
      case 'RemoveCollectedItems':
      case 'Delete':
        var collectionData = this.collection;
        this.deletingNodes = false;
        this.tableView.setDeletingNodesState(false);
        if (collectionData.skipCount !== 0 && collectionData.totalCount ===
            collectionData.skipCount) {
          this.collection.setLimit(collectionData.skipCount - collectionData.topCount,
              this.collection.topCount, false);
        }
        this.collection.fetch();
        this._allSelectedNodes && this._allSelectedNodes.reset([]);
        break;
      case 'MaximizeWidgetView':
        this.tableToolbarView.rightToolbarView.collection.refilter();
        break;
      case 'RestoreWidgetViewSize':
        this.tableToolbarView.rightToolbarView.collection.refilter();
        break;
      case 'Thumbnail':
        this.thumbnailViewState = !this.thumbnailViewState;
        this.setContainerPrefs({isThumbnailEnabled: this.thumbnailViewState});
        this.enableThumbnailView();
        break;
      case 'ToggleDescription':
        this.setContainerPrefs(
            {'isDescriptionShown': !this.getContainerPrefs('isDescriptionShown')});
        break;
      }
    },

    _transitionEnd: _.once(
        function () {
          var transitions = {
                transition: 'transitionend',
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend'
              },
              element     = document.createElement('div'),
              transition;
          for (transition in transitions) {
            if (typeof element.style[transition] !== 'undefined') {
              return transitions[transition];
            }
          }
        }
    ),

    _completeFilterCommand: function () {
      this.showFilter = !this.showFilter;
      if (this.showFilter) {
        this._showFacetPanelView();
      } else {
        this._hideFacetPanelView();
      }
    },

    _showFacetPanelView: function () {
      this.showFilter = true;
      this._ensureFacetPanelViewDisplayed();
      this.facetFilters.ensureFetched();
      this.ui.facetView.removeClass('csui-facetview-visibility');
      if (accessibleTable) {
        this.ui.facetView.removeClass('csui-facetview-hidden');
        this.triggerMethod('dom:refresh');
      } else {
        this.ui.facetView.one(this._transitionEnd(),
            function () {
              this.triggerMethod('dom:refresh');
              !!this.thumbnailViewState ? this.thumbnail._adjustThumbnailWidth() : '';
            }.bind(this)).removeClass('csui-facetview-hidden');
      }
      this.listenTo(this.facetView, 'dom:refresh', _.bind(function () {
        $(window).trigger('resize.facetview');
      }, this));
      this.addFilterCommandAria();
    },

    _hideFacetPanelView: function () {
      this.showFilter = false;
      if (accessibleTable) {
        this.ui.facetView.addClass('csui-facetview-hidden');
        this.triggerMethod('dom:refresh');
        this.ui.facetView.hasClass('csui-facetview-hidden') &&
        this.ui.facetView.addClass('csui-facetview-visibility');
        this._removeFacetPanelView();
      } else {
        this.ui.facetView.one(this._transitionEnd(),
            function () {
              this._removeFacetPanelView();
              this.triggerMethod('dom:refresh');
              this.ui.facetView.hasClass('csui-facetview-hidden') &&
              this.ui.facetView.addClass('csui-facetview-visibility');
            }.bind(this)).addClass('csui-facetview-hidden');
      }
      this.listenTo(this.facetView, 'dom:refresh', _.bind(function () {
        $(window).trigger('resize.facetview');
      }, this));
      this.addFilterCommandAria();
    },

    _collectionFilterChanged: function () {
      var collectionFilters = this.collection.filters,
          facetFilters      = collectionFilters && collectionFilters.facet;
      if (facetFilters && facetFilters.length > 0) {
        this._showFacetPanelView();
      } else if (this.showFilter) {
        this._hideFacetPanelView();
      }
    },
    _formatFacetFilter: function (filters) {
      if (filters) {
        var collectionFacetFilters = filters.facet,
            initialFacetFilter;
        if (collectionFacetFilters) {
          return collectionFacetFilters.map(function (entry) {
            var filter = entry.split(':'),
                values = filter[1].split('|');
            values = values.map(function (value) {
              return {id: value};
            });
            return {id: filter[0], values: values};
          });
        }
      }
    },
    onViewStateChanged: function () {
      var viewStateModel = this.context.viewStateModel,
          filterString   = viewStateModel.getViewState('filter', true),
          currentFacetFilters;

      if (filterString) {
        var facetFilter = this._formatFacetFilter(
            this.collection.filterStringToObject(filterString));
        if (facetFilter) {
          currentFacetFilters = this.facetFilters && this.facetFilters.filters;
          if (currentFacetFilters && !_.isEqual(currentFacetFilters, facetFilter)) {
            this.facetFilters.setFilter(facetFilter, true);
          }
        }
      }

      if (!currentFacetFilters && this.facetFilters && this.facetFilters.filters &&
          this.facetFilters.filters.length) {
        this.facetFilters.clearFilter(true);
      }
    },

    addFilterCommandAria: function () {
      if (this.tableToolbarView && this.tableToolbarView.filterToolbarView) {
        var toolItemEl = this.tableToolbarView.filterToolbarView.$el.find(".csui-toolitem");
        toolItemEl.removeAttr('aria-expanded');
        if ((this.ui.facetView instanceof Object) &&
            this.ui.facetView.hasClass('csui-facetview-hidden')) {
          toolItemEl.attr("aria-label", lang.filterExpandAria);
          toolItemEl.attr("title", lang.filterExpandTooltip);
          toolItemEl.find('span.icon').removeClass('icon-toolbarFilterCollapse');
        } else {
          toolItemEl.attr("aria-label", lang.filterCollapseAria);
          toolItemEl.attr("title", lang.filterCollapseTooltip);
          toolItemEl.find('span.icon').addClass('icon-toolbarFilterCollapse');
        }
      }
    },

    _rememberFocusInTable: function () {
      if (this.tableView.el.contains(document.activeElement)) {
        this._tableFocused = true;
      }
    },

    _restoreFocusInTable: function () {
      if (this._tableFocused) {
        this.tableView.currentlyFocusedElement() &&
        this.tableView.currentlyFocusedElement().trigger('focus');
      }
    },

    removeOrderBy: function () {
      if (this.options.resetOrderByOnBrowse) {
        if (this.getDefaultViewStateOrderBy() !== this.getViewStateOrderBy()) {
          this.setViewStateOrderBy(undefined, {silent: true});
        }
      }
    },

    _addUrlParametersSupport: function (context) {
      var viewStateModel = context && context.viewStateModel,
          urlParamsList  = this.getUrlParameters();
      if (viewStateModel.get(viewStateModel.CONSTANTS.ALLOW_WIDGET_URL_PARAMS)) {
        viewStateModel && urlParamsList && viewStateModel.addUrlParameters(urlParamsList, context);
        this.enableViewState = true;
      } else {
        this.enableViewState = false;
      }
    },

    getDefaultUrlParameters: function () {
      return this.options.urlParamsList;
    },

    getUrlParameters: function () {
      return this.getDefaultUrlParameters();
    },

    getContainerPrefs: function (prop) {
      var defaults = {
        isThumbnailEnabled: false,
        isDescriptionShown: false
      };
      if (this.namedLocalStorage) {
        var container = this.options.container || this.context.getModel(NodeModelFactory);
        var prefs = this.namedLocalStorage.get('container:' + container.get('id'));
        if (prefs) {
          if (prop) {
            return prefs[prop];
          } else {
            return prefs;
          }
        } else {
          return prop ? defaults[prop] : defaults;
        }
      } else {
        if (prop) {
          return defaults[prop];
        } else {
          return defaults;
        }
      }
    },

    setContainerPrefs: function (prefs) {
      var container = this.options.container || this.context.getModel(NodeModelFactory);
      if (this.namedLocalStorage && this.container &&
          container.get('id') === this.container.get('id')) {
        this.namedLocalStorage.set('container:' + this.container.get('id'),
            _.extend(this.getContainerPrefs(), prefs));
      }
    }

  }, {
    useV2RestApi: globalConfig.useV2RestApi
  });

  _.extend(NodesTableView.prototype, LayoutViewEventsPropagationMixin);
  _.extend(NodesTableView.prototype, NodeViewStateMixin);
  NodesTableView.prototype._eventsToPropagateToRegions.push('global.alert.inprogress',
      'global.alert.completed');

  if (NodesTableView.useV2RestApi) {
    ChildrenCollectionFactory = Children2CollectionFactory;
    ColumnCollectionFactory = Column2CollectionFactory;
  }

  return NodesTableView;
});
