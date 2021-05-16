/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'csui/lib/underscore',
  'csui/utils/base',
  'csui/lib/marionette',
  'csui/controls/list/list.view',
  'csui/controls/listitem/listitemstateful.view',
  'csui/behaviors/limiting/limiting.behavior',
  'csui/behaviors/expanding/expanding.behavior',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/list/behaviors/list.view.keyboard.behavior',
  'csui/behaviors/collection.state/collection.state.behavior',
  'csui/controls/list/list.state.view',
  'csui/utils/contexts/factories/myassignments',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/progressblocker/blocker',
  'i18n!csui/widgets/myassignments/impl/nls/lang',
  'css!csui/widgets/myassignments/impl/myassignments'
], function (module, _, base, Marionette, ListView, ExpandedListitem, LimitingBehavior,
    ExpandingBehavior, DefaultActionBehavior, TabableRegionBehavior,
    ListViewKeyboardBehavior, CollectionStateBehavior, ListStateView,
    MyAssignmentCollectionFactory, ApplicationScopeModelFactory, NodeTypeIconView, BlockingView, lang) {
  'use strict';

  var config = _.defaults({}, module.config(), {
    openInPerspective: true
  });
  var MyAssignmentsView = ListView.extend({

    constructor: function MyAssignmentsView(options) {
      options || (options = {});
      _.defaults(options, {orderBy: 'date_due asc'});
      options.data || (options.data = {});
      options.data.titleBarIcon = options.data.showTitleIcon === false ?
                                  undefined : 'title-icon title-assignments';

      var context = options.context,
          viewStateModel = context && context.viewStateModel;
      this._enableOpenPerspective = config.openInPerspective &&
                                    viewStateModel && viewStateModel.get('history');

      ListView.prototype.constructor.apply(this, arguments);
      BlockingView.imbue(this);
      this.context = context;
      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);
    },

    childEvents: {
      'click:item': 'onClickItem',
      'render': 'onRenderItem',
      'before:destroy': 'onBeforeDestroyItem'
    },

    templateHelpers: function () {
      return {
        title: this.options.data.title || lang.dialogTitle,
        icon: this.options.data.titleBarIcon,
        searchPlaceholder: lang.searchPlaceholder,
        searchTitle: lang.searchTitle,
        searchAria: lang.searchAria,
        expandAria: lang.expandAria,
        openPerspectiveAria: lang.openMyAssignmentsView,
        openPerspectiveTooltip: lang.openMyAssignmentsView,
        enableOpenPerspective: this._enableOpenPerspective
      };
    },

    childView: ExpandedListitem,

    childViewOptions: {
      templateHelpers: function () {

        var dueDate = this.model.get('date_due');
        var dateValue = new Date(dueDate);
        var currentDate = new Date();
        var infoState = dateValue < currentDate ? 'Warning' : 'Success';
        var info = base.formatFriendlyDate(dueDate);
        var description = this.model.get('description');
        var type_name = this.model.get('location_name') || this.model.get('type_name');
        type_name || (type_name = "Workflow");
        description || (description = type_name);

        return {
          name: this.model.get('short_name'),
          enableIcon: true,
          description: description,
          info: info,
          infoState: infoState,
          type: type_name
        };
      },
      checkDefaultAction: true
    },

    behaviors: {
      LimitedList: {
        behaviorClass: LimitingBehavior,
        completeCollection: function () {
          var collection = this.options.collection ||
                           this.options.context.getCollection(MyAssignmentCollectionFactory);
          collection.excludeResources();
          collection.resetFields();
          collection.setFields({assignments: []});
          collection.resetExpand();
          return collection;
        },
        limit: 0
      },
      ExpandableList: {
        behaviorClass: ExpandingBehavior,
        expandedView: 'csui/widgets/myassignmentstable/myassignmentstable.view',
        orderBy: function () { return this.options.orderBy; },
        titleBarIcon: function () { return this.options.data.titleBarIcon; },
        dialogTitle: lang.dialogTitle,
        dialogTitleIconRight: "icon-tileCollapse",
        dialogClassName: 'assignments'
      },
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      ListViewKeyboardBehavior: {
        behaviorClass: ListViewKeyboardBehavior
      },
      CollectionState: {
        behaviorClass: CollectionStateBehavior,
        collection: function () {
          return this.completeCollection;
        },
        stateView: ListStateView,
        stateMessages: {
          empty: lang.emptyListText,
          loading: lang.loadingListText,
          failed: lang.failedListText
        }
      }
    },

    onRender: function () {
      ListView.prototype.onRender.apply(this, arguments);
      this.$el.addClass('cs-assignments');
    },

    onRenderItem: function (childView) {
      childView._nodeIconView = new NodeTypeIconView({
        el: childView.$('.csui-type-icon').get(0),
        node: childView.model
      });
      childView._nodeIconView.render();

      childView.$el.attr('role', 'option');
    },

    onBeforeDestroyItem: function (childView) {
      if (childView._nodeIconView) {
        childView._nodeIconView.destroy();
      }
    },

    onClickItem: function (target) {
      this.triggerMethod('execute:defaultAction', target.model);
    },

    onClickHeader: function (target) {
      this.onClickOpenPerspective(target);
    },

    onClickOpenPerspective: function (target) {
      this.applicationScope.set('id','myassignments');
      this.trigger('open:myassignments:perspective');
    }

  });

  return MyAssignmentsView;

});
