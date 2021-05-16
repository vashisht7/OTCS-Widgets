/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/marionette', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/widgets/search.results/search.results.view',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/search.results.factory',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/utils/contexts/factories/search.metadata.factory',
  'csui/widgets/search.box/search.box.view',
  '../../../utils/testutils/async.test.utils.js',
  './search.results.mock.js', 'csui/lib/jquery.mousehover'
], function (Marionette, $, _, SearchResultsView, PageContext, SearchResultsCollectionFactory,
    SearchQueryModelFactory, SearchMetadataFactory, SearchBoxView, TestUtils, mock) {
  'use strict';
  describe('SearchResultsView', function () {

    beforeAll(function () {
      TestUtils.restoreEnvironment();
      mock.enable();
    });

    afterAll(function () {
      TestUtils.cancelAllAsync();

      mock.disable();
      TestUtils.restoreEnvironment();
    });

    describe('given empty configuration', function () {

      var pageContext, searchResultsView, collection, searchBoxView, query, boxRegion,
          resultsRegion, searchMetadataCollection, regionEl;

      beforeAll(function () {
        if (!pageContext) {
          pageContext = new PageContext({
            factories: {
              connector: {
                connection: {
                  url: '//server/otcs/cs/api/v1',
                  supportPath: '/support',
                  session: {
                    ticket: 'dummy'
                  }
                }
              }
            }
          });
        }
        var params           = {},
            searchQueryModel = pageContext.getModel(SearchQueryModelFactory);
        searchMetadataCollection = pageContext.getCollection(SearchMetadataFactory);
        params['where'] = "*";
        searchQueryModel.set(params, {
          silent: true
        });
        regionEl = $('<div></div>').appendTo(document.body);
        searchBoxView = new SearchBoxView({
          context: pageContext
        });
        boxRegion = new Marionette.Region({
          el: regionEl
        }).show(searchBoxView);

        searchResultsView = new SearchResultsView({
          context: pageContext
        });
        resultsRegion = new Marionette.Region({
          el: regionEl
        }).show(searchResultsView);
      });

      afterAll(function () {
        TestUtils.cancelAllAsync();

        searchResultsView.destroy();
        searchBoxView.destroy();
        boxRegion.destroy();
        resultsRegion.destroy();
        regionEl && regionEl.remove();
        TestUtils.restoreEnvironment();
      });

      it('can be constructed', function () {
        expect(searchResultsView instanceof SearchResultsView).toBeTruthy();
      });

      it('assigns right classes', function () {
        var className = searchResultsView.$el.attr('class');
        expect(className).toBeDefined();
        var classes = className.split(' ');
        expect(classes).toContain('csui-search-results');
      });

      it("search for any term and click on icon ", function () {
        searchBoxView.ui.input.text('abc');
        expect(searchBoxView.ui.searchIcon.length).toBe(1);
        searchBoxView.ui.searchIcon.trigger('click');
      });

      it('should fetch the model from SearchResultsCollection[Low]', function () {
        pageContext.fetch();
        var searchResultsCollection = pageContext.getModel(
            SearchResultsCollectionFactory);
        expect(searchResultsCollection.isFetchable()).toBeTruthy();

      });

      it('validate search results header title displayed with backend response',
          function (done) {
            setTimeout(function () {
              collection = searchResultsView.collection;
              var searchHeaderTitle = collection.searching ? collection.searching
                                                               .result_title : "";
              var headerTitle = searchResultsView.headerView.$el.find(
                  "#resultsTitle").text();
              expect(searchHeaderTitle).toEqual(headerTitle);
              done();
            }, 400);
          });

      it('validate pagination page size displayed with backend response[Medium]',
          function () {
            var searchPageSize = searchResultsView.options.pageSize;
            var pageSize = searchResultsView.paginationRegion.$el.find(".csui-pageSize")
                .text();
            pageSize = parseInt((pageSize.match(/\d/g)).join(""));
            expect(searchPageSize).toBeGreaterThanOrEqual(pageSize);
          });

      it('validate search results metadata', function () {
        var metadataCollectionLength = searchMetadataCollection.models.length;
        expect(metadataCollectionLength).toBeGreaterThan(0);
      });

      it('validate Search results total count displayed at Search Results Header and Footer with' +
         ' backend' +
         ' response[Medium]',
          function () {
            var searchHeaderTotalCount = searchResultsView.collection.totalCount;
            var headerTotalCount = searchResultsView.$el.find("#headerCount").text();
            headerTotalCount = parseInt((headerTotalCount.match(/\d/g)).join(""));
            var footerTotalCount = searchResultsView.$el.find(
                ".csui-total-container-items").text();
            footerTotalCount = parseInt((footerTotalCount.match(/\d/g)).join(""));
            expect(searchHeaderTotalCount).toEqual(headerTotalCount);
            expect(searchHeaderTotalCount).toEqual(footerTotalCount);
          });

      it('should render the folder node properly[High]', function () {
        var itemView = searchResultsView.$el.find(".csui-search-item-row").first();
        var itemName = itemView.find(".csui-search-item-name").length;
        expect(itemName).toEqual(1);
        var searchItemName = searchResultsView.collection.models[0].attributes.name;
        itemName = (itemView.find(".csui-search-item").text()).trim();
        expect(searchItemName).toEqual(itemName);
        var itemURL = itemView.find('.csui-search-item-link').attr('href');
        expect(itemURL).toMatch(/^(?:\w+:)?\/\/./);
        var breadCrumb = itemView.find(".binf-breadcrumb").length;
        expect(breadCrumb).toEqual(1);
        var mimeIcon = itemView.find(".csui-search-item-icon").length;
        expect(mimeIcon).toEqual(1);
        var favIcon = itemView.find(".csui-search-item-fav").length;
        expect(favIcon).toEqual(1);
        var checkBox = itemView.find(".csui-checkbox").length;
        expect(checkBox).toEqual(1);
        var searchCreated = searchResultsView.collection.models[0].attributes
            .create_date;
        var created = "2019-05-11T09:55:20";
        expect(searchCreated).toEqual(created);
        var searchModify = searchResultsView.collection.models[0].attributes
            .modify_date;
        var modified = "2018-05-12T19:49:07";
        expect(searchModify).toEqual(modified);

      });

      it('should show open Expand all in SearchResultsView for a single Item View[Medium]',
          function () {
            var itemView = searchResultsView.$el.find(".csui-search-item-row").first();
            var expandArrowDown = itemView.find(
                ".search-results-item-expand .icon-expandArrowDown").length;
            var expandArrowUp = itemView.find(
                ".search-results-item-expand .icon-expandArrowUp").length;
            expect(expandArrowDown).toEqual(1);
            expect(expandArrowUp).toEqual(0);
            itemView.find(
                ".search-results-item-expand .icon-expandArrowDown").trigger("click");
            expandArrowDown = itemView.find(
                ".search-results-item-expand .icon-expandArrowDown").length;
            expandArrowUp = itemView.find(
                ".search-results-item-expand .icon-expandArrowUp").length;
            expect(expandArrowUp).toEqual(1);
            expect(expandArrowDown).toEqual(0);
          });

      it('should show Expand all at Search toolbar in SearchResultsView[Medium]',
          function (done) {
            var searchToolBar = searchResultsView.$el.find(
                ".csui-search-tool-container");
            var expandAll = searchToolBar.find(".csui-expand-all").length;
            expect(expandAll).toEqual(1);
            var expandAllIcon         = searchToolBar.find(
                ".csui-search-header-expand-all .icon-expandArrowDown"),
                expandAllIconLength   = expandAllIcon.length,
                collapseAllIcon       = searchToolBar.find(
                    ".csui-search-header-expand-all .icon-expandArrowUp"),
                collapseAllIconLength = collapseAllIcon.length;
            expect(expandAllIconLength).toEqual(1);
            expect(collapseAllIconLength).toEqual(0);
            expandAllIcon.trigger("click");
            TestUtils.asyncElement('.csui-expand-all',
                ".csui-search-header-expand-all .icon-expandArrowUp:visible").done(
                function ($el) {
                  expect($el.is(':visible')).toBeTruthy();
                  done();
                });
          });

      it('verify all rows are collapsed on clicking "collapse all button"',
          function (done) {
            var collapseAllIcon       = searchResultsView.$el.find(
                ".csui-search-header-expand-all .icon-expandArrowUp");
            expect(collapseAllIcon.length).toEqual(1);
            collapseAllIcon.trigger("click");
            TestUtils.asyncElement('.csui-expand-all',
            ".csui-search-header-expand-all .icon-expandArrowDown:visible").done(
            function ($el) {
              expect($el.is(':visible')).toBeTruthy();
              done();
           });
      });

      it('should open Search sort dropdown options at Search toolbar in SearchResultsView[Medium]',
          function () {
            var sortLinks = searchResultsView.$el.find(".cs-sort-links").length;
            expect(sortLinks).toEqual(1);
            var sortDropdown = searchResultsView.$el.find(".csui-search-sort-options")
                .length;
            var sortDropdownOpen = searchResultsView.$el.find(
                ".csui-search-sort-options.binf-open").length;
            expect(sortDropdown).toEqual(1);
            expect(sortDropdownOpen).toEqual(0);
            searchResultsView.targetView.standardHeaderView.sortingView.ui.toggle.trigger('click');
            sortDropdown = searchResultsView.$el.find(".csui-search-sort-options")
                .length;
            sortDropdownOpen = searchResultsView.$el.find(
                ".csui-search-sort-options.binf-open").length;
            expect(sortDropdown).toEqual(1);
            expect(sortDropdownOpen).toEqual(1);
          });

      it('should show select all checkbox at Search toolbar in SearchResultsView[Medium]',
          function () {
            var selectAllCheckBox = searchResultsView.$el.find(
                ".csui-select-all.csui-search-item-check").length;
            expect(selectAllCheckBox).toEqual(1);
          });

      it('select the checkbox for any item in search result page 1, counter icon should appear',
          function (done) {
            var selectCheckBox = searchResultsView.$el.find(
                '.csui-checkbox-view button').eq(1);
            selectCheckBox.trigger('click');
            expect(searchResultsView.$el.find(
                '.csui-selected-counter-region .csui-selected-counter-value:visible')
                .length).toEqual(
                1);
            expect(parseInt(searchResultsView.$el.find(
                '.csui-selected-counter-region .csui-selected-counter-value:visible'
            ).text()))
                .toEqual(searchResultsView.collection.selectedItems.length);
            TestUtils.asyncElement(searchResultsView.$el,
                '.csui-loading-parent-wrapper',
                true).done(function (el) {
              expect(el.length).toEqual(0);
              done();
            });

          });

      it('click on select counter , should open drop-down', function () {
        var counter = searchResultsView.$el.find(
            '.csui-selected-counter-region button:visible');
        counter.trigger('click');
        expect(counter.attr('aria-expanded')).toEqual("true");
        expect(searchResultsView.$el.find(
            '.csui-selected-items-dropdown:visible').length).toBe(1);
        counter.trigger('click');
      });
      it('move to page 2, should get table-actions and counter icon', function (done) {
        var page2 = searchResultsView.$el.find(
            ".csui-paging-navbar > ul > li:not(.csui-overflow) > a[aria-label='Show page 2']");
        searchResultsView.$el.find('.csui-tabletoolbar ul').empty();
        page2.trigger('click');
        TestUtils.asyncElement(searchResultsView.$el, '.csui-tabletoolbar li').done(
            function (el) {
              expect(searchResultsView.$el.find(
                  '.csui-selected-counter-region .csui-selected-counter-value:visible'
              ).length).toEqual(
                  1);
              expect(el.length).toBeGreaterThan(0);
              expect(searchResultsView.$el.find(
                  ".csui-control.csui-checkbox[title='Select all results on current page.'][aria-checked='false']"
              ).length).toBe(
                  1);
              done();
            });
      });

      it('select all items from page 2, should see clear all icon when open drop-down',
          function (done) {
            var selectAllCheckBox = searchResultsView.$el.find(
                ".csui-select-all.csui-search-item-check button");
            selectAllCheckBox.trigger('click');
            TestUtils.asyncElement(searchResultsView.$el,
                '.csui-loading-parent-wrapper',
                true).done(function (el) {
              expect(el.length).toEqual(0);
              searchResultsView.$el.find('.csui-selected-counter-region button')
                  .trigger('click');
              expect(searchResultsView.$el.find(
                  '.csui-selected-count-clearall:visible').length).toEqual(1);
              expect(searchResultsView.$el.find(
                  ".csui-select-all.csui-search-item-check button[aria-checked='true']"
              ).length).toBe(
                  1);
              expect(parseInt(searchResultsView.$el.find(
                  '.csui-selected-counter-region .csui-selected-counter-value')
                  .text()))
                  .toEqual(searchResultsView.collection.selectedItems.length);
              expect(searchResultsView.$el.find('.csui-selected-item').length)
                  .toEqual(
                      searchResultsView.collection.selectedItems.length);
              done();
            });
          });

      it('click on unselect icon from drop-down in counter, unselect item from result page',
          function () {
            var collectionLength = searchResultsView.collection.selectedItems.length,
                unselectIcon     = searchResultsView.$el.find(
                    '.csui-selected-item .csui-deselcted-icon').first(),
                unselectItemName = searchResultsView.$el.find(
                    '.csui-selected-item .csui-selected-list-item-name').first().text();
            unselectIcon.trigger('click');
            expect(searchResultsView.collection.selectedItems.length).toBe(collectionLength - 1);
            expect(parseInt(searchResultsView.$el.find(
                '.csui-selected-counter-region .csui-selected-counter-value')
                .text()))
                .toEqual(collectionLength - 1);
            expect(searchResultsView.$el.find(
                '.csui-search-item-row .csui-search-item-name a[title=' +
                unselectItemName +
                '] ').parents('.selected').length).toBe(0);
          });

      it('click on clearAll icon, shows confirmation dialog, click on cancel should remain dropdown',
          function (done) {
            searchResultsView.$el.find(
                '.csui-selected-count-clearall > span:visible').trigger('click');
            TestUtils.asyncElement(document.body,
                '[role=alertdialog].binf-modal-dialog>.binf-modal-content').done(
                function (el) {
                  expect(el.length).toEqual(1);
                  var cancel = el.find('button[title="No"]');
                  expect(cancel.length).toEqual(1);
                  cancel.trigger('click');
                  TestUtils.asyncElement(document.body, '.binf-modal-content', true)
                      .done(
                          function (el) {
                            expect(searchResultsView.$el.find(
                                '.csui-dropmenu-container:visible').length).toBe(1);
                            done();
                          });
                });
          });

      it('click on clearAll icon, shows confirmation dialog, click on yes should reset all selection',
          function (done) {
            searchResultsView.$el.find(
                '.csui-selected-count-clearall > span:visible').trigger('click');

            TestUtils.asyncElement(document.body,
                '[role=alertdialog].binf-modal-dialog>.binf-modal-content').done(
                function (el) {
                  expect(el.length).toEqual(1);
                  var yes = el.find('button[title="Yes"]');
                  expect(yes.length).toEqual(1);
                  yes.trigger('click');
                  TestUtils.asyncElement(document.body, '.binf-modal-content', true)
                      .done(
                          function (el) {
                            expect(searchResultsView.collection.selectedItems.length).toBe(0);
                            expect(searchResultsView.$el.find(
                                '.csui-selected-counter-region .csui-selected-counter-value:visible'
                            ).length).toEqual(0);
                            expect(searchResultsView.$el.find(
                                '.csui-selected-items-dropdown:visible').length).toEqual(0);
                            expect(searchResultsView.$el.find(
                                ".csui-select-all.csui-search-item-check button[aria-checked='true']"
                            ).length).toBe(0);
                            done();
                          });
                });
          });

          it('verify facet panel is shown on clicking show filter panel', function(done) {
            var facetIcon = searchResultsView.$el.find('.csui-search-filter');
            facetIcon.eq(0).trigger('click');
            TestUtils.asyncElement(searchResultsView.$el, '.csui-facet-panel').done(
              function(el) {
                expect(el.is(':visible')).toBeTruthy();
                done();
            });
         });

         it('verify facet filters are loaded', function (done) {
            TestUtils.asyncElement(searchResultsView.$el, '.cs-list-group:visible').done(
              function(el) {
                expect(el.is(':visible')).toBeTruthy();
                done();
            });
         });

         it('verify facet panel is closed on clicking hide filter panel', function(done) {
           TestUtils.asyncElement(searchResultsView.$el,'.csui-search-filter').done(
             function (el) {
              el.eq(0).trigger('click');
              var collapsed = searchResultsView.$el.find('.icon-toolbarFilterCollapse');
              expect(collapsed.length).toBe(0);
              done();
           });
         });
    });

    describe('Search Best bets', function () {

      var pageContext, searchResultsView, collection, searchBoxView, query, boxRegion,
          resultsRegion, searchMetadataCollection, regionEl;

      beforeAll(function () {
        if (!pageContext) {
          pageContext = new PageContext({
            factories: {
              connector: {
                connection: {
                  url: '//server/otcs/cs/api/v1',
                  supportPath: '/support',
                  session: {
                    ticket: 'dummy'
                  }
                }
              }
            }
          });
        }
        var params           = {},
            searchQueryModel = pageContext.getModel(SearchQueryModelFactory);
        searchMetadataCollection = pageContext.getCollection(SearchMetadataFactory);
        params['where'] = "sample"; //Best bet search text
        searchQueryModel.set(params, {
          silent: true
        });
        searchBoxView = new SearchBoxView({
          context: pageContext
        });
        regionEl = $('<div></div>').appendTo(document.body);
        boxRegion = new Marionette.Region({
          el: regionEl
        }).show(searchBoxView);

        searchResultsView = new SearchResultsView({
          context: pageContext
        });
        resultsRegion = new Marionette.Region({
          el: regionEl
        }).show(searchResultsView);
      });

      afterAll(function () {
        TestUtils.cancelAllAsync();

        searchResultsView.destroy();
        searchBoxView.destroy();
        boxRegion.destroy();
        resultsRegion.destroy();
        regionEl && regionEl.remove();
        TestUtils.restoreEnvironment();
      });

      it('can be constructed', function () {
        expect(searchResultsView instanceof SearchResultsView).toBeTruthy();
      });

      it("search for any term and click on icon ", function () {
        searchBoxView.ui.input.text('sample');
        expect(searchBoxView.ui.searchIcon.length).toBe(1);
        searchBoxView.ui.searchIcon.trigger('click');
      });

      it('should fetch the model from SearchResultsCollection[Low]', function () {
        pageContext.fetch();
        var searchResultsCollection = pageContext.getModel(
            SearchResultsCollectionFactory);
        expect(searchResultsCollection.isFetchable()).toBeTruthy();
      });

      it('validate search results header title displayed with backend response',
          function (done) {
            setTimeout(function () {
              collection = searchResultsView.collection;
              var searchHeaderTitle = collection.searching ? collection.searching
                                                               .result_title : "";
              var headerTitle = searchResultsView.headerView.$el.find(
                  "#resultsTitle").text();
              expect(searchHeaderTitle).toEqual(headerTitle);
              done();
            }, 400);
          });

      it('Display promoted information', function () {
        var promotedInfo = searchResultsView.$el.find(".csui-search-promoted").length;
        expect(promotedInfo > 0).toBeTruthy();
      });

      it('Click on tabular view icon', function (done) {
        var tabularView = 'Tabular search view';
        expect($('.csui-tabular-view').attr('title').trim()).toBe(tabularView);
        TestUtils.asyncElement(searchResultsView.$el,
            ".csui-tabular-view").done(
            function (el) {
              var tabularViewIcon = $(".csui-tabular-view").is(":visible");
              expect(tabularViewIcon).toBeTruthy();
              el.trigger('click');
              done();
            });
      });

      it("Verifying the tabular search view should be loaded", function (done) {
        TestUtils.asyncElement(searchResultsView.$el, ".csui-nodetable").done(
            function (el) {
              expect(el.length).toEqual(1);
              expect(el.is(":visible")).toBeTruthy();
              done();
            });

      });

      it('verify whether location is displayed in tabular search view', function (done) {
        TestUtils.asyncElement(searchResultsView.$el,
            ".csui-table-cell-location-value").done(
            function (el) {
              expect(el.length).toEqual(searchResultsView.collection.length);
              done();
            });
      });

      it('should display search results in Standard search view', function (done) {
        var standardView = "Standard search view";
        expect($('.csui-tabular-view').attr('title').trim()).toBe(standardView);
        var viewToggleBtn = $('.csui-tabular-view');
        viewToggleBtn.trigger('click');
        TestUtils.asyncElement(searchResultsView.$el, ".csui-tabular-search-view",
            true).done(
            function (el) {
              var tabularView = 'Tabular search view';
              var standardView = $('.csui-tabular-view').attr('title').trim();
              expect(standardView).toEqual(tabularView);
              done();
            });
      });

    });

    describe('Tabular Search', function () {
      var pageContext, searchResultsView, collection, searchBoxView, query, boxRegion,
          resultsRegion, searchMetadataCollection, regionEl;

      beforeAll(function () {
        if (!pageContext) {
          pageContext = new PageContext({
            factories: {
              connector: {
                connection: {
                  url: '//server/otcs/cs/api/v1',
                  supportPath: '/support',
                  session: {
                    ticket: 'dummy'
                  }
                }
              }
            }
          });
        }
        var params           = {},
            searchQueryModel = pageContext.getModel(SearchQueryModelFactory);
        searchMetadataCollection = pageContext.getCollection(SearchMetadataFactory);
        params['where'] = "*";
        searchQueryModel.set(params, {
          silent: true
        });
        regionEl = $('<div></div>').appendTo(document.body);
        searchBoxView = new SearchBoxView({
          context: pageContext
        });
        boxRegion = new Marionette.Region({
          el: regionEl
        }).show(searchBoxView);

        searchResultsView = new SearchResultsView({
          context: pageContext
        });
        resultsRegion = new Marionette.Region({
          el: regionEl
        }).show(searchResultsView);
      });

      afterAll(function () {
        TestUtils.cancelAllAsync();

        searchResultsView.destroy();
        searchBoxView.destroy();
        boxRegion.destroy();
        resultsRegion.destroy();
        regionEl && regionEl.remove();
        TestUtils.restoreEnvironment();
      });
      it('can be constructed', function () {
        expect(searchResultsView instanceof SearchResultsView).toBeTruthy();
      });

      it('assigns right classes', function () {
        var className = searchResultsView.$el.attr('class');
        expect(className).toBeDefined();
        var classes = className.split(' ');
        expect(classes).toContain('csui-search-results');
      });

      it("search for any term and click on icon ", function () {
        searchBoxView.ui.input.text('abc');
        expect(searchBoxView.ui.searchIcon.length).toBe(1);
        searchBoxView.ui.searchIcon.trigger('click');

      });

      it('should fetch the model from SearchResultsCollection[Low]', function () {
        pageContext.fetch();
        var searchResultsCollection = pageContext.getModel(
            SearchResultsCollectionFactory);
        expect(searchResultsCollection.isFetchable()).toBeTruthy();

      });

      it("Check for the presence of tabular view icon", function (done) {
        TestUtils.asyncElement(searchResultsView.$el, ".csui-tabular-view").done(
            function () {
              var tabularViewIcon = $(".csui-tabular-view").is(":visible");
              if (searchResultsView.collection.length > 0) {
                expect(tabularViewIcon).toBeTruthy();
              } else {
                expect(tabularViewIcon).toBeFalsy();
              }
              done();
            });
      });

      it("Click on tabular view icon", function (done) {
        TestUtils.asyncElement(searchResultsView.$el, ".csui-tabular-view").done(
            function () {
              var tabularSearchIcon = searchResultsView.$el.find(
                  '.csui-tabular-view');
              tabularSearchIcon.trigger('click');
              done();
            });
      });

      it("Verifying the tabular search view should be loaded", function (done) {
        TestUtils.asyncElement(searchResultsView.$el, ".csui-nodetable").done(
            function () {
              var tabularView = searchResultsView.$el.find(
                  '.csui-nodetable');
              expect(tabularView.length).toEqual(1);
              done();
            });

      });

      it("Verify for select all to be present in table header row", function (done) {
        TestUtils.asyncElement(searchResultsView.$el,
            "table>thead>tr:first-child>th.csui-table-cell-_select").done(
            function () {
              var selectAll = searchResultsView.$(
                  'table>thead>tr:first-child>th.csui-table-cell-_select');
              expect(selectAll.length).toBe(1);
              var selectAllBtn = selectAll.find('.csui-checkbox');
              selectAllBtn.eq(0).trigger('click');
              done();
            });
      });

      it('verify table toolbar is displayed', function () {
         var tableToolbar = searchResultsView.$el.find('.csui-table-rowselection-toolbar.csui-table-rowselection-toolbar-visible');
         expect(tableToolbar.is(':visible')).toBeTruthy();
         var condensedHeader = tableToolbar.find('.csui-condensed-header-toggle');
         condensedHeader.eq(0).trigger('click');
      });

      it('verify header is displayed', function (done) {
         TestUtils.asyncElement(searchResultsView.$el, '.csui-search-header.csui-show-header').done(
           function(el) {
            expect(el.is(':visible')).toBeTruthy();
            var condensedHeader = searchResultsView.$el.find('.csui-condensed-header-toggle');
            condensedHeader.eq(0).trigger('click');
            done();
          });
      });

      it('verify header is not displayed', function (done) {
        TestUtils.asyncElement(searchResultsView.$el, '.csui-search-header').done(
          function(el) {
           var showHeader = !!el.eq(0).hasClass('csui-show-header');
           expect(showHeader).toBeFalsy();
           var selectAll = searchResultsView.$(
            'table>thead>tr:first-child>th.csui-table-cell-_select');
            var selectAllBtn = selectAll.find('.csui-checkbox');
            selectAllBtn.eq(0).trigger('click');
            done();
         });
     });

      it("Verify for column Type to be present in table header row", function (done) {
        TestUtils.asyncElement(searchResultsView.$el,
            "table>thead>tr:first-child>th.csui-table-cell-type").done(
            function () {
              var colType = searchResultsView.$(
                  'table>thead>tr:first-child>th.csui-table-cell-type');
              expect(colType.length).toBe(1);
              done();
            });
      });

      it("Verify for column Name to be present in table header row", function (done) {
        TestUtils.asyncElement(searchResultsView.$el,
            "table>thead>tr:first-child>th.csui-table-cell-name").done(
            function () {
              var colName = searchResultsView.$(
                  'table>thead>tr:first-child>th.csui-table-cell-name');
              expect(colName.length).toBe(1);
              done();
            });
      });

      it("checking for the presence of standard search view toggle button",
          function () {
            expect($(".csui-tabular-view .csui-svg-icon").is(":visible")).toBeTruthy();
          });

      xit("Checking for the presence of description icon", function () {
        expect($(".icon-description-toggle").is(":visible")).toBeTruthy();
      });

      it("Checking for the presence of sort option", function () {
        var sortButton = $('#csui-search-sorting').find(":button");
        expect(sortButton.length).toBe(1);
      });

      it("click on the sort button and check whether the menu has expanded",
          function () {
            var sortButton = $('#csui-search-sorting').find(":button");
            sortButton.trigger('click');
            expect($(".binf-dropdown-menu").is(":visible")).toBeTruthy();
          });

      it("After clicking on sort by date the respective name should appear as sorted option",
          function () {
            var openedDropDown = $("#csui-search-sorting").find(
                ".csui-search-sort-options.binf-open");
            expect(openedDropDown.length).toBe(1);
            $("a[data-csui-sortoption-id=OTObjectDate]").trigger('click');
            openedDropDown = $("#csui-search-sorting").find(
                ".csui-search-sort-options.binf-open");
            expect(openedDropDown.length).toBe(0);
          });
      it("Check whether arrow is displayed beside date column", function () {
        var sortArrow = searchResultsView.$el.find('.csui-sort-arrow.icon-sortArrowDown');
        expect(sortArrow.is(':visible')).toBeTruthy();
      });

      it("click on arrow button beside sort option", function (done) {
        var sortArrow = searchResultsView.$el.find('.search-sort-btn');
        sortArrow.eq(0).trigger('click');
        TestUtils.asyncElement(searchResultsView.$el, ".csui-sort-arrow.icon-sortArrowUp:visible").done(
          function (el) {
          expect(el.is(':visible')).toBeTruthy();
          done();
        });
      });

      xit("Check the sorting width", function () {
        var sortButtonWidth = $('#csui-search-sorting').width();
        expect(sortButtonWidth).toEqual(143);
      });

      describe('Rename an item from Search results', function () {
        var searchItem;

        it("Click on standard search view toggle button", function () {
          expect($(".csui-tabular-view").is(":visible")).toBeTruthy();
          $(".csui-tabular-view").trigger('click');
          expect($(".binf-list-group").length).toEqual(1);
        });

        it("Navigate to metadata page of a search item", function (done) {
          var itemLink = searchResultsView.$el.find('.csui-search-item-link')[
              1];
          expect(itemLink.innerText).toEqual("searchResults");
          searchItem = searchResultsView.$el.find('.csui-search-item-row').eq(
              0);
          searchItem.trigger('mouseover');
          TestUtils.asyncElement(
              ".csui-search-toolbar-container:not('binf-hidden') .csui-table-actionbar ul",
              "li[data-csui-command='properties'] .csui-toolitem").done(
              function (el) {
                expect(el.length).toEqual(1);
                el.trigger('click');
                done();
              });
        });

        it("Verifying the metadata view should be loaded", function (done) {
          TestUtils.asyncElement('.cs-properties-wrapper',
              ".metadata-inner-wrapper .csui-general-form").done(
              function (el) {
                expect(el.length).toEqual(1);
                done();
              });
        });

        it("Click on metadata-item-name-dropdown", function () {
          var itemDropdown = $('.csui-metadata-item-name-dropdown').find(
              ":button");
          expect(itemDropdown.length).toEqual(1);
          itemDropdown.trigger('click');
        });

        it("Click on Rename command in dropdown", function (done) {
          TestUtils.asyncElement('ul.binf-dropdown-menu',
              'li[data-csui-command="rename"] .csui-toolitem').done(function (el) {
            expect(el.length).toEqual(1);
            expect(el.text().trim()).toEqual("Rename");
            el.trigger('click');
            done();
          });
        });

        it("Rename the search item name from searchResults to RenamedItem",
            function (done) {
              var titleInput = $('.title-edit-div').find(".title-input");
              expect(titleInput.length).toEqual(1);
              expect(titleInput.val()).toEqual("searchResults");
              titleInput.val('RenamedItem');
              titleInput.trigger({
                type: 'keyup',
                keyCode: 13
              });
              TestUtils.asyncElement('.title-header', '.title').done(function (el) {
                expect(el.length).toEqual(1);
                expect(el.text().trim()).toEqual("RenamedItem");
                done();
              });
            });

        it("Verifying the renamed item in standard search", function (done) {
          $('.arrow_back').trigger('click');
          TestUtils.asyncElement(searchResultsView.$el,
              ".csui-search-item-link").done(
              function (el) {
                expect(el[1].innerText).toEqual("RenamedItem");
                done();
              });
        });

        it("Verifying the renamed item in tabular search", function (done) {
          var tabularSearchIcon = searchResultsView.$el.find(
              '.csui-tabular-view');
          expect(tabularSearchIcon.length).toEqual(1);
          tabularSearchIcon.trigger('click');
          TestUtils.asyncElement(searchResultsView.$el,
              ".csui-nodetable:visible").done(
              function (el) {
                expect(el.length).toEqual(1);
                TestUtils.asyncElement(".csui-nodetable",
                    ".csui-saved-item:visible").done(
                    function ($el) {
                      var changedName = $el.eq(0).find(".csui-table-cell-name-value").text().trim();
                      expect(changedName).toEqual("RenamedItem");
                      done();
                    });
              });
        });

        it("Navigate to permissions page of a search item", function (done) {
          var itemLink = searchResultsView.$el.find('.csui-table-cell-name-value')[
              0];
          expect(itemLink.innerText).toEqual("RenamedItem");
          searchItem = searchResultsView.$el.find('.odd.csui-has-details-row').eq(
              0);
          searchItem.trigger(
                {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
                TestUtils.asyncElement(searchResultsView.$el,'.csui-table-actionbar').done(
                  function(el) {
                    expect(el.is(":visible")).toBeTruthy();
                    done();
                  });
        });

        it("click on permissions command", function (done) {
          TestUtils.asyncElement(
            ".csui-table-actionbar ul",
            "li[data-csui-command='permissions'] .csui-toolitem").done(
            function (el) {
              expect(el.length).toEqual(1);
              el.trigger('click');
              done();
            });
        });

        it("Verifying the permissions view should be loaded", function (done) {
          TestUtils.asyncElement('body',
              ".cs-permissions-wrapper:visible").done(
              function (el) {
                expect(el.length).toEqual(1);
                done();
              });
        });

        it("Click on metadata-item-name-dropdown", function () {
          var itemDropdown = $('.csui-metadata-item-name-dropdown').find(
              ":button");
          expect(itemDropdown.length).toEqual(1);
          itemDropdown.trigger('click');
        });

        it("Click on Rename command in dropdown", function (done) {
          TestUtils.asyncElement('ul.binf-dropdown-menu',
              'li[data-csui-command="rename"] .csui-toolitem').done(function (el) {
            expect(el.length).toEqual(1);
            expect(el.text().trim()).toEqual("Rename");
            el.trigger('click');
            done();
          });
        });

        it("Rename the search item name from searchResults to RenamedItem",
            function (done) {
              var titleInput = $('.title-edit-div').find(".title-input");
              expect(titleInput.length).toEqual(1);
              expect(titleInput.val()).toEqual("RenamedItem");
              titleInput.val('searchResults');
              titleInput.trigger({
                type: 'keyup',
                keyCode: 13
              });
              TestUtils.asyncElement('.title-header', '.title').done(function (el) {
                expect(el.length).toEqual(1);
                expect(el.text().trim()).toEqual("searchResults");
                done();
              });
            });

        it("Verify tabular search is loaded", function (done) {
          $('.arrow_back').trigger('click');
          TestUtils.asyncElement(searchResultsView.$el, ".csui-nodetable .dataTables_wrapper").done(
            function (el) {
              expect(el.length).toEqual(1);
              done();
            });
        });
      });

    });

    describe('Search all versions', function () {

      var pageContext, searchResultsView, collection, searchBoxView, query, boxRegion,
          resultsRegion, searchMetadataCollection, regionEl;

      beforeAll(function () {
        if (!pageContext) {
          pageContext = new PageContext({
            factories: {
              connector: {
                connection: {
                  url: '//server/otcs/cs/api/v1',
                  supportPath: '/support',
                  session: {
                    ticket: 'dummy'
                  }
                }
              }
            }
          });
        }
        var params           = {},
            searchQueryModel = pageContext.getModel(SearchQueryModelFactory);
        searchMetadataCollection = pageContext.getCollection(SearchMetadataFactory);
        params['where'] = "version"; //All version search text
        searchQueryModel.set(params, {
          silent: true
        });
        searchBoxView = new SearchBoxView({
          context: pageContext
        });
        regionEl = $('<div></div>').appendTo(document.body);
        boxRegion = new Marionette.Region({
          el: regionEl
        }).show(searchBoxView);

        searchResultsView = new SearchResultsView({
          context: pageContext
        });
        resultsRegion = new Marionette.Region({
          el: regionEl
        }).show(searchResultsView);
      });

      afterAll(function () {
        TestUtils.cancelAllAsync();
        searchResultsView.destroy();
        searchBoxView.destroy();
        boxRegion.destroy();
        resultsRegion.destroy();
        regionEl && regionEl.remove();
        TestUtils.restoreEnvironment();
      });

      it('can be constructed', function () {
        expect(searchResultsView instanceof SearchResultsView).toBeTruthy();
      });

      it("search for any term and click on icon ", function () {
        searchBoxView.ui.input.text('version');
        expect(searchBoxView.ui.searchIcon.length).toBe(1);
        searchBoxView.ui.searchIcon.trigger('click');
      });

      it('should fetch the model from SearchResultsCollection[Low]', function () {
        pageContext.fetch();
        var searchResultsCollection = pageContext.getModel(
            SearchResultsCollectionFactory);
        expect(searchResultsCollection.isFetchable()).toBeTruthy();
      });

      it('validate search results header title displayed with backend response',
          function (done) {
            setTimeout(function () {
              collection = searchResultsView.collection;
              var searchHeaderTitle = collection.searching ? collection.searching
                                                               .result_title : "";
              var headerTitle = searchResultsView.headerView.$el.find(
                  "#resultsTitle").text();
              expect(searchHeaderTitle).toEqual(headerTitle);
              done();
            }, 400);
          });

      it('checking for version label in tabular search view', function (done) {
        TestUtils.asyncElement(searchResultsView.$el, ".csui-search-version-label")
            .done(
                function (el) {
                  expect(el.length).toEqual(searchResultsView.collection.length);
                  done();
                });
      });

      it('Click on standard view icon', function (done) {
        TestUtils.asyncElement(searchResultsView.$el,
            ".csui-tabular-view").done(
            function (el) {
              var tabularViewIcon = el.is(":visible");
              expect(tabularViewIcon).toBeTruthy();
              el.trigger('click');
              done();
            });
      });

      it("Verifying whether standard search view is loaded", function (done) {
        TestUtils.asyncElement(searchResultsView.$el, ".csui-result-list").done(
            function (el) {
              expect(el.length).toEqual(1);
              expect(el.is(":visible")).toBeTruthy();
              done();
            });
      });

      it('checking for version label in standard search view', function () {
        var versionLabel = searchResultsView.$el.find('.csui-search-version-label')
            .length;
        expect(versionLabel).toEqual(searchResultsView.collection.length);
      });

    });

    describe('Search Settings', function () {

      var pageContext, searchResultsView, collection, searchBoxView, query, boxRegion,
          resultsRegion, searchMetadataCollection, regionEl, detectCardChangeAndDone;

      beforeAll(function () {
        if (!pageContext) {
          pageContext = new PageContext({
            factories: {
              connector: {
                connection: {
                  url: '//server/otcs/cs/api/v1',
                  supportPath: '/support',
                  session: {
                    ticket: 'dummy'
                  }
                }
              }
            }
          });
        }
        var params           = {},
            searchQueryModel = pageContext.getModel(SearchQueryModelFactory);
        searchMetadataCollection = pageContext.getCollection(SearchMetadataFactory);
        params['where'] = "*";
        searchQueryModel.set(params, {
          silent: true
        });
        regionEl = $('<div></div>').appendTo(document.body);
        searchBoxView = new SearchBoxView({
          context: pageContext
        });
        boxRegion = new Marionette.Region({
          el: regionEl
        }).show(searchBoxView);

        searchResultsView = new SearchResultsView({
          context: pageContext
        });
        resultsRegion = new Marionette.Region({
          el: regionEl
        }).show(searchResultsView);
        detectCardChangeAndDone = function (done) {
          var el = searchResultsView.headerView.settingsView.$el
            .find('.animate-hide, .animate-show');
          if (el.length) {
            el.one('animationend', done);
          } else {
            done();
          }
        };
      });

      afterAll(function () {
        TestUtils.cancelAllAsync();

        searchResultsView.destroy();
        searchBoxView.destroy();
        boxRegion.destroy();
        resultsRegion.destroy();
        regionEl && regionEl.remove();
        TestUtils.restoreEnvironment();
      });

      it('can be constructed', function () {
        expect(searchResultsView instanceof SearchResultsView).toBeTruthy();
      });

      it("search for any term and click on icon ", function () {
        searchBoxView.ui.input.text('*');
        expect(searchBoxView.ui.searchIcon.length).toBe(1);
        searchBoxView.ui.searchIcon.trigger('click');
      });

      it('should fetch the model from SearchResultsCollection[Low]', function () {
        pageContext.fetch();
        var searchResultsCollection = pageContext.getModel(
            SearchResultsCollectionFactory);
        expect(searchResultsCollection.isFetchable()).toBeTruthy();
      });

      it('validate search results header title displayed with backend response',
          function (done) {
            setTimeout(function () {
              collection = searchResultsView.collection;
              var searchHeaderTitle = collection.searching ? collection.searching
                                                               .result_title : "";
              var headerTitle = searchResultsView.headerView.$el.find(
                  "#resultsTitle").text();
              expect(searchHeaderTitle).toEqual(headerTitle);
              done();
            }, 400);
          });

      it("Check for the presence of tabular view icon", function (done) {
        TestUtils.asyncElement(searchResultsView.$el, ".csui-tabular-view").done(
            function () {
              var tabularViewIcon = $(".csui-tabular-view .csui-svg-icon").is(":visible");
              if (searchResultsView.collection.length > 0) {
                expect(tabularViewIcon).toBeTruthy();
              } else {
                expect(tabularViewIcon).toBeFalsy();
              }
              done();
            });
      });

      it("Click on tabular view icon", function (done) {
        TestUtils.asyncElement(searchResultsView.$el, ".csui-tabular-view").done(
            function () {
              var tabularSearchIcon = searchResultsView.$el.find(
                  '.csui-tabular-view');
              tabularSearchIcon.trigger('click');
              done();
            });
      });

      it("Verifying the tabular search view should be loaded", function (done) {
        TestUtils.asyncElement(searchResultsView.$el, ".csui-nodetable").done(
            function () {
              var tabularView = searchResultsView.$el.find(
                  '.csui-nodetable');
              expect(tabularView.length).toEqual(1);
              done();
            });
      });

      it('verify presence of search settings', function (done) {
        TestUtils.asyncElement(searchResultsView.$el, ".csui-search-header").done(
            function () {
              var searchSettings = searchResultsView.$el.find(
                  '.csui-search-settings');
              expect(searchSettings.length).toEqual(1);
              done();
            });
      });

      it('Should display settings dropdown on clicking search settings', function (done) {

        var searchSettings = searchResultsView.$el.find(
            '.csui-search-settings');
        searchSettings.trigger('click');

        TestUtils.asyncElement(document.body, ".settings-dropdown-container").done(
            function (el) {
              var columnSettingsValue     = 'Column settings',
                  summaryDescriptionValue = 'Summary / description',
                  columnSettings          = el.find('[title="' + columnSettingsValue +
                                                    '"] .csui-settings-option-title'),
                  SummaryDescription      = el.find('[title="' + summaryDescriptionValue +
                                                    '"] .csui-settings-option-title');
              expect(columnSettings.text()).toEqual(columnSettingsValue);
              expect(SummaryDescription.text()).toEqual(summaryDescriptionValue);
              done();
            });
      });

      it('Click on Summary/ description on settings menu', function (done) {
        var summaryDescriptionValue = 'Summary / description';
        var summaryDescription = $('.settings-dropdown-container [title="' +
                                   summaryDescriptionValue + '"]');
        summaryDescription.trigger('click');
        TestUtils.asyncElement(document.body,
            ".summary-description-container.csui-settings-show").done(
            function (el) {
              var headerTitle = el.find(
                  '.csui-summary-description-list .column-header .column-title');
              expect(headerTitle.text()).toEqual(summaryDescriptionValue);
              detectCardChangeAndDone(done);
            });
      });

      it('focus should navigate to list',function(done){
        var backButton = searchResultsView.$el.find(
          '.csui-summary-description-list .column-header .arrow_back');
      backButton.trigger({type: 'keydown', keyCode: 9  });
      TestUtils.asyncElement(document.body,
        ".summary-description-container.csui-settings-show").done(
        function (el) {
          var summaryDescriptionValue = el.find(
              '.csui-summary-description-list .columns-list .column-item .column-item-container');
              expect(summaryDescriptionValue.eq(0).is(':focus')).toBeTruthy();
              done();
        });
      });

      it('Should display checkmark for Summaries Preferred', function (done){
        var checkmark = $('.icon.selected');
        expect(checkmark.length).toEqual(1);
        var label = $('.icon.selected + span');
        expect(label.text()).toEqual('Summaries preferred');
        done();
      });

      it('select summary/description',function(done){
        var summaryDescriptionList = searchResultsView.$el.find('.csui-summary-description-list .columns-list .column-item .column-item-container');
        summaryDescriptionList.eq(0).trigger('click');
        var label = $('.icon.selected + span');
            expect(label.text()).toEqual('None');
            done();
        });

      it('keydown for down arrow in summary/description list',function(done){
        var summaryDescriptionList = searchResultsView.$el.find('.csui-summary-description-list .columns-list .column-item .column-item-container');
        summaryDescriptionList.eq(0).trigger({type: 'keydown', keyCode: 40});
        TestUtils.asyncElement(document.body,
          ".summary-description-container.csui-settings-show").done(
          function (el) {
            var summaryDescriptionValue = el.find(
                '.csui-summary-description-list .columns-list .column-item .column-item-container');
                expect(summaryDescriptionValue.eq(1).is(':focus')).toBeTruthy();
                done();
          });
      });

      it('keydown for up arrow in summary/description list',function(done){
        var summaryDescriptionList = searchResultsView.$el.find('.csui-summary-description-list .columns-list .column-item .column-item-container');
        summaryDescriptionList.eq(1).trigger({type: 'keydown', keyCode: 38});
        TestUtils.asyncElement(document.body,
          ".summary-description-container.csui-settings-show").done(
          function (el) {
            var summaryDescriptionValue = el.find(
                '.csui-summary-description-list .columns-list .column-item .column-item-container');
                expect(summaryDescriptionValue.eq(0).is(':focus')).toBeTruthy();
                done();
          });
      });

      it('focus should move to back button', function(done){
        var summaryDescriptionList = searchResultsView.$el.find('.csui-summary-description-list .columns-list .column-item .column-item-container');
        var backButton = searchResultsView.$el.find(
          '.csui-summary-description-list .column-header .arrow_back');
        summaryDescriptionList.eq(0).trigger({type: 'keydown', keyCode: 9});
        TestUtils.asyncElement(document.body,
          ".summary-description-container.csui-settings-show").done(
          function (el) {
            var backButton = el.find(
              '.csui-summary-description-list .column-header .arrow_back');
            expect(backButton.is(':focus')).toBeTruthy();
            done();
          });
      });

      it('should go back to settings menu', function (done) {
        var backButton = searchResultsView.$el.find(
            '.csui-summary-description-list .column-header .arrow_back');
        backButton.trigger('click');
        TestUtils.asyncElement(document.body,
            ".settings-dropdown-container:visible").done(
            function (el) {
              expect(el.length).toEqual(1);
              detectCardChangeAndDone(done);
            });
      });

      it('keydown to navigate to summary/description settings', function(done){
        var summaryDescriptionValue = 'Summary / description';
        var summaryDescription = $('.settings-dropdown-container [title="' +
                                   summaryDescriptionValue + '"]');
        summaryDescription.trigger({type: 'keydown', keyCode: 13  });
        TestUtils.asyncElement(document.body,
            ".summary-description-container.csui-settings-show").done(
            function (el) {
              var headerTitle = el.find(
                  '.csui-summary-description-list .column-header .column-title');
              expect(headerTitle.text()).toEqual(summaryDescriptionValue);
              detectCardChangeAndDone(done);
            });
      });

      it('keydown for backbutton in summary/description settings',function(done){
        var summaryDescriptionValue = 'Summary / description';
        var backButton = searchResultsView.$el.find(
        '.csui-summary-description-list .column-header .arrow_back');
        backButton.trigger({type: 'keydown', keyCode: 13  });
        TestUtils.asyncElement(document.body,
          ".summary-description-container.csui-settings-show").done(
          function (el) {
            var headerTitle = el.find(
                '.csui-summary-description-list .column-header .column-title');
            expect(headerTitle.text()).toEqual(summaryDescriptionValue);
            detectCardChangeAndDone(done);
          });
      });

      it('Click on column settings on settings menu', function (done) {
        var columnSettingsValue = 'Column settings';
        var columnSettingsLink = searchResultsView.$el.find(
            '.settings-dropdown-container [title="' + columnSettingsValue + '"]');
        columnSettingsLink.trigger('click');
        TestUtils.asyncElement(document.body,
            ".selected-columns-container.csui-settings-show").done(
            function (el) {
              var headerTitle = el.find('.column-header .column-title');
              expect(headerTitle.text()).toEqual('Column settings');
              detectCardChangeAndDone(done);
            });
      });

      it('on pressing tab, focus should move to add button',function(done){
        var backButton = searchResultsView.$el.find(
          '.selected-columns-container .column-header .arrow_back');
        var addColumns = searchResultsView.$el.find(
            '.selected-columns-container .add-button');
        backButton.trigger({type: 'keydown', keyCode: 9 });
        expect(addColumns.is(':focus')).toBeTruthy();
        done();
      });

      it('on pressing tab, focus should move to remove button in the column list',function(done){
        var addColumns = searchResultsView.$el.find(
            '.selected-columns-container .add-button');
        var selectedItems = searchResultsView.$el.find(
        '.selected-columns-container .csui-selected-column .column-item'),
        deleteButton = selectedItems.eq(0).find('.remove-button');
        addColumns.trigger({type: 'keydown', keyCode: 9 });
        expect(deleteButton.is(':focus')).toBeTruthy();
        done();
      });

      it('keydown for removing column',function(done){
        var selectedItems = searchResultsView.$el.find(
          '.selected-columns-container .csui-selected-column .column-item'),
          selectedCount = selectedItems.length,
          deleteButton = selectedItems.eq(0).find('.remove-button');
          deleteButton.trigger({type: 'keydown', keyCode: 13 });
          TestUtils.asyncElement(document.body,
            ".selected-columns-container.csui-settings-show").done(
            function (el) {
              var selectedItems = el.find('.csui-selected-column .column-item');
              expect(selectedCount-1).toEqual(selectedItems.length);
              done();
            });
      });

      it('focus should move to backbutton from remove icon',function(done){
        var selectedItems = searchResultsView.$el.find(
          '.selected-columns-container .csui-selected-column .column-item'),
          deleteButton = selectedItems.eq(2).find('.remove-button');
          deleteButton.trigger({type: 'keydown', keyCode: 9 });
          TestUtils.asyncElement(document.body,
            ".selected-columns-container.csui-settings-show").done(
            function (el) {
              var backButton = el.find('.column-header .arrow_back');
              expect(backButton.is(':focus')).toBeTruthy();
              done();
            });
        });

      it('keydown for back button in selected columns',function(done){
        var columnSettingsValue = 'Column settings';
        var backButton = searchResultsView.$el.find(
          '.selected-columns-container .column-header .arrow_back');
        backButton.trigger({type: 'keydown', keyCode: 13  });
        TestUtils.asyncElement(document.body,
          ".selected-columns-container.csui-settings-show").done(
          function (el) {
            var headerTitle = el.find('.column-header .column-title');
            expect(headerTitle.text()).toEqual(columnSettingsValue);
            detectCardChangeAndDone(done);
          });
      });

      it('keydown for selecting column settings', function(done){
        var columnSettingsValue = 'Column settings';
        var columnSettingsLink = searchResultsView.$el.find(
            '.settings-dropdown-container [title="' + columnSettingsValue + '"]');
        columnSettingsLink.trigger({type: 'keydown', keyCode: 13  });
        TestUtils.asyncElement(document.body,
          ".selected-columns-container.csui-settings-show").done(
          function (el) {
            var headerTitle = el.find('.column-header .column-title');
            expect(headerTitle.text()).toEqual(columnSettingsValue);
            detectCardChangeAndDone(done);
          });
      });

      it('Click on add button for available columns list', function (done) {
        var addColumns = searchResultsView.$el.find(
            '.selected-columns-container .add-button');
        addColumns.trigger('click');
        TestUtils.asyncElement(document.body,
            ".available-columns-container.csui-settings-show").done(
            function (el) {
              var headerTitle = el.find('.column-header .column-title');
              expect(headerTitle.text()).toEqual('Select columns');
              detectCardChangeAndDone(done);
            });
      });

      it('Should display checkmark for selected column item', function () {
        var selectedItem = searchResultsView.$el.find(
            '.available-columns-container .columns-list .column-item');
        var selectedCount = searchResultsView.$el.find(
            '.available-columns-container .column-header .selected-column-count span'
        );
        expect(selectedCount.text().length).toEqual(0);
        selectedItem.eq(0).trigger('click');
        var checkmark = searchResultsView.$el.find(
            '.available-columns-container .columns-list .column-item.selected');
        expect(checkmark.length).toEqual(1);
        selectedCount = searchResultsView.$el.find(
            '.available-columns-container .column-header .selected-column-count span'
        );
        expect(selectedCount.text()).toEqual("1");
      });

      it('selecting a column by pressing ENTER',function(done){
        var selectedItem = searchResultsView.$el.find(
          '.available-columns-container .columns-list .column-item');
          selectedItem.eq(0).trigger('focus');
          selectedItem.eq(0).trigger({type: 'keydown', which: 40});
          expect((selectedItem.eq(1)).is(':focus')).toBeTruthy();
          selectedItem.eq(1).trigger({type: 'keydown', which: 32});
          var checkmark = searchResultsView.$el.find(
            '.available-columns-container .columns-list .column-item.selected');
        expect(checkmark.length).toEqual(2);
        var selectedCount = searchResultsView.$el.find(
            '.available-columns-container .column-header .selected-column-count span'
        );
        expect(selectedCount.text()).toEqual("2");
        done();
      });

      it('unselecting a column by pressing ENTER',function(done){
        var selectedItem = searchResultsView.$el.find(
          '.available-columns-container .columns-list .column-item');
          selectedItem.eq(1).trigger({type: 'keydown', which: 32});
          var checkmark = searchResultsView.$el.find(
            '.available-columns-container .columns-list .column-item.selected');
        expect(checkmark.length).toEqual(1);
        var selectedCount = searchResultsView.$el.find(
            '.available-columns-container .column-header .selected-column-count span'
        );
        expect(selectedCount.text()).toEqual("1");
        done();
      });

      it('navigating to previous columns by pressing up arrow',function(done){
        var selectedItem = searchResultsView.$el.find(
          '.available-columns-container .columns-list .column-item');
          selectedItem.eq(1).trigger('focus');
          selectedItem.eq(1).trigger({type: 'keydown', which: 38});
          expect(selectedItem.eq(0).is(':focus')).toBeTruthy();
          done();
      });

      it('on pressing tab, focus should move to the back button',function(done){
        var selectedItem = searchResultsView.$el.find(
          '.available-columns-container .columns-list .column-item');
        var backButton = searchResultsView.$el.find(
            '.available-columns-container .column-header .arrow_back');
            selectedItem.eq(0).trigger('focus');
        expect(selectedItem.eq(0).is(':focus')).toBeTruthy();
        selectedItem.eq(0).trigger({type: 'keydown', which: 9});
        expect(backButton.is(':focus')).toBeTruthy();
        done();
      });

      it('should go back to selected columns list', function (done) {
        var backButton = searchResultsView.$el.find(
            '.available-columns-container .column-header .arrow_back');
        backButton.trigger('click');
        TestUtils.asyncElement(document.body,
            ".selected-columns-container.csui-settings-show").done(
            function (el) {
              var headerTitle = el.find('.column-header .column-title');
              expect(headerTitle.text()).toEqual('Column settings');
              detectCardChangeAndDone(done);
            });
      });

      it('should display newly added item', function (done) {
        var newColumn = searchResultsView.$el.find(
            '.selected-columns-container .csui-new-column-item');
        TestUtils.asyncElement(document.body,
            ".selected-columns-container.csui-settings-show").done(
            function () {
              expect(newColumn.length).toEqual(1);
              done();
            });
      });

      xit('Click on delete button to remove item', function (done) {
        var selectedItems = searchResultsView.$el.find(
            '.selected-columns-container .csui-selected-column .column-item'),
            selectedCount = selectedItems.length;
        selectedItems.eq(0).trigger('click');
        var deleteButton = selectedItems.eq(0).find('.remove-button');
        deleteButton.trigger('click');
        TestUtils.asyncElement(document.body,
            ".selected-columns-container.csui-settings-show").done(
            function (el) {
              var selectedItems = el.find('.csui-selected-column .column-item');
              expect(selectedCount).toEqual(selectedItems.length + 1);
              done();
            });
      });
    });

    describe('Without Search Settings', function () {

      var pageContext, searchResultsView, collection, searchBoxView, query, boxRegion,
        resultsRegion, searchMetadataCollection, regionEl;

      beforeAll(function () {
        if (!pageContext) {
          pageContext = new PageContext({
            factories: {
              connector: {
                connection: {
                  url: '//server/otcs/cs/api/v1',
                  supportPath: '/support',
                  session: {
                    ticket: 'dummy'
                  }
                }
              }
            }
          });
        }
        var params           = {},
          searchQueryModel = pageContext.getModel(SearchQueryModelFactory);
        searchMetadataCollection = pageContext.getCollection(SearchMetadataFactory);
        params['where'] = "*";
        searchQueryModel.set(params, {
          silent: true
        });
        regionEl = $('<div></div>').appendTo(document.body);
        searchBoxView = new SearchBoxView({
          context: pageContext
        });
        boxRegion = new Marionette.Region({
          el: regionEl
        }).show(searchBoxView);

        searchResultsView = new SearchResultsView({
          context: pageContext,
          enableSearchSettings: false
        });
        resultsRegion = new Marionette.Region({
          el: regionEl
        }).show(searchResultsView);
      });

      afterAll(function () {
        TestUtils.cancelAllAsync();

        searchResultsView.destroy();
        searchBoxView.destroy();
        boxRegion.destroy();
        resultsRegion.destroy();
        regionEl && regionEl.remove();
        TestUtils.restoreEnvironment();
      });

      it('can be constructed', function () {
        expect(searchResultsView instanceof SearchResultsView).toBeTruthy();
      });

      it("search for any term and click on icon ", function () {
        searchBoxView.ui.input.text('*');
        expect(searchBoxView.ui.searchIcon.length).toBe(1);
        searchBoxView.ui.searchIcon.trigger('click');
      });

      it('should fetch the model from SearchResultsCollection[Low]', function () {
        pageContext.fetch();
        var searchResultsCollection = pageContext.getModel(
          SearchResultsCollectionFactory);
        expect(searchResultsCollection.isFetchable()).toBeTruthy();
      });

      it('validate search results header title displayed with backend response',
        function (done) {
          setTimeout(function () {
            collection = searchResultsView.collection;
            var searchHeaderTitle = collection.searching ? collection.searching.result_title : "";
            var headerTitle = searchResultsView.headerView.$el.find("#resultsTitle").text();
            expect(searchHeaderTitle).toEqual(headerTitle);
            done();
          }, 400);
        });

      it('verify absence of search settings', function (done) {
        TestUtils.asyncElement(searchResultsView.$el, ".csui-search-header").done(
          function () {
            var searchSettings = searchResultsView.$el.find('.csui-search-settings .icon-toolbar-settings');
            expect(searchSettings.length).toEqual(0);
            done();
          });
      });

    });
  });
});
