/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/marionette",
  "csui/controls/listitem/listitemstandard.view",
  'csui/utils/contexts/page/page.context',
  "csui/widgets/recentlyaccessed/recentlyaccessed.view",
  '../../../controls/listitem/test/listitemstandard.mock.js',
  '../../../utils/testutils/async.test.utils.js',
  "csui/lib/jquery.simulate"
], function ($, _, Marionette, StandardListItem, PageContext, RecentlyAccessedView,
    ListItemMock,
    TestUtils) {

  describe("The ListItemStandard Control", function () {
    var sTitle = 'testTitle';
    var sIcon = "binf-glyphicon-folder-close";

    var w;

    beforeEach(function () {
      if (!w) {
        w = new StandardListItem({
          name: sTitle,
          icon: sIcon
        });
      }
    });

    it("can be instantiated and rendered", function () {
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      w.render();
      expect(w.$el.length > 0).toBeTruthy();
    });

    it("has a configurable title", function () {

      expect(w.$('span.list-item-title').html()).toEqual(sTitle);

    });

    it("has a configurable icon", function () {
      var $iconSpan = w.$('span.csui-icon');
      expect($iconSpan[0].classList.length).toBeGreaterThan(1);
      expect($iconSpan.hasClass(sIcon)).toBeTruthy();

    });

    it("raises click:item event when clicked", function (done) {

      var bTriggered = false;

      w.on('click:item', function () {
        bTriggered = true; // has been called
        expect(bTriggered).toBeTruthy();
        done();
      });

      w.$el.simulate('click');

    });

  });

  describe("Keyboard Navigation for List Item Standard View", function () {

    var context, view;

    beforeAll(function () {
      ListItemMock.enable();

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
      view = new RecentlyAccessedView({
        context: context
      });
    });

    afterAll(function () {
      ListItemMock.disable();
      TestUtils.cancelAllAsync();
      view.destroy();
      TestUtils.restoreEnvironment();
    });

    it("can be instantiated and rendered", function () {
      var region = new Marionette.Region({
        el: $('body')
      });
      region.show(view);
      context.fetch();
      expect(view).toBeDefined();
      expect(view.$el.length > 0).toBeTruthy();
      view.render();
      expect(view.el.childNodes.length > 0).toBeTruthy();
    });

    it("navigate between list items using Down and Up arrows", function (done) {
      TestUtils.asyncElement(view.$el, '.csui-item-standard').done(function ($listitems) {
        expect($listitems.length).toEqual(15);
        $($listitems[0]).trigger('click');
        $($listitems[0]).trigger('focus');
        expect($($listitems[0]).is(':focus')).toBeTruthy();
        $($listitems[0]).trigger({type: 'keydown', which: 40});
          expect($($listitems[1]).is(':focus')).toBeTruthy();
          done();
      });
    });

    it("on uparrow the focus should shift to first list item", function (done) {
      TestUtils.asyncElement(view.$el, '.csui-item-standard').done(function ($listitems) {
        expect($($listitems[1]).is(':focus')).toBeTruthy();
        $($listitems[1]).trigger({type: 'keydown', which: 38});
          expect($($listitems[0]).is(':focus')).toBeTruthy();
          done();
      });
    });

    it("on Enter key, the focus should shift to list item title name", function (done) {
      TestUtils.asyncElement(view.$el, '.csui-item-standard').done(function ($listitems) {
        expect($listitems.length).toEqual(15);
        expect($($listitems[0]).is(':focus')).toBeTruthy();
        $($listitems[0]).trigger({type: 'keydown', keyCode: 13});
        expect($($listitems[0]).find('.list-item-title').is(':focus')).toBeTruthy();
        done();
      });
    });

    it("on Right arrow key, the focus should shift to more actions button",
        function (done) {
          TestUtils.asyncElement(view.$el, '.csui-item-standard').done(function ($listitems) {
            expect($($listitems[0]).find('.list-item-title').is(':focus')).toBeTruthy();
            $($listitems[0]).find('.list-item-title').trigger({type: 'keydown', keyCode: 39});
            expect($($listitems[0]).find('.csui-menu-btn').is(':focus')).toBeTruthy();
            done();
          });
        });

    it("on Enter on more actions button, the more actions dropdown should open",
        function (done) {
          TestUtils.asyncElement(view.$el, '.csui-item-standard').done(function ($listitems) {
            expect($($listitems[0]).find('.csui-menu-btn').is(':focus')).toBeTruthy();
            $($listitems[0]).find('.csui-menu-btn').trigger({type: 'keydown', which: 13});
            TestUtils.asyncElement($($listitems[0]),
                '.binf-open .binf-dropdown-menu li:first a').done(function () {
                  expect($($listitems[0]).find('.binf-open .binf-dropdown-menu li:first a').is(':focus')).toBeTruthy();
                  done();
                });
          });
        });

    it("on Escape on the dropdown, the focus should shift back to more actions button",
        function (done) {
          TestUtils.asyncElement(view.$el, '.csui-item-standard').done(function ($listitems) {
            expect($($listitems[0]).find('.binf-open .binf-dropdown-menu li:first a').is(':focus')).toBeTruthy();
            $($listitems[0]).find('.binf-dropdown').trigger({type: 'keyup', keyCode: 27});
            expect($($listitems[0]).find('.binf-dropdown-toggle').is(':focus')).toBeTruthy();
            done();
          });
        });

    it("on left arrow key, the focus should shift to list item title name from more actions",
        function (done) {
          TestUtils.asyncElement(view.$el, '.csui-item-standard').done(function ($listitems) {
            expect($($listitems[0]).find('.binf-dropdown-toggle').is(':focus')).toBeTruthy();
            $($listitems[0]).find('.binf-dropdown-toggle').trigger({type: 'keydown', keyCode: 37});
            expect($($listitems[0]).find('.list-item-title').is(':focus')).toBeTruthy();
            done();
          });
        });

    it("on Escape key, the focus should shift to list item from title name",
        function (done) {
          TestUtils.asyncElement(view.$el, '.csui-item-standard').done(function ($listitems) {
            expect($($listitems[0]).find('.list-item-title').is(':focus')).toBeTruthy();
            $($listitems[0]).find('.list-item-title').trigger({type: 'keydown', keyCode: 27});
            expect($($listitems[0]).is(':focus')).toBeTruthy();
            done();
          });
        });

  });

});
