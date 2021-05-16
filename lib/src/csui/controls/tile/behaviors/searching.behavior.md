SearchBehavior
==============

Places a Search icon on the tile header, which opens a text box for entering search or filter terms.

### Example

```javascript
  // Create helpers to show the views on the page
   searchableRegion = new Marionette.Region({
            el: "#searchable"
          }),
// Create a tile with a search icon in the header.
 var  SearchableTileView = TileView.extend({
            icon: 'image_user_placeholder',
            title: 'Searchable Tile',
            contentView: ContentView,
            behaviors: {
              Searching: {
                behaviorClass: SearchingBehavior,
                searchIconTitle: 'configuredSearchTitle'
              }
            }
          }),
      searchableTileView = new SearchableTileView();
          // show that view in respective region.
          searchableRegion.show(searchableTileView);
```

### Options

`searchButton` (string)
: CSS class placing an icon to the top-right corner of the modal dialog

`searchIconTitle` (string)
: A configured text need to be shown as title when mouse hovered on the icon.

 `searchPlaceholder` (string)
 : A by default text to show inside search-input box, when user hit the search-icon
   for example: (Search)

 `searchIconAria` (string)
 : It's an attribute designed to help assistive technology (e.g. screen readers),
   use it in case where a text label for search is not visible on the screen.
