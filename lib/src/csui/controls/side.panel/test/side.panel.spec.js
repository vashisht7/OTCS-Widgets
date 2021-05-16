/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/backbone", "csui/controls/side.panel/side.panel.view",
  "../../../utils/testutils/async.test.utils.js"
], function (Backbone, SidePanelView, TestUtils) {

  describe("SidePanel Control", function () {

    beforeAll(function () {

    });

    afterAll(function () {
      TestUtils.cancelAllAsync();
      TestUtils.restoreEnvironment();
    });

    describe("Initialization check", function () {
      it("Simple usage: intialize with a content", function (done) {
        var content = new Backbone.View();
        var sidePanel = new SidePanelView({
          title: 'Title',
          subTitle: 'SubTitle here',
          content: content,
          buttons: [{
            id: 'btn1',
            disabled: true
          },
            {
              id: 'btn2',
              hidden: true
            }
          ]
        });
        sidePanel.show(function () {
          var cancelBtn = sidePanel.$el.find('.csui-sidepanel-footer #csui-side-panel-cancel');
          expect(cancelBtn.length).toEqual(1);
          cancelBtn.trigger('click');
          TestUtils.asyncElement('body', '.csui-sidepanel', true).done(function () {
            done();
          });
        });
      });
      it("Wizard style initiazation", function (done) {
        var sidePanel = new SidePanelView({
          slides: [{
            title: 'Title',
            content: new Backbone.View(),
            buttons: [{
              id: 'btn1',
              disabled: true
            },
              {
                id: 'btn2',
                hidden: true
              }
            ]
          }]
        });
        sidePanel.show(function () {
          sidePanel.destroy();
          done();
        });
      });

      it("with no backdrop; backdrop: false", function (done) {
        var sidePanel = new SidePanelView({
          title: 'Title',
          content: new Backbone.View(),
          backdrop: false
        });
        sidePanel.show(function () {
          var backdropEl = sidePanel.$el.find('.csui-sidepanel-backdrop');
          expect(backdropEl.length).toEqual(0);
          sidePanel.destroy();
          done();
        });
      });

      it("with backdrop; backdrop: true; close on backdrop click", function (done) {
        var sidePanel = new SidePanelView({
          title: 'Title',
          content: new Backbone.View(),
          backdrop: true
        });
        sidePanel.show(function () {
          var backdropEl = sidePanel.$el.find('.csui-sidepanel-backdrop');
          expect(backdropEl.length).toEqual(1);
          backdropEl.trigger('click');
          TestUtils.asyncElement('body', '.csui-sidepanel', true).done(function () {
            done();
          });
        });
      });

      it("with static backdrop; backdrop: 'static'; modal", function (done) {
        var sidePanel = new SidePanelView({
          title: 'Title',
          content: new Backbone.View(),
          backdrop: 'static' // DEFAULT
        });
        sidePanel.show(function () {
          var backdropEl = sidePanel.$el.find('.csui-sidepanel-backdrop');
          expect(backdropEl.length).toEqual(1);
          backdropEl.trigger('click');
          TestUtils.asyncElement('body', '.csui-sidepanel').done(function () {
            sidePanel.destroy();
            done();
          });
        });
      });

    });
    describe("", function () {
      var sidePanel, content;
      beforeAll(function (done) {
        content = new Backbone.View();
        sidePanel = new SidePanelView({
          sidePanelClassName: 'customized-cls',
          slides: [{
            title: 'Step1',
            containerClass: 'step1',
            content: content,
            buttons: [{
              id: 'btn1',
              disabled: true,
              label: "Button1"
            }, {
              id: 'btn2',
              label: "Button2",
              close: true
            }]
          }, {
            title: 'Step2',
            containerClass: 'step2',
            content: content,
            buttons: [{
              id: 'btn3',
              label: "Button3",
              hidden: true
            }, {
              id: 'btn4',
              label: "Button4"
            }]
          }]
        });
        sidePanel.show(done);
      });

      afterAll(function (done) {
        sidePanel.hide(done);
      });

      it("Check if step1 is displayed", function () {
        var container = sidePanel.$el.find('.csui-sidepanel-container');
        expect(container.hasClass('step1')).toBeTruthy();
      });

      it("Enable footer buttons", function () {
        var disabledBtn = sidePanel.$el.find('.csui-sidepanel-footer #btn1');
        expect(disabledBtn.hasClass('binf-disabled')).toBeTruthy();
        expect(disabledBtn.is(":disabled")).toBeTruthy();
        sidePanel.updateButton("btn1", {
          disabled: false
        });
        expect(disabledBtn.hasClass('binf-disabled')).toBeFalsy();
        expect(disabledBtn.is(":disabled")).toBeFalsy();
      });

      it("Move forward to next step in wizard", function () {
        sidePanel.trigger("click:next");
        var container = sidePanel.$el.find('.csui-sidepanel-container');
        expect(container.hasClass('step2')).toBeTruthy();
        sidePanel.updateButton("btn3", {
          hidden: false
        });
      });

      it("Move backward to previous step in wizard", function () {
        sidePanel.trigger("click:previous");
        var container = sidePanel.$el.find('.csui-sidepanel-container');
        expect(container.hasClass('step1')).toBeTruthy();
      });

      it("Close using custom button", function (done) {
        var customClose = sidePanel.$el.find('.csui-sidepanel-footer #btn2');
        expect(customClose.length).toEqual(1);
        customClose.trigger('click');
        TestUtils.asyncElement('body', '.csui-sidepanel', true).done(function () {
          done();
        });
      });
    });
  });
});