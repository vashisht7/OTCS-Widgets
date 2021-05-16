# HelloView

Shows a panel greeting the currently authenticated user.  Sample usage:

    // Wrap the widget placeholder
    var region = new Marionette.Region(
          el: '#widget'
        }),
        // Create the data managing context
        context = new PageContext(),
        // Create the widget instance
        view = new HelloView({
          context: context
        });

      // Show the widget on the page
      region.show(view);
      // Load data from the server
      context.fetch();

### Connect to a real server
To change the sample to use an actual user and server: 
1. Remove the `session` section from the `require.config`.
2. Edit the `url` field in the `require.config` to point to an actual server. 
3. Remove the code referring to the `mock` object.
 
### Modify the greeting message
The localized message to display is defined in the `impl/nls/root/lang.js` file.

The message template is filled with the properties of the authenticated user in the `hello.view.js` file. 
