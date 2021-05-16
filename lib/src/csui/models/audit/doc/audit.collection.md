# AuditCollection

AuditCollection loads the audit information of a CS node. When creating a new instance,
you need to pass an instance of the `[NodeModel](node.children.md)` to the constructor
to specify the target node.

It also provides information about :

* Audit columns, which is used to render header for the table.
* Audit events, which has all event types performed on the node. The event information is fetched along with auditCollection.

## Example

```
// Fetch the audit information of a CS node
var connector = new Connector({
      connection: {
        url: '//server/instance/cs/api/v1',
        supportPath: '/instancesupport'
      }
    }),
    parent = new NodeModel({
      id: 12345
    }, {
      connector: connector
    }),
    auditCollection = new AuditCollection(undefined, {
      node: parent
    });
auditCollection.fetch()
        .done(function () {
          console.log(auditCollection.length);
          console.log(auditEvents.length); //auditEvents gets populated when auditCollection is fetched.
        });
```