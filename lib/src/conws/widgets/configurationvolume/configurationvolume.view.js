/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  "csui/lib/underscore",
  "csui/lib/jquery",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/widgets/shortcuts/shortcuts.view",
  "csui/controls/tile/behaviors/perfect.scrolling.behavior",
  "csui/behaviors/keyboard.navigation/tabable.region.behavior",
  "conws/models/configurationvolume/configurationvolume.factory",
  "i18n!conws/widgets/configurationvolume/impl/nls/lang",
  "css!conws/widgets/configurationvolume/impl/configurationvolume"
], function (_,
    $,
    Backbone,
    Marionette,
    ShortcutsView,
    PerfectScrollingBehavior,
    TabableRegionBehavior,
    ConfigurationVolumeFactory,
    lang) {

  var EmptyVolumeView = Marionette.View.extend({
    className: "conws-empty-configurevolume-container",
    onShow: function() {
      this.$el.text(lang.emptyResultsText);
    }
  });

  var THEME_SUFFIX = ["shade1", "shade2", "shade3", "shade4"];

  var ConfigurationVolumeView = ShortcutsView.extend({
    className: 'conws-volumeshortcut-container csui-shortcut-container tile',

    attributes: {
      role: 'menu'
    },

    constructor: function ConfigurationVolumeView(options) {
      options || (options = {});
      options.data || (options.data = {});
      options.perspectiveMode = false;
      options.model = options.context.getModel(ConfigurationVolumeFactory, {});
      ShortcutsView.prototype.constructor.call(this, options);
    },

    emptyView: EmptyVolumeView,

    buildChildView: function (child, ChildViewClass, childViewOptions) {
      if (ChildViewClass === EmptyVolumeView) {
        return Marionette.CollectionView.prototype.buildChildView.call(this, child, ChildViewClass,
          childViewOptions);
      }
      return ShortcutsView.prototype.buildChildView.apply(this, arguments);
    },

    modelEvents: {
      change: 'modelChange'
    },

    childEvents: _.extend(ShortcutsView.prototype.childEvents, {
      'render': 'onChildViewRender'
    }),

    onChildViewRender: function(childView) {
      childView.$el.addClass('csui-configurationvolume-container');
    },

    currentlyFocusedElement: function () {
      var currentItem = this.children.findByIndex(this._currentShortcutIndex);
      return currentItem && currentItem.$el;
    },

    modelChange: function () {
      this.collection.set(this.model.get('shortcutItems'));
      this._currentShortcutIndex = 0;
    },

    _getShortcutTheme: function (itemIndex, numberOfItems) {
      var theme = this.options.data.shortcutTheme ? this.options.data.shortcutTheme :
                  "csui-shortcut-theme-grey";
      if (numberOfItems > 1) {
        var numOfShades = THEME_SUFFIX.length;
        theme += "-" + THEME_SUFFIX[(numOfShades - 1) - (itemIndex % numOfShades)];
      }

      return theme;
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        suppressScrollX: true,
        scrollYMarginOffset: 15
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    }
  })

  return ConfigurationVolumeView;

});
