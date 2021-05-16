/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/jquery', 'csui/lib/underscore',
  'csui/utils/log',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/children',
  'csui/models/node/node.addable.type.factory',
  'csui/controls/tabletoolbar/tabletoolbar.view',
  'csui/widgets/nodestable/toolbaritems',
  'conws/utils/commands/test/addconws.mock.data',
  'conws/utils/commands/addconws',
  'csui/utils/commandhelper',
  'conws/utils/test/testutil',
  'csui/models/nodes',
  'i18n!conws/utils/commands/nls/commands.lang',
], function ($, _,
    log,
    PageContext,
    ChildrenCollectionFactory,
    AddableTypeCollectionFactory,
    TableToolbarView,
    toolbarItems,
    MockData,
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
      },"focus timeout to be elapsed", 600);
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

      TestUtil.waitFor(done,function () {
        testInfo.htmlDialog = $(".cs-item-action-metadata.cs-dialog.binf-modal");
        testInfo.htmlCreateForm = $(testInfo.htmlDialog).find(".cs-add-item-metadata-form");
        testInfo.htmlSaveButton = $(testInfo.htmlDialog)
            .find(".binf-modal-footer .binf-btn-primary:contains('" + CommandsLang.AddConwsMetadataDialogAddButtonTitle + "')");
        if (templateid===29725) {
          testInfo.htmlTargetAttributesPanel = $(testInfo.htmlCreateForm).find(".cs-metadata-properties div[title='Target Attributes']").parent();
          testInfo.htmlText5Field = $(testInfo.htmlTargetAttributesPanel).find("[data-alpaca-container-item-name='219144_2']");
        }
        return testInfo.htmlCreateForm && testInfo.htmlCreateForm.length>0
          && testInfo.htmlSaveButton && testInfo.htmlSaveButton.length>0;
      }, "dialog elements to be available", 6000);
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
        testInfo.htmlCloseButton.trigger('click');
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
        testInfo.htmlSaveButton.trigger('click');
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
          htmlNameFieldInput.trigger('keydown');
          htmlNameFieldInput.val(nameVal);
          htmlNameFieldInput.trigger('keyup');
          htmlNameFieldInput.trigger('blur');
          htmlText5FieldInput = $(testInfo.htmlText5Field).find("input");
          htmlText5FieldInput.trigger('keydown');
          htmlText5FieldInput.val(text5Val);
          htmlText5FieldInput.trigger('keyup');
          htmlText5FieldInput.trigger('blur');
          testInfo.executeStatus.metadataAddItemController.metadataAddItemPropView.blockActions();
          testInfo.htmlSaveButton.trigger('click');
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



    function closeCreateDialog(done, testInfo) {
      TestUtil.run(done,function () {
        testInfo.htmlCancelButton = testInfo.htmlDialog.find(".binf-modal-content .binf-modal-footer .binf-btn-default");
        testInfo.htmlCancelButton.trigger('click');
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

  });

});
