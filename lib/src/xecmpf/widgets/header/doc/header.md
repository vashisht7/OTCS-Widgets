# HeaderView (widgets/header)

The Extended ECM HeaderView (xecmpf/widgets/header) is based on the Connected Workspaces HeaderView (conws/widgets/header) and enhanced with widgets and metadata specific to Extended ECM Platform. 

## Features common to *conws* and *xecmpf* HeaderView

### Metadata
The header widget displays metadata of the business workspace. Metadata include information like title, workspace type, description and workspace icon. This metadata can either be configured using category attributes or can be filled with some static values. It also supports multiple languages. 

### Activity Feed widget
The administrator can embed the Activity Feed widget into the HeaderView. The embedded widget is displayed on the right half of the HeaderView.

## Extended ECM specific features of the HeaderView
The Extended ECM Platform HeaderView contains information about the business objects and connections to the respective business application

### Embedded Metadata widget
Alternatively to the Activity Feed widget, the Metadata widget can be embedded. Admins can configure the displayed metadata, which is filled by categories and attributes. These can be grouped accordingly.

Extended ECM Platform HeaderView provides the following ways from which admins can pick according to their needs.

**Show Metadata In Columns (Single/Double)** – Show metadata in single or double columns. The default is *double*.

**Hide Metadata (True/False)** – Hide metadata. The default is *False*, metadata is displayed.

**Hide empty fields (True/False)** — Hide metadata fields that contain no data. The default is *False*, empty metadata fields are displayed.

### Completeness check
With the Completeness Check, you can ensure that a business workspace contains all required documents. And if configured, the completeness check displays the count of missing documents on the Extended ECM Platform HeaderView.
Extended ECM Platform HeaderView provides the following Completeness Check configurations.

**Hide missing documents check (True/False)** – Hide the number of missing documents. The default is *False*.

**Hide outdated documents check (True/False)** – Hide the number of outdated documents. Only available with Extended ECM for SAP SuccessFactors. The default is *False*.

**Hide In process documents check (True/False)** – Hide the number of In process documents. Only available with Extended ECM for SAP SuccessFactors. The default is *False*.

### Favorite Icon
**Hide Favorite (True/False)** – Hide the favorite icon on the header widget

***

# Example

	require.config({
		config: {
			'xecmpf/widgets/header/header.view':{

				hideMetadata: true,
				hideDescription: true,
				hideActivityFeed: true,
				hideToolbar: true,
				toolbarBlacklist: ['Comment']
			}
		}
	})

    var contentRegion = new Marionette.Region({el: "body"});
    var header = new HeaderView({
      context: pageContext,
      data: {
        iconFileTypes: 'image/png',
        iconFileSize: '512000',
        workspace: {
          properties: {
            title: 'Workspace Title'
          }
        },
		widget: {
			type: 'metadata'
		},
		favoriteSettings: {
			hideFavorite: 'false'
		},
        completenessCheckSettings: {
          hideMissingDocsCheck: false
        },
        metadataSettings: {
          hideMetadata: false,
          hideEmptyFields: true,
          metadata: [
            {
              "type": "attribute",
              "categoryId": 8394,
              "attributeId": 2,
              "label": "Personnel Number"
            },
            {
              "type": "attribute",
              "categoryId": 8394,
              "attributeId": 5,
              "label": "Last Name"
            },
            {
              "type": "attribute",
              "categoryId": 8394,
              "attributeId": 6,
              "label": "First Name"
            },
            {
              "type": "attribute",
              "categoryId": 8394,
              "attributeId": 23,
              "label": "Phone Number"
            }
          ]
        }
      }
    });

    contentRegion.show(header);
    pageContext.fetch();
    });

# Parameters

## require.config

Following options can be controlled from require JS

+ `hideMetadata` – To hide the metadata view for the workspace.

+ `hideDescription` - To hide the description for the workspace.

+ `hideActivityFeed` - To hide the activityfeed view for the workspace.

+ `hideToolbar` - To hide complete toolbar for the workspace.

+ `toolbarBlacklist` - To blacklist the toolbar items specified. The arguments passed must be a valid command signature.


## options

`context` – The page context

`data` – The header configuration data

### data

`iconFileTypes` – Defines the file types that are allowed to upload. They are used to filter the HTML file input
  element. The defaults are the same as supported by the server.

`iconFileSize` – Defines the maximum upload file size. The default of 1000000 bytes matches the server setting
  and is used to render a hint to the user.

`workspace` – The workspace header view can display workspace metadata information. There are different sections
  in the metadata area that can be configured to display e.g. node, business object or category
  properties.

`widget` - The workspace header view can display other embedded widgets.

`completenessCheckSettings` – The workspace header view can display missing documents detail.

`metadataSettings` – The workspace header view can display metadata information in the child view section in the form of an   alpaca form which would be read only.

#### workspace

`title` – Header title usually used to display the workspace title. 

Replacement tags are supported with the following syntax:

+ `{name}` – Displays the workspace node property *name*

+ `{categories.20368_2}` – Displays the value of the workspace category with the id *20368* and the field id *2*.

+ `{business_properties.workspace_type_name}` – Displays the workspace type name that is configured for the business workspace type.


#### widget

`type` - The embedding widget type. Currently only 'metadata' and 'activityfeedwidget'

#### favoriteSettings

`hideFavorite` - To hide the favorite icon for the workspace. Default value is false.

#### completenessCheckSettings

`hideMissingDocsCheck` – To hide the missing documents check for the workspace. Default value is false.

#### metadataSettings

`hideMetadata` – To hide the metadata view for the workspace. Default value is false.

`hideEmptyFields` – To hide the empty fields in the metadata form. Default value is false.

`metadata` – An array of the category attributes to display in the metadata view.
It uses the following syntax:
```
   metadata: [
     {
       "type": "attribute",
       "categoryId": 8394,
       "attributeId": 2,
       "label": "Personnel Number"
     },
     {
       "type": "attribute",
       "categoryId": 8394,
       "attributeId": 6,
       "label": "First Name"
     }
   ]
```

# Header view in a Perspective configuration

The workspace header view is configured within the perspective configuration. See sample below.

    ...
    "header": {
        "widget": {
            "type": "xecmpf/widgets/header",
            "options": {
                "workspace": {
                    "properties": {
                        "title": "{name}"
                    }
                },
                "completenessCheckSettings": {
                    "hideMissingDocsCheck": false
                },
                "metadataSettings": {
                    "hideMetadata": false,
                    "hideEmptyFields": true,
                    "metadata": [
                        {
                            "type": "attribute",
                            "categoryId": 6634,
                            "attributeId": 2,
                            "label": "Personnel Number"
                        },
                        {
                            "type": "attribute",
                            "categoryId": 6634,
                            "attributeId": 5,
                            "label": "Last Name"
                        },
                        {
                            "type": "attribute",
                            "categoryId": 6634,
                            "attributeId": 6,
                            "label": "First Name"
                        },
                        {
                            "type": "attribute",
                            "categoryId": 6634,
                            "attributeId": 23,
                            "label": "Phone Number"
                        }
                    ]
                }
            }
        }
    }
    ...
