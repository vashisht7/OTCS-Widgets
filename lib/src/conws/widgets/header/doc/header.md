# Header widget (widgets/header)

The Header widget provides a summary of the selected workspace. It provides multiple
sections that can be configured in the perspective, for example, the title, workspace
type and a description. You can also embed a child view like the activity feed or additional metadata.

## Features

* Display workspace metadata

  The header widget displays metadata of the business workspace. 
Metadata include information like title, workspace type, description and a workspace icon. 
This metadata can either be configured using category attributes or can be filled with some static values. 
The Header widget also supports multiple languages. 

* Display activity feed widget

  In the header widget the activity feed widget can be embedded. 
It is displayed on the right half of the widget area.

## Constructor

### Example

```javascript
require([
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'conws/widgets/header/header.view'
], function (
  Marionette,
  PageContext,
  HeaderView
) {
    var contentRegion = new Marionette.Region({el: "body"}),
        pageContext = new PageContext(),
        header = new HeaderView({
            context: pageContext,
            data: {
                iconFileTypes: 'image/png',
                iconFileSize: '512000',
                workspace: {
                    properties: {
                        title: 'Workspace Title',
                        type: 'Workspace Type',
                        description: 'Workspace Description'
                    }
                },
                widget:{
                    type: 'activityfeed'
                }
            }
        });

    contentRegion.show(header);
    pageContext.fetch();
});
```

### Parameters

#### options

`context` - The page context

`data` - The header configuration data

##### data

`iconFileTypes` - Defines the file types that are allowed to upload.
They are used to filter the HTML file input element. 
The defaults are the same as supported by the server.

`iconFileSize` - Defines the maximum upload file size.
The default of 1000000 bytes matches the server setting and is used to render a hint to the user.

`workspace` - The header view can display workspace metadata information. 
There are different sections in the metadata area that can be configured 
to display e.g. node, business object or category properties.

`widget`- Another section in the header is reserved to embed a child view to display other related
workspace information.

###### workspace

`title` - Header title used to display the workspace title.
When the header widget is used in a perspective, this parameter can be configured in the perspective configuration using the setting **Workspace > Properties > Title**. 
Replacement tags are supported with the following syntax:

  - {name}: Displays the workspace node property 'name'.

  - {categories.20368_2}: Displays the value of the workspace category with the ID '20368' and the field ID '2'.

  - {business_properties.workspace_type_name}: Displays the workspace type name that is configured for the business workspace type.

`type` - The type area is usually used to display the workspace type. Replacement tags are supported.
When the header widget is used in a perspective, this parameter can be configured in the perspective configuration using the setting **Workspace > Properties > Type**. 

`description` - Configurable area to display a workspace description. Replacement tags are supported.
When the header widget is used in a perspective, this parameter can be configured in the perspective configuration using the setting **Workspace > Properties > Description**. 

###### widget

`type` - Defines the child view type in the standard style.
When the header widget is used in a perspective, this parameter can be configured in the perspective configuration using the setting **Widget > Embed widget**. 
Following widgets are supported:

  - `activityfeed`: Displays the activity events for the workspace and its children with the default options:

```javascript
		options: {
			feedtype: 'all',
			feedsize: 10,
			feedSettings: {
				enableComments: true,
				enableFilters: false
			},
			hideExpandIcon: true
		}
```
