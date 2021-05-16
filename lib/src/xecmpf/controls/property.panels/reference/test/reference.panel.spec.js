/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/utils/log',
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/utils/testutils/async.test.utils',
  "csui/widgets/nodestable/nodestable.view",
  'xecmpf/controls/property.panels/reference/test/reference.panel.utils',
  'xecmpf/controls/property.panels/reference/test/reference.panel.mock',
  'csui/lib/require.config!csui/csui-extensions.json' // must require this for "otcs_user" field
], function ($, _, log,
    Marionette,
    PageContext,
    CSUITestUtils,
    NodesTableView,
    TestUtils,
    DataManager) {

  describe('Reference panel edit tests', function () {
	  
    var originalTimeout;

    function initTestInfo(testInfo,folderid) {
      testInfo.context = new PageContext({
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
            attributes: {id: folderid}
          }
        }
      });
    }

    beforeEach(function () {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });
    afterEach(function () {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    describe('Setting "Material" with "Navigation CPU"', function () {

      var testInfo = {}, folderid = 511690;

      it("initializes", function (done) {
        initTestInfo(testInfo,folderid);
        $("body").append('<div id="reference-panel-search-root" class="cs-perspective-panel"><div class="binf-container binf-container-fluid grid-rows"><div class="binf-row"><div class="binf-col-md-12 row-xs-full" id="reference-panel-search-content"></div></div></div></div>');
        DataManager.testMaterialSearch1_Common.enable();
        DataManager.testMaterialSearch1_Init.enable();
        done();
      });

      it("shows nodes table view", function (done) {
        var options = {
          context: testInfo.context,
          data: {
            pageSize: 20
          }
        };
        testInfo.nodesTableView = new NodesTableView(options);

        testInfo.contentRegion = new Marionette.Region({ el: "#reference-panel-search-content" });
        testInfo.contentRegion.show(testInfo.nodesTableView);
        done();
      });

      it("fetches the context", function (done) {
        testInfo.context.fetch().then(function() {
          done();
        })
      });

      it("opens the property panel", function () {
        TestUtils.openProperties(testInfo.nodesTableView,"Material");
      });

      it("attributes panel appears", function (done) {
        TestUtils.waitFor (function(){
          testInfo.attributesPanel = $('[role="tabpanel"] [title="Material Attributes"]').parent();
          return (testInfo.attributesPanel.length>0);
        },"attributes panel to appear",15000,done);
      });

      it("reference panel appears", function (done) {
        TestUtils.waitFor (function(){
          testInfo.referencePanel = $(".conws-reference.reference-panel");
          return (testInfo.referencePanel.length>0);
        },"reference panel to appear",3000,done);
      });

      it("search button can be clicked", function (done) {
        var ok = false;
        if (testInfo.referencePanel) {
          ok = TestUtils.waitFor (function(){
            testInfo.searchButton = testInfo.referencePanel.find(".reference-initial button.search");
            if (testInfo.searchButton.length>0) {
              testInfo.searchButton.trigger("click");
              return true;
            }
            return false;
          },"search button to appear",3000,done);
        }
        ok || fail();
        (ok===true||ok===false) && done();
      });


      it("search form is opened", function (done) {
        TestUtils.waitFor(function(){
          testInfo.boSearch = $(".conws-bosearch");
          return (testInfo.boSearch.length>0);
        }, "bo search to be opened after click on replace button", 3000, done);
      });

      it("search form is complete", function (done) {
        var ok = false;
        var fieldname = "ATTYP";
        if (testInfo.boSearch) {
          ok = TestUtils.waitFor(function () {
            testInfo.boSearchFieldsForm = $(testInfo.boSearch).find(".conws-bosearchform .conws-bosearchform-body .cs-form.cs-form-create");
            if (testInfo.boSearchFieldsForm.length<=0) {
              return false;
            }

            testInfo.boSearchField = $(testInfo.boSearchFieldsForm).find("[data-alpaca-container-item-name='"+fieldname+"']");
            if (testInfo.boSearchField.length<=0) {
              return false;
            }
            return true;
          }, "search fields to be filled", 3000, done);
        }
        ok || fail();
        (ok===true||ok===false) && done();
      });

      it("search for materials", function(done) {
        var ok = false;
        if (testInfo.boSearch) {
          testInfo.boSearchSearchButton = $(testInfo.boSearch).find(".conws-bosearchform .conws-bosearchform-footer .binf-btn.search");
          if (testInfo.boSearchSearchButton.length>0) {
            testInfo.boSearchSearchButton.trigger("click");
            ok = true;
          }
        }
        ok || fail();
        (ok===true||ok===false) && done();
      });

      it("search result 'NAVIGATION CPU' appears", function (done) {
        var ok = false;
        var title = "NAVIGATION CPU";
        if (testInfo.boSearch) {
          ok = TestUtils.waitFor(function () {
            var el = _.find(
                $(testInfo.boSearch).find("tr.csui-details-row .binf-form-control-static"),
                function(el) {return $(el).text().trim()===title;}
            );
            testInfo.boResultRowToSelect = $(el).parent().parent().parent().parent().parent().parent().prev();
            if (testInfo.boResultRowToSelect.length>0) {
              console.log("found details row");
              return true;
            }
            testInfo.boResultRowToSelect = $(testInfo.boSearch).find("[title='"+title+"']").closest('tr');
            if (testInfo.boResultRowToSelect.length>0) {
              console.log("found title element");
              return true;
            }
            return false;
          }, "search result to appear", 3000,done);
        }
        ok || fail();
        (ok===true||ok===false) && done();
      });

      it("select search result", function (done) {
        var ok = false;
        if (testInfo.boResultRowToSelect) {
          delete testInfo.attributesPanel;
          delete testInfo.referencePanel;
          delete testInfo.searchButton;
          DataManager.testMaterialSearch1_Init.disable();
          DataManager.testMaterialSearch1_Select.enable();
          testInfo.boResultRowToSelect.find("td").trigger("click");
          ok = true;
        }
        ok || fail();
        (ok===true||ok===false) && done();
      });

      it("description attribute is updated to 'Navigation CPU'", function (done) {
        var title = "Navigation CPU";
        TestUtils.waitFor(function () {
          testInfo.attributesPanel = $('[role="tabpanel"] div[title="Material Attributes"]').parent();
          if (testInfo.attributesPanel.length>0) {
            testInfo.attributesNameField = $(testInfo.attributesPanel).find(":contains('"+title+"')");
            if (testInfo.attributesNameField.length>0) {
              return true;
            }
            return false;
          }
          return false;
        }, "description attribute to be updated", 3000, done);
      });

      it("reference panel appears again", function (done) {
        TestUtils.waitFor (function(){
          testInfo.referencePanel = $(".conws-reference.reference-panel");
          return (testInfo.referencePanel.length>0);
        },"reference panel to appear again",3000,done);
      });

      it("replace button exists after select", function (done) {
        CSUITestUtils.asyncElement(testInfo.referencePanel, '.reference-replace button.replace').done(
          function () {
            testInfo.replaceButton = testInfo.referencePanel.find(".reference-replace button.replace");
            expect(testInfo.replaceButton.length).toBe(1);
            done();
          });
      });

      it("remove button exists after select", function (done) {
        CSUITestUtils.asyncElement(testInfo.referencePanel, '.reference-replace button.remove').done(
          function () {
            testInfo.removeButton = testInfo.referencePanel.find(".reference-replace button.remove");
            expect(testInfo.removeButton.length).toBe(1);
            done();
          });
      });

      it("after complete reference wait some time", function (done) {
        var ok = false;
        ok = TestUtils.justWait("after complete reference",2000,done)
        ok || fail();
        (ok===true||ok===false) && done();
      });

      it("cleanup test region", function (done) {
        testInfo.contentRegion && testInfo.contentRegion.reset();
        $("#reference-panel-search-root").remove();
        DataManager.testMaterialSearch1_Init.disable();
        DataManager.testMaterialSearch1_Select.disable();
        DataManager.testMaterialSearch1_Common.disable();
        done();
      });

    });

    describe('Replacing "Rebate settlement gloss paints" with "HP Jornada 820"', function () {

      var testInfo = {}, folderid = 511690;

      it("initializes", function (done) {
        initTestInfo(testInfo,folderid);
        $("body").append('<div id="reference-panel-edit-root" class="cs-perspective-panel"><div class="binf-container binf-container-fluid grid-rows"><div class="binf-row"><div class="binf-col-md-12 row-xs-full" id="reference-panel-edit-content"></div></div></div></div>');
        DataManager.testMaterialEdit1_Common.enable();
        DataManager.testMaterialEdit1_Init.enable();
        done();
      });

      it("shows nodes table view", function (done) {
        var options = {
          context: testInfo.context,
          data: {
            pageSize: 20
          }
        };
        testInfo.nodesTableView = new NodesTableView(options);

        testInfo.contentRegion = new Marionette.Region({ el: "#reference-panel-edit-content" });
        testInfo.contentRegion.show(testInfo.nodesTableView);
        done();
      });

      it("fetches the context", function (done) {
        testInfo.context.fetch().then(function() {
          done();
        })
      });

      it("opens the property panel", function () {
        TestUtils.openProperties(testInfo.nodesTableView,"Mat 004 Rebate settlement gloss paints");
      });

      it("attributes panel appears", function (done) {
        TestUtils.waitFor (function(){
          testInfo.attributesPanel = $('[role="tabpanel"] [title="Material Attributes"]').parent();
          return (testInfo.attributesPanel.length>0);
        },"attributes panel to appear",15000,done);
      });

      it("reference panel appears", function (done) {
        TestUtils.waitFor (function(){
          testInfo.referencePanel = $(".conws-reference.reference-panel");
          return (testInfo.referencePanel.length>0);
        },"reference panel to appear",3000,done);
      });

      it("replace button can be clicked", function (done) {
        var ok = false;
        if (testInfo.referencePanel) {
          ok = TestUtils.waitFor (function(){
            testInfo.replaceButton = testInfo.referencePanel.find(".reference-replace button.replace");
            if (testInfo.replaceButton.length>0) {
              testInfo.replaceButton.trigger("click");
              return true;
            }
            return false;
          },"replace button to appear",3000,done);
        }
        ok || fail();
        (ok===true||ok===false) && done();
      });


      it("search form is opened", function (done) {
        TestUtils.waitFor(function(){
          testInfo.boSearch = $(".conws-bosearch");
          return (testInfo.boSearch.length>0);
        }, "bo search to be opened after click on replace button", 3000, done);
      });

      it("search form is complete", function (done) {
        var ok = false;
        var fieldname = "ATTYP";
        if (testInfo.boSearch) {
          ok = TestUtils.waitFor(function () {
            testInfo.boSearchFieldsForm = $(testInfo.boSearch).find(".conws-bosearchform .conws-bosearchform-body .cs-form.cs-form-create");
            if (testInfo.boSearchFieldsForm.length<=0) {
              return false;
            }

            testInfo.boSearchField = $(testInfo.boSearchFieldsForm).find("[data-alpaca-container-item-name='"+fieldname+"']");
            if (testInfo.boSearchField.length<=0) {
              return false;
            }
            return true;
          }, "search fields to be filled", 3000, done);
        }
        ok || fail();
        (ok===true||ok===false) && done();
      });

      it("search for materials", function(done) {
        var ok = false;
        if (testInfo.boSearch) {
          testInfo.boSearchSearchButton = $(testInfo.boSearch).find(".conws-bosearchform .conws-bosearchform-footer .binf-btn.search");
          if (testInfo.boSearchSearchButton.length>0) {
            testInfo.boSearchSearchButton.trigger("click");
            ok = true;
          }
        }
        ok || fail();
        (ok===true||ok===false) && done();
      });

      it("search result 'HP JORNADA 820' appears", function (done) {
        var ok = false;
        var title = "HP JORNADA 820";
        if (testInfo.boSearch) {
          ok = TestUtils.waitFor(function () {
            var el = _.find(
                $(testInfo.boSearch).find("tr.csui-details-row .binf-form-control-static"),
                function(el) {return $(el).text().trim()===title;}
            );
            testInfo.boResultRowToSelect = $(el).parent().parent().parent().parent().parent().parent().prev();
            if (testInfo.boResultRowToSelect.length>0) {
              console.log("found details row");
              return true;
            }
            testInfo.boResultRowToSelect = $(testInfo.boSearch).find("[title='"+title+"']").closest('tr');
            if (testInfo.boResultRowToSelect.length>0) {
              console.log("found title element");
              return true;
            }
            return false;
          }, "search result to appear", 3000,done);
        }
        ok || fail();
        (ok===true||ok===false) && done();
      });

      it("select search result", function (done) {
        var ok = false;
        if (testInfo.boResultRowToSelect) {
          delete testInfo.attributesPanel;
          delete testInfo.referencePanel;
          delete testInfo.replaceButton;
          DataManager.testMaterialEdit1_Init.disable();
          DataManager.testMaterialEdit1_Select.enable();
          testInfo.boResultRowToSelect.find("td").trigger("click");
          ok = true;
        }
        ok || fail();
        (ok===true||ok===false) && done();
      });

      it("description attribute is updated", function (done) {
        var title = "HP Jornada 820";
        TestUtils.waitFor(function () {
          testInfo.attributesPanel = $('[role="tabpanel"] div[title="Material Attributes"]').parent();
          if (testInfo.attributesPanel.length>0) {
            testInfo.attributesNameField = $(testInfo.attributesPanel).find(":contains('"+title+"')");
            if (testInfo.attributesNameField.length>0) {
              return true;
            }
            return false;
          }
          return false;
        }, "description attribute to be updated", 3000, done);
      });

      it("reference panel appears again", function (done) {
        TestUtils.waitFor (function(){
          testInfo.referencePanel = $(".conws-reference.reference-panel");
          return (testInfo.referencePanel.length>0);
        },"reference panel to appear again",3000,done);
      });

      it("replace button exists again", function (done) {
        var ok = false;
        if (testInfo.referencePanel) {
          ok = TestUtils.waitFor (function(){
            testInfo.replaceButton = testInfo.referencePanel.find(".conws-reference-replace button.replace");
            return (testInfo.replaceButton.length>0);
          },"replace button to appear again",3000,done);
        }
        ok || fail();
        (ok===true||ok===false) && done();
      });

      it("remove button exists again", function (done) {
        CSUITestUtils.asyncElement(testInfo.referencePanel, '.conws-reference-replace button.remove').done(
          function () {
            testInfo.removeButton = testInfo.referencePanel.find(".conws-reference-replace button.remove");
            expect(testInfo.removeButton.length).toBe(1);
            done();
          });
      });

      it("after replace reference wait some time", function (done) {
        var ok = false;
        ok = TestUtils.justWait("after replace reference",2000,done)
        ok || fail();
        (ok===true||ok===false) && done();
      });

      it("cleanup test region", function (done) {
        testInfo.contentRegion && testInfo.contentRegion.reset();
        $("#reference-panel-edit-root").remove();
        DataManager.testMaterialEdit1_Init.disable();
        DataManager.testMaterialEdit1_Select.disable();
        DataManager.testMaterialEdit1_Common.disable();
        done();
      });

    });

    describe('Remove business object reference', function () {
      var testInfo = {}, folderid = 511690;

      it("initializes", function (done) {
        initTestInfo(testInfo,folderid);
        $("body").append('<div id="reference-panel-edit-root" class="cs-perspective-panel"><div class="binf-container binf-container-fluid grid-rows"><div class="binf-row"><div class="binf-col-md-12 row-xs-full" id="reference-panel-edit-content"></div></div></div></div>');
        DataManager.testMaterialEdit1_Common.enable();
        DataManager.testMaterialEdit1_Init.enable();
        done();
      });

      it("shows nodes table view", function (done) {
        var options = {
          context: testInfo.context,
          data: {
            pageSize: 20
          }
        };
        testInfo.nodesTableView = new NodesTableView(options);

        testInfo.contentRegion = new Marionette.Region({ el: "#reference-panel-edit-content" });
        testInfo.contentRegion.show(testInfo.nodesTableView);
        done();
      });

      it("fetches the context", function (done) {
        testInfo.context.fetch().then(function() {
          done();
        })
      });

      it("opens the property panel", function () {
        TestUtils.openProperties(testInfo.nodesTableView, "Mat 004 Rebate settlement gloss paints");
      });

      it("attributes panel appears", function (done) {
        CSUITestUtils.asyncElement('body', '[role="tabpanel"] [title="Material Attributes"]').done(
          function () {
            testInfo.attributesPanel = $('[role="tabpanel"] [title="Material Attributes"]').parent();
            expect(testInfo.attributesPanel.length).toBe(1);
            done();
          });
      });

      it("reference panel appears", function (done) {
        CSUITestUtils.asyncElement('body', '.conws-reference.reference-panel').done(
          function () {
            testInfo.referencePanel = $("body .conws-reference.reference-panel");
            expect(testInfo.referencePanel.length).toBe(1);
            done();
          });
      });

      it("remove button can be clicked", function (done) {
        CSUITestUtils.asyncElement(testInfo.referencePanel, '.reference-replace button.remove').done(
          function () {
            testInfo.removeButton = testInfo.referencePanel.find(".reference-replace button.remove");
            expect(testInfo.removeButton.length).toBe(1);
            testInfo.removeButton.trigger('click');
            done();
          });
      });

      it("Confirmation appears and clicked on cancel", function (done) {
        CSUITestUtils.asyncElement('body', '.csui-alert .binf-modal-dialog .binf-modal-content').done(
          function () {
            testInfo.confirmationDialog = $(".csui-alert .binf-modal-dialog .binf-modal-content");
            expect(testInfo.confirmationDialog.length).toBe(1);
            testInfo.cancelButton = testInfo.confirmationDialog.find('.binf-modal-footer .csui-no');
            expect(testInfo.cancelButton.length).toBe(1);
            testInfo.cancelButton.trigger('click');
            done();
          });
      });

      it("Reference panel is shown after cancelling the confirmation", function (done) {
        CSUITestUtils.asyncElement('body', '.conws-reference.reference-panel').done(
          function () {
            expect(testInfo.referencePanel.length).toBe(1);
            done();
          });
      });

      it("Confirming the removal of business object reference", function (done) {
        if (testInfo.removeButton.length>0) {
          testInfo.removeButton.trigger('click');
        }
        CSUITestUtils.asyncElement('body', '.csui-alert .binf-modal-dialog .binf-modal-content').done(
          function () {
            expect(testInfo.confirmationDialog.length).toBe(1);
            testInfo.yesButton = testInfo.confirmationDialog.find('.binf-modal-footer .csui-yes');
            expect(testInfo.yesButton.length).toBe(1);
            testInfo.yesButton.trigger('click');
            done();
          });
      });

      it("Success message appears", function (done){
        CSUITestUtils.asyncElement('body', '.csui-messagepanel.csui-success.csui-global-message').done(
          function () {
            testInfo.successMessage = $(".csui-messagepanel.csui-success.csui-global-message");
            expect(testInfo.successMessage.length).toBe(1);
            done();
          });
      });

      it("Nodes table appears", function(done){
        CSUITestUtils.asyncElement('body', testInfo.nodesTableView.$el).done(
          function () {
            testInfo.successMessage = $(".csui-messagepanel.csui-success.csui-global-message");
            expect(testInfo.nodesTableView.$el.length).toBe(1);
            done();
          });
      });

      afterAll(function () {
        DataManager.testMaterialEdit1_Init.disable();
        DataManager.testMaterialEdit1_Common.disable();
        CSUITestUtils.restoreEnvironment();
      });

    });

  });

});
