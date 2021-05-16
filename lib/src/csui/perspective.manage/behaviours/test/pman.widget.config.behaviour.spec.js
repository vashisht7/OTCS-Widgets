/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', "csui/lib/jquery", 'csui/lib/backbone', 'csui/lib/marionette',
      "csui/perspective.manage/behaviours/pman.widget.config.behaviour",
      'csui/controls/tile/tile.view',
      "../../../utils/testutils/async.test.utils.js",
      "../../../utils/testutils/drag-mock.js",
      "json!./simple.widget.manifest.json",
      "json!./selfconfigurable.widget.manifest.json",
      "json!./unsupported.widget.manifest.json",
    ],
    function (_, $, Backbone, Marionette, WidgetConfigBehaviour, TileView, TestUtils, DragMock,
        simpleManifest, selfConfigurableManifest, unsupportedManifest) {

      describe("Perspective widget configuration behaviour", function () {
        var ContentView       = Marionette.View.extend({
              className: 'test-content'
            }),
            widgetToBeDropped = {
              id: "csui/widgets/favorites"
            };

        function prepareWidget(manifest) {

          TileWidget = TileView.extend({
            icon: 'title-favourites',
            title: 'Test Widget',
            contentView: ContentView,
            behaviors: {
              WidgetConfigBehaviour: { // For widget editing
                behaviorClass: WidgetConfigBehaviour,
                manifest: manifest,
                perspectiveSelector: '.binf-widgets',
                widgetConfig: function () {
                  return {
                    options: {}
                  };
                }
              }
            },
            getSupportedWidgetSizes: function (manifest, widget) {
              return _.map(manifest.supportedKinds, function (suppKind, index) {
                return {
                  kind: suppKind,
                  label: suppKind,
                  selected: index === 0
                };
              });
            }
          });
          return TileWidget;
        }

        beforeAll(function () {
          $('body').addClass('perspective-editing');
        });

        afterAll(function () {
          $('body').removeClass('perspective-editing');
          TestUtils.cancelAllAsync();
          TestUtils.restoreEnvironment();
        });

        xdescribe("with simple widget", function () {

          var TileWidget = prepareWidget(simpleManifest),
              $containerEl, widgetView;
          beforeEach(function () {
            $containerEl = $('<div id="simple-container"></div>').appendTo('body');
            var region = new Marionette.Region({
              el: $containerEl
            });
            widgetView = new TileWidget();
            region.show(widgetView);
          });
          afterEach(function () {
            $containerEl.empty();
          });

          it("key down are not propagated beyond callout", function () {
            const keyDownEv = new Event('keydown');
            spyOn(keyDownEv, 'stopPropagation');
            spyOn(keyDownEv, 'stopImmediatePropagation');

            widgetView.$el.find('.csui-configure-perspective-widget')[0].dispatchEvent(keyDownEv);

            expect(keyDownEv.stopPropagation).toHaveBeenCalled();
            expect(keyDownEv.stopImmediatePropagation).toHaveBeenCalled();
          });

          it("key press are not propagated beyond callout", function () {
            const keyPressEv = new Event('keypress');
            spyOn(keyPressEv, 'stopPropagation');
            spyOn(keyPressEv, 'stopImmediatePropagation');

            widgetView.$el.find('.csui-configure-perspective-widget')[0].dispatchEvent(keyPressEv);

            expect(keyPressEv.stopPropagation).toHaveBeenCalled();
            expect(keyPressEv.stopImmediatePropagation).toHaveBeenCalled();
          });

          it("click on widget opens callout", function (done) {
            widgetView.$el.find('.csui-pman-widget-masking').trigger("click");
            TestUtils.asyncElement(widgetView.$el,
                '.csui-configure-perspective-widget .pman-widget-popover').done(
                function ($calloutEl) {
                  expect($calloutEl.length).toEqual(1);
                  done();
                });
          });

          it("dropping new widget will confirm and replace", function (done) {
            var dragSource = widgetView.el.querySelector('.csui-pman-widget-masking');
            var dropTarget = widgetView.el.querySelector('.csui-pman-widget-masking');
            var hoverRegion = widgetView.el.querySelector('.csui-pman-widget-masking');
            DragMock
                .dragStart(dragSource, function (event) {
                  event.dataTransfer.setData('text', JSON.stringify(widgetToBeDropped));
                }).dragEnter(hoverRegion)
                .dragOver(hoverRegion)
                .dragLeave(hoverRegion)
                .drop(dropTarget, function (event) {
                  TestUtils.asyncElement('body',
                      '.binf-widgets .binf-modal-dialog .binf-modal-content').done(
                      function (el) {
                        expect(el.length).toEqual(1);
                        var replaceBtn = el.find('.binf-modal-footer .csui-yes');
                        expect(replaceBtn.length).toEqual(1);
                        replaceBtn.trigger("click");
                        TestUtils.asyncElement('body', '.binf-widgets .binf-modal-dialog',
                            true).done(
                            function () {
                              done();
                            });
                      });
                });
          });

        });

        describe("with upsupported widget", function () {

          var TileWidget = prepareWidget(unsupportedManifest),
              $containerEl, widgetView;
          beforeEach(function () {
            $containerEl = $('<div id="upsupported-container"></div>').appendTo('body');
            var region = new Marionette.Region({
              el: $containerEl
            });
            widgetView = new TileWidget();
            region.show(widgetView);
          });
          afterEach(function () {
            $containerEl.empty();
          });

          it("click on widget opens callout with 'unsupported' configuration message",
              function (done) {
                widgetView.$el.find('.csui-pman-widget-masking').trigger("click");
                TestUtils.asyncElement(widgetView.$el,
                    '.csui-configure-perspective-widget .pman-widget-popover').done(
                    function ($calloutEl) {
                      expect($calloutEl.length).toEqual(1);
                      expect($calloutEl.find(
                          ".csui-pman-form-header .csui-error-message").length).toEqual(1);
                      expect($calloutEl.find(".csui-pman-form-header .csui-error-message").is(
                          ":visible")).toBeTruthy();
                      done();
                    });
              });

        });

        describe("with self configurable widget", function () {
          var TileWidget = prepareWidget(selfConfigurableManifest),
              $containerEl, widgetView;
          beforeEach(function () {
            $containerEl = $('<div id="selfconfigurable-container"></div>').appendTo('body');
            var region = new Marionette.Region({
              el: $containerEl
            });
            widgetView = new TileWidget();
            region.show(widgetView);
          });
          afterEach(function () {
            $containerEl.empty();
          });

          it("masking will exist and hidden", function (done) {
            TestUtils.asyncElement(widgetView.$el,
                '.csui-configure-perspective-widget.csui-has-editing-capability').done(
                function ($unSupported) {
                  expect($unSupported.length).toEqual(1);
                  expect($unSupported.is(":visible")).toBeFalsy();
                  done();
                });
          });
        });
      });
    });