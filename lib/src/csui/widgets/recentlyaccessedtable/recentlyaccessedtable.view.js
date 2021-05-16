/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/lib/marionette", "csui/utils/log", 'csui/utils/base',
  'csui/utils/contexts/factories/recentlyaccessedcolumns',
  'csui/utils/contexts/factories/recentlyaccessed',
  'csui/widgets/recentlyaccessed/recentlyaccessed.columns',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/widgets/nodestable/nodestable.view',
  'csui/utils/commands',
  'csui/controls/globalmessage/globalmessage',
  'csui/widgets/recentlyaccessedtable/toolbaritems',
  'csui/widgets/recentlyaccessedtable/toolbaritems.masks',
  'csui/controls/perspective.header/perspective.header.view',
  'hbs!csui/widgets/recentlyaccessedtable/recentlyaccessedtable',
  'i18n!csui/widgets/recentlyaccessedtable/impl/nls/lang',
  'csui/behaviors/table.rowselection.toolbar/table.rowselection.toolbar.behavior',
  'css!csui/widgets/recentlyaccessedtable/recentlyaccessedtable'
], function (module, $, _, Backbone, Marionette, log, base,
    RecentlyAccessedColumnsCollectionFactory, RecentlyAccessedCollectionFactory,
    RecentlyAccessedTableColumns, LayoutViewEventsPropagationMixin,
    NodesTable, commands, GlobalMessage, toolbarItems, ToolbarItemsMasks, PerspectiveHeaderView,
    template, lang, TableRowSelectionToolbarBehavior) {
  'use strict';

  var RecentlyAccessedTableView = NodesTable.extend({

    template: template,

    className: 'csui-recently-accessed-table-view',

    regions: {
      toolbarRegion: '.csui-rowselection-toolbar',
      tableRegion: '#tableviewRA',
      paginationRegion: '#paginationviewRA',
      headerRegion: '.csui-perspective-toolbar'
    },

    constructor: function RecentlyAccessedTableView(options) {
      options.showSelectionCounter = false;
      this.enableMetadataPerspective = true;
      NodesTable.prototype.constructor.apply(this, arguments);
      this.propagateEventsToRegions();
    },

    behaviors: _.extend({
      TableRowSelectionToolbar: {
        behaviorClass: TableRowSelectionToolbarBehavior
      }
    }, NodesTable.prototype.behaviors),

    initialize: function () {
      this.collection = this.options.collection;
      if (!this.collection) {
        var collectionState = this._restoreCollectionState();
        this.collection = this.context.getCollection(RecentlyAccessedCollectionFactory, {
          options: this._restoreCollectionState()
        });
        if (!!collectionState.orderBy) {
          this.options.orderBy = collectionState.orderBy;
        }
      }

      this.collection.setExpand('properties', ['parent_id', 'reserved_user_id']);

      this._allCommands = this.defaultActionController.actionItems.getAllCommandSignatures(
          commands);
      this.collection.setResourceScope(RecentlyAccessedCollectionFactory.getDefaultResourceScope());
      this.collection.setDefaultActionCommands(this._allCommands);
      this.collection.setEnabledDelayRestCommands(true);

      if (this.collection.delayedActions) {
        this.listenTo(this.collection.delayedActions, 'error',
            function (collection, request, options) {
              var error = new base.Error(request);
              GlobalMessage.showMessage('error', error.message);
            });
      }

      this.columns = this.collection.columns ||
                     this.context.getCollection(RecentlyAccessedColumnsCollectionFactory);

      _.defaults(this.options, {
        orderBy: 'access_date_last desc',
        tableColumns: RecentlyAccessedTableColumns,
        toolbarItems: toolbarItems,
        urlParamsList: []
      });

      if (!this.options.toolbarItemsMasks) {
        this.options.toolbarItemsMasks = new ToolbarItemsMasks();
      }

      if (!this.options.isExpandedView) {
        this._setPerspectiveHeaderView();
      }

      this.setTableView({
        orderBy: this.options.orderBy,
        filterBy: this.options.filterBy,
        nameEdit: false,
        haveDetailsRowExpandCollapseColumn: false,
        tableColumns: this.options.tableColumns,
        tableTexts: {
          zeroRecords: lang.emptyListText
        }
      });

      this.setPagination();

      if (this.options.collection) {
        this.collection.fetched = false;
      }
    },

    _setPerspectiveHeaderView: function () {
      this.perspectiveHeaderView = new PerspectiveHeaderView({
        title: this.getTitle(),
        icon: 'title-recentlyaccessed',
        context: this.context
      });
    },

    getTitle: function () {
      return lang.dialogTitle;
    },

    onRender: function () {
      this.perspectiveHeaderView && this.headerRegion.show(this.perspectiveHeaderView);
      this.tableRegion.show(this.tableView);
      this.paginationRegion.show(this.paginationView);
    },

     getUrlParameters: function () {
       return [];
     }
  });

  _.extend(RecentlyAccessedTableView.prototype, LayoutViewEventsPropagationMixin);

  return RecentlyAccessedTableView;
});
