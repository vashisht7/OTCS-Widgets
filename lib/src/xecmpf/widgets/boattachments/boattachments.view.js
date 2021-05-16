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
  'csui/utils/log',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/utils/commands',

  'xecmpf/widgets/boattachments/impl/boattachments.factory',
  'xecmpf/widgets/boattachments/impl/boattachment.table/boattachmentstable.view',
  'xecmpf/widgets/boattachments/impl/boattitem.view',
  'xecmpf/models/boattachmentcontext/attachmentcontext.factory',
  'xecmpf/widgets/boattachments/impl/boattachmentutil',
  'xecmpf/models/boattachmentcontext/attachmentcontext.busobjinfo.factory',

  'i18n!xecmpf/widgets/boattachments/impl/nls/lang',
  'css!xecmpf/widgets/boattachments/impl/boattachments'
], function (Marionette, module, _, Backbone, $, base, ListView, NodeSpriteCollection,
  LimitingBehavior, ExpandingBehavior, TabableRegionBehavior, ListViewKeyboardBehavior,
  InfiniteScrollingBehavior, NodeModelFactory, BlockingView,
  ModalAlert,
  log,
  NodeTypeIconView,
  Commands,
  BusinessAttachmentsCollectionFactory,
  BusinessAttachmentsTableView,
  AttachmentItemView,
  AttachmentContextFactory,
  attachmentUtil,
  BusinessObjectInfoFacory,
  lang, css) {

  var config = module.config();

  var BOAttachmentsView = ListView.extend({

    constructor: function BOAttachmentsView(options) {
      this.viewClassName = 'xecmpf-businessattachments';
      if (!options || !options.context) {
        throw new Error('Context required to create AttachmentsView');
      }
      if (!options.businessAttachmentContext) {
        options.businessAttachmentContext = options.context.getObject(AttachmentContextFactory,
          options.data);
        options.businessAttachmentContext.setAttachmentSpecific(
          BusinessAttachmentsCollectionFactory);
      }

      options.data || (options.data = {});
      options.data.businessattachment || (options.data.businessattachment = {});
      _.defaults(options.data.businessattachment.properties, {
        busObjectId: "",
        busObjectType: "",
        extSystemId: ""
      });
      this.busobjinfo = options.businessAttachmentContext.getModel(BusinessObjectInfoFacory, {
        data: options.data.businessattachment.properties,
        attributes: options.data.businessattachment.properties
      });

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
      this.listenTo(this.collection, "sync", this._renderBusinessAttachmentTitleIcon);
      this.listenTo(this.collection, "error", this._renderBusinessAttachmentTitleIcon);
      this.nodeModel = this.getContext().getObject(NodeModelFactory, options.context.options);
      this.listenTo(this.nodeModel, 'change:id', this._reset);
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
          } else {
            ModalAlert.showError(arguments[1].responseJSON.error);
          }
        });
      this.listenTo(this.collection, "request", this.destroyEmptyView)
      if (this.options &&
        this.options.data &&
        this.options.data.collapsedView &&
        this.options.data.collapsedView.orderBy) {

        if (_.isString(this.options.data.collapsedView.orderBy)) {
          log.error(lang.errorOrderByMustNotBeString) && console.log(log.last);
          ModalAlert.showError(lang.errorOrderByMustNotBeString);
        } else if (this.options.data.collapsedView.orderBy.sortColumn) {
          var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g;
          var match = parameterPlaceholder.exec(this.options.data.collapsedView.orderBy.sortColumn);
          if (!match) {
            log.error(lang.errorOrderByMissingBraces) && console.log(log.last);
            ModalAlert.showError(lang.errorOrderByMissingBraces);
          }
        }
      }
      if (this.options &&
        this.options.data &&
        this.options.data.collapsedView) {
        var errors = [],
          that = this;
        ["title", "description", "topRight", "bottomLeft", "bottomRight"].forEach(function (n) {
          if (that.options.data.collapsedView[n] && that.options.data.collapsedView[n].format) {
            errors.push(n);
          }
        });
        if (errors.length > 0) {
          ModalAlert.showError(
            _.str.sformat(lang.errorFieldFormatTagUnrecognized, errors.join(", ")));
        }
      }

    },

    getContext: function () {
      return this.options.businessAttachmentContext;
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
        imageClass: 'xecmpf-attachmentstitleicon',
        searchPlaceholder: this._getSearchPlaceholder()
      };
    },

    childEvents: {
      'render': 'onRenderItem',
      'before:destroy': 'onBeforeDestroyItem'
    },

    className: function () {
      var className = this.viewClassName,
        parentClassName = _.result(ListView.prototype, 'className');
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
    dialogClassName: 'xecmpf-businessattachments',
    behaviors: {
      LimitedList: {
        behaviorClass: LimitingBehavior,
        limit: function () {
          return this.limit;
        },
        completeCollection: function () {
          return this.getContext().getCollection(BusinessAttachmentsCollectionFactory, {
            attributes: this._getCollectionAttributes(),
            options: {
              data: this.options.data,
              query: this._getCollectionUrlQuery()
            }
          })

        }
      },

      ExpandableList: {
        behaviorClass: ExpandingBehavior,
        expandedView: BusinessAttachmentsTableView,
        expandedViewOptions: function () {
          return {
            title: this._getTitle(),
            titleBarIcon: this._getTitleIcon(),
            data: _.clone(this.configOptionsData),
            collection: this._getExpandedViewCollection(true), //for expand view new collection is required always for default filters & sorting.
            context: this.getContext(),
            extId: this.busobjinfo.get('extSystemId'),
            boType: this.busobjinfo.get('busObjectType'),
            boId: this.busobjinfo.get('busObjectKey')
          };
        },
        dialogClassName: function () {
          return this.dialogClassName;
        }
      },

      InfiniteScrolling: {
        behaviorClass: InfiniteScrollingBehavior,
        content: '.binf-list-group',
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

    _getExpandedViewCollection: function (freshCollection) {
      if (!!freshCollection) {
        this.expandViewCollection = this.completeCollection ?
          this.completeCollection.clone() : this.collection.clone();
        this.expandViewCollection.businessObjectActions = this.completeCollection.businessObjectActions || this.collection.businessObjectActions;
        this.expandViewCollection.columns = this.completeCollection.columns || this.collection.columns;
        this.listenTo(this.expandViewCollection, {
          'add': function (model) {
            this.collection.add(model, {
              at: 0
            });
          }
        });
      }
      return this.expandViewCollection;
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
          if (self.collection.setFilter(filterOptions, {
              fetch: false
            })) {
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

      if (this.busobjinfo.get("titleIcon")) {
        icon.src = this.busobjinfo.get("titleIcon");
        icon.cssClass = 'csui-icon';
      } else {

        icon.cssClass = 'xecmpf-attachmentstitleicondefault ' +
          NodeSpriteCollection.findClass('equals', 'type', 848);
      }
      return icon;
    },
    _renderBusinessAttachmentTitleIcon: function () {
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
        $(titleImgEl).attr('alt', '');

        $(titleImgEl).after('<span class="csui-icon xecmpf-icon-boattachment-overlay" ' +
          'title="' + lang.businessAttachments + '"></span>');

      }
    },

    _getTitle: function () {
      var ret = lang.dialogTitle;

      if (this.options.data.title) {
        ret = base.getClosestLocalizedString(this.options.data.title, lang.dialogTitle);
      }

      return ret;
    },

    _getSearchPlaceholder: function () {
      return lang.searchPlaceholder.replace("%1", this._getTitle());
    },

    childView: AttachmentItemView,

    childViewOptions: function () {
      _.defaults(this.options.data, {
        collapsedView: {
          title: {
            value: "{name}"
          }
        }
      });
      _.defaults(this.options.data.collapsedView.title, {
        value: "{name}"
      });

      if (_.isEmpty(this.options.data.collapsedView.title) ||
        _.isEmpty(this.options.data.collapsedView.title.value)) {
        this.options.data.collapsedView.title = {
          value: "{name}"
        }
      }

      return {
        context: this.options.context,
        data: this.options.data.collapsedView
      };
    },

    emptyViewOptions: {
      templateHelpers: function () {
        var noBusObj = this._parent.busobjinfo.invalidConfigurationShown ?
          this._parent.busobjinfo.invalidErrorMessage : '';
        return {
          text: this._parent._getNoResultsPlaceholder() + noBusObj

        };
      }
    },
    _getCollectionAttributes: function () {
      var boAttachmentProps = (this.options.data.busObjectId && this.options.data) ||
        (this.options.data && this.options.data.businessattachment &&
          this.options.data.businessattachment.properties) || {};
      return {
        busObjectType: (boAttachmentProps && boAttachmentProps.busObjectType),
        extSystemId: (boAttachmentProps && boAttachmentProps.extSystemId),
        busObjectId: (boAttachmentProps && boAttachmentProps.busObjectId),
        sortExpanded: this.options.data.expandedView &&
          attachmentUtil.orderByAsString(this.options.data.expandedView.orderBy) ||
          this._getDefaultSortOrder() || undefined,
        sortCollapsed: this.options.data.collapsedView &&
          attachmentUtil.orderByAsString(this.options.data.collapsedView.orderBy) ||
          this._getDefaultSortOrder() || undefined
      };

    },
    _getDefaultSortOrder: function () {
      return this._getFilterPropertyName() ? this._getFilterPropertyName() + ' asc' : undefined;
    },

    _getCollectionUrlQuery: function () {
      var options = this.options,
        query = {};
      var orderByAsString;

      if (options.data.collapsedView) {
        orderByAsString = attachmentUtil.orderByAsString(options.data.collapsedView.orderBy);
      }
      if (!orderByAsString) {
        orderByAsString = this._getDefaultSortOrder();
      }
      if (orderByAsString) {
        query.sort = orderByAsString;
      }

      return query;
    },
    _getFirstPlaceholder: function (expression) {
      var parameterPlaceholder = /{([^:}]+)(:([^}]+))?}/g,
        match, propertyName, placeholder, result;
      while ((match = parameterPlaceholder.exec(expression))) {
        placeholder = match[0];
        propertyName = match[1];
        if (propertyName) {
          result = match;
          break;
        }
      }
      return result;
    },
    _getFilterPropertyName: function () {
      var propertyName;
      if (this.options && this.options.data && this.options.data.collapsedView &&
        this.options.data.collapsedView.title && this.options.data.collapsedView.title.value) {
        var placeHolder = this._getFirstPlaceholder(this.options.data.collapsedView.title.value);
        if (placeHolder) {
          propertyName = placeHolder[1];
        }
      }
      return propertyName;
    },
    getElementByIndex: function (index) {
      if (isNaN(index) || (index < 0)) {
        return null;
      }
      var $item = this.$(_.str.sformat(
        '.xecmpf-attachmentitem-object:nth-child({0}) .xecmpf-attachmentitem-border', index + 1));
      return this.$($item[0]);
    },
    _getNoResultsPlaceholder: function () {
      var ret = this.options.data &&
        this.options.data.collapsedView &&
        this.options.data.collapsedView.noResultsPlaceholder;

      if (ret) {
        ret = base.getClosestLocalizedString(ret, lang.noResultsPlaceholder);
      } else {
        ret = lang.noResultsPlaceholder;
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

    onRenderItem: function (childView) {
      childView._nodeIconView = new NodeTypeIconView({
        el: childView.$('.csui-type-icon').get(0),
        node: childView.model
      });
      childView._nodeIconView.render();
    },

    onBeforeDestroyItem: function (childView) {
      if (childView._nodeIconView) {
        childView._nodeIconView.destroy();
      }
    }
  });

  return BOAttachmentsView;
});