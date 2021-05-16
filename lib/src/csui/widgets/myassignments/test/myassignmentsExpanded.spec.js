/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/widgets/myassignmentstable/myassignmentstable.view',
  'csui/utils/contexts/factories/myassignments',
  './myassignments.mock.data.manager.js', 'csui/lib/jquery.mockjax'
], function ($, _, Marionette, PageContext, MyAssignmentsTableView, MyAssignmentsCollectionFactory,
    DataManager) {
  describe("My Assignments Table View", function () {

    var context, w, region;

    beforeEach(function () {

      context = new PageContext({
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

      var el = $('<div style="background-color: white; width: 1424px;height: 600px">',
          {id: 'target'});
      $(document.body).append(el);
      region = new Marionette.Region({el: el});

      w = new MyAssignmentsTableView({
        context: context,
        collection: context.getCollection(MyAssignmentsCollectionFactory),
        pageSize: 100
      });
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      expect(w.el.childNodes.length === 0).toBeTruthy();
    });

    afterEach(function () {
      region.empty();
      $('body').empty();
      DataManager.test0.disable();
      DataManager.test1.disable();
      DataManager.mockData.disable();
    });

    it("can be instantiated", function (done) {
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      expect(w.el.childNodes.length === 0).toBeTruthy();
      done();
    });

    describe("can be rendered and", function () {

      it("shows 0 items and has a table and a navigation", function (done) {
        expect(w.collection.length === 0).toBeTruthy();

        DataManager.test0.enable();
        w.listenTo(w.tableView, 'render', callback);
        region.show(w);

        var rendered = false;

        function callback() {
          if (w.collection.fetched) {
            rendered = true;
            expect(w.collection.length).toEqual(0);
            expect(w.$('div.csui-myassignmentstable')).toBeDefined();
            expect(w.$('.csui-nodetable.csui-table-empty').length).toEqual(1);

            expect(w.$('div#tableviewMA')[0].childNodes.length > 0).toBeTruthy();
            expect(w.$('div#paginationviewMA')[0].childNodes.length > 0).toBeTruthy();
          }
        }

        w.collection.fetch({reload: true}).then(function () {
          if (!rendered) {
            fail('no render called after collection was fetched');
          }
          done();
        });
      });

      it("shows 1 item and correct data", function (done) {

        DataManager.test1.enable();
        w.listenTo(w.tableView, 'render', callback);
        region.show(w);

        var rendered = false;

        function callback() {
          if (w.collection.fetched) {
            rendered = true;
            expect(w.collection.length).toEqual(1);

            expect(w.$('div.csui-myassignmentstable')).toBeDefined();
            expect($(w.$('tbody')[0]).find('tr:not(.csui-details-row)').length).toEqual(1);
            expect($(w.$('tbody tr [data-csui-attribute="type"]')).length).toEqual(1);
            expect($(w.$('tbody tr [data-csui-attribute="name"]')).length).toEqual(1);
            expect($(w.$('tbody tr [data-csui-attribute="location_id"]')).length).toEqual(
                1);
            expect($(w.$('tbody tr [data-csui-attribute="date_due"]')).length).toEqual(1);
            expect($(w.$('tbody tr [data-csui-attribute="priority"]')).length).toEqual(1);
            expect($(w.$('tbody tr [data-csui-attribute="status"]')).length).toEqual(1);
            expect(
                $(w.$('tbody tr [data-csui-attribute="from_user_name"]')).length).toEqual(
                1);
            var model0Name = w.collection.models[0].get('name');
            var row0Name = w.$('tbody > tr > td.csui-table-cell-name').text().trim();
            expect(model0Name).toEqual(row0Name);
          }
        }

        w.collection.fetch({reload: true}).then(function () {
          if (!rendered) {
            fail('no render called after collection was fetched');
          }
          done();
        });
      });

      it("shows 100 items correctly", function (done) {

        var id100From = 21;
        var id100To = 120;
        var s100Name = '100name';
        DataManager.mockData.enable(id100From, id100To, s100Name);
        w.listenTo(w.tableView, 'render', callback);
        region.show(w);

        var rendered = false;

        function callback() {
          if (w.collection.fetched) {
            rendered = true;
            expect(w.collection.length).toEqual(100);
            expect(w.$('div.csui-myassignmentstable')).toBeDefined();
            expect($(w.$('tbody')[0]).find('tr:not(.csui-details-row)').length).toEqual(100);
            expect($(w.$('tbody tr [data-csui-attribute="type"]')).length).toEqual(100);
            expect($(w.$('tbody tr [data-csui-attribute="name"]')).length).toEqual(100);
            expect($(w.$('tbody tr [data-csui-attribute="location_id"]')).length).toEqual(
                100);
            expect($(w.$('tbody tr [data-csui-attribute="date_due"]')).length).toEqual(100);
            expect($(w.$('tbody tr [data-csui-attribute="priority"]')).length).toEqual(100);
            expect($(w.$('tbody tr [data-csui-attribute="status"]')).length).toEqual(100);
            expect(
                $(w.$('tbody tr [data-csui-attribute="from_user_name"]')).length).toEqual(
                100);
            var model50Name = w.collection.models[50].get('name');
            var row50Name = $(w.$('tbody  .csui-table-cell-name')[50]).text().trim();
            expect(model50Name).toEqual(row50Name);
          }
        }

        w.collection.fetch({reload: true}).then(function () {
          if (!rendered) {
            fail('no render called after collection was fetched');
          }
          done();
        });
      });

    });

  });
});
