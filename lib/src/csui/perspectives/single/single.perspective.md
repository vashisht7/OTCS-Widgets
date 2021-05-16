# SinglePerspectiveView

Renders a perspective with a responsive grid containing a single cell
stretching over the entire page.

## SinglePerspectiveView(options)

Creates a new instance.

#### Options

context
: Application context

widget
: Specifies the widget (object literal, mandatory)

##### Widget

type
: Type of the widget; RequireJS module path to the directory with the widget's main
  view (string, mandatory)

options
: Initialization data for the widget, passed as `options.data` to the widget's main
  view (any type, optional)

### Examples

```javascript
// Create a single-zone perspective; see below for the layout examples
var perspectiveView = new SinglePerspectiveView({
      context: context,
      widget: {...}
    });
```

```json
// NodesTable filling the full container width and height
//
// Extra small and wider:
// +---------------------+
// |                     |
// |                     |
// |                     |
// |                     |
// +---------------------+
//
"widget": {
  "type": "csui/widgets/nodestable"
}
```

### See Also

[Grid Control](../../controls/grid/grid.md),
[Grid Perspective](../grid/grid.perspective.md)
