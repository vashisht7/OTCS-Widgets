/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore', 'csui/lib/marionette',
  'csui/controls/table.rowselection.toolbar/table.rowselection.toolbar.view',
  'csui/utils/accessibility',
  'csui/lib/jquery.redraw',
  'css!csui/behaviors/table.rowselection.toolbar/impl/table.rowselection.toolbar'
], function (_, Marionette, ToolbarView, Accessibility) {
  'use strict';

  var accessibleTable = Accessibility.isAccessibleTable();

  var TableRowSelectionToolbarBehavior = Marionette.Behavior.extend({
    initialize: function () {
      this.listenTo(this.view, {
        'before:render': this.setToolbar,
        'render': this.renderToolbar
      });
    },

    setToolbar: function () {
      this.toolbarRegion = this.view[getOption(this.options, 'toolbarRegionName', this.view)] ||
                           this.view.toolbarRegion;
      if (!this.toolbarRegion || !this.view.tableView) {
        return;
      }

      var visibleClassName     = getOption(this.options, 'visibleClassName', this.view) ||
                                 'csui-rowselection-toolbar-visible',
          toolbarViewOptions   = getOption(this.options, 'toolbarViewOptions', this.view),
          showSelectionCounter = getOption(this.options, 'showSelectionCounter', this.view) ||
                                 this.view.options.showSelectionCounter,
          selectedChildren     = getOption(this.options, 'allSelectedNodes', this.view) ||
                                 this.view.tableView.selectedChildren;

      this.toolbarView = new ToolbarView(_.extend({
        toolItemFactory: this.view.options.toolbarItems.tableHeaderToolbar,
        showSelectionCounter: showSelectionCounter,
        toolbarItemsMask: this.view.options.toolbarItemsMasks.toolbars.tableHeaderToolbar,
        toolbarCommandController: this.view.commandController,
        commands: this.view.defaultActionController.commands,
        selectedChildren: selectedChildren,
        container: this.view.collection.node,
        context: this.view.options.context,
        originatingView: this.view, // used for blocking and modal dialogs
        collection: this.view.collection,
        scrollableParent: this.options.scrollableParent
      }, toolbarViewOptions));

      this.listenTo(selectedChildren, 'reset', function () {
        updateToolBarCSS.call(this);
        this.toolbarView && this.toolbarView.triggerMethod('dom:refresh');
      });

      function updateToolBarCSS() {
        var $el = this.toolbarRegion.$el;
        if (selectedChildren.length > 0) {
          if (!$el.hasClass(visibleClassName)) {
            if (accessibleTable) {
              $el.removeClass('binf-hidden')
                  .addClass('csui-no-animation')
                  .addClass(visibleClassName);
            } else {
              $el.removeClass('binf-hidden')
                  .redraw()
                  .addClass(visibleClassName);
            }
          }
        } else {
          if ($el.hasClass(visibleClassName)) {
            if (accessibleTable) {
              $el.addClass('binf-hidden')
                  .addClass('csui-no-animation')
                  .removeClass(visibleClassName);
            } else {
              $el.one('transitionend', function () {
                $el.addClass('binf-hidden');
              })
                  .removeClass(visibleClassName);
            }
          }
        }
      }
    },

    renderToolbar: function () {
      if (this.toolbarRegion && this.toolbarView) {
        this.toolbarRegion.show(this.toolbarView);
        this.toolbarRegion.$el.addClass('binf-hidden');
      }
    }
  });

  function getOption(object, property, context) {
    if (object == null) {
      return void 0;
    }
    var value = object[property];
    return _.isFunction(value) ? object[property].call(context) : value;
  }

  return TableRowSelectionToolbarBehavior;
});