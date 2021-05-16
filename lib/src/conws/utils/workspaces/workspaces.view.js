/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/marionette', 'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/jquery',
  'csui/utils/base',
  'csui/controls/list/list.view',
  'csui/utils/nodesprites',
  'csui/behaviors/limiting/limiting.behavior',
  'csui/behaviors/expanding/expanding.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/list/behaviors/list.view.keyboard.behavior',
  'csui/controls/tile/behaviors/infinite.scrolling.behavior',
  'csui/utils/contexts/factories/node',
  'csui/controls/progressblocker/blocker',
  'csui/dialogs/modal.alert/modal.alert',
  'i18n!conws/utils/workspaces/impl/nls/lang',
  'css!conws/utils/workspaces/workspaces',
  'hbs!conws/utils/workspaces/error.template'
], function (Marionette, module, _, Backbone, $, base, ListView, NodeSpriteCollection,
    LimitingBehavior, ExpandingBehavior, TabableRegionBehavior, ListViewKeyboardBehavior,
    InfiniteScrollingBehavior, NodeModelFactory, BlockingView, ModalAlert, lang, css, errorTemplate) {

  var config = module.config();
  var WorkspacesExpandingBehavior = ExpandingBehavior.extend({

    constructor: function WorkspacesExpandingBehavior( options, view ) {
      options = _.extend({collapsedView:view},options);
      ExpandingBehavior.prototype.constructor.call(this, options,view );
      this.listenTo(view.options.context, "close:expanded", function(ev) {
        if (ev.widgetView===this.expandedView && this.dialog && this.dialog.body && this.dialog.body.currentView===ev.widgetView ) {
          this.dialog.destroy();
        }
      });
    },
    _expandOtherView: function (expand) {
      if (expand===false) {
        this.expandedView.collapsedView = this.view;
        this.view.expandedView = this.expandedView;
      }
      var result = ExpandingBehavior.prototype._expandOtherView.apply(this, arguments);
      return result;
    },

    _enableExpandingAgain: function () {
      var result = ExpandingBehavior.prototype._enableExpandingAgain.apply(this, arguments);
      this.expandedView.collapsedView = undefined;
      this.view.expandedView = undefined;
      return result;
    }

  });

  var WorkspacesView = ListView.extend({

    constructor: function WorkspacesView(options) {
      if (options === undefined || !options.context) {
        throw new Error('Context required to create WorkspacesView');
      }

      options.data || (options.data = {});
      ListView.prototype.constructor.apply(this, arguments);

      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }

      this.options.data.pageSize = config.defaultPageSize || 30;

      this.configOptionsData = _.clone(options.data);
      this.lastFilterValue = "";
      this.limit = 0;
      this.listenTo(this.collection, "sync", this._renderWorkspaceTitleIcon);
      this.listenTo(this.collection, 'error', this.handleError);
      var nodeModel = this.getContext().getObject(NodeModelFactory, options.context.options);
      this.listenTo(nodeModel, 'change:id', this._reset);
      this.listenTo(this.collection, "request", this.blockActions)
          .listenTo(this.collection, "sync", function () {
            this.messageOnError = undefined;
            this.unblockActions.apply(this, arguments);
          })
          .listenTo(this.collection, "destroy", this.unblockActions)
          .listenTo(this.collection, "error", function () {
            this.unblockActions.apply(this, arguments);
            if (this.messageOnError) {
              ModalAlert.showError(this.messageOnError);
              this.messageOnError = undefined;
            }
          });
      this.listenTo(this.collection, "request", this.destroyEmptyView);
      this.listenTo(this, "go:away", function() {
        var expandedView = this.expandedView;
        if (expandedView) {
          this.listenTo(expandedView, "destroy", function() {
            if (expandedView && expandedView.changed) {
              this.collection.fetch();
              expandedView = undefined;
            }
          });
        }
      });

    },

    getContext: function () {
      return this.options.context;
    },

    initialize: function () {
      this.collection = this.completeCollection;
    },

    onRender: function () {
      this._resetInfiniteScrolling();
      ListView.prototype.onRender.call(this);
    },

    onClickHeader: function (target) {
      this.triggerMethod('expand');
    },

    _resetInfiniteScrolling: function () {
      this.collection.setLimit(0, this.options.data.pageSize, false);
    },

    templateHelpers: function () {
      return {
        title: this._getTitle(),
        imageUrl: this._getTitleIcon().src,
        imageClass: 'conws-workspacestitleicon',
        searchPlaceholder: this._getSearchPlaceholder()
      };
    },

    childEvents: {
      'click:item': 'onClickItem'
    },

    onClickItem: function (target) {
      this.triggerMethod('execute:defaultAction', target.model);
    },

    className: function () {
      var className       = this.viewClassName,
          workspaceType   = this.options.data.workspaceType,
          parentClassName = _.result(ListView.prototype, 'className');
      if (workspaceType) {
        className = className + ' conws-workspacetype-' + workspaceType;
      }
      if (parentClassName) {
        className = className + ' ' + parentClassName;
      }
      return className;
    },
    _reset: function () {
      if (this.collection) {
        this.collection.resetLimit();
      }
      if (this.ui.searchInput && this.ui.searchInput.val() !== "") {
        if (this.collection) {
          this.collection.clearFilter(false);
        }
        this.ui.searchInput.val('');
      }
      if (this.ui.searchInput && this.ui.searchInput.is(':visible')) {
        this.searchClicked(new CustomEvent(''));
      }
    },

    workspacesCollectionFactory: undefined,
    workspacesTableView: undefined,
    viewClassName: undefined,
    dialogClassName: undefined,
    lang: undefined,

    behaviors: {
      LimitedList: {
        behaviorClass: LimitingBehavior,
        limit: function () {
          return this.limit;
        },
        completeCollection: function () {
          return this.getContext().getCollection(this.workspacesCollectionFactory, {
            attributes: this._getCollectionAttributes(),
            options: this._getCollectionOptions()
          });
        }
      },

      ExpandableList: {
        behaviorClass: WorkspacesExpandingBehavior,
        expandedView: function () {
          return this.workspacesTableView;
        },
        expandedViewOptions: function () {
          return this._getExpandedViewOptions();
        },
        dialogTitle: function () {
          return this._getTitle();
        },
        dialogTitleIconRight: "icon-tileCollapse",
        dialogClassName: function () {
          return "conwsworkspacestable" + (this.dialogClassName ? " "+this.dialogClassName : "");
        },
        titleBarImageUrl: function () {
          return this._getTitleIcon().src;
        },
        titleBarImageClass: function () {
          return this._getTitleIcon().cssClass || 'conws-workspacestitleicon';
        }
      },

      InfiniteScrolling: {
        behaviorClass: InfiniteScrollingBehavior,
        contentParent: '.tile-content',
        fetchMoreItemsThreshold: 80
      },

      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },

      ListViewKeyboardBehavior: {
        behaviorClass: ListViewKeyboardBehavior
      }
    },

    _getCollectionOptions: function() {
      return { query: this._getCollectionUrlQuery() };
    },

    _getExpandedViewOptions: function() {
      return { data: _.clone(this.configOptionsData) };
    },

    filterChanged: function (event) {
      if (event && event.type === 'keyup' && event.keyCode === 27) {
        this.searchClicked();
      }

      var filterValue = this.ui.searchInput.val();
      if (this.lastFilterValue !== filterValue) {
        this.lastFilterValue = filterValue;
        if (this.filterTimeout) {
          clearTimeout(this.filterTimeout);
        }
        this.filterTimeout = setTimeout(function (self) {
          self.filterTimeout = undefined;
          self._resetInfiniteScrolling();
          self.collection.reset();
          var propertyName;
          if (self._getFilterPropertyName) {
            propertyName = self._getFilterPropertyName();
          }
          var filterOptions = {};
          filterOptions[propertyName || "name"] = filterValue;
          if (self.collection.setFilter(filterOptions, {fetch: false})) {
            self.messageOnError = lang.errorFilteringFailed;
            self.collection.fetch();
          }
        }, 1000, this);
      }
    },
    _getTitleIcon: function () {
      var icon = {
        src: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
        cssClass: undefined
      };
      if (this.collection && this.collection.titleIcon) {
        icon.src = this.collection.titleIcon;
      } else if (this.collection && this.collection.titleIcon === null) {
        icon.cssClass = 'conws-workspacestitleicondefault conws-mime_workspace';
      }
      return icon;
    },
    _renderWorkspaceTitleIcon: function () {
      var titleDivEl = this.$el.find('.tile-type-image')[0],
          titleImgEl = titleDivEl && this.$el.find('.tile-type-image').find("img")[0];
      if (titleImgEl) {
        var icon = this._getTitleIcon();
        if ($(titleImgEl).attr('src') !== icon.src) {
          $(titleImgEl).attr('src', icon.src);
        }

        if (icon.cssClass) {
          if ($(titleImgEl).attr('class') !== icon.cssClass) {
            $(titleImgEl).attr('class', icon.cssClass);
          }
        }
      }
    },

    _getTitle: function () {
      var ret = this.lang.dialogTitle;

      if (this.options.data.title) {
        ret = base.getClosestLocalizedString(this.options.data.title, this.lang.dialogTitle);
      }

      return ret;
    },

    _getSearchPlaceholder: function () {
      return this.lang.searchPlaceholder.replace("%1", this._getTitle());
    },

    _getNoResultsPlaceholder: function () {
      var ret = this.options.data &&
                this.options.data.collapsedView &&
                this.options.data.collapsedView.noResultsPlaceholder;

      if (ret) {
        ret = base.getClosestLocalizedString(ret, this.lang.noResultsPlaceholder);
      } else {
        ret = this.lang.noResultsPlaceholder;
      }

      return ret;
    },
    collectionEvents: {
      'reset': 'onCollectionSync'
    },

    onCollectionSync: function () {
      this.synced = true;
    },

    isEmpty: function () {
      return this.synced && (this.collection.models.length === 0);
    },

    handleError: function () {
      if (this.collection.error && this.collection.error.message) {
        var emptyEl = errorTemplate.call(this, { errorMessage: this.collection.error.message });
        this.$el.find('.tile-content').append(emptyEl);
      }
    }

  });

  return WorkspacesView;

});
