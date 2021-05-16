/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'conws/utils/test/testutil',
  'conws/widgets/relatedworkspaces/impl/relatedworkspacestable.view',
  'conws/widgets/relatedworkspaces/impl/relatedworkspaces.factory',
  'conws/utils/workspaces/workspace.model',
  'csui/models/action',
  './relwkspexpview.mock.js'
], function (_, $, Marionette, PageContext, TestUtil,
  RelatedWorkspacesTableView,
  RelatedWorkspacesCollectionFactory,
  WorkspaceModel,
  ActionModel,
  MockData
) {

  describe('RelatedWorkspacesExpandedViewTest', function () {

    function waitFor(check, timeout, message) {
      return TestUtil.waitFor(check,message,timeout);
    }

    var checkboxElements;
    var headerTitleElement;
    var selectedCounterRegion;
    var addCommandElement;
    var testCommandElement;
    var tableHeaderToolbarElement;
    var rowSelectionToolbarElement;

    var regionEl;
    var resultsRegion;
    var pageContext;
    var collection;
    var expandedView;

    function testsetup() {

        var deferred = $.Deferred();

        regionEl = undefined;
        resultsRegion = undefined;
        pageContext = undefined;
        collection = undefined;
        expandedView = undefined;
  
        $('body').empty();
        regionEl = $('<div style="width:1264px; height:632px;"></div>').appendTo(document.body);
        resultsRegion = new Marionette.Region({
          el: regionEl
        });
  
        pageContext = new PageContext({
          factories: {
            connector: {
              assignTo: function assignTo(what) {
                what && (what.connector = this);
              },
              connection: {
                url: '//server/otcs/cs/api/v1',
                supportPath: '/support',
                session: {
                  ticket: 'dummy'
                }
              }
            },
            node: {
              get: function(key) {
                return this.attributes[key];
              },
              attributes: {
                id: 2513449,
                type: 848
              }
            }
          }
        });
        collection =  pageContext.getCollection(RelatedWorkspacesCollectionFactory, MockData.collectionOptions1);
  
        expandedView = new RelatedWorkspacesTableView({
          collection: collection,
          context: pageContext,
          data: MockData.expandedViewOptionsData1,
          filterBy: undefined,
          isExpandedView: true,
          limited: false,
          orderBy: undefined,
          title: "Contract Customers"
        });
  
        if (expandedView instanceof RelatedWorkspacesTableView) {
          resultsRegion.once("show",function(){
          });
          expandedView.paginationRegion.once("show",function(){
            var prerequisites = {
                "add-menu": function() { return expandedView.$el.find('.csui-addToolbar .icon-toolbarAdd').length; },
                "header-title": function() { return expandedView.tableToolbarView.$el.find(".csui-toolbar-caption .csui-item-title-name h2").length; },
                "header-checkbox": function() { return expandedView.tableView.$el.find("thead .csui-table-cell-_select .csui-checkbox").length; },
                "header-toggle": function() { return expandedView._tableRowSelectionToolbarView.$el.find(".csui-condensed-header-toggle").length; },
                "item-checkbox": function() { return expandedView.tableView.$el.find("tbody .csui-table-cell-_select .csui-checkbox").length; }
            };
            var checks = {}
            var chk;
            waitFor(function(){
                for (chk in prerequisites) {
                    if (!checks[chk]) {
                        if (prerequisites[chk]()) {
                            checks[chk] = true;
                        }
                    }
                }
                return _.size(checks)===_.size(prerequisites);
            }, 1000, "expanded view to render completely").then(deferred.resolve,function(error){
                var missing = _.reduce(prerequisites,function(m,v,i){checks[i]||m.push(i);return m;},[]);
                deferred.reject(new Error(error.message+" Missing elements: "+missing.join(", ")+"."));
            });
          });
          resultsRegion.show(expandedView);
        } else {
          deferred.reject(new Error("expanded view not created"));
        }
        
        return deferred.promise();
    }

    function teardown() {
        resultsRegion.destroy();
        regionEl.remove();
        $('body').empty();
    }
    

    beforeAll(function (done) {

      $.mockjax.clear(); // to be sure, no mock data relict from previous test spec can affect our tests 
      MockData.enable();
      done();
    });

    afterAll(function (done) {

      MockData.disable();
      done();
    });

    describe('CommonCheck', function () {

      beforeAll(function (done) {
  
        testsetup().then(done,done.fail);

      });
  
      afterAll(function (done) {
  
        teardown();
        done();
      });
  
      it('can be created', function (done) {
        expect(expandedView instanceof RelatedWorkspacesTableView).toBeTruthy();
        done();
      });
  
      it('add menu available', function (done) {
        addCommandElement = expandedView.$el.find('.csui-addToolbar .icon-toolbarAdd');
        expect(addCommandElement.length).toEqual(1,"add menu availability");
        addCommandElement = expandedView.$el.find('.csui-addToolbar [data-csui-command="addrelation"]');
        expect(addCommandElement.length).toEqual(1,"add relation command availability");
        addCommandElement = expandedView.$el.find('.csui-addToolbar [data-csui-command="addrelation"] .icon-toolbarAdd');
        expect(addCommandElement.length).toEqual(1,"add menu is the add relation command");
        done();
      });

    });

    describe("ItemSelect",function(){

        beforeAll(function (done) {
  
            testsetup().then(done,done.fail);
    
        });
    
        afterAll(function (done) {
    
            teardown();
            done();
        });

        it('check before select item', function (done) {

            checkboxElements = expandedView.tableView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "header check box");
    
            checkboxElements = expandedView.tableView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "item check box");
    
            tableHeaderToolbarElement = expandedView.$el.find(".conws-table-tabletoolbar")
            expect(tableHeaderToolbarElement.height()).toEqual(64,"table header toolbar height");
            rowSelectionToolbarElement = expandedView.$el.find(".conws-table-rowselection-toolbar");
            expect(rowSelectionToolbarElement.height()).toEqual(0,"row selection toolbar height");
    
            headerTitleElement = expandedView.tableToolbarView.$el.find(".csui-toolbar-caption .csui-item-title-name h2");
            expect(headerTitleElement.text().trim()).toEqual("Contract Customers", "header title text");
    
            done();
        });
    
        it('select item', function (done) {
            checkboxElements = expandedView.tableView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            $(checkboxElements[0]).trigger('click');
            waitFor(function () {
              var headerHeight = expandedView.$el.find(".conws-table-tabletoolbar").height();
              var toolbarHeight = expandedView.$el.find(".conws-table-rowselection-toolbar").height();
              return headerHeight === 0 && toolbarHeight === 48;
            }, 1000, "header to disappear toolbar to appear").then(done, done.fail);
        });
    
        it('check after select item before show header', function (done) {
    
            checkboxElements = expandedView.tableView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("mixed", "header check box");
    
            checkboxElements = expandedView.tableView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("true", "item check box");
    
            tableHeaderToolbarElement = expandedView.$el.find(".conws-table-tabletoolbar")
            expect(tableHeaderToolbarElement.height()).toEqual(0,"table header toolbar height");
            rowSelectionToolbarElement = expandedView.$el.find(".conws-table-rowselection-toolbar");
            expect(rowSelectionToolbarElement.height()).toEqual(48,"row selection toolbar height");
    
            selectedCounterRegion = expandedView._tableRowSelectionToolbarView.$el.find(".csui-selected-counter-region");
            expect($(selectedCounterRegion[0]).text().trim()).toEqual("Selected1", "selection counter text");
    
            testCommandElement = expandedView._tableRowSelectionToolbarView.$el.find('[data-csui-command="removerelation"]');
            expect($(testCommandElement[0]).text().trim()).toEqual("Remove relationships", "test command text");
    
            done();
        });
    
        it('show header', function (done) {
            var toggleHeaderElement = expandedView._tableRowSelectionToolbarView.$el.find(".csui-condensed-header-toggle");
            $(toggleHeaderElement[0]).trigger('click');
            waitFor(function () {
              var headerHeight = expandedView.$el.find(".conws-table-tabletoolbar").height();
              var toolbarHeight = expandedView.$el.find(".conws-table-rowselection-toolbar").height();
              return headerHeight === 64 && toolbarHeight >= 48;
            }, 1000, "header to reappear toolbar to stay visible").then(done, done.fail);
        });
    
        it('check after show header before deselect item', function (done) {
    
            checkboxElements = expandedView.tableView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("mixed", "header check box");
    
            checkboxElements = expandedView.tableView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("true", "item check box");
    
            tableHeaderToolbarElement = expandedView.$el.find(".conws-table-tabletoolbar")
            expect(tableHeaderToolbarElement.height()).toEqual(64,"table header toolbar height");
            rowSelectionToolbarElement = expandedView.$el.find(".conws-table-rowselection-toolbar");
            expect(rowSelectionToolbarElement.height()).toBeGreaterThanOrEqual(48,"row selection toolbar height");
    
            headerTitleElement = expandedView.tableToolbarView.$el.find(".csui-toolbar-caption .csui-item-title-name h2");
            expect(headerTitleElement.text().trim()).toEqual("Contract Customers", "header title text");
    
            selectedCounterRegion = expandedView._tableRowSelectionToolbarView.$el.find(".csui-selected-counter-region");
            expect($(selectedCounterRegion[0]).text().trim()).toEqual("Selected1", "selection counter text");
    
            testCommandElement = expandedView._tableRowSelectionToolbarView.$el.find('[data-csui-command="removerelation"]');
            expect($(testCommandElement[0]).text().trim()).toEqual("Remove relationships", "test command text");
    
            done();
        });
    
        it('deselect item', function (done) {
            checkboxElements = expandedView.tableView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            $(checkboxElements[0]).trigger('click');
            waitFor(function () {
              var headerHeight = expandedView.$el.find(".conws-table-tabletoolbar").height();
              var toolbarHeight = expandedView.$el.find(".conws-table-rowselection-toolbar").height();
              return headerHeight === 64 && toolbarHeight === 0;
            }, 1000, "header to stay visible toolbar to disappear").then(done, done.fail);
        });
    
        it('check after deselect item', function (done) {
    
            checkboxElements = expandedView.tableView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "header check box");
    
            checkboxElements = expandedView.tableView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "item check box");
    
            tableHeaderToolbarElement = expandedView.$el.find(".conws-table-tabletoolbar")
            expect(tableHeaderToolbarElement.height()).toEqual(64,"table header toolbar height");
            rowSelectionToolbarElement = expandedView.$el.find(".conws-table-rowselection-toolbar");
            expect(rowSelectionToolbarElement.height()).toEqual(0,"row selection toolbar height");
    
            headerTitleElement = expandedView.tableToolbarView.$el.find(".csui-toolbar-caption .csui-item-title-name h2");
            expect(headerTitleElement.text().trim()).toEqual("Contract Customers", "header title text");
    
            done();
        });
        
        
    });

    describe("PageSelect",function(){
        
        beforeAll(function (done) {
  
            testsetup().then(done,done.fail);
    
        });
      
        afterAll(function (done) {
      
            teardown();
            done();
        });

        it('check before preselect item', function (done) {

            checkboxElements = expandedView.tableView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "header check box");
    
            checkboxElements = expandedView.tableView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "item check box");
    
            tableHeaderToolbarElement = expandedView.$el.find(".conws-table-tabletoolbar")
            expect(tableHeaderToolbarElement.height()).toEqual(64,"table header toolbar height");
            rowSelectionToolbarElement = expandedView.$el.find(".conws-table-rowselection-toolbar");
            expect(rowSelectionToolbarElement.height()).toEqual(0,"row selection toolbar height");
    
            headerTitleElement = expandedView.tableToolbarView.$el.find(".csui-toolbar-caption .csui-item-title-name h2");
            expect(headerTitleElement.text().trim()).toEqual("Contract Customers", "header title text");
    
            done();
        });
    
        it('preselect item', function (done) {
            checkboxElements = expandedView.tableView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            $(checkboxElements[0]).trigger('click');
            waitFor(function () {
              var headerHeight = expandedView.$el.find(".conws-table-tabletoolbar").height();
              var toolbarHeight = expandedView.$el.find(".conws-table-rowselection-toolbar").height();
              return headerHeight === 0 && toolbarHeight === 48;
            }, 1000, "header to disappear toolbar to appear").then(done, done.fail);
        });
    
        it('check after preselect item before select page', function (done) {

            checkboxElements = expandedView.tableView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("mixed", "header check box");
    
            checkboxElements = expandedView.tableView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("true", "item check box");
    
            tableHeaderToolbarElement = expandedView.$el.find(".conws-table-tabletoolbar")
            expect(tableHeaderToolbarElement.height()).toEqual(0,"table header toolbar height");
            rowSelectionToolbarElement = expandedView.$el.find(".conws-table-rowselection-toolbar");
            expect(rowSelectionToolbarElement.height()).toEqual(48,"row selection toolbar height");
    
            selectedCounterRegion = expandedView._tableRowSelectionToolbarView.$el.find(".csui-selected-counter-region");
            expect($(selectedCounterRegion[0]).text().trim()).toEqual("Selected1", "selection counter text");
    
            testCommandElement = expandedView._tableRowSelectionToolbarView.$el.find('[data-csui-command="removerelation"]');
            expect($(testCommandElement[0]).text().trim()).toEqual("Remove relationships", "test command text");
    
            done();
        });
    
        it('select page', function (done) {
            checkboxElements = expandedView.tableView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            $(checkboxElements[0]).trigger('click');
            waitFor(function () {
              var headerHeight = expandedView.$el.find(".conws-table-tabletoolbar").height();
              var toolbarHeight = expandedView.$el.find(".conws-table-rowselection-toolbar").height();
              return headerHeight === 0 && toolbarHeight === 48;
            }, 1000, "header to disappear toolbar to appear").then(done, done.fail);
        });
    
        it('check after select page before deselect page', function (done) {
    
            checkboxElements = expandedView.tableView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("true", "header check box");
    
            checkboxElements = expandedView.tableView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("true", "item check box");
    
            tableHeaderToolbarElement = expandedView.$el.find(".conws-table-tabletoolbar")
            expect(tableHeaderToolbarElement.height()).toEqual(0,"table header toolbar height");
            rowSelectionToolbarElement = expandedView.$el.find(".conws-table-rowselection-toolbar");
            expect(rowSelectionToolbarElement.height()).toEqual(48,"row selection toolbar height");
    
            selectedCounterRegion = expandedView._tableRowSelectionToolbarView.$el.find(".csui-selected-counter-region");
            expect($(selectedCounterRegion[0]).text().trim()).toEqual("Selected30", "selection counter text");
    
            testCommandElement = expandedView._tableRowSelectionToolbarView.$el.find('[data-csui-command="removerelation"]');
            expect($(testCommandElement[0]).text().trim()).toEqual("Remove relationships", "test command text");
    
            done();
          });
    
        it('deselect page', function (done) {
            checkboxElements = expandedView.tableView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            $(checkboxElements[0]).trigger('click');
            waitFor(function () {
              var headerHeight = expandedView.$el.find(".conws-table-tabletoolbar").height();
              var toolbarHeight = expandedView.$el.find(".conws-table-rowselection-toolbar").height();
              return headerHeight === 64 && toolbarHeight === 0;
            }, 1000, "header to stay visible toolbar to disappear").then(done, done.fail);
        });
    
        it('check after deselect page', function (done) {
    
            checkboxElements = expandedView.tableView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "header check box");
    
            checkboxElements = expandedView.tableView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "item check box");
    
            tableHeaderToolbarElement = expandedView.$el.find(".conws-table-tabletoolbar")
            expect(tableHeaderToolbarElement.height()).toEqual(64,"table header toolbar height");
            rowSelectionToolbarElement = expandedView.$el.find(".conws-table-rowselection-toolbar");
            expect(rowSelectionToolbarElement.height()).toEqual(0,"row selection toolbar height");
    
            headerTitleElement = expandedView.tableToolbarView.$el.find(".csui-toolbar-caption .csui-item-title-name h2");
            expect(headerTitleElement.text().trim()).toEqual("Contract Customers", "header title text");
    
            done();
        });
    
    });

    describe("AddItem",function(){

      beforeAll(function (done) {
  
        testsetup().then(done,done.fail);

      });
  
      afterAll(function (done) {
  
        teardown();
        done();
      });

      it("adding an item",function(){
        var node = new WorkspaceModel(MockData.addItem1Attributes,{connector: collection.connector, parse: true});
        var rel_source = node.get("rel_source");
        var rel_target = node.get("id");
        var rel_type = node.get("rel_type");
        var href = _.str.sformat("/api/v2/businessworkspaces/{0}/relateditems/{1}?rel_type={2}", rel_source, rel_target, rel_type);
        var del_action = new ActionModel({
          body: "",
          content_type: "",
          form_href: "",
          href: href,
          method: "DELETE",
          name: "Remove related item",
          signature: "deleterelateditem"
        },{
          connector: node.connector
        });
        node.actions.add(del_action);
        var toolbarActionContext = {
          "commandSignature": "AddRelation",
          "newNodes": [ node ],
          "status": {}
        };
        expect(collection.models.length).toEqual(collection.topCount,"collection contains one page");
        expandedView.commandController.trigger('after:execute:command', toolbarActionContext);
        var newItemElement = expandedView.$el.find(".csui-nodetable table tr.csui-new-item:not(.csui-details-row)");
        expect(newItemElement.length).toEqual(1,"new element exists");
        var backgroundColor = newItemElement.css("background-color");
        expect(backgroundColor).toEqual("rgb(231, 240, 217)","added row is green");
        expect(collection.models.length).toEqual(collection.topCount,"collection does not grow");
      });
    });
  
    
  });

});
