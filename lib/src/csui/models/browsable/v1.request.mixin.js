/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url'
], function (_, $, Url) {

  var BrowsableV1RequestMixin = {

    mixin: function (prototype) {
      return _.extend(prototype, {

        makeBrowsableV1Request: function (options) {
          return this;
        },
        getBrowsableParams: function () {
          var query = {};
          var limit = this.topCount || 0;
          if (limit) {
            query.limit = limit;
            query.page = Math.floor((this.skipCount || 0) / limit) + 1;
          }
          if (this.orderBy) {
            var first = this.orderBy.split(',')[0].split(' ');
            if (this.orderBy.toLowerCase() === 'relevance') {
              query.sort = this.orderBy;
            } else {
              query.sort = (first[1] || 'asc') + '_' + first[0];
            }

          }
          if (!$.isEmptyObject(this.filters)) {
            for (var name in this.filters) {
              if (_.has(this.filters, name)) {
                var param = makeFilterParam(this.filters[name], name);
                if (param.key !== undefined) {
                  query[param.key] = param.value;
                }
              }
            }
          }
          return query;
        },
        getBrowsableUrlQuery: function () {

          var query = Url.combineQueryString(this.getBrowsableParams());
          return query;
        }

      });
    }

  };
  function makeFilterParam(value, name) {
    var param = {};
    if (value !== undefined && value !== null && value !== "") {
      param.key = "where_" + name;
      param.value = value;
    }
    return param;
  }

  return BrowsableV1RequestMixin;

});
