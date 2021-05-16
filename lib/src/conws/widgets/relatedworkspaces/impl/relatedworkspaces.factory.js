/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/node',
  'conws/widgets/relatedworkspaces/impl/relatedworkspaces.model'
], function (module, _, Backbone,
             CollectionFactory,
             NodeModelFactory,
             RelatedWorkspaceCollection) {

  var RelatedWorkspaceCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'relatedWorkspaces',

    constructor: function RelatedWorkspacesCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var relatedWorkspaces = this.options.relatedWorkspaces || {};
      if (!(relatedWorkspaces instanceof Backbone.Collection)) {
        var node = context.getModel(NodeModelFactory, options),
            config = module.config();
        relatedWorkspaces = new RelatedWorkspaceCollection(relatedWorkspaces.models, _.extend({
          node: node
        }, relatedWorkspaces.options, config.options, {
          autoreset: true
        }, options));
      }
      this.property = relatedWorkspaces;
    },

    fetch: function(options) {
      return this.property.fetch(options);
    }

  });

  return RelatedWorkspaceCollectionFactory;

});
