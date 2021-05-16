/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/controls/listitem/simpletreelistitem.view",
  'csui/utils/contexts/page/page.context',
  "csui/widgets/favorites/favorites.view",
  '../../../controls/listitem/test/simpletreelistitem.mock.js',
  '../../../utils/testutils/async.test.utils.js',
  "csui/utils/connector",
  "csui/lib/jquery.simulate"
], function ($, _, Backbone, Marionette, SimpleTreeListItemView, PageContext,
    FavoritesView, treeMock, TestUtils, Connector) {

  describe("The SimpleTreeListItem Control", function () {

    var w, treeModel, nodeName, bTriggered;

    it("can be instantiated and rendered without any parameters", function () {

      w = new SimpleTreeListItemView();
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      w.render();
      expect(w.$el.length > 0).toBeTruthy();

      expect(w.$('.cs-header').length).toEqual(1);
      expect(w.$('.cs-header .cs-title').length).toEqual(1);
      expect(w.$('.cs-header .dropdown-icon').length).toEqual(1);

      expect(w.$('.cs-content').length).toEqual(1);
      expect(w.$('.cs-content .cs-list-group').length).toEqual(1);
      expect(w.$('.cs-content .cs-emptylist-container').length).toEqual(1);
      expect(w.$('.cs-content .cs-emptylist-text').length).toEqual(1);
      expect(w.$('.cs-content .csui-no-result-message').text()).toEqual("No items.");

      w.destroy();

    });

    it("with the model and empty/no children collection", function () {

      nodeName = "Tree List with icon";
      treeModel = new Backbone.Model({
        id: 11111,
        icon: 'mime_fav_group32',
        name: nodeName
      });

      w = new SimpleTreeListItemView({model: treeModel});
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      w.render();
      expect(w.$el.length > 0).toBeTruthy();

      expect(w.$('.cs-header').length).toEqual(1);
      expect(w.$('.cs-header .cs-title').html()).toEqual(nodeName);
      expect(w.$('.cs-header .mime_fav_group32').length).toEqual(1);

      expect(w.$('.cs-content').length).toEqual(1);
      expect(w.$('.cs-content').hasClass('binf-hidden')).toBeTruthy();
      expect(w.$('.cs-content .cs-list-group').length).toEqual(1);
      expect(w.$('.cs-content .cs-emptylist-container').length).toEqual(1);
      expect(w.$('.cs-content .cs-emptylist-container .cs-emptylist-text').length).toEqual(1);
      expect(w.$('.cs-content .csui-no-result-message').text()).toEqual("No items.");

      w.destroy();

    });

    it("with the model and children collection", function () {

      var itemName1 = "Tree List Item 1 Folder",
          itemName2 = "Tree List Item 2.pdf",
          itemName3 = "Tree List Item 4.doc";

      var childrenCollection = new Backbone.Collection([
        {id: 11112, name: itemName1, type: 0},
        {id: 11113, name: itemName2, type: 144, mime_type: "application/pdf"},
        {id: 11114, name: itemName3, type: 144, mime_type: "application/msword"}
      ]);
      var connection = {
        url: "//server/otcs/cs/api/v1",
        supportPath: "/otcssupport"
      };
      var connector = new Connector({connection: connection});
      var i;
      for (i = 0; i < childrenCollection.length; i++) {
        childrenCollection.models[i].connector = connector;
      }
      var treeModel = new Backbone.Model({
        id: 11111,
        icon: 'mime_fav_group32',
        name: "Tree List with icon"
      });
      treeModel.childrenCollection = childrenCollection;

      w = new SimpleTreeListItemView({model: treeModel});
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      w.render();
      expect(w.$el.length > 0).toBeTruthy();

      expect(w.$('.cs-header').length).toEqual(1);
      expect(w.$('.cs-header .cs-title').html()).toEqual(nodeName);
      expect(w.$('.cs-header .mime_fav_group32').length).toEqual(1);

      expect(w.$('.cs-content').length).toEqual(1);
      expect(w.$('.cs-content').hasClass('binf-hidden')).toBeTruthy();
      expect(w.$('.cs-content .cs-list-group').length).toEqual(1);
      expect(w.$('.cs-content .cs-list-group').children().length).toEqual(3);
      expect(w.$('.cs-content .binf-list-group-item .csui-icon').length).toEqual(3);
      expect($(w.$('.cs-content .list-item-title')[0]).html()).toEqual(itemName1);
      expect(w.$('.cs-content .binf-list-group-item .csui-icon').find("[*|href$='#themes--carbonfiber--image--icons--mime_pdf']").length).toEqual(1);
      expect($(w.$('.cs-content .list-item-title')[1]).html()).toEqual(itemName2);
      expect(w.$('.cs-content .binf-list-group-item .csui-icon').find("[*|href$='#themes--carbonfiber--image--icons--mime_word']").length).toEqual(1);
      expect($(w.$('.cs-content .list-item-title')[2]).html()).toEqual(itemName3);

    });

    it("opens the subtree and raises event when click on the tree node", function (done) {

      bTriggered = false;

      w.on('click:tree:header', function () {
        bTriggered = true; // has been called
        expect(bTriggered).toBeTruthy();
        expect(w.$('.cs-content').hasClass('binf-hidden')).toBeFalsy();
        done();
      });

      w.$('.cs-header').simulate('click');

    });

    it("raises childview:click:item event when click on the tree leaf item", function (done) {

      bTriggered = false;

      w.on('childview:click:item', function () {
        bTriggered = true; // has been called
        expect(bTriggered).toBeTruthy();
        done();
      });

      $(w.$('.cs-content .cs-list-group a')[0]).simulate('click');

      w.destroy();

    });

  });
  describe("Keyboard Navigation Tree View", function () {

    var context, view;

    beforeAll(function () {
      treeMock.enable();

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
      view = new FavoritesView({
        context: context
      });
    });

    afterAll(function () {
      treeMock.disable();
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

    it("navigate between tree items using Down and Up arrows", function (done) {
      TestUtils.asyncElement(view.$el, '.cs-simpletreelistitem').done(function ($treeitems) {
        expect($treeitems.length).toEqual(4);
        $($treeitems[0]).prop("tabindex", -1).trigger('focus');
        expect($($treeitems[0]).is(':focus')).toBeTruthy();
        $($treeitems[0]).trigger({type: 'keydown', which: 40});
          expect($($treeitems[1]).is(':focus')).toBeTruthy();
          done();
      });
    });

    it("on uparrow the focus should shift to first tree item", function (done) {
      TestUtils.asyncElement(view.$el,
          '.cs-simpletreelistitem').done(function ($treeitems) {
            expect($($treeitems[1]).is(':focus')).toBeTruthy();
            $($treeitems[1]).trigger({type: 'keydown', which: 38});
              expect($($treeitems[0]).is(':focus')).toBeTruthy();
              done();
          });
    });

    it("on Enter key on tree item header, the content in the group should be visible",
        function (done) {
          TestUtils.asyncElement(view.$el,
              '.cs-simpletreelistitem').done(function ($treelistitems) {
                expect($treelistitems.length).toEqual(4);
                expect($($treelistitems[0]).is(':focus')).toBeTruthy();
                $($treelistitems[0]).trigger({type: 'keydown', keyCode: 13});
                expect($($treelistitems[0]).is(':focus')).toBeTruthy();
                TestUtils.asyncElement(view.$el, '.cs-simpletreelistitem').done(function ($el) {
                  expect($($el[0]).find('.cs-content').is(':visible')).toBeTruthy();
                  done();
                });
              });
        });

    it("on left arrow key on tree item, the content in the group should be collapsed",
        function (done) {
          TestUtils.asyncElement(view.$el,
              '.cs-simpletreelistitem').done(function ($treelistitems) {
                expect($($treelistitems[0]).is(':focus')).toBeTruthy();
                $($treelistitems[0]).trigger({type: 'keydown', keyCode: 37});
                expect($($treelistitems[0]).is(':focus')).toBeTruthy();
                TestUtils.asyncElement(view.$el, '.cs-simpletreelistitem').done(function ($el) {
                  expect($($el[0]).find('.cs-content').is(':visible')).toBeFalsy();
                  done();
                });
              });
        });

    it("on right key on tree item header, the content in the group should be visible",
        function (done) {
          TestUtils.asyncElement(view.$el,
              '.cs-simpletreelistitem').done(function ($treelistitems) {
                expect($treelistitems.length).toEqual(4);
                expect($($treelistitems[0]).is(':focus')).toBeTruthy();
                $($treelistitems[0]).trigger({type: 'keydown', keyCode: 39});
                expect($($treelistitems[0]).is(':focus')).toBeTruthy();
                TestUtils.asyncElement(view.$el, '.cs-simpletreelistitem').done(function ($el) {
                  expect($($el[0]).find('.cs-content').is(':visible')).toBeTruthy();
                  done();
                });
              });
        });

    it("on down arrow key, the focus should shift to frist list item in the group",
        function (done) {
          TestUtils.asyncElement(view.$el,
              '.cs-simpletreelistitem .cs-header').done(function ($treelistitems) {
                $($treelistitems[0]).trigger({type: 'keydown', keyCode: 40});
                TestUtils.asyncElement(view.$el,
                    '.cs-simpletreelistitem .cs-list-group a').done(function ($el) {
                      expect($($el[0]).is(':focus')).toBeTruthy();
                      done();
                    });
              });
        });

    it("on Enter key, the focus should shift to list item title name", function (done) {
      TestUtils.asyncElement(view.$el,
          '.cs-simpletreelistitem .cs-list-group a').done(function ($treelistitems) {
            expect($($treelistitems[0]).is(':focus')).toBeTruthy();
            $($treelistitems[0]).trigger({type: 'keydown', keyCode: 13});
            expect($($treelistitems[0]).find('.list-item-title').is(':focus')).toBeTruthy();
            done();
          });
    });

    it("on Right arrow key, the focus should shift to more actions button",
        function (done) {
          TestUtils.asyncElement(view.$el,
              '.cs-simpletreelistitem .cs-list-group a').done(function ($treelistitems) {
                expect($($treelistitems[0]).find('.list-item-title').is(':focus')).toBeTruthy();
                $($treelistitems[0]).find('.list-item-title').trigger({
                  type: 'keydown',
                  keyCode: 39
                });
                expect($($treelistitems[0]).find('.csui-menu-btn').is(':focus')).toBeTruthy();
                done();
              });
        });

    it("on Enter on more actions button, the more actions dropdown should open",
        function (done) {
          TestUtils.asyncElement(view.$el,
              '.cs-simpletreelistitem .cs-list-group a').done(function ($treelistitems) {
                expect($($treelistitems[0]).find('.csui-menu-btn').is(':focus')).toBeTruthy();
                $($treelistitems[0]).find('.csui-menu-btn').trigger({type: 'keydown', which: 13});
                TestUtils.asyncElement($($treelistitems[0]),
                    '.binf-open .binf-dropdown-menu li:first a').done(function () {
                      expect($($treelistitems[0]).find('.binf-open .binf-dropdown-menu li:first a').is(':focus')).toBeTruthy();
                      done();
                    });
              });
        });

    it("on Escape on the dropdown, the focus should shift back to more actions button",
        function (done) {
          TestUtils.asyncElement(view.$el,
              '.cs-simpletreelistitem .cs-list-group a').done(function ($treelistitems) {
                expect($($treelistitems[0]).find('.binf-open .binf-dropdown-menu li:first a').is(':focus')).toBeTruthy();
                $($treelistitems[0]).find('.binf-dropdown').trigger({type: 'keyup', keyCode: 27});
                expect($($treelistitems[0]).find('.binf-dropdown-toggle').is(':focus')).toBeTruthy();
                done();
              });
        });

    it("on left arrow key, the focus should shift to list item title name from more actions",
        function (done) {
          TestUtils.asyncElement(view.$el,
              '.cs-simpletreelistitem .cs-list-group a').done(function ($treelistitems) {
                expect($($treelistitems[0]).find('.binf-dropdown-toggle').is(':focus')).toBeTruthy();
                $($treelistitems[0]).find('.binf-dropdown-toggle').trigger({
                  type: 'keydown',
                  keyCode: 37
                });
                expect($($treelistitems[0]).find('.list-item-title').is(':focus')).toBeTruthy();
                done();
              });
        });

    it("on Escape key, the focus should shift to list item from title name",
        function (done) {
          TestUtils.asyncElement(view.$el,
              '.cs-simpletreelistitem .cs-list-group a').done(function ($treelistitems) {
                expect($($treelistitems[0]).find('.list-item-title').is(':focus')).toBeTruthy();
                $($treelistitems[0]).find('.list-item-title').trigger({
                  type: 'keydown',
                  keyCode: 27
                });
                expect($($treelistitems[0]).is(':focus')).toBeTruthy();
                done();
              });
        });

    it("on left arrow key, the focus should shift to tree item", function (done) {
      TestUtils.asyncElement(view.$el,
          '.cs-simpletreelistitem .cs-list-group a').done(function ($treelistitems) {
            expect($($treelistitems[0]).is(':focus')).toBeTruthy();
            $($treelistitems[0]).trigger({type: 'keydown', keyCode: 37});
            TestUtils.asyncElement(view.$el,
                '.cs-simpletreelistitem').done(function ($treeitems) {
                  expect($($treeitems[0]).is(':focus')).toBeTruthy();
                  done();
                });
          });
    });
  });
});
