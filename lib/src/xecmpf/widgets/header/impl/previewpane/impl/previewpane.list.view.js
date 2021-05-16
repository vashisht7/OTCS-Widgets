/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/list/simplelist.view', 'csui/controls/node-type.icon/node-type.icon.view',
  'xecmpf/widgets/header/impl/previewpane/impl/previewpane.list.keyboard.behavior',
  'csui/dialogs/modal.alert/modal.alert'

], function (_, $, Backbone, Marionette,
    SimpleListView, NodeTypeIconView, PreviewPaneListKeyboardBehavior, ModalAlert) {

  var PreviewPaneListView = SimpleListView.extend({

    constructor: function PreviewPaneListView(options) {
      SimpleListView.prototype.constructor.apply(this, arguments);
    },

    behaviors: {
      PreviewPaneListKeyboardBehavior: {
        behaviorClass: PreviewPaneListKeyboardBehavior
      }
    },

    events: {
      'keydown': 'onKeyDown'
    },

    initialize: function (options) {
      options || (options = {});
      this.enableIcon = options.enableIcon;
      this.enableDescription = options.enableDescription;
      this.previewPane = options.previewPane;
      this.config = options.config;

      this.listenTo(this, 'childview:render', this.onRenderItem);
      this.listenTo(this, 'childview:before:destroy', this.onBeforeDestroyItem);
      this.listenTo(this, 'click:item', this.onClickListItem);
    },

    childViewOptions: function (childViewModel) {
      return {
        templateHelpers: function () {
          return {
            enableIcon: this.enableIcon,
            enableDescription: this.enableDescription,
            name: childViewModel.get('name')
          };
        }.bind(this)
      };
    },

    onClickListItem: function (src) {
      var url   = src.model.get('displayUrl'),
          error = src.model.get('displayUrlError');
      if (error) {
        ModalAlert.showError(error);
      } else if (url) {
        var browserTab = window.open(url, '_blank');
        browserTab.focus();
      }
    },

    onRenderItem: function (childView) {
      childView._nodeIconView = new NodeTypeIconView({
        el: childView.$('.csui-type-icon').get(0),
        node: childView.model
      });
      childView._nodeIconView.render();
      if (this.options && childView.model
          && childView.model.attributes
          && childView.model.attributes.name
          && this.options.enableDescription) {
        var locHTML = '<div class="SLITitleDiv"><div class="SLITitle"><span title="' +
                      childView.model.attributes.name
                      + '">' +
                      childView.model.attributes.name
                      + '</span></div><div class="SLIDescription"><span title="' +
                      childView.model.attributes.classification_name
                      + '">' +
                      childView.model.attributes.classification_name
                      + '</span></div></div>';
        childView.$('.list-item-title').replaceWith(locHTML);
      }
      var displayUrl = childView.model.get('displayUrl');
      if ( displayUrl) {
        var a = childView.$el[0];
        a.href = displayUrl;
      }
    },

    onBeforeDestroyItem: function (childView) {
      if (childView._nodeIconView) {
        childView._nodeIconView.destroy();
      }
    }
  });

  return PreviewPaneListView;
});
