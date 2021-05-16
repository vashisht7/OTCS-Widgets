/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["require", "csui/lib/jquery", "csui/lib/underscore", 'csui/models/node/node.model',
  "csui/lib/marionette", 'csui/utils/connector',
  "csui/widgets/favorites/favorite.star.view",
  './favorite.star.mock.data.js', 'csui/utils/contexts/page/page.context',
  "../../../utils/testutils/async.test.utils.js"
], function (require, $, _, NodeModel, Marionette, Connector, FavoriteStarView, FavoriteStarMock,
    PageContext, TestUtils) {
  describe("Favorite Star", function () {
    var connector, favStarView1, favStarViewforInvalidNode, model1, invalidNode, pageContext;
    beforeAll(function (done) {
      FavoriteStarMock.enable();
      connector = new Connector({
        connection: {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/support',
          session: {
            ticket: 'dummy'
          }
        }
      });
      pageContext = new PageContext();
        model1 = new NodeModel({id: 5656}, {connector: connector});
        invalidNode = new NodeModel({id: 2004}, {connector: connector});
        favStarView1 = new FavoriteStarView({
          context: pageContext,
          model: model1
        });
        favStarViewforInvalidNode = new FavoriteStarView({
          context: pageContext,
          model: invalidNode
        });
      done();
    });

    afterAll(function () {
      FavoriteStarMock.disable();
      TestUtils.cancelAllAsync();
      favStarView1.destroy();
      favStarViewforInvalidNode.destroy();
      TestUtils.restoreEnvironment();
    });

    it("can be instantiated and rendered", function () {
      var region1 = new Marionette.Region({
        el: $('<div id="cs-favorite-star-view1"></div>').appendTo(document.body)
      });
      region1.show(favStarView1);
      expect(favStarView1).toBeDefined();
      var region2 = new Marionette.Region({
        el: $('<div id="cs-favorite-star-view2"></div>').appendTo(document.body)
      });
      region2.show(favStarViewforInvalidNode);
      expect(favStarViewforInvalidNode).toBeDefined();
    });

    it("Click on favorite star icon and check popover to be visible", function (done) {
      var favIcon = favStarView1.$el.find('.csui-favorite-star');
      expect(favIcon.is(":visible")).toBeTruthy();
      expect(favIcon.length).toEqual(1);
      favIcon.trigger('click');
      TestUtils.asyncElement(favStarView1.$el, ".binf-popover-content").done(
          function () {
            expect(".binf-popover-content:visible").toBeTruthy();
            done();
          });
    });

    it("Enter favorite name and favorite group in popover", function (done) {
      TestUtils.asyncElement(favStarView1.$el, ".binf-popover-content").done(
          function () {
            expect(".binf-popover-content:visible").toBeTruthy();
            var name = favStarView1.$el.find(".favorite-name-input");
            expect(name.is(":visible")).toBeTruthy();
            expect(name.length).toEqual(1);
            name.val('FavoriteStar');
            var group = favStarView1.$el.find("#grpSelectId");
            expect(group.is(":visible")).toBeTruthy();
            expect(group.length).toEqual(1);
            group.trigger('click');
            var groupDD = favStarView1.$el.find(".favorite-groups-dropdown");
            expect(groupDD.is(":visible")).toBeTruthy();
            expect(groupDD.length).toEqual(1);
            $("span[title='G3']").first().trigger('click');
            $('.favorite-name-input').trigger({type: 'keydown', keyCode: 13});
            done();
          });
    });

    it("Click on add favorite button", function (done) {
      TestUtils.asyncElement(favStarView1.$el, ".add-btn").done(
          function (el) {
            expect(el.prop('disabled')).toBe(false);
            expect(el.is(":visible")).toBeTruthy();
            expect(el.length).toEqual(1);
            favStarView1.commandBlocked = false;
            el.trigger('focus').trigger('click');
            done();
          });

    });

    it("Check whether favorite is added or not", function (done) {
      TestUtils.asyncElement(favStarView1.$el, ".selected").done(
          function (el) {
            expect(el.is(":visible")).toBeTruthy();
            expect(el.length).toEqual(1);
            done();
          });
    });

    it("Remove favorite", function (done) {
      TestUtils.asyncElement(favStarView1.$el, ".selected").done(
          function (el) {
            expect(el.is(":visible")).toBeTruthy();
            expect(el.length).toEqual(1);
            el.trigger('click');
            done();
          });
    });

    it("Click on favorite star icon through Enter key and check popover to be visible",
        function (done) {
          var favIcon = favStarView1.$el.find('.csui-favorite-star');
          expect(favIcon.is(":visible")).toBeTruthy();
          expect(favIcon.length).toEqual(1);
          favStarView1.commandBlocked = false;
          favStarView1.$el.trigger({type: 'keydown', keyCode: 13});
          TestUtils.asyncElement(favStarView1.$el, ".binf-popover-content").done(
              function () {
                expect(".binf-popover-content:visible").toBeTruthy();
                done();
              });
        });

    it("Close popover by clicking on cancel button in popover", function (done) {
      TestUtils.asyncElement(favStarView1.$el, ".cancel-btn").done(
          function (el) {
            expect(el.prop('disabled')).toBe(false);
            expect(el.is(":visible")).toBeTruthy();
            expect(el.length).toEqual(1);
            favStarView1.commandBlocked = false;
            el.trigger('focus').trigger('click');
            done();
          });

    });

    it("Click on favorite star icon of InvalidNode", function (done) {
      var favIcon = favStarViewforInvalidNode.$el.find('.csui-favorite-star');
      expect(favIcon.is(":visible")).toBeTruthy();
      expect(favIcon.length).toEqual(1);
      favIcon.trigger('click');
      TestUtils.asyncElement(favStarViewforInvalidNode.$el, ".binf-popover-content").done(
          function () {
            expect(".binf-popover-content:visible").toBeTruthy();
            done();
          });
    });

    it("Add Favorite details of InvalidNode", function (done) {
      TestUtils.asyncElement(favStarViewforInvalidNode.$el, ".binf-popover-content").done(
          function () {
            expect(".binf-popover-content:visible").toBeTruthy();
            var name = favStarViewforInvalidNode.$el.find(".favorite-name-input");
            expect(name.is(":visible")).toBeTruthy();
            expect(name.length).toEqual(1);
            name.val('FavoriteStar2');
            var group = favStarViewforInvalidNode.$el.find("#grpSelectId");
            expect(group.is(":visible")).toBeTruthy();
            expect(group.length).toEqual(1);
            group.trigger('click');
            var groupDD = favStarViewforInvalidNode.$el.find(".favorite-groups-dropdown");
            expect(groupDD.is(":visible")).toBeTruthy();
            expect(groupDD.length).toEqual(1);
            $("span[title='G3']").first().trigger('click');
            $('.favorite-name-input').trigger({type: 'keydown', keyCode: 13});
            done();
          });
    });

    it("Click on add favorite button of favStarViewforInvalidNode", function (done) {
      TestUtils.asyncElement(favStarViewforInvalidNode.$el, ".add-btn").done(
          function (el) {
            expect(el.prop('disabled')).toBe(false);
            expect(el.is(":visible")).toBeTruthy();
            expect(el.length).toEqual(1);
            favStarViewforInvalidNode.commandBlocked = false;
            el.trigger('focus').trigger('click');
            done();
          });
    });

    it("Check for error dialog", function (done) {
      TestUtils.asyncElement('body', ".csui-alert").done(
          function (el) {
            expect(el.is(":visible")).toBeTruthy();
            expect(el.length).toEqual(1);
            done();
          });

    });

  });
});