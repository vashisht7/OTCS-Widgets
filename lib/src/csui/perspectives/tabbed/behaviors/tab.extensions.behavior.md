# TabExtensionsBehavior

**Module: csui/perspectives/tabbed/behaviors/tab.extensions.behavior**

This behavior adds scrollable functionality to the tabs of the tabbed perspective view.When the
required options are passed, this behavior also adds left and right extensions to tab links section
of tabbed perspective view(csui/perspectives/tabbed/tabbed.perspective.view)

### Examples

```javascript
Add the behavior to the tab panel of the tabbed perspective

      this.behaviors = _.extend({
        TabExtensionsBehavior: {
          behaviorClass: TabExtensionsBehavior,
        }
      }, this.behaviors);
```

---
## TabExtensionsBehavior(options, view) {

Creates a new instance.

### Options - optional parameters

tabBarLeftExtensionViewClass
: Holds the view class of left extension

tabBarLeftExtensionViewOptions
: Holds the options for the view class of left extension

tabBarRightExtensionViewClass
: Holds the view class of right extension

tabBarRightExtensionViewOptions
: Holds the options for the view class of right extension


###view
: Tabpanel instance to which the behavior is added

#Scrollable tabs with left and right extensions configured
// +--------------+ +---------+ +-----+         +-------+ +-----------+  +-----------------+
// |Left Extension| |LeftArrow| | Tab2| --------| Tab10 | | RightArrow|  | RightExtension  |
// +--------------+ +---------+ +-----+         +-------+ +-----------+  +-----------------+

#Left and right extensions without scrolling
// +----------------+ +-----+ +-----+ +-----+    +----------------+
// |Left Extension  | | Tab1| | Tab2|         ---| Right Extension|
// +----------------+ +-----+ +-----+ +-----+    +----------------+

#Default view with no scrolling and no extensions
// +---------+ +----------+ +---------+ 
// |Overview | | Documents| | Related | 
// +---------+ +----------+ +---------+ 

 

