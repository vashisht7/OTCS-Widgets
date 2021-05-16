BlockingBehavior
================

Blocks user interaction in a view when the model or collection behind it
is being fetched or saved.  It uses the `BlockingView` and binds it to the
model and/or collection events accordingly.
 
### Example

```javascript
// Create a list, which shows a progress loading graphic and blocks user
// interaction while the data are being fetched from the server
ListView = Marionette.CollectionView.extend({
  childView: ListItemView,
  behaviors: {
    Blocking: {
      behaviorClass: BlockingBehavior
    }
  }
});
```
