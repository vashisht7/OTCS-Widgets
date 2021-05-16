/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/lib/backbone'
], function (_, $, Marionette, Backbone) {

  var DragAndDropItemBehaviour = Marionette.Behavior.extend({
    constructor: function DragAndDropItemBehaviour(options, view) {
      this.view = view;
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this._registerListeners();
    },

    _registerListeners: function () {
      this.listenTo(this.view, 'render', this._initDnD);
    },

    _initDnD: function () {
      this.$el.addClass(DragAndDropItemBehaviour.DRAGGABLE_CLASSNAME);
      this.$el.attr(DragAndDropItemBehaviour.DRAGGABLE_DATA_ATTR, this.view.model.cid);
    }
  }, {
    DRAGGABLE_CLASSNAME: 'csui-draggable-item',
    DRAGGABLE_DATA_ATTR: 'data-csui-draggable-item'
  });

  return DragAndDropItemBehaviour;
});