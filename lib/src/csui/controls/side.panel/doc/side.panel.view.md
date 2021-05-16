# SidePanelView

Shows a panel sliding from left/right based on configuration provided. Sidepanel can be used to show a single view or multiple views (as slides) provided to it. If `slides` provided to the panel, panel will show navigation buttons on footer along with button provided to the respective slide.
`side.panel` has modal behaviour by default which optionally can pass using constructor param as well (`options.modal`)

## Constructor Summary

### constructor(options)

  Creates a new SidePanelView.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.backdrop` - *Boolean|String* Default `static`. Includes a `sidepanel-backdrop` element. Alternatively, specify `static` for a backdrop which doesn't close the modal on click.
 url to authenticate against.
* `options.keyboard` - *Boolean* Default `true`. Closes the modal when escape key is pressed.
* `options.focus` - *Boolean* Default `true`. Puts the focus on the modal when initialized.
* `options.openFrom` - *String* to open panel from `left` or `right`. Default value is `right`.
* `options.slides` - *Array* of slides to display, navigates using back, next buttons at footer. Also see [Slide Configuration](#slide-configuration)
* `options.title` - *String* Title to be userd for header. Considered only when `slides` are empty. 
* `options.content` - *View* View to be displayed as content. Considered only when `slides` are empty. 
* `options.buttons` - *Array* of buttons to be displayed at footer. Considered only when `slides` are empty. 
* `options.footer` - *Object* of Footer configuration as follows. Considered only when `slides` are empty. 
* `options.footer.hide` - *Boolean* If footer should be hidden for the content currently displayed.
* `options.leftButtons` -  *Array* of buttons to be displayed at footer (left side).
* `options.rightButtons` -  *Array* of buttons to be displayed at footer (right side).


#### Slide configuration:
* `title` - *String* Considered when `slides` are empty. Title to be userd for header.
* `headerView` -  *View* to be used to display at header aread. Overrides `title` option.
* `options.content` - *View* Content to be displayed.
* `containerClass` - *String* Class to be added to sidepanel when this slide is being displayed.
* `buttons` - *Array* of buttons to be displayed at footer.
* `footer` - *Object* of Footer configuration as follows.
* `footer.hide` - *Boolean* If footer should be hidden for the content currently displayed.
* `leftButtons` -  *Array* of buttons to be displayed at footer (left side).
* `rightButtons` -  *Array* of buttons to be displayed at footer (right side).

#### Returns:

  The newly created object instance.

## Events
Following are the events triggered by side panel
### before:show

### after:show

### before:hide

### after:hide

### show:slide
This event will be fired before showing a slide
#### Parameters:
* `slide` - 
* `slideIndex` - 

### shown:slide
 This event will be fired after showing a slide
#### Parameters:
* `slide` - 
* `slideIndex` - 

## API

### show

### hide

### destroy

### updateButton


## Examples

### Simple Usage
      var sidePanel = new SidePanelView({
          title: 'Simple Usage Title',
          content: new Backbone.View(),
          buttons: [{
            label: 'Button1'
          }]
      });
      sidePanel.show();
### Customize Footer
    var sidePanel = new SidePanelView({
        headerView: new Backbone.View(),
        content: new Backbone.View(),
        footer: {
          leftButtons: [{
            label: 'Button1'
          }],
          rightButtons: [{
            label: 'Button2',
            id: 'btn2'
          }]
    });
    sidePanel.show();

### Wizard Style
      var sidePanel = new SidePanelView({
        slides: [{
            title: 'Step1',
            content: new Backbone.View(),
            buttons: [{
              label: 'Reset Form',
              className: 'binf-btn binf-btn-default'
            },
            {
              label: 'Search',
              disabled: true
            }]
          },
          {
            title: 'Step2',
            content: new Backbone.View(),
            buttons: [{
              label: 'Finish',
              close: true,
              className: 'binf-btn binf-btn-primary'
            }]
          }]
      });
      sidePanel.show();

## Localizations Summary

The following localization keys are used
