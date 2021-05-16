/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore',
  'csui/lib/marionette',
  'csui/controls/list/list.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/limiting/limiting.behavior',
  'conws/utils/behaviors/expanding.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/list/behaviors/list.view.keyboard.behavior',
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/widgets/header/impl/header.model.factory',
  'conws/widgets/team/impl/team.model.factory',
  'conws/widgets/team/impl/teamtables.view',
  'conws/widgets/team/impl/controls/teamheader/teamheader.view',
  'csui/utils/base',
  'csui/utils/nodesprites',
  'csui/utils/contexts/factories/node',
  'conws/widgets/team/impl/controls/listitem/listitemteammember.view',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/team.empty',
  'css!conws/widgets/team/impl/team'
], function (_, Marionette, ListView, PerfectScrollingBehavior, LimitingBehavior, ExpandingBehavior,
    TabableRegionBehavior, ListViewKeyboardBehavior, WorkspaceContextFactory, HeaderModelFactory,
    TeamCollectionFactory, TeamTablesView, TeamHeaderView, BaseUtils, NodeSpriteCollection,
    NodeModelFactory, ListItem, lang, TeamEmptyTemplate) {
  var TeamEmptyView = Marionette.ItemView.extend({

    constructor: function TeamEmptyView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    template: TeamEmptyTemplate
  });
  var TeamView = ListView.extend({

    className: 'conws-team ' + ListView.prototype.className,

    constructor: function TeamView(options) {
      options || (options = {});
      options.data || (options.data = {});
      if (options.data.showTitleIcon === undefined) {
        options.data.showTitleIcon = true;
      }
      if (options.data.showWorkspaceIcon === undefined) {
        options.data.showWorkspaceIcon = false;
      }
      options.data.title || (options.data.title = lang.dialogTitle);
      if (!options.workspaceContext) {
        options.workspaceContext = options.context.getObject(WorkspaceContextFactory);
        options.workspaceContext.setWorkspaceSpecific(HeaderModelFactory);
        options.workspaceContext.setWorkspaceSpecific(TeamCollectionFactory);
      }
      ListView.prototype.constructor.apply(this, arguments);
      this.headerModel = options.workspaceContext.getObject(HeaderModelFactory);
    },

    templateHelpers: function () {
      return {
        searchAria: lang.searchAria,
        expandAria: lang.expandAria,
        title: BaseUtils.getClosestLocalizedString(this.options.data.title, lang.dialogTitle),
        icon: this.options.data.titleBarIcon || 'title-icon title-team',
        searchPlaceholder: _.str.sformat(lang.searchIconTooltip,
            lang.rolesParticipantsColTooltip)
      };
    },

    getEmptyView: function () {
      return TeamEmptyView;
    },

    emptyViewOptions: {
      templateHelpers: function () {
        return {
          noResultsPlaceholder: lang.noResultsPlaceholder
        };
      }
    },

    childView: ListItem,

    childViewOptions: {
      templateHelpers: function () {
        return {
          name: this.model.get('display_name'),
          email: this.model.get('business_email'),
          isUser: this.model.get('type') === 0,
          stage: {
            value: this.model.getLeadingRole(),
            label: this.model.getRolesIndicator()
          }
        }
      }
    },

    childEvents: {
      'click:item': 'onClickItem'
    },

    onClickItem: function (target) {
      return;
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.tile-content',
        suppressScrollX: true,
        scrollYMarginOffset: 15
      },

      LimitedList: {
        behaviorClass: LimitingBehavior,
        completeCollection: function () {
          return this.options.workspaceContext.getCollection(TeamCollectionFactory);
        },
        filterByProperty: 'display_name',
        limit: 0
      },

      ExpandableList: {
        behaviorClass: ExpandingBehavior,
        expandedView: TeamTablesView,
        expandedViewOptions: function () {
          return {collapsedView: this}
        },
        dialogTitle: function () {
          return this.headerModel.get('name');
        },
        headerControl: function () {
          return new TeamHeaderView({
            primaryTitle: this.headerModel.get('name'),
            secondaryTitle: this.headerModel.get('workspace_type_name')
          });
        },
        titleBarIcon: function () {
          return this.getIconData().titleBarIcon;
        },
        titleBarImageUrl: function () {
          return this.getIconData().titleBarImageUrl;
        },
        titleBarImageClass: function () {
          return this.getIconData().titleBarImageClass;
        },
        dialogTitleIconRight: 'icon-tileCollapse',
        dialogClassName: 'conws-team'
      },

      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },

      ListViewKeyboardBehavior: {
        behaviorClass: ListViewKeyboardBehavior
      }
    },

    onClickHeader: function (target) {
      this.triggerMethod('expand');
    },

    getIconData: function () {
      var ret = {};
      if (this.options.data.showTitleIcon) {
        ret.titleBarIcon = this.options.data.titleBarIcon || 'title-icon mime-team';
        if (this.options.data.showWorkspaceIcon) {
          if (this.headerModel.icon && this.headerModel.icon.location !== 'none') {
            ret.titleBarIcon = undefined;
            ret.titleBarImageUrl = this.headerModel.icon.content;
          }
          else {
            ret.titleBarIcon = NodeSpriteCollection.findByNode(this.headerModel).get('className');
          }
        }
      }
      return ret;
    },
    onRefreshList: function () {
      if (!_.isUndefined(this.completeCollection)) {
        this.completeCollection.fetch();
      }
    },
    getElementByIndex: function (index) {
      if (isNaN(index) || (index < 0)) {
        return null;
      }
      var $item = this.$(_.str.sformat('.conws-item-member:nth-child({0})', index + 1));
      return this.$($item[0]);
    }
  });

  return TeamView;
});
