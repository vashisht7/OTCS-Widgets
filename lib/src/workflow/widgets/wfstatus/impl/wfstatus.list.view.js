/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/lib/marionette", "csui/utils/log",
  'csui/controls/table/rows/description/description.view',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/widgets/nodestable/nodestable.view',
  'csui/controls/toolbar/delayed.toolbar.view',
  'csui/controls/toolbar/toolbar.view',
  'csui/controls/tableactionbar/tableactionbar.view',
  'workflow/controls/infinite.table/infinite.table.view',
  'workflow/widgets/wfstatus/wfstatus.columns',
  'workflow/models/wfstatus/wfstatus.column.factory',
  'workflow/models/wfstatus/wfstatus.collection.factory',
  'workflow/controls/stepcards/stepcards.list.view',
  'workflow/controls/usercards/usercards.list.view',
  'workflow/controls/popover/popover.view',
  'workflow/utils/workitem.util',
  'hbs!workflow/widgets/wfstatus/impl/wfstatuslist',
  'i18n!workflow/widgets/wfstatus/impl/nls/lang',
  'css!workflow/widgets/wfstatus/impl/wfstatus'
], function (module, $, _, Backbone, Marionette, log,
    DescriptionRowView, LayoutViewEventsPropagationMixin, NodesTable,
    DelayedToolbarView, ToolbarView, TableActionBarView, InfiniteScrollingTableView,
    WFStatusTableColumns, WFStatusColumnCollectionFactory, WFStatusCollectionFactory,
    StepcardsListView, UsercardsListView, PopoverView, WorkItemUtil, template, lang) {
  'use strict';

  var WFStatusTableView = NodesTable.extend({

    template: template,

    className: '',

    regions: {
      tableRegion: '#tableview',
      footerRegion: '#footerview'
    },
    events: {
      'click #footerview': 'fetchMoreItems',
      'click #tableview': 'performStatusItemAction'
    },

    constructor: function WFStatusTableView(options) {
      options.separateDescription = false;
      NodesTable.prototype.constructor.apply(this, arguments);
      this.propagateEventsToRegions();
    },

    initialize: function () {
      this.collection = this.options.collection ||
                        this.context.getCollection(WFStatusCollectionFactory);
      this.columns = this.collection.columns ||
                     this.context.getCollection(WFStatusColumnCollectionFactory);

      _.defaults(this.options, {
        orderBy: 'status_key desc',
        tableColumns: WFStatusTableColumns
      });

      this.setTableView();

      if (this.options.collection) {
        this.collection.fetched = false;
      }
      this.collection.page = 1;
    },

    fetchMoreItems: function () {
      this.collection.fetched = false;
      var currentPage = this.collection.page;
      if ((this.collection.length === this.options.pageSize*currentPage)) {
        this.collection.page = currentPage + 1;
        this.onRender(this.collection.page);
      }
    },

    setTableView: function () {
      this.tableView = new InfiniteScrollingTableView({
        context: this.options.context,
        connector: this.connector,
        collection: this.collection,
        columns: this.columns,
        tableColumns: this.options.tableColumns,
        pageSize: this.options.pageSize,
        originatingView: this,
        columnsWithSearch: ["wf_name"],
        orderBy: this.options.orderBy,
        filterBy: this.options.filterBy,
        nameEdit: false,
        selectRows: 'None',
        selectColumn: false,
        favoritesTableOptions: this.favoritesTableOptions,
        actionItems: this.defaultActionController.actionItems,
        commands: this.defaultActionController.commands,
        blockingParentView: this,
        tableTexts: {
          zeroRecords: lang.emptyListText
        },
        alternativeHeader: {
          viewClass: this.collection.delayedActions ? DelayedToolbarView : ToolbarView,
          options: {
            toolbarItems: this.options.toolbarItems,
            toolbarItemsMask: this.options.toolbarItemsMasks.toolbars.tableHeaderToolbar,
            toolbarCommandController: this.commandController
          }
        },
        inlineBar: {
          viewClass: TableActionBarView,
          options: _.extend({
            collection: this.options.toolbarItems.inlineActionbar,
            toolItemsMask: this.options.toolbarItemsMasks.toolbars.inlineActionbar,
            delayedActions: this.collection.delayedActions,
            container: this.collection.node,
            containerCollection: this.collection,
            commandExecutionOptions: {nameAttribute: 'wf_name'}
          }, this.options.toolbarItems.inlineActionbar.options, {
            inlineBarStyle: this.options.inlineActionBarStyle,
            forceInlineBarOnClick: this.options.forceInlineActionBarOnClick,
            showInlineBarOnHover: this.options.showInlineActionBarOnHover
          })
        }
      });
      this.listenTo(this, 'render', function () {
        this.tableRegion.show(this.tableView);
      });
      this.listenTo(this.tableView, "clicked:cell", this.performStatusItemAction);
    },

    onDestroy: function () {
      if (this.options.collection) {
        this.collection.setResourceScope(this._originalScope);
      }
      NodesTable.prototype.onDestroy.call(this);
    },

    onRender: function (page) {
      if (this.options.collection && !this.collection.fetched) {
        this._originalScope = this.collection.getResourceScope();
        this.collection.setResourceScope(WFStatusCollectionFactory.getDefaultResourceScope());

        var options = {},
            data    = '',
            self    = this;

        if (this.collection.options && this.collection.options.status) {
          var delim      = '',
              statusList = this.collection.options.status;
          _.each(statusList, function (status) {
            if (status !== '') {
              data += delim + 'wstatus=' + status;
              delim = '&';
            }
          });
        }
        options.reload = true;
        options.data = data;
        if ((this.collection.options.status.length > 0 ) ||
            (this.collection.options.isFilterVisible === true)) {
          this.$el.find('.wfstatus-table').addClass('wfstatus-filter-width');
        }


        if (page > 1) {
          options.data = options.data ? (options.data + "&page=" + page) : "page=" + page;
          options.remove = false;
          options.reset = false;
          options.reload = false;
          options.retention = this.collection.options.retention;
          options.selectionType = this.collection.options.selectionType;
          options.wfstatusfilter = this.collection.options.wfstatusfilter;
          options.status = this.collection.options.status;
          var filterWorkflowtype = this.collection.options.filterWorkflowtype;
          if (!filterWorkflowtype) {
            filterWorkflowtype = WorkItemUtil.getWorkflowtype(
                this.collection.options.filterWorkflows);
          }
          options.filterWorkflowtype = filterWorkflowtype;
          this.collection.fetchdata(_.extend({remove: false}, options)).then(function(){
            var currentPage=self.collection.page;
            if(self.collection.length === self.options.pageSize*(currentPage-1)){
              self.collection.page=currentPage-1;
            }
          });
        } else {
          this.collection.fetch(options);
        }
      }

      this.tableRegion.show(this.tableView);
      this.listenTo(this.collection, "reset", this.unbindPopover);
    },

    unbindPopover: function () {
      WorkItemUtil.unbindPopover();
    },

    performStatusItemAction: function (data) {

      var isContainer = !!(data && data.target && data.target.tagName.toLowerCase() === "tbody"),
          dataModel = data.model,
          perm, hasReassignAction,
          winEvent = window.event,
          isAssignee = false,
          isCurrentStep = false,
          sourceElement;

       if (dataModel && winEvent && winEvent.target) {
         sourceElement = $(winEvent.target).closest('td').find(".wfstatus-assignee-name");

         if (sourceElement && sourceElement.length > 0) {
           isAssignee = true;
        } else {
           sourceElement = $(winEvent.target).closest('td').find(".wfstatus-currentstep");
           if (sourceElement && sourceElement.length > 0) {
             isCurrentStep = true;
          }
        }
      }

      if (isContainer) {
        this.unbindPopover();
        return;
      }

      if (dataModel) {
        perm = dataModel.get('data').permissions;
        hasReassignAction = perm && perm.ChangeAttr;
        dataModel.set('hasReassignAction', hasReassignAction, {silent: true});
      }

      if ((isCurrentStep && dataModel.get('parallel_steps').length > 1) ||
          (isAssignee && dataModel.get("assignee").length !== 0)) {
        if (isAssignee && (dataModel.get("assignee") === lang.systemUserText)) {
          this.unbindPopover();
        } else {

          var cellViewEle = $(sourceElement).closest('td'),
            context = data.cellView.options.context,
            options = {
              model: dataModel,
              context: context,
              originatingView: data.cellView,
              wfData: _.pick(data.model.attributes, 'process_id', 'subprocess_id', 'task_id',
                'userId', 'comments_on')
            };
          if (isCurrentStep && dataModel.get('parallel_steps').length > 1) {

            options.listViewMulCurrentSteps = true;
            options.cellView = data.cellView;
            options.popoverCardsListView = new StepcardsListView(options);
          } else if (isAssignee && dataModel.get("assignee").length !== 0) {
            options.wfData.updateCurrentStepAssignee = true;

            options.popoverCardsListView = new UsercardsListView(options);

          }
          var popoverOptions = {
            delegateTarget: cellViewEle,
            cardViewOptions: options
          };

          PopoverView.ShowPopOver(popoverOptions);
          if (!$(cellViewEle).hasClass("csui-acc-focusable-active")) {
            $(cellViewEle).addClass('csui-acc-focusable-active');
            $(cellViewEle).attr("tabindex", 0);
            $(cellViewEle).trigger('focus');
          }
        }

      } else if (data.model && data.cellView) {
        var dialogOptions = {
          model: data.model,
          cellView: data.cellView,
          context: data.cellView.options.context
        };
        WorkItemUtil.displayWfstatusItemProgresspanel(dialogOptions);
      }
    }

  });

  _.extend(WFStatusTableView.prototype, LayoutViewEventsPropagationMixin);

  return WFStatusTableView;

});
