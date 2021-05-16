# Wfstatus Extension Controller

The Wfstatus extension controller object is the base object for the workflow progress view extensions in the
Smart UI. It contains extensions to Show an additional side bar view

The controller object has no state, only the context is provided to the constructor and saved in the controller object.
The workflow specific information is provided for each method, so that an instance could be reused between 
different workflows.

## Extension interface for data packages
The `WfstatusExtensionController` for data packages defines the following methods.

| Method     | Return value | Description                           |
|------------|--------------|---------------------------------------|
| validate   | Boolean      | Validates the controller for the given data package type and sub type |
| execute    | Promise      | Execute method for the controller.    |

### 'validate' for data packages
The validate method is called for each available data package type and each extension point.
The parameters for the method are the type and subtype value of the data package type.
The method returns `true` if the controller is responsible for the data package otherwise `false`.
**Hint**:The validate is called for any extension point and should therefore not be implemented
for a task extension

### 'execute' for data packages
The execute method is called for each extension point, which returned true for the 'validate'
method.

The parameters for the method are the current extension point, the WFstatusInfo model, the data for the data package and the parentView.


    options = {
        extensionPoint: WfstatusExtensionController.ExtensionPoints.AddSidebar,
        model: this.model,
        data: dataPackage.data,
        parentView: this
    };


The values for the extension point parameter are defined below.

- The extension point parameter is a pre defined value which indicates the place for the extension.
  
- The wfStatusInfo model represents the wfStatus in the workflow tracking widget. 
   
- The parentView is the view in which the extension will be loaded. This property is currently only for internal use.

The method has to return a promise object, so that the loading view could react on the asynchronous result.
The returned promise has to be resolved when the data for the view is available. 
The arguments of the `done` method must contain properties dependent from the selected extension point (See table).
The location in the widget where the view will be displayed is defined with the `extensionPoint` parameter.

In the case an error occurs during loading the information for the extension, the promise must be rejected.
The argument for the reject should contain a property `errorMsg`. This property is added to the global localized error message
about the failed loading of the extension.

#### Available extension points for data packages
The `WfstatusExtensionController` object contains an object `ExtensionPoints` which has all available extension points defined as members.
Currently the following integration points are defined and supported:

| Extension point | Description                                                              | Properties 				 |
|-----------------|--------------------------------------------------------------------------|---------------------|

| AddSidebar      | Shows an additional tab in the tabpanel view in the right side bar.			 | title							 |
|						      |																					                                 | viewToRender        |
|						      |																					                                 | viewToRenderOptions |
|						      |																					                                 | position					 	 |
|-----------------------------------------------------------------------------------------------------------------------------------
| title					| The title\caption to display in the tab of the tabpanel.
| viewToRender			| A marionette view as class object, the tabpanel instantiates the view itself 
| viewToRenderOptions	| The options the marionette view needs to be instantiated
| position				| Defines the order of the tabs, position 1 and 2 are already set and can't be used

For this extension points: The arguments are extended automatically in the 'done'
method with the fields 'type' and 'sub_type' containing the value of the data package 'type' and
'sub_type'.

## Registering extensions

The workflow extension are registered like the other extensions in the bundles extension json file.

To register the workflow extension add the following section to the extension json file and adjust the require.js path
to the location of the extensions controller object.
 

     "workflow/widgets/wfstatus/impl/wfstatus.progress.view": {
         "extensions": {
            "workflow": [
                "require.js path to the extensions controller object"
            ]
        }
    }

After a restart of the Content Server the json files are loaded and the extension is registered.

## Writing extensions

To write an extension for the workflow Smart View widget different modules are necessary.

1. Implementing an extension controller by inheriting the `WfstatusExtensionController`.
   **For data package extension:** Implement the 'validate' and 'execute' methods
2. Add the extension controller to the bundle extension json file
