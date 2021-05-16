/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/url',
  'csui/models/browsable/v1.request.mixin',
  'csui/models/browsable/v2.response.mixin',
  'csui/models/mixins/appcontainer/appcontainer.mixin'
], function (_, Url, BrowsableV1RequestMixin, BrowsableV2ResponseMixin, AppContainerMixin) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      BrowsableV2ResponseMixin.mixin(prototype);
      BrowsableV1RequestMixin.mixin(prototype);
      AppContainerMixin.mixin(prototype);

      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          this.useSpecialPaging = options.useSpecialPaging;
          this.makeBrowsableV1Request(options)
              .makeBrowsableV2Response(options)
              .makeAppContainer(options);
          return this;
        },

        url: function () {
          var url;
          var apiUrl = new Url(this.node.connector.connection.url).getApiBase(2);


          var query;
          if (this.useSpecialPaging) {
            url = Url.combine(apiUrl, 'app/container', this.node.get('id'), 'page');
            var resourceFieldsQuery = { fields: _.without(this.getResourceFieldsUrlQuery().fields, 'properties')};
            query = Url.combineQueryString(
              this.getBrowsableUrlQuery(),
              resourceFieldsQuery
            );
          } else {
            url = Url.combine(apiUrl, 'nodes', this.node.get('id'), 'nodes');
            query = Url.combineQueryString(
              this.getBrowsableUrlQuery(),
              this.getResourceFieldsUrlQuery(),
              this.getExpandableResourcesUrlQuery(),
              this.getStateEnablingUrlQuery(),
              this.getAdditionalResourcesUrlQuery(),
              this.getRequestedCommandsUrlQuery()
            );
          }

          return Url.appendQuery(url, query);
        },

        parse: function (response, options) {
          if (this.useSpecialPaging) {
            var self = this;
            response.results = response.results.map(function (props) {
              return self.massageResponse(props);
            });
          }

          this.parseBrowsedState(response, options);
          return this.parseBrowsedItems(response, options);
        }
      });
    }
  };

  return ServerAdaptorMixin;
});
