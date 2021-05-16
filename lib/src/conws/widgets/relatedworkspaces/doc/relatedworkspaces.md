# Related workspaces widget (widgets/relatedworkspaces)

  The Related Workspaces widget provides a list of workspaces of a specific workspace type, which are related to one certain workspace.
  It allows for filtering on the workspaces by opening a search field and entering filter criteria.
  Clicking on a single workspaces opens the workspace.  
  The icon displayed in the header is the standard icon for business workspaces. If a specific icon
  for the workspace is configured in the server, this icon is used.

  The models and "query properties" like filtering and sorting for the collapsed and
  expanded view are independent of each other. For example, if a filter is set in the collapsed view, it has no effect on the expanded view.

## Features

* Collapsed view

  The displayed related workspaces properties list can be formatted through configuration.
It allows for filtering the workspaces by the configured title value. Currently filtering
is only supported for properties of type 'string'.
When scrolling the collapsed view to the end, the next page of workspaces are fetched from server.

* Expanded view

  The expanded view shows the following columns:
  *    **type**: The default icon for the related business workspace
  *    **name**: The related business workspace name
  *    **size**: The size of the related business workspace
  *    **modify_date**: The modify date of the related business workspace
  *    **favorite**: Interactive icon that indicates if the related business workspace is part of user favorites

  Additionally, custom columns are configurable.  

  **Important:** In Content Server, the value for **Column availability** must be set to **Available everywhere** for all columns.

  Filtering works on all columns and custom columns of type **string**, for example **name**.

  Sorting is possible for the related workspace name and the custom columns, where the **sortable** option is enabled.

## Constructor

### Example

```javascript
require([
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'conws/widgets/relatedworkspaces/relatedworkspaces.view'
], function (
  Marionette,
  PageContext,
  RelatedWorkspacesView
) {
      var contentRegion = new Marionette.Region({el: '#content'}),
          pageContext = new PageContext(),
          relatedWorkspacesView = new RelatedWorkspacesView({
              "context": pageContext,
              "data": {
                  "title": "Sales Opportunities",
                  "workspaceTypeId": "3",
                  "relationType": "child",
                  "collapsedView": {
                      "orderBy": "name asc",
                      "title": {
                          "value": "{wnf_att_141g_2}"
                      },
                      "description" : {
                          "value": "Responsible for '{name}' is {wnf_att_141g_3}. {description}"
                      },
                      "topRight" : {
                          "label": "EUR",
                          "value": "{wnf_att_141g_9:currency}"
                      },
                      "bottomLeft" : {
                          "label" : "{wnf_att_141g_12}",
                          "value" : "{wnf_att_141g_4}"
                      },
                      "bottomRight" : {
                          "label": "Last modification",
                          "value": "{modify_date}"
                      }
                  },
                  "expandedView": {
                      "orderBy": "name desc",
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

      contentRegion.show(relatedWorkspacesView);
      pageContext.fetch();
});
```

### Parameters

#### options

`context` - The page context

`data` - The common widget configuration

##### data

`workspaceTypeId` - The ID of the workspace type of the related workspaces that are displayed.
If configured, a specific icon for the workspace type is diplayed in the header.

`title` - The displayed widget header title.
The title is also used in case no workspaces are returned from server to render the empty page.

`relationType` - The relation type the displayed related workspaces have to the selected workspaces.
Possible values are **child** and **parent**.

`collapsedView` - The configuration for the collapsed view.  
The collapsed view supports multiple properties. For the properties, hardcoded values and dynamic values (replacement tags) are supported.
Properties returned by the REST API are supported as replacement tags. Use them with leading and trailing curly bracket: {replacement tag}.
For example:
* {name}: The name of the related workspace
* {modify_date}: The modify date of the related workspace
* {custom_column}: A custom column configured in content server, for example, **{wnf_att_141g_5}**

`expandedView` - The configuration for the expanded view.

###### collapsedView

`noResultsPlaceholder` - Optional parameter. Message displayed in case there are no proper related workspaces available

`orderBy` - Optional parameter. A custom sort order of the displayed workspaces in the collapsed view
You can sort by all sortable columns, for example, by workspace name: { "sortColumn": "{name}", "sortOrder": "asc"}.
The default sort order is the configured title value ascending. For example, if the name is configured for title, then the default sort order is by name ascending.

`title` - The title for a the related workspace defined by a label and a value, for example, a name or a specific number of the related workspace.

`description` - Optional parameter. A description of the related workspace, displayed in the middle of the related workspace.
Replacement tags are supported.

`topRight` - Optional parameter. A label and a value displayed in the right upper corner of the related workspace, for example, the price.

`bottomLeft` - Optional parameter. A label and a value displayed in the left lower corner of the related workspace, for example, the customer name.

`bottomRight` - Optional parameter. A label and a value displayed in the right lower corner of the related workspace, for example, the close date.


**title, description, topRight, bottomLeft, bottomRight:**

`label` - Optional parameter. The label of the property, for example, a keyword describing the property
(**Close Date**, **Customer Name**, ...), or a unit (**$**, **€**, ...), ...
Is NOT supported for description! Replacement tags are supported.

`value` - The value of the property.
Replacement tags are supported. A format can be specifed inside the curly braces after the referenced column name:
"{wnf_att_141g_9:currency}". Currently only "currency" can be specified as *format* or nothing. Hint: Dates and Users are formatted automatically.

*format*

`key` - The identifier of the property/replacement tag, for example, **wnf_att_141g_5**.

`type` - The type of the value to specify how the value should be formatted.
Supported types: **currency**

###### expandedView

`orderBy` - Optional parameter. A custom sort order of the displayed workspaces in the expanded view.
It's possible to sort by all sortable columns e.g. by workspace name: { "sortColumn": "{name}", "sortOrder": "asc"}.

`customColumns` - The list of custom columns to be displayed in the expanded view.
The columns appear between the modify_date and favorite columns.
Additionally, custom workspace columns can be specified here.
Each element needs to specify the unique custom column identifier as property **key**.

The following columns are created during installation. They displayed by default and cannot be changed:
*    `type`: The default icon for the related business workspace (not the configured one), for this no header is displayed
*    `name`: The related business workspace name
*    `size`: The size of the related business workspace
*    `modify_date`: The modify date of the related business workspace
*    `favorite`: Icon that indicates if the related business workspace is part of user favorites, for this no header is displayed

