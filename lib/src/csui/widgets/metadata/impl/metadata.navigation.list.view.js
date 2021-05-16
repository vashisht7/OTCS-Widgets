/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/controls/list/simplelist.view',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/widgets/metadata/impl/metadata.navigation.list.keyboard.behavior',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/models/version',
  'i18n!csui/widgets/metadata/impl/nls/lang'
], function (_, $,
    SimpleListView,
    TabableRegionBehavior,
    MetadataNavigationListKeyboardBehavior,
    NodeTypeIconView,
    VersionModel,
    lang) {

  var MetadataNavigationListView = SimpleListView.extend({

    childViewOptions: function (model) {
      return {
        templateHelpers: function () {
          var nameAttribute = this.options.nameAttribute || 'name';
          return {enableIcon: true, name: this.model.get(nameAttribute)};
        },
        nameAttribute: this.options.data.nameAttribute
      };
    },

    events: {
      'keydown': 'onKeyDown'
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      },
      MetadataNavigationListKeyboardBehavior: {
        behaviorClass: MetadataNavigationListKeyboardBehavior
      }
    },

    constructor: function MetadataNavigationListView(options) {
      this.options = options || {};
      this.events = _.extend({}, SimpleListView.prototype.events, this.events);
      SimpleListView.apply(this, arguments);
      this.listenTo(this, 'childview:render', this.onRenderItem);
      this.listenTo(this, 'childview:before:destroy', this.onBeforeDestroyItem);
    },

    onRenderItem: function (childView) {
      if (childView.model instanceof VersionModel) {
        var verNum = childView.model.get('version_number_name');
        $(childView.$('.csui-type-icon').get(0)).append(
            "<span title='" + verNum + "' class='list-item-version'>" + verNum + "</span>"
        );
      } else {
        if ((this.options && this.options.isThumbnailView) ||
            (this.options.originatingView && this.options.originatingView.thumbnailView)) {
          this.$el.addClass("csui-metadata-navigation-thumbnail");
          childView.model.attributes.image_url = childView.model.get('csuiThumbnailImageUrl');
        } else {
          this.$el.find(".csui-metadata-navigation-thumbnail").removeClass(
              "csui-metadata-navigation-thumbnail");
        }
        childView._nodeIconView = new NodeTypeIconView({
          el: childView.$('.csui-type-icon').get(0),
          node: childView.model
        });
        childView._nodeIconView.render();
      }
      var show_required = this.options.data && this.options.data.show_required === true;
      var enforcedRequire = childView.model && childView.model.options &&
                            childView.model.options.enforcedRequiredAttrs === true;
      if (show_required && enforcedRequire) {
        var titleEl = childView.$('.list-item-title').get(0);
        if (titleEl) {
          var cssClasses, tooltip;
          if (childView.model.validated === true) {
            cssClasses = 'cs-icon-required category_required_done';
            tooltip = lang.requiredPassedTooltip;
          } else {
            cssClasses = 'cs-icon-required category_required';
            tooltip = lang.requiredTooltip;
          }
          $(titleEl).before("<span class='" + cssClasses + "' aria-label='" + tooltip +
                            "' title='" + tooltip + "'></span>");
        }
      }
    },

    onBeforeDestroyItem: function (childView) {
      if (childView._nodeIconView) {
        childView._nodeIconView.destroy();
      }
    }

  });

  return MetadataNavigationListView;

});
