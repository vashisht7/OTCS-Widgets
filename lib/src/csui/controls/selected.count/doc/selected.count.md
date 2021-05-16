# SelectedCountView

The SelectedCountView is a generic component which contains selected item's information, from where it has been integrated.
Out of the box, this re-usable component has been integrated into NodestableView, SearchResultsView and NodePicker/TargetPicker.
It can also be plugged into list/collection views by following the below guidelines.

This control contains a dropdown which holds two sections, one section contains a `clearAll` button which comes only when the number of selected item's count reaches some threshold, by default its value is 4.

The second section contains `selected item's name` along with inline `remove` button, this inline remove button shows always for touch browsers and only shows on "hover" and "focus-in" for other browsers.

## Example

    var selectedItem = new Backbone.Collection([
        {id: 1112, name: "John", type: 0},
        {id: 1113, name: "Mark", type: 144, mime_type: "application/pdf"},
        {id: 1114, name: "Walt", type: 144, mime_type: "application/msword"}
      ]),

      selectedCountView = new SelectedCountView({
       collection:  selectedItem,
       scrollableParent: 'body'
     });
    selectedCountView.on("click:unselectItem", function(){
	alert('click:unselectItem raised. Removed selected item.');
	});
    selectedCountView.render();

## Constructor Summary

### constructor(options)

 Creates a new SelectedCountView.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.collection`(Backbone collection) - Collection contains selected items list sent from the parent view, based on this select count view will render and counter icon will display the length of selected items.
* `options.scrollableParent` (element | optional) - This value can be string or element. Based on this it adjusts selected count dropdown height. In absence of this option, the dropdown value won't be responsive and will always have fixed height always.

## Events Summary

## reset
Removes all selected items from the parent view (Nodestable/Search results/Node picker/Target picker) and select count view.

## click:unselectItem(event)
The event is fired when the selected item is deselected from parent view (Nodestable/Search results/Node picker/Target picker), and also when the user clicks on inline remove button from select count view.

### Parameters
* `event` - *Object* The event object
