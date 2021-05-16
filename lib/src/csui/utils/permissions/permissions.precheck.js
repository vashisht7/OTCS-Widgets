/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/taskqueue', 'csui/utils/url'
], function (module, _, $, Marionette, TaskQueue, Url) {

  var config = module.config();
  _.defaults(config, {
    parallelism: 3
  });

  var PermissionPrecheck = {
    includeSubTypesWithFolder: function () {
      return [0, 204, 207, 215, 298, 3030202];
    },
    includeSubTypes: function () {
      return [204, 207, 215, 298, 3030202];
    },
    fetchPermissionsPreCheck: function (options) {
      this.options = options;
      this.connector = options.connector || options.model.connector;
      this.options.applyTo.subTypes = [];
      var self     = this,
          subTypes = this.includeSubTypesWithFolder(),
          queue    = new TaskQueue({
            parallelism: config.parallelism
          }),
          nodeID   = self.options.model ? self.options.model.get('id') :
                     self.options.node.get("id"),
          url = Url.combine(self.connector.getConnectionUrl().getApiBase('v2'),
              'nodes/' + nodeID + '/descendents/subtypes/exists?sub_types='),
          promises = _.map(subTypes, function (subType) {
            var deferred = $.Deferred();
            queue.pending.add({
              worker: function () {
                var permissionPreCheck = {
                  url: url + subType,
                  type: 'GET',
                  data: {
                    include_sub_items: false
                  }
                };
                self.connector.makeAjaxCall(permissionPreCheck).done(function (response) {
                  if (response.results.data.subtypes_info !== undefined) {
                    self.options.applyTo.subTypes.push(response.results.data.subtypes_info[0].id);
                  }
                  self.options.applyTo.thresholdExceeded = response.results.data.threshold_exceeded;
                  deferred.resolve(response);
                }).fail(function (response) {
                  deferred.reject(response);
                });
                return deferred.promise();
              }
            });
            return deferred.promise(promises);  // return promises
          });
      return $.whenAll.apply($, promises);
    }
  };
  return PermissionPrecheck;
});
