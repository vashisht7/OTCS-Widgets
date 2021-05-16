# Team widget (widgets/team)

 The Team widget provides an overview of the roles and members of the selected workspace.
 It can be used in a workspace perspective and provides a collapsed view and an expanded view.
 The collapsed view is displayed on a tile, the expanded view can be opened from within the collapsed view.

## Features

* Collapsed view

  The collapsed view displays a list of team members and empty roles. 

* Expanded View

  The expanded view provides a list for all members and a list for all roles.
  In the expanded view, the members and roles can also be edited.

## Constructor

### Example

```javascript
require([
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'conws/widgets/team/team.view'
], function (
  Marionette,
  PageContext,
  TeamView
) {
    var contentRegion = new Marionette.Region({el: "body"}),
        pageContext = new PageContext(),
        team = new TeamView({
            context: pageContext,
            data: {
                title: 'Team',
                titleBarIcon: 'title-icon title-team',
                showTitleIcon: true,
                showWorkspaceIcon: false
            }
        });

    contentRegion.show(team);
    pageContext.fetch();
});
```

### Parameters

#### options

`context` - The page context

`data` - The team configuration data

##### data

`title` - Defines the title of the collapsed view.

`titleBarIcon` - Defines the default titlebar icon for the view.

`showTitleIcon` - Defines whether to show the titlebar icon or not.

`showWorkspaceIcon` - Defines whether to show the default titlebar icon or to show the workspace icon. This only
applies to the expanded view.
