/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/marionette",
  'csui/utils/contexts/page/page.context',
  "csui/controls/pagination/nodespagination.view",
  'csui/utils/contexts/factories/connector',
  "csui/models/node/node.model",
  "csui/models/nodechildren",
  "./pagination.mock.data.js",
  'csui/lib/jquery.mockjax'
], function ($, _, Marionette, PageContext, PaginationView, ConnectorFactory,
    NodeModel, NodeChildrenCollection, PaginationMockData, mockjax) {
  'use strict';

  describe('NodesPaginationView', function () {
    var paginationView,
        paginationEl,
        collection,
        paginationRegion,
        pageSizeMenu;

    function initialize() {
      var divContainer = '<div class="binf-container"><div class="binf-row"><div class="binf-col-sm-12" id="content"></div></div></div>';
      $('body').append(divContainer);

      paginationRegion = new Marionette.Region({
        el: "#content"
      });

      var context = new PageContext({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          },
          node: {
            attributes: {
              id: 2020
            }
          }
        }
      });

      var connector = context.getObject(ConnectorFactory);
      var node = new NodeModel({ id: 2020 }, {
        connector: connector,
        autoreset: true
      });

      collection = new NodeChildrenCollection(undefined, {
        node: node,
        autoreset: true
      });
    }

    function destroy() {
      $('body').html('');
      paginationRegion.destroy();
    }

    beforeAll(function () {
      mockjax.publishHandlers();
      PaginationMockData.enable();
    });

    afterAll(function () {
      PaginationMockData.disable();
    });

    describe('if the collection contains less than or eqaul to 30 items', function () {
      it('if the total count is 30 items page size dropdown is not visible', function (done) {
        initialize();
        collection.fetch()
            .done(function () {
              paginationView = new PaginationView({
                collection: collection
              });

              paginationRegion.show(paginationView);
              paginationEl = paginationView.$el;
              var totalText = paginationEl.find('.csui-total-container-items').text();
              expect(totalText.indexOf('30') > -1).toBe(true);
              expect(paginationEl.find('.csui-pagesize-menu').length).toBe(0);
              done();
            });
      });

      it('if 1 item is added total count becomes 31, page size dropdown with 30, 50 is visible',
          function (done) {
            var node = new NodeModel({id: 1});
            collection.add(node);
            paginationEl = paginationView.$el;
            var totalText = paginationEl.find('.csui-total-container-items').text();
            expect(totalText.indexOf('31') > -1).toBe(true);
            expect(paginationEl.find('.csui-pagesize-menu').length).toBe(1);
            var paginationMenue = paginationEl.find('.csui-dropdown-list > li > a');
            expect(paginationMenue.length).toBe(2);
            expect($(paginationMenue[1]).text() === '30 per page').toBeTruthy();
            expect($(paginationMenue[0]).text() === '50 per page').toBeTruthy();
            done();

          });

      it('if 2 items are removed,total count is less than 30 items, page size dropdown is not visible',
          function (done) {
            collection.pop();
            collection.pop();
            paginationEl = paginationView.$el;

            var totalText = paginationEl.find('.csui-total-container-items').text();
            expect(totalText.indexOf('29') > -1).toBe(true);
            expect(paginationEl.find('.csui-pagesize-menu').length).toBe(0);
            destroy();
            done();

          });
    });

    describe('if the collection is filtered', function () {
      it('the filtered count is shown instead of the total count', function (done) {
        initialize();
        collection.fetch()
          .done(function () {
            collection.pop();
            collection.filteredCount = 29;

            paginationView = new PaginationView({
              collection: collection
            });

            paginationRegion.show(paginationView);
            paginationEl = paginationView.$el;

            var totalText = paginationEl.find('.csui-total-container-items').text();
            expect(totalText.indexOf('29') > -1).toBe(true);
            destroy();
            done();
          });
      });
    });

    describe('tested node with 60 items', function () {
      it('expect pagination menu shows 30, 50, 100', function (done) {
        initialize();
        collection.node.set('id', 2060, { silent: true });
        collection.fetch().done(function () {

          paginationView = new PaginationView({
            collection: collection
          });

          paginationRegion.show(paginationView);
          paginationEl = paginationView.$el;

          var paginationMenue = paginationEl.find('.csui-dropdown-list > li > a');
          expect(paginationMenue.length).toBe(3);
          expect($(paginationMenue[2]).text() === '30 per page').toBeTruthy();
          expect($(paginationMenue[1]).text() === '50 per page').toBeTruthy();
          expect($(paginationMenue[0]).text() === '100 per page').toBeTruthy();
          done();
        });
      });

      it('expect 2 page tabs', function (done) {
        var paginationPages = paginationEl.find('.csui-pages > li');
        expect(paginationPages.length).toBe(2);
        done();
      });

      describe('test add/delete items to/from table', function () {
        it('add 1 item', function (done) {
          var node = new NodeModel({ id: 1 });
          collection.add(node);

          var totalText = paginationEl.find('.csui-total-container-items').text();
          expect(totalText.indexOf('61') > -1).toBe(true);

          var paginationPages = paginationEl.find('.csui-pages > li');
          expect(paginationPages.length).toBe(3);
          done();
        });

        it('delete 1 item', function (done) {
          collection.pop();

          var totalText = paginationEl.find('.csui-total-container-items').text();
          expect(totalText.indexOf('60') > -1).toBe(true);

          var paginationPages = paginationEl.find('.csui-pages > li');
          expect(paginationPages.length).toBe(2);
          done();
        });

        it('delete remaining 29 collection items', function (done) {
          for (var i = 0; i < 29; i++) {
            collection.pop();
          }

          var totalText = paginationEl.find('.csui-total-container-items').text();
          expect(totalText.indexOf('31') > -1).toBe(true);

          done();
        });

        it('deleting all items hides pagination bar', function (done) {
          collection.node.set('id', 2020);
          collection.fetch().done(function () {
            var pagerClassName = paginationEl[0].className;
            expect(pagerClassName.indexOf('binf-hidden') > -1).toBe(false);

            for (var i = 0; i < 30; i++) {
              collection.pop();
            }

            pagerClassName = paginationEl[0].className;
            expect(pagerClassName.indexOf('binf-hidden') > -1).toBe(true);

            destroy();
            done();
          });
        });
      });
    });

    describe('test node with 50 items', function () {
      it('expect pagination menu shows 30, 50', function (done) {
        initialize();
        collection.node.set('id', 2093, {silent: true});
        collection.fetch().done(function () {

          paginationView = new PaginationView({
            collection: collection
          });
          paginationRegion.show(paginationView);
          paginationEl = paginationView.$el;

          var totalText = paginationEl.find('.csui-total-container-items').text();
          expect(totalText.indexOf('50') > -1).toBe(true);

          var paginationMenue = paginationEl.find('.csui-dropdown-list > li > a');
          expect(paginationMenue.length).toBe(2);
          expect($(paginationMenue[1]).text() === '30 per page').toBeTruthy();
          expect($(paginationMenue[0]).text() === '50 per page').toBeTruthy();
          done();
        });
      });

      it('deleting 1 item shows 30, 50 page sizes', function (done) {
        collection.pop();

        var totalText = paginationEl.find('.csui-total-container-items').text();
        expect(totalText.indexOf('49') > -1).toBe(true);
        var paginationMenue = paginationEl.find('.csui-dropdown-list > li > a');
        expect(paginationMenue.length).toBe(2);

        expect($(paginationMenue[1]).text() === '30 per page').toBeTruthy();
        expect($(paginationMenue[0]).text() === '50 per page').toBeTruthy();
        done();
      });

      it('adding 2 item shows 30, 50, 100 page sizes in dropdown', function (done) {
        var node1 = new NodeModel({id: 1}),
            node2 = new NodeModel({id: 2});
        collection.add(node1);
        collection.add(node2);

        var totalText = paginationEl.find('.csui-total-container-items').text();
        expect(totalText.indexOf('51') > -1).toBe(true);

        var paginationMenue = paginationEl.find('.csui-dropdown-list > li > a');
        expect(paginationMenue.length).toBe(3);
        expect($(paginationMenue[2]).text() === '30 per page').toBeTruthy();
        expect($(paginationMenue[1]).text() === '50 per page').toBeTruthy();
        expect($(paginationMenue[0]).text() === '100 per page').toBeTruthy();
        destroy();
        done();
      });

    });

    describe('test node with more than or equal to 100 items', function () {
      it('expect pagination menu shows 30, 50, 100', function (done) {
        initialize();
        collection.node.set('id', 2094, {silent: true});
        collection.fetch().done(function () {

          paginationView = new PaginationView({
            collection: collection
          });

          paginationRegion.show(paginationView);
          paginationEl = paginationView.$el;

          var totalText = paginationEl.find('.csui-total-container-items').text();
          expect(totalText.indexOf('100') > -1).toBe(true);
          var paginationMenue = paginationEl.find('.csui-dropdown-list > li > a');
          expect(paginationMenue.length).toBe(3);
          expect($(paginationMenue[2]).text() === '30 per page').toBeTruthy();
          expect($(paginationMenue[1]).text() === '50 per page').toBeTruthy();
          expect($(paginationMenue[0]).text() === '100 per page').toBeTruthy();
          done();
        });
      });

      it('adding 1 item shows 30, 50,100 page sizes', function (done) {
        var node = new NodeModel({id: 1});
        collection.add(node);
        var totalText = paginationEl.find('.csui-total-container-items').text();
        expect(totalText.indexOf('101') > -1).toBe(true);

        var paginationMenue = paginationEl.find('.csui-dropdown-list > li > a');
        expect(paginationMenue.length).toBe(3);
        expect($(paginationMenue[2]).text() === '30 per page').toBeTruthy();
        expect($(paginationMenue[1]).text() === '50 per page').toBeTruthy();
        expect($(paginationMenue[0]).text() === '100 per page').toBeTruthy();
        done();
      });

      it('deleting 2 item shows 30, 50, 100 page sizes in dropdown', function (done) {
        collection.pop();
        collection.pop();

        var totalText = paginationEl.find('.csui-total-container-items').text();
        expect(totalText.indexOf('99') > -1).toBe(true);

        var paginationMenue = paginationEl.find('.csui-dropdown-list > li > a');
        expect(paginationMenue.length).toBe(3);
        expect($(paginationMenue[2]).text() === '30 per page').toBeTruthy();
        expect($(paginationMenue[1]).text() === '50 per page').toBeTruthy();
        expect($(paginationMenue[0]).text() === '100 per page').toBeTruthy();
        destroy();
        done();
      });

    });

    xdescribe('validate all key events', function () {
      it('expect pagination menu shows 30, 50, 100', function (done) {
        initialize();
        collection.node.set('id', 2092, { silent: true });
        collection.fetch().done(function () {

          paginationView = new PaginationView({
            collection: collection
          });

          paginationRegion.show(paginationView);
          paginationEl = paginationView.$el;
          var paginationMenue = paginationEl.find('.csui-dropdown-list > li > a');
          expect(paginationMenue.length).toBe(3);
          expect($(paginationMenue[2]).text() === '30 per page').toBeTruthy();
          expect($(paginationMenue[1]).text() === '50 per page').toBeTruthy();
          expect($(paginationMenue[0]).text() === '100 per page').toBeTruthy();
          pageSizeMenu = paginationEl.find('.binf-dropdown-toggle');
          done();
        });
      });
      it('check for active element', function () {
        var activeChild = paginationView.currentlyFocusedElement();
        expect(activeChild.is(':visible')).toBeTruthy();
      });
      it('validate home key event', function () {
        pageSizeMenu.trigger({type: 'keydown', keyCode: 36});
        var dropdownToggle = paginationEl.find('.binf-dropdown-toggle');
        expect($(dropdownToggle[0]).is(':focus')).toBeTruthy();
      });
      it('validate end key event', function () {
        pageSizeMenu.trigger({type: 'keydown', keyCode: 35});
        var overflowRight = paginationEl.find('.csui-overflow-right');
        expect($(overflowRight).is(':focus')).toBeTruthy();
      });
      it('validate enter key event', function () {
        pageSizeMenu.trigger({type: 'keydown', keyCode: 13});
        var overflowleft = paginationEl.find('.csui-overflow-left');
        expect($(overflowleft).is(':visible')).toBeTruthy();
      });
      it('validate up arrow key event', function () {
        pageSizeMenu.trigger({type: 'keydown', keyCode: 38});
        var overflowleft = paginationEl.find('.csui-overflow-left');
        expect($(overflowleft).is(':visible')).toBeTruthy();
        var overflowRight = paginationEl.find('.csui-overflow-right');
        expect($(overflowRight).is(':visible')).toBeFalsy();
      });
      it('validate down arrow key event', function () {
        pageSizeMenu.trigger({type: 'keydown', keyCode: 40});
        var overflowRight = paginationEl.find('.csui-overflow-right');
        expect($(overflowRight).is(':visible')).toBeTruthy();
      });
      it('validate right arrow key event', function () {
        pageSizeMenu.trigger({type: 'keydown', keyCode: 39});
        pageSizeMenu.trigger({type: 'keydown', keyCode: 39});
        pageSizeMenu.trigger({type: 'keydown', keyCode: 39});
        var paginationPages = paginationEl.find('.csui-pages > li > a');
        expect($(paginationPages[3]).is(':focus')).toBeTruthy();
      });
      it('validate left arrow key event', function () {
        pageSizeMenu.trigger({type: 'keydown', keyCode: 37});
        var paginationPages = paginationEl.find('.csui-pages > li > a');
        expect($(paginationPages[2]).is(':focus')).toBeTruthy();
      });
      it('validate page up key event', function () {
        pageSizeMenu.trigger({type: 'keydown', keyCode: 33});
        var overflowLeft = paginationEl.find('.csui-overflow-left');
        expect($(overflowLeft).is(':focus')).toBeTruthy();
      });
      it('validate page down key event', function () {
        pageSizeMenu.trigger({type: 'keydown', keyCode: 34});
        pageSizeMenu.trigger({type: 'keydown', keyCode: 34});
        var paginationPages = paginationEl.find('.csui-pages > li > a');
        expect($(paginationPages[0]).is(':focus')).toBeTruthy();
      });
      it('click on 50 per page', function () {
        var paginationMenue = paginationEl.find('.csui-dropdown-list > li > a');
        paginationMenue.eq(1).trigger('click');
      });
      it('click on overflow right button', function () {
        var overflowRight = paginationEl.find('.csui-overflow-right');
        overflowRight.eq(0).trigger('click');
        var overflowLeft = paginationEl.find('.csui-overflow-left');
        expect(overflowLeft.is(':visible')).toBeTruthy();
      });
      it('click on overflow left button', function () {
        var overflowLeft = paginationEl.find('.csui-overflow-left');
        overflowLeft.eq(0).trigger('click');
        expect(overflowLeft.is(':visible')).toBeFalsy();
      });
      it('click on second page', function () {
        var paginationPages = paginationEl.find('.csui-paging-navbar > ul > li:not(.csui-overflow) > a');
        paginationPages.eq(1).trigger('click');
      });
      it('verify selected page is activated', function () {
        var selectedPage = paginationEl.find('.csui-pages > li > a.csui-activePage');
        expect(selectedPage.length).toBe(1);
      });
    });

    describe('total count gets updated after each page change (LPAD-44324)', function () {
      it('page 1 has total count of items with/without see perm ', function (done) {
        initialize();
        collection.node.set('id', 2080, { silent: true });
        collection.fetch().done(function () {
          paginationView = new PaginationView({
            collection: collection
          });

          paginationRegion.show(paginationView);
          paginationEl = paginationView.$el;

          var totalText = paginationEl.find('.csui-total-container-items').text();
          expect(totalText.indexOf('63') > -1).toBe(true);
          done();
        });

      });

      it('page 2 has total count of items with see perm only ', function (done) {
        paginationView.changePage(1);
        paginationView.listenToOnce(paginationView, 'dom:refresh', function () {
          var totalText = paginationEl.find('.csui-total-container-items').text();
          expect(totalText.indexOf('33') > -1).toBe(true);
          done();
        });
      });

      it('page 3 has total count of items with see perm only ', function (done) {
        paginationView.changePage(0);
        paginationView.listenToOnce(paginationView, 'dom:refresh', function () {
          paginationView.changePage(2);
          paginationView.listenToOnce(paginationView, 'dom:refresh', function () {
            var totalText = paginationEl.find('.csui-total-container-items').text();
            expect(totalText.indexOf('33') > -1).toBe(true);

            destroy();
            done();
          });
        });
      });
    });

    describe('setting page size after switching nodes (LPAD-49116)', function () {
      it('Adding an item to an empty container', function (done) {
        initialize();
        collection.node.set('id', 2090);
        collection.fetch().done(function () {

          var node = new NodeModel({ id: 1 });

          paginationView = new PaginationView({
            collection: collection
          });

          paginationRegion.show(paginationView);
          paginationEl = paginationView.$el;

          var pagerClassName = paginationEl[0].className;
          expect(pagerClassName.indexOf('binf-hidden') > -1).toBe(true);

          collection.add(node);
          pagerClassName = paginationEl[0].className;
          expect(pagerClassName.indexOf('binf-hidden') > -1).toBe(false);

          var totalText = paginationEl.find('.csui-total-container-items').text();
          expect(totalText.indexOf('1') > -1).toBe(true);
          destroy();
          done();
        });
      });

      it('open container and set page size to 50', function (done) {
        initialize();
        collection.node.set('id', 2080);
        collection.fetch().done(function () {

          paginationView = new PaginationView({
            collection: collection
          });

          paginationRegion.show(paginationView);
          paginationEl = paginationView.$el;

          paginationView.setPageSize(50, true);
          paginationView.listenToOnce(paginationView, 'dom:refresh', function () {
            var pageSize = paginationEl.find('.csui-pageSize').text();
            expect(pageSize.indexOf('50') > -1).toBe(true);
            done();
          });
        });
      });
    });
  });
});
