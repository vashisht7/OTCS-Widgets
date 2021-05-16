# MetadataView (widgets/metadata)

The metadata view provides ...

# Example

    var contentRegion = new Marionette.Region({el: "body"}),
        pageContext = new PageContext(),
        header = new MetadataView({
            context: pageContext,
            data: {
                ... TODO ...
            }
        });

    contentRegion.show(metadata);
    pageContext.fetch();

# Parameters

## options

context
: The page context

data
: The metadata configuration data

### data

...

# Configuration

The header view is configured within the perspective configuration. See sample below.

    ...
    "metadata": {
        "widget": {
            "type": "conws/widgets/metadata",
            "options": {
                ... TODO ...
            }
        }
    ...
