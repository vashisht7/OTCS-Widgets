# Nodeinfosprites

Fetches additional information for list of nodes.

The module `csui/utils/node.info.sprites` exports a Backbone.Collection instance with the
additional node information, which is expected by  a node model. When the additional information
is looked up, the rules are processed in a sequence and all matching rule add up to provide the
complete information.

##sequence
: Weight of the rule to put it to a sequence with the others; rules with lower
  sequence numbers are processed earlier than rules with higher numbers
  (integer, 100 by default)


Modules with additional node information have to be registered as extensions of the
`csui/utils/node.info.sprites` module in the product extension file.
For example, the module above is packaged as `contentsharing/utils/node.info.sprites`
and the `contentsharing-extensions.json` file refers to it:

```json
{
  "csui/utils/node.info.sprites": {
    "extensions": {
      "contentsharing": [
        "contentsharing/utils/node.info.sprites"
      ]
    }
  }
}
```
### Examples
define(['csui/lib/underscore', 'csui/lib/jquery'
], function (_, $) {
  'use strict';

  return [
    {
      sequence: 100,
      getCustomInfo: function (options) {
        var customInfo = '';//provide custom info for node
        return customInfo;
      }
    }
  ];

});