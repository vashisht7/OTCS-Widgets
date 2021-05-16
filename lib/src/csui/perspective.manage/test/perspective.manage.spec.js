/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["require", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/marionette",
  "csui/lib/backbone", "./perspective.manage.mock.js",
  'csui/controls/perspective.panel/perspective.panel.view',
  "csui/utils/contexts/page/page.context",
  'csui/perspective.manage/pman.view',
  'csui/utils/contexts/factories/connector',
  "../../utils/testutils/async.test.utils.js",
  "../../utils/testutils/drag-mock.js",
  'csui/lib/bililiteRange',
  'csui/lib/jquery.simulate',
  'csui/lib/jquery.simulate.ext',
  'csui/lib/jquery.simulate.key-sequence'
], function (require, $, _, Marionette, Backbone, Mock, PerspectivePanelView,
    PageContext, PManView, ConnectorFactory, TestUtils, DragMock) {
  'use strict';
  describe("Perspective Manager", function () {

    var context, perspectivePanel, pmanView, perspective;

    beforeAll(function (done) {
      Mock.enable();
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
      context.perspective = new Backbone.Model({
        "id": 398548,
        "type": "flow",
        "options": {
          "widgets": [{
            "type": "csui/widgets/welcome.placeholder"
          },
            {
              "type": "csui/widgets/myassignments"
            },
            {
              "type": "csui/widgets/favorites"
            },
            {
              "type": "csui/widgets/recentlyaccessed"
            },
            {
              "type": "csui/widgets/search.custom",
              "options": {
                "savedSearchQueryId": 391383
              }
            }
          ]
        }
      });
      require(['csui/models/perspective/perspective.model'], function (PerspectiveModel) {
        perspective = new PerspectiveModel({
          id: context.perspective.get('id'),
          perspective: _.pick(context.perspective.attributes, 'type', 'options')
        }, {
          connector: context.getObject(ConnectorFactory)
        });
        perspectivePanel = new PerspectivePanelView({
          context: context
        });
        $('body').append('<div id="perspective-panel-view"></div>');
        var region = new Marionette.Region({
          el: "#perspective-panel-view"
        });
        region.show(perspectivePanel);
        perspectivePanel.listenTo(perspectivePanel, 'show:perspective', function () {
          pmanView = new PManView({
            context: context,
            perspective: perspective
          });
          pmanView.show();
        });
        done();
      });

    });

    afterAll(function () {
      TestUtils.cancelAllAsync();
      TestUtils.restoreEnvironment();
    });

    it("should render Perspective Manager header", function (done) {
      TestUtils.asyncElement('body', '.pman-header .pman-tools-container').done(
          function ($tools) {
            expect($tools.find('.pman-left-tools .icon-toolbarAdd').length).toEqual(1);
            expect($tools.find('.pman-right-tools .icon-save').length).toEqual(1);
            expect($tools.find(' .pman-right-tools .cancel-edit').length).toEqual(1);
            done();
          });
    });

    describe("Add perspective", function () {
      var $addToolbar = $('.pman-tools-container .icon-toolbarAdd');
      it("should open pman panel on selecting add item", function (done) {
        $('.pman-tools-container .pman-left-tools> ul > li .icon-toolbarAdd').trigger('click');
        TestUtils.asyncElement('body', '.csui-pman-panel .load-container.binf-hidden').done(
            function (el) {
              expect($('.csui-tab-pannel').find('.csui-layout-tab').length).toEqual(1);
              expect($('.csui-tab-pannel').find('.csui-widget-tab').length).toEqual(1);
              done();
            });

      });
      describe("PMan Panel", function () {
        it("should show list of layouts", function () {
          $('.csui-layout-tab').trigger('click');
          expect($('.csui-list-pannel .csui-layout-item').length > 1).toBeTruthy();
          $(".csui-pman-list .arrow_back").trigger('click');
        });
        it("should show accordion list of modules", function (done) {
          $('.csui-accordion-header').trigger('click');
          TestUtils.asyncElement('body', '.csui-accordion-content .cs-list-group').done(
              function (el) {
                expect(el.length).toEqual(1);
                done();
              });
        });
        it("Drag widget from list", function (done) {
          var dragSource = pmanView.el.querySelector(
              '.csui-accordion-content .cs-list-group .csui-widget-item');
              var hoverRegion = document.querySelector('.csui-perspective-view');
          var dropTarget = document.querySelector('.csui-perspective-view .cs-perspective');
          DragMock
              .dragStart(dragSource, function (event) {
                event.dataTransfer.setData('text', JSON.stringify({id: "csui/widgets/favorites"}));
              }).dragEnter(hoverRegion)
              .dragOver(hoverRegion)
              .dragLeave(hoverRegion)
              .drop(dropTarget, function (event) {
                done();
              });
        });

      });

      describe("PMan Body", function () {
        describe("Flow Perspective in edit mode", function () {
          it("should show empty placeholder in flow perspective", function (done) {
            TestUtils.asyncElement('body',
                '.cs-perspective .csui-pman-editable-widget').done(
                function () {
                  var emptyPlaceHolder = $(
                      '.cs-perspective .csui-pman-editable-widget.csui-pman-placeholder-container');
                  expect(emptyPlaceHolder[0]).toBeDefined();
                  done();
                });
          });
          it("should show existing widgets in edit mode", function () {
            var widgets     = $(
                '.cs-perspective .csui-pman-editable-widget:not(.csui-pman-placeholder-container)'),
                widgetClose = widgets.find(".csui-pman-widget-close");
            expect(widgets.length).toEqual(widgetClose.length);
          });
          it("should show alert dialog on clicking close", function (done) {

            var widgets = $(
                '.cs-perspective .csui-pman-editable-widget:not(.csui-pman-placeholder-container)'),
                widget  = widgets.last();
            expect(widgets.length).toEqual(5);
            widget.find(".csui-pman-widget-close").trigger('click');
            TestUtils.asyncElement('body',
                '.binf-widgets .binf-modal-dialog .binf-modal-content').done(
                function (el) {
                  expect(el.length).toEqual(1);
                  done();
                });
          });
          it("should allow widget delete", function (done) {
            $('.binf-widgets .binf-modal-dialog .binf-modal-footer .csui-yes').trigger('click');
            TestUtils.asyncElement('body', '.binf-widgets .binf-modal-dialog', true).done(
                function () {
                  var widgets = $(
                      '.cs-perspective .csui-pman-editable-widget:not(.csui-pman-placeholder-container)');
                  expect(widgets.length).toEqual(4);
                  done();
                });
          });
          it("should not render form in create mode inside popover for widgets without configuration",
              function (done) {
                var noConfigurationWidget = $(
                    '.csui-configure-perspective-widget .csui-pman-widget-masking').eq(1);
                noConfigurationWidget.trigger('click');
                TestUtils.asyncElement('.cs-perspective',
                    '.csui-pman-editable-widget .binf-popover.binf-in').done(
                    function (el) {
                      var form = el.find('.cs-form.cs-form-create');
                      expect(form.length).toEqual(0);
                      done();
                    });
              });
          it("should close opened popover and open another popover for widgets with configuration",
              function (done) {
                var configurationWidget = $(
                    '.csui-configure-perspective-widget .csui-pman-widget-masking').first();
                configurationWidget.trigger('click');
                TestUtils.asyncElement('.cs-perspective', '.binf-popover.binf-in', true).done(
                    function () {
                      expect($('.binf-popover.binf-in').length).toEqual(0);
                      configurationWidget.trigger('click');
                      TestUtils.asyncElement('.cs-perspective',
                          '.csui-pman-editable-widget .binf-popover.binf-in').done(
                          function (el) {
                            expect(el.length).toEqual(1);
                            done();
                          });
                    });
              });
          it("should render form in create mode inside popover", function () {
            var popover = $('.cs-perspective .csui-pman-editable-widget .binf-popover'),
                form    = popover && popover.find('.cs-form.cs-form-create');
            expect(form.length).toEqual(1);
          });
          it("should close popover on click outside widget and popover", function (done) {
            var popover = $('.cs-perspective .csui-pman-editable-widget .binf-popover.binf-in');
            $('.pman-backdrop').trigger('click');
            if (popover.length) {
              TestUtils.asyncElement('body', '.binf-popover.binf-in', true).done(
                  function () {
                    expect($('.binf-popover.binf-in').length).toEqual(0);
                    done();
                  });
            } else {
              done();
            }
          });
        });

        describe("perspective in edit mode with live data ", function () {
          it("should change background inside shortcut widget", function (done) {
            TestUtils.asyncElement('.perspective-editing',
                '.cs-perspective .csui-pman-editable-widget').done(
                function () {
                  $('.perspective-editing' +
                    ' .csui-pman-editable-widget[data-csui-widget_type="shortcut"]' +
                    ' .csui-pman-widget-masking').trigger('click');
                  $(".binf-popover div[data-alpaca-container-item-name='background']" +
                    " .cs-field-write button").trigger('click');
                  $(".binf-popover div[data-alpaca-container-item-name='background']" +
                    " .binf-dropdown-menu > li > a").last().trigger('click');
                  $(".csui-dnd-container").trigger('click');
                  TestUtils.asyncElement('.perspective-editing',
                      '.csui-pman-editable-widget[data-csui-widget_type="shortcut"] .cs-shortcut.cs-tile-background3').done(
                      function (el) {
                        expect(el.length).toEqual(1);
                        done();
                      });
                  done();
                });
          });
          it("should show live data inside widget", function (done) {
            TestUtils.asyncElement('.perspective-editing',
                '.cs-perspective .csui-pman-editable-widget').done(
                function () {
                  var liveContent = $(
                      '.cs-perspective .csui-pman-editable-widget .cs-favorites .tile-content');
                  expect(liveContent.length).toEqual(1);
                  done();
                });
          });

        });

      });

      describe("Change layout", function () {
        it("Check for change page layout section", function (done) {
          $addToolbar.trigger('click');
          TestUtils.asyncElement('.perspective-editing',
              '.csui-pman-panel .load-container.binf-hidden').done(
              function (el) {
                expect($('.csui-tab-pannel').find('.csui-layout-tab').length).toEqual(1);
                done();
              });
        });
        it("Check that current layout is highlighted", function (done) {
          $('.csui-layout-tab').trigger('click');
          TestUtils.asyncElement('.perspective-editing',
              '.csui-list-pannel .csui-layout-item').done(
              function (el) {
                expect($('.csui-layout-item.binf-active .csui-layout-flow').length).toEqual(1);
                done();
              });
        });
        it("Try to change the layout and check for confirmation dialog", function (done) {
          $('.csui-layout-item .csui-layout-lcr').trigger('click');
          TestUtils.asyncElement('body', '.csui-alert').done(
              function (el) {
                expect($('.csui-alert').find('.binf-modal-dialog').length).toEqual(1);
                done();
              });
        });
        it("Change the layout and verify that all widgets removed from the page", function (done) {
          $('.csui-alert .binf-modal-dialog .csui-yes').trigger('click');
          TestUtils.asyncElement('.perspective-editing', '.cs-left-center-right-perspective').done(
              function (el) {
                expect(
                    $('.cs-perspective .csui-pman-editable-widget.csui-pman-placeholder-container').length).toEqual(
                    3);
                done();
              });

        });

      });

      describe("perspective in edit mode with widget having error", function () {
        it("Save button should disable if any widget is having error", function (done) {
          var dragSource = pmanView.el.querySelectorAll(
              '.csui-accordion-content .cs-list-group .ui-sortable .csui-widget-item')[5];
          var dropTarget = document.querySelector('.csui-pman-widget-masking');
          DragMock
              .dragStart(dragSource, function (event) {
                event.dataTransfer.setData('text',
                    JSON.stringify({id: "csui/widgets/search.custom"}));
              }).dragEnter(dropTarget)
              .dragOver(dropTarget)
              .dragLeave(dropTarget)
              .drop(dropTarget, function () {
                TestUtils.asyncElement('.perspective-editing',
                    '.binf-popover').done(
                    function (el) {
                      expect(el.length).toEqual(1);
                      $('.pman-backdrop').trigger('click');
                      expect($('.pman-right-tools .icon-save[disabled]').length).toEqual(1);
                      done();
                    });
              });
        });
        it("Save button should enable on removing the widget having error", function (done) {
          var errorWidget = $(
              '.cs-perspective .csui-configure-perspective-widget.binf-perspective-has-error');
          errorWidget.find(".csui-pman-widget-close").trigger('click');
          TestUtils.asyncElement('.perspective-editing',
              '.binf-widgets .binf-modal-dialog .binf-modal-content').done(
              function () {
                $('.binf-widgets .binf-modal-dialog .binf-modal-footer .csui-yes').trigger('click');
                TestUtils.asyncElement('.perspective-editing', '.binf-perspective-has-error',
                    true).done(
                    function () {
                      expect($('.pman-right-tools .icon-save[disabled]').length).toEqual(0);
                      done();
                    });
              });
        });
      });

      describe("Drop widget", function () {
        it("should open callout on drop of any widget", function (done) {
          var dragSource = pmanView.el.querySelectorAll(
              '.csui-accordion-content .cs-list-group .ui-sortable .csui-widget-item')[2];
          var dropTarget = document.querySelector('.csui-pman-widget-masking');
          DragMock
              .dragStart(dragSource, function (event) {
                event.dataTransfer.setData('text',
                    JSON.stringify({id: "csui/widgets/myassignments"}));
              }).dragEnter(dropTarget)
              .dragOver(dropTarget)
              .dragLeave(dropTarget)
              .drop(dropTarget, function () {
                TestUtils.asyncElement('.perspective-editing',
                    '.csui-pman-editable-widget[data-csui-widget_type="myassignments"] .binf-popover').done(
                    function (el) {
                      expect(el.length).toEqual(1);
                      done();
                    });
              });
        });
        it("should open callout on replace of any widget", function (done) {
          var dragSource = pmanView.el.querySelectorAll(
              '.csui-accordion-content .cs-list-group .ui-sortable .csui-widget-item')[1];
          var dropTarget = document.querySelector('.csui-pman-widget-masking');
          DragMock
              .dragStart(dragSource, function (event) {
                event.dataTransfer.setData('text', JSON.stringify({id: "csui/widgets/favorites"}));
              }).dragEnter(dropTarget)
              .dragOver(dropTarget)
              .dragLeave(dropTarget)
              .drop(dropTarget, function () {
                TestUtils.asyncElement('.perspective-editing',
                    '.binf-widgets .binf-modal-dialog .binf-modal-content').done(
                    function (el) {
                      $('.binf-widgets .binf-modal-dialog .binf-modal-footer .csui-yes').trigger(
                          'click');
                      TestUtils.asyncElement('.perspective-editing',
                          '.csui-pman-editable-widget[data-csui-widget_type="favorites"] .binf-popover').done(
                          function (el) {
                            expect(el.length).toEqual(1);
                            $('.csui-pman-editable-widget[data-csui-widget_type="favorites"]').find(
                                ".csui-pman-widget-close").trigger('click');
                            TestUtils.asyncElement('.perspective-editing',
                                '.binf-widgets .binf-modal-dialog .binf-modal-content').done(
                                function () {
                                  $('.binf-widgets .binf-modal-dialog .binf-modal-footer .csui-yes').trigger(
                                      'click');
                                  TestUtils.asyncElement('.perspective-editing',
                                      '.csui-pman-editable-widget[data-csui-widget_type="favorites"]',
                                      true).done(
                                      function (el) {
                                        expect(el.length).toEqual(0);
                                        done();
                                      });
                                });
                          });
                    });
              });
        });
      });
    });

    describe("Shortcut widget", function () {
      it("should show emtpy (+) shortcut and open callout on drop of shortcut widget",
          function (done) {
            var dragSource = pmanView.el.querySelectorAll(
                '.csui-accordion-content .cs-list-group .ui-sortable .csui-widget-item')[7];
            var dropTarget = document.querySelector('.csui-pman-widget-masking');
            DragMock
                .dragStart(dragSource, function (event) {
                  event.dataTransfer.setData('text',
                      JSON.stringify({id: "csui/widgets/shortcuts"}));
                }).dragEnter(dropTarget)
                .dragOver(dropTarget)
                .dragLeave(dropTarget)
                .drop(dropTarget, function () {
                  TestUtils.asyncElement('.perspective-editing',
                      '.csui-pman-editable-widget[data-csui-widget_type="shortcuts"] .binf-popover').done(
                      function (el) {
                        expect(el.length).toEqual(1);
                        var addShortcut = $(".csui-large.csui-pman-shortcut-new");
                        expect(addShortcut.length).toEqual(1);
                        done();
                      });
                });
          });

      it("should show error message with remove button on clicking outside of emtpy (+) shortcut, disable save button and close callout",
          function (done) {
            $('.pman-backdrop').trigger('click');
            TestUtils.asyncElement('.perspective-editing',
                '.csui-pman-editable-widget[data-csui-widget_type="shortcuts"] .binf-popover',
                true).done(
                function (el) {
                  expect(el.length).toEqual(0);
                  expect($(".csui-pman-shortcut-new .binf-perspective-has-error").length).toEqual(
                      1);
                  expect(
                      $('.csui-pman-shortcut-new .csui-pman-widget-error-message').text().trim()).toEqual(
                      "Configuration needed.");
                  expect($(".csui-pman-shortcut-new .csui-pman-widget-close").length).toEqual(1);
                  expect($(".csui-pman-shortcut-new .csui-pman-widget-close").attr(
                      'title')).toEqual("Remove Widget");
                  expect($('.pman-right-tools .icon-save[disabled]').length).toEqual(1);
                  done();
                });
          });

      it("should be able to remove on clicking close icon",
          function (done) {
            $(".csui-pman-shortcut-new .csui-pman-widget-close").trigger('click');
            TestUtils.asyncElement('.perspective-editing',
                '.binf-modal-content').done(
                function () {
                  $('.binf-modal-dialog .csui-yes').trigger('click');
                  TestUtils.asyncElement('.perspective-editing', '.csui-pman-shortcut-new',
                      true).done(
                      function (el) {
                        expect(el.length).toEqual(0);
                        done();
                      });
                });
          });

      it("should show emtpy (+) shortcut on drop of shortcut widget for configuring shortcuts",
          function (done) {
            var dragSource = pmanView.el.querySelectorAll(
                '.csui-accordion-content .cs-list-group .ui-sortable .csui-widget-item')[7];
            var dropTarget = document.querySelector('.csui-pman-widget-masking');
            DragMock
                .dragStart(dragSource, function (event) {
                  event.dataTransfer.setData('text',
                      JSON.stringify({id: "csui/widgets/shortcuts"}));
                }).dragEnter(dropTarget)
                .dragOver(dropTarget)
                .dragLeave(dropTarget)
                .drop(dropTarget, function () {
                  TestUtils.asyncElement('.perspective-editing',
                      '.csui-pman-editable-widget[data-csui-widget_type="shortcuts"] .binf-popover').done(
                      function (el) {
                        expect(el.length).toEqual(1);
                        expect($(".csui-large.csui-pman-shortcut-new").length).toEqual(1);
                        done();
                      });
                });
          });

      it("should remove error message and add shortcut after configured shortcut and enable save button",
          function (done) {
            $('.pman-backdrop').trigger('click');
            TestUtils.asyncElement('.perspective-editing',
                '.csui-pman-editable-widget[data-csui-widget_type="shortcuts"] .binf-popover',
                true).done(
                function (el) {
                  expect(el.length).toEqual(0);
                  expect($(".csui-pman-shortcut-new .binf-perspective-has-error").length).toEqual(
                      1);
                  $(".csui-large.csui-pman-shortcut-new .csui-pman-widget-masking").trigger(
                      'click');
                  TestUtils.asyncElement('.perspective-editing',
                      '.csui-pman-editable-widget[data-csui-widget_type="shortcuts"] .csui-pman-shortcut-new  .cs-pman-callout-ready .binf-popover').done(
                      function (el) {
                        expect($(".csui-pman-shortcut-new .binf-popover").length).toEqual(1);
                        el.find(".binf-dropdown-toggle").eq(1).trigger('click');
                        el.find(".binf-dropdown-menu:visible li a").eq(2).trigger('click');
                        el.find(".cs-formfield input").eq(1).trigger("focus");
                        TestUtils.asyncElement('.perspective-editing',
                            '.csui-shortcut-item:not(.csui-pman-shortcut-new) .binf-popover').done(
                            function (el) {
                              expect(el.length).toEqual(1);
                              expect(
                                  $(".csui-pman-shortcut-new .binf-perspective-has-error").length).toEqual(
                                  0);
                              expect($(".csui-medium.csui-pman-shortcut-new").length).toEqual(1);
                              expect($(".csui-shortcut-item").length).toEqual(2);
                              expect(
                                  $(".csui-shortcut-item:not(.csui-pman-shortcut-new) .csui-pman-widget-close").attr(
                                      'title')).toEqual("Remove Widget");
                              expect($('.pman-right-tools .icon-save[disabled]').length).toEqual(0);
                              done();
                            });
                      });
                });
          });

      it("should open callout to add another shortcut on clicking Add shortcut and callout should remain open",
          function (done) {
            $('.pman-backdrop').trigger('click');
            TestUtils.asyncElement('.perspective-editing',
                '.csui-pman-editable-widget[data-csui-widget_type="shortcuts"] .binf-popover',
                true).done(
                function (el) {
                  expect(el.length).toEqual(0);
                  $(".csui-pman-shortcut-new .csui-pman-widget-masking").trigger('click');
                  TestUtils.asyncElement('.perspective-editing',
                      '.csui-pman-editable-widget[data-csui-widget_type="shortcuts"] .csui-pman-shortcut-new  .cs-pman-callout-ready .binf-popover').done(
                      function (el) {
                        expect($(".csui-pman-shortcut-new .binf-popover").length).toEqual(1);
                        el.find(".binf-dropdown-toggle").eq(1).trigger('click');
                        el.find(".binf-dropdown-menu:visible li a").eq(2).trigger('click');
                        el.find(".cs-formfield input").eq(1).trigger("focus");
                        TestUtils.asyncElement('.perspective-editing',
                            '.csui-shortcut-item:not(.csui-pman-shortcut-new) .binf-popover').done(
                            function (el) {
                              expect(el.length).toEqual(1);
                              expect($(".csui-pman-shortcut-new").length).toEqual(1);
                              expect($(".csui-shortcut-item").length).toEqual(3);
                              expect(
                                  $(".csui-shortcut-item:not(.csui-pman-shortcut-new) .csui-pman-widget-close").attr(
                                      'title')).toEqual("Remove shortcut");
                              expect(
                                  $(".csui-shortcut-item:not(.csui-pman-shortcut-new) .binf-popover").length).toEqual(
                                  1);
                              done();
                            });
                      });
                });
          });

      it("should add third shortcut on clicking Add shortcut by configuring through popover and callout should remain open",
          function (done) {
            $('.pman-backdrop').trigger('click');
            TestUtils.asyncElement('.perspective-editing',
                '.csui-pman-editable-widget[data-csui-widget_type="shortcuts"] .binf-popover',
                true).done(
                function (el) {
                  expect(el.length).toEqual(0);
                  $(".csui-pman-shortcut-new .csui-pman-widget-masking").trigger('click');
                  TestUtils.asyncElement('.perspective-editing',
                      '.csui-pman-editable-widget[data-csui-widget_type="shortcuts"] .csui-pman-shortcut-new  .cs-pman-callout-ready .binf-popover').done(
                      function (el) {
                        expect($(".csui-pman-shortcut-new .binf-popover").length).toEqual(1);
                        el.find(".binf-dropdown-toggle").eq(1).trigger('click');
                        el.find(".binf-dropdown-menu:visible li a").eq(2).trigger('click');
                        el.find(".cs-formfield input").eq(1).trigger("focus");
                        TestUtils.asyncElement('.perspective-editing',
                            '.csui-shortcut-item:not(.csui-pman-shortcut-new) .binf-popover').done(
                            function (el) {
                              expect(el.length).toEqual(1);
                              expect($(".csui-pman-shortcut-new").length).toEqual(1);
                              expect($(".csui-shortcut-item").length).toEqual(4);
                              expect(
                                  $(".csui-shortcut-item:not(.csui-pman-shortcut-new) .csui-pman-widget-close").attr(
                                      'title')).toEqual("Remove shortcut");
                              done();
                            });
                      });
                });
          });

      it("should add fourth shortcut on clicking Add shortcut and Add shortcut should be removed",
          function (done) {
            $('.pman-backdrop').trigger('click');
            TestUtils.asyncElement('.perspective-editing',
                '.csui-pman-editable-widget[data-csui-widget_type="shortcuts"] .binf-popover',
                true).done(
                function (el) {
                  expect(el.length).toEqual(0);
                  $(".csui-pman-shortcut-new .csui-pman-widget-masking").trigger('click');
                  TestUtils.asyncElement('.perspective-editing',
                      '.csui-pman-editable-widget[data-csui-widget_type="shortcuts"] .csui-pman-shortcut-new  .cs-pman-callout-ready .binf-popover').done(
                      function (el) {
                        expect($(".csui-pman-shortcut-new .binf-popover").length).toEqual(1);
                        el.find(".binf-dropdown-toggle").eq(1).trigger('click');
                        el.find(".binf-dropdown-menu:visible li a").eq(2).trigger('click');
                        el.find(".cs-formfield input").eq(1).trigger("focus");
                        TestUtils.asyncElement('.perspective-editing',
                            '.csui-shortcut-item:not(.csui-pman-shortcut-new) .binf-popover').done(
                            function (el) {
                              expect(el.length).toEqual(1);
                              expect($(".csui-pman-shortcut-new").length).toEqual(0);
                              expect($(".csui-shortcut-item").length).toEqual(4);
                              expect($(".csui-shortcut-item:nth-child(4) .csui-pman-widget-close").attr(
                                'title')).toEqual("Remove shortcut");
                              done();
                            });
                      });
                });
          });

      it("should show live data inside shortcut widget by configuring through callout and remain callout open ",
          function (done) {
            $('.pman-backdrop').trigger('click');
            TestUtils.asyncElement('.perspective-editing',
                '.csui-pman-editable-widget[data-csui-widget_type="shortcuts"] .binf-popover',
                true).done(
                function (el) {
                  expect(el.length).toEqual(0);
                  $(".csui-shortcut-item .csui-pman-widget-masking").eq(2).trigger('click');
                  TestUtils.asyncElement('.perspective-editing',
                      '.csui-pman-editable-widget[data-csui-widget_type="shortcuts"] .csui-shortcut-item .cs-pman-callout-ready .binf-popover').done(
                      function (el) {
                        expect($(".binf-popover").length).toEqual(1);
                        expect(
                            $(".csui-shortcut-item.csui-shortcut-theme-grey-shade1").length).toEqual(
                            1);
                        el.find(".binf-dropdown-toggle").eq(0).trigger('click');
                        el.find(".binf-dropdown-menu:visible li a").eq(3).trigger('click');
                        el.find(".cs-formfield input").eq(1).trigger("focus");
                        TestUtils.asyncElement('.perspective-editing',
                            '.csui-shortcut-item.csui-shortcut-theme-teal1-shade1').done(
                            function (el) {
                              expect(el.length).toEqual(1);
                              expect(
                                  $(".csui-shortcut-item.csui-shortcut-theme-grey-shade1").length).toEqual(
                                  0);
                              expect($(".csui-shortcut-item .binf-popover").length).toEqual(1);
                              $('.pman-backdrop').trigger('click');
                              done();
                            });
                      });
                });
          });
    });

    describe("Save perspective", function () {
      it("Save should fail on error", function () {
        context.trigger('save:perspective', {
          error: 'Failed'
        });
      });
      it("should disable save on click", function () {
        $('.pman-right-tools .icon-save').trigger('click');
        expect($('.pman-right-tools .icon-save[disabled]').length).toEqual(1);
      });
      it("should save and exit edit perspective", function (done) {
        TestUtils.asyncElement('html', '.perspective-editing', true).done(
            function (el) {
              expect(el.length).toEqual(0);
              done();
            });
      });
    });

    afterAll(function () {
      Mock.disable();
      $('body').empty();
    });
  })
});
