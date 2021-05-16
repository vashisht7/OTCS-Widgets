# Mixins for Controls

Here you can find prototype partials to be "mixed in" to your view objects.  You
get additional functions in your prototype coming from the *mixins*.

Mixins should not replace your existing methods or methods you inherit from a parent object.
You are supposed to call the mixin methods explicitly to gain the added functionality. If
they override a Backbone method, it should be documented and you need to be careful
about the order you apply the mixins.

Mixins export an object literal to be merged with the prototype of the target view
by calling its static `mixin` function:

```
MyMixin.mixin(MyView.prototype);
```
