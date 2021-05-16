/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  "csui/utils/log",
  'csui/utils/url',
  "csui/models/resource"
], function ($, _, Backbone,
    log,
    Url,
    ResourceModel) {

  var WorkspaceContextNode = Backbone.Model.extend(
      _.defaults({

        workspaceSpecific: true,

        constructor: function WorkspaceContextNode(attributes, options) {
          options || (options = {});

          Backbone.Model.prototype.constructor.call(this, attributes, options);

          this.options = options;

          this.makeResource(options);

          this.listenTo(this.options.node, 'change:id', this.syncToNode);
          this.syncToNode();
        },

        syncToNode: function() {
          var node = this.options.node;
          var node_id = node.get("id");
          if (node.get("type")===848) {
            this.set({id:node_id,type:848});
          }
        },

        url: function () {
          var nodeId = this.options.node.get('id');
          var url = Url.combine(this.options.connector.connection.url, 'nodes', nodeId,
              'businessworkspace');
          url = url.replace('/v2', '/v1'); // yes, we need to send a v1 call!!!
          return url;
        },

        fetch: function (options) {
          if (this.options.node.get('type')!==848) {
            log.debug("Fetching the workspace id for {0} from server.", this) && console.log(log.last);
            options || (options = {});
            if (!options.url) {
              options.url = _.result(this, 'url');
            }
            return this.Fetchable.fetch.call(this, options);
          } else {
            log.debug("Fetching the workspace id for {0} from node.", this) && console.log(log.last);
            this.set({id:this.options.node.get('id'),type:848});
            return $.Deferred().resolve().promise();
          }
        },

        parse: function (response) {
          return {id:response.id,type:response.type};
        },

        toString: function () {
          return "node:" + this.get('id');
        }

      }, ResourceModel(Backbone.Model)));

  return WorkspaceContextNode;

});
