/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base', 'csui/utils/commands',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/behaviors/default.action/impl/defaultaction',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/thumbnail/impl/metadata/thumbnail.metadata.view',
  'csui/controls/thumbnail/impl/sort/sort.view',
  'csui/controls/thumbnail/content/content.factory',
  'csui/controls/thumbnail/thumbnail.content',
  'csui/controls/thumbnail/content/thumbnail.icon/thumbnail.icon.view',
  'csui/controls/thumbnail/content/select/select.view',
  'csui/controls/table/cells/searchbox/searchbox.view',
  'csui/utils/dragndrop.supported.subtypes',
  'csui/controls/tableactionbar/tableactionbar.view',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/controls/progressblocker/blocker',
  'csui/controls/mixins/view.state/node.view.state.mixin',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'hbs!csui/controls/thumbnail/impl/thumbnail.header',
  'hbs!csui/controls/thumbnail/impl/thumbnail.item',
  'hbs!csui/controls/thumbnail/impl/thumbnail',
  'hbs!csui/controls/thumbnail/impl/empty.thumbnail',
  'i18n!csui/controls/thumbnail/impl/nls/lang',
  'css!csui/controls/thumbnail/thumbnail',
  'csui/lib/jquery.mousehover'
], function (module, _, $, Backbone, Marionette, base, commands, DefaultActionBehavior,
    DefaultActionController, PerfectScrollingBehavior, TabableRegionBehavior, ThumbnailMetadataView,
    SortView, ContentFactory, ThumbnailContent, ThumbnailIconView, SelectContentView, SearchBoxView,
    DragndropSupportedSubtypes, TableActionBarView, LayoutViewEventsPropagationMixin,
    ViewEventsPropagationMixin, BlockingView,
    NodeViewStateMixin, FieldsV2Mixin, thumbnailHeaderTemplate,
    thumbnailItemTemplate, thumbnailTemplate, emptyThumbnailTemplate, lang) {
  'use strict';
  var config = _.extend({}, module.config());

  var NoThumbnailView = Marionette.ItemView.extend({

    className: 'csui-thumbnail-empty',
    template: emptyThumbnailTemplate,

    templateHelpers: function () {
      return {
        noResults: (this.options.isFilterApplied ||
                    ([298, 899].indexOf(this._parent.collection.node.get('type')) !== -1)) ?
                   lang.noResults : lang.dragAndDropMessage
      };
    },

    constructor: function NoThumbnailView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    onRender: function () {
      this.options.$parentEl.addClass('csui-thumbnail-empty');
    },

    onShow: function () {
      this.$el.addClass('icon-thumbnail-empty-page');
    },

    onDestroy: function () {
      this.options.$parentEl.removeClass('csui-thumbnail-empty');
    }
  });

  var ThumbnailItemView = Marionette.LayoutView.extend({

    className: function () {
      var className = 'csui-thumbnail-item' + ' csui-thumbnail-item-' + this.model.cid;
      if (this.model.inlineFormView) {
        className = className + ' csui-thumbnail-item-form';
      }
      return className;
    },
    template: thumbnailItemTemplate,

    templateHelpers: function () {
      return {

        columns: this.options.thumbnailContent.models,
        isChecked: this.options.thumbnailView.collection.itemchecked,
        selectThumbnails: this.options.thumbnailView.options.selectThumbnails === 'none'
      };
    },

    ui: {
      itemContainer: '.csui-thumbnail-item-container'
    },

    events: {
      'click @ui.itemContainer': 'onItemClick'
    },

    regions: {
      selectContentRegion: ".csui-thumbnail-select",
      thumbnailIconRegion: ".csui-thumbnail-thumbnailIcon"
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: ".csui-thumbnail-item-container",
        suppressScrollX: true,
        scrollYMarginOffset: 15
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function () {
      if (this.$el.prop('tabindex') === -1) {
        this.$el.prop('tabindex', 0);
      }
      var tabElements = this.$('*[tabindex]');
      if (tabElements.length) {
        tabElements.prop('tabindex', 0);
      }
      return this.$el;
    },

    initialize: function () {
      var self = this;
      if (this.options.thumbnailContent && this.options.thumbnailContent.models) {
        _.each(this.options.thumbnailContent.models, function (model, index) {
          var content = ContentFactory.getContentView(model);
          if (content) {
            var region = model.get("key");
            self.addRegion(region, ".csui-thumbnail-" + region);
          }
        }, this);
      }
      if (!base.isHybrid() && this.options.showInlineToolbar) {
        this._subscribeEventHandlers();
      }
      this.model.set('inactive', !this.options.thumbnailView.checkModelHasAction(this.model),
          {silent: true});
      self.ContentFactory = ContentFactory;

      this.listenTo(this.model, 'change:csuiIsSelected', function (model) {
        if (model.get('csuiIsSelected')) {
          this.options.thumbnailView.$el.find(".csui-thumbnail-select").addClass(
              'csui-checkbox');
          this.$el.addClass('csui-thumbnail-item-selected');
          if (this.options.thumbnailView.options.selectThumbnails === "single") {
            this.options.thumbnailView.$el.find(".csui-thumbnail-select").addClass(
                'csui-single-checkbox');
          }
        } else {
          this.$el.removeClass('csui-thumbnail-item-selected');
          if (!this.options.thumbnailView._allSelectedNodes.length) {
            this.options.thumbnailView.$el.find(".csui-thumbnail-select").removeClass(
                'csui-checkbox');
            this.$el.removeClass('csui-thumbnail-item-selected');
          }
          if (this.options.thumbnailView.options.selectThumbnails === "single") {
            this.options.thumbnailView.$el.find(".csui-thumbnail-select").removeClass(
                'csui-single-checkbox');
          }
        }
        this.options.thumbnailHeaderView.trigger('selectOrUnselect.mixed');
      });

      if (this.options.thumbnailView._allSelectedNodes.findWhere({id: this.model.get('id')})) {
        this.options.model.set('csuiIsSelected', true);
      }
    },

    constructor: function ThumbnailItemView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.listenTo(this.model, 'sync', this.render);
    },

    onItemClick: function () {
      this.options.thumbnailView.currentItemView = this;
    },

    _subscribeEventHandlers: function () {
      this.$el && this.$el.mousehover(
          this.showInlineActions.bind(this),
          this.hideInlineActions.bind(this),
          {namespace: this.cid});
    },

    _unsubscribeEventHandlers: function () {
      if (this._isRendered) {
        this.$el.mousehover('off', {namespace: this.cid});
      }
    },

    showInlineActions: function (e) {
      if (this.$el.find(".csui-inlineform-group").length === 0) {
        var inlineToolbarContainer = this.$el.find('.csui-thumbnail-actionbar');
        if (inlineToolbarContainer.length > 0 &&
            !this.options.originatingView.lockedForOtherContols) {
          var self = this,
              args = {
                sender: self,
                target: inlineToolbarContainer,
                model: self.model
              };
          self.trigger("mouseenter:row", args);
        }
      } else {
        this.$el.find(".csui-thumbnail-select").css({"display": "none"});
      }
    },

    hideInlineActions: function (e) {
      var inlineToolbarContainer = this.$el.find('.csui-thumbnail-actionbar');
      if (inlineToolbarContainer.length > 0) {
        var self = this,
            args = {
              sender: self,
              target: inlineToolbarContainer,
              model: self.model
            };
        self.trigger("mouseleave:row", args);
      }
    },

    onRender: function (e) {
      var self = this;
      if (self.model.isLocallyCreated && !self.model.inlineFormView) {
        this.$el.find('.csui-thumbnail-content-container').addClass('csui-new-item');
      }
      if (this.options.thumbnailView &&
          this.options.thumbnailView.options.selectThumbnails === "single") {
        this.$el.find(".csui-thumbnail-select").addClass('csui-single-checkbox');
      }
      this.selectContentView = new SelectContentView({
        tagName: 'div',
        model: this.options.model,
        thumbnailView: this.options.thumbnailView,
        events: function () {
          if (base.isFirefox()) {
            return _.extend({}, SelectContentView.prototype.events, {
              'keydown': self.onKeyInView
            });
          }
          return SelectContentView.prototype.events;
        }
      });
      this.selectContentRegion.show(this.selectContentView);
      if (this.options.model.get('csuiIsSelected')) {
        this.selectContentRegion.$el.addClass('csui-checkbox');
        this.$el.addClass('csui-thumbnail-item-selected');
      } else {
        if (this.options.thumbnailView.getSelectedChildren().length === 0 &&
            this.options.thumbnailView.resultsView.$el.find('.csui-checkbox')) {
          this.selectContentRegion.$el.removeClass('csui-checkbox');
          this.$el.removeClass('csui-thumbnail-item-selected');
        }
      }
      this.options.thumbnailHeaderView.trigger('selectOrUnselect.mixed');
      if (this.options.model.get(SelectContentView.isSelectedModelAttributeName)) {
        this.$el.addClass('csui-thumbnail-item-selected');
      }
      if (this.getSelectedChildren().length > 0 && self.model.isLocallyCreated &&
          !self.model.inlineFormView || this.options.thumbnailView._allSelectedNodes.length) {
        this.$el.find('.csui-new-item').parent().find('.csui-thumbnail-select').addClass(
            'csui-checkbox');
        this.selectContentRegion.$el.addClass('csui-checkbox');
      }
      self.listenTo(this.selectContentView, 'clicked:checkbox', function (event) {
        if (this.options.thumbnailView.activeInlineForm && event.checked) {
          this.options.thumbnailView.cancelAnyExistingInlineForm();
        }
        this.options.thumbnailView.stopListening(this.options.thumbnailView, 'thumbnailItem:toggled');
        this.options.thumbnailView.listenTo(this.options.thumbnailView, 'thumbnailItem:toggled',
            _.bind(function (event) {
              if (event.checked) {
                if ((this.options.thumbnailView.options.selectThumbnails === 'single' &&
                     this.options.thumbnailView._allSelectedNodes.length === 0) ||
                    this.options.thumbnailView.options.selectThumbnails === 'multiple') {
                  this.options.thumbnailView._allSelectedNodes.add(event.view.model,
                      {silent: true});
                } else if (this.options.thumbnailView.options.selectThumbnails === 'single' &&
                           this.options.thumbnailView._allSelectedNodes.length > 0) {
                  this.options.thumbnailView._allSelectedNodes.reset([]);
                  this.options.thumbnailView._allSelectedNodes.add(event.view.model,
                      {silent: true});
                }
              } else {
                this.options.thumbnailView._allSelectedNodes.remove(event.view.model,
                    {silent: true});
              }
              this.options.thumbnailView._allSelectedNodes.reset(
                  this.options.thumbnailView._allSelectedNodes.models);
            }, this));

        this.options.thumbnailView.trigger('thumbnailItem:toggled', event);
        self.showToolBarActions(event);
        if (event.checked) {
          if (this.options.thumbnailView.resultsView.inlineToolbarView) {
            this.options.thumbnailView.resultsView.inlineToolbarView.destroy();
          }
          self.model.set(SelectContentView.isSelectedModelAttributeName, true);
          self.model.attributes.isSelected = true;
          self.options.thumbnailView.trigger("thumbnailSelected",
              {sender: self, targets: self.options.thumbnailView, nodes: self});
        } else {
          self.model.set(SelectContentView.isSelectedModelAttributeName, false);
          self.model.attributes.isSelected = false;
          self.options.thumbnailView.trigger("thumbnailUnSelected",
              {sender: self, targets: self.options.thumbnailView, nodes: self});
        }
      });

      this.thumbnailIconView = new ThumbnailIconView({
        model: this.options.model,
        context: this.options.context,
        column: {defaultAction: true},
        originatingView: this.options.originatingView
      });
      this.thumbnailIconRegion.show(this.thumbnailIconView);
      this.listenTo(this.thumbnailIconView, 'execute:defaultAction', function (event) {
        event.preventDefault();
        event.stopPropagation();
        self.options.thumbnailView.trigger("execute:defaultAction", self.model);
      });
      this.contents = this.options.columns;
      var contentModelsByKey = [];
      this.contents.each(function (nodeContentModel) {
        var key = nodeContentModel.get("column_key");
        contentModelsByKey.push(key);
      }, this);
      contentModelsByKey.push("overview");

      if (this.options.thumbnailContent && this.options.thumbnailContent.models) {
        _.each(this.options.thumbnailContent.models, function (model, index) {
          if (this.options.model && this.options.model.isReservedClicked ||
              this.options.model.isUnreservedClicked) {
            this.options.model.set('inactive', this.options.model.attributes.inactive,
                {silent: true});
          } else {
            this.options.model.set('inactive',
                !this.options.thumbnailView.checkModelHasAction(this.model), {silent: true});
          }
          var content = ContentFactory.getContentView(model);
          var key = model.get("key");
          if (content && contentModelsByKey.indexOf(key) > -1) {
            var region     = model.get("key"),
                conFactory = model.get("showoverview") ? ContentFactory : undefined,
                column     = model.toJSON();
            column.name = column.key;
            var contentView = new content({
              tagName: 'DIV',
              model: self.model,
              context: self.options.context,
              column: column,
              ContentFactory: conFactory,
              displayLabel: model.get("displayLabel"),
              displayTitle: model.get("displayTitle"),
              displayIcon: true,
              originatingView: self.options.originatingView,
              selectedChildren: this.options.thumbnailView.options.selectedChildren,
              collection: this.options.thumbnailView.options.collection,
              columns: this.options.columns
            });
            self[region].show(contentView);
            self.listenTo(contentView, 'clicked:content', function (event) {
              self.trigger('clicked:content', {
                contentView: contentView,
                rowIndex: self._index,
                colIndex: index,
                model: self.model
              });
            });
            base.applyEllipsis(self.$el.find(".csui-thumbnail-name-justify-div"), 2);
            self.listenTo(contentView, 'execute:defaultAction', function (event) {
              event.preventDefault();
              event.stopPropagation();
              self.options.thumbnailView.trigger("execute:defaultAction", self.model);
            });
            self.listenTo(contentView, 'show:add:favorite:form', function () {
              self.hideInlineActions();
              self.favoritePopoverOpened = true;
              self.options.originatingView.lockedForOtherContols = true;
            });
            self.listenTo(contentView, 'close:add:favorite:form', function () {
              self.favoritePopoverOpened = false;
              self.options.originatingView.lockedForOtherContols = false;
            });
            self.listenTo(contentView, 'shown:overview:flyout', function () {
              self.hideInlineActions();
              self.overviewPopoverOpened = true;
              self.options.originatingView.lockedForOtherContols = true;
            });
            self.listenTo(contentView, 'hide:overview:flyout', function () {
              self.overviewPopoverOpened = false;
              self.options.originatingView.lockedForOtherContols = false;
            });
          }
        }, this);
      }
    },

    showToolBarActions: function (event) {
      if (!event.checked) {
        this._subscribeEventHandlers();
        this.options.thumbnailView.resultsView.options.showInlineActionBar = false;
      }
      this.options.thumbnailView.showToolBarActions();
    },

    getSelectedChildren: function () {
      return this.model.collection.where({csuiIsSelected: true});
    }
  });

  var ThumbnailListView = Marionette.CollectionView.extend({

    className: 'csui-thumbnail-collection',

    childView: ThumbnailItemView,

    childViewOptions: function () {
      return {
        context: this.options.context,
        showInlineToolbar: this.showInlineToolbar,
        toolbarItems: this.options.inlineBar.options.collection,
        toolbarItemsMasks: this.options.inlineBar.options.toolItemsMask,
        originatingView: this.options.originatingView,
        thumbnailView: this.options.thumbnailView,
        thumbnailHeaderView: this.options.thumbnailHeaderView,
        tableColumns: this.options.tableColumns,
        columns: this.options.columns,
        thumbnailContent: this.options.thumbnailContent
      };
    },

    childEvents: {
      'mouseenter:row': 'onChildShowInlineActionBarWithDelay',
      'mouseleave:row': 'onChildActionBarShouldDestroy',
      'render': '_onChildRender'
    },

    emptyView: NoThumbnailView,
    emptyViewOptions: function () {
      return {
        isFilterApplied: _.some(this.collection.filters, function (filter) {
          return filter && (filter instanceof Object ? filter.length : filter.trim().length);
        }),
        $parentEl: this.$el,
        model: this.emptyModel
      };
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    constructor: function ThumbnailListView(options) {
      options || (options = {});
      this.context = options.context;
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
      this.showInlineToolbar = (this.options.inlineBar.options.collection &&
                                this.options.inlineBar.options.toolItemsMask);
      if (this.showInlineToolbar) {
        this.setInlineActionBarEvents();
      }
      _.defaults(this.options, {
        showInlineActionBar: true
      });
      $(window).on('resize', _.bind(this._adjustThumbnailWidth, this));
    },

    setInlineActionBarEvents: function () {
      this.listenTo(this, 'closeOther', this._destroyInlineActionBar);
      this.listenTo(this.collection, "reset", this._destroyInlineActionBar);
    },

    _destroyInlineActionBar: function () {
      if (this.inlineToolbarView) {
        this.inlineToolbarView.destroy();
        this.inlineToolbarView = undefined;
      }
    },

    _onChildRender: function (childView) {
      childView.options.thumbnailView &&
      childView.options.thumbnailView.trigger("thumbnailRowRendered", {
        sender: this, target: childView.el, node: childView.model
      });
    },
    _showInlineActionBar: function (args) {
      if (this.inlineToolbarView) {
        this._savedHoverEnterArgs = args;
      } else if (!!args) {
        this._savedHoverEnterArgs = null;

        this.inlineToolbarView = new TableActionBarView(_.extend({
              context: this.options.context,
              commands: commands,
              collection: this.options.inlineBar.options.collection,
              toolItemsMask: this.options.inlineBar.options.toolItemsMask,
              originatingView: this.options.originatingView,
              model: args.model,
              status: {
                targetView: args.sender,
                connector: this.options.collection.connector
              }
            }, this.options.inlineBar.options)
        );

        this.listenTo(this.inlineToolbarView, 'before:execute:command', function (eventArgs) {
          this.lockedForOtherContols = true;
          if (eventArgs && eventArgs.status && eventArgs.status.targetView &&
              eventArgs.status.targetView.$el) {
            eventArgs.status.targetView.$el.addClass("active-row");
          }
          this._destroyInlineActionBar();
        });
        this.listenTo(this.inlineToolbarView, 'after:execute:command', function (eventArgs) {
          this.lockedForOtherContols = false;
          if (eventArgs && eventArgs.status && eventArgs.status.targetView &&
              eventArgs.status.targetView.$el) {
            eventArgs.status.targetView.$el.removeClass("active-row");
          }
        });

        if (this.options.originatingView) {
          this.listenTo(this.options.originatingView, "block:view:actions", function () {
            this.lockedForOtherContols = true;
            this._destroyInlineActionBar();
          });
          this.listenTo(this.options.originatingView, "unblock:view:actions", function () {
            this.lockedForOtherContols = false;
          });
        }

        this.inlineToolbarView.render();
        this.listenTo(this.inlineToolbarView, 'destroy', function () {
          this.inlineToolbarView = undefined;
          if (this._savedHoverEnterArgs) {
            this.onChildShowInlineActionBarWithDelay(this._savedHoverEnterArgs);
          }
        }, this);
        $(args.target).append(this.inlineToolbarView.$el);
        this.inlineToolbarView.triggerMethod("show");
      }
    },

    onChildShowInlineActionBarWithDelay: function (childView, args) {
      if (this._showInlineActionbarTimeout) {
        clearTimeout(this._showInlineActionbarTimeout);
      }
      this.isSelected = this.collection.where({csuiIsSelected: true}).length > 0;
      var showInlineActionBar = !this.isSelected &&
                                this.options.thumbnailView.options.allSelectedNodes.length === 0;
      showInlineActionBar = showInlineActionBar && !this.lockedForOtherContols &&
                            this.options.showInlineActionBar;

      if (showInlineActionBar) {
        this._showInlineActionbarTimeout = setTimeout(_.bind(function () {
          this._showInlineActionbarTimeout = undefined;
          this._showInlineActionBar.call(this, args);
        }, this), 200);
      }
    },

    onChildActionBarShouldDestroy: function (childView, args) {
      this.options.showInlineActionBar = true;
      if (this._showInlineActionbarTimeout) {
        clearTimeout(this._showInlineActionbarTimeout);
        this._showInlineActionbarTimeout = undefined;
      }
      if (this.inlineToolbarView) {
        this.inlineToolbarView.destroy();
      }
    },
    showOrHideZeroRecordsMessage: function () {
      this.$el.find('div.csui-thumbnail-empty').remove();
      this.canAddItems = !!this.options.originatingView.canAddItems();
      this.addItemsPermissions = !!this.options.originatingView.addItemsPermissions();
      if (this.collection.length === 0) {
        this.$el.addClass("csui-thumbnail-empty");
        this._setEmptyViewText();
        var emptyEl = $(
            "<div class='csui-thumbnail-empty icon-thumbnail-empty-page" +
            (!!this.addItemsPermissions && !!this.canAddItems ?
             ' csui-can-add-items' : '') + "'" +
            "><p class='csui-no-result-message' title='" +
            this.emptyThumbnailText + "'>" + this.emptyThumbnailText + "</p></div>");
        this.$el.append(emptyEl);
        if (this.options.thumbnailHeaderView && this.options.thumbnailView.collection.filters) {
          this.options.thumbnailHeaderView.searchBoxes.setFocus();
        }
        if (this._showingEmptyView && !!this.options.thumbnailView.collection &&
            !!this.options.thumbnailView.collection.filters) {
          this.options.thumbnailHeaderView.render();
          this.options.thumbnailHeaderView.searchBoxes.setFocus();
        }
      } else {
        this.$el.removeClass("csui-thumbnail-empty");
        this.$el.removeClass("icon-thumbnail-empty-page");
        if (this.$el.is(':visible')) {
          this.trigger('dom:refresh');
        }
      }
    },
    _setEmptyViewText: function () {
      this.emptyThumbnailText = "";
      if (this._showingEmptyView) {
        this.emptyThumbnailText = !!this.addItemsPermissions ?
                                  lang.dragAndDropMessage : lang.noPermissions;
        this.emptyThumbnailText = !!this.canAddItems ? this.emptyThumbnailText : lang.noResults;
        this.emptyThumbnailText = (!!this.collection.filters && this.collection.filters.name ?
                                   lang.noSearchResults : this.emptyThumbnailText);
      }
    },

    onRender: function () {
      this.showOrHideZeroRecordsMessage();
      this._adjustThumbnailWidth();
    },

    onMetadataClose: function () {
      this._adjustThumbnailWidth();
    },

    onShow: function () {
      var names = this.$el.find('.csui-thumbnail-item').find('.csui-thumbnail-name-justify-div');
      _.each(names, function (name) {
        base.applyEllipsis(name, 2);
      }, this);
    },

    _adjustThumbnailWidth: function () {
      var thumbnailViewItem             = this.$el.find('.csui-thumbnail-item'),
          thumbnailViewItemWidth        = 190, //min, max width
          parentWidth                   = $('.csui-table-facetview .csui-facet-panel').length > 0 ?
                                          $('.csui-facet-table-container').width() -
                                          $('.csui-table-facetview').width() :
                                          $('.cs-thumbnail-wrapper').width(),
          spaceBetweenItems             = 2,
          thumbnailViewItemWidthPercent = thumbnailViewItemWidth / parentWidth * 100;
      for (var i = 1; i <= thumbnailViewItem.length; i++) {
        var thumbnailViewItemTotalWidth = i * thumbnailViewItemWidthPercent;
        if (thumbnailViewItemTotalWidth > 100) {
          i = i - 1;
          thumbnailViewItemWidthPercent = 100 / i;
          break;
        }
      }
      thumbnailViewItem.css({
        'maxWidth': "calc(" + thumbnailViewItemWidthPercent + '% - ' + spaceBetweenItems * 2 +
                    "px)",
        'minWidth': "calc(" + thumbnailViewItemWidthPercent + '% - ' + spaceBetweenItems * 2 +
                    "px)"
      });
      for (var item = 0; item < thumbnailViewItem.length; item++) {
        base.applyEllipsis($(thumbnailViewItem[item]).find(".csui-thumbnail-name-justify-div"), 2);
      }
    }
  });

  var ThumbnailHeaderView = Marionette.LayoutView.extend({

    className: 'csui-thumbnail-header',

    tagName: 'div',

    regions: {
      sortRegion: '#csui-sorting-container',
      searchRegion: '#csui-thumbnail-column-search'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      }
    },

    ui: {
      selectAll: '.csui-selectAll-input',
      sortContainer: '#csui-sorting-container'
    },

    events: {
      "keydown": "onKeyInView",
      'click @ui.selectAll': 'selectAllThumbnails',
      'click @ui.sortContainer': 'onSortClick'
    },

    template: thumbnailHeaderTemplate,

    templateHelpers: function () {
      return {
        columns: this.options.thumbnailColumns,
        addTitle: lang.addTitle,
        selectAll: lang.selectAll,
        selectAllId: _.uniqueId('selectAll'),
        selectAllTitle: lang.selectAllTitle,
        isEmptyNode: this.collection.models.length === 0,
        items: base.formatMessage(this.collection.length, lang),
        selectThumbnails: this.options.thumbnailView.options.selectThumbnails === "none" ||
                          this.options.thumbnailView.options.selectThumbnails === "single"
      };
    },

    constructor: function ThumbnailHeaderView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.columnsWithSearch = options.columnsWithSearch || [];
      this.listenTo(this, 'selectOrUnselect.mixed', this.thumbnailItemClicked);
    },

    onSortClick: function () {
      if (this.options.thumbnailView.currentItemView &&
          this.options.thumbnailView.currentItemView.overviewPopoverOpened) {
        this.options.thumbnailView.currentItemView.overview.currentView._closePopover();
      } else if (this.options.thumbnailView.currentItemView &&
                 this.options.thumbnailView.currentItemView.favoritePopoverOpened) {
        this.options.thumbnailView.currentItemView.favorite.currentView.favStarView.closePopover();
      }
    },

    sortmenurender: function (name) {
      this.options.thumbnailView.resultsView.render();
      this.sortRegion.$el.find('button.binf-dropdown-toggle').trigger('focus');
      if (this._isRendered && this.options.thumbnailView.options.allSelectedNodes.length === 0 &&
          this.options.thumbnailView.resultsView.$el.find('.csui-checkbox')) {
        this.options.thumbnailView.resultsView.$el.find('.csui-checkbox').removeClass(
            'csui-checkbox');
      }
      if (this.options.thumbnailView &&
          this.options.thumbnailView.options.selectThumbnails === "single") {
        this.options.thumbnailView.$el.find(".csui-thumbnail-select").addClass(
            'csui-single-checkbox');
      }
    },

    thumbnailItemClicked: function () {
      var selection = this.collection.filter(function (model) {
        return model.get(SelectContentView.isSelectedModelAttributeName);
      });
      var all = selection.length === this.collection.length;
      if (selection.length > 0 && !all) {
        this.$el.find('.csui-selected-checkbox').addClass('csui-checkbox-atleastone');
      } else {
        this.$el.find('.csui-selected-checkbox').removeClass('csui-checkbox-atleastone');
      }
      this.$(".csui-selectAll-input").prop("checked", all);
    },

    selectAllThumbnails: function (event) {
      var checked = event.target.checked;
      if (this.options.thumbnailView.activeInlineForm) {
        this.options.thumbnailView.$el.find(".csui-thumbnail-item-form").removeClass(
            'csui-thumbnail-item-form');
        this.options.thumbnailView.activeInlineForm.model.trigger('sync');
        this.options.thumbnailView.cancelAnyExistingInlineForm();
        if (this.collection.length > 0) {
          event.target.checked = checked;
        }
      }
      this.$el.find('.csui-checkbox-atleastone').removeClass('csui-checkbox-atleastone');
      this.trigger('selectOrUnselect.all', event.target.checked);
      if (this.collection.where({csuiIsSelected: true}).length > 0) {
        this.trigger('selectOrUnselect.mixed');
      }
      if (this.options.thumbnailView &&
          this.options.thumbnailView.options.allSelectedNodes.length === 0) {
        this.options.thumbnailView.$el.find(".csui-thumbnail-select").removeClass('csui-checkbox');
      }
    },

    onRender: function (e) {
      var event         = e || window.event,
          thumbnailView = this.options.thumbnailView;
      this.focusIndex = 0;
      var length = thumbnailView.$el.find('.csui-thumbnail-item-selected').length;
      if (this.collection.where({csuiIsSelected: true}).length > 0) {
        this.trigger('selectOrUnselect.mixed');
      } else if (length > 0) {
        thumbnailView.$el.find('.csui-checkbox').removeClass();
        this.trigger('selectOrUnselect.all', event.target && event.target.checked);
      } else if (length === 0) {
        var selectedNodes = thumbnailView.getSelectedChildren();
        selectedNodes = thumbnailView.options.allSelectedNodes &&
                        thumbnailView.options.allSelectedNodes.models ||
                        selectedNodes;
        thumbnailView.options.allSelectedNodes &&
        thumbnailView.options.allSelectedNodes.reset(selectedNodes);
      }
      var sortView = new SortView({
        collection: this.collection,
        resultView: this
      });
      this.sortRegion.show(sortView);
      this.listenTo(sortView, 'render:sortmenu', this.sortmenurender);
      this.ensureAllSearchBox();
      this.currentlyFocusedElement();
    },

    updateTotalCount: function () {
      var itemCount = base.formatMessage(this.collection.length, lang);
      this.$el.find('.csui-thumbnail-itemcount').html(itemCount);
    },

    currentlyFocusedElement: function (event) {
      var focusables = this.$el.find('*[tabindex=-1]');
      if (focusables.length) {
        focusables.prop('tabindex', 0);
      }
    },
    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {  // space or
        if ($(event.target).hasClass('csui-selectAll-input')) {
          event.preventDefault();
          event.stopPropagation();
          if (base.isFirefox()) {
            if (event.keyCode === 32) {
              return false;
            }
          }
          $(event.target).trigger('click');
        }
        if ($(event.target).hasClass('csui-thumbnail-column-search')) {
          event.preventDefault();
          event.stopPropagation();
          this.searchBoxes.showSearchInput(event);
        }
      }
    },
    getName : function() {
      var columnname = this.options.thumbnailView && this.options.thumbnailView.options &&
                       this.options.thumbnailView.options.allColumns.find(function (column) {
                         return column.name === 'name';
                       });
      return columnname.name;
    },

    ensureAllSearchBox: function () {
      var self          = this,
          thumbnailView = this.options.thumbnailView,
          searchWrapper = this.$el.find('.csui-thumbnail-column-search'),
          sortWrapper   = this.$el.find('.csui-sorting-container'),
          searchColumn  = thumbnailView.options.columns.where({isNaming: true}),         
           columnName    = searchColumn[0] ? searchColumn[0].get("key") : this.getName();          
      if ($(this).find('.csui-thumbnail-column-search').length === 0) {
        var searchbox = new SearchBoxView(self.collection.filters[columnName], {
          column: columnName,
          columnTitle: lang.name
        });
        self.searchBoxes = searchbox;
        searchbox.on('change:filterValue', function (data) {
          self.applyFilter(data);
        });
        searchbox.on('opened', function () {
          sortWrapper.find('.csui-search-sort-options').removeClass('binf-open');
          sortWrapper.addClass('binf-hidden');
          self.searchColumn = columnName;
        });
        searchbox.on('closed', function () {
          sortWrapper.removeClass('binf-hidden');
          self.collection.filters[columnName] = undefined;
        });
        this.searchRegion.show(self.searchBoxes);
        if (columnName === self.searchColumn && !self.options.thumbnailView.activeInlineForm) {
          searchbox.setFocus();
        }
        searchWrapper = $(this).find('.csui-table-column-search');
        if (searchWrapper) {
          searchWrapper.attr('aria-label',
              _.str.sformat(lang.searchIconTooltip, lang.name));
        }
      }
    },
    applyFilter: function (data) {
      var filterObj = {};
      filterObj[data.column] = data.keywords;
      if (this.collection.fetching) {
        this.filterValuePending = filterObj;
      } else {
        this.collection.resetLimit(false);
        this.collection.setFilter(filterObj);
        this.options.thumbnailView &&
        this.options.enableViewState &&
        this.options.thumbnailView.setViewStateFilter(this.collection.getFilterAsString());
      }
    }
  });

  var ThumbnailView = Marionette.LayoutView.extend({

    className: 'csui-thumbnail-container',
    template: thumbnailTemplate,
    regions: {
      headerRegion: '#csui-thumbnail-header',
      resultsRegion: '#csui-thumbnail-results'
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.csui-thumbnail-results',
        suppressScrollX: true,
        scrollYMarginOffset: 15
      },
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    constructor: function ThumbnailView(options) {
      options || (options = {});
      this._allSelectedNodes = options.allSelectedNodes ||
                               (this._allSelectedNodes = new Backbone.Collection());
      this.options = options;
      var defaultOptions = {
        selectThumbnails: "multiple"
      };
      _.defaults(this.options, defaultOptions);
      if (options.actionItems && options.commands) {
        this.defaultActionController = new DefaultActionController({
          actionItems: options.actionItems,
          commands: options.commands
        });
        this.checkModelHasAction = this.defaultActionController.hasAction.bind(
            this.defaultActionController);
      } else {
        this.checkModelHasAction = function () {
          return true;
        };
      }
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.context = options.context;
      this.collection = options.collection;
      var checkSelection = this.collection.where({csuiIsSelected: true});
      this.collection.itemchecked = false;
      if (checkSelection.length > 0) {
        this.collection.itemchecked = true;
      }
      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }
      this.listenTo(this.collection, "update", this._handleModelsUpdate);
      this.listenTo(this.collection, "change", this.updateRow);

      if (this.context) {
        this.listenTo(this.context, 'request', this._handleContextRequest)
            .listenTo(this.context, 'sync error', this._handleContextFinish)
            .listenTo(this.context, 'sync', this._handleContextSync);
      }

      if (this.collection.node) {
        this.listenTo(this.collection.node, "change:id", this._clearSearchBoxes);
      }

      this.listenTo(this.collection, "request", this.blockActions)
          .listenTo(this.collection, "sync", _.bind(function() {
            this.triggerMethod('update:scrollbar');
            this.unblockActions();
          },this))
          .listenTo(this.collection, "destroy", this.unblockActions)
          .listenTo(this.collection, "error", this.unblockActions);

      this._ViewCollection = Backbone.Collection.extend({
        model: this.collection.model
      });
      this.selectedChildren = new this._ViewCollection();
      var self = this;
      this.el.addEventListener('scroll', function () {
        self.trigger('scroll');
      }, true);
      this.listenTo(this.collection, "reset", this._updateSelectedChildren);
      this.listenTo(this.collection, "remove", this._updateSelectedChildren);
      this.listenTo(this.collection, "new:page", this.resetScrollToTop);
      this.listenTo(this.collection, "reset", function () {
        if (!this._isRendered) {
          return;
        }
        this.resetScrollToTop();  // reset scroll when navigating from breadcrumb
        if (this.thumbnailHeaderView && this.collection.filters && this.collection.filters.name) {
          this.thumbnailHeaderView.updateTotalCount();
          if (this.collection.length > 0) {
            this.thumbnailHeaderView.ui.selectAll.removeAttr("disabled");
          } else {
            this.thumbnailHeaderView.ui.selectAll.attr("disabled", "true");
          }
        } else {
          this.thumbnailHeaderView.render();
        }
      });
       this.listenTo(this, 'dom:refresh', this._adjustThumbnailWidth)
           .listenTo(this.collection, 'filter:change', this._collectionFilterChanged);
    },

    closeInlineForm: function () {
      var thumbnailView             = this.thumbnail ? this.thumbnail : this,
          isLocallyCreated          = thumbnailView.activeInlineForm &&
                                      thumbnailView.activeInlineForm.model.isLocallyCreated,
          inlineFormParentContanier = thumbnailView.activeInlineForm &&
                                      thumbnailView.activeInlineForm.$el.parents(
                                          ".csui-thumbnail-item");
      if (thumbnailView.activeInlineForm && (!isLocallyCreated ||
                                             (isLocallyCreated &&
                                              thumbnailView.activeInlineForm.model.fetched))) {
        if (thumbnailView.activeInlineForm.model.get('type') === 140) {
          thumbnailView.$el.find('.csui-new-thumbnail-item').removeClass('csui-new-thumbnail-item');
        }
        thumbnailView.lockedForOtherContols = false;
        delete thumbnailView.activeInlineForm.model.inlineFormView;
        thumbnailView.activeInlineForm.model.trigger('sync');
        delete thumbnailView.activeInlineForm;
        thumbnailView.$el.find('.csui-thumbnail-item-form').removeClass('csui-thumbnail-item-form');
        thumbnailView.cancelAnyExistingInlineForm({silent: true}, inlineFormParentContanier);
      }
    },

    _collectionFilterChanged: function () {
      this.options.enableViewState && this.setViewStateFilter(this.collection.getFilterAsString());
    },

    _updateSelectedChildren: function () {
      if (!this._isRendered) {
        return;
      }
      if (this.options.selectedChildren &&
          this.options.selectedChildren.enableNonPromotedCommands) {
        this.showToolBarActions();
      }
    },

    _handleContextRequest: function () {
      this._fetchingContext = true;
      this._columnsReset = false;
      this._collectionReset = false;
    },

    _handleContextSync: function () {
      if (!this._isRendered) {
        return;
      }
      if (this._columnsReset) {
        this.rebuild();
      } else if (this._collectionReset) {
        this.render();
      }
    },

    _handleContextFinish: function () {
      this._fetchingContext = false;
    },

    resetScrollToTop: function () {
      if (this._isRendered && this.resultsRegion) {
        this.resultsRegion.$el.scrollTop(0);
      }
    },

    onDestroy: function () {
      if (this._originalScope) {
        this.options.collection.setResourceScope(this._originalScope);
      }
    },

    _handleModelsUpdate: function (collection, options) {
      if (!this._isRendered) {
        return;
      }
      var models = options.changes.added,
          self   = this;
      if (models.length > 0) {
        _.each(models, function (model) {
          model.unset(SelectContentView.isSelectedModelAttributeName);
        });
        this.triggerMethod('before:render', this);
        var nodeModel = null;
        _.each(models, function (model) {
          nodeModel = model;
        });
        if (nodeModel.inlineFormView) {
          if (self.activeInlineForm) {
            self.activeInlineForm.destroy();
          }
          self.activeInlineForm = new nodeModel.inlineFormView({
            model: nodeModel,
            originatingView: self.options.originatingView,
            context: self.context
          });
          var className = '.csui-thumbnail-name-' + nodeModel.cid;
          var divForInlineForm = this.$el.find(className);
          self.activeInlineForm.listenTo(self.activeInlineForm, 'destroy', function () {
            self.lockedForOtherContols = false;
            delete self.activeInlineForm;
          });
          var inlineFormRegion = new Marionette.Region({el: divForInlineForm});
          inlineFormRegion.show(self.activeInlineForm);
        }
        this.resultsView.showOrHideZeroRecordsMessage();
        this._adjustThumbnailWidth();
        this.trigger('dom:refresh');  // fix for perfect scrollbar on updating collection (adding or removing node)
        _.each(models, function (model) {
          if (model.isLocallyCreated && !model.inlineFormView) {
            self.$el.find(".csui-thumbnail-item-" + model.cid).find(
                ".csui-thumbnail-content-container").addClass("csui-new-item");
          }
        });
      }
      if (this.thumbnailHeaderView) {
        this.thumbnailHeaderView.ui.selectAll.prop('disabled', this.collection.length === 0);
        this.thumbnailHeaderView.updateTotalCount();
      }
    },

    _maintainNodeState: function (model) {
      var nodeModel = model,
          self      = this;
      if (model && !!model.inlineFormView) {
        self.activeInlineForm = new nodeModel.inlineFormView({
          model: nodeModel,
          originatingView: self.options.originatingView,
          context: self.context
        });
        self.$el.find('.csui-thumbnail-item-' + nodeModel.cid).addClass('csui-thumbnail-item-form');
        if ((nodeModel.isLocallyCreated && !nodeModel.fetched) || nodeModel.get('type') === 140) {
          self.$el.find('.csui-thumbnail-item-' + nodeModel.cid).addClass(
              'csui-new-thumbnail-item');
        }

        var className = '.csui-thumbnail-name-' + nodeModel.cid;
        var divForInlineForm = this.$el.find(className);
        var inlineFormRegion = new Marionette.Region({el: divForInlineForm});
        inlineFormRegion.show(self.activeInlineForm);
        return true;
      }
      else {
        return false;
      }
    },

    updateRow: function (collectionOrModel) {
      if (collectionOrModel.isLocallyCreated) {
        this.$el.find(".csui-thumbnail-item-form") &&
        this.$el.find(".csui-thumbnail-item-form").find(
            ".csui-thumbnail-content-container").addClass("csui-new-item");
      }
      this.isSelected = this.collection.where({csuiIsSelected: true}).length > 0;
      if (collectionOrModel.inlineFormView) {
        this.options.originatingView.updateRowIndex = this.collection.indexOf(collectionOrModel);
        var self = this;

        if (self.activeInlineForm && self.activeInlineForm.model !== collectionOrModel) {
          var id                        = self.activeInlineForm.model.cid,
              isLocallyCreated          = self.activeInlineForm.model.isLocallyCreated,
              inlineFormParentContanier = self.activeInlineForm.$el.parents(".csui-thumbnail-item");
          this.$el.find(".csui-thumbnail-item-form").removeClass('csui-thumbnail-item-form');
          this.$el.find(".csui-thumbnail-item-form").removeClass('csui-thumbnail-item-rename-form');
          this.$el.find(".csui-new-thumbnail-item").removeClass('csui-new-thumbnail-item');
          this.activeInlineForm.model.trigger('sync');
          this.cancelAnyExistingInlineForm({silent: true}, inlineFormParentContanier);
          if (isLocallyCreated) {
            this.$el.find('.csui-thumbnail-item-' + id).find(
                '.csui-thumbnail-content-container').addClass('csui-new-item');
          }
        }
        self.activeInlineForm = new collectionOrModel.inlineFormView({
          model: collectionOrModel,
          originatingView: self.options.originatingView,
          context: self.context
        });
        this.$el.find(".csui-thumbnail-item-" + collectionOrModel.cid).addClass(
            "csui-thumbnail-item-rename-form");
        if (collectionOrModel.get('type') === 140) {
          this.$el.find(".csui-thumbnail-item-" + collectionOrModel.cid).addClass(
              'csui-new-thumbnail-item');
        }
        var className = '.csui-thumbnail-name-' + collectionOrModel.cid;
        var divForInlineForm = this.$el.find(className);
        self.activeInlineForm.listenTo(self.activeInlineForm, 'destroy', function () {
          self.lockedForOtherContols = false;
          self.activeInlineForm.model.trigger('sync');
          delete self.activeInlineForm;
          collectionOrModel.renamed = true;
        });
        this.$el.find(".csui-thumbnail-item-" + collectionOrModel.cid).removeClass(
            'csui-thumbnail-item-apply-transition');
        self.$el.find(".csui-thumbnail-item-" + self.activeInlineForm.model.cid).addClass(
            'csui-thumbnail-item-form');
        if (divForInlineForm.length > 0) {
          var inlineFormRegion = new Marionette.Region({el: divForInlineForm});
          inlineFormRegion.show(self.activeInlineForm);
        }

        self.$el.find(".csui-thumbnail-item-" + self.activeInlineForm.model.cid).removeClass(
            'csui-thumbnail-item-rename-form');
        self.$el.find(".csui-thumbnail-item-" + self.activeInlineForm.model.cid).find(
            "div.csui-thumbnail-overview-icon").addClass("binf-hidden");
        if (this.$el.find(".csui-thumbnail-item-form") &&
            this.$el.find(".csui-thumbnail-item-form").find(
                ".csui-thumbnail-content-container .csui-inlineform-error").length > 0) {
          this.$el.find(".csui-thumbnail-item-form").find(
              ".csui-thumbnail-content-container.csui-new-item").addClass("csui-new-item-error");
        }
        if (self.activeInlineForm && divForInlineForm.length > 0) {
          self.activeInlineForm.triggerMethod('dom:refresh', self.activeInlineForm);
        }
      } else {
        this.$el.find(".csui-thumbnail-item-" + collectionOrModel.cid).removeClass(
            'csui-thumbnail-item-form');
        this.$el.find(".csui-thumbnail-item-" + collectionOrModel.cid).addClass(
            'csui-thumbnail-item-apply-transition');

        this.$el.find(".csui-thumbnail-item-" + collectionOrModel.cid).removeClass(
            'csui-new-thumbnail-item');
        if (this.activeInlineForm && this.activeInlineForm.model.cid === collectionOrModel.cid) {
          this.activeInlineForm.model.trigger('sync');
          this.cancelAnyExistingInlineForm({silent: true});
          collectionOrModel.renamed = true;
        }
        if (this.collection && this.collection.filters.name &&
            this.thumbnailHeaderView.searchBoxes) {
          this.thumbnailHeaderView.searchBoxes.setFocus();
        }
        if (this.$el.find(
                ".csui-thumbnail-content-container.csui-new-item.csui-new-item-error").length > 0) {
          this.$el.find(
              ".csui-thumbnail-content-container.csui-new-item.csui-new-item-error").removeClass(
              "csui-new-item-error");
        }
        var that = this;
        setTimeout(function () {
          that._updateSelectedChildren(collectionOrModel);
          if (collectionOrModel.isLocallyCreated || collectionOrModel.renamed &&
                                                    that.$el.find(".csui-thumbnail-item-" +
                                                                  collectionOrModel.cid)) {
            base.applyEllipsis(that.$el.find(".csui-thumbnail-item-" + collectionOrModel.cid).find(
                ".csui-thumbnail-name-justify-div"), 2);
          }
          if (that.options.selectThumbnails === "single") {
            that.$el.find(".csui-thumbnail-select").addClass('csui-single-checkbox');
          }
        }, 0);
      }
    },

    onAfterShow: function () {
      this.thumbnailHeaderView.searchBoxes.setFocus();
    },

    onShow: function () {
      this.isShown = true;
    },

    _adjustThumbnailWidth: function () {
      var thumbnailViewItem             = this.$el.find('.csui-thumbnail-item'),
          thumbnailViewItemWidth        = 190, //min, max width
          parentWidth                   = $('.csui-table-facetview .csui-facet-panel').length > 0 ?
                                          $('.csui-facet-table-container').width() -
                                          $('.csui-table-facetview').width() :
                                          $('.cs-thumbnail-wrapper').width(),
          spaceBetweenItems             = 2,
          thumbnailViewItemWidthPercent = thumbnailViewItemWidth / parentWidth * 100;
      for (var i = 1; i <= thumbnailViewItem.length; i++) {
        var thumbnailViewItemTotalWidth = i * thumbnailViewItemWidthPercent;
        if (thumbnailViewItemTotalWidth > 100) {
          i = i - 1;
          thumbnailViewItemWidthPercent = 100 / i;
          break;
        }
      }
      thumbnailViewItem.css({
        'maxWidth': "calc(" + thumbnailViewItemWidthPercent + '% - ' + spaceBetweenItems * 2 +
                    "px)",
        'minWidth': "calc(" + thumbnailViewItemWidthPercent + '% - ' + spaceBetweenItems * 2 +
                    "px)"
      });
      var names = this.$el.find('.csui-thumbnail-item') &&
                    this.$el.find('.csui-thumbnail-item').find('.csui-thumbnail-name-justify-div');
      if (names && names.length > 0) {
        _.each(names, function (name) {
          base.applyEllipsis(name, 2);
        }, this);
      }
    },

    cancelAnyExistingInlineForm: function (options, parentContanier) {
      if (this.activeInlineForm) {
        this.activeInlineForm.cancel(options);
      }
      if (parentContanier && parentContanier.find(".csui-thumbnail-name-justify-div").length) {
        base.applyEllipsis(parentContanier.find(".csui-thumbnail-name-justify-div"), 2);
      }
    },

    startCreateNewModel: function (newNode, inlineFormView) {
      this.cancelAnyExistingInlineForm();
      if (this.collection && this.collection.node) {
        newNode.set("parent_id", this.collection.node.get('id'));
        newNode.isLocallyCreated = true;
        newNode.inlineFormView = inlineFormView;
        this.collection.add(newNode, {at: 0});
        this._adjustThumbnailWidth();
        this.$(this.$el.find('.csui-thumbnail-item')[0]).addClass('csui-new-thumbnail-item');
      }
    },

    _clearSearchBoxes: function () {
      if (!this._isRendered) {
        return;
      }
      _.each(this.searchBoxes, function (sb) {
        sb.hideAndClear();
      });
    },

    onRender: function () {
      this.thumbnailHeaderView = new ThumbnailHeaderView({
        columns: this.options.displayedColumns,
        context: this.context,
        columnsWithSearch: this.options.columnsWithSearch,
        filterBy: this.options.filterBy,
        collection: this.options.collection,
        thumbnailView: this,
        allColumns: this.options.allColumns,
        enableViewState: this.options.enableViewState
      });
      this.headerRegion.show(this.thumbnailHeaderView);
      var self = this;
      this.updateCollectionParameters();

      this.listenTo(this.thumbnailHeaderView, 'selectOrUnselect.all', function (isSelectAll) {
        if (isSelectAll) {
          if (self.collection.models.length > 0) {
            _.each(self.collection.models, function (model) {
              model.set(SelectContentView.isSelectedModelAttributeName, true);
              model.attributes.selectAllThumbnailsEnabled = true;
              model.attributes.isSelected = true;
            });
          }
          self.$el.find(".csui-thumbnail-results .csui-thumbnail-select").addClass('csui-checkbox');
          self.$el.find(".csui-thumbnail-results .csui-thumbnail-item").addClass(
              'csui-thumbnail-item-selected');
        } else {
          if (self.collection.models.length > 0) {
            _.each(self.collection.models, function (model) {
              model.set(SelectContentView.isSelectedModelAttributeName, false);
              model.attributes.selectAllThumbnailsEnabled = false;
              model.attributes.isSelected = false;
            });
            if (self._allSelectedNodes.length === 0) {
              self.$el.find(".csui-thumbnail-select").removeClass('csui-checkbox');
            }
            self.$el.find(".csui-thumbnail-results .csui-thumbnail-item").removeClass(
                'csui-thumbnail-item-selected');
          }
        }
        self.showToolBarActions();
      });
      self.listenTo(self, "thumbnailRowRendered", function (itemView) {
        self.trigger("thumbnailItemRendered", {
          sender: self, target: itemView.target, node: itemView.node
        });
      });
      var thumbnailContentColumns = [];
      if (this.options.tableColumns) {
        thumbnailContentColumns = this.options.tableColumns.deepClone();
        var namingKey,
            namingKeyModel = _.filter(this.options.columns.models,
                function (model) { return model.get("isNaming");});
        namingKey = namingKeyModel[0].get("column_key");

        var thumbnailContentColumnsHasNamingKey = _.filter(thumbnailContentColumns.models,
            function (model) {
              return model.get("key") === namingKey;
            });
        if (thumbnailContentColumnsHasNamingKey.length > 0 &&
            thumbnailContentColumnsHasNamingKey[0].get("key") !== "name") {
          thumbnailContentColumnsHasNamingKey[0].attributes.isNaming = true;
          thumbnailContentColumns.remove(
              thumbnailContentColumns.findWhere({key: 'name'}));
        } else if (!thumbnailContentColumnsHasNamingKey.length) {
          thumbnailContentColumns.remove(
              thumbnailContentColumns.findWhere({key: 'name'}));
          thumbnailContentColumns.add({
            key: namingKey,
            sequence: 4
          });
        }
      }
      this.resultsView = new ThumbnailListView({
        context: this.options.context,
        collection: this.options.collection,
        thumbnailView: this,
        originatingView: this.options.originatingView,
        inlineBar: this.options.inlineBar,
        thumbnailHeaderView: this.thumbnailHeaderView,
        tableColumns: this.options.tableColumns,
        columns: this.options.columns,
        thumbnailContent: this.options.thumbnailContent || thumbnailContentColumns
      });
      this.showToolBarActions();
      this.resultsRegion.show(this.resultsView);
      this.listenTo(this.context, "maximize:widget", this._adjustThumbnailWidth);
      this.listenTo(this.context, "restore:widget:size", this._adjustThumbnailWidth);
    },
    updateCollectionParameters: function () {
      var collection = this.options.collection,
          context = this.options.context,
          supportsFields = collection.makeFieldsV2,
          supportsExpand = collection.makeExpandableV2,
          fields = {},
          expands = {};

      if (!this.options.collection.setFields) {
        return;
      }
      if ((supportsFields || supportsExpand) &&
          collection.getResourceScope && collection.setResourceScope) {
        if (this._originalCollectionScope) {
          collection.setResourceScope(this._originalCollectionScope);
        } else {
          this._originalCollectionScope = collection.getResourceScope();
        }
      }
      _.each(this.options.allColumns, function (column) {
        var ColumnView = column.CellView;
        if (ColumnView) {
          if (supportsFields && ColumnView.getModelFields) {
            var field = ColumnView.getModelFields({
              collection: collection,
              context: context,
              column: column
            });
            if (field) {
              FieldsV2Mixin.mergePropertyParameters(fields, field);
            }
          }
          if (supportsExpand && ColumnView.getModelExpand) {
            var expand = ColumnView.getModelExpand({
              collection: collection,
              context: context,
              column: column
            });
            if (expand) {
              FieldsV2Mixin.mergePropertyParameters(expands, expand);
            }
          }
          if (ColumnView.updateCollectionParameters) {
            ColumnView.updateCollectionParameters({
              collection: collection,
              context: context,
              column: column
            });
          }
        }
      }, this);
      if (!_.isEmpty(fields)) {
        collection.setFields(fields);
      }
      if (!_.isEmpty(expands)) {
        collection.setExpand(expands);
      }
    },

    clearChildrenSelection: function () {
      this.thumbnailHeaderView && this.thumbnailHeaderView.trigger('selectOrUnselect.all', false);
    },

    showToolBarActions: function (e) {
      var selectedNodes = this.getSelectedChildren();
      selectedNodes = this.options.allSelectedNodes && this.options.allSelectedNodes.models ||
                      selectedNodes;
      this.options.allSelectedNodes.reset(selectedNodes);
    },
    getSelectedChildren: function () {
      var self          = this,
          selectedNodes = [];
      this.options.collection.each(function (model) {
        if (!!model.get('csuiIsSelected')) {
          selectedNodes.push(model);
        }
      });
      return selectedNodes;
    }
  });
  _.extend(ThumbnailItemView.prototype, LayoutViewEventsPropagationMixin);
  _.extend(ThumbnailListView.prototype, ViewEventsPropagationMixin);
  _.extend(ThumbnailView.prototype, LayoutViewEventsPropagationMixin);
  _.extend(ThumbnailView.prototype, NodeViewStateMixin);

  return ThumbnailView;
});
