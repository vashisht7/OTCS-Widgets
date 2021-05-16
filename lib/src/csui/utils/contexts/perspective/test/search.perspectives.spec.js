/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



define('test.search.perspectives', [], function () {
  return [
    {
      equals: {query_id: 123},
      module: 'json!test.search.perspective.json'
    }
  ];
});

define(['csui/lib/backbone',
  'csui/utils/contexts/perspective/search.perspectives'
], function (Backbone, searchPerspectives) {
  'use strict';

  describe('SearchPerspectives', function () {

    it('chooses the default search perspective by default', function () {
      var query = new Backbone.Model(),
          perspective = searchPerspectives.findByQuery(query);
      expect(perspective.get('module')).toEqual('json!csui/utils/contexts/perspective/impl/perspectives/search.json');
    });

    it('chooses a custom search perspective if its rules match', function () {
      var query = new Backbone.Model({query_id: 123}),
          perspective = searchPerspectives.findByQuery(query);
      expect(perspective.get('module')).toEqual('json!test.search.perspective.json');
    });

  });

});
