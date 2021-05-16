/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone', 'csui/utils/url',
    'csui/models/mixins/connectable/connectable.mixin'],
  function (Backbone, Url, ConnectableMixin) {

  var ServerInfo = Backbone.Model.extend({

    propertyPrefix: 'serverInfo',

    constructor: function ServerInfo(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      this.makeConnectable(options);
    },

    url: function () {
      var url = Url.combine(this.connector.getConnectionUrl().getApiBase('v1'), 'serverInfo');
      return url;
    },

    parse: function (response) {
      return {
        hostAddress : response.server.url,
        viewerEnabled : (response.viewer && response.viewer.content_suite.enabled),
        advancedVersioningEnabled :  response.server.advanced_versioning
      };
    }

  });

  ConnectableMixin.mixin(ServerInfo.prototype);

  return ServerInfo;

});
