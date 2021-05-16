/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/children',
  'csui/models/node/node.addable.type.factory',
  'csui/controls/tabletoolbar/tabletoolbar.view',
  'csui/widgets/nodestable/toolbaritems',
  'conws/utils/test/testutil',
  'conws/utils/commands/test/tabletoolbar.extension.mock.data',
  'conws/utils/commands/tabletoolbar.extension',
  'csui/lib/marionette',
  'csui/controls/globalmessage/globalmessage',
  'i18n!conws/utils/commands/nls/commands.lang'
], function ($, _, PageContext,
    ChildrenCollectionFactory,
    AddableTypeCollectionFactory,
    TableToolbarView,
    toolbarItems,
    TestUtil,
    MockData,
    TableToolbarExtension,
    Marionette,
    GlobalMessage,
    CommandsLang) {


  describe('TableToolbarExtension test', function () {

    var addableTypesData = [
      { type: 136, type_name: "Compound Document" },
      { type: 144, type_name: "Document" },
      { type: 0, type_name: "Folder" },
      { type: 1, type_name: "Shortcut" },
      { type: 204, type_name: "Task List" },
      { type: 140, type_name: "URL" }
    ],
        addItemsMenuStdLength = 4;
    
    function waitMillies(done,millies) {
      var timeout_reached = false;
      TestUtil.run(done,function () {
        setTimeout(function() {
          timeout_reached = true;
        },millies);
      });
      TestUtil.waitFor(done,function () {
        return timeout_reached;
      },"some time", millies+100);
    }
    
    function initTableToolbarView(id) {
      var context,
          collection,
          addableTypes,
          tableToolbarView;
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
          },
          node: {
            attributes: {id: id},
            get: function(){
              return id;
            }
          }
        }
      });
      collection = context.getCollection(ChildrenCollectionFactory);
      addableTypes = context.getCollection(AddableTypeCollectionFactory);
      tableToolbarView = new TableToolbarView({
        context: context,
        toolbarItems: toolbarItems,
        collection: collection,
        addableTypes: addableTypes
      });
      var testInfo = {};
      testInfo.context = context;
      testInfo.collection = collection;
      testInfo.addableTypes = addableTypes;
      testInfo.tableToolbarView = tableToolbarView;
      return testInfo;
    }

    describe('with mock data for an ajax error', function () {

      var context,
          collection,
          addableTypes,
          tableToolbarView,
          messageElement,
          rendered;

      it('TableToolbarView can be created', function (done) {
        TestUtil.run(done,function() {
          var testInfo = initTableToolbarView(0);
          context = testInfo.context;
          collection = testInfo.collection;
          addableTypes = testInfo.addableTypes;
          tableToolbarView = testInfo.tableToolbarView;
          MockData["test0"].enable();
          tableToolbarView.on("render", function () {
            rendered = true;
          });
          expect(tableToolbarView instanceof TableToolbarView).toBeTruthy();
        });
      });

      it('TableToolbarView has the add toolbar', function (done) {

        TestUtil.run(done,function() {
          rendered = false;
          tableToolbarView.render();
          tableToolbarView.trigger('show');
        });

        TestUtil.waitFor(done,function () {
          return rendered;
        }, "view was not rendered in time", 200);

        TestUtil.run(done,function () {
          var el = tableToolbarView.$el;
          var addToolbarEl = el.find('.csui-addToolbar');
          expect(addToolbarEl.length).toBeGreaterThan(0);
        });
      });

      it('Calling the extension raises the expected error message', function (done) {

        TestUtil.run(done,function() {

          var messageLocation = new Marionette.View();
          messageLocation.render();
          messageLocation.$el.height("62px");
          messageLocation.$el.appendTo(document.body);
          messageLocation.trigger('show');
          GlobalMessage.setMessageRegionView(messageLocation,  {classes: "csui-global-message"});
          addableTypes.reset(addableTypesData);

        });

        TestUtil.waitFor(done,function () {
          messageElement = $(".csui-messagepanel .csui-header .csui-text");
          return messageElement.length;
        }, "message was not raised in time", 3000);

        TestUtil.run(done,function () {
          expect(CommandsLang.ErrorLoadingAddItemMenu).toEqual(messageElement.text());
        });
      });

      it('Test case 0 can be cleaned up', function (done) {
        TestUtil.run(done,function () {
          $(".csui-messagepanel .csui-action .csui-action-close").trigger('click');
        });

        TestUtil.waitFor(done,function () {
          return $(".csui-messagepanel .csui-action .csui-action-close").length===0;
        }, "message was not closed in time", 3000);

        waitMillies(done,1000);
        
        TestUtil.run(done,function () {
          $(".csui-messagepanel .csui-action .csui-action-close").remove();
          if (tableToolbarView && tableToolbarView.destroy) {
            tableToolbarView.destroy();
            tableToolbarView = undefined;
          }
          MockData["test0"].disable();
        });
      });

    });

    describe('with mock data for no workspace types', function () {

      var context,
          collection,
          addableTypes,
          tableToolbarView;

      var rendered = false;
      var resetTriggered = false;

      it('TableToolbarView can be created', function (done) {
        TestUtil.run(done,function () {
          var testInfo = initTableToolbarView(1);
          context = testInfo.context;
          collection = testInfo.collection;
          addableTypes = testInfo.addableTypes;
          tableToolbarView = testInfo.tableToolbarView;
          MockData["test1"].enable();
          tableToolbarView.on("render", function () {
            rendered = true;
          });
          expect(tableToolbarView instanceof TableToolbarView).toBeTruthy();
        });
      });

      it('TableToolbarView has the add toolbar', function (done) {

        TestUtil.run(done,function () {
          tableToolbarView.render();
          tableToolbarView.trigger('show');
        });

        TestUtil.waitFor(done,function () {
          return rendered;
        }, "view was not rendered in time", 200);

        TestUtil.run(done,function () {
          var el = tableToolbarView.$el;
          var addToolbarEl = el.find('.csui-addToolbar');
          expect(addToolbarEl.length).toBeGreaterThan(0);
        });
      });

      it('Calling the extension extends the add toolbar as expected', function (done) {
        TestUtil.run(done,function () {
          tableToolbarView.options.toolbarItems.addToolbar.collection.on("reset", function () {
            resetTriggered = true;
          });
          addableTypes.reset(addableTypesData);

        });

        TestUtil.waitFor(done,function () {
          return resetTriggered;
        }, "reset was not triggered in time", 200);

        TestUtil.run(done,function () {
          var expectedMenuEntries = MockData["test1"].expectedMenuEntries,
              expectedMenuEntriesMap = {};
          expectedMenuEntries.forEach(function (wstype) {
            expectedMenuEntriesMap[wstype] = true;
          });

          var gotMenuEntries = [];
          var allGotMenuItems = [];
          tableToolbarView.options.toolbarItems.addToolbar.collection.each(function (item) {
            var name = item.get("name");
            allGotMenuItems.push(name);
            if (expectedMenuEntriesMap[name]) {
              gotMenuEntries.push(name);
            }
          });

          var addItemsGotLengthText = "length:"+ tableToolbarView.options.toolbarItems.addToolbar.collection.length;
          var addItemsExpLengthText = "length:"+ (expectedMenuEntries.length+addItemsMenuStdLength);
          expect(addItemsGotLengthText).toEqual(addItemsExpLengthText);

          var gotMenuItemStrings = gotMenuEntries.sort().join();
          var expMenuItemStrings = expectedMenuEntries.sort().join();
          if (gotMenuItemStrings !== expMenuItemStrings) {
            var allGotMenuItemStrings = allGotMenuItems.join();
            var ourExpMenuItemStrings = ["..."].concat(expectedMenuEntries).join();
            expect("entries:"+allGotMenuItemStrings).toEqual("entries:"+ourExpMenuItemStrings);
          }
        });
      });

      it('Test case 1 can be cleaned up', function (done) {

        waitMillies(done,1000);

        TestUtil.run(done,function () {
          if (tableToolbarView && tableToolbarView.destroy) {
            tableToolbarView.destroy();
            tableToolbarView = undefined;
          }
          MockData["test1"].disable();
        });
      });

    });

    describe('with mock data for two workspace types', function () {

      var context,
          collection,
          addableTypes,
          tableToolbarView;

      var rendered = false;
      var resetTriggered = false;

      it('TableToolbarView can be created', function (done) {
        TestUtil.run(done,function () {
          var testInfo = initTableToolbarView(25980);
          context = testInfo.context;
          collection = testInfo.collection;
          addableTypes = testInfo.addableTypes;
          tableToolbarView = testInfo.tableToolbarView;
          MockData["test25980"].enable();
          tableToolbarView.on("render", function () {
            rendered = true;
          });
          expect(tableToolbarView instanceof TableToolbarView).toBeTruthy();
        });
      });

      it('TableToolbarView has the add toolbar', function (done) {

        TestUtil.run(done,function () {
          tableToolbarView.render();
          tableToolbarView.trigger('show');
        });

        TestUtil.waitFor(done,function () {
          return rendered;
        }, "view was not rendered in time", 200);

        TestUtil.run(done,function () {
          var el = tableToolbarView.$el;
          var addToolbarEl = el.find('.csui-addToolbar');
          expect(addToolbarEl.length).toBeGreaterThan(0);
        });
      });

      it('Calling the extension extends the add toolbar as expected', function (done) {
        TestUtil.run(done,function () {
          tableToolbarView.options.toolbarItems.addToolbar.collection.on("reset", function () {
            resetTriggered = true;
          });
          addableTypes.reset(addableTypesData);
        });

        TestUtil.waitFor(done,function () {
          return resetTriggered;
        }, "reset was not triggered in time", 200);

        TestUtil.run(done,function () {
          var expectedMenuEntries = MockData["test25980"].expectedMenuEntries,
              expectedMenuEntriesMap = {};
          expectedMenuEntries.forEach(function (wstype) {
            expectedMenuEntriesMap[wstype] = true;
          });

          var gotMenuEntries = [];
          var allGotMenuItems = [];
          tableToolbarView.options.toolbarItems.addToolbar.collection.each(function (item) {
            var name = item.get("name");
            allGotMenuItems.push(name);
            if (expectedMenuEntriesMap[name]) {
              gotMenuEntries.push(name);
            }
          });

          var addItemsGotLengthText = "length:"+ tableToolbarView.options.toolbarItems.addToolbar.collection.length;
          var addItemsExpLengthText = "length:"+ (expectedMenuEntries.length+addItemsMenuStdLength);
          expect(addItemsGotLengthText).toEqual(addItemsExpLengthText);

          var gotMenuItemStrings = gotMenuEntries.sort().join();
          var expMenuItemStrings = expectedMenuEntries.sort().join();
          if (gotMenuItemStrings !== expMenuItemStrings) {
            var allGotMenuItemStrings = allGotMenuItems.join();
            var ourExpMenuItemStrings = ["..."].concat(expectedMenuEntries).join();
            expect("entries:"+allGotMenuItemStrings).toEqual("entries:"+ourExpMenuItemStrings);
          }
        });
      });

      it('Test case 25980 can be cleaned up', function (done) {

        waitMillies(done,1000);

        TestUtil.run(done,function () {
          if (tableToolbarView && tableToolbarView.destroy) {
            tableToolbarView.destroy();
            tableToolbarView = undefined;
          }
          MockData["test25980"].disable();
        });
      });

    });

  });

});
