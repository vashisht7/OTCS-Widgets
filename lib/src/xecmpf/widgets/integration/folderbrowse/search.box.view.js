/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/widgets/search.box/search.box.view',
  'i18n!xecmpf/widgets/integration/folderbrowse/impl/nls/localized.strings',
  "css!xecmpf/widgets/integration/folderbrowse/impl/folderbrowse"
], function (module, _, $, SearchBoxView, Lang) {
  "use strict";

  var config = _.defaults({}, module.config(), {
    showOptionsDropDown: false,
    showSearchInput: true,
    searchFromHere: true,
    customSearchIconClass: "xecmpf-icon-search",
    customSearchIconEnabledClass: "xecmpf-icon-search-md",
    placeholder: Lang.SearchFromHerePlaceHolder
  });

  var CustomSearchBoxView = SearchBoxView.extend({
    constructor: function CustomSearchBoxView(options) {
      options = options || {};
      options.data = _.defaults({}, options.data, config);
      SearchBoxView.prototype.constructor.call(this, options);
    },
    searchIconClicked: function (event) {
      event.preventDefault();
      event.stopPropagation();
      SearchBoxView.prototype.searchIconClicked.call(this, event);
    },
    inputTyped: function (event) {
      if (event.which === 32) {
        event.stopPropagation();
      } else {
        SearchBoxView.prototype.inputTyped.call(this, event);
      }
    }
  });

  return CustomSearchBoxView;

});
