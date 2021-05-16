# CompleteCreateWorkspaceWidget (widgets/workspaces)

The creation and completion widget is designed to address the following two main  use cases when working with workspaces from a leading business application:

*	For the selected business object there is no early workspace but workspace templates available:
	* User clicks the plus icon to add a new workspace and gets a list of workspace templates displayed for selection.
	* When selecting a template the content server workspace creation dialog is displayed.
	* In the creation dialog category attributes mapped to business properties are prefilled automatically.
	* Category attributes with no business property mapping are kept as empty so user can manually modify them.


* For the selected business object, there are already early workspaces and workspace templates available:
	* User gets a list of early workspaces and select one workspace to complete the reference.
	* If the user does not find an appropriate early workspace, he creates a new workspace via the plus icon.

# Example

	 var workspacesWidget = new WorkspacesWidget({
        context: context,
        data: {
            busObjectId: '0000003456',
            busObjectType: 'KNA1',
            extSystemId: 'D9A'
        },
        // SAPRM-9350
        folderBrowserWidget: {
               commands: {
        										'open.full.page.workspace': {
        											enabled: false
        		              	}
            	}
        },
        // End of SAPRM-9350
        // SAPRM-9805
        viewMode: {
                mode: 'fullPage'
        }
        // End of SAPRM-9805
    });

    workspacesWidget.show({placeholder: '#widgetWMainWindow'});
    context.fetch();

# Parameters

## options

context
: The page context

data
: The common widget configuration

### data

busObjectId: ID of a business object

busObjectType: Type of a business object

extSystemId: ID of an external system

folderBrowserWidget.commands:
commands in folder browse widget can be enabled/disabled

viewMode.mode: 'fullPage' or 'folderBrowse' -
'fullPage': full page view (perspective view),
'folderBrowse': folder browse widget is shown
