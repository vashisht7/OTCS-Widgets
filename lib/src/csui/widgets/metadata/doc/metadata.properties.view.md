# MetadataPropertiesView (widgets/metadata)

  The `MetadataPropertiesView` view provides the view of general and other metadata properties 
  of the node given through the context.  It allows for navigation, editing and getting form 
  values of the different types of metadata.

  This view can be embedded in another view such as for adding new items (folder, document, etc.)
  .  Whereas, the [MetaDataView](#) has more things such as the header bar, close button, dropdown 
  menu for Properties/Versions/Activities.

### Example

      var contentRegion = new Marionette.Region({el: '#content'}),
          pageContext   = new PageContext(), // holds the model
          currentNode   = pageContext.getModel(NodeModelFactory, {attributes: {id: 11111}});
          metaDataView = new MetadataPropertiesView({context: pageContext, node: currentNode});

      contentRegion.show(metaDataView);
      pageContext.fetch();

## Constructor Summary

### constructor (options)

  Creates a new `MetadataPropertiesView`.

#### Parameters:

* `options` - *Object* The view's options object.
* `options.context` - *Context* The current application's context.
* `options.node` - *Node* The node to show metadata of.

#### Returns:

  The newly created object instance.

#### Example:

  See the [MetadataPropertiesView](#) object for an example.

** module configuration to include the below properties.
* topAlignLabel: by default false ie., label and value/input field on same line,
*                true, means label and value/input fields algin veritically.
* hideStickyHeader: by default false, based on this flag, it renders content header view which
                 contains category name and required boolean input.

```javascript
require.config({
  'csui/widgets/metadata/metadata.properties.view': {
    topAlignLabel: true,
    hideStickyHeader: true // hides sticky content header view.
  }
});
```

## Methods

### validateForms ()

  Validates the metadata forms and returns true/false whether the validation passes or fails.

#### Returns:

  true or false.

### getFormsValues ()

  Returns the object containing form values (entered by the user) ready for server submission.
  Call this method if the validateForms() passes.

#### Returns:

  Object containing values in server's expected data structure.

## Events

### reset:switch
  
  As per funtionality, need to reset required field switch after performing any action like, adding/removing category/classfication/RMClassification
  
#### Example:
  Other modules can trigger event as like 
  var metadataPropertiesView = new new MetadataPropertiesView({...});
  metadataPropertiesView.trigger('reset:switch');

## Localizations Summary

The following localization keys are used

* `Properties` -  title for the widget's Properties tab
* `Versions` - title for the widget's Versions tab
* `Activities` -  title for the widget's Activities tab
* `General` - title for the widget's General tab
