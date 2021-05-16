PerspectiveContext
==================

Extends the basic context, which can include and fetch models and collections,
with the ability to trigger perspective change.  If you show configurable
perspectives, which are supposed to show different content depending on the
context state (different layout, different widgets) this context will maintain
changes in the perspective model.  Typically, this context is used together
with the perspective panel, which loads the fitting perspective view, populates
it with widgets and fetches the context content.

```javascript
csui.require([
  'csui/utils/contexts/perspective/perspective.context',
  'csui/lib/marionette'
], function (PerspectiveContext, Marionette) {
  'use strict';

  var context = new PerspectiveContext(),

      PerspectivePanelView = Marionette.ItemView.extend({
        template: false,

        constructor: function PerspectivePanelView() {
          Marionette.View.prototype.constructor.apply(this, arguments);
          this.listenTo(context, 'change:perspective', function () {
            // 1. Use the context.perspective model to create
            //    and render the fitting perspective view
            // 2. Fetch context
          });
        }
      }),

      view = new PerspectivePanelView({
        context: context
      }),

      region = new Marionette.Region({
        el: '#content'
      });

  region.show(view);
  context.fetch();

});
```

Plugins
-------

Plugins descended from `PerspectiveContextPlugin` (csui/utils/contexts/perspective/perspective.context.plugin) can be registered. They will be constructed and stored within the context instance. They can override the constructor and methods `isFetchable(factory)`, `onCreate`, `onApply`, `onClear` and `onRefresh`.

### constructor

You can start listening on context events here. You should add your perspective-driving models to context here. Other plugins may not be created yet; it is not safe to ask context for perspective-driving models by their factories.

### onCreate

All perspective plugins have been created. You can start listening on context events here. You can ask context for perspective-driving models owned by other plugins by their factories.

### onApply

The perspective has been decided, the application scope changed. If you want to take over the perspective application, you can do it here and return `false` to abort the original perspective application from happening. If your method is asynchronous, return a promise rejected with nothing instead of `false`.

If you want to abort the running perspective application, you have to prepare your model with the `perspective attribute and apply it. This is the typical structure of the `onApply` method:

```js
if (wantsTakeOver) {
  applicationScope.set('id', 'yourScope');
  this.context.applyPerspective(yourModelWithPerspective, forceChange);
  return false;
}
```

For example, let us say, that we do not want the usual perspective for Enterprise Workspace. We want the URL "/enterprise" and a custom perspective of out own, which we maintain as a JSON object in out module:

```js
onApply: function (sourceModel, forceChange) {
  var applicationScope = this.context.getModel(ApplicationScopeModelFactory);
  var nextNode = this.context.getModel(NextNodeModelFactory);
  var enterprise = this.context.getModel(EnterpriseModelFactory);
  // Recognize a perspective loaded by the node.perspective.context.plugin
  // which is going to display an ENterprise Workspace.
  if (applicationScope.id === 'nodes' && nextNode.get('type') === 141) {
    // Prepare the module driving the perspective change.
    enterprise.set(nextNode.attributes);
    enterprise.set('perspective', enterprisePerspective);
    // Change the application scope and apply the new perspective.
    applicationScope.set('id', 'enterprise');
    this.context.applyPerspective(sourceModel, forceChange);
    // Stop the original perspective from being applied.
    return false;
  }
}
```

The same scenario with an asynchronous `onApply`:

```js
onCreate: function (sourceModel, forceChange) {
  this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);
  this.nextNode = this.context.getModel(NextNodeModelFactory);
  this.enterprise = this.context.getModel(EnterpriseModelFactory);
}

onApply: function (sourceModel, forceChange) {
  // Recognize a perspective loaded by the node.perspective.context.plugin
  // which is going to display an ENterprise Workspace.
  if (this.applicationScope.id === 'nodes' && this.nextNode.get('type') === 141) {
    var deferred = $.Deferred();
    require('json!myext/perspectives/enterprise.json', function (perspective) {
      // Prepare the module driving the perspective change.
      this.enterprise.set(this.nextNode.attributes);
      this.enterprise.set('perspective', perspective);
      // Change the application scope and apply the new perspective.
      this.applicationScope.set('id', 'enterprise');
      this.context.applyPerspective(sourceModel, forceChange);
      // Stop the original perspective from being applied.
      deferred.reject();
      // Handle perspective loading falure.
    }.bind(this), deferred.reject);
    return deferred.promise();
  }
}
```

If your code fails, return a promise rejected with an error instance. A promise rejected with nothing will be handled the same as returning `false` - by aborting the perspective application silently. A resolved promise will be ignored.

Make sure, that you do not intercept perspective application, that you did yourself and end up in an endless loop.

### onClear

The perspective is going to be changed. All non-permanent context models have been discarded. You can clear a permanent model here. You can add a new model to context here.

### onRefresh

The perspective will remain and only the data will be re-fetched. All temporary context models have been discarded. You can reinitialize a permanent model here.
