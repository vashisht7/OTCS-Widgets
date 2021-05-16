# BOAttachmentsView (widgets/boattachments)

The BusinessAttachmentsView displays a list of business attachments for a business object. Business Attachments are documents and other Content Server items, which are attached to a business object. 

This view is available in collapsed and in expanded view. In the expanded view, users see a table view with additional information for each business attachment such as location, modified, version, size, created, created by and modified by.

**Expanded view**:

The expanded view shows the columns:

*    Type: Mime type icon for the business attachment

*    Name: Business attachment name

*    Location: Parent folder of the business attachment

*    Modify date: Modify date of the business attachment

*    Favorite: Interactive icon indicating if the business attachment is part of user favorites

*    Version: Business attachment version

*    Size: Business attachment size

*    Created: Business attachment creation date

*    Created by: Creator of the business attachment

*    Modified by: User with most recently business attachment changes


**Filter and sorting** – 

Business attachments can be filtered by name, in both the collapsed and expanded view of the widget.

Business attachments can  be sorted by name and modified date from the expanded view.


**Snapshots** – 
From the expanded view, users can create a snapshot for all business attachments. Snapshots are folders in Content Server, which contain a generation of the latest version of each business attachment. A generation is a copy of a document, which is separated from the original document, unlike a version. The snapshot contains a shortcut to objects other than documents.


**To configure the Business Attachments widget:**

1. For a workspace container like the business workspace, the Business Attachments widget configuration properties are optional. If left empty, the  widget displays the business attachments for the business object associated with the current business workspace.

2. For any other Content Server container item, a  folder for example, the Business Attachments widget configuration properties are configured via category attribute. Attributes are *business object ID*, *business object type*, and *business application ID*.

3. In an integration scenario where a Content Server container item is not available, the configuration properties can be set to fixed values.
***

# Example

	var contentRegion = new Marionette.Region({el: '#content'}),
		pageContext = new PageContext(),
		boAttachmentsView = new BOAttachmentsView({
			"context": pageContext,
			"data": {
				"busObjectId": '0000000175',
				"busObjectType": 'KNA1',
				"extSystemId": 'D9A',
					"businessattachment": {
						"properties": {
							"busObjectId": "{categories.294244_2} ",
							"busObjectType": "{categories.294244_3} ",
							"extSystemId": "{categories.294244_4} "
						}
				},
				"collapsedView": {
					"bottomLeft": {
						"label": {
								"en": "Modified by"
						},
						"value": "{wnd_modifiedby}"
					},
					"bottomRight": {
						"label": {
							"en": "Size"
						},
						"value": "{size}"
					},
					"description": {
						"value": "{modified}"
					},
					"noResultsPlaceholder": {
						"en": "No business attachments"
					},
					"orderBy": {
						"sortColumn": "{name}",
						"sortOrder": "asc"
					},
					"title": {
						"value": "{name}"
					},
					"topRight": {
						"label": {
							"en": "Version"
						},
						"value": "{wnd_version}"
					}
				},
				"expandedView": {
					"orderBy": {
						"sortColumn": "{name}",
						"sortOrder": "desc"
					}
				},
				"foldername": "Snapshot",
				"title": {
					"en": "Joe Masson"
				}
			}
		});

		contentRegion.show(boAttachmentsView);
		pageContext.fetch();

***

# Parameters

## options

`context`: The page context

`data`: The common widget configuration

### data

`busObjectId` – ID of a business object linked with a business workspace.

`busObjectType` – Type of a business object connected with a business workspace.

`extSystemId` – ID of an external system linked with a business workspace.

`title` – Widget header title.

`collapsedView` – The configuration for the collapsed view. The collapsed view supports multiple properties. For the properties fixed values and dynamic values (replacement tags) are supported. 
The supported replacement tags are the properties returned by the REST API with leading and trailing curly bracket: `{replacement tag}`. 

Examples for replacement tags:
   
   * `{name}`: The name of the related workspace
   
   * `{modify_date}`: The modify date of the business attachment

`expandedView` – The configuration for the expanded view.

#### collapsedView

`noResultsPlaceholder` – Optional parameter – Message displayed in case there are no business attachments found.

`orderBy` – Optional parameter – A custom sort order of the displayed business attachments in the collapsed view. It is possible to sort by all sortable columns, for example, by business attachment name: {*sortColumn*: *\{name}*, *sortOrder*: *asc*}.
The default sort order is the configured title value ascending. for example, if the name is configured for title, then the default sort order is by name ascending.

`title` – The title for a business attachment list item defined by a label and a value, for example, a name.

`description` – Optional parameter – A description of the business attachment, displayed in the middle of the business attachment list item. Replacement tags are supported.

`topRight` – Optional parameter – A label and a value displayed in the right upper corner of a list item, for example the version

`bottomLeft` – Optional parameter – A label and a value displayed in the left lower corner of the business attachment list item, for example, the modified by field

`bottomRight` – Optional parameter – A label and a value displayed in the right lower corner of the business attachment list item, for example, the size

**title, description, topRight, bottomLeft, bottomRight**

`label` – Optional parameter – The label of the property, for example, a keyword describing the property, for example, *Version* or *Size*. Replacement tags are supported.

`value` – The value of the property. Replacement tags are supported.


#### expandedView

`orderBy` – Optional parameter – A custom sort order of the displayed business attachments in the expanded view. It's possible to sort by all sortable columns, for example, by business attachment name: {*sortColumn*: *\{name}*, *sortOrder*: *asc*}.
