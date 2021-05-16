csui.define([
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'esoc/widgets/utils/commentdialog/commentdialog.model',
], function (module, _, Backbone, ModelFactory, ConnectorFactory,
    CommentDialogModel) {
  'use strict';

  var commentModelFactory = ModelFactory.extend({
    propertyPrefix: 'comment',

    constructor: function commentModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var comment = this.options.comment || {},
          config = module.config();
      if (!(comment instanceof Backbone.Model)) {
        var creationOptions = {
          connector: this.options.connector || context.getObject(ConnectorFactory, options),
          csid: this.options.attributes.id
        }
        comment = new CommentDialogModel(comment.attributes, _.extend(creationOptions, comment.options, config.options));
      }
      this.property = comment;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  });

  return commentModelFactory;
});