To resolve "conflict-error" when the network is slow, or previous request is pending and the token is not updated.

To avoid such type of issue we introduced blocking behavior, when user tries to modify the form data while the previous request is still pending.

In order to enable the same blocking behavior you need to update few things in ...from.view, similar to  category.form.view and node.general.form.view, it is the place which keeps the track of the ajax request.

1. Before sending the request update one flag:
    this.isDataUpdating = true;

2. In the always() callback:
   // Setting the flag to false after completion
   this.isDataUpdating = false;

   // Unblocking the metadataView
   this.options.metadataView && this.options.metadataView.unblockActions();

   // Trigerring the event to proceed further actions if there is any
   this.trigger("request:completed", this.propagatedView);

3. Maintain one listener which helps to keep track of modified field view
   onRequestProcessing: function (view) {
      this.propagatedView = view;
    },

For more reference see category.form.view changelist number: 28108601

Need to update the editable form field also, if there is any customised apart from CSUI.