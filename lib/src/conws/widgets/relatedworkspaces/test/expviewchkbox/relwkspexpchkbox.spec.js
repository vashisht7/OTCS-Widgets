/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'conws/utils/test/testutil',
  'conws/widgets/relatedworkspaces/impl/relatedworkspacestable.view',
  'conws/widgets/relatedworkspaces/impl/relatedworkspaces.factory',
  './relwkspexpchkbox.mock.js'
], function (_, $, Marionette, PageContext, TestUtil,
  RelatedWorkspacesTableView,
  RelatedWorkspacesCollectionFactory,
  MockData
) {

  describe('RelWkspExpViewCheckBoxTest', function () {

    function waitFor(check, timeout, message) {
      return TestUtil.waitFor(check,message,timeout);
    }

    var checkboxElements;

    var regionEl;
    var resultsRegion;
    var pageContext;
    var collection;
    var expandedView;

    function testsetup(page) {

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
                id: 98015,
                type: 848
              }
            }
          }
        });

        if (page===1) {
          collection =  pageContext.getCollection(RelatedWorkspacesCollectionFactory, MockData.collectionOptions1);
        } else if (page===2) {
          collection =  pageContext.getCollection(RelatedWorkspacesCollectionFactory, MockData.collectionOptions2);
        } else {
          throw new Error(_.str.sformat("Unsupported test page {0}.",page));
        }


        expandedView = new RelatedWorkspacesTableView({
          collection: collection,
          context: pageContext,
          data: MockData.expandedViewOptionsData,
          filterBy: undefined,
          isExpandedView: true,
          limited: false,
          orderBy: undefined,
          title: "Related Contacts"
        });
  
        if (expandedView instanceof RelatedWorkspacesTableView) {
          resultsRegion.once("show",function(){
          });
          expandedView.paginationRegion.once("show",function(){
            var prerequisites = {
                "add-menu": function() { return expandedView.$el.find('.csui-addToolbar .icon-toolbarAdd').length; },
                "header-title": function() { return expandedView.tableToolbarView.$el.find(".csui-toolbar-caption .csui-item-title-name h2").length; },
                "header-checkbox": function() { return expandedView.tableView.$el.find("thead .csui-table-cell-_select .csui-checkbox").length; },
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

    describe('MixedSelect Page 1', function () {

      beforeAll(function (done) {
  
        testsetup(1).then(done,done.fail);

      });
  
      afterAll(function (done) {
  
        teardown();
        done();
      });
  
      it('page 1 displays mixed checkboxes', function (done) {
        checkboxElements = expandedView.tableView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
        expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "header check box");

        checkboxElements = expandedView.tableView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
        expect($(checkboxElements[0]).attr("disabled")).toEqual("disabled","item check box 0");
        expect($(checkboxElements[1]).attr("disabled")).toBeUndefined("item check box 1");
        expect($(checkboxElements[2]).attr("disabled")).toEqual("disabled","item check box 2");
        expect($(checkboxElements[3]).attr("disabled")).toBeUndefined("item check box 3");
        expect($(checkboxElements[4]).attr("disabled")).toEqual("disabled","item check box 4");
        expect($(checkboxElements[5]).attr("disabled")).toBeUndefined("item check box 5");
        expect($(checkboxElements[6]).attr("disabled")).toEqual("disabled","item check box 6");
        expect($(checkboxElements[7]).attr("disabled")).toEqual("disabled","item check box 7");
        expect($(checkboxElements[8]).attr("disabled")).toBeUndefined("item check box 8");
        expect($(checkboxElements[9]).attr("disabled")).toBeUndefined("item check box 9");
        expect($(checkboxElements[10]).attr("disabled")).toBeUndefined("item check box 10");
        expect($(checkboxElements[11]).attr("disabled")).toEqual("disabled","item check box 11");
        expect($(checkboxElements[12]).attr("disabled")).toEqual("disabled","item check box 12");
        expect($(checkboxElements[13]).attr("disabled")).toEqual("disabled","item check box 13");
        expect($(checkboxElements[14]).attr("disabled")).toBeUndefined("item check box 14");
        expect($(checkboxElements[15]).attr("disabled")).toBeUndefined("item check box 15");
        expect($(checkboxElements[16]).attr("disabled")).toEqual("disabled","item check box 16");
        expect($(checkboxElements[17]).attr("disabled")).toEqual("disabled","item check box 17");
        expect($(checkboxElements[18]).attr("disabled")).toBeUndefined("item check box 18");
        expect($(checkboxElements[19]).attr("disabled")).toBeUndefined("item check box 19");
        expect($(checkboxElements[20]).attr("disabled")).toBeUndefined("item check box 20");
        expect($(checkboxElements[21]).attr("disabled")).toEqual("disabled","item check box 21");
        expect($(checkboxElements[22]).attr("disabled")).toBeUndefined("item check box 22");
        expect($(checkboxElements[23]).attr("disabled")).toBeUndefined("item check box 23");
        expect($(checkboxElements[24]).attr("disabled")).toEqual("disabled","item check box 24");
        expect($(checkboxElements[25]).attr("disabled")).toBeUndefined("item check box 25");
        expect($(checkboxElements[26]).attr("disabled")).toEqual("disabled","item check box 26");
        expect($(checkboxElements[27]).attr("disabled")).toBeUndefined("item check box 27");
        expect($(checkboxElements[28]).attr("disabled")).toBeUndefined("item check box 28");
        expect($(checkboxElements[29]).attr("disabled")).toEqual("disabled","item check box 30");

        done();
      });
  
    });

    describe('NoSelect Page 2', function () {

      beforeAll(function (done) {
  
        testsetup(2).then(done,done.fail);

      });
  
      afterAll(function (done) {
  
        teardown();
        done();
      });
  
      it('navigate to page 2', function (done) {
        collection.setLimit(30,30,false);
        collection.fetch().then(done,done.fail);
      });

      it('page 2 displays no checkboxes', function (done) {
        checkboxElements = expandedView.tableView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
        expect(checkboxElements.length).toEqual(0, "header check box count");

        checkboxElements = expandedView.tableView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
        expect(checkboxElements.length).toEqual(0, "item check box count");

        done();
      });

    });
    
  });

});
