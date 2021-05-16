/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/models/node/node.addable.type.collection',
  'csui/utils/log',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/default.action/default.action.behavior',
  'workflow/behaviors/list.keyboard.behavior',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.draganddrop.view',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmentitem.view',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.emptyDragAndDrop.view',
  'hbs!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmentlist',
  'css!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments'
], function ($, _, Marionette, TabableRegionBehavior, AddableTypeCollection, log,
    PerfectScrollingBehavior, DefaultActionBehavior, ListKeyboardBehavior, DragAndDrop,
    WorkItemAttachmentItemView, WorkItemDragAndDropEmptyView, template) {
  'use strict';
  var WorkItemAttachmentListView = Marionette.CompositeView.extend({

    childViewContainer: '.workitem-attachments-itemlist',
    childView: WorkItemAttachmentItemView,
    emptyView: WorkItemDragAndDropEmptyView,
    childViewOptions: function () {
      var options         = this.options,
          originatingView = options.view;
      originatingView.collection = this.collection;
      return {
        defaultActionController: this.defaultActionController,
        context: options.context,
        view: originatingView,
        container: options.container
      };
    },
    childEvents: {
      'editmode:item': 'onEditModeItem'
    },

    events: {
      'keydown': 'onKeyDown'
    },
    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      ListKeyboard: {
        behaviorClass: ListKeyboardBehavior,
        currentlyFocusedElementSelector: '.workitem-attachments-name'
      },
      ScrollingInstructions: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.workitem-attachments-scrolling',
        suppressScrollX: true,
        scrollYMarginOffset: 16
      }
    },
    className: 'workflow-attachmentlist-form',
    template: template,
    ui: {
      dragAndDropArea: 'div.workitem-attachments-scrolling'
    },

    constructor: function WorkItemAttachmentListView(options) {
      this.options = options;
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
    },

    onShow: function () {
      if (this._canApplyDragAndDrop()) {
        this.setDragNDrop();
      }
    },

    _canApplyDragAndDrop: function () {
      var model    = this.options.view.model,
          mapsList = model.get('mapsList');
      return !model.get('isDoc') || (mapsList && mapsList.length === 1);
    },
    onAddChild: function (row) {
      this.selectedIndex = 0;
      this.trigger('refresh:tabindexes');
      if (this._canApplyDragAndDrop()) {
        this._setDragNDropRow(row);
      }
    },
    onRemoveChild: function () {
      this.selectedIndex = 0;
      this.trigger('refresh:tabindexes');
    },
    onEditModeItem: function (view) {
      if (_.isFunction(view.isEditMode) && !view.isEditMode()) {
        this.trigger('refresh:tabindexes');
      }
    },

    _isDragNDropSupportedRow: function (rowNode) {
      return (rowNode && rowNode.get('type') === 0);
    },

    _setDragNDropRow: function (row) {
      var rowNode           = row && row.model,
          isSupportedRow    = this._isDragNDropSupportedRow(rowNode),
          context           = this.options.context,
          currentHoverView  = isSupportedRow ? row.el : this,
          target            = isSupportedRow ? rowNode : this.collection.node,
          highlightedTarget = isSupportedRow ? currentHoverView : this.ui.dragAndDropArea;

      this.addableTypes = new AddableTypeCollection(undefined, {node: target});

      this.addableTypes.fetch().done(_.bind(function () {
        currentHoverView.dragNDrop = new DragAndDrop({
          container: target,
          collection: this.collection,
          addableTypes: this.addableTypes,
          context: context,
          highlightedTarget: highlightedTarget,
          originatingView: this,
          isSupportedRowView: isSupportedRow
        });
        this.listenTo(currentHoverView.dragNDrop, 'drag:over', this._addDragDropBorder, this);
        this.listenTo(currentHoverView.dragNDrop, 'drag:leave', this._removeDragDropBorder, this);

        currentHoverView.dragNDrop.setDragParentView(this, row.el);

      }, this));

    },

    setDragNDrop: function () {
      this.addableTypes = new AddableTypeCollection(undefined, {node: this.collection.node});
      this.addableTypes.fetch().done(_.bind(function () {
        this.dragNDrop = new DragAndDrop({
          container: this.collection.node,
          collection: this.collection,
          context: this.options.context,
          addableTypes: this.addableTypes
        });
        this.listenTo(this.dragNDrop, 'drag:over', this._addDragDropBorder, this);
        this.listenTo(this.dragNDrop, 'drag:leave', this._removeDragDropBorder, this);
        if (this.csuiDropMessage) {
          this.csuiDropMessage.remove();
          this.csuiDropMessage = undefined;
        }
        this.dragNDrop.setDragParentView(this, this.ui.dragAndDropArea);
      }, this));

    },

    _addDragDropBorder: function (view, options) {
      var disableMethod     = options && options.disabled ? 'addClass' : 'removeClass',
          highlightedTarget = options && options.highlightedTarget ? options.highlightedTarget :
                              this.ui.dragAndDropArea;
      $(highlightedTarget).addClass('drag-over')[disableMethod]('csui-disabled');
    },

    _removeDragDropBorder: function (options) {
      var highlightedTarget = this.ui.dragAndDropArea;
      options && options.highlightedTarget && options.valid ?
      $(options.highlightedTarget).removeClass('drag-over') :
      $(highlightedTarget).removeClass('drag-over');
    },

    onDomRefresh: function () {
      if (this.collection.propertiesAction) {
        Marionette.CollectionView.prototype._renderChildren.call(this);
        this.collection.propertiesAction = false;
        this.onShow();
      }
    }
  });

  return WorkItemAttachmentListView;

});
