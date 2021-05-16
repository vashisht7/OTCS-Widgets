/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/nodes',
  'csui/models/browsable/browsable.mixin',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/mixins/expandable/expandable.mixin',
  'conws/utils/workspaces/impl/workspaces.collection.mixin',
  'csui/models/node/node.model'
], function (module, $, _, Backbone, Url,
    NodeCollection, BrowsableMixin, NodeResourceMixin, ExpandableMixin,
    WorkspacesCollectionMixin) {

  var config = module.config();

  var RelatedWorkspacesCollection = NodeCollection.extend({

    constructor: function RelatedWorkspacesCollection(models, options) {
      this.wherePart = ["where_workspace_type_id", "where_relationtype"];
      NodeCollection.prototype.constructor.apply(this, arguments);
      options || (options = {});
      this.options = options;

      this.makeBrowsable(options);
      this.makeNodeResource(options);
      this.makeExpandable(options);
      this.makeWorkspacesCollection(options);

    }
  });

  BrowsableMixin.mixin(RelatedWorkspacesCollection.prototype);
  NodeResourceMixin.mixin(RelatedWorkspacesCollection.prototype);
  ExpandableMixin.mixin(RelatedWorkspacesCollection.prototype);
  WorkspacesCollectionMixin.mixin(RelatedWorkspacesCollection.prototype);

  _.extend(RelatedWorkspacesCollection.prototype, {

    url: function () {
      var queryParams = this.options.query || {};
      queryParams = this.mergeUrlPaging(config, queryParams);
      queryParams = this.mergeUrlSorting(queryParams);
      queryParams = this.mergeUrlFiltering(queryParams);
      var workspaceNodeId = this.node.get('id');
      var url = Url.combine(this.getBaseUrl(),
          'businessworkspaces', workspaceNodeId, 'relateditems');
      url = url.replace('/v1', '/v2');
      queryParams = _.omit(queryParams, function (value, key) {
        return value == null || value === '';
      });
      queryParams.metadata = undefined;
      return url + '?' + this.queryParamsToString(queryParams);
    }

  });

  return RelatedWorkspacesCollection;

});
