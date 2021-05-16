/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/widgets/search.results/search.results.view',
  'i18n!xecmpf/widgets/integration/folderbrowse/impl/nls/localized.strings',
  "css!xecmpf/widgets/integration/folderbrowse/impl/folderbrowse"
], function (module, _, $, SearchResultsView, Lang) {
  "use strict";

  var CustomSearchResultsView = SearchResultsView.extend({
    constructor: function CustomSearchResultsView(options) {
      options = options || {};
      options = _.extend(options, options.data);
      SearchResultsView.prototype.constructor.call(this, options);
      this.listenTo(this,"go:back",function(){
        history.back();
      })
    }
  });

  return CustomSearchResultsView;

});
