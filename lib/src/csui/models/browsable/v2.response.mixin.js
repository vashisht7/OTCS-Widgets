/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore'
], function (_) {
  'use strict';

  var BrowsableV2ResponseMixin = {

    mixin: function (prototype) {
      return _.extend(prototype, {

        makeBrowsableV2Response: function (options) {
          this.orderBy = options.orderBy;
          return this;
        },

        parseBrowsedState: function (response, options) {
          var collection = response.collection || response,
              paging = collection.paging,
              sorting = collection.sorting,
              searching = collection.searching;
          if (paging) {
            this.actualSkipCount = (paging.page - 1) * (paging.limit || 0);
            this.totalCount = paging.total_count;
            this.filteredCount = paging.filtered_count || paging.total_count;
          } else {
            this.actualSkipCount = 0;
            this.filteredCount = this.totalCount = response.results.length;
          }
          if (sorting) {
            this.sorting = sorting;
            if (paging.columns) {
              var sortValue = sorting.sort[0].value,
                  markerIndex = sortValue.indexOf('_'),
                  sortKey = sortValue.substring(markerIndex + 1);

              var foundColumn;
              _.each(paging.columns, function (column) {
                if (column.sort_key === sortKey) {
                  foundColumn = column;
                }
              });

              if (foundColumn) {
                  this.sortingColumnKey = foundColumn.key;
              }
            }
          }
          if (searching) {
            this.searching = searching;
          }
        },

        parseBrowsedItems: function (response, options) {
          return response.results;
        }

      });
    }

  };

  return BrowsableV2ResponseMixin;

});
