/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/controls/listitem/listitemstandard.view',
  'conws/utils/previewpane/previewpane.view',
  'csui/behaviors/default.action/default.action.behavior'
], function (_, $,
    StandardListItem, PreviewPaneView,
    DefaultActionBehavior) {

  var MyWorkspacesListItem = StandardListItem.extend({

    constructor: function MyWorkspacesListItem(options) {
      StandardListItem.apply(this, arguments);

      if (this.options && this.options.preview) {
        this.previewPane = new PreviewPaneView({
          parent: this,
          context: this.options.context,
          config: this.options.preview,
          node: this.model
        });
      }
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    onBeforeDestroy: function(e) {
      if (this.previewPane) {
        this.previewPane.destroy();
        delete this.previewPane;
      }
    },

    onClickItem: function () {
      this.triggerMethod('execute:DefaultAction', this.model);
    }
  });

  return MyWorkspacesListItem;

});

