#Participants Edit Dialog (widgets/team/impl/dialogs/participants)



## Read only view

  The read only view of the dialog is shown when the current user has no permission to change a role for the workspace.

  The read only view contains a simple HTML list of ul and li elements to show the list of assigned roles for the selected user.
  The dialog also has only a close button.

## Edit view

  The edit view of the dialog is shown when the current user has edit permission at least for one role or is admin.

  The edit view is created of different components.

*  On the left side the list of role which are assigned and can be removed.
*  On the right side the list of available roles which can be assigned.
*  On th bottom a button bar with all buttons for the dialog.

##  List of assigned roles

  The list of assigned roles contains also two parts

*  The filter header which shows the title for the list and is able to show a filter edit box
*  The list of assigned roles
   The list is a Backbone.Marionette component (widgets/team/impl/dialogs/participants/impl/roles.edit.list.remove)
   The component takes a some parameters, model: list of role, filterModel: filter model from the filter header, selectedItem: list of selected items
   If a role is removed from the list, with a click on the removal icon, the role is remove from the model, so that the other part of the dialog are informed about the change.
   The component also listens to the changes in the filter model and if a change is made the list filters the roles list based on the filter criteria from the filter model.
   The selected items list is used to decide if the participants remove information is shown or not. If the roles list is empty and no other role is selected the dialogs
   shows a message that the user will be removed from the workspace. (This could be done in a cleaner way if this message is move to the dialog itself.)

## List of available roles

*  The filter header which shows the title for the list and is able to show a filter edit box
*  The list of available roles
   The list is a Backbone.Marionette component (widgets/team/impl/dialogs/participants/impl/roles.edit.list.view)
   The component takes a some parameters, model: list of role, filterModel: filter model from the filter header, selectedItem: list of selected items
   If a role is selected in the list, with a click on item, the role is addedd to the selected item list, so that the other part of the dialog are informed about the change.
   The component also listens to the changes in the filter model and if a change is made the list filters the roles list based on the filter criteria from the filter model.

## Button bar

   The button bar Backbone.Marionette component (widgets/team/impl/controls/buttonbar/roles.edit.button.view)
   It is responsible to show the necessary buttons with the defined state for the dialog.
   The state for the button bar is provided with a button model.

   The button bar has two modes, read only and edit.

*  Read only
   In this mode only a Close button is displayed

*  Edit
   In this mode 3 buttons are displayed, Save, Cancel and Reset.
   The save button is disable until the changed property is set to true, this happens when in one of the list a change (remove a role, or select a role) is done.
   The save button could also switch form Save to Remove if the showSave is set to false, this happens when all assigned roles removed from the list and no other role is selected.
   If the save button is clicked a clicked:Save event is triggered, on which the dialog listens to execute the save action.
   If the reset button is clicked a clicked:Reset event is triggered, on which the dialog listens to execute the reset action and reset the changes in the dialog.

## Filter header

   The list is a Backbone.Marionette component (widgets/team/impl/controls/filterheader/filterheader.view)
   It show a caption for the list and a filter icon on the right side.
   If the filter icon is clicked, the text disappears and an input box is shown. This input box takes filter criteria for the list.
   The entered filter criteria is set into the provided filter model. The set action of the filter criteria fires a change event on which the lists are listen to filter the list.
