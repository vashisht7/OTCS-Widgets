/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/controls/form/form.view',
  '../../../../../../utils/testutils/async.test.utils.js',
  './showcolinform.mock.js'
], function ($, _, Backbone, Marionette,
  PageContext, FormView,
  TestUtil, MockData) {
    'use strict';

    var pageContext, resultsRegion, regionEl, formView;

    function FormOptions() {
      $.extend(this,{
        model: new Backbone.Model({
          data: {},
          schema: {
            properties: {}
          },
          options:{
            fields: {}
          }
        }),
        context: pageContext
      });

      $.extend(true,this.model.attributes,{
        data: {
          customColumnNameA: "{wnf_att_w81_2}" // Name
        },
        schema: {
          properties: {
            customColumnNameA: {
              description: "Custom column displayed in this widget",
              title: "Custom column A",
              type: "string"
            }
          }
        },
        options: {
          fields: {
            customColumnNameA:{
              "type": "otconws_customcolumn"
            }
          }
        }
      });
      $.extend(true,this.model.attributes,{
        data: {
          customColumnNameB: "{wnf_att_w81_3}" // Country
        },
        schema: {
          properties: {
            customColumnNameB: {
              "readonly": true,
              "required": false,
              "title": "",
              "type": "string",
              "hidden": false
            }
          }
        },
        options: {
          fields: {
            customColumnNameB:{
              "label": "Custom column B",
              "hidden": false,
              "readonly": true,
              "hideInitValidationError": false,
              "type": "otconws_customcolumn"
            }
          }
        }
      });
      $.extend(true,this.model.attributes,{
        data: {
          customColumnNameC: ""
        },
        schema: {
          properties: {
            customColumnNameC: {
              "required": false,
              "title": "",
              "type": "string",
              "hidden": false
            }
          }
        },
        options: {
          fields: {
            customColumnNameC:{
              "label": "Custom column C",
              "hidden": false,
              "hideInitValidationError": false,
              "type": "otconws_customcolumn"
            }
          }
        }
      });

    }

    function testsetup(done,formOptions) {

      pageContext = undefined;
      resultsRegion = undefined;
      regionEl = undefined;
      formView = undefined;

      $('body').empty();
      regionEl = $('<div style="width:550px; height:200px;"></div>').appendTo(document.body);
      resultsRegion = new Marionette.Region({
        el: regionEl
      });

      pageContext = new PageContext({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          },
          node: {
            attributes: {
              id: 2513449,
              type: 848
            }
          }
        }
      });

      $.extend(formOptions,{
        context: pageContext
      });

      formView = new FormView(formOptions);
      formView.once("render:form",done);
      resultsRegion.show(formView);

    }

    function teardown(done) {
      resultsRegion.destroy();
      regionEl.remove();
      $('body').empty();
      done();
    }
    function waitForElementReady(elem,msg) {
      var error = new Error();
      var deferred = $.Deferred();
      var el, rectold, rectnew;
      var created,  visible, ready;
      TestUtil.waitFor(function(){
        el = $(elem);
        created = !!el[0];
        if (created) {
          visible = TestUtil.isElementVisible(el[0]);
          if (visible) {
            rectold = rectnew;
            rectnew = JSON.stringify(el[0].getBoundingClientRect());
            ready = rectnew===rectold;
            if (ready) {
              return true;
            }
          }
        }
        return false;
      }).then(function(){
        deferred.resolve(el);
      },function(){
        error.message = _.str.sformat("{0} (created:{1}, visible:{2}, ready:{3})",msg||elem,created,visible,ready);
        deferred.reject(error);
      });
      return deferred.promise();
    }

    describe('AlpCustomColumnField ShowInFormTest', function () {

      var sel, el, text;

      beforeAll(function (done) {

        $.mockjax.clear(); // to be sure, no mock data relict from previous test spec can affect our tests 
        MockData.enable();

        done();
      });

      afterAll(function (done) {

        MockData.disable();

        done();
      });

      describe('ShowInCreateMode', function () {

        beforeAll(function (done) {
          var formOptions = new FormOptions();
          $.extend(formOptions,{
            mode: "create"
          });
          testsetup(done,formOptions);
        });

        afterAll(function (done) {
          teardown(done);
        });

        it('displays path in editable field A', function (done) {
          TestUtil.waitFor(function(){
            text = $("[data-alpaca-container-item-name=customColumnNameA] .cs-field-write input").prop("value");
            return text==="Facets > Contract Columns > Name";
          },"item path to appear").then(function(){
            el = $("[data-alpaca-container-item-name=customColumnNameA] .cs-field-write input");
            expect(TestUtil.isElementVisible(el[0])).toEqual(true,"input field visibility");
            el = $("[data-alpaca-container-item-name=customColumnNameA] .cs-field-read a");
            expect(TestUtil.isElementVisible(el[0])).toEqual(false,"readonly path visibility");
            done();
          },done.fail);
        });

        it('displays path in readonly field B', function (done) {
          TestUtil.waitFor(function(){
            text = $("[data-alpaca-container-item-name=customColumnNameB] .cs-field-read a").text().trim();
            return text==="Facets > Contract Columns > Country";
          },"item path to appear").then(function(){
            el = $("[data-alpaca-container-item-name=customColumnNameB] .cs-field-write input");
            expect(TestUtil.isElementVisible(el[0])).toEqual(false,"input field visibility");
            el = $("[data-alpaca-container-item-name=customColumnNameB] .cs-field-read a");
            expect(TestUtil.isElementVisible(el[0])).toEqual(true,"readonly path visibility");
            done();
          },done.fail);
        });

        it('displays placeholder in empty field C', function (done) {
          TestUtil.waitFor(function(){
            el = $("[data-alpaca-container-item-name=customColumnNameC] .cs-field-write input");
            text = el.prop("value");
            return el.length>0 && text==="";
          },"item path to appear").then(function(){
            el = $("[data-alpaca-container-item-name=customColumnNameC] .cs-field-write input");
            expect(TestUtil.isElementVisible(el[0])).toEqual(true,"input field visibility");
            el = $("[data-alpaca-container-item-name=customColumnNameC] .cs-field-read a");
            expect(TestUtil.isElementVisible(el[0])).toEqual(false,"readonly path visibility");
            text = $("[data-alpaca-container-item-name=customColumnNameC] .cs-field-write input").attr("placeholder");
            expect(text).toEqual("Select custom column","placeholder text");
            done();
          },done.fail);
        });

        describe('Node picker for editable field A', function() {

          var picker;

          it('opens after click in field', function(done){
            el = $("[data-alpaca-container-item-name=customColumnNameA] .cs-field-write input");
            el.trigger("mousedown");
            sel = ".binf-modal-dialog .binf-modal-header .csui-title:contains('Select Custom column A')";
            waitForElementReady(sel,"node picker title").then(function(el){
              expect(el.length).toEqual(1,"one picker dialog only");
              picker = el.parents(".binf-modal-dialog").last();
              done();
            },done.fail);
          });

          it('has no header search bar', function(done){
            el = $(".binf-modal-header .csui-search-box",picker);
            expect(el.length).toEqual(0,"no header search bar");
            done();
          });

          it('starts at custom column parent', function(done){
            el = $(".binf-modal-header .csui-start-locations .binf-dropdown-toggle .cs-label",picker);
            text = el.text();
            expect(text).toEqual("Current location","correct locations toggle");
            el = $(".binf-modal-body .cs-breadcrumb .binf-breadcrumb",picker);
            text = el.text().trim().replace(/\n/g," > ").replace(/\s+/g," ");
            expect(text).toEqual("Facets > Contract Columns","correct breadcrumb");
            el = $(".binf-modal-body .csui-select-lists .csui-np-header .folder-name",picker);
            text = el.text();
            expect(text).toEqual("Contract Columns","correct folder");
            done();
          });

          it('has current location and facets volume in start locations menu', function(done){
            el = $(".binf-modal-header .csui-start-locations .binf-dropdown-menu",picker);
            text = el.text().trim().replace(/\s*\n\s*/g,"|");
            expect(text).toEqual("Current location|Facets","correct locations menu");
            done();
          });

          it('shows correct columns', function(done){
            el = $(".binf-modal-body .csui-select-lists .csui-np-content .csui-list-group-item .csui-list-item-title",picker);
            text = el.text().trim().replace(/\s*\n\s*/g,"|");
            expect(text).toEqual("Area|Country|ID|Name","correct list");
            done();
          });

          it('has disabled name column', function(done){
            el = $(".binf-modal-body .csui-select-lists .csui-np-content .cs-left-item-208963",picker);
            expect(el.hasClass("csui-disabled")).toEqual(true,"field is disabled");
            el = $(".binf-modal-body .csui-select-lists .csui-np-content .cs-left-item-208963 .csui-list-item-title",picker);
            text = el.text().trim();
            expect(text).toEqual("Name","correct title");
            done();
          });
  
          it('selects "Area" column', function(done){
            el = $(".binf-modal-body .csui-select-lists .csui-np-content .cs-left-item-209293",picker);
            expect(el.hasClass("select")).toEqual(false,"area column select state");
            $("[type='checkbox']",el).trigger("click");
            expect(el.hasClass("select")).toEqual(true,"area column select state");
            done();
          });
  
          it('closes after click on select button', function(done){
            el = $(".binf-modal-footer .csui-footer-buttons button.cs-add-button",picker);
            el.trigger("click");
            TestUtil.waitFor(function(){
              return TestUtil.isElementVisible(picker[0])===false;
            },"node picker to close").then(done,done.fail);
          });
  
          it('takes over the selected column', function(done){
            TestUtil.waitFor(function(){
              el = $("[data-alpaca-container-item-name=customColumnNameA] .cs-field-write input");
              text = el.prop("value");
              return text==="Facets > Contract Columns > Area";
            },"value to appear in field").then(done,done.fail);
          });
  
        });

        describe('Node picker for empty field C', function() {

          var picker;

          it('opens after click in field', function(done){
            el = $("[data-alpaca-container-item-name=customColumnNameC] .cs-field-write input");
            el.trigger("mousedown");
            sel = ".binf-modal-dialog .binf-modal-header .csui-title:contains('Select Custom column C')";
            waitForElementReady(sel,"node picker title").then(function(el){
              expect(el.length).toEqual(1,"one picker dialog only");
              picker = el.parents(".binf-modal-dialog").last();
              done();
            },done.fail);
          });

          it('has no header search bar', function(done){
            el = $(".binf-modal-header .csui-search-box",picker);
            expect(el.length).toEqual(0,"no header search bar");
            done();
          });

          it('starts in facets volume', function(done){
            el = $(".binf-modal-header .csui-start-locations .binf-dropdown-toggle .cs-label",picker);
            text = el.text();
            expect(text).toEqual("Facets","correct locations toggle");
            el = $(".binf-modal-body .cs-breadcrumb .binf-breadcrumb",picker);
            text = el.text().trim().replace(/\n/g," > ").replace(/\s+/g," ");
            expect(text).toEqual("Facets","correct breadcrumb");
            el = $(".binf-modal-body .csui-select-lists .csui-np-header .folder-name",picker);
            text = el.text();
            expect(text).toEqual("Facets","correct folder");
            done();
          });

          it('has only facets volume in start locations menu', function(done){
            el = $(".binf-modal-header .csui-start-locations .binf-dropdown-menu",picker);
            text = el.text().trim().replace(/\s*\n\s*/g,"|");
            expect(text).toEqual("Facets","correct locations menu");
            done();
          });

          it('closes after click on cancel button', function(done){
            el = $(".binf-modal-footer .csui-footer-buttons button:contains('Cancel')",picker);
            el.trigger("click");
            TestUtil.waitFor(function(){
              return TestUtil.isElementVisible(picker[0])===false;
            },"node picker to close").then(done,done.fail);
          });
  
        });

      });

      describe('ShowInUpdateMode', function () {

        beforeAll(function (done) {
          var formOptions = new FormOptions();
          $.extend(formOptions,{
            layoutMode: "singleCol",
            mode: "update"
          });
          testsetup(done,formOptions);
        });

        afterAll(function (done) {
          teardown(done);
        });

        it('displays path in editable field A', function (done) {
          TestUtil.waitFor(function(){
            text = $("[data-alpaca-container-item-name=customColumnNameA] .cs-field-read a").text().trim();
            return text==="Facets > Contract Columns > Name";
          },"item path to appear").then(function(){
            el = $("[data-alpaca-container-item-name=customColumnNameA] .cs-field-write input");
            expect(TestUtil.isElementVisible(el[0])).toEqual(false,"input field visibility");
            el = $("[data-alpaca-container-item-name=customColumnNameA] .cs-field-read a");
            expect(TestUtil.isElementVisible(el[0])).toEqual(true,"readonly path visibility");
            done();
          },done.fail);
        });

        it('displays path in readonly field B', function (done) {
          TestUtil.waitFor(function(){
            text = $("[data-alpaca-container-item-name=customColumnNameB] .cs-field-read a").text().trim();
            return text==="Facets > Contract Columns > Country";
          },"item path to appear").then(function(){
            el = $("[data-alpaca-container-item-name=customColumnNameB] .cs-field-write input");
            expect(TestUtil.isElementVisible(el[0])).toEqual(false,"input field visibility");
            el = $("[data-alpaca-container-item-name=customColumnNameB] .cs-field-read a");
            expect(TestUtil.isElementVisible(el[0])).toEqual(true,"readonly path visibility");
            done();
          },done.fail);
        });

        it('displays placeholder in empty field C', function (done) {
          TestUtil.waitFor(function(){
            text = $("[data-alpaca-container-item-name=customColumnNameC] .cs-field-read a").text().trim();
            return text==="Select custom column";
          },"item path to appear").then(function(){
            el = $("[data-alpaca-container-item-name=customColumnNameC] .cs-field-write input");
            expect(TestUtil.isElementVisible(el[0])).toEqual(false,"input field visibility");
            el = $("[data-alpaca-container-item-name=customColumnNameC] .cs-field-read a");
            expect(TestUtil.isElementVisible(el[0])).toEqual(true,"readonly path visibility");
            done();
          },done.fail);
        });

        it('displays edit pen when mouse hovers over field A', function (done) {
          el = $("[data-alpaca-container-item-name=customColumnNameA] .csui-icon-edit.icon-edit");
          expect(TestUtil.isElementVisible(el[0])).toEqual(false,"edit pen visibility");
          $("[data-alpaca-container-item-name=customColumnNameA] .cs-field-read").trigger("mouseover");
          TestUtil.waitFor(function(){
            var visible = TestUtil.isElementVisible(el[0]);
            return visible;
          },"edit pen icon becomes visible").then(done,done.fail);
        });

        it('enters input mode when clicking on edit pen of field A', function (done) {
          el = $("[data-alpaca-container-item-name=customColumnNameA] .cs-field-write input");
          expect(TestUtil.isElementVisible(el[0])).toEqual(false,"input field visibility");
          el = $("[data-alpaca-container-item-name=customColumnNameA] .cs-field-read a");
          expect(TestUtil.isElementVisible(el[0])).toEqual(true,"readonly name visibility");
          $("[data-alpaca-container-item-name=customColumnNameA] .cs-formfield.cs-nodepicker").trigger("mousedown");
          $("[data-alpaca-container-item-name=customColumnNameA] .csui-icon-edit.icon-edit").trigger("click");
          $("[data-alpaca-container-item-name=customColumnNameA] .cs-field-write input").trigger("focusin");
          $("[data-alpaca-container-item-name=customColumnNameA] .csui-icon-edit.icon-edit").trigger("mouseleave");
          el = $("[data-alpaca-container-item-name=customColumnNameA] .csui-icon-edit.icon-edit");
          expect(TestUtil.isElementVisible(el[0])).toEqual(false,"edit pen visibility");
          el = $("[data-alpaca-container-item-name=customColumnNameA] .csui-icon-edit.edit-cancel");
          expect(TestUtil.isElementVisible(el[0])).toEqual(true,"cancel pen visibility");
          el = $("[data-alpaca-container-item-name=customColumnNameA] .cs-field-write input");
          expect(TestUtil.isElementVisible(el[0])).toEqual(true,"input field visibility");
          el = $("[data-alpaca-container-item-name=customColumnNameA] .cs-field-read a");
          expect(TestUtil.isElementVisible(el[0])).toEqual(false,"readonly name visibility");
          done();
        });

        describe('Node picker for editable field A', function() {

          var picker;

          it('opens after click in field', function(done){
            $("[data-alpaca-container-item-name=customColumnNameA] .cs-field-write input").trigger("mousedown");
            $("[data-alpaca-container-item-name=customColumnNameA] .cs-field-write input").trigger("focusout");
            sel = ".binf-modal-dialog .binf-modal-header .csui-title:contains('Select Custom column A')";
            waitForElementReady(sel,"node picker title").then(function(el){
              expect(el.length).toEqual(1,"one picker dialog only");
              picker = el.parents(".binf-modal-dialog").last();
              done();
            },done.fail);
          });

          it('starts at custom column parent', function(done){
            el = $(".binf-modal-header .csui-start-locations .binf-dropdown-toggle .cs-label",picker);
            text = el.text();
            expect(text).toEqual("Current location","correct locations toggle");
            el = $(".binf-modal-body .cs-breadcrumb .binf-breadcrumb",picker);
            text = el.text().trim().replace(/\n/g," > ").replace(/\s+/g," ");
            expect(text).toEqual("Facets > Contract Columns","correct breadcrumb");
            done();
          });

          it('has current location and facets volume in start locations menu', function(done){
            el = $(".binf-modal-header .csui-start-locations .binf-dropdown-menu",picker);
            text = el.text().trim().replace(/\s*\n\s*/g,"|");
            expect(text).toEqual("Current location|Facets","correct locations menu");
            done();
          });

          it('shows correct columns', function(done){
            el = $(".binf-modal-body .csui-select-lists .csui-np-content .csui-list-group-item .csui-list-item-title",picker);
            text = el.text().trim().replace(/\s*\n\s*/g,"|");
            expect(text).toEqual("Area|Country|ID|Name","correct list");
            done();
          });

          it('has disabled name column', function(done){
            el = $(".binf-modal-body .csui-select-lists .csui-np-content .cs-left-item-208963",picker);
            expect(el.hasClass("csui-disabled")).toEqual(true,"field is disabled");
            el = $(".binf-modal-body .csui-select-lists .csui-np-content .cs-left-item-208963 .csui-list-item-title",picker);
            text = el.text().trim();
            expect(text).toEqual("Name","correct title");
            done();
          });
  
          it('selects "Area" column', function(done){
            el = $(".binf-modal-body .csui-select-lists .csui-np-content .cs-left-item-209293",picker);
            expect(el.hasClass("select")).toEqual(false,"area column select state");
            $("[type='checkbox']",el).trigger("click");
            expect(el.hasClass("select")).toEqual(true,"area column select state");
            done();
          });
  
          it('closes after click on select button', function(done){
            $(".binf-modal-footer .csui-footer-buttons button.cs-add-button",picker).trigger("click");
            TestUtil.waitFor(function(){
              return TestUtil.isElementVisible(picker[0])===false;
            },"node picker to close").then(done,done.fail);
          });
  
          it('takes over the selected column', function(done){
            TestUtil.waitFor(function(){
              el = $("[data-alpaca-container-item-name=customColumnNameA] .cs-field-write input");
              text = el.prop("value");
              return text==="Facets > Contract Columns > Area";
            },"value to appear in field").then(done,done.fail);
          });
  
        });
      });

    });

  });
