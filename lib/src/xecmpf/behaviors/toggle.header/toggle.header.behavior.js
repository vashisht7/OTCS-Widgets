/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
    'csui/controls/table.rowselection.toolbar/table.rowselection.toolbar.view',
    'csui/utils/non-emptying.region/non-emptying.region', 'csui/lib/jquery.redraw'
  ], function ($, _, Marionette, TableRowSelectionToolbarView, NonEmptyingRegion) {
   'use strict';

    var slideTime = 500;

    var ToggleHeaderBehavior = Marionette.Behavior.extend({

        initialize: function () {
            this.listenTo(this.view, {
                'before:render': this.setTableRowSelectionToolbar,
                'render': this._setTableRowSelectionToolbarEventListeners
            });
            this.tableHeader = this.options.tableHeader;
            this.container = this.options.alternatingTableContainer;
            this.tableToolbar = this.options.tableToolbar;
            this.tableRowSlectionToolbarViewOptions = this.options.tableRowSlectionToolbarViewOptions;
        },

        setTableRowSelectionToolbar: function () {
           if (!this.view.tableView) {
                return;
            }

            this.view._tableRowSelectionToolbarView = new TableRowSelectionToolbarView(_.extend({
                toolItemFactory: this.view.options.toolbarItems.tableHeaderToolbar,
                toolbarItemsMask: this.view.options.toolbarItemsMasks.toolbars.tableHeaderToolbar,
                toolbarCommandController: this.view.commandController,
                showCondensedHeaderToggle: true,
                commands: this.view.defaultActionController.commands,
                selectedChildren: this.view.tableView.selectedChildren,
                container: this.view.collection.node,
                context: this.view.context,
                originatingView: this.view,
                collection: this.view.collection
            }, this.tableRowSlectionToolbarViewOptions));

            var toolbarView = this.view._tableRowSelectionToolbarView;
            this.listenTo(toolbarView, 'toggle:condensed:header', function () {
                var $tableHeaderEl = this.$el.find(this.tableHeader);
                var $container = this.$el.find(this.container);
                var showingBothToolbars;
                if ($tableHeaderEl.is(":visible")) {
                    showingBothToolbars = false;
                    $tableHeaderEl.slideUp(slideTime);
                    $container.removeClass('xecmpf-show-header');
                } else {
                    showingBothToolbars = true;
                    $tableHeaderEl.slideDown(slideTime);
                    $container.addClass('xecmpf-show-header');
                }
                toolbarView.trigger('toolbar:activity', true, showingBothToolbars);
            });
        },

        _setTableRowSelectionToolbarEventListeners: function () {
            var region = new NonEmptyingRegion({el: this.tableToolbar});
            this.listenTo(this.view.tableView.selectedChildren, 'reset', function () {
                region.show(this.view._tableRowSelectionToolbarView);
                this._onSelectionDisplayOrHide(this.view.tableView.selectedChildren.length);
            });
        },

        _onSelectionDisplayOrHide: function (selectionLength) {
            var $tableHeaderEl = this.$el.find(this.tableHeader);
            var $tableToolbar = this.$el.find(this.tableToolbar);
            var $container = this.$el.find(this.container);
            if (selectionLength > 0) {
                if ($tableToolbar.is(":hidden")) {
                    $tableHeaderEl.slideUp(slideTime);
                    $tableToolbar.slideDown(slideTime);
                    this._triggerToolbarActivityEvent(true, false);
                }
            } else {
                if ($tableToolbar.is(":visible")) {
                    $tableToolbar.slideUp(slideTime);
                    $tableHeaderEl.slideDown(slideTime);
                    $container.removeClass('xecmpf-show-header');
                    this._triggerToolbarActivityEvent(false, true);
                }
            }
        },

        _triggerToolbarActivityEvent: function (toolbarVisible, headerVisible) {
            var toolbarView = this.view._tableRowSelectionToolbarView;
            toolbarView.trigger('toolbar:activity', toolbarVisible, headerVisible);
        }
    });
    return ToggleHeaderBehavior;
});