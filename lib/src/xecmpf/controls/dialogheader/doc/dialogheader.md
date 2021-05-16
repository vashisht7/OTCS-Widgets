### DialogHeader (xecmpf/controls/dialogheader)

    Which is a custom header with 3 sections/regions.
    Can provide independent controls/views for the corresponding regions with options (leftView, centerView, rightView).
    Based on the options it will auto adjust the width.
    Has the ability to show or hide the close icon. (so that header can be used anywhere.)
    
### How to use the Dialogheader

require(['csui/lib/marionette', '../dialogheader.view', 'xecmpf/controls/title/title.view',
 'xecmpf/controls/headertoolbar/headertoolbar.view'
    ],function( Marionette, HeaderView, TitleView, HeaderToolbarView) {
    
      var contentRegion = new Marionette.Region({
        el: '#content'
      });
      
      var headerToolbarView = new HeaderToolbarView({
          commands: commands,
          toolbarItems: toolbaritems
      });
      
      var titleView = new TitleView({
        icon: 'title-assignments',
        title: 'Title Control'
      });
      
      var headerView = new HeaderView({
       iconRight: 'icon-tileCollapse',
       hideDialogClose: true,
       leftView: headerToolbarView,     // left side, header toolbar with action buttons
       centerView: tilteView,           // center with icon & title.
       rightView: headerToolbarView1    // right side, header toolbar with action buttons
      });
      
      var dialogView = new DialogView({
        title: 'Medium Size',
        largeSize: true,
        bodyMessage: 'A message for medium size, nothing special here.',
        headerView: headerView
      });
      
      contentRegion.show(dialogView);
    });

### paramters options

`leftView` : headerToolbarView,  // left side, header toolbar with action buttons
`centerView` : tilteView,        // center with icon & title.
`rightView` : headerToolbarView1 // right side, header toolbar with action buttons

`iconRight` : 'icon-tileCollapse',  // class for icon
`hideDialogClose` : true,           // hide the close icon