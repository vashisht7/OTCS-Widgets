/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(
    ['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.when.all', 'csui/lib/backbone',
      'csui/lib/marionette',
      'csui/lib/handlebars', 'csui/widgets/search.custom/search.custom.view',
      'csui/widgets/search.results/search.results.view',
      'csui/widgets/search.custom/impl/search.object.view',
      'csui/utils/contexts/page/page.context',
      './search.custom.mock.data.js',
      '../../../utils/testutils/async.test.utils.js'
    ], function (_, $, whenAll, Backbone, Marionette, Handlebars, CustomSearchView,
        SearchResultsView, SearchObjectView, PageContext, mock, TestUtils) {

      describe('SearchCustomResults', function () {
        var pageContext;
        beforeAll(function () {
          mock.enable();
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
        });

        afterAll(function () {
          TestUtils.cancelAllAsync();
          mock.disable();
          TestUtils.restoreEnvironment();
        });

        describe('Initialization check', function () {

          it('handle error scenarios', function (done) {
            var customSearchView = new CustomSearchView({
              context: pageContext,
              savedSearchQueryId: 43995
            });
            new Marionette.Region({
              el: $('<div></div>').appendTo(document.body)
            }).show(customSearchView);
            pageContext.fetch();
            TestUtils.asyncElement(customSearchView.$el, '.csui-custom-error').done(function (el) {
              expect(el.length).toEqual(1);
              customSearchView.destroy();
              done();
            });
          });

          it('can be initialized and used independently', function () {
            var searchObjectView = new SearchObjectView({
              context: pageContext,
              savedSearchQueryId: 43996 // Provide existing saved search query's object id
            });
            expect(searchObjectView).toBeDefined();
            searchObjectView.destroy();
          });

        });

        describe('given empty configuration', function () {

          var searchResultsView, cvsView, el;

          beforeAll(function (done) {
            cvsView = new CustomSearchView({
              context: pageContext,
              savedSearchQueryId: 43996 // Provide existing saved search query's object id
            });
            new Marionette.Region({
              el: $('<div></div>').appendTo(document.body)
            }).show(cvsView);
            searchResultsView = new SearchResultsView({
              context: pageContext
            });
            new Marionette.Region({
              el: $('<div></div>').appendTo(document.body)
            }).show(searchResultsView);
            pageContext.fetch();
            TestUtils.asyncElement(cvsView.$el, 'input').done(function (elm) {
              el = elm;
              done();
            });
          });

          afterAll(function () {
            el.remove();
            searchResultsView.destroy();
            cvsView.destroy();
          });

          it('search results view can be constructed', function () {
            expect(searchResultsView instanceof SearchResultsView).toBeTruthy();
          });

          it('assigns right classes', function () {
            var className = searchResultsView.$el.attr('class');
            expect(className).toBeDefined();
            var classes = className.split(' ');
            expect(classes).toContain('csui-search-results');
          });

          it('custom search view can be constructed', function () {
            expect(cvsView instanceof CustomSearchView).toBeTruthy();
          });

          it('should show search button in disabled state when input fields are empty',
              function () {
                el.eq(1).val('').trigger('blur');
                el.eq(2).val('').trigger('blur');
                expect(cvsView.$el.find(".csui-custom-search-form-submit").hasClass(
                    "binf-disabled")).toBeTruthy();
              });

          it('should show search button in enabled state when input is given to the field',
              function () {
                el.eq(1).val('').trigger('blur');
                el.eq(2).val('a').trigger('blur');
                expect(cvsView.$el.find(".csui-custom-search-form-submit").hasClass(
                    "binf-disabled")).toBeFalsy();
              });

          it('should enable and initiate the search, hitting ENTER from any of the input field',
              function (done) {
                el.eq(1).val('*').trigger('blur');
                el.eq(2).val('');
                var e = $.Event('keydown', {keyCode: 13, bubbles: true});
                el.eq(2).trigger(e);
                TestUtils.asyncElement(searchResultsView.$el, '.csui-no-result-message-wrapper',
                    true).done(function () {
                  expect(cvsView.$el.find(".csui-custom-search-form-submit").hasClass(
                      "binf-disabled")).toBeFalsy();
                  expect(searchResultsView.$el.find(
                      '.csui-no-result-message-wrapper').length).toEqual(0);
                  done();
                });
              });

          it('should enable and initiate the search, hitting ENTER from any of the input field',
              function (done) {
                el.eq(1).val('*').trigger('blur');
                el.eq(2).val('');
                var e = $.Event('keyup', {keyCode: 13});
                el.eq(2).trigger(e);
                TestUtils.asyncElement(searchResultsView.$el, '.csui-no-result-message-wrapper',
                    true).done(function () {
                  expect(cvsView.$el.find(".csui-custom-search-form-submit").hasClass(
                      "binf-disabled")).toBeFalsy();
                  expect(searchResultsView.$el.find(
                      '.csui-no-result-message-wrapper').length).toEqual(0);
                  done();
                });
              });

          it('should show the results count as per the value entered in the text field',
              function (done) {
                el.eq(1).val('*').trigger('blur');
                el.eq(2).val('');
                cvsView.$el.find('#csui-custom-search-form-submit').trigger('click');
                TestUtils.asyncElement(searchResultsView.$el, '.csui-no-result-message-wrapper',
                    true).done(function () {
                  expect(searchResultsView.$el.find(
                      '.csui-no-result-message-wrapper').length).toEqual(0);
                  searchResultsView.listenTo(searchResultsView.collection, 'sync', function() {
                    expect(parseInt(searchResultsView.headerView.$el.find('#headerCount').text().match(/\d/g).join(''))).toEqual(searchResultsView.collection.totalCount);
                    done();
                  });
                });
              });

          it('should show no results when entered input value is not in the search results',
              function (done) {
                el.eq(2).val('abc').trigger('blur');
                cvsView.$el.find('.csui-custom-search-form-submit').trigger('click');
                searchResultsView.listenTo(searchResultsView.collection, 'sync', function() {
                  expect(searchResultsView.$el.find(
                    '.csui-no-result-message').is(':visible')).toBeTruthy();
                    done();
                });
              });
        });
      });
    });

