/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/widgets/shortcuts/impl/shortcut/shortcut.view',
  'csui/widgets/shortcuts/impl/shortcut/editable.shortcut.view',
  'csui/utils/contexts/factories/node',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/utils/perspective/perspective.util',
  'i18n!csui/widgets/shortcuts/impl/nls/lang',
  "css!csui/widgets/shortcuts/impl/shortcuts"
], function (_,
    $,
    Backbone,
    Marionette,
    TabableRegionBehavior,
    MiniShortcutView,
    EditableShortcutView,
    NodeModelFactory,
    ViewEventsPropagationMixin,
    PerspectiveUtil,
    lang) {

  'use strict';

  var THEME_SUFFIX = ["shade1", "shade2", "shade3", "shade4"];

  var ShortcutModel = Backbone.Model.extend({
    idAttribute: 'shortcutItemId',

    isAddShortcut: function () {
      return this.get('isAddNew') === true;
    }
  });

  var ShortcutsCollection = Backbone.Collection.extend({

    constructor: function (models, options) {
      options || (options = {});
      _.defaults(options, {
        model: ShortcutModel,
        comparator: function (a, b) {
          if (b.get('isAddNew')) {
            return -1;
          }
          return 0;
        }
      });
      this.options = options;
      Backbone.Collection.prototype.constructor.call(this, models, options);
    },

    getShortcuts: function () {
      return this.filter(function (model) {
        return !model.isAddShortcut();
      });
    },

    evaluateAddNewExistence: function () {
      var widgetId = this.options[PerspectiveUtil.KEY_WIDGET_ID];
      if (this.options.perspectiveMode === PerspectiveUtil.MODE_PERSONALIZE &&
          (widgetId && !PerspectiveUtil.isPersonalWidgetId(widgetId))) {
        return;
      }
      var newItem = this.where(function (model) {
        return model.isAddShortcut();
      });
      if (this.length < 4 && newItem.length === 0) {
        this.add({
          id: '',
          isAddNew: true,
          icon: 'icon-new',
          displayName: ''
        });
        return true;
      } else if (this.length > 4 && newItem.length > 0) {
        this.remove(newItem);
        return true;
      }
      return false;
    }
  });
  var ShortcutsView = Marionette.CollectionView.extend({

    constructor: function ShortcutsView(options) {
      options || (options = {});
      options.data || (options.data = {});
      options = _.defaults(options, {
        reorderOnSort: true,
        widgetContainer: this
      });
      options.data = this._normalizeData(options.data);

      options.collection = options.collection || new ShortcutsCollection([],
          _.pick(options, 'perspectiveMode', PerspectiveUtil.KEY_WIDGET_ID));
      Marionette.CollectionView.prototype.constructor.call(this, options);
    },

    tagName: 'div',

    className: "csui-shortcut-container tile csui-shortcut-group-container",

    attributes: {
      role: 'navigation',
      "aria-label": lang.groupAria
    },

    regions: {
      "shortcut0": ".shortcut-region-0",
      "shortcut1": ".shortcut-region-1",
      "shortcut2": ".shortcut-region-2",
      "shortcut3": ".shortcut-region-3"
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    events: function () {
      var evts = {
        "keydown": "onKeyInView"
      };

      if (this._isInlineEditMode()) {
        evts = _.extend(evts, {
          "drop": "onDrop",
          "dragover": "onDragOver",
          "dragenter": "onDragEnter"
        });
      }

      return evts;
    },

    childView: MiniShortcutView,
    childEvents: {
      'change:shortcutTheme': '_onChangeTheme',
      'add:shortcut': '_onAddShortcut',
      'delete:widget': '_onRemoveShortcut',
      'update:widget:options': '_updateShortcutOptions'
    },
    childViewOptions: function (model, index) {
      return {
        context: this.options.context,
        collection: this.options.collection,
        container: this,
        perspectiveMode: this.options.perspectiveMode
      };
    },

    buildChildView: function (child, ChildViewClass, childViewOptions) {
      if (this._isInlineEditMode()) {
        ChildViewClass = EditableShortcutView;
      } else {
        ChildViewClass = MiniShortcutView;
      }
      return Marionette.CollectionView.prototype.buildChildView.call(this, child, ChildViewClass,
          childViewOptions);
    },

    _normalizeData: function (data) {
      data || (data = {shortcutItems: []});
      data.shortcutTheme || (data.shortcutTheme = '');
      return data;
    },

    initialize: function () {
      this.listenTo(this.collection, 'add', this._onCollectionChange)
          .listenTo(this.collection, 'remove', this._onCollectionChange)
          .listenTo(this.collection, 'reset', this._onCollectionChange);

      if (this._isInlineEditMode()) {
        this.listenTo(this.collection, 'add', this._onCollectionInlineAdd)
            .listenTo(this.collection, 'remove', this._onCollectionInlineRemove);
      }

      var shortcutItems = _.map(_.first(this.options.data.shortcutItems || [], 4), _.clone);
      this._fetchModels(shortcutItems).always(_.bind(function () {
        this._setupCollection(shortcutItems);
      }, this));
      this._currentShortcutIndex = 0;
      this.listenTo(this, 'add:child', this.propagateEventsToViews);
    },

    _fetchModels: function (shortcutItems) {
      var seft = this;
      var models = _.map(shortcutItems, function (item) {
        item.id = item.id || item.launchButtonID;
        var model = seft.options.context.getModel(NodeModelFactory, {
          attributes: {
            id: (item.id || item.launchButtonID) || 'volume',
            type: item.type
          }
        });
        MiniShortcutView.prepareModelToFetch(model);
        return model;
      });

      var modelPromises = _.map(models, function (model) {
        return model.fetch({suppressError: true});
      });

      var result = $.whenAll.apply($, modelPromises);
      result.always(function () {
        _.each(shortcutItems, function (item, index) {
          item.node = models[index];
        });
      });
      return result;
    },

    _setupCollection: function (shortcutItems) {
      if (!this._isInlineEditMode()) {
        var validShortcuts = _.filter(shortcutItems, function (item) {
          return !item.node.error;
        });
        if (validShortcuts.length > 0) {
          shortcutItems = validShortcuts;
        } else {
          shortcutItems = _.first(shortcutItems, 1);
        }
      }
      shortcutItems = shortcutItems || [];
      this.collection.reset(shortcutItems);
    },

    _isInlineEditMode: function () {
      return !!this.options.perspectiveMode;
    },

    _onCollectionChange: function () {
      if (this._isInlineEditMode()) {
        this.collection.evaluateAddNewExistence();
      }
      this._updateShortcutStyles();
    },

    _onCollectionInlineAdd: function () {
      this.collection.each(function (model) {
        model.trigger('refresh:mask');
      });
    },

    _onCollectionInlineRemove: function () {
      this.collection.each(function (model) {
        model.trigger('refresh:mask');
      });
    },

    _getLayout: function (size) {
      var layout = "small";
      if (size === 1) {
        layout = "large";
      } else if (size === 2) {
        layout = "medium";
      }
      return layout;
    },

    _getShortcutTheme: function (itemIndex, numberOfItems) {
      var theme = this.options.data.shortcutTheme ? this.options.data.shortcutTheme :
                  "csui-shortcut-theme-grey";
      if (numberOfItems > 1) {
        itemIndex += (4 - numberOfItems);
        theme += "-" + THEME_SUFFIX[itemIndex];
      }

      return theme;
    },

    _updateShortcutOptions: function (shortcutItemView, args) {
      var itemModel = shortcutItemView.model;
      if (itemModel.get('isAddNew')) {
        if (args.softUpdate) {
          return;
        }
        if (!args.isValid || !shortcutItemView.isOptionsValid(args.options)) {
          if (this.options.perspectiveMode === "edit") {
            this._notifyOptionsChange(!shortcutItemView.isShortcutValid(args.options));
          }
          return;
        }
        itemModel.set({'isAddNew': undefined, displayName: undefined, icon: undefined},
            {silent: true, unset: true});
      }
      shortcutItemView.isUpdating = true;
      itemModel.set(args.options);
      this._notifyOptionsChange();
      var isCollChanged = this.collection.evaluateAddNewExistence();
      delete shortcutItemView.isUpdating;
      if (!isCollChanged) {
        this._updateShortcutStyles();
        shortcutItemView.model.trigger('refresh:mask');
      }
    },

    _onRemoveShortcut: function (shortcutItemView) {
      this.collection.remove(shortcutItemView.model);
      var shortcutItems = this.collection.getShortcuts();
      if (shortcutItems.length === 0) {
        this.options.widgetContainer.trigger('remove:widget');
      } else {
        this._notifyOptionsChange();
      }
    },

    _notifyOptionsChange: function (isInvalid) {
      var shortcutItems = this.collection.getShortcuts().map(function (model) {
        return {
          id: model.get('id'),
          type: model.get('type'),
          displayName: model.get('displayName')
        };
      });
      this.options.widgetContainer.trigger('update:widget:options', {
        shortcutTheme: this.collection.first().get('shortcutTheme'),
        shortcutItems: shortcutItems,
        isValid: !isInvalid
      });
    },

    _onChangeTheme: function (childView) {
      this.options.data.shortcutTheme = childView.model.get('shortcutTheme');
      this._updateShortcutStyles();
    },

    _onAddShortcut: function (childView, model) {
      this.collection.add({
        id: '',
        icon: '',
        displayName: '',
        type: 141,
        shortcutTheme: this.options.data.shortcutTheme
      }, {at: this.collection.length - 1});
      this.collection.sort();
      this._notifyOptionsChange();
    },

    _updateShortcutStyles: function () {
      var shortcutTheme = this.options.data.shortcutTheme,
          layout        = this._getLayout(this.collection.length);
      this.collection.each(function (model, index) {
        var totalShortcuts = !this._isInlineEditMode() ? this.collection.length :
                             this.collection.getShortcuts().length,
            theme          = this._getShortcutTheme(index, totalShortcuts);
        model.set({
          layout: layout,
          theme: theme,
          shortcutTheme: shortcutTheme
        });
      }, this);
    },

    onDrop: function (event) {
      this.options.widgetContainer.trigger('replace:widget', event);
    },

    onDragOver: function (event) {
      event.preventDefault();
    },

    onDragEnter: function (event) {
      event.preventDefault();
    },
    currentlyFocusedElement: function () {
      var currentItem = this.children.findByIndex(this._currentShortcutIndex);
      return currentItem && currentItem.$el;
    },

    onKeyInView: function (event) {
      if (this._isInlineEditMode()) {
        return;
      }
      if (event.keyCode === 38) {
        this._selectPreviousShortcut();
      }
      else if (event.keyCode === 40) {
        this._selectNextShortcut();
      }
      else if (event.keyCode === 32 || event.keyCode === 13) {
        this.currentlyFocusedElement().trigger('click');
      }
    },

    _selectNextShortcut: function () {
      var index = Math.min(this._currentShortcutIndex + 1, this.collection.length - 1);
      this._selectShortcut(index);
    },

    _selectPreviousShortcut: function () {
      var index = Math.max(this._currentShortcutIndex - 1, 0);
      this._selectShortcut(index);
    },

    _selectShortcut: function (index) {
      if (index !== this._currentShortcutIndex) {
        this._currentShortcutIndex = index;
        this.trigger('changed:focus', this);
        this.currentlyFocusedElement().trigger('focus');
      }
    }
  }, {
    migrateSingleShortcut: function (options) {
      var shortcutTheme;
      switch (options.background) {
      case 'cs-tile-background1':
        shortcutTheme = 'csui-shortcut-theme-stone1';
        break;
      case 'cs-tile-background2':
        shortcutTheme = 'csui-shortcut-theme-teal2';
        break;
      case 'cs-tile-background3':
        shortcutTheme = 'csui-shortcut-theme-pink1';
        break;
      }
      return {shortcutItems: [options], shortcutTheme: shortcutTheme};
    },

    migrateData: function (widgetType, options) {
      switch (widgetType) {
      case 'shortcut':
      case 'csui/widgets/shortcut':
        return ShortcutsView.migrateSingleShortcut(options);
      default:
        return options;
      }
    }
  });

  _.extend(ShortcutsView.prototype, ViewEventsPropagationMixin);

  return ShortcutsView;

});
