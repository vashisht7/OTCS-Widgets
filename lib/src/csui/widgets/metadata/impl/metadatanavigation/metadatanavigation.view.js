/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/widgets/metadata/impl/metadata.navigation.list.behavior',
  'csui/widgets/metadata/impl/metadata.navigation.list.view',
  'csui/widgets/metadata/metadata.view',
  'csui/controls/progressblocker/blocker',
  'hbs!csui/widgets/metadata/impl/metadatanavigation/impl/metadatanavigation',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/mixins/view.state/metadata.view.state.mixin',
  'csui/utils/contexts/factories/next.node',
  'i18n!csui/widgets/metadata/impl/metadatanavigation/impl/nls/lang',
  'css!csui/widgets/metadata/impl/metadatanavigation/impl/metadatanavigation'
], function (_, Backbone, Marionette, TabableRegionBehavior, MetadataNavigationListBehavior,
 MetadataNavigationListView, MetadataView, BlockingView, template, LayoutViewEventsPropagationMixin,
 MetadataViewStateMixin,
 NextNodeModelFactory, lang) {
  'use strict';
  var MetadataNavigationView = Marionette.LayoutView.extend({
    className: 'cs-metadata',
    template: template,

    regions: {
      navigationRegion: ".metadata-sidebar",
      contentRegion: ".metadata-content"
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      },
      MetadataNavigationListBehavior: {
        behaviorClass: MetadataNavigationListBehavior
      }
    },

    constructor: function MetadataNavigationView(options) {
      options || (options = {});
      BlockingView.imbue(this);
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

      this._addUrlParametersSupport(options.context);

      this.collection = options.collection;
      this.container = options.container;
      this.containerCollection = options.containerCollection;
      this.context = options.context;
      this.originatingView = options.originatingView;
      this.showCloseIcon = options.showCloseIcon;
      this.initiallySelected = this.options.selected;
      this.selectedTab = options.selectedTab || this.getViewStateDropdown();
      this.selectedProperty = options.selectedProperty || this.getViewStateSelectedProperty();
      this.isThumbnailView = options.isThumbnailView || this.getThumbnailViewState();
      this.showPermissionView = options.showPermissionView;
      this.thumbnailViewState = options.originatingView &&
                                options.originatingView.thumbnailViewState;
      this.collection.inMetadataNavigationView = options.originatingView &&
                                                 options.originatingView.isTabularView;
      this.disableViewState = options.disableViewState;
      if (!this.options.toolbarItems && this.originatingView && this.originatingView.options &&
          this.originatingView.options.toolbarItems) {
        this.options.toolbarItems = this.originatingView.options.toolbarItems;
      }

      var initiallySelectedModel = this._getInitiallySelectedModel();

      this.mdv = (this.options.data && this.options.data.contentView) ?
                 this.options.data.contentView :
                 new MetadataView({
                   model: initiallySelectedModel,
                   container: this.container,
                   containerCollection: this.containerCollection,
                   collection: this.collection,
                   context: this.context,
                   originatingView: this,
                   metadataNavigationView: this,
                   isExpandedView: !!this.options.isExpandedView,
                   showCloseIcon: this.showCloseIcon === undefined ? false : this.showCloseIcon,
                   selectedTab: this.selectedTab,
                   selectedProperty: this.selectedProperty,
                   showPermissionView: this.showPermissionView,
                   disableViewState: this.options.disableViewState
                 });
      if (!this.options.data || !this.options.data.contentView) {
        this.mdv.internal = true;
      }

      this._subscribeToMetadataViewEvents();

      this.mdn = new MetadataNavigationListView({
        collection: options.collection,
        containerCollection: this.containerCollection,
        data: {
          back_button: (this.originatingView || this.containerCollection) ? true : false,
          title: this._getBackButtonTitle(options),
          nameAttribute: options.nameAttribute
        },
        originatingView: options.originatingView,
        isThumbnailView: this.isThumbnailView
      });
      this.listenTo(this.mdn, 'click:item', this.onClickItem);
      this.listenTo(this.mdn, 'click:back', this.onClickBack);
      this.listenTo(this.mdn, 'show:node', function (args) {
        this._showNode(args.model);
      });
      this.listenTo(this.mdv, 'disable:active:item', function (args) {
        this.mdn.$el.find('.binf-active').addClass('active-item-disable');
      }).listenTo(this.mdv, 'enable:active:item', function () {
        this.mdn.$el.find('.active-item-disable').removeClass('active-item-disable');
      });

      if (this.options.originatingView &&
          (!_.isFunction(this.options.originatingView.cascadeDestroy) ||
           this.options.originatingView.cascadeDestroy())) {
        this.listenTo(this.options.originatingView, 'before:destroy', function () {
          this._closeMetadata();
        });
      }

      this.propagateEventsToRegions();
      if (this.showPermissionView) {
        this.disableViewState = true;
      }

      if (this._isViewStateModelEnabled()) {
        this.listenTo(this.model, 'change:id', this._modelIdChanged);
      }
    },

    _getBackButtonTitle: function (options) {
      var title = options.container ? options.container.get('name') : '';
      if (!title && options.collection.length > 0 &&
          !!options.collection.models[0].collection.title) {
        title = options.collection.models[0].collection.title;
      }
      if (Object.getPrototypeOf(options.collection).constructor.name === 'NodeVersionCollection') {
        title = lang.versionsTitle;
      }
      if (!title) {
        var viewStateMode = options.context && options.context.viewStateModel;
        if (viewStateMode) {
          var metadataContainer = viewStateMode.get('metadata_container');
          if (metadataContainer) {
            title = metadataContainer.name;
          }
        }

      }
      return title;
    },

    _isViewStateModelEnabled: function () {
      var viewStateModel = this.context && this.context.viewStateModel;
      return !this.disableViewState && viewStateModel && viewStateModel.get('enabled');
    },

    _getInitiallySelectedModel: function () {
      if (this.initiallySelected instanceof Backbone.Model) {
        var index = this.collection.findIndex({id: this.initiallySelected.get('id')});
        if (index < 0 || index > this.collection.length - 1) { return null; }
        return this.collection.at(index);
      } else if (this.initiallySelected && this.initiallySelected.length > 0) {
        return this.initiallySelected.models[0];
      } else if (this.collection && this.collection.length > 0) {
        return this.collection.models[0];
      } else {
        return null;
      }
    },

    onClickItem: function (item) {
      if (this._isViewStateModelEnabled() && this.getViewStateId() !== item.model.get('id')) {
        this.setViewStateId(item.model.get('id'), {model: item.model});
      } else {
        this._showNode(item.model);
      }
    },

    onClickBack: function () {
      this._closeMetadata();
    },

    onItemNameChanged: function (newName) {
      var selectedItem  = this.mdn.getSelectedItem(),
          selectedIndex = this.mdn.getSelectedIndex();

      selectedItem.render(); // name has been set silently
      this.mdn.setSelectedIndex(selectedIndex);
    },

    _moveToNextItemAfterDeleteOrMove: function () {
      if (this.mdn.collection.length === 0) {
        this._closeMetadata();
      } else {
        var nextIndex = this.indexOfItemDeleteOrMove;
        nextIndex === this.mdn.collection.length && (nextIndex--);
        this.mdn.selectAt(nextIndex);
      }
    },

    onItemBeforeDelete: function (args) {
      this.indexOfItemDeleteOrMove = this.mdn.getSelectedIndex();
    },

    onItemDeleted: function (args) {
      this._moveToNextItemAfterDeleteOrMove();
    },

    onItemBeforeMove: function (args) {
      this.indexOfItemDeleteOrMove = this.mdn.getSelectedIndex();
      this.listenToOnce(this.containerCollection, 'remove', _.bind(this.onItemMoved, this));
    },

    onItemMoved: function (removedNode) {
      this.mdn.collection.remove(removedNode);
      this._moveToNextItemAfterDeleteOrMove();
    },

    _showNode: function (model) {
      var selectedTab = this.getViewStateDropdown() || (
           this.mdv.metadataTabView.tabLinks ?
           this.mdv.metadataTabView.tabLinks.selected :
           this.mdv.options.selectedTab ? this.mdv.options.selectedTab : ""),
          activeTab   = this.mdv.metadataTabView.options.activeTab ?
                        this.mdv.metadataTabView.options.activeTab :
                        this.mdv.options.activeTab ? this.mdv.options.activeTab : "";
      if (this.mdv && this.mdv.internal) {
        this.mdv.destroy();
      }

      this.mdv = new MetadataView({
        model: model,
        container: this.container,
        containerCollection: this.containerCollection,
        collection: this.collection,
        context: this.context,
        originatingView: this,
        metadataNavigationView: this,
        showCloseIcon: this.showCloseIcon === undefined ? false : this.showCloseIcon,
        activeTab: activeTab,
        selectedTab: selectedTab,
        showPermissionView: this.showPermissionView
      });
      this.mdv.internal = true;

      this._subscribeToMetadataViewEvents();
      this.contentRegion.show(this.mdv);
    },

    _modelIdChanged: function () {
      var id = this.model.get('id');
      if (id) {
        this.setSelectedElementByModelId(id);
      }
    },

    setSelectedElementByModelId: function (id) {
      var element = this.getItemByModelId(id);
      if (element) {
        this.mdn.setSelectedElement(element);
        this._showNode(element.model);
      }
    },

    getItemByModelId: function (id) {
      var view;
      this.mdn.children.some(function (element) {
        if (element.model.get('id') === id) {
          view = element;
          return true;
        }
      });
      return view;
    },

    onMetadataClose: function () {
      this._closeMetadata();
    },

    onDestroy: function () {
      if (this.thumbnailViewState) {
        this.originatingView.thumbnail &&
        this.originatingView.thumbnail.resultsView.triggerMethod('metadata:close');
      }
    },

    _closeMetadata: function () {
      this.trigger('metadata:close', {sender: this});

      if (!this.originatingView) {
        if (this._isViewStateModelEnabled() && !this.showPermissionView) {
          this.context.viewStateModel.restoreLastRouter();
        } else {
          var id = this._getCommonContainerId();
          if (id) {
            this._setNextNodeModelFactory(id);
          }
        }
      }
    },

    _getCommonContainerId: function () {
      var id;
      if (this.containerCollection) {
        if (this.containerCollection.node) {
          id = this.containerCollection.node.get('id');
        } else if (this.containerCollection.models.length > 0) {
          id = this.containerCollection.models[0].get('parent_id');
          this.containerCollection.models.some(function (model) {
            if (model.get('parent_id') !== id) {
              id = undefined;
              return true;
            }
          });
        }
      }
      return id;
    },

    _setNextNodeModelFactory: function (id) {
      if (this.context && id !== undefined) {
        var nextNode = this.context.getModel(NextNodeModelFactory);
        if (nextNode) {
          if (nextNode.get('id') === id) {
            nextNode.unset('id', {silent: true});
          }
          nextNode.set('id', id);
        }
      }
    },

    _subscribeToMetadataViewEvents: function () {
      this.listenTo(this.mdv, 'metadata:close', _.bind(function () {
        this._closeMetadata();
      }, this));
      this.listenTo(this.mdv, 'metadata:close:without:animation', _.bind(function () {
        this.trigger('metadata:close:without:animation', {sender: this});
      }, this));
      this.listenTo(this.mdv, 'item:name:changed', _.bind(this.onItemNameChanged, this));
      this.listenTo(this.mdv, 'metadata:item:before:delete', _.bind(function (args) {
        this.onItemBeforeDelete(args);
      }, this));
      this.listenTo(this.mdv, 'metadata:item:deleted', _.bind(function (args) {
        this.onItemDeleted(args);
      }, this));
      this.listenTo(this.mdv, 'metadata:item:before:move', _.bind(function (args) {
        this.onItemBeforeMove(args);
      }, this));
    },

    _addUrlParametersSupport: function (context) {
      var viewStateModel = context && context.viewStateModel;
      viewStateModel && viewStateModel.addUrlParameters(['dropdown'], context);
    }

  });

  _.extend(MetadataNavigationView.prototype, LayoutViewEventsPropagationMixin);
  _.extend(MetadataNavigationView.prototype, MetadataViewStateMixin);

  return MetadataNavigationView;
});
