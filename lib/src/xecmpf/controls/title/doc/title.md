### Title (xecmpf/controls/title)

    The title can contain an icon and title,
    title control can be resued with the parameters icon & title.
    this control can be used anywhere, for example: dialog header.
    
### How to use the title

require(['csui/lib/marionette', 'xecmpf/controls/title/title.view'
    ],function( Marionette, TitleView) {
    
      var contentRegion = new Marionette.Region({
        el: '#content'
      });

      var titleView = new TitleView({
        icon: 'title-assignments',
        title: 'Title Control'
      });
      
      titleView.render();
      contentRegion.show(titleView);
    });

### paramters options

`icon`: icon-class,
`imageUrl`: icon image Url,
`imageClass`: icon imageClass for styles,
`title`: name of the title
