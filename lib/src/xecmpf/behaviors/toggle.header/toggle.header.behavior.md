ToggleHeaderBehavior
====================

Toggles the header when items are selected in the table.
This behavior expects the TableView to be available.
Shows/hides the rowSelection/actions toolbar.

Uses the control table.rowselection.toolbar.view to hide or show the header while
rowSelection/actions toolbar is still shown.

This behavior also renders the toolbar view(tableRowSelectionToolbarView) with the
help of below code snippet

# Following options must be provided to the behavior
+ tableHeader - The header region of the table
+ tableToolbar - The toolbar region of the table
+ alternatingTableContainer - The container region which holds both the header and the toolbar regions

+ tableRowSlectionToolbarViewOptions - Use this to override the default options

# Below are the default options passed
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