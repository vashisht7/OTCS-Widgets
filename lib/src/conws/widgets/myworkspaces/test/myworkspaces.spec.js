/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore',
  'csui/utils/contexts/page/page.context',
  'csui/lib/marionette',
  'csui/utils/log',
  'conws/utils/test/testutil',
  'conws/utils/workspaces/impl/workspaceutil',
  'conws/widgets/myworkspaces/myworkspaces.view',
  'conws/widgets/myworkspaces/impl/myworkspacestable.view',
  'conws/widgets/myworkspaces/impl/myworkspaces.model',
  'conws/widgets/myworkspaces/test/myworkspaces.mock.data.manager',
  'i18n!conws/widgets/myworkspaces/impl/nls/lang'
], function ($, _, PageContext, Marionette, log,
    TestUtil,
    workspaceUtil,
    MyWorkspacesView,
    MyWorkspacesTableView,
    MyWorkspacesCollection,
    DataManager,
    lang) {

  var selectorViewItems                    = '.binf-list-group-item',
      selectorExpand                       = '.tile-expand',
      selectorExpandHidden                 = selectorExpand + '.hidden',
      selectorWorkspaceIcon                = '.conws-mime_workspace',
      selectorUIIcon                       = '.csui-icon',
      selectorDefaultContainerIcon         = selectorUIIcon + selectorWorkspaceIcon,
      selectorTitle                        = '.tile-title',
      selectorListItemTitle                = '.list-item-title',
      selectorTitleIcon                    = ".tile-type-image",
      selectorDefaultTitleIcon             = ".conws-workspacestitleicondefault.conws-mime_workspace",

      selectorExpandedView                 = '.conws-workspacestable',
      selectorExpandedViewItems            = 'tr.csui-saved-item',
      selectorExpandedViewItem             = '.datatable',
      selectorExpandedViewNoItemMsg        = '.csui-table-empty',
      selectorExpandedTotalItems           = '.csui-total-container-items',
      selectorExpandedPaginationPages      = 'data-pageid',
      selectorExpandedTitle                = selectorTitle + '.binf-modal-title',
      selectorExpandedTableToolBar         = '.csui-tabletoolbar',
      selectorExpandedNodeTable            = '#tableview',
      selectorExpandedPagination           = '#paginationview',
      expandedExpandedTableHead            = 'thead',
      selectorExpandedDefaultContainerIcon = selectorUIIcon + selectorWorkspaceIcon,
      selectorExpandedTableItemContainer   = selectorExpandedViewItems,
      selectorExpandedViewCellName         = '.csui-table-cell-name-value',
      selectorModalView                    = '.binf-modal-content',
      selectorTitleIconExpandedDefault     = selectorTitleIcon + selectorDefaultTitleIcon,

      firstId                              = 1,
      pageSize                             = 30;
  function toBeContainedFnBuilder(builderTypeStr) {
    return function toBeContained(exp) {
      if ($.inArray(this.actual, exp) > -1) {
        return exp + " not contained in " + this.actual;
      }
    }
  }

  function toBeContained2(util, customEqualityTesters) {
    return {
      compare: function(act,exp) {
        var passed = ($.inArray(act, exp) > -1);
        return {
          pass: passed,
          message: exp + " not contained in " + act
        };
      }
    };
  }

  function waitAsync(done,functions, timeout, waitForError) {
    var dataFetched, dataFetchedError;
    TestUtil.run(done,function () {
      $.when.apply($, functions).done(
          function () {
            dataFetched = true;
          }).fail(function () {
            dataFetchedError = true;
            log.error("Deferred object is rejected!") && console.log(log.last);
          }
      )
    });

    if (waitForError) {
      TestUtil.waitFor(done,function () {
        return dataFetchedError;
      }, 'Data fetch timed out 1', timeout || 100);
    } else {
      TestUtil.waitFor(done,function () {
        return dataFetched;
      }, 'Data fetch timed out 2', timeout || 100);
    }
  }

  xdescribe('MyWorkspacesView', function () {

    var width;

    var context,
        title           = "Insurance",
        workspaceTypeId = 1;

    function prepareCollapsedView(done,totalCount) {
      var view = new MyWorkspacesView({
        context: context,
        data: {
          workspaceTypeId: workspaceTypeId,
          title: title
        }
      });

      $.mockjax.clear();
      DataManager.test(totalCount, title, workspaceTypeId, false);
      view.render();
      view.completeCollection.connector = context.options.factories.connector;
      waitAsync(done,[view.completeCollection.fetch()]);
      return view;
    }

    afterEach(function(){
      $("body").css('width', width);
    });

    beforeEach(function () {
      width = $("body").css('width');
      $("body").css('width', '1920px');
      context = new PageContext({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            },
            assignTo: function (model) {
              if (model.connector) {
                if (model.connector === this) {
                  return;
                }
              }
              model.connector = this;
            }
          }
        }
      });
      jasmine.addMatchers({toBeContained: toBeContained2});
    });

    describe('can be instantiated', function () {

      var myWorkspacesViewNoConfig,
          myWorkspacesViewMinConfig,
          myWorkspacesNoIcon,
          myWorkspacesViewMaxConfig,
          allViews;

      beforeEach(function () {
        myWorkspacesViewNoConfig = new MyWorkspacesView({
          context: context
        });
        myWorkspacesViewMinConfig = new MyWorkspacesView({
          context: context,
          data: {
            workspaceTypeId: 0,
            title: "Insurance"
          }
        });
        myWorkspacesNoIcon = new MyWorkspacesView({
          context: context,
          data: {
            workspaceTypeId: 1,
            title: "Insurance"
          }
        });
        myWorkspacesViewMaxConfig = new MyWorkspacesView({
          context: context,
          data: {
            workspaceTypeId: 2,
            title: "Insurance",
            orderBy: {
              sortColumn: "{name}",
              sortOrder: "desc"
            }
          }
        });
        allViews = [myWorkspacesViewNoConfig, myWorkspacesViewMinConfig, myWorkspacesNoIcon,
          myWorkspacesViewMaxConfig];
      });

      it('not without context', function () {
        expect(function () {
          MyWorkspacesView()
        }).toThrow(new Error('Context required to create WorkspacesView'));
      });

      it('without configuration', function () {
        expect(myWorkspacesViewNoConfig instanceof MyWorkspacesView).toBeTruthy();
        expect(myWorkspacesViewNoConfig.completeCollection instanceof
               MyWorkspacesCollection).toBeTruthy();

        expect(myWorkspacesViewNoConfig).toBeDefined();
        expect(myWorkspacesViewNoConfig.$el.length > 0).toBeTruthy();
        expect(myWorkspacesViewNoConfig.el.childNodes.length === 0).toBeTruthy();
      });

      it('with minimum configuration', function () {
        expect(myWorkspacesViewMinConfig instanceof MyWorkspacesView).toBeTruthy();
        expect(myWorkspacesViewMinConfig.options.data.pageSize).toEqual(pageSize);
        expect(myWorkspacesViewMinConfig.options.filterValue).toEqual("");
        expect(myWorkspacesViewMinConfig.options.data.title).toEqual("Insurance");
        expect(myWorkspacesViewMinConfig.options.data.workspaceTypeId).toEqual(0);
      });

      it('with no icon', function () {
        expect(myWorkspacesNoIcon instanceof MyWorkspacesView).toBeTruthy();
        expect(myWorkspacesNoIcon.options.data.pageSize).toEqual(pageSize);
        expect(myWorkspacesNoIcon.options.filterValue).toEqual("");
        expect(myWorkspacesNoIcon.options.data.title).toEqual("Insurance");
      });

      it('with complete configuration', function () {
        expect(myWorkspacesViewMaxConfig instanceof MyWorkspacesView).toBeTruthy();
        expect(myWorkspacesViewMaxConfig.options.data.pageSize).toEqual(pageSize);
        expect(myWorkspacesViewMaxConfig.options.filterValue).toEqual("");
        expect(myWorkspacesViewMaxConfig.options.data.title).toEqual("Insurance");
        expect(
            workspaceUtil.orderByAsString(myWorkspacesViewMaxConfig.options.data.orderBy)).toEqual(
            "name desc");

        expect(myWorkspacesViewMaxConfig).toBeDefined();
        expect(myWorkspacesViewMaxConfig.$el.length > 0).toBeTruthy();
        expect(myWorkspacesViewMaxConfig.el.childNodes.length === 0).toBeTruthy();
      });

      it("and rendered", function () {
        allViews.forEach(function (view) {
          expect(view).toBeDefined();
          expect(view.$el.length > 0).toBeTruthy();
          expect(view.el.childNodes.length === 0).toBeTruthy();
          view.render();
          expect(view.$el.length > 0).toBeTruthy();
          expect(view.el.childNodes.length > 0).toBeTruthy();
        })
      });

    });

    describe("in collapsed state", function () {

      var fetchSpy = function (view) {
        spyOn(view.completeCollection, "fetch").and.callThrough();
      };

      function scrollDown(done, view, fetchSpiedON) {

        var callCount = 0;
        if (fetchSpiedON) {
          callCount = 1;
        } else {
          fetchSpy(view);
        }
        view._behaviors.every(function (behavior) {
          if (typeof behavior._checkScrollPosition !== "undefined") {
            behavior._content = behavior._contentParent.find(".binf-list-group");
            spyOn(behavior._contentParent, "scrollTop").and.returnValue(300);
            behavior._checkScrollPosition();
            return false;
          }
          return true;
        });
        TestUtil.waitFor(done,function () {
          if (view.completeCollection.fetch.calls.count() > callCount &&
              !view.completeCollection.fetching) {
            return true;
          }
        }, 'Data fetch timed out 3', 100);
      }

      function setFilterName(done, view, fetchSpiedON) {

        var callCount = 0;
        if (fetchSpiedON) {
          callCount = 1;
        } else {
          fetchSpy(view);
        }
        view.ui.searchInput.val("filter");
        view.filterChanged();
        TestUtil.waitFor(done,function () {
          return view.completeCollection.fetch.calls.count() > callCount &&
                 view.completeCollection.length > 0;
        }, 'view.completeCollection.fetch.calls.count() > callCount &&' +
           ' view.completeCollection.length > 0: ' + view.completeCollection.fetch.calls.count() +
           ' > ' + callCount + ' && ' + view.completeCollection.length + ' > 0 ', 1500);
      }

      describe("provide header with", function () {

        var viewIcon, viewDefault;

        beforeEach(function (done) {
          viewIcon = new MyWorkspacesView({
            context: context,
            data: {
              workspaceTypeId: workspaceTypeId,
              title: title
            }
          });
          viewDefault = new MyWorkspacesView({
            context: context,
            data: {
              workspaceTypeId: 3
            }
          });

          $.mockjax.clear();
          DataManager.test(1, title, workspaceTypeId, false);
          DataManager.test(1, title, 3, false);
          viewIcon.render();
          viewDefault.render();
          waitAsync(done,[viewIcon.completeCollection.fetch(), viewDefault.completeCollection.fetch()]);
        });

        it("icon returned from server", function () {
          expect($(viewIcon.$(selectorTitleIcon).find("img")[0]).attr("src")).toContain(
              "data:image/svg+xml;base64,PD94bW");
        });

        it("default icon", function () {
          expect(viewDefault.$(selectorTitleIcon).length).toEqual(1);
          expect($(viewDefault.$(selectorTitleIcon).find("img")[0]).attr("src")).toEqual(
              "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==");
          expect(viewDefault.$(selectorDefaultTitleIcon).length).toEqual(1);
        });

        it("title", function () {
          expect(viewIcon.$(selectorTitle).children().text()).toContain(title);
        });

        it("default title", function () {
          expect(viewDefault.$(selectorTitle).children().text()).toContain(lang.dialogTitle);
        });

        it("filter", function () {
          var filter = viewDefault.$('.search-box');
          expect(filter.length).toEqual(1);
          var expectPlaceHolder = lang.searchPlaceholder.replace("%1", lang.dialogTitle);
          expect(filter.children().attr('placeholder')).toEqual(expectPlaceHolder);
        });

      });

      describe("show", function () {

        var view;

        it("empty view for 0 workspaces", function (done) {

          view = prepareCollapsedView(done,0);
          TestUtil.run(done,function () {
            expect(view.completeCollection.length).toEqual(0);
            var emptyDiv = view.$('.cs-emptylist-text');
            expect(emptyDiv.length).toEqual(1);
            expect(emptyDiv.text()).toEqual(lang.noResultsPlaceholder);
            expect(view.$(selectorExpand).length).toEqual(1);
            expect(view.$(selectorExpandHidden).length).toEqual(0);
          });
        });

        it("custom empty view for 0 workspaces", function (done) {

          view = new MyWorkspacesView({
            context: context,
            data: {
              workspaceTypeId: workspaceTypeId,
              title: title,
              "collapsedView": {
                "noResultsPlaceholder": "blub"
              }
            }
          });

          $.mockjax.clear();
          DataManager.test(0, title, workspaceTypeId, false);
          view.render();
          view.completeCollection.connector = context.options.factories.connector;
          waitAsync(done,[view.completeCollection.fetch()]);
          TestUtil.run(done,function () {
            expect(view.completeCollection.length).toEqual(0);
            var emptyDiv = view.$('.cs-emptylist-text');
            expect(emptyDiv.length).toEqual(1);
            expect(emptyDiv.text()).toEqual("blub");
          });
        });

        it("view for 1 workspace", function (done) {
          view = prepareCollapsedView(done,1);
          TestUtil.run(done,function () {
            expect(view.completeCollection.length).toEqual(1);
            expect(view.$(selectorViewItems).length).toEqual(1);
            expect(view.$(selectorExpand).length).toEqual(1);
            expect(view.$(selectorExpandHidden).length).toEqual(0);
          });
        });

        it("view for " + pageSize + " workspaces", function (done) {
          view = prepareCollapsedView(done,pageSize);
          TestUtil.run(done,function () {
            expect(view.completeCollection.length).toEqual(pageSize);
            expect(view.$(selectorViewItems).length).toEqual(pageSize);
            expect(view.$(selectorExpand).length).toEqual(1);
            expect(view.$(selectorExpandHidden).length).toEqual(0);
          });
        });

        it("icons for workspaces", function (done) {
          view = prepareCollapsedView(done,10);
          TestUtil.run(done,function () {
            expect(view.$(selectorDefaultContainerIcon).length).toEqual(10);
          });
        });
      });

      describe("ignore workspaces order", function () {

        var viewAsc, viewDesc;

        beforeEach(function (done) {
          viewAsc = new MyWorkspacesView({
            context: context,
            data: {
              workspaceTypeId: workspaceTypeId,
              title: title
            }
          });
          viewDesc = new MyWorkspacesView({
            context: context,
            data: {
              workspaceTypeId: workspaceTypeId,
              title: title,
              orderBy: {
                sortColumn: "{name}",
                sortOrder: "desc"
              }
            }
          });

          $.mockjax.clear();
          DataManager.test(5, title, workspaceTypeId, false);
          viewAsc.render();
          viewDesc.render();
          waitAsync(done,[viewAsc.completeCollection.fetch(), viewDesc.completeCollection.fetch()]);
        });

        it("by name asc", function () {
          expect(viewAsc.completeCollection.length).toEqual(5);
          expect(viewAsc.completeCollection.models[0].get('name')).toEqual(title + firstId);
          expect(viewAsc.completeCollection.models[4].get('name')).toEqual(title + (4 + firstId));
          var element = viewAsc.$(selectorViewItems);
          expect(element.length).toEqual(5);
          expect($(element[0]).find(selectorListItemTitle)[0].innerHTML.trim()).toEqual(
              title + firstId);
          expect($(element[4]).find(selectorListItemTitle)[0].innerHTML.trim()).toEqual(title +
                                                                                        (4 +
                                                                                        firstId));
        });

        it("by name desc", function () {
          expect(viewDesc.completeCollection.length).toEqual(5);
          expect(viewDesc.completeCollection.models[0].get('name')).toEqual(title + firstId);
          expect(viewDesc.completeCollection.models[4].get('name')).toEqual(title + (4 + firstId));
          var element = viewDesc.$(selectorViewItems);
          expect(element.length).toEqual(5);
          expect($(element[0]).find(selectorListItemTitle)[0].innerHTML.trim()).toEqual(
              title + firstId);
          expect($(element[4]).find(selectorListItemTitle)[0].innerHTML.trim()).toEqual(title +
                                                                                        (4 +
                                                                                        firstId));
        });
      });

      describe("default action", function () {

        var view;

        beforeEach(function (done) {
          view = prepareCollapsedView(done,1);
        });

        it("is called at onClick", function () {
          var workspace           = view.$(selectorListItemTitle),
              defaultActionCalled = false;
          expect(workspace.length).toEqual(1);
          view.listenTo(view, 'execute:defaultAction', function () {
            defaultActionCalled = true;
          });
          expect(defaultActionCalled).toBeFalsy();
          workspace.click();
          expect(defaultActionCalled).toBeTruthy();
        });
      });

      describe("scrolling", function () {

        var view;

        beforeEach(function (done) {
          view = prepareCollapsedView(done,100);
          view.$el.appendTo('body');

          TestUtil.run(done,function (done) {
            expect(view.completeCollection.length).toEqual(pageSize);
            expect(view.$(selectorViewItems).length).toEqual(pageSize);

            spyOn(view, "_resetInfiniteScrolling").and.callThrough();
            scrollDown(done,view);
          });
        });

        afterEach(function(){
          if (view && view.$el) {
            view.$el.remove();
          }
        });

        it("fetches next workspaces", function () {
          expect(view.completeCollection.length).toEqual(pageSize * 2,"model pageSize * 2");
          expect(view.$(selectorViewItems).length).toEqual(pageSize * 2,"html pageSize * 2");
        });

        it("works together with filtering", function (done) {
          expect(view._resetInfiniteScrolling.calls.count()).toEqual(0);
          expect(view.completeCollection.length).toEqual(pageSize * 2);
          expect(view.$(selectorViewItems).length).toEqual(pageSize * 2);

          setFilterName(done,view, true);

          TestUtil.run(done,function () {
            expect(view._resetInfiniteScrolling.calls.count()).toEqual(1);
            expect(view.completeCollection.length).toEqual(pageSize);
            expect(view.completeCollection.models[0].get('name')).toEqual(title + 'filter' +
                                                                          firstId);
            expect(view.$(selectorViewItems).length).toEqual(pageSize);
            expect($(view.$(selectorViewItems)[0]).find(
                selectorListItemTitle)[0].innerHTML.trim()).toEqual(title +
                                                                    'filter' +
                                                                    firstId);
          });
        });
      });

      describe("filtering", function () {

        var view;

        beforeEach(function (done) {
          view = prepareCollapsedView(done,200);
          view.$el.appendTo('body');

          TestUtil.run(done,function () {
            expect(view.completeCollection.length).toEqual(pageSize);
            expect(view.completeCollection.models[0].get('name')).toEqual(title + firstId);
            expect(view.$(selectorViewItems).length).toEqual(pageSize);
            expect($(view.$(selectorViewItems)[0]).find(
                selectorListItemTitle)[0].innerHTML.trim()).toEqual(title +
                                                                    firstId);

            setFilterName(done,view);
          });
        });

        afterEach(function(){
          if (view && view.$el) {
            view.$el.remove();
          }
        });

        it("fetches proper workspaces", function () {
          expect(view.completeCollection.length).toEqual(pageSize);
          expect(view.completeCollection.models[0].get('name')).toEqual(title + 'filter' + firstId);
          expect(view.$(selectorViewItems).length).toEqual(pageSize);
          expect($(view.$(selectorViewItems)[0]).find(
              selectorListItemTitle)[0].innerHTML.trim()).toEqual(title +
                                                                  'filter' +
                                                                  firstId);
        });

        it("works together with scrolling", function (done) {
          scrollDown(done,view, true);

          TestUtil.run(done,function () {
            expect(view.completeCollection.length).toEqual(2 * pageSize);
            expect(view.completeCollection.models[2 * pageSize - 1].get('name')).toEqual(title +
                                                                                         'filter' +
                                                                                         (2 *
                                                                                          pageSize -
                                                                                          1 +
                                                                                         firstId));
            expect(view.$(selectorViewItems).length).toEqual(2 * pageSize);
            expect($(view.$(selectorViewItems)[2 * pageSize -
                                               1]).find(
                selectorListItemTitle)[0].innerHTML.trim()).toEqual(title +
                                                                    'filter' +
                                                                    (2 *
                                                                     pageSize -
                                                                     1 +
                                                                    firstId))
          });
        });
      });
    });

    describe("from collapsed to expanded state", function () {

      function getProperModal() {
        return $(selectorModalView);
      }

      function expand(done,view) {
        var element = view.$(selectorExpand);
        expect(element.length).toEqual(1);
        element.click();
        waitAsync(done,[view.completeCollection.fetch()]);
      }

      afterEach(function () {
        $('.cs-dialog.binf-modal').remove();
      });

      describe("rendered", function () {

        var view;

        beforeEach(function (done) {
          view = prepareCollapsedView(done,1);
        });

        it("modal", function (done) {
          expect($(getProperModal()).find(selectorExpandedView).length).toEqual(0);
          expand(done,view);

          TestUtil.run(done,function () {
            expect($(getProperModal()).find(selectorExpandedView).length).toEqual(1);
          });
        });

        it("without tabletoolbar", function (done) {
          var countSelectorExpandedTableToolBar = $(getProperModal()).find(
              selectorExpandedNodeTable).length;
          expand(done,view);

          TestUtil.run(done,function () {
            expect($(getProperModal()).find(selectorExpandedView).length).toBeGreaterThan(0);
            expect($(getProperModal()).find(selectorExpandedTableToolBar).length).toBeContained(
                [countSelectorExpandedTableToolBar,
                  0]);
          });
        });

        it("with nodetable", function (done) {
          expand(done,view);

          TestUtil.run(done,function () {
            expect($(getProperModal()).find(selectorExpandedView).length).toBeGreaterThan(0);
            expect($(getProperModal()).find(selectorExpandedNodeTable).length).toBeGreaterThan(0);
          });
        });

        it("with pagination", function (done) {
          expand(done,view);

          TestUtil.run(done,function () {
            expect($(getProperModal()).find(selectorExpandedView).length).toBeGreaterThan(0);
            expect($(getProperModal()).find(selectorExpandedPagination).length).toBeGreaterThan(0);
          });
        });
      });

      describe("provide header with", function () {

        it("icon returned from server", function (done) {
          var view = prepareCollapsedView(done,1);
          expect($(selectorExpandedView).length).toEqual(0);
          TestUtil.run(done,function (done) {
            expand(done,view);

            TestUtil.run(done,function () {
              expect($(getProperModal()).find(selectorTitleIcon).length).toBeGreaterThan(0);
              expect($($($(getProperModal()).find(selectorTitleIcon)[0]).find("img")[0]).attr(
                  "src")).toContain("data:image/svg+xml;base64,PD94bW");
            });
          });
        });

        it("default icon", function (done) {
          var view = new MyWorkspacesView({
            context: context,
            data: {
              workspaceTypeId: 3,
              title: title
            }
          });

          $.mockjax.clear();
          DataManager.test(1, title, 3, false);
          view.render();
          view.completeCollection.connector = context.options.factories.connector;
          waitAsync(done,[view.completeCollection.fetch()]);

          expect($(selectorExpandedView).length).toEqual(0);
          TestUtil.run(done,function (done) {
            expand(done,view);

            TestUtil.run(done,function () {
              expect($(getProperModal()).find(
                  selectorTitleIconExpandedDefault).length).toBeGreaterThan(0);
            });
          });
        });

        it("title", function (done) {
          var view = prepareCollapsedView(done,1);

          expect($(selectorExpandedView).length).toEqual(0);
          expand(done,view);

          TestUtil.run(done,function () {
            expect($(getProperModal()).find(selectorExpandedTitle).text()).toContain(title);
          });
        });

        it("default title", function (done) {
          var view = new MyWorkspacesView({
            context: context,
            data: {
              workspaceTypeId: workspaceTypeId
            }
          });
          view.render();
          view.completeCollection.connector = context.options.factories.connector;

          $.mockjax.clear();
          DataManager.test(1, title, workspaceTypeId, false);

          expect($(selectorExpandedView).length).toEqual(0);
          expand(done,view);
          TestUtil.run(done,function () {
            expect($(getProperModal()).find(selectorExpandedTitle).text()).toContain(
                lang.dialogTitle);
          });
        });
      });
    });

    describe("in expanded state", function () {

      function waitTableItemsDisplayed(done,tableView) {
        TestUtil.waitFor(done,function () {
          return tableView.$(selectorExpandedViewItems).length > 0;
        }, 'table items to be displayed (selector:' + selectorExpandedViewItems + ' )', 100);
      }

      function waitTableNoItemDisplayed(done,tableView) {
        TestUtil.waitFor(done,function () {
          return tableView.$(selectorExpandedViewItem).length === 0;
        }, 'table items to be displayed (selector:' + selectorExpandedViewItem + ' )', 100);
      }

      function prepareExpandedView(done,totalCount, addCustomColumns, addIntCustomColumn) {
        var view, tableView;
        if (addCustomColumns) {
          view = new MyWorkspacesView({
            context: context,
            data: {
              workspaceTypeId: workspaceTypeId,
              title: title,
              expandedView: {
                customColumns: [
                  {
                    key: "{124_1}"
                  },
                  {
                    key: "{wnd_modifiedby}"
                  },
                  {
                    key: "{123_2}"
                  },
                  {
                    key: "{123_1}"
                  }
                ]
              }
            }
          });
        } else if (addIntCustomColumn) {
          view = new MyWorkspacesView({
            context: context,
            data: {
              workspaceTypeId: workspaceTypeId,
              title: title,
              expandedView: {
                customColumns: [
                  {
                    key: "{123_3}"
                  }
                ]
              }
            }
          });
        } else {
          view = new MyWorkspacesView({
            context: context,
            data: {
              workspaceTypeId: workspaceTypeId,
              title: title
            }
          })
        }

        $.mockjax.clear();
        if (addIntCustomColumn) {
          DataManager.testIntCustomColumn(totalCount, title, workspaceTypeId);
        } else {
          DataManager.test(totalCount, title, workspaceTypeId, addCustomColumns || false);
        }
        var options = view.options;

        options.collection = view.completeCollection;
        options.collection.connector = context.options.factories.connector;
        tableView = new MyWorkspacesTableView(options);
        tableView.render();
        view.render();
        waitAsync(done,[view.completeCollection.fetch(), tableView.collection.fetch()]);
        if (totalCount > 0 ) {
          waitTableItemsDisplayed(done,tableView);
        } else {
          waitTableNoItemDisplayed(done,tableView);
        }
        return {tableView: tableView, view: view};
      }

      var prepareExpandedViewOriginal = prepareExpandedView;

      describe('can be instantiated', function () {
        it('not without context', function () {
          expect(function () {
            MyWorkspacesTableView()
          }).toThrow(new Error('Context required to create WorkspacesTableView'));
        });

        it('not without collection', function () {
          expect(function () {
            MyWorkspacesTableView(
                {
                  context: context
                }
            )
          }).toThrow(new Error('Collection required to create WorkspacesTableView'));
        });
      });

      describe("show", function () {

        var tableView;
        var appendedView;

        function prepareExpandedView() {
          var ret = prepareExpandedViewOriginal.apply(this,arguments);
          appendedView = ret.tableView;
          appendedView.$el.appendTo('body');
          return ret;
        }

        beforeEach(function(){
          appendedView = null;
        });
        afterEach(function(){
          if (appendedView && appendedView.$el) {
            appendedView.$el.remove();
          }
        });

        it("0 workspace", function (done) {
          var ret  = prepareExpandedView(done,0, false),
              view = ret.view;
          tableView = ret.tableView;

          TestUtil.run(done,function () {
            expect(view.completeCollection.length).toEqual(0);
            expect(tableView.collection.length).toEqual(0);
            expect(tableView.$(selectorExpandedViewItem).length).toEqual(0);
           expect(tableView.$(selectorExpandedViewNoItemMsg)[2].textContent).toEqual('No workspaces found.');
          });
        });

        it("1 workspace", function (done) {
          var ret  = prepareExpandedView(done,1, false),
              view = ret.view;
          tableView = ret.tableView;

          TestUtil.run(done,function () {
            expect(view.completeCollection.length).toEqual(1);
            expect(tableView.collection.length).toEqual(1);
            expect(view.$(selectorViewItems).length).toEqual(1);
            expect(tableView.$(selectorExpandedViewItems).length).toEqual(1);
          });
        });

        it("17 workspaces", function (done) {
          tableView = prepareExpandedView(done,17).tableView;

          TestUtil.run(done,function () {
            expect(tableView.collection.length).toEqual(17);
            expect(tableView.$(selectorExpandedViewItems).length).toEqual(17);
            expect(tableView.$(selectorExpandedTotalItems)[0].innerText).toContain(17 + firstId);

          });
        });

        it("110 workspaces", function (done) {
          tableView = prepareExpandedView(done,110).tableView;

          TestUtil.run(done,function () {
            expect(tableView.collection.length).toEqual(pageSize);
            expect(tableView.$(selectorExpandedViewItems).length).toEqual(pageSize);
            expect(tableView.$(selectorExpandedTotalItems)[0].innerText).toContain(110 + firstId);
          });
        });

        it("name, type, size, modify date an favorite column", function (done) {

          tableView = prepareExpandedView(done,1).tableView;

          TestUtil.run(done,function () {
            var tableHead = tableView.$(expandedExpandedTableHead)[0];
            expect($(tableHead).find('[data-csui-attribute=name]').length).toEqual(1);
            expect($(tableHead).find('[data-csui-attribute=type]').length).toEqual(1);
            expect($(tableHead).find('[data-csui-attribute=size]').length).toEqual(1);
            expect($(tableHead).find('[data-csui-attribute=modify_date]').length).toEqual(1);
            expect($(tableHead).find('[data-csui-attribute=favorite]').length).toEqual(1);
            tableView.$el.remove();
          });
        });

        it("all custom columns", function (done) {
          tableView = prepareExpandedView(done,1, true).tableView;

          TestUtil.run(done,function () {
            function hasColumn(tableElement,fieldid) {
              var headRows = $(tableElement).find('thead tr');
              if (headRows.length>0) {
                if ($(headRows[0]).find('[data-csui-attribute="'+fieldid+'"]').length>0) {
                  return fieldid+" found";
                }
              }
              var detailsRows = $(tableElement).find('tbody tr.csui-details-row');
              if (detailsRows.length>0) {
                if ($(detailsRows[0]).find('[id="'+fieldid+'"]').length>0) {
                  return fieldid+" found";
                }
              }
              return fieldid+" missing";
            }
            function hasValue(tableElement,rowNr,fieldid) {
              var bodyRows = $(tableElement).find('tbody tr');
              var field;
              if (bodyRows.length>rowNr) {
                field = $(bodyRows[rowNr]).find('[data-csui-attribute="'+fieldid+'"]');
                if (field.length>0) {
                  return fieldid+" has value "+field.text();
                }
              }
              var detailsRows = $(tableElement).find('tbody tr.csui-details-row');
              if (detailsRows.length>rowNr) {
                field = $(detailsRows[rowNr]).find('[id="'+fieldid+'"]');
                if (field.length>0) {
                  return fieldid+" has value "+field.text();
                }
              }
              return fieldid+" not found";
            }
            expect(hasColumn(tableView.$el,"name")).toEqual("name found");
            expect(hasColumn(tableView.$el,"wnd_modifiedby")).toEqual("wnd_modifiedby found");
            expect(hasColumn(tableView.$el,"123_2")).toEqual("123_2 found");
            expect(hasColumn(tableView.$el,"124_1")).toEqual("124_1 found");
            expect(hasColumn(tableView.$el,"123_1")).toEqual("123_1 found");
            expect(hasValue(tableView.$el,0,'wnd_modifiedby')).toEqual('wnd_modifiedby has value Admin');
          });
        });

        it("icons for workspaces", function (done) {
          tableView = prepareExpandedView(done,1, false).tableView;

          TestUtil.run(done,function () {
            expect(tableView.$(selectorExpandedDefaultContainerIcon).length).toEqual(1);
          });
        });
      });

      describe("support workspaces order", function () {

        var viewAsc, viewDesc, tableView;

        function validateOrder(tableView, property, count, firstValue, lastValue) {
          expect(tableView.collection.length).toEqual(count);
          expect(tableView.collection.models[0].get(property)).toEqual(firstValue);
          expect(tableView.collection.models[count - 1].get(property)).toEqual(lastValue);
          var element = tableView.$(selectorExpandedTableItemContainer);
          expect(element.length).toEqual(count);
          expect($(element[0]).find(selectorExpandedViewCellName)[0].text.trim()).toEqual(firstValue);
          expect($(element[count -1]).find(selectorExpandedViewCellName)[0].text.trim()).toEqual(lastValue);
        }

        beforeEach(function (done) {
          tableView = prepareExpandedView(done,5, true).tableView;
          tableView.$el.appendTo("body");
          viewAsc = new MyWorkspacesView({
            context: context,
            data: {
              workspaceTypeId: workspaceTypeId,
              title: title,
              expandedView: {
                orderBy: {
                  sortColumn: "{name}",
                  sortOrder: "asc"
                }
              }
            }
          });
          viewDesc = new MyWorkspacesView({
            context: context,
            data: {
              workspaceTypeId: workspaceTypeId,
              title: title,
              expandedView: {
                orderBy: {
                  sortColumn: "{name}",
                  sortOrder: "desc"
                }
              }
            }
          });
          $.mockjax.clear();
          DataManager.test(5, title, workspaceTypeId, true);
          DataManager.test(5, title, workspaceTypeId, false);
        });
        afterEach(function(){
          tableView.$el.remove();
        });

        it("default - by name asc", function () {
          expect(tableView.$(selectorExpandedDefaultContainerIcon).length).toEqual(5);

          validateOrder(tableView, 'name', 5, title + firstId, title + (firstId + 4));
        });

        it("by name asc", function (done) {
          viewAsc.render();

          waitAsync(done,[viewAsc.completeCollection.fetch()]);

          TestUtil.run(done,function (done) {
            var options = viewAsc.options;
            options.collection = viewAsc.completeCollection;
            options.collection.connector = context.options.factories.connector;
            tableView.$el.remove();
            tableView = new MyWorkspacesTableView(options);
            tableView.render();
            tableView.$el.appendTo("body");
            waitTableItemsDisplayed(done,tableView);

            TestUtil.run(done,function () {
              validateOrder(tableView, 'name', 5, title + firstId, title + (firstId + 4));
            });
          });
        });

        it("by name desc", function (done) {
          viewDesc.render();

          waitAsync(done,[viewDesc.completeCollection.fetch()]);

          TestUtil.run(done,function (done) {
            var options = viewDesc.options;
            options.collection = viewDesc.completeCollection;
            options.collection.connector = context.options.factories.connector;
            tableView.$el.remove();
            tableView = new MyWorkspacesTableView(options);
            tableView.render();
            tableView.$el.appendTo("body");
            waitTableItemsDisplayed(done,tableView);

            TestUtil.run(done,function () {
              validateOrder(tableView, 'name', 5, title + (firstId + 4), title + firstId);
            });
          });
        });

        function test_sorting(done,key) {
          var tableHead     = tableView.$(expandedExpandedTableHead)[0],
              tableHeadName = $(tableHead).find('.csui-table-cell-' + key);
          if (key !== 'name') {
            tableHeadName.click();
            waitAsync(done,[tableView.collection.fetch()]);
          }

          TestUtil.run(done,function (done) {
            validateOrder(tableView, 'name', 5, title + firstId, title + (firstId + 4));
            tableHeadName.click();
            validateOrder(tableView, 'name', 5, title + firstId, title + (firstId + 4));

            waitAsync(done,[tableView.collection.fetch()]);
            TestUtil.run(done,function () {
              validateOrder(tableView, 'name', 5, title + (firstId + 4), title + firstId);
            });
          });
        }
		
        xit("server side via click on 'name'", function (done) {
          test_sorting(done,'name');
        });
        xit("server side via click on '123_2'", function (done) {
          test_sorting(done,'123_2');
        });
        xit("server side via click on '124_1'", function (done) {
          test_sorting(done,'124_1');
        });
      });

      describe("support paging", function () {
        var tableView;

        beforeEach(function (done) {
          tableView = prepareExpandedView(done,75).tableView;
          tableView.$el.appendTo("body");
        });
        afterEach(function(){
          tableView.$el.remove();
        });

        xit("second page", function (done) {
          expect(tableView.collection.models[0].get('name')).toEqual(title + firstId);
          expect($(tableView.$(selectorExpandedTableItemContainer)[0]).find(
              selectorExpandedViewCellName)[0].text).toEqual(title +
                                                             firstId);
          tableView.paginationView.$el.appendTo(document.body);
          waitAsync(done,[tableView.collection.fetch()]);
          TestUtil.run(done,function (done) {
            var page = tableView.paginationView.$("[" + selectorExpandedPaginationPages + "*='1']");
            expect(page.length).toEqual(1);
            page.click();
            waitAsync(done,[tableView.collection.fetch()]);
            TestUtil.run(done,function () {
              expect(tableView.collection.models[0].get('name')).toEqual(title +
                                                                         (pageSize + firstId));
              expect($(tableView.$(selectorExpandedTableItemContainer)[0]).find(
                  selectorExpandedViewCellName)[0].text).toEqual(title +
                                                                 (pageSize +
                                                                 firstId));
            });
          });
        });

      });

      describe("default action", function () {

        var tableView,
            view;

        beforeEach(function (done) {
          var ret = prepareExpandedView(done,1);
          tableView = ret.tableView;
          tableView.$el.appendTo("body");
          view = ret.view;
        });
        afterEach(function(){
          tableView.$el.remove();
        });

        it("is called at onClick", function () {
          var defaultAction       = tableView.$(selectorExpandedViewCellName),
              defaultActionCalled = false;

          view.listenTo(tableView, 'execute:defaultAction', function () {
            defaultActionCalled = true;
          });
          expect(defaultActionCalled).toBeFalsy();
          defaultAction.click();
          expect(defaultActionCalled).toBeTruthy();
        });

      });

      describe("filtering", function () {

        var tableView;

        function setFilterName(done,view) {
          setFilter(done,view, {column: "name", keywords: "filter"});
        }

        function setFilter(done,view, filter, waitForError) {
          view.tableView.applyFilter(filter);
          waitAsync(done,[view.tableView.collection.fetch()], 100, waitForError);
        }

        beforeEach(function (done) {
          tableView = prepareExpandedView(done,100, true).tableView;
          tableView.$el.appendTo("body");
        });
        afterEach(function(){
          tableView.$el.remove();
        });

        it("by name fetches proper workspaces", function (done) {

          expect($(tableView.$(selectorExpandedTableItemContainer)[0]).find(
              selectorExpandedViewCellName)[0].text.trim()).toEqual(title + firstId);
          setFilterName(done,tableView);

          TestUtil.run(done,function () {
            expect(tableView.collection.models[0].get('name')).toEqual(title + 'filter' + firstId);
            expect($(tableView.$(selectorExpandedTableItemContainer)[0]).find(
                selectorExpandedViewCellName)[0].text.trim()).toEqual(title + 'filter' + firstId);
          });
        });

        it("by name and 123_1 fetches proper workspaces", function (done) {

          expect($(tableView.$(selectorExpandedTableItemContainer)[0]).find(
              selectorExpandedViewCellName)[0].text.trim()).toEqual(title + firstId);
          setFilterName(done,tableView);

          TestUtil.run(done,function (done) {
            expect(tableView.collection.models[0].get('name')).toEqual(title + 'filter' + firstId);
            expect($(tableView.$(selectorExpandedTableItemContainer)[0]).find(
                selectorExpandedViewCellName)[0].text.trim()).toEqual(title + 'filter' + firstId);
            expect(tableView.collection.models[0].get('123_1')).not.toContain('filter');
            DataManager.testAddFilterExpanded123_1(100, title, workspaceTypeId);
            setFilter(done,tableView, {column: "123_1", keywords: "filter"});

            TestUtil.run(done,function () {
              expect(tableView.collection.models[0].get('123_1')).toContain('filter');
            });
          });
        });

        xit("returns proper error message", function (done) {

          expect($(tableView.$(selectorExpandedTableItemContainer)[0]).find(
              selectorExpandedViewCellName)[0].text).toEqual(title +
                                                             firstId);
          var errorMessage = DataManager.returnError(workspaceTypeId, 'type');
          setFilter(done,tableView, {column: 'type', keywords: "error"}, true);

          TestUtil.waitFor(done,function () {
            return $('.binf-modal-dialog .binf-modal-body').length > 0;
          }, 1000);

          TestUtil.run(done,function () {
            expect($(".binf-modal-dialog .binf-modal-body").text()).toContain(errorMessage);
          });
        });
      });

      describe("filtering only allowed", function () {

        var tableView;

        beforeEach(function (done) {
          tableView = prepareExpandedView(done,100, false, true).tableView;
          tableView.$el.appendTo("body");
        });
        afterEach(function(){
          tableView.$el.remove();
        });

        it("for strings", function () {

          expect($(tableView.$(selectorExpandedTableItemContainer)[0]).find(
              selectorExpandedViewCellName)[0].text.trim()).toEqual(title + firstId);
          expect(tableView.$('[data-csui-attribute=name]').length).toBeGreaterThan(0);
          expect(tableView.$('[data-csui-attribute=name] .csui-table-column-search').length).toBeGreaterThan(0);
          expect(tableView.$('[data-csui-attribute="123_3"]').length).toBeGreaterThan(0);
          expect(tableView.$('[data-csui-attribute="123_3"] .csui-table-column-search').length).toBe(0);
        });
      });
    });
  });
});
