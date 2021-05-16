# Workspaces widget (widgets/myworkspaces)

  The Workspaces widget provides a list of workspaces for one workspace type.
  It allows for filtering on the workspaces by opening a search field and entering filter criteria.
  Clicking on a single workspaces opens the workspace.
  The icon displayed in the header is the standard icon for business workspaces. If a specific icon
  for the workspace is configured in the server, this icon is used.

  The models and "query properties" like filtering, sorting, ... are independent for the collapsed and
  expanded view of the widget. For example, if a filter is set in the collapsed view, this has no 
  influence in case the expanded view is opened.
  
## Features

* Collapsed view

  The workspaces are sorted by recently usage.
It allows for filtering on the workspaces by name with the search field.
When scrolling the collapsed view to the end, the next page of workspaces are fetched from server.

* Expanded view

  The expanded view shows the columns:
  *    `type`: The default icon for the business workspace
  *    `name`: The business workspace name
  *    `size`: The size of the business workspace
  *    `modify_date`: The modify date of the business workspace
  *    `favorite`: Interactive icon that indicates if the business workspace is part of user favorites

  Additionally custom columns are configurable.

  **Important:** In Content Server, the value for **Column availability** must be set to **Available everywhere** for all columns.

  Filtering works on all columns and custom columns of type string, for example **name**.

  Sorting is possible for the workspace name and the custom columns, where the **sortable** option is enabled.

## Constructor

### Example

```javascript
require([
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'conws/widgets/myworkspaces/myworkspaces.view'
], function (
  Marionette,
  PageContext,
  MyWorkspacesView
) {
      var contentRegion = new Marionette.Region({el: '#content'}),
          pageContext = new PageContext(),
          myWorkspacesView = new MyWorkspacesView({
              "context": pageContext,
              "data": {
                  "title": "Sales Opportunity",
                  "workspaceTypeId": 1,
                  "collapsedView":{
                      "noResultsPlaceholder": "There are no sales opportunities to display."
                  },
                  "expandedView": {
                      "orderBy": {
                        "sortColumn": "{name}",
                        "sortOrder": "desc"
                      }
                      "customColumns": [
                          {
                              "key": "{wnf_att_141g_5}"
                          },
                          {
                              "key": "{wnf_att_141g_4}"
                          }
                      ]
                  }
              }
          });

      contentRegion.show(myWorkspacesView);
      pageContext.fetch();
});
```


### Parameters

#### options

`context` - The page context

`data` - The common widget configuration

##### data

`workspaceTypeId` - The ID of workspace type of the displayed workspaces.
If configured, a specific icon for the workspace type is diplayed in the header.
  
`title` - The displayed widget header title.

`collapsedView` - The configuration for the collapsed view.

`expandedView` - The configuration for the expanded view

###### collapsedView

`noResultsPlaceholder` - Optional parameter - Message displayed in case there are no proper workspaces available.

###### expandedView

`orderBy` - Optional parameter - A custom sort order of the displayed workspaces in the expanded view (order in collapsed view is not configurable).
It's possible to sort by all sortable columns e.g. by workspace name: { "sortColumn": "{name}", "sortOrder": "asc"} (default).

`customColumns` - The list of custom columns to be displayed in the expanded view.
The columns appear between the modify_date and favorite columns.
Additionally, custom workspace columns can be specified here.
Each element just needs to specify the unique custom column identifier as property `key`.

The following columns are created during installation. They are displayed by default and cannot be changed:
  *    `type`: The default icon for the business workspace (not the configured one), for this no header is displayed
  *    `name`: The business workspace name
  *    `size`: The size of the business workspace
  *    `modify_date`: The modify date of the business workspace
  *    `favorite`: Icon that indicates if the business workspace is part of user favorites, for this no header is displayed

