/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/jquery', 'csui/lib/underscore',
  'csui/utils/log',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/children',
  'csui/models/node/node.addable.type.factory',
  'csui/controls/tabletoolbar/tabletoolbar.view',
  'csui/widgets/nodestable/toolbaritems',
  'xecmpf/controls/bosearch/test/addconws.mock.data',
  'xecmpf/controls/property.panels/reference/reference.panel',
  'conws/utils/commands/addconws',
  'csui/utils/commandhelper',
  'conws/utils/test/testutil',
  'csui/models/nodes',
  'i18n!conws/utils/commands/nls/commands.lang',
  'i18n!xecmpf/controls/property.panels/reference/impl/nls/lang',
  'esoc/widgets/userwidget/userwidget'
], function ($, _,
    log,
    PageContext,
    ChildrenCollectionFactory,
    AddableTypeCollectionFactory,
    TableToolbarView,
    toolbarItems,
    MockData,
    ReferencePanel,
    AddConwsCommand,
    CommandHelper,
    TestUtil,
    NodeCollection,
    CommandsLang,
    ReferenceTabLang) {

  describe('Create Dialog test', function () {

    var originalTimeout = 0;

    beforeAll(function() {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    afterAll(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

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
            attributes: {id: folderid},
            get: function () {
              return folderid;
            }
          }
        }
      });
      testInfo.collection = testInfo.context.getCollection(ChildrenCollectionFactory);
      testInfo.addableTypes = testInfo.context.getCollection(AddableTypeCollectionFactory);
      testInfo.selectedNodes = new NodeCollection();
    }

    var executeStatusData = {
      29725: {
        subType: 848,
        template: {
          id: 29725,
          name: "Contract Workspace",
          subType: 848
        },
        wsType: {
          id: 2,
          name: "Contract Workspace Type",
          templates: [
            {
              id: 29725,
              name: "Contract Workspace",
              subType: 848
            }
          ]
        }
      },
      502179: {
        subType: 848,
        template: {
          id: 502179,
          name: "Material",
          subType: 848
        },
        wsType: {
          id: 437,
          name: "Mat Ws Type",
          templates: [
            {
              id: 502179,
              name: "Material",
              subType: 848
            }
          ]
        }
      }
    };

    function waitForSetFocusTimeout(done) {
      var timeoutReached = false;
      TestUtil.run(done,function(){
        timeoutReached = false;
        setTimeout(function(){
          timeoutReached = true;
        }, 500 );
      });
      TestUtil.waitFor(done,function() {
        var reached = timeoutReached===true;
        timeoutReached = false;
        return reached;
      },"focus timeout to be elapsed", 505);
    }

    function createDialog(done,testInfo,templateid) {
      testInfo.addWorkspaceCommand = new AddConwsCommand();
      TestUtil.run(done,function () {
        testInfo.executeStatus = {
          nodes: testInfo.selectedNodes,
          container: testInfo.collection.node,
          collection: testInfo.collection,
          data: executeStatusData[templateid]
        };
        testInfo.executeOptions = {
          context: testInfo.context,
          addableType: 848,
          addableTypeName: "Contract Workspace"
        };
        testInfo.promiseFromCommand = testInfo.addWorkspaceCommand.execute(
            testInfo.executeStatus,
            testInfo.executeOptions
        );
        testInfo.promiseFromCommand
            .done(function () {
              testInfo.commandResult = "resolved";
            })
            .fail(function () {
              testInfo.commandResult = "rejected";
            });
      });

      TestUtil.waitFor(done,function () {
        if (testInfo.executeStatus) {
          if (testInfo.executeStatus.metadataAddItemController) {
            if (testInfo.executeStatus.metadataAddItemController.metadataAddItemPropView) {
              if (testInfo.executeStatus.metadataAddItemController.metadataAddItemPropView.metadataPropertiesView) {
                testInfo.metadataPropertiesView = testInfo.executeStatus.metadataAddItemController.metadataAddItemPropView.metadataPropertiesView;
                return true;
              }
            }
          }
        }
        return false;
      }, "dialog to be created", 6000);

      var isRendered = false;
      TestUtil.run(done,function () {
        testInfo.metadataPropertiesView.on('render:forms', function () {
          isRendered = true;
        });
      });

      TestUtil.waitFor(done,function () {
        return isRendered === true;
      }, "dialog to be rendered", 6000); // long timeout, so we get network errors in test output

      TestUtil.run(done,function(done) {
        waitForSetFocusTimeout(done);
      });

      TestUtil.run(done,function () {
        testInfo.htmlDialog = $(".cs-item-action-metadata.cs-dialog.binf-modal");
        testInfo.htmlCreateForm = $(testInfo.htmlDialog).find(".cs-add-item-metadata-form");
        testInfo.htmlSaveButton = $(testInfo.htmlDialog)
            .find(".binf-modal-footer .binf-btn-primary:contains('" + CommandsLang.AddConwsMetadataDialogAddButtonTitle + "')");
        if (templateid===29725) {
          testInfo.htmlTargetAttributesPanel = $(testInfo.htmlCreateForm).find(".cs-metadata-properties div[title='Target Attributes']").parent();
          testInfo.htmlText5Field = $(testInfo.htmlTargetAttributesPanel).find("[data-alpaca-container-item-name='219144_2']");
        } else if (templateid===502179) {
          testInfo.htmlCreateAttributesPanel = $(testInfo.htmlCreateForm).find(".cs-metadata-properties div[title='Material Attributes']").parent();
          testInfo.htmlReferenceTabPanel = $(testInfo.htmlCreateForm).find(".cs-metadata-properties .conws-reference.reference-panel");
        }
      });
    }

    describe("verify dialog elements for 'Contract Workspace'", function () {

      var testInfo = {}, folderid = 25980, templateid = 29725;

      it("dialog can be created", function (done) {

        MockData["testContract"].enable();
        initTestInfo(testInfo,folderid);
        createDialog(done,testInfo,templateid);
        TestUtil.run(done,function() {
          expect(testInfo.htmlDialog.length).toEqual(1);
        });

      });

      it("metadata form exists", function () {
        expect(testInfo.htmlCreateForm.length).toEqual(1);
      });

      it("panel for 'Target Attributes' exists", function () {
        var htmlTargetAttributesPanelLabel = $(testInfo.htmlTargetAttributesPanel).find(".alpaca-container-label");
        var htmlTargetAttributesPanelLabelText = $(htmlTargetAttributesPanelLabel).text().trim();
        expect(htmlTargetAttributesPanelLabelText).toEqual("Target Attributes");
      });

      it("field 'Text 5' exists", function () {
        var htmlText5Label = $(testInfo.htmlText5Field).find(".binf-control-label");
        var htmlText5LabelText = $(htmlText5Label).text().trim();
        expect(htmlText5LabelText).toEqual("Text 5");
      });

      it("field 'Text 5' is mandatory", function () {
        var htmlText5Child = $(testInfo.htmlText5Field).find(">.alpaca-required");
        expect(htmlText5Child.length).toBeGreaterThan(0);
      });

      it("dialog can be closed at end of creation test by pressing the close icon", function () {
        testInfo.htmlCloseButton = testInfo.htmlDialog.find(".binf-modal-content .binf-modal-header .cs-close");
        testInfo.htmlCloseButton.trigger("click");
      });

      it("verify that dialog is closed at end of creation test", function (done) {
        waitForCreateDialogToBeClosed(done, testInfo);
        TestUtil.run(done,function () {
          MockData["testContract"].disable();
        });
      });

    });

    describe("verify that save is failing with empty fields for 'Contract Workspace'", function () {

      var testInfo = {}, folderid = 25980, templateid = 29725;

      it("dialog can be created", function (done) {

        MockData["testContract"].enable();
        initTestInfo(testInfo,folderid);
        createDialog(done,testInfo,templateid);
        TestUtil.run(done,function() {
          expect(testInfo.htmlDialog.length).toEqual(1);
        });

      });

      it("cannot be saved with empty mandatory fields", function () {
        testInfo.htmlSaveButton.trigger("click");
        var htmlSaveErrorMessage = $(".cs-item-action-metadata.cs-dialog.binf-modal .cs-add-item-metadata-form .cs-metadata-properties .validation-error-message");
        expect(htmlSaveErrorMessage.length).toBeGreaterThan(0);
      });

      it("dialog is still open after rejected save", function () {

        testInfo.htmlDialog = $(".cs-item-action-metadata.cs-dialog.binf-modal");
        expect(testInfo.htmlDialog.length).toEqual(1);

      });

      it("dialog can be closed at end of reject test", function (done) {
        closeCreateDialog(done, testInfo);
        TestUtil.run(done,function(){
          MockData["testContract"].disable();
        });
      });

    });

    describe("verify that save succeeds with filled fields for 'Contract Workspace'", function () {

      var testInfo = {}, folderid = 25980, templateid = 29725;

      it("dialog can be created", function (done) {

        MockData["testContract"].enable();
        initTestInfo(testInfo,folderid);
        createDialog(done, testInfo,templateid);
        TestUtil.run(done,function() {
          expect(testInfo.htmlDialog.length).toEqual(1);
        });

      });

      it("can be saved with filled mandatory fields", function (done) {
        var nameVal = "Test Contract Workspace 001";
        var text5Val = "Test Text 5";
        var htmlNameFieldInput;
        var htmlText5FieldInput;
        TestUtil.run(done,function () {
          htmlNameFieldInput = $(testInfo.htmlCreateForm).find(".cs-metadata-item-name input");
          htmlNameFieldInput.trigger("keydown");
          htmlNameFieldInput.val(nameVal);
          htmlNameFieldInput.trigger("keyup");
          htmlNameFieldInput.trigger("blur");
          htmlText5FieldInput = $(testInfo.htmlText5Field).find("input");
          htmlText5FieldInput.trigger("keydown");
          htmlText5FieldInput.val(text5Val);
          htmlText5FieldInput.trigger("keyup");
          htmlText5FieldInput.trigger("blur");
          testInfo.executeStatus.metadataAddItemController.metadataAddItemPropView.blockActions()
          testInfo.htmlSaveButton.trigger("click");
        });
        TestUtil.waitFor(done,function () {
          if (testInfo.commandResult) {
            return true;
          }
          return false;
        }, "command to be resolved", 3000);
        TestUtil.run(done,function () {
          expect(testInfo.commandResult).toEqual("resolved");
        });
      });

      it("dialog is closed and removed after save", function (done) {
        waitForCreateDialogToBeClosed(done, testInfo);
        TestUtil.run(done,function () {
          expect(testInfo.executeStatus.metadataAddItemController.metadataAddItemPropView.blockingView.counter).toEqual(0);
          MockData["testContract"].disable();
        });

      });

    });

    function openCreateDialog(done,testInfo,folderid,templateid) {
      initTestInfo(testInfo,folderid);
      createDialog(done, testInfo,templateid);
      TestUtil.run(done,function() {
        expect(testInfo.htmlDialog.length).toEqual(1);
      });
    }

    function openSearchFormSearch(done, testInfo) {
      TestUtil.run(done,function() {
        testInfo.htmlReferenceSearchButton = $(testInfo.htmlDialog).find(
            ".conws-reference.reference-initial .binf-btn-default:contains('"
            + ReferenceTabLang.referenceSearchButtonTitle + "')");
        testInfo.htmlReferenceSearchButton.trigger("click");
      });
      TestUtil.waitFor(done,function () {
        testInfo.htmlBosearchForm = $(testInfo.htmlDialog).find(".conws-bosearch");
        if (testInfo.htmlBosearchForm.length<=0) {
          return false;
        }
        return true;
      }, "search form to appear after click on search", 3000);
    }

    function openSearchFormReplace(done, testInfo) {
      TestUtil.run(done,function() {
        testInfo.htmlReferenceSearchButton = $(testInfo.htmlDialog).find(
            ".conws-reference.reference-replace .binf-btn-default:contains('"
            + ReferenceTabLang.referenceReplaceButtonTitle + "')");
        testInfo.htmlReferenceSearchButton.trigger("click");
      });
      TestUtil.waitFor(done,function () {
        testInfo.htmlBosearchForm = $(testInfo.htmlDialog).find(".conws-bosearch");
        if (testInfo.htmlBosearchForm.length<=0) {
          return false;
        }
        return true;
      }, "search form to appear after click on replace", 3000);
    }

    function waitForSearchFormToBeComplete(done, testInfo,fieldname) {
      TestUtil.waitFor(done,function () {
        testInfo.htmlBosearchFieldsForm = $(testInfo.htmlBosearchForm).find(".cs-form.cs-form-create");
        if (testInfo.htmlBosearchFieldsForm.length<=0) {
          return false;
        }
        testInfo.htmlSearchField = $(testInfo.htmlBosearchFieldsForm).find("[data-alpaca-container-item-name='"+fieldname+"']");
        if (testInfo.htmlSearchField.length<=0) {
          return false;
        }
        return true;
      }, "search fields to be filled", 3000);
    }

    function waitForModalDialogToDisappear(done, testInfo) {
      TestUtil.waitFor(done,function () {
        testInfo.htmlModalBody = $(testInfo.htmlDialog).find(".binf-modal-body");
        if (testInfo.htmlModalBody.css("display")!=="none") {
          return false;
        }
        return true;
      }, "modal body is hidden", 3000);
    }

    function closeCreateDialog(done, testInfo) {
      TestUtil.run(done,function () {
        testInfo.htmlCancelButton = testInfo.htmlDialog.find(".binf-modal-content .binf-modal-footer .binf-btn-default");
        testInfo.htmlCancelButton.trigger("click");
      });
      TestUtil.waitFor(done,function () {
        testInfo.htmlDialog = $(".cs-item-action-metadata.cs-dialog.binf-modal");
        return testInfo.htmlDialog.length===0;
      }, "dialog to be closed after pressing cancel button",
          3000 // long timeout, so we get network errors in test output
      );
      TestUtil.run(done,function () {
        expect(testInfo.htmlDialog.length).toEqual(0);
        if (testInfo.htmlDialog.length>0) {
          testInfo.htmlDialog.remove();
          testInfo.htmlDialog = $(".cs-item-action-metadata.cs-dialog.binf-modal");
        }
      });
    }

    function waitForCreateDialogToBeClosed(done, testInfo) {
      TestUtil.waitFor(done,function () {
        testInfo.htmlDialog = $(".cs-item-action-metadata.cs-dialog.binf-modal");
        return testInfo.htmlDialog.length === 0;
      }, "dialog to be closed", 3000);
      TestUtil.run(done,function () {
        expect(testInfo.htmlDialog.length).toEqual(0);
        if (testInfo.htmlDialog.length>0) {
          testInfo.htmlDialog.remove();
          testInfo.htmlDialog = $(".cs-item-action-metadata.cs-dialog.binf-modal");
        }
      });
    }

    describe("verify reference tab and open search form for 'Material Workspace'", function () {

      var testInfo = {}, folderid = 511690, templateid= 502179;

      it("dialog can be created", function (done) {

        MockData["testMaterial"].enable();
        openCreateDialog(done, testInfo,folderid,templateid);

      });

      it("reference tab panel exists", function () {
        var htmlReferenceTabPanelLabel = $(testInfo.htmlReferenceTabPanel).find(".alpaca-container-label");
        var htmlReferenceTabPanelLabelText = $(htmlReferenceTabPanelLabel).text().trim();
        expect(htmlReferenceTabPanelLabelText).toEqual("Reference");
      });

      it("search form is displayed", function (done) {
        openSearchFormSearch(done, testInfo);
      });

      it("search form is complete", function (done) {
        waitForSearchFormToBeComplete(done, testInfo,"ATTYP");
      });

      it("modal body is hidden", function (done) {
        waitForModalDialogToDisappear(done, testInfo);
      });

      it("Material Category has filled drop down value list", function () {
        var htmlfield_ATTYP_label = $(testInfo.htmlSearchField).find(".alpaca-control-label");
        expect(htmlfield_ATTYP_label.text()).toEqual("Material Category");
        var htmlfield_ATTYP_values = $(testInfo.htmlSearchField).find(".binf-dropdown-menu").children();
        var attypValueResultGood = "greater' than 0 but is '" + htmlfield_ATTYP_values.length,
            attypValueResultBad = "value count",
            attypValueResult = htmlfield_ATTYP_values.length>0 ? attypValueResultGood : attypValueResultBad;
        expect(attypValueResult).toBe(attypValueResultGood);
      });

      it("Cancel closes search overlay and shows reference panel again", function (done) {
        TestUtil.run(done,function(done) {
          testInfo.htmlSearchCancelButton = $(testInfo.htmlDialog).find(".conws-bosearch .conws-bosearchform-footer .binf-btn.cancel");
          testInfo.htmlSearchCancelButton.trigger("click");
          waitForSetFocusTimeout(done);
        });
        TestUtil.waitFor(done,function () {
          testInfo.htmlBosearchForm = $(testInfo.htmlDialog).find(".conws-bosearch");
          if (testInfo.htmlBosearchForm.length>0) {
            return false;
          }
          return true;
        }, "search form to disappear", 3000);
        TestUtil.run(done,function() {
          testInfo.htmlModalBody = $(testInfo.htmlDialog).find(".binf-modal-body");
          expect(testInfo.htmlModalBody.css("display") !== 'none').toBeTruthy();
        });
      });

      it("dialog can be closed at end of reference tab test", function (done) {
        closeCreateDialog(done, testInfo);
        TestUtil.run(done,function(){
          MockData["testMaterial"].disable();
        });
      });
    });

    function selectBoSearchResult(done,testInfo,title) {
      TestUtil.waitFor(done,function () {
        testInfo.boSearch = $(".conws-bosearch");
        var el = _.find(
            $(testInfo.boSearch).find("tr.csui-details-row .binf-form-control-static"),
            function(el) {return $(el).text().trim()===title;}
        );
        testInfo.htmlRowToSelect = $(el).parent().parent().parent().parent().parent().parent().prev();
        if (testInfo.htmlRowToSelect.length>0) {
          console.log("found details row");
          return true;
        }
        testInfo.htmlRowToSelect = $(testInfo.boSearch).find("[title='"+title+"']").closest('tr');
        if (testInfo.htmlRowToSelect.length>0) {
          console.log("found title element");
          return true;
        }
        return false;
      }, "search result to appear", 3000);
      var isRendered = false;
      TestUtil.run(done,function() {
        isRendered = false;
        testInfo.metadataPropertiesView.on('render:forms', function () {
          isRendered = true;
        });
        testInfo.htmlRowToSelect.find("td").trigger("click");
      });
      TestUtil.waitFor(done,function () {
        testInfo.htmlReferenceReplaceButton = $(testInfo.htmlDialog).find(
            ".conws-reference.reference-replace .conws-reference-buttons .binf-btn-default:contains('"
            + ReferenceTabLang.referenceReplaceButtonTitle + "')");
        if (testInfo.htmlReferenceReplaceButton.length<=0) {
          return false;
        }
        testInfo.htmlSelRefField = $(testInfo.htmlDialog).find(
            ".conws-reference-replace .conws-reference-metadata .cs-formfield-readonly "
            +"[title='"+title+"']").parent();
        if (testInfo.htmlSelRefField.length>0) {
          return true;
        }
        return false;
      }, "selected row values to appear in reference tab", 3000);
      TestUtil.waitFor(done,function () {
        return isRendered === true;
      }, "dialog to be rendered", 3000); // long timeout, so we get network errors in test output

    }

    describe("again open search for 'Material Workspace', search and select object", function () {

      var testInfo = {}, folderid = 511690, templateid= 502179;

      it("open create dialog", function(done) {
        MockData["testMaterial"].enable();
        openCreateDialog(done, testInfo,folderid,templateid);
      });

      it("open search overlay", function(done) {
        openSearchFormSearch(done, testInfo);
        waitForSearchFormToBeComplete(done, testInfo,"ATTYP");
        waitForModalDialogToDisappear(done, testInfo);
      });

      it("search for materials", function(done) {
        TestUtil.run(done,function() {
          testInfo.htmlSearchSearchButton = $(testInfo.htmlDialog).find(".conws-bosearch .conws-bosearchform-footer .binf-btn.search");
          testInfo.htmlSearchSearchButton.trigger("click");
        });
      });

      it("select Maxitec-R 375 Personal computer", function(done) {
        selectBoSearchResult(done, testInfo,"MAXITEC-R 375 PERSONAL COMPUTER");
      });

      it("reopen open search form with replace button", function(done) {
        openSearchFormReplace(done, testInfo);
      });

      it("select PROTECTION SHIELD 1", function(done) {
        selectBoSearchResult(done, testInfo,"PROTECTION SHIELD 1");
      });

      it("save workspace with bo reference and wait for closed dialog", function(done) {
        TestUtil.run(done,function () {
          testInfo.htmlSaveButton = $(testInfo.htmlDialog)
              .find(".binf-modal-footer .binf-btn-primary:contains('" + CommandsLang.AddConwsMetadataDialogAddButtonTitle + "')");
          expect(testInfo.htmlSaveButton.length).toEqual(1);
          testInfo.htmlSaveButton.trigger("click");
        });
        TestUtil.waitFor(done,function () {
          if (testInfo.commandResult) {
            return true;
          }
          return false;
        }, "command to be resolved", 3000);
        TestUtil.run(done,function () {
          expect(testInfo.commandResult).toEqual("resolved");
        });
        waitForCreateDialogToBeClosed(done, testInfo);
        TestUtil.run(done,function (){
          MockData["testMaterial"].disable();
        });
      });
    });

  });

});
