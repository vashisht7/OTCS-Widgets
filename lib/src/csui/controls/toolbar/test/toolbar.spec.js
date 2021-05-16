/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/lib/marionette", "csui/controls/toolbar/toolbar.view",
  "csui/controls/toolbar/toolitems.factory",
  'json!./toolbar.items.json',
  "../../../utils/testutils/async.test.utils.js"
], function ($, _, Backbone, Marionette, ToolbarView, ToolItemsFactory, toolbarItems, TestUtils) {
  'use strict';

  describe('Toolbar View', function () {

    var toolbarView, region;

    beforeAll(function () {
      var collection = new ToolItemsFactory({
        main: toolbarItems
      });

      toolbarView = new ToolbarView({
        collection: collection.getCollection(),
        toolbarName: 'Test tools',
        maxItemsShown: 15,
        dropDownIcon: "icon icon-toolbar-more",
        dropDownText: 'DP',
        addGroupSeparators: false,
        lazyActions: false
      });
      $('body').append(
          '<div class="toolcontainer" style="background-color: #dce4e8; margin: 50px;"><div id="toolbar"></div></div>');
      region = new Marionette.Region({el: "#toolbar"});
      region.show(toolbarView);
    });

    afterAll(function () {
      toolbarView.destroy();
      TestUtils.cancelAllAsync();
      TestUtils.restoreEnvironment();
    });

    it('should show toolbar items and submenus correctly in the toolbar', function (done) {
      expect(toolbarView).toBeDefined();
      TestUtils.asyncElement("body",
          "li[data-csui-command='emaillink'] .binf-dropdown-submenu .binf-dropdown-submenu .binf-dropdown-submenu .binf-dropdown-submenu").done(
          function () {
            var listItems = toolbarView.$el.find("li:visible");
            expect(listItems.length).toEqual(8);
            expect(listItems.eq(1).find(".binf-dropdown-submenu").length).toEqual(0);
            expect(listItems.eq(2).find(".binf-dropdown-submenu").length).toEqual(0);
            expect(listItems.eq(3).find(".binf-dropdown-submenu").length).toEqual(0);
            expect(listItems.eq(4).find(".binf-dropdown-submenu").length).toEqual(0);
            expect(listItems.eq(5).find(".binf-dropdown-submenu").length).toEqual(0);
            expect(listItems.eq(6).find(".binf-dropdown-submenu").length).toEqual(1);
            expect(listItems.eq(7).find(".binf-dropdown-submenu").length).toEqual(5);
            done();
          });
    });

    it('should not show dropdown on clicking copyLink as it does not have any subitems',
        function () {
          var copylink = toolbarView.$el.find("li[data-csui-command='copylink']").eq(0);
          copylink.trigger('click');
          expect(copylink.find(".binf-dropdown-menu:visible").length).toEqual(0);
        });

    it('should toggle dropdown on clicking share link', function (done) {
      var share = toolbarView.$el.find("li[data-csui-command='emaillink2']");
      share.trigger('click');
      TestUtils.asyncElement(share, '.binf-dropdown-menu:visible').done(
          function (el) {
            expect(el.length).toEqual(1);
            share.trigger('click');
            TestUtils.asyncElement(share, '.binf-dropdown-menu:hidden').done(
                function () {
                  expect(share.find(".binf-dropdown-menu:visible").length).toEqual(0);
                  done();
                });
          });
    });

    it('should open dropdown menu on clicking submenus of action link', function (done) {
      var actionBtn = toolbarView.$el.find("li[data-csui-command='emaillink']");
      actionBtn.trigger('click');
      TestUtils.asyncElement(actionBtn, '.binf-dropdown-menu:visible').done(
          function (el) {
            expect(el.length).toEqual(1);
            var submenu = el.find(".binf-dropdown-submenu:visible");
            submenu.trigger('click');
            TestUtils.asyncElement(submenu, '.binf-dropdown-menu:visible').done(
                function (el) {
                  expect(el.length).toEqual(1);
                  done();
                });
          });
    });

  });

});