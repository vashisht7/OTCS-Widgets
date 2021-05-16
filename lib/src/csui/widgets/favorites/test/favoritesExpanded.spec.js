/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/widgets/favorites2.table/favorites2.table.view',
  'csui/models/favorites2',
  'csui/utils/contexts/factories/favorites2',
  'csui/utils/contexts/factories/favorite2groups',
  'csui/models/favorite2columns',
  '../../../utils/testutils/async.test.utils.js',
  "../../../utils/testutils/drag-mock.js",
  './favorites2.mock.data0.js',
  './favorites2.mock.data1.js',
  './favorites2.mock.data2.js',
  'csui/lib/jquery.mockjax'
], function ($, _, Marionette, PageContext, Favorites2TableView, Favorite2Collection,
    Favorite2CollectionFactory, Favorite2GroupsCollectionFactory, Favorite2ColumnCollection,
    TestUtils, DragMock, mockData0, mockData1, mockData2) {

  xdescribe("The Favorites Widget, Expanded", function () {

    var context, ftv, el, region;

    beforeEach(function () {

      context = new PageContext({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v2',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          }
        }
      });

      el = $('<div style="background-color: white; width: 1024px;height: 600px">', {id: 'target'});
      $('body').append(el);
      region = new Marionette.Region({
        el:el
      });
      ftv = new Favorites2TableView({
        context: context
      });

    });

    afterEach(function () {
      mockData0.disable();
      mockData1.disable();
      mockData2.disable();
      $('body').empty();
    });

    afterAll(function () {
      ftv.destroy();
      TestUtils.cancelAllAsync();
      TestUtils.restoreEnvironment();
    });

    it("the favorites table view can be instantiated", function (done) {
      expect(ftv).toBeDefined();
      expect(ftv.$el.length > 0).toBeTruthy();
      expect(ftv.el.childNodes.length === 0).toBeTruthy();
      done();
    });

    describe("the favorites table view can be rendered and", function () {

      it("shows only unsorted group and no favorites", function (done) {
        expect(ftv.groups.length === 0).toBeTruthy();
        expect(ftv.collection.length === 0).toBeTruthy();

        mockData0.enable();

        ftv.listenToOnce(ftv, 'show', function () {

          ftv.listenToOnce(ftv.tableView, 'render', function () {
            expect(ftv.tableView.collection.length).toEqual(0);
            expect(ftv.$el.hasClass('csui-fav2-table')).toBeTruthy();
            expect(ftv.$('.csui-nodetable.csui-table-empty').length).toEqual(1); // only empty element.

            callback();
          });
          ftv.listenToOnce(ftv.groupsView.rowsView, 'render', function () {
            expect(ftv.groups.length).toEqual(1);
            callback();
          });

          var callback = _.after(2, function () { // wait until callback was called 2 times
            done();
          });
        });

        region.show(ftv);
      });

      it("shows 4 favorite groups and no favorites", function (done) {

        mockData1.enable();

        ftv.listenToOnce(ftv.tableView, 'render', function () {
          expect(ftv.tableView.collection.length).toEqual(0);
          ftv.listenToOnce(ftv.tableView, 'render', function () {
            expect(ftv.tableView.collection.length).toEqual(0);
            expect(ftv.$el.hasClass('csui-fav2-table')).toBeTruthy();
            expect(ftv.$('.csui-nodetable.csui-table-empty').length).toEqual(1); // only empty element.
            callback();
          });
          ftv.listenToOnce(ftv.groupsView.rowsView, 'render', function () {
            var groupsView = ftv.$('.csui-favorite-groups-view');
            expect(groupsView.length).toEqual(1);

            var groupsHeaderView = ftv.$('.csui-favorite-groups-view .csui-favorite-groups-header');
            expect(groupsHeaderView.length).toEqual(1);

            var groupsRowsView = ftv.$('.csui-favorite-groups-view .csui-favorite-groups-rows');
            expect(groupsRowsView.length).toEqual(1);

            var groupViews = ftv.$('.csui-favorite-groups-view .csui-favorite-groups-rows' +
                                   ' .csui-favorite-group');
            expect(groupViews.length).toEqual(4);
            expect(ftv.groups.length).toEqual(4);
            callback();
          });

          var callback = _.after(2, function () { // wait until callback was called 2 times
            done();
          });
        });

        region.show(ftv);
      });

      it("shows 3 favorite groups and some favorites", function (done) {
        mockData2.enable();
        ftv.listenTo(ftv.tableView.collection.delayedActions, 'sync', callback);
        ftv.listenToOnce(ftv, 'show', function () {
          ftv.listenTo(ftv.tableView, 'render', callback);
          ftv.listenTo(ftv.groupsView.rowsView, 'render', callback);
        });

        function callback () {
          if (!(ftv.tableView.collection.delayedActions.fetched &&
                ftv.$('tbody').eq(0).find('tr').length &&
                ftv.groups.length)) {
            return;
          }
          expect(ftv.$('tbody').eq(0).find('tr').length).toBeGreaterThanOrEqual(1);
          expect(ftv.$('tbody').eq(0).find('tr > td.dataTables_empty').length).toEqual(0);
          expect(ftv.$('tbody').eq(0).find('tr').length).toEqual(2);
          expect(ftv.$('tbody > tr').eq(0).find('td').length).toEqual(6);
          expect(ftv.$('tbody > tr').eq(0).find('td.csui-table-cell-_select').length).toEqual(1);
          expect(ftv.$('tbody > tr').eq(0).find('td.csui-table-cell-type').length).toEqual(1);
          expect(ftv.$('tbody > tr').eq(0).find('td.csui-table-cell-name').length).toEqual(1);
          expect(ftv.$('tbody > tr').eq(0).find('td.csui-table-cell-node-state').length).toEqual(1);
          expect(ftv.$('tbody > tr').eq(0).find('td.csui-table-cell-generic-text').length).toEqual(
              1);
          expect(ftv.$('tbody > tr').eq(0).find('td.csui-table-cell-favorite').length).toEqual(1);

          expect(ftv.groups.length).toEqual(4);
          ftv.$('tbody > tr').eq(0).find('td.csui-table-cell-_select').trigger('click');
          expect(ftv.$('.csui-rowselection-toolbar.csui-rowselection-toolbar-visible').length).toEqual(1);
          ftv.$('tbody > tr').eq(0).find('td.csui-table-cell-_select').trigger('click');
          expect(ftv.$('.csui-rowselection-toolbar.csui-rowselection-toolbar-visible').length).toEqual(0);

          done();
        }
        region.show(ftv);
      });

      it("hide tablerowSeletionToolbar, if toolbarRegion is null", function (done) {
        ftv.toolbarRegion = null;
        mockData2.enable();
        ftv.listenTo(ftv.tableView.collection.delayedActions, 'sync', callback);
        ftv.listenToOnce(ftv, 'show', function () {
          ftv.listenTo(ftv.tableView, 'render', callback);
          ftv.listenTo(ftv.groupsView.rowsView, 'render', callback);
        });

        function callback () {
          if (!(ftv.tableView.collection.delayedActions.fetched &&
                ftv.$('tbody').eq(0).find('tr').length &&
                ftv.groups.length)) {
            return;
          }
          ftv.$('tbody > tr').eq(0).find('td.csui-table-cell-_select').trigger('click');
          expect(ftv.$('.csui-rowselection-toolbar.csui-rowselection-toolbar-visible').length).toEqual(0);
          done();
        }
        region.show(ftv);
      });

      it("test delete group ", function (done) {
        mockData2.enable();
        region.show(ftv);
        TestUtils.asyncElement('body', '.dataTable').done(
            function (el) {
              ftv.$('.csui-favorite-group').eq(1).find('.csui-btn-delete').trigger('click');
              TestUtils.asyncElement('body', '.binf-modal-content:visible').done(
                  function (el) {
                    expect(el.length).toBe(1);
                    el.find('.csui-yes').trigger('click');
                    var group2 = ftv.$('.csui-favorite-group').eq(1);
                    TestUtils.asyncElement('body', group2, true).done(
                        function (el) {
                          expect(el.length).toEqual(0);
                          ftv.$('.csui-favorite-group').eq(1).trigger('click');
                          done();
                        });
                  });
            });
      });

      it("test remove favorite", function (done) {
        mockData2.enable();
        region.show(ftv);
        TestUtils.asyncElement('body', '.dataTable').done(
            function (el) {
              ftv.$('tbody > tr').eq(0).find('td.csui-table-cell-favorite button').trigger('click');
              var selectedStar = ftv.$('tbody > tr').eq(0).find(
                  'td.csui-table-cell-favorite .csui-favorite-star.selected');
              TestUtils.asyncElement('body', selectedStar, true).done(
                  function (el) {
                    expect(el.length).toEqual(0);
                    done();
                  });
            });
      });

      it("drag and drop favorites to another row", function (done) {
        mockData2.enable();
        region.show(ftv);
        TestUtils.asyncElement('body', '.dataTable').done(
            function (el) {
              expect(ftv.$('tbody').eq(0).find('tr').length).toEqual(2);
              expect(ftv.groups.length).toEqual(4);
              var dragSource = document.querySelector('.csui-saved-item');
              var dropTarget = document.querySelectorAll('.csui-saved-item')[1];
              DragMock
                  .dragStart(dragSource, function (event) {
                    event.dataTransfer.setData('text', '');
                  }).dragEnter(dropTarget)
                  .dragOver(dropTarget)
                  .dragLeave(dropTarget)
                  .drop(dropTarget, function (event) {
                    TestUtils.asyncElement('body', '.load-container.binf-hidden', true).done(
                        function (el) {
                          expect(el.length).toEqual(0);
                          TestUtils.asyncElement('body', '.load-container.binf-hidden').done(
                              function (el) {
                                expect(el.length).toEqual(1);
                                done();
                              });
                        });

                  });
            });
      });

      it("drag and drop group to another group", function (done) {
        mockData2.enable();
        region.show(ftv);
        TestUtils.asyncElement('body', '.dataTable').done(
            function (el) {
              expect(ftv.$('tbody').eq(0).find('tr').length).toEqual(2);
              expect(ftv.groups.length).toEqual(4);
              var dragSource = document.querySelector(
                  '.csui-favorite-group');
              var dropTarget = document.querySelectorAll('.csui-favorite-group')[1];
              DragMock
                  .dragStart(dragSource, function (event) {
                    event.dataTransfer.setData('text', '');
                  }).dragEnter(dropTarget)
                  .dragOver(dropTarget)
                  .dragLeave(dropTarget)
                  .drop(dropTarget, function (event) {
                    TestUtils.asyncElement('body', '.load-container.binf-hidden', true).done(
                        function (el) {
                          expect(el.length).toEqual(0);
                          TestUtils.asyncElement('body', '.load-container.binf-hidden').done(
                              function (el) {
                                expect(el.length).toEqual(1);
                                done();
                              });
                        });

                  });
            });
      });

      it("drag and drop favorites to group", function (done) {
        mockData2.enable();
        region.show(ftv);
        TestUtils.asyncElement('body', '.dataTable').done(
            function (el) {
              expect(ftv.$('tbody').eq(0).find('tr').length).toBeGreaterThanOrEqual(1);
              expect(ftv.groups.length).toEqual(4);
              var dragSource = document.querySelector(
                  '.csui-saved-item');
              var dropTarget = document.querySelectorAll('.csui-favorite-group')[1];
              DragMock
                  .dragStart(dragSource, function (event) {
                    event.dataTransfer.setData('text', '');
                  }).dragEnter(dropTarget)
                  .dragOver(dropTarget)
                  .dragLeave(dropTarget)
                  .drop(dropTarget, function (event) {
                    TestUtils.asyncElement('body', '.load-container.binf-hidden', true).done(
                        function (el) {
                          expect(el.length).toEqual(0);
                          TestUtils.asyncElement('body', '.load-container.binf-hidden').done(
                              function (el) {
                                expect(el.length).toEqual(1);
                                done();
                              });
                        });

                  });
            });
      });
    });

  });
});
