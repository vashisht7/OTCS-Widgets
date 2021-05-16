# TypeaheadSearchBoxView
 TypeaheadSearchBoxView shows a text-box to enter a simple text search query, clear icon to clear the text and close icon to close the search box.
 Based on the query(text entered), it shows a dropdown containing results relevent to the query.

 TypeaheadSearchBox extends SearchBoxView `src\controls\table\cells\searchbox\searchbox.view.js` and
 internally uses bootstrap-typeahead for the functionality of dropdown.

 when an item is selected from the dropdown, typeahead.searchbox.view triggers an event "item:change" and passes the query(entered text)
 as data along with the event. Any view using Typeahead searchbox can listen to this event and perform any task.


## Required Parameters

* `source` - Data in the form of array or callback function passed as an option to typeahead.searchbox.view

# Example
```
    var queryRegion = new Marionette.Region({el: '#query'}),
     DDmenu = '<ul class="typeahead binf-dropdown-menu" role="listbox" id="event-picker-ul"></ul>',
        typeAheadOptions = {
        collection: new Backbone.Collection({
        { id: 1, value: 'First' },
        { id: 2, value: 'Second' }
        }),
        source: collection.models,
        showHintOnFocus: true,
        menu: DDmenu
    },
    typeaheadSearchBoxView = new TypeaheadSearchBoxView(typeAheadOptions);
    queryRegion.show(typeaheadSearchBoxView);
```


## optional parameters that can be passed to typeahead.searchbox
* `items`: *number* maximum number of items to be shown inside drop-down.
* `menu`: *String* It contains html. The typeahead search result will be displayed inside menu.
* `minLength`: *number* minimum length of the query to show dropdown.
* `autoSelect`: *Boolean* if true it selects first item in the drop-down, else nothing is selected.
* `source`: *Array* data source from which filtering is done based on the query or *function callback* which is called on entering text that returns filtered array based on query to override existing behavior.
* `afterSelect`: *function callback* executes after selection of value from the drop-down.
* `prettyScrolling`: *Boolean* It is a flag whether to render a perfect-scrollbar or not.
* `appendTo`: *jquery element* it expects jQuery element,to which the menu will be appended.
* `handleNoResults`: *Boolean* if true no results condition will be handled i.e.
it will show emptyTemplate, else if it is false empty template will not be shown.
* `emptyTemplate`: *html template* if provided then emptytemplate will be displayed when there are no results.
* `showHintOnFocus`: *Boolean* if true displays the dropdown when focus is set in the search box.
if it is false then drop-down is displayed once user starts typing in searchbox.
* `displayText`:*function callback* that is called for every item in dropdown, receives item as parameter, returns any display text for that item.
* `highlighter`:*function callback* that is called for every item in dropdown, receives item as parameter, returns html for that item.
* `updater`: *function callback* that is called before afterselect callback is called, receives item as parameter, returns a value that will be passed to afterSelect as a parameter.
