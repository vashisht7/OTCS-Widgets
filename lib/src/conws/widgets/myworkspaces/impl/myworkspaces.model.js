/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/nodes',
  'csui/models/browsable/browsable.mixin',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/mixins/expandable/expandable.mixin',
  'conws/utils/workspaces/impl/workspaces.collection.mixin'
], function (module, $, _, Backbone, Url,
    NodeCollection, BrowsableMixin, ResourceMixin, ExpandableMixin,
    WorkspacesCollectionMixin) {

  var config = module.config();

  var MyWorkspacesCollection = NodeCollection.extend({

      constructor: function MyWorkspacesCollection(models, options) {
        this.wherePart = ["where_workspace_type_id"];
        NodeCollection.prototype.constructor.apply(this, arguments);
        options || (options = {});
        this.options = options;

        this.makeBrowsable(options);
        this.makeResource(options);
        this.makeExpandable(options);
        this.makeWorkspacesCollection(options);
      }
  });

  BrowsableMixin.mixin(MyWorkspacesCollection.prototype);
  ResourceMixin.mixin(MyWorkspacesCollection.prototype);
  ExpandableMixin.mixin(MyWorkspacesCollection.prototype);
  WorkspacesCollectionMixin.mixin(MyWorkspacesCollection.prototype);

  _.extend(MyWorkspacesCollection.prototype, {

      url: function () {
          var queryParams = this.options.query || {};
          queryParams = this.mergeUrlPaging(config, queryParams);
          if (queryParams.expanded_view === "true") {
            queryParams = this.mergeUrlSorting(queryParams);
          } else if (queryParams.sort) {
            delete queryParams.sort;
          }
          queryParams = this.mergeUrlFiltering(queryParams);

          queryParams.metadata = undefined;

          var url = Url.combine(this.getBaseUrl(), 'businessworkspaces');
          url = url.replace('/v1', '/v2');
          return url + '?' + this.queryParamsToString(queryParams);
        }
      }
  );

  return MyWorkspacesCollection;

});