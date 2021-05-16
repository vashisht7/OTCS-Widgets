/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/lib/backbone',
  'csui/utils/commands',
  'xecmpf/controls/headertoolbar/headertoolbar.view',
  'xecmpf/controls/headertoolbar/test/toolbaritems',
  'xecmpf/controls/headertoolbar/test/commands/test_add'
], function ($, _, Marionette, Backbone, Commands, HeaderToolbarView,
    toolbaritems, AddCommand) {

  describe("HeaderToolbar", function () {
    var headerToolBarView;

    beforeAll(function (done) {
      var commands = Commands;
      commands.add(new AddCommand());

      headerToolBarView = new HeaderToolbarView({
        commands: commands,
        toolbarItems: toolbaritems
      });
      headerToolBarView.render();
      $('body').append(headerToolBarView.$el);
      done();
    });

    it("can be instantiated", function () {
      expect(headerToolBarView instanceof HeaderToolbarView).toBeTruthy();
    });

    it("has all toolbars", function () {
      var el = headerToolBarView.$el;
      var filterToolbarEl = el.find('.filter-toolbar');
      var addToolbarEl = el.find('.add-toolbar');
      var otherToolbarEl = el.find('.other-toolbar');

      expect(filterToolbarEl.length).toBeGreaterThan(0);
      expect(addToolbarEl.length).toBeGreaterThan(0);
      expect(otherToolbarEl.length).toBeGreaterThan(0);
    });

    it("has add toolbar item", function (done) {
      var el = headerToolBarView.$el;
      var addToolbarEl = el.find('.add-toolbar');
      var menuListEl = addToolbarEl.find('ul.csui-toolbar');
      expect(menuListEl.length).toBe(1);
      var liAdd = menuListEl.find('a.csui-toolitem');
      expect(liAdd.length).toBe(1);

      done();
    });

  });

});
