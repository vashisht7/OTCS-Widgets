# Authenticators

## Common Methods

### unauthenticate(options) : void

Discards authentication parameters by removing the authentication ticket or other means of authentication from the authenticator instance. The next AJAX call will require a new authentication request.

The `options` parameter should contain the property `reason` pointing to a string with the reason for unauthenticating:

* "logged-out" - an explicit logout has been initiated by the user. The window will be directed to the logout/login page automatically.
* "expired" - an invalid authentication ticket was detected, outgoing AJAX calls were suspended and a new authentication token is about to be requested, automatically or by a login form.
* "failed" - obtaining an authentication token has failed unrecoverably and the page will remain unusable.

This method trigges an event "loggedOut" on the authenticator propagating the `reason` property in the event arguments.

If the reason is "expired", the "loggedOut" event may be followed by the "loggedIn" event, as soon as a fresh authentication ticket has been obtained.

## Base Classes

These authenticators are meant to inherit from. They can be used to implement custom retrieval of authentication headers; either the built-in ticket or a custom one.

### Authenticator

Gives the freedom to implement any means of authentication.

### RequestAuthenticator

Provides functionality for authenticators, which make an initial AJAX call and obtain some authentication information. Usually a header value.

# Final Classes

These authenticators are meant to be instantiated and passed to a new connector instance. They can be chosen automatically by `Connector` depending on the connection parameters.

### BasicAuthenticator

Uses Basic Authentication to authenticate all AJAX calls.

```json
"credentials": {
  "username": "...",
  "password": "..."
}
```

### CredentialsAuthenticator

Uses user credentials for the initial call obtaining OTCSTicket and then continues using the ticket.

```json
"credentials": {
  "username": "...",
  "password": "..."
}
```

### InitialHeaderAuthenticator

Uses a custom authentication header for the initial call obtaining OTCSTicket and then continues using the ticket.

```json
"authenticationHeaders": {
  ...
}
```

### InteractiveCredentialsAuthenticator

Opens a modal dialog, as soon as a request is issued, which needs authentication. The dialog will ask for user credentials and perform the same login as `CredentialsAuthenticator` to obtain the authentication ticket.

### RegularHeaderAuthenticator

Uses a custom request header to authenticate all AJAX calls.

```json
"headers": {
  ...
}
```

### TicketAuthenticator

Uses the built-in OTCSTicket header to authenticate all AJAX calls.

```json
"session": {
  "ticket": "..."
}
```
