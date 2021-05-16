/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["require", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/marionette",
  "csui/widgets/shortcuts/shortcuts.view", 'csui/utils/contexts/page/page.context',
  "./shortcuts.mock.data.js",
  "../../../utils/testutils/async.test.utils.js",
], function (require, $, _, Marionette, ShortcutsView, PageContext, ShortcutsMock, TestUtils) {

  describe("Shortcuts Widget", function () {

    var context, w;

    beforeAll(function () {
      ShortcutsMock.enable();

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
    });

    afterAll(function () {
      ShortcutsMock.disable();
      TestUtils.cancelAllAsync();
      TestUtils.restoreEnvironment();
    });

    describe("migrate and render with single shortcut widget data", function () {
      it("grey to stone1 theme", function (done) {
        var shortcut = new ShortcutsView({
          context: context,
          data: ShortcutsView.migrateData('shortcut',
              {id: 50000, background: 'cs-tile-background1'})
        });
        expect(shortcut).toBeDefined();
        var region = new Marionette.Region({
          el: $('body')
        });
        region.show(shortcut);
        expect(shortcut.$el.length).toEqual(1);
        TestUtils.asyncElement(shortcut.$el, '.csui-shortcut-item').done(function ($shortcuts) {
          expect($shortcuts.length).toEqual(1);
          expect($shortcuts.is('[class*="csui-shortcut-theme-stone1"]')).toBeTruthy();
          shortcut.destroy();
          done();
        });
      });
      it("green to teal2 theme", function (done) {
        var shortcut = new ShortcutsView({
          context: context,
          data: ShortcutsView.migrateData('shortcut',
              {id: 50000, background: 'cs-tile-background2'})
        });
        expect(shortcut).toBeDefined();
        var region = new Marionette.Region({
          el: $('body')
        });
        region.show(shortcut);
        expect(shortcut.$el.length).toEqual(1);
        TestUtils.asyncElement(shortcut.$el, '.csui-shortcut-item').done(function ($shortcuts) {
          expect($shortcuts.length).toEqual(1);
          expect($shortcuts.is('[class*="csui-shortcut-theme-teal2"]')).toBeTruthy();
          shortcut.destroy();
          done();
        });
      });
      it("orange to pink1 theme", function (done) {
        var shortcut = new ShortcutsView({
          context: context,
          data: ShortcutsView.migrateData('shortcut',
              {id: 50000, background: 'cs-tile-background3'})
        });
        expect(shortcut).toBeDefined();
        var region = new Marionette.Region({
          el: $('body')
        });
        region.show(shortcut);
        expect(shortcut.$el.length).toEqual(1);
        TestUtils.asyncElement(shortcut.$el, '.csui-shortcut-item').done(function ($shortcuts) {
          expect($shortcuts.length).toEqual(1);
          expect($shortcuts.is('[class*="csui-shortcut-theme-pink1"]')).toBeTruthy();
          shortcut.destroy();
          done();
        });
      });
    });

    it("initiaze and render with single item (large)", function (done) {
      var w = new ShortcutsView({
        context: context,
        data: {shortcutTheme: "csui-shortcut-theme-stone1", shortcutItems: [{id: 50000}]}
      });
      expect(w).toBeDefined();
      w.render();
      expect(w.$el.length).toEqual(1);
      TestUtils.asyncElement(w.$el, '.csui-shortcut-item').done(function ($shortcuts) {
        expect($shortcuts.length).toEqual(1);
        expect($shortcuts.hasClass('csui-large')).toBeTruthy();
        w.destroy();
        done();
      });
    });

    it("initiaze and render with two items (medium)", function (done) {
      var w = new ShortcutsView({
        context: context,
        data: {
          shortcutTheme: "csui-shortcut-theme-stone1",
          shortcutItems: [{id: 50000}, {id: 60000}]
        }
      });
      expect(w).toBeDefined();
      w.render();
      expect(w.$el.length).toEqual(1);
      TestUtils.asyncElement(w.$el, '.csui-shortcut-item').done(function ($shortcuts) {
        expect($shortcuts.length).toEqual(2);
        expect($shortcuts.hasClass('csui-medium')).toBeTruthy();
        w.destroy();
        done();
      });
    });

    it("initiaze and render with more than two items (small)", function (done) {
      var w = new ShortcutsView({
        context: context,
        data: {
          shortcutTheme: "csui-shortcut-theme-stone1",
          shortcutItems: [{id: 50000}, {id: 60000}, {id: 70000}]
        }
      });
      expect(w).toBeDefined();
      w.render();
      expect(w.$el.length).toEqual(1);
      TestUtils.asyncElement(w.$el, '.csui-shortcut-item').done(function ($shortcuts) {
        expect($shortcuts.length).toEqual(3);
        expect($shortcuts.hasClass('csui-small')).toBeTruthy();
        w.destroy();
        done();
      });
    });

    it("initiaze and render with invalid node", function (done) {
      var w = new ShortcutsView({
        context: context,
        data: {shortcutTheme: "csui-shortcut-theme-stone1", shortcutItems: [{id: 2004}]}
      });
      expect(w).toBeDefined();
      w.render();
      expect(w.$el.length).toEqual(1);
      TestUtils.asyncElement(w.$el, '.csui-shortcut-item').done(function ($shortcuts) {
        expect($shortcuts.length).toEqual(1);
        expect($shortcuts.hasClass('csui-failed')).toBeTruthy();
        w.destroy();
        done();
      });
    });

    it("instanze and render in edit mode as self configurable perspective widget",
        function (resultCallback) {
          require(["csui/perspective.manage/behaviours/pman.widget.config.behaviour"], function () {
            var container = $("<div></div>").appendTo(
                $("<div class='cs-perspective'></div>").appendTo(
                    $("<div class='perspective-editing'></div>").appendTo($('body'))));
            var region = new Marionette.Region({
              el: container
            });

            var editableW = new ShortcutsView({
              context: context,
              perspectiveMode: 'edit',
              data: {
                shortcutTheme: "csui-shortcut-theme-stone1",
                shortcutItems: [{id: 50000}]
              }
            });
            expect(editableW).toBeDefined();
            region.show(editableW);
            expect(editableW.$el.length).toEqual(1);
            TestUtils.asyncElement(editableW.$el, '.csui-shortcut-item:visible').done(
                function ($shortcuts) {
                  expect($shortcuts.hasClass('csui-medium')).toBeTruthy();
                  expect($shortcuts.length).toEqual(2); // Actual Items (3) + "Add shortcut" tile
                  expect($shortcuts.find('.csui-configure-perspective-widget').length).toEqual(2); // Masking Applied to original items
                  expect($shortcuts.filter('.csui-pman-shortcut-new').length).toEqual(1);
                  var $fitstItem = $($shortcuts[0]);
                  $fitstItem.find('.csui-pman-widget-masking').trigger('click');
                  TestUtils.asyncElement($fitstItem,
                      '.csui-configure-perspective-widget.cs-pman-callout-ready').done(
                      function ($callout) {
                        expect($callout.length).toEqual(1);
                        editableW.destroy();
                        resultCallback();
                      });
                });
          });
        });

    xit("navigates between shortcuts using KEYs", function (done) {
      var forKN = new ShortcutsView({
        context: context,
        data: {
          shortcutTheme: "csui-shortcut-theme-stone1",
          shortcutItems: [{id: 50000}, {id: 60000}, {id: 70000}]
        }
      });
      var region = new Marionette.Region({
        el: $('body')
      });
      region.show(forKN);
      TestUtils.asyncElement(forKN.$el, '.csui-shortcut-item').done(function ($shortcuts) {
        expect($shortcuts.length).toEqual(3);
        const downArrow = $.Event('keydown');
        downArrow.keyCode = 40;
        forKN.$el.trigger(downArrow);
        expect($shortcuts.get(1) === document.activeElement).toBeTruthy();
        const upArrow = $.Event('keydown');
        upArrow.keyCode = 38;
        forKN.$el.trigger(upArrow);
        expect($shortcuts.get(0) === document.activeElement).toBeTruthy();
        const enter = $.Event('keydown');
        enter.keyCode = 13;
        forKN.$el.trigger(enter);
        forKN.destroy();
        done();
      });
    });

  });

});
