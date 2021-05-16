# StateRequestorMixin

Provides support for setting the `state` URL query parameter as introduced by the `api/v2/nodes/:id` or `api/v2/nodes/:id/nodes` (V2) resources.

Server responses may contain not only data, but also state properties, which would reduce the performce of the request, if they were always returned.

The state can be enabled or disabled. Enabling the state will include state properties for the enabled `fields` in the response.

### How to apply the mixin to a model

```
var MyModel = Backbone.Model.extend({
  constructor: function MyModel(attributes, options) {
    Backbone.Model.prototype.constructor.apply(this, arguments);
    this
      .makeConnectable(options)
      .makeFieldsV2(options)
      .makeStateRequestor(options);
  },

  url: function () {
    var url = Url.combine(this.connector.connection.url, 'myresource');
    var query = Url.combineQueryString(
      this.getResourceFieldsUrlQuery(),
      this.getStateEnablingUrlQuery()
    );
    return Url.appendQuery(url, query);
  }
  });

ConnectableMixin.mixin(MyModel.prototype);
FieldsV2Mixin.mixin(MyModel.prototype);
StateRequestorMixin.mixin(MyModel.prototype);
```

This mixin us usually combined together with the `ConnectableMixin` and `FieldsV2Mixin` or with another cumulated mixin which includes them.

### How to use the mixin

Enabkle or disable retrieval of the state by calling `enableState` or `disableState` and fetch the model:

```
// Set the expansion when creating the model
var model = new MyModel(undefined, {
      connector: connector,
      fields: {
        properties: ['parent_id', 'create_user_id']
      }
    });
model.fetch();

// Set the expansion after creating the model
model.setFields('properties', ['parent_id', 'create_user_id']);
model.fetch();
```

## makeFieldsV2(options) : this

Must be called in the constructor to initialize the mixin functionality. Expects the `Backbone.Model` or `Backbone.Collection` constructor `options` passed in.

Recognized option properties:

stateEnabled
: If the state retrieval should be enabled or not (boolean, `false` by default).

## stateEnabled : boolean

If the state retrieval should be enabled or not (`false` by default, read-only).

## enableState() : void

Enables retrieval of the object state.

```
// Enable retrieval of the object state
model.enableState();
```

## disableState() : void

Disables retrieval of the object state.

```
// Disable retrieval of the object state
model.enableState();
```

## getStateEnablingUrlQuery() : object

Returns an object with URL query parameters for the request URL construction. They can be concatenated with other URL query parts (both object literals and strings) by `Url.combineQueryString`.

```
var url = ...,;
var query = Url.combineQueryString(
  ...,
  this.getStateEnablingUrlQuery()
);
url = Url.appendQuery(url, query);
```

## See Also

`StateCarrierMixin`. `FieldsV2Mixin`
