# DescriptionView (controls/description)

The description view renders the desription with one line. 
and if more than on line of text is available it shows see more icon to expand.
in expanded view of description only 3 lines will be shown and scroll will be enabled after 3 lines.
and collapse icon will be there to collapse the description.

# Example

    var contentRegion = new Marionette.Region({el: "body"}),
        var options = {
                complete_desc: "Sample Desription..", 
                has_more_desc: false, 
                collapsedHeightIsOneLine: true, 
                hideShowLess: true
            };

          var descriptionView = new DescriptionView(options);
          contentRegion.show(descriptionView);
