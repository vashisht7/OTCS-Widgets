### HeaderToolbar (xecmpf/controls/headertoolbar)
   HeaderToolbar view will render the toolbar items & execute the command on clicking the toolbar item.
   By default we are supporting the 3 regions for toolbars.
    - filter toolbar
    - Add toolbar
    - other toolbar
   
   this control is like csui/controls/tableToolbar, but this toolbar is independent to the node modal.
 
 Note:
 ----
 Toolbar Names should be used in toolbarItems definition : 
    - FilterToolbar, AddToolbar, OtherToolbar
 
### How to use the HeaderToolbar

var toolbarItems = {

    FilterToolbar: new ToolItemsFactory({
          main: [
            {
              signature: "test_add",
              name: "Add",
              icon: "icon icon-toolbarAdd"
            }
          ]
        },
        {
          maxItemsShown: 1, // force toolbar to immediately start with a drop-down list
          dropDownIcon: "icon icon-toolbar-more"
        })
  }

require(['csui/lib/marionette', '../headertoolbar.view', 'csui/utils/commands',
      'toolbaritems', 'commands/test_add', 'commands/test_filter'
    ],function( Marionette, HeaderToolbarView, Commands, toolbaritems,
        AddCommand) {
              
      var contentRegion = new Marionette.Region({
        el: '#content'
      });

      var commands = Commands;
      commands.add(new AddCommand());

      var headerToolbarView = new HeaderToolbarView({
        commands: commands,
        toolbarItems: toolbaritems
      });

      contentRegion.show(headerToolbarView);
    });
  });


### paramters options

`toolbarItems`: the toolbar items to be displayed in the header.
`commands` : the corresponding commands to be executed for toolbar items.

Additional parameters:
----------------------
All the required parameters for commands. has to be passed with "headerToolbarView".
 
