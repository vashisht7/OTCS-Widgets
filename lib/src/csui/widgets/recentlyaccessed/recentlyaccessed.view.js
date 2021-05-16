/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/controls/list/list.view',
  'csui/controls/listitem/listitemstandard.view',
  'csui/behaviors/limiting/limiting.behavior',
  'csui/behaviors/expanding/expanding.behavior',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/list/behaviors/list.view.keyboard.behavior',
  'csui/behaviors/collection.state/collection.state.behavior',
  'csui/controls/list/list.state.view',
  'csui/utils/contexts/factories/recentlyaccessed',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/progressblocker/blocker',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/commands',
  'csui/widgets/recentlyaccessed/tileview.toolbaritems',
  'csui/controls/globalmessage/globalmessage',
  'csui/utils/base',
  'i18n!csui/widgets/recentlyaccessed/impl/nls/lang',
  'i18n!csui/controls/listitem/impl/nls/lang',
  'css!csui/widgets/recentlyaccessed/impl/recentlyaccessed'
], function (module, _, Marionette, ListView, ListItemStandard,
    LimitingBehavior, ExpandingBehavior, DefaultActionBehavior, TabableRegionBehavior,
    ListViewKeyboardBehavior, CollectionStateBehavior, ListStateView,
    RecentlyAccessedCollectionFactory, NodeTypeIconView, BlockingView, ApplicationScopeModelFactory,
    commands, tileViewToolbarItems, GlobalMessage, base, lang, listItemLang) {
  'use strict';

  var config = _.defaults({}, module.config(), {
    openInPerspective: true
  });
  var RecentlyAccessedView = ListView.extend({

    constructor: function RecentlyAccessedView(options) {
      options || (options = {});
      _.defaults(options, {orderBy: 'access_date_last desc'});
      options.data || (options.data = {});
      options.data.titleBarIcon = options.data.showTitleIcon === false ?
                                  undefined : 'title-icon title-recentlyaccessed';

      options.tileViewToolbarItems = tileViewToolbarItems;
      this.context = options.context;
      this.showInlineActionBar = options.showInlineActionBar === false ?
                                 options.showInlineActionBar : true;

      var context        = options.context,
          viewStateModel = context && context.viewStateModel;
      this._enableOpenPerspective = config.openInPerspective &&
                                    viewStateModel && viewStateModel.get('history');

      ListView.prototype.constructor.call(this, options);
      BlockingView.imbue(this);
      this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);
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
        openPerspectiveAria: lang.openRecentlyAccessedView,
        openPerspectiveTooltip: lang.openRecentlyAccessedView,
        enableOpenPerspective: this._enableOpenPerspective
      };
    },

    childView: ListItemStandard,

    childViewOptions: function () {
      var toolbarData = this.showInlineActionBar ? {
        toolbaritems: this.options.tileViewToolbarItems,
        collection: this.completeCollection
      } : undefined;

      return {
        templateHelpers: function () {
          return {
            name: this.model.get('short_name'),
            enableIcon: true,
            showInlineActionBar: this.showInlineActionBar,
            itemLabel: _.str.sformat(listItemLang.itemTitleLabel, this.model.get('short_name'))
          };
        },
        context: this.context,
        checkDefaultAction: true,
        toolbarData: toolbarData
      };
    },

    behaviors: {
      LimitedList: {
        behaviorClass: LimitingBehavior,
        completeCollection: function () {
          var nonPromotedActionCommands = commands.getSignatures(tileViewToolbarItems);
          var collection = this.options.collection ||
                           this.options.context.getCollection(RecentlyAccessedCollectionFactory, {
                             options: {
                               promotedActionCommands: [],
                               nonPromotedActionCommands: nonPromotedActionCommands
                             }
                           });
          var limitedRS = RecentlyAccessedCollectionFactory.getLimitedResourceScope();
          collection.setResourceScope(limitedRS);
          collection.setEnabledDelayRestCommands(false);
          collection.setEnabledLazyActionCommands(false);
          return collection;
        },
        limit: 0
      },
      ExpandableList: {
        behaviorClass: ExpandingBehavior,
        expandedView: 'csui/widgets/recentlyaccessedtable/recentlyaccessedtable.view',
        orderBy: function () { return this.options.orderBy; },
        titleBarIcon: function () { return this.options.data.titleBarIcon; },
        dialogTitle: lang.dialogTitle,
        dialogTitleIconRight: "icon-tileCollapse",
        dialogClassName: 'recentlyaccessed'
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
      this.$el.addClass('cs-recentlyaccessed');

      if (this.completeCollection.delayedActions) {
        this.listenTo(this.completeCollection.delayedActions, 'error',
            function (collection, request, options) {
              var error = new base.Error(request);
              GlobalMessage.showMessage('error', error.message);
            });
      }
    },

    onRenderItem: function (childView) {
      childView._nodeIconView = new NodeTypeIconView({
        el: childView.$('.csui-type-icon').get(0),
        node: childView.model
      });
      childView._nodeIconView.render();

      childView.$el.attr('role', 'option');
      childView.$el.attr('aria-label',
          _.str.sformat(listItemLang.typeAndNameAria, childView._nodeIconView.model.get('title'),
              childView.model.get('short_name')));
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
      this.applicationScope.set('id', 'recentlyaccessed');
      this.trigger('open:recentlyaccessed:perspective');
    }

  });

  return RecentlyAccessedView;

});
