/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/contexts/page/page.context',
  'conws/widgets/relatedworkspaces/relatedworkspaces.view',
  'conws/widgets/relatedworkspaces/impl/relatedworkspacestable.view',
  'conws/widgets/relatedworkspaces/test/relatedworkspaces.mock.manager',
  'csui/utils/base',
  'conws/utils/workspaces/impl/workspaceutil',
  'csui/lib/numeral',
  'conws/utils/test/testutil',
  'csui/lib/marionette',
  'i18n!csui/controls/table/cells/size/impl/nls/localized.strings'
], function (_, $, PageContext, RelatedWorkspacesView, RelatedWorkspacesTableView, DataManager, base,
    workspaceUtil, numeral, TestUtil, Marionette, LocalizedSizeString) {

  describe('RelatedWorkspacesView', function () {

    var context;
    var collapsedView;
    var contentRegion;
    var width;

    var filterForPageSize = function (index, pageSize) {
      var filter = ( ((index) % (Math.floor((pageSize * 3) / 4)) === 0) ? "" : " filter" );
      return filter;
    };

    var selectorViewItems            = '.conws-relateditem-object',
        selectorExpand               = '.tile-expand',
        selectorExpandHidden         = selectorExpand + '.hidden',
        selectorExpandedView         = '.conws-workspacestable',
        selectorExpandedItemList     = '.csui-saved-item',
        selectorExpandedViewFilter   = '.csui-table-searchbox',
        selectorExpandedTableToolBar = '.csui-tabletoolbar',
        selectorExpandedNodeTable    = '#tableview',
        selectorExpandedPagination   = '#paginationview',

        waitAsync                    = function (done, functions, timeout) {
          var dataFetched;
          TestUtil.run(done,function () {
            $.when.apply($, functions).done(
                function () {
                  dataFetched = true;
                }).fail(function () {
                  throw new Error("Deferred object is rejected!");
                }
            )
          });

          TestUtil.waitFor(done,function () {
            return dataFetched;
          }, 'Data fetch timed out', timeout || 101);
        };

    beforeEach(function () {
      width = $("body").css('width');
      $("body").css('width', '1260px');
      $("body").append('<div id="test_team_cells" style="width: 1260px;height: 500px"</div>');
      contentRegion = new Marionette.Region({ el: "#test_team_cells" });

      context = new PageContext({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v2',
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
          },
          node: {
            attributes: {
              id: 120,
              type: 848
            }
          }
        }
      });
    });

    afterEach(function() {
      $("body #test_team_cells").remove();
      $("body").css('width', width);
    });

    describe('given empty configuration', function () {

      beforeEach(function () {
        collapsedView = new RelatedWorkspacesView({
          context: context
        });
        collapsedView.render();
        contentRegion.show(collapsedView);
      });

      it('can be created', function () {
        expect(collapsedView instanceof RelatedWorkspacesView).toBeTruthy();
      });

      it('has no title', function () {
        expect(collapsedView.options.data.title).toBeUndefined();
      });

    });

    var paramSets = {
      "ascending": {
        orderBy: {
          sortColumn: "{name}",
          sortOrder: "asc"
        }
      },
      "descending": {
        orderBy: {
          sortColumn: "{name}",
          sortOrder: "desc"
        }
      }
    };

    var idx;
    for (idx in paramSets) {
      (function (testName, paramSet) {
        describe("given configuration '" + testName + "' with custom columns", function () {

          var configOrderBy = paramSet.orderBy;

          var configTitle = "Sales Opportunities";
          var configIcon = "cs-icon-checklist";
          var configWorkspaceType = "3";
          var configRelationType = "child";
          var configPageSize = 30;

          var descriptionConfig = "{custom_123_1}";
          var descriptionValue = ["custom_123_1"];
          var bottomLeftLabelConfig = "Bottom Left:";
          var bottomLeftLabelValue = "Bottom Left:";
          var bottomLeftValueConfig = "{wnd_modifiedby}";
          var bottomLeftValueValue = ["wnd_modifiedby"];
          var topRightLabelConfig = "EUR";
          var topRightLabelValue = "EUR";
          var topRightValueConfig = "{custom_123_2:currency}";
          var topRightValueValue = ["currency","custom_123_2"];
          var bottomRightLabelConfig = "Level";
          var bottomRightLabelValue = "Level";
          var bottomRightValueConfig = "{modify_date}";
          var bottomRightValueValue = ["modify_date"];
          var htmlExpectCollapsed = [
            {selector: ".conws-title .conws-value", value: ["name"]},
            {selector: ".conws-relateditem-center .conws-body", value: descriptionValue},
            {
              selector: ".conws-relateditem-bottom .conws-left .conws-label",
              value: bottomLeftLabelValue
            },
            {
              selector: ".conws-relateditem-bottom .conws-left .conws-value",
              value: bottomLeftValueValue
            },
            {
              selector: ".conws-relateditem-top .conws-right .conws-label",
              value: topRightLabelValue
            },
            {
              selector: ".conws-relateditem-top .conws-right .conws-value",
              value: topRightValueValue
            },
            {
              selector: ".conws-relateditem-bottom .conws-right .conws-label",
              value: bottomRightLabelValue
            },
            {
              selector: ".conws-relateditem-bottom .conws-right .conws-value",
              value: bottomRightValueValue
            }
          ];
          var htmlExpectExpanded = [
            {selector: ".csui-table-cell-name .csui-table-cell-name-div a", value: ["name"]},
            {selector: ".csui-table-cell-type"},
            {selector: ".csui-table-cell-size", value: ["size"]},
            {selector: ".csui-table-cell-date", value: ["date", DataManager.fixedDate]},
            {selector: ".csui-table-cell-favorite"}
          ];

          var testItemCount = 100;
          var testItemName = "Sales Opportunity ";
          var collapsedDataFetched;

          beforeEach(function () {
            var config = {
              context: context,
              data: {
                "title": configTitle,
                "icon": configIcon,
                "workspaceTypeId": configWorkspaceType,
                "relationType": configRelationType,
                "collapsedView": {
                  "title": {
                    "value": "{name}"
                  },
                  "description": {
                    "value": descriptionConfig
                  },
                  "topRight": {
                    "label": topRightLabelConfig,
                    "value": topRightValueConfig
                  },
                  "bottomLeft": {
                    "label": bottomLeftLabelConfig,
                    "value": bottomLeftValueConfig
                  },
                  "bottomRight": {
                    "label": bottomRightLabelConfig,
                    "value": bottomRightValueConfig
                  }
                },
                expandedView: {
                  "orderBy": configOrderBy
                }
              }
            };
            if (workspaceUtil.orderByAsString(configOrderBy) !== "name asc") {
              config.data.collapsedView.orderBy = configOrderBy
            }
            collapsedView = new RelatedWorkspacesView(config);
            collapsedView.render();
            contentRegion.show(collapsedView);
          });

          it('can be created', function () {
            expect(collapsedView instanceof RelatedWorkspacesView).toBeTruthy();
          });

          it('has the expected options', function () {
            expect(collapsedView.options.data.title).toEqual(configTitle);
            expect(collapsedView.options.data.pageSize).toEqual(configPageSize);
            expect(collapsedView.options.data.icon).toEqual(configIcon);
            expect(collapsedView.options.data.workspaceTypeId).toEqual(configWorkspaceType);
            expect(collapsedView.options.data.relationType).toEqual(configRelationType);
          });

          describe('with ' + testItemCount + ' ' + testItemName + ' test items', function () {

            function verifyHtmlText(htmlText, fieldValue, ii) {
              var tcats = DataManager.dataCustomColumns;
              var fv = fieldValue;
              var expectText;
              var prefix = "value:";
              if (fv instanceof Array) {
                prefix = fv[0] + ":";
                if (fv[0].indexOf("custom_") > -1) {
                  expectText = "" + tcats[fv[0]] + (ii + 1);
                } else if (fv[0] === "index") {
                  expectText = "" + (ii + 1);
                } else if (fv[0] === "name") {
                  expectText = testItemName + (ii + 1) + filterForPageSize(ii + 1, configPageSize);
                } else if (fv[0] === "date") {
                  var dateobj = new Date(htmlText);
                  htmlText = dateobj.toDateString();
                  dateobj = new Date(DataManager.fixedDate);
                  expectText = dateobj.toDateString();
                } else if (fv[0] === "size") {
                  htmlText = htmlText.trim();
                  var value = ii % 12,
                      format = value >= 5 ? LocalizedSizeString.ItemCount5 :
                               value >= 2 ? LocalizedSizeString.ItemCount2 :
                               value > 0 ? LocalizedSizeString.ItemCount1 : LocalizedSizeString.ItemCount0;
                  expectText = _.str.sformat(format, value);
                } else if (fv[0] === "modify_date") {
                  expectText = base.formatDate(htmlText);
                } else if (fv[0] === "wnd_modifiedby") {
                  expectText = "Admin";
                } else if (fv[0] === "currency") {
                  expectText = numeral((ii + 1)+tcats[fv[1]]).format();
                }
                else {
                  expectText = {};
                }
              } else {
                expectText = "" + fv;
              }
              expect(htmlText).toEqual(expectText);
            }

            function verifyHtmlItem(htmlListItem, htmlExpect, ii) {
              for (var jj = 0; jj < htmlExpect.length; jj++) {
                var fieldDescr = htmlExpect[jj];
                var htmlItem = $(htmlListItem).find(fieldDescr.selector);
                if (htmlItem.length !== 1) {
                  expect(htmlItem.length + "' as number of found fields of element " + ii +
                         " for selector '" + fieldDescr.selector).toEqual(1);
                }
                if (fieldDescr.hasOwnProperty("value")) {
                  verifyHtmlText(htmlItem.text().trim(), fieldDescr.value, ii)
                }
              }
            }

            function verifyHtmlItemsOrdered(htmlItems, htmlExpect, orderBy, offset) {
              var order = workspaceUtil.orderByAsString(orderBy);
              offset = offset || 0;
              for (var ii = 0; ii < htmlItems.length; ii++) {
                if (order === "name asc") {
                  verifyHtmlItem(htmlItems[ii], htmlExpect, offset + ii);
                } else if (order === "name desc") {
                  verifyHtmlItem(htmlItems[ii], htmlExpect, testItemCount - offset - ii - 1);
                } else {
                  expect(order).toEqual("name asc' or 'name desc");
                }
              }
            }

            function verifyHtmlItemsFiltered(htmlItems, htmlExpect, filter) {
              for (var ii = 0; ii < htmlItems.length; ii++) {
                var htmlItem = $(htmlItems[ii]).find(htmlExpect[0].selector);
                expect(htmlItem).toBeTruthy();
                var htmlText = $(htmlItem).text();
                expect(htmlText).toBeDefined();
                if (htmlText) {
                  if (filter) {
                    expect(htmlText).toMatch(filter);
                  }
                  var intreg = /[+-]?[0-9]+/;
                  expect(htmlText).toMatch(intreg);
                  var intmatch = htmlText.match(intreg);
                  expect(intmatch).toBeTruthy();
                  var jj = parseInt(intmatch[0], 10);
                  expect(jj).toBeDefined();
                  verifyHtmlItem(htmlItems[ii], htmlExpect, jj - 1);
                }
              }
            }

            function verifyModelItem(viewItem, ii) {
              var tcats = DataManager.dataCustomColumns;
              var tfmts = DataManager.dataCustomFormats;
              var cats = {};
              Object.keys(DataManager.dataCustomColumns).forEach(function (item) {
                cats[item] = (viewItem.get(item));
              });
              expect(viewItem.get('name')).toEqual(testItemName + (ii + 1) +
                                                   filterForPageSize(ii + 1, configPageSize));
              for (var tcatname in tcats) {
                if (tcats.hasOwnProperty(tcatname)) {
                  var tcat = tcats[tcatname];
                  var cat = cats[tcatname];
                  expect(cat).toEqual(_.str.sformat(tfmts[tcatname],tcat,ii + 1));
                }
              }
            }

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
              view._behaviors.every(function(behavior) {
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
              }, 'Data fetch timed out', 100);
            }

            function setCollapsedFilter(done, view, fetchSpiedON) {

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
              }, 'view.completeCollection.fetch.callCount > callCount &&' +
                 ' view.completeCollection.length > 0: ' + view.completeCollection.fetch.calls.count() +
                 ' > ' + callCount + ' && ' + view.completeCollection.length + ' > 0 ', 1500);
            }

            beforeEach(function (done) {
              collapsedDataFetched = false;

              $.mockjax.clear();
              DataManager.test(testItemCount, testItemName,
                  collapsedView.options.data.workspaceTypeId, true);

              collapsedView.render();
              contentRegion.show(collapsedView);
              TestUtil.run(done,function () {
                $.when(collapsedView.completeCollection.fetch()).done(
                    function () {
                      collapsedDataFetched = true;
                    })
              });

              TestUtil.waitFor(done,function () {
                return collapsedDataFetched;
              }, 'Data fetch timed out', 103);
            });

            it('the item lists have the expected length', function () {
              expect(collapsedView.completeCollection.length).toEqual(configPageSize);
              expect(collapsedView.$(selectorViewItems).length).toEqual(configPageSize);
              expect(collapsedView.$(selectorExpand).length).toEqual(1);
              expect(collapsedView.$(selectorExpandHidden).length).toEqual(0);
            });

            it('the model items are ordered by ' + workspaceUtil.orderByAsString(configOrderBy) + ' and have the' +
               ' expected values',
                function () {
                  for (var ii = 0; ii < configPageSize; ii++) {
                    var viewItem = collapsedView.completeCollection.models[ii];
                    if (workspaceUtil.orderByAsString(configOrderBy) === "name asc") {
                      verifyModelItem(viewItem, ii);
                    } else if (workspaceUtil.orderByAsString(configOrderBy) === "name desc") {
                      verifyModelItem(viewItem, testItemCount - ii - 1);
                    } else {
                      expect(workspaceUtil.orderByAsString(configOrderBy)).toEqual("name asc' or 'name desc");
                    }
                  }
                });

            it('the html items are ordered by ' + workspaceUtil.orderByAsString(configOrderBy) + ' and have the expected text',
                function () {
                  var htmlItems = collapsedView.$(selectorViewItems);
                  verifyHtmlItemsOrdered(htmlItems, htmlExpectCollapsed, configOrderBy);
                });

            describe("scrolling", function () {

              var view;

              beforeEach(function (done) {
                view = collapsedView;

                TestUtil.run(done,function (done) {
                  expect(view.completeCollection.length).toEqual(configPageSize);
                  expect(view.$(selectorViewItems).length).toEqual(configPageSize);

                  spyOn(view, "_resetInfiniteScrolling").and.callThrough();
                  scrollDown(done, view);
                });
              });

              xit("fetches next workspaces", function () {
                expect(view.completeCollection.length).toEqual(configPageSize * 2);
                expect(view.$(selectorViewItems).length).toEqual(configPageSize * 2);
                var htmlItems = view.$(selectorViewItems);
                verifyHtmlItemsOrdered(htmlItems, htmlExpectCollapsed, configOrderBy);
              });

              xit("works together with filtering", function (done) {
                expect(view._resetInfiniteScrolling.calls.count()).toEqual(0);
                expect(view.completeCollection.length).toEqual(configPageSize * 2);
                expect(view.$(selectorViewItems).length).toEqual(configPageSize * 2);

                setCollapsedFilter(done, view, true);

                TestUtil.run(done,function () {
                  expect(view._resetInfiniteScrolling.calls.count()).toEqual(1);
                  expect(view.completeCollection.length).toEqual(configPageSize);
                  expect(view.$(selectorViewItems).length).toEqual(configPageSize);
                  var htmlItems = view.$(selectorViewItems);
                  verifyHtmlItemsFiltered(htmlItems, htmlExpectCollapsed, "filter");
                });
              });
            });

            describe("filtering", function () {

              var view;

              beforeEach(function (done) {
                view = collapsedView;

                TestUtil.run(done,function (done) {
                  expect(view.completeCollection.length).toEqual(configPageSize);
                  expect(view.$(selectorViewItems).length).toEqual(configPageSize);
                  var htmlItems = collapsedView.$(selectorViewItems);
                  verifyHtmlItemsOrdered(htmlItems, htmlExpectCollapsed, configOrderBy);

                  setCollapsedFilter(done, view);
                });
              });

              it("fetches proper workspaces", function () {
                expect(view.completeCollection.length).toEqual(configPageSize);
                expect(view.$(selectorViewItems).length).toEqual(configPageSize);
                var htmlItems = view.$(selectorViewItems);
                verifyHtmlItemsFiltered(htmlItems, htmlExpectCollapsed, "filter");
              });

              xit("works together with scrolling", function (done) {
                scrollDown(done, view, true);

                TestUtil.run(done,function () {
                  expect(view.completeCollection.length).toEqual(configPageSize * 2);
                  expect(view.$(selectorViewItems).length).toEqual(configPageSize * 2);
                  var htmlItems = collapsedView.$(selectorViewItems);
                  verifyHtmlItemsFiltered(htmlItems, htmlExpectCollapsed, "filter");
                });
              });
            });

            describe("the expanded view", function () {
              var tableView;

              function expand(done, view) {
                var options = view.options;
                options.collection = view.completeCollection;
                delete options.collection.options.query.expand;
                options.collection.node.on = function () {};
                options.collection.connector = context.options.factories.connector;
                tableView = new RelatedWorkspacesTableView(options);
                tableView.render();
				tableView.collection.fetch().then(function(){
					tableView.collection.workspace.fetch().then(done,done.fail);
				},done.fail);
              }

              beforeEach(function (done) {

                expand(done, collapsedView);

              });

              it("can be created", function () {
                expect(tableView.$(selectorExpandedView).length).toEqual(1);
                expect(tableView.$(selectorExpandedTableToolBar).length).toEqual(1);
                expect(tableView.$(selectorExpandedNodeTable).length).toEqual(1);
                expect(tableView.$(selectorExpandedPagination).length).toEqual(1);
              });

              xit('the html items are ordered by ' + workspaceUtil.orderByAsString(configOrderBy) + ' and have the expected text',
                  function () {
                    var htmlItems = $(tableView.$el[0]).find(selectorExpandedItemList);
                    verifyHtmlItemsOrdered(htmlItems, htmlExpectExpanded, configOrderBy);
                  });

              describe("supports paging", function () {

                var expandedHtmlView;

                beforeEach(function () {
                  expandedHtmlView = $(selectorExpandedView);
                });

                xit("displays second page correctly", function (done) {
                  var htmlItems = tableView.$(selectorExpandedItemList);
                  verifyHtmlItemsOrdered(htmlItems, htmlExpectExpanded, configOrderBy);
                  tableView.collection.setLimit(configPageSize, configPageSize, true);
                  waitAsync(done, [tableView.collection.fetch()]);
                  TestUtil.run(done,function () {
                    var htmlItems = tableView.$(selectorExpandedItemList);
                    verifyHtmlItemsOrdered(htmlItems, htmlExpectExpanded, configOrderBy,
                        configPageSize);
                  });
                });

              });

              describe("supports filtering", function () {

                var expandedHtmlView;

                beforeEach(function () {
                  expandedHtmlView = $(selectorExpandedView);
                });

                function setExpandedFilter(done, view) {
                  var searchBox = view.find(selectorExpandedViewFilter);
                  searchBox.val("filter");
                  var e = $.Event("keypress");
                  e.keyCode = 13;
                  searchBox.trigger(e);
                  waitAsync(done, [collapsedView.completeCollection.fetch()]);
                }

                xit("fetches proper workspaces", function (done) {

                  var htmlItems = $(selectorExpandedItemList);
                  verifyHtmlItemsOrdered(htmlItems, htmlExpectExpanded, configOrderBy);

                  setExpandedFilter(expandedHtmlView);

                  TestUtil.run(done,function () {
                    htmlItems = $(selectorExpandedItemList);
                    verifyHtmlItemsFiltered(htmlItems, htmlExpectExpanded, "filter");
                  });
                });
              });

            });

          });

        });
      })(idx, paramSets[idx]);
    }

  });

});
