/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([], function () {
  'use strict';

  return {
    getModelFields: function (options) {
      return {
        properties: [],
        columns: []
      };
    },

    getModelExpand: function (options) {
      return {
        properties: ['reserved_user_id']
      };
    }
  };

});
