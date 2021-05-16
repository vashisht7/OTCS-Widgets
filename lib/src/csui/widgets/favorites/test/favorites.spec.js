/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/widgets/favorites/favorites.view', 'csui/utils/contexts/page/page.context',
  'csui/controls/listitem/listitemstandard.view',
  './favorites.mock.data.manager.js', "../../../utils/testutils/async.test.utils.js"
], function ($, _, Marionette, FavoritesView, PageContext, StandardListItem, DataManager,
    TestUtils) {

  describe("The Favorites Widget", function () {

    var sTitle, sIcon, id100From, id100To, s100Name, context, w;

    beforeAll(function (done) {
      sTitle = 'testTitle';
      sIcon = "title-icon";
      id100From = 21;
      id100To = 25;
      s100Name = '100name';

      if (!context) {
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
      }

      if (!w) {
        w = new FavoritesView({
          data: {
            title: sTitle,
            titleBarIcon: sIcon
          },
          context: context
        });
      }

      done();
    });

    afterAll(function () {
      DataManager.mockData.disable();
      DataManager.test0.disable();
      DataManager.test1.disable();
      TestUtils.cancelAllAsync();
      TestUtils.restoreEnvironment();
    });

    it("can be instantiated and rendered", function (done) {
      DataManager.mockData.enable(id100From, id100To, s100Name);
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      expect(w.el.childNodes.length === 0).toBeTruthy();
      w.render();
      expect(w.$el.length > 0).toBeTruthy();
      expect(w.el.childNodes.length > 0).toBeTruthy();
      var region = new Marionette.Region({
        el: $('<div id="cs-favorites-view"></div>').appendTo(document.body)
      });
      region.show(w);
      done();
    });

    it("Click on header item in the favorite widget", function (done) {
      TestUtils.asyncElement(w.$el, 'div.cs-header:eq(1)').done(function (el) {
        expect(el.length).toEqual(1);
        el.trigger('click');
        TestUtils.asyncElement(w.$el, '.cs-emptylist-text').done(function (el) {
          expect(el.is(":visible")).toBeTruthy();
          done();
        });
      });

    });

    it('mouseover to show inline actions for listItem', function (done) {
      DataManager.test0.enable();
      var listItem = w.$el.find('.cs-list-group a:last-child');
      listItem.trigger('mouseenter');
      var moreIcon = w.$el.find('.icon-toolbar-more');
      expect(moreIcon.is(":visible")).toBeTruthy();
      moreIcon.trigger('click');
      TestUtils.asyncElement(w.$el, '.binf-dropdown-menu').done(function (ele) {
        expect(ele.length).toEqual(1);
        done();
      });

    });

    it("Click on favorites tile expand icon", function (done) {
      var tileExpand = w.$el.find('.tile-expand');
      expect(tileExpand.is(":visible")).toBeTruthy();
      expect(tileExpand.length).toEqual(1);
      tileExpand.trigger("click");
      TestUtils.asyncElement('body', '.csui-expanded').done(function (el) {
        expect(el.length).toEqual(1);
        done();
      });
    });

    it("Click on favorites tile collapse icon", function (done) {
      TestUtils.asyncElement($('body'), '.icon-tileCollapse').done(function (el) {
        expect(el.length).toEqual(1);
        el.trigger("click");
        done();
      });

    });

    describe("in collapsed state", function () {
      it("allows to show 6 items", function (done) {
        var fetching = w.completeCollection.fetch({reload: true})
            .then(function () {
              expect(w.completeCollection.length).toBeGreaterThan(0);
              expect(w.completeCollection.length).toEqual(6);
              expect(w.$('div.binf-list-group')[0].childNodes.length).toEqual(6); // limited list
              DataManager.mockData.disable();
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Data fetch timed out");
              done();
            });
      });

      it("Search for any favorite item by clicking on search icon", function (done) {
        var searchIcon = w.$el.find('.cs-search-icon');
        expect(searchIcon.length).toEqual(1);
        searchIcon.trigger('click');
        TestUtils.asyncElement(w.$el, 'input.search').done(function (el) {
          expect(el.is(":visible")).toBeTruthy();
          expect(el.length).toEqual(1);
          el[0].value = '100name21';
          el.trigger('focus');
          $('input.search').trigger({type: 'keydown', keyCode: 13});
          var searchIcon = w.$el.find('.cs-search-icon');
          expect(searchIcon.length).toEqual(1);
          searchIcon.trigger('click');
          done();
        });
      });

      describe("for each individual item", function () {
        it("shows the file name of the list item as item text", function () {
          var rgModelCollection = w.completeCollection.models;
          expect(rgModelCollection.length).toBeGreaterThan(0);
          var sModelItemName0 = rgModelCollection[0].get('name');
          var nModelId = rgModelCollection[0].get('id');
          var sViewItemName0 = w.$('a[href$=' + nModelId + '] span.list-item-title').html();
          expect(sModelItemName0).toEqual(sViewItemName0);
        });
      });

      it("allows to show 1 item", function (done) {
        DataManager.test0.enable();
        var fetching = w.completeCollection.fetch({reload: true})
            .then(function () {
              expect(w.completeCollection.length).toBeGreaterThan(0);
              expect(w.completeCollection.length).toEqual(1);
              expect(w.$('div.binf-list-group')[0].childNodes.length).toEqual(1);
              DataManager.test1.disable();
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Data fetch timed out");
              done();
            });
      });

      it("shows placeholder in case of 0 items", function (done) {
        DataManager.test0.enable();
        var fetching = w.completeCollection.fetch()
            .then(function () {
              expect(w.collection.length).toEqual(0);
              expect(w.$('div.cs-emptylist-container').length === 1).toBeTruthy();
              DataManager.mockData.disable();
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Data fetch timed out");
              done();
            });
      });

      it("has a header and a viewport/content", function () {
        expect(w.$('div.tile-header').length).toBeGreaterThan(0);
        expect(w.$('div.tile-content').length).toBeGreaterThan(0);
      });

      it("has a configurable title, which is set as the header title", function () {
        expect(w.$('div.tile-title>.csui-heading').html()).toEqual(sTitle);
      });

      it("has a configurable icon, which is set as the header icon", function () {
        var $iconSpan = w.$('div.tile-type-icon>span.icon');
        expect($iconSpan[0].classList.length).toBeGreaterThan(1);
        expect($iconSpan[0].classList[1]).toEqual(sIcon);
      });

    });

  });
});
