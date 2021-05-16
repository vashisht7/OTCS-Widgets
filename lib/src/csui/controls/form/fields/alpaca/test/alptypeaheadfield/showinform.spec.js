/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/controls/form/form.view',
  '../../../../../../utils/testutils/async.test.utils.js',
  './showinform.mock.js'
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
          workspaceTypeIdA: 1
        },
        schema: {
          properties: {
            workspaceTypeIdA: {
              description: "Workspace type displayed in this widget",
              title: "Workspace type A",
              type: "integer"
            }
          }
        },
        options: {
          fields: {
            workspaceTypeIdA:{
              "type": "otconws_workspacetype_id"
            }
          }
        }
      });
      $.extend(true,this.model.attributes,{
        data: {
          workspaceTypeIdB: 6
        },
        schema: {
          properties: {
            workspaceTypeIdB: {
              "readonly": true,
              "required": false,
              "title": "",
              "type": "integer",
              "hidden": false
            }
          }
        },
        options: {
          fields: {
            workspaceTypeIdB:{
              "label": "Workspace Type B",
              "hidden": false,
              "readonly": true,
              "hideInitValidationError": false,
              "type": "otconws_workspacetype_id"
            }
          }
        }
      });
      $.extend(true,this.model.attributes,{
        data: {
          workspaceTypeIdC: 5
        },
        schema: {
          properties: {
            workspaceTypeIdC: {
              "readonly": true,
              "required": false,
              "title": "",
              "type": "integer",
              "hidden": false
            }
          }
        },
        options: {
          fields: {
            workspaceTypeIdC:{
              "label": "Workspace Type C",
              "hidden": false,
              "readonly": true,
              "hideInitValidationError": false,
              "type": "otconws_workspacetype_id"
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
      regionEl = $('<div style="width:500px; height:200px;"></div>').appendTo(document.body);
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

    describe('AlpWorkspaceTypeField ShowInFormTest', function () {

      var el;

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

        it('displays name in editable field A', function (done) {
          TestUtil.waitFor(function(){
            var name = $("[data-alpaca-container-item-name=workspaceTypeIdA] input").prop("value");
            return name==="Contract";
          },"item name to appear").then(function(){
            el = $("[data-alpaca-container-item-name=workspaceTypeIdA] input");
            expect(TestUtil.isElementVisible(el[0])).toEqual(true,"input field visibility");
            el = $("[data-alpaca-container-item-name=workspaceTypeIdA] .cs-name .csui-typeahead-container");
            expect(TestUtil.isElementVisible(el[0])).toEqual(false,"readonly name visibility");
            done();
          },done.fail);
        });

        it('displays no icon or image in editable field A', function (done) {
          el = $("[data-alpaca-container-item-name=workspaceTypeIdA] .cs-field-picture.csui-custom-image");
          expect(TestUtil.isElementVisible(el[0])).toEqual(false,"custom image visibility");
          el = $("[data-alpaca-container-item-name=workspaceTypeIdA] .cs-field-picture.csui-default-icon");
          expect(TestUtil.isElementVisible(el[0])).toEqual(false,"default icon visibility");
          done();
        });

        it('displays name in readonly field B', function (done) {
          TestUtil.waitFor(function(){
            var name = $("[data-alpaca-container-item-name=workspaceTypeIdB] .cs-name .csui-typeahead-container").text().trim();
            return name==="Contact Wksp Type";
          },"item name to appear").then(function(){
            el = $("[data-alpaca-container-item-name=workspaceTypeIdB] input");
            expect(TestUtil.isElementVisible(el[0])).toEqual(false,"input field visibility");
            el = $("[data-alpaca-container-item-name=workspaceTypeIdB] .cs-name .csui-typeahead-container");
            expect(TestUtil.isElementVisible(el[0])).toEqual(true,"readonly name visibility");
            done();
          },done.fail);
        });

        it('displays custom image in readonly field B', function (done) {
          el = $("[data-alpaca-container-item-name=workspaceTypeIdB] .cs-field-picture.csui-default-icon");
          expect(TestUtil.isElementVisible(el[0])).toEqual(false,"default icon visibility");
          el = $("[data-alpaca-container-item-name=workspaceTypeIdB] .cs-field-picture.csui-custom-image");
          expect(TestUtil.isElementVisible(el[0])).toEqual(true,"custom image visibility");
          var imgurl = el.attr("src");
          expect(imgurl).toContain("data:image/svg+xml;base64,");
          $("<img/>").on('load',function(){done();}).on('error',function(){done.fail("custom image not loaded");}).attr("src",imgurl);
        });

        it('displays workspace icon in readonly field C', function (done) {
          el = $("[data-alpaca-container-item-name=workspaceTypeIdC] .cs-field-picture.csui-custom-image");
          expect(TestUtil.isElementVisible(el[0])).toEqual(false,"custom image visibility");
          el = $("[data-alpaca-container-item-name=workspaceTypeIdC] .cs-field-picture.csui-default-icon");
          expect(TestUtil.isElementVisible(el[0])).toEqual(true,"default icon visibility");
          expect(el.hasClass("conws-mime_workspace")).toEqual(true,"element shows workspace icon");
          var imgurl = el.css("background-image").replace(/^\s*url\s*\(\s*['"]\s*/,'').replace(/\s*['"]\s*\)\s*$/,'');
          expect(imgurl).toContain("mime_workspace.svg");
          $("<img/>").on('load',function(){done();}).on('error',function(){done.fail("default icon not loaded");}).attr("src",imgurl);
        });

        it('drops down typeahead list in editable field A', function (done) {
          el = $("[data-alpaca-container-item-name=workspaceTypeIdA] input");
          el.prop("value","c");
          el.trigger("keydown");
          el.trigger("keypress");
          el.trigger("keyup");
          TestUtil.waitFor(function(){
            var visible = TestUtil.isElementVisible($("[data-alpaca-container-item-name=workspaceTypeIdA] .typeahead.binf-dropdown-menu")[0]);
            return visible;
          },"drop down to open").then(function(){
            el = $("[data-alpaca-container-item-name=workspaceTypeIdA] .typeahead.binf-dropdown-menu .csui-typeaheadpicker-item");
            expect(el.length).toEqual(6,"drop down length");
            expect(el.text().trim().replace(/\s*\n\s*/g,"|")).toEqual("Car Workspace Type|Company Workspace Type|Contact Wksp Type|Contract|Person Workspace Type|Service Notification Wksp Type");
            done();
          },done.fail);
        });

        it('shows drop down item 1 with default icon', function (done) {
          el = $("[data-alpaca-container-item-name=workspaceTypeIdA] .typeahead.binf-dropdown-menu .csui-typeaheadpicker-item")[1];
          expect($(el).text().trim()).toEqual("Company Workspace Type");
          if (el) {
            expect(TestUtil.isElementVisible($(".csui-custom-image",el)[0])).toEqual(false,"custom image visibility");
            expect(TestUtil.isElementVisible($(".csui-default-icon",el)[0])).toEqual(true,"default icon visibility");
            var imgurl = $(".csui-default-icon",el).css("background-image").replace(/^\s*url\s*\(\s*['"]\s*/,'').replace(/\s*['"]\s*\)\s*$/,'');
            expect(imgurl).toContain("mime_workspace.svg");
            $("<img/>").on('load',function(){done();}).on('error',function(){done.fail("default icon not loaded");}).attr("src",imgurl);
          } else {
            done();
          }
        });

        it('shows drop down item 3 with custom image', function (done) {
          el = $("[data-alpaca-container-item-name=workspaceTypeIdA] .typeahead.binf-dropdown-menu .csui-typeaheadpicker-item")[3];
          expect($(el).text().trim()).toEqual("Contract");
          if (el) {
            expect(TestUtil.isElementVisible($(".csui-custom-image",el)[0])).toEqual(true,"custom image visibility");
            expect(TestUtil.isElementVisible($(".csui-default-icon",el)[0])).toEqual(false,"default icon visibility");
            var imgurl = $(".csui-custom-image",el).attr("src");
            expect(imgurl).toContain("data:image/svg+xml;base64,");
            $("<img/>").on('load',function(){done();}).on('error',function(){done.fail("custom image not loaded");}).attr("src",imgurl);
          }
          done();
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

        it('displays name in editable field A', function (done) {
          TestUtil.waitFor(function(){
            var name = $("[data-alpaca-container-item-name=workspaceTypeIdA] input").prop("value");
            return name==="Contract";
          },"item name to appear").then(function(){
            el = $("[data-alpaca-container-item-name=workspaceTypeIdA] input");
            expect(TestUtil.isElementVisible(el[0])).toEqual(false,"input field visibility");
            el = $("[data-alpaca-container-item-name=workspaceTypeIdA] .cs-name .csui-typeahead-container");
            expect(TestUtil.isElementVisible(el[0])).toEqual(true,"readonly name visibility");
            done();
          },done.fail);
        });

        it('displays custom image in editable field A', function (done) {
          el = $("[data-alpaca-container-item-name=workspaceTypeIdA] .cs-field-picture.csui-default-icon");
          expect(TestUtil.isElementVisible(el[0])).toEqual(false,"default icon visibility");
          el = $("[data-alpaca-container-item-name=workspaceTypeIdA] .cs-field-picture.csui-custom-image");
          expect(TestUtil.isElementVisible(el[0])).toEqual(true,"custom image visibility");
          done();
        });

        it('displays name in readonly field B', function (done) {
          TestUtil.waitFor(function(){
            var name = $("[data-alpaca-container-item-name=workspaceTypeIdB] .cs-name .csui-typeahead-container").text().trim();
            return name==="Contact Wksp Type";
          },"item name to appear").then(function(){
            el = $("[data-alpaca-container-item-name=workspaceTypeIdB] input");
            expect(TestUtil.isElementVisible(el[0])).toEqual(false,"input field visibility");
            el = $("[data-alpaca-container-item-name=workspaceTypeIdB] .cs-name .csui-typeahead-container");
            expect(TestUtil.isElementVisible(el[0])).toEqual(true,"readonly name visibility");
            done();
          },done.fail);
        });

        it('displays custom image in readonly field B', function (done) {
          el = $("[data-alpaca-container-item-name=workspaceTypeIdB] .cs-field-picture.csui-default-icon");
          expect(TestUtil.isElementVisible(el[0])).toEqual(false,"default icon visibility");
          el = $("[data-alpaca-container-item-name=workspaceTypeIdB] .cs-field-picture.csui-custom-image");
          expect(TestUtil.isElementVisible(el[0])).toEqual(true,"custom image visibility");
          done();
        });

        it('displays workspace icon in readonly field C', function (done) {
          el = $("[data-alpaca-container-item-name=workspaceTypeIdC] .cs-field-picture.csui-custom-image");
          expect(TestUtil.isElementVisible(el[0])).toEqual(false,"custom image visibility");
          el = $("[data-alpaca-container-item-name=workspaceTypeIdC] .cs-field-picture.csui-default-icon");
          expect(TestUtil.isElementVisible(el[0])).toEqual(true,"default icon visibility");
          expect(el.hasClass("conws-mime_workspace")).toEqual(true,"element shows workspace icon");
          done();
        });

        it('displays pen, when mouse hovers over input field A', function (done) {
          el = $("[data-alpaca-container-item-name=workspaceTypeIdA] .cs-field-read");
          var pen = $("[data-alpaca-container-item-name=workspaceTypeIdA] .csui-icon-edit.icon-edit");
          expect(TestUtil.isElementVisible(pen[0])).toEqual(false,"pen icon visibility");
          el.trigger("mouseover");
          TestUtil.waitFor(function(){
            var visible = TestUtil.isElementVisible(pen[0]);
            return visible;
          },"pen icon becomes visible").then(done,done.fail);
        });

        it('enters input mode, when clicking on pen of editable field A', function (done) {
          el = $("[data-alpaca-container-item-name=workspaceTypeIdA] input");
          expect(TestUtil.isElementVisible(el[0])).toEqual(false,"input field visibility");
          el = $("[data-alpaca-container-item-name=workspaceTypeIdA] .cs-name .csui-typeahead-container");
          expect(TestUtil.isElementVisible(el[0])).toEqual(true,"readonly name visibility");
          var pen = $("[data-alpaca-container-item-name=workspaceTypeIdA] .csui-icon-edit.icon-edit");
          pen.trigger("click");
          el = $("[data-alpaca-container-item-name=workspaceTypeIdA] input");
          expect(TestUtil.isElementVisible(el[0])).toEqual(true,"input field visibility");
          el = $("[data-alpaca-container-item-name=workspaceTypeIdA] .cs-name .csui-typeahead-container");
          expect(TestUtil.isElementVisible(el[0])).toEqual(false,"readonly name visibility");
          done();
      });

        it('drops down typeahead list in editable field A', function (done) {
          el = $("[data-alpaca-container-item-name=workspaceTypeIdA] input");
          el.prop("value","r");
          el.trigger("keydown");
          el.trigger("keypress");
          el.trigger("keyup");
          TestUtil.waitFor(function(){
            var visible = TestUtil.isElementVisible($("[data-alpaca-container-item-name=workspaceTypeIdA] .typeahead.binf-dropdown-menu")[0]);
            return visible;
          },"drop down to open").then(function(){
            el = $("[data-alpaca-container-item-name=workspaceTypeIdA] .typeahead.binf-dropdown-menu .csui-typeaheadpicker-item");
            expect(el.length).toEqual(5,"drop down length");
            expect(el.text().trim().replace(/\s*\n\s*/g,"|")).toEqual("Car Workspace Type|Company Workspace Type|Contract|Person Workspace Type|Service Notification Wksp Type");
            done();
          },done.fail);
        });


      });

    });

  });
