/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone'], function (Backbone) {
  return [
    {
      decides: function () {
        return Backbone.history.root && !!Backbone.history.root.match("xecm");
      },
      module: 'json!xecmpf/utils/perspective/custom.search.json'
    }
  ];
});