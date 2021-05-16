# TKLFieldView (controls/form/fields/tklfield.view)

  Shows a `Table Key Lookup field`. The `TKLField` view shows an input field  
  control and shows dropdown field on typing or clicking on it, based on the type of tkl i.e. server typeahead or client side filtering.
  We can create dependencies among the TKL Fields and non tkl fields to tkl fields. Basic usecase of tkl field dependencies is: *Selecting Country and based on the country populating the state options and based on both country and states populating the cities options*.
  `TKLFieldView` is derived from [FormFieldView](./formfield.md) and inherits its state behavior behavior. `cstklfield.editable.behavior` defines the editable behavior of tkl and it inherits the `csformfield.editable.behavior`.
  The tkl field is implemented as a button in read state and as a html input field in write state.
  
  ## Significance
  * TKL Fields can fetch the data from database. Definitaion of TKL is a SQL query.
  * TKL to TKL dependencies and Non-TKL attributes to TKL dependencies.
  * TKL is useful when we have huge number of options to select value from. Server side tkl typeahead gives the good user experience with dropdown having very huge data.

### Example

   var tklField = new TKLFieldView({
     alpacaField: alpacaField,
     model: model
   });

## Constructor Summary

### constructor(options)

  Creates a new `TKLFIeldView`.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.model` - *Backbone.Model* holding the model used by the view.
* `options.alpacaField` - *Alpacafield instance* used by the view. This should also contain the connector and the connector config should contain the form view.

#### Returns:

  The newly created object instance.

## Areas where TKLs can be used
TKLs can be used in following:

* Metadata properties
* Custom View Search
* Business Workspace Metadata
* Workflow Forms

## Types of TKL

We can configure TKL by following ways

* TKL -> TKL
* TKL -> MV TKL
* MV TKL -> MV TKL
* MV TKL -> TKL
* TKL <-> TKL
* TKL & TKL -> TKL
* TKL -> TKL & TKL
* NON-TKL -> TKL
* Inside SET with all above combinations
* Inside & Outside SET combination of TKLs

> MV: Multivalued attributes

> NON-TKL: Textfield, Selectfield, Integer field, Datefield, Datetimefield.

There can be **N** number of dependencies