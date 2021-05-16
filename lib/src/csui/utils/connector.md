Module csui/util/connector
==========================

This module contains a utility object for the Content Server connection - `Connector`.

Connector
---------

Utility object for the Content Server connection.

Widgets create this object internally to establish a connection to the Content Server, but it can be created and passed to the widget from the client code too, if there are multiple widgets on the page and they should share the same server connection.

Example:

```js
// Ensure initialization of the framework.
csui.onReady(function() {

  // Specify the server connection settings.
  var connection = {
        url: "//server/otcs/cs/api/v1",
        supportPath: "/otcssupport"
      },
      // Create the server connecting object.
      connector = new csui.util.Connector({
        connection: connection
      }),
      // Pass the connector to a widget.
      folderbrowser = new csui.widget.FolderBrowserWidget({
        connector: connector,
        start: {id: 2000}
      }),
  // Display the widget.
  folderbrowser.show({placeholder: '#target'});

});
```

### Constructor

Creates a new connector instance.

Parameters:

* options - object literal with initial settings

Properties of `options`:

* connection  - object with the API url and other parameters of the server connection
* headers     - object with HTTP headers to add to every request

Properties of `connection`:

* url         - string pointing to the URL root of the REST API, for example: //server/otcs/cs/api/v1/
* supportPath - string with the URL path to the static resources, usually the CGI path with the "support" suffix: "/otcssupport" here //server/otcs/cs/api/v1/
* session     - object with `ticket` property containing a string obtained from the server to authenticate the API requests
* credentials - object with `username`, `password` and `domain` properties to authenticate the API requests with
* authenticationHeaders - object with properties for HTTP headers which are provide the authentication information

The minimum connection settings include the `url` and `supportPath` properties. The authentication will take place interactively as soon as the first server call will take place:

```js
connection: {
  url: '//server/otcs/cs/api/v1',
  supportPath: '/otcssupport'
}
```

The connection settings can contain an access token (ticket) to use an already pre-authenticated session. The ticket can be obtained by the `/auth` API request handler:

```js
connection: {
  url: '//server/otcs/cs/api/v1',
  supportPath: '/otcssupport',
  session: {
    ticket: '...'
  }
}
```

The connection settings can also contain user credentials for the automatic authentication:

```js
connection: {
  url: '//server/otcs/cs/api/v1',
  supportPath: '/otcssupport',
  credentials: {
    username: 'guest',
    password: 'opentext',
    domain: '' // optional
  }
}
```

At last, the connection settings can contain HTTP headers which are acepted by a server side login callback to authenticate the API request:

```js
connection: {
  url: '//server/otcs/cs/api/v1',
  supportPath: '/otcssupport',
  authenticationHeaders: {
    OTDSTicket: '...'
  }
}
```

Returns:

  The newly created object instance.
  
Example:

  See the `Connector` object for an example.

### makeAjaxCall(options) : promise

Replacement for the direct usage of `$.ajax` in Smart UI.

The best practice to exchange the data with the server is using Backbone and implementing the communication by overriding methods "url" and "parse". But sometimes it is difficult to find a CRUD mapping for a functional API request. In that case, use `connector.makeAjaxCall` instead of `$.ajax`. It will take care of the following scenarios, which `$.ajax` does not cover:

* Refresh the authentication ticket automatically, once it expires.
* Support mocking with mockjax.
* Enable running on other platforms, than CS.
  - Force GET requests to pass their data always as URL parameters.
  - Ensure content type "multipart/form-data" if `FormData` is used.
  - Change content type "application/json" to "application/x-www-form-urlencoded" and wrap request body to satisfy the non-standard CS REST API request format.

The `options` parameter and the returned promise are the same as `$.ajax` describes them. Structured request and respone data are supposed to be handled always as JSON objects.

```js
// Get basic node information
connector.makeAjaxCall({
  url: '.../api/v1/nodes/123',
  data: {
    fields: ['properties']
  }
}).then(function (response) {
  console.log(response);
}).catch(function (error) {
  console.error(error);
});

// Get current user information
connector.makeAjaxCall({
  url: '.../api/v1/auth'
});

// Get user picture
connector.makeAjaxCall({
  url: '.../api/v1/members/123/photo',
  dataType: 'binary'
});

// Rename a node
connector.makeAjaxCall({
  type: 'PUT'
  url: '.../api/v1/nodes/123',
  data: {name: 'New name'}
})

// Add a new version
var data = new FormData();
data.append('file', file);
connector.makeAjaxCall({
  type: 'POST'
  url: '.../api/v1/nodes/123/versions',
  data: data
})
```