/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/node',
  'csui/models/command',
  'csui/utils/commands',
  'csui/widgets/search.results/search.results.view',
  'conws/widgets/relatedworkspaces/addrelatedworkspaces.search',
  'i18n!conws/widgets/relatedworkspaces/impl/nls/lang',
  './search.mock.js'
], function ($, _, Backbone, Marionette,
  PageContext, ConnectorFactory, NodeModelFactory,
  CommandModel, commands, SearchResultsView,
  AddRelatedWorkspacesSearch, lang, MockData) {
    'use strict';

    function waitFor(check, timeout, message) {
      var deferred = $.Deferred();
      if (check()) {
        deferred.resolve();
      } else {
        var state = {
          clear: function () {
            if (this.timeout) {
              clearTimeout(this.timeout);
              delete this.timeout;
            }
            if (this.interval) {
              clearInterval(this.interval);
              delete this.interval;
            }
          },
          interval: setInterval(function () {
            if (check()) {
              state.clear();
              deferred.resolve();
            }
          }, 100),
          timeout: setTimeout(function () {
            state.clear();
            deferred.reject(state.error);
          }, timeout),
          error: new Error(_.str.sformat("Timeout {0} reached while waiting for {1}.", timeout, message))
        };
      }
      return deferred.promise();
    }
    function findHidingElement(element, root) {

      if (!element) {
        return null;
      }
      var elementStyle = window.getComputedStyle(element);
      var elementRect = element.getBoundingClientRect();
      var middleX = elementRect.x + elementRect.width / 2;
      var middleY = elementRect.y + elementRect.height / 2;
      if (elementStyle["display"] === "none") {
        return element;
      }
      if (elementRect.width === 0 || elementRect.height === 0) {
        return element;
      }

      root = root ? root : document.body;
      var parentElement = element.parentElement;
      while (parentElement) {

        var parentStyle = window.getComputedStyle(parentElement);
        var parentRect = parentElement.getBoundingClientRect();
        var overflowX = parentStyle["overflow-x"] !== "clip" && parentStyle["overflow-x"] !== "hidden";
        var overflowY = parentStyle["overflow-y"] !== "clip" && parentStyle["overflow-y"] !== "hidden";
        var visibleX = overflowX || parentRect.width && parentRect.left <= middleX && middleX <= parentRect.right;
        var visibleY = overflowY || parentRect.height && parentRect.top <= middleY && middleY <= parentRect.bottom;
        if (parentStyle["display"] === "none") {
          return parentElement;
        }
        if (!visibleX || !visibleY) {
          return parentElement;
        }
        if (parentElement === root) {
          return undefined;
        }
        parentElement = parentElement.parentElement;
      }
      return undefined;
    }

    function isVisible(element, root) {
      var visible = findHidingElement(element, root) === undefined;
      return visible;
    }

    function getAction(status) {
      var model = status.collection && status.collection.workspace;
      if (model && model.actions) {
        return model.actions.get ? model.actions.get("add-relitem") : model.actions["add-relitem"];
      }
      return undefined;
    }

    var AddRelatedItemTestCmd = CommandModel.extend({

      defaults: {
        signature: "AddRelationTest",
        command_key: ['add-relitem-test'],
        scope: "multiple"
      },

      enabled: function (status, options) {
        if (status.data && status.data.submit) {
          if (status.nodes && status.nodes.length) {
            return !!getAction(status);
          }
        } else {
          return !!getAction(status);
        }
      },

      execute: function (status, options) {
        this.trigger("command:execute", status, options);
      }

    });

    var pageContext, addWkspSearch, searchResultsView,
      resultsRegion, regionEl, collectionFetchState;

    function testsetup(done,orderBy) {

      pageContext = undefined;
      addWkspSearch = undefined;
      searchResultsView = undefined;
      resultsRegion = undefined;
      regionEl = undefined;
      collectionFetchState = undefined;

      $('body').empty();
      regionEl = $('<div style="width:1264px; height:632px;"></div>').appendTo(document.body);
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

      var connector = pageContext.getObject(ConnectorFactory);
      var nodeModel = pageContext.getModel(NodeModelFactory, {
        options: {
          expand: { properties: ["reserved_user_id"] },
          fields: { columns: [], properties: [] },
          includeResources: ["metadata", "perspective"]
        }
      });

      var columns = new Backbone.Collection(MockData.columns);
      var tableColumns = new Backbone.Collection(MockData.tableColumns);
      var collection = {
        columns: columns,
        connector: connector,
        node: nodeModel,
        options: {
          query: {
            action: "properties-properties",
            expand_users: "true",
            fields: "properties%7Bwnf_att_yw39_7%2Cwnf_att_yw39_6%2Cwnf_att_yw39_5%2Cwnf_att_yw39_3%2Cwnf_att_yw39_b%2Cwnf_att_yw39_8%2Cwnf_att_yw39_2%2Cwnf_att_yw39_9%2Cwnf_att_yw39_d%2Ctype%2Cname%2Csize%2Cmodify_date%2Cfavorite%2Cid%2Ccontainer%7D",
            limit: 30,
            page: 1,
            sort: "asc_name",
            where_relationtype: "child",
            where_workspace_type_id: 101
          }
        },
        workspace: {
          actions: {
            "add-relitem": {
              body: "",
              content_type: "",
              form_href: "",
              href: "/api/v2/businessworkspaces/2513449/relateditems",
              method: "POST",
              name: "Add relationships"
            }
          }
        }
      };
      if (orderBy) {
        collection.orderBy = orderBy;
      }
      var status = {
        context: pageContext,
        collection: collection,
        originatingView: {
          tableColumns: tableColumns
        }
      };

      addWkspSearch = new AddRelatedWorkspacesSearch({
        title: "Test add relationships",
        signature: "AddRelationTest",
        status: status
      });

      searchResultsView = addWkspSearch.searchView;

      searchResultsView.collection.on("request", function () {
        collectionFetchState = "request";
      });
      searchResultsView.collection.on("sync", function () {
        collectionFetchState = "sync";
      });
      searchResultsView.collection.on("error", function () {
        collectionFetchState = "error";
      });

      if (searchResultsView instanceof SearchResultsView) {
        nodeModel.fetch().then(function () {
          searchResultsView.customSearchView.once("render:form", done);
          resultsRegion.show(searchResultsView);
        }, done.fail);
      } else {
        done.fail("search results view not created");
      }

    }

    function teardown(done) {
      resultsRegion.destroy();
      regionEl.remove();
      $('body').empty();
      done();
    }

    function switchResultView(done, what) {
      var children = "";
      var searchResultsElement = searchResultsView.$el.find(".csui-search-results-body .csui-search-results-content .csui-result-list");
      searchResultsElement.children().each(function (i, el) {
        var tagclass = el.tagName + " " + el.classList;
        children = children.length ? children + "|" + tagclass : tagclass;
      });
      var standardElement = searchResultsElement.find(".binf-list-group");
      var tableElement = searchResultsElement.find(".csui-nodetable");
      var deferred;
      if (standardElement.length === 1 && what === "standard" || tableElement.length === 1 && what === "table") {
        done();
      } else if (tableElement.length === 1 && what === "standard") {
        deferred = $.Deferred();
        searchResultsView.headerView.toggleView({
          type: "click",
          stopImmediatePropagation: function () { },
          preventDefault: function () { }
        });
        deferred.resolve();
        deferred.promise().then(done, done.fail);
      } else if (standardElement.length === 1 && what === "table") {
        deferred = $.Deferred();
        searchResultsView.headerView.toggleView({
          type: "click",
          stopImmediatePropagation: function () { },
          preventDefault: function () { }
        });
        searchResultsView.targetView.once("render", function () {
          deferred.resolve();
        });
        deferred.promise().then(done, done.fail);
      } else {
        done.fail("For switch to " + what + " unknown element: " + children);
      }
    }

    function EventTracker() {

      var trackings = this.trackings = [];
      var mytimeout = this.mytimeout = {};

      function find(eventObject, eventName) {

        return _.find(trackings, function (tracking) {
          return tracking.object === eventObject && tracking.name === eventName;
        });
      }

      function register(tracking) {
        tracking.object.once(tracking.name, function tracker() {
          if (!mytimeout.callflag) {
            tracking.callflag = true;
            tracking.deferred.resolve(this, arguments);
          }
        });
      }

      function setup(eventObject, eventNames, callback) {

        eventNames.split(" ").forEach(function (eventName) {
          var tracking = find(eventObject, eventName);
          if (!tracking) {
            tracking = {
              object: eventObject,
              name: eventName,
              deferred: $.Deferred()
            };
            trackings.push(tracking);
            mytimeout.started && register(tracking);
          }
          callback && callback(tracking);
        });

      }

      this.track = function track(eventObject, eventName) {
        setup(eventObject, eventName);
      };

      this.check = function check(eventObject, eventNames, eventCallback) {
        setup(eventObject, eventNames, function (tracking) {
          tracking.deferred.promise().then(eventCallback);
        });
      };

      this.timeout = function timeout(callback) {
        mytimeout.deferred && mytimeout.deferred.promise().then(callback);
      };

      this.start = function start(startFunction, timeoutMillis) {

        var eventNames = _.reduce(trackings, function (names, tracking) { names.push(tracking.name); return names; }, []);
        timeoutMillis = timeoutMillis || 500;
        mytimeout.error = new Error(_.str.sformat("Timeout {0} reached while waiting for events [{1}].", timeoutMillis, eventNames.join(',')));
        mytimeout.deferred = $.Deferred();
        mytimeout.started = true;

        trackings.forEach(register);

        startFunction && startFunction();

        setTimeout(function () {
          mytimeout.callflag = true;
          var tracked = _.find(trackings, function (tracking) {
            return tracking.callflag;
          });
          tracked || mytimeout.deferred.resolve(mytimeout.error);
        }, timeoutMillis);
      };

    }

    describe('AddRwsTest', function () {

      var addRelatedItemTestCmd = new AddRelatedItemTestCmd();

      beforeAll(function (done) {
        commands.find({ signature: "AddRelationTest" }) || commands.add(addRelatedItemTestCmd);

        $.mockjax.clear(); // to be sure, no mock data relict from previous test spec can affect our tests
        MockData.enable();

        done();
      });

      afterAll(function (done) {

        MockData.disable();

        commands.filter({ signature: "AddRelationTest" }).forEach(function (el) { commands.remove(el); });

        done();
      });

      describe('BrowserCheckTest', function () {
        if (navigator.userAgent.indexOf('Macintosh') > 0) {
          return it('Skip the check for the browser window size. The properties are zero in the headless Chrome on Macintosh.');
        }

        it('browser has expected dimensions', function (done) {
          expect(window.outerHeight).toEqual(720, "window.outerHeight");
          expect(window.outerWidth).toEqual(1280, "window.outerWidth");
          done();
        });
      });

      describe('EmtpyViewTest', function () {

        beforeAll(function (done) {
          testsetup(done);
        });

        afterAll(function (done) {
          teardown(done);
        });

        it('header title is initially visible and contains correct title', function (done) {
          var headerTitleElement = searchResultsView.headerView.$el.find(".csui-custom-search-title");
          expect(isVisible(headerTitleElement[0])).toEqual(true, "header title visibility");
          expect(headerTitleElement.text().trim()).toEqual("Test add relationships", "header title text correct");
          expect(headerTitleElement.length && headerTitleElement[0].tagName.toLowerCase()).toEqual("h2");
          done();
        });

        it('search panel has only search tab', function (done) {
          var searchTabElements = searchResultsView.$el.find(".csui-search-left-panel-tabs .csui-tab");
          expect(searchTabElements.text().trim()).toEqual("Search");
          done();
        });

        it('search fields are displayed', function (done) {
          var searchFieldsElements = searchResultsView.customSearchView.$el.find(".csui-custom-search-formitems .binf-control-label");
          expect(searchFieldsElements.text().trim()).toEqual("NameCountryCityStreetObject KeyStatusPostal CodeNumberIndustryStage");
          done();
        });

        it('search button is visible', function (done) {
          var searchButtonElement = searchResultsView.$el.find(".csui-custom-search-form-submit");
          if (!isVisible(searchButtonElement[0])) {
            setTimeout(function () {
              searchButtonElement = searchResultsView.$el.find(".csui-custom-search-form-submit");
              expect(isVisible(searchButtonElement[0])).toEqual(true, "search button is inside visible area");
              done();
            }, 1000);
          } else {
            done();
          }
        });

        it('fetch is not yet triggered', function (done) {
          expect(collectionFetchState).toBeUndefined();
          done();
        });

        it('search results are initially empty', function (done) {
          expect($(".conws-searchview .csui-search-results-content .csui-nodetable").length).toEqual(0);
          done();
        });

      });

      describe('StandardViewTest', function () {

        var page1request, page1response;

        beforeAll(function (done) {
          page1request = new EventTracker();
          page1response = new EventTracker();
          testsetup(done);
        });

        afterAll(function (done) {
          teardown(done);
        });

        it('search setup page 1', function (done) {
          searchResultsView.collection.once("request", function () {
            page1response.track(searchResultsView.collection, "sync error");
            page1response.start();
          });

          page1request.track(searchResultsView.collection, "request");
          page1request.start(function () {
            searchResultsView.customSearchView.loadCustomSearch();
          });

          done();
        });

        it('search request page 1', function (done) {
          page1request.check(searchResultsView.collection, "request", done);
          page1request.timeout(done.fail);
        });

        it('search response page 1', function (done) {
          page1request.timeout(done.fail);
          page1response.check(searchResultsView.collection, "sync", done);
          page1response.check(searchResultsView.collection, "error", done.fail);
          page1response.timeout(done.fail);
        });

        it('paging bar is displayed correctly', function (done) {
          var itemCountElement = searchResultsView.$el.find(".csui-search-results-body .csui-pager .csui-total-container-items");
          expect(itemCountElement.text().trim()).toEqual("About 99 items");
          var pageBrowseElements = searchResultsView.$el.find(".csui-search-results-body .csui-pager .csui-pages [data-pageid]");
          expect(pageBrowseElements.length).toEqual(10, "paging links");
          done();
        });

        it('standard view is displayed', function (done) {
          switchResultView(done, "standard");
        });

        it('standard view exists', function (done) {
          expect(searchResultsView.targetView).toBeDefined();

          expect(searchResultsView.targetView.el.classList.contains('csui-nodetable')).toBeFalsy();
          expect(searchResultsView.targetView.el.classList.contains('binf-list-group')).toBeTruthy();
          done();
        });

        it('standard view displays page 1', function (done) {
          var nameElements = searchResultsView.$el.find(".csui-search-results-body .csui-search-results-content .csui-result-list .csui-search-item-name");
          expect(nameElements.length).toEqual(10);
          expect($(nameElements[0]).text().trim()).toEqual("Agnes Iams, 82009, US, Customer");
          done();
        });

        it('standard view sorting drop down', function (done) {
          var sortSelectionElement = searchResultsView.$el.find(".csui-search-results-body .csui-search-sorting .csui-search-sort-options > button");
          expect(sortSelectionElement.text().trim()).toEqual("Name", "sorting field");
          var sortDirectionElement = searchResultsView.$el.find(".csui-search-results-body .csui-search-sorting .cs-sort-links .search-sort-btn");
          expect(sortDirectionElement.hasClass("icon-sortArrowUp")).toEqual(true, "sort direction is ascending");
          var sortOptionElements = searchResultsView.$el.find(".csui-search-results-body .csui-search-sorting .csui-search-sort-options .csui-sort-option");
          expect(sortOptionElements.text().trim()).toEqual("NumberObject KeyStreetCityCountryPostal CodeIndustryStatusStageName");
          done();
        });

        describe('ItemSelect', function () {

          beforeAll(function (done) {
            expect(searchResultsView.targetView.standardHeaderView._selectAllView && searchResultsView.targetView.standardHeaderView._selectAllView.$el).toBeTruthy();
            expect(searchResultsView.targetView && searchResultsView.targetView.$el).toBeTruthy();
            expect(searchResultsView.headerView && searchResultsView.headerView.$el).toBeTruthy();
            expect(searchResultsView.targetView.standardHeaderView.selectedCounterView && searchResultsView.targetView.standardHeaderView.selectedCounterView.$el).toBeTruthy();
            expect(searchResultsView.targetView.standardHeaderView.toolbarView && searchResultsView.targetView.standardHeaderView.toolbarView.$el).toBeTruthy();
            done();
          });

          var checkboxElements, headerTitleElement, selectedCounterRegion, testCommandElement;

          it('before select', function (done) {

            checkboxElements = searchResultsView.targetView.standardHeaderView._selectAllView.$el.find(".csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "header check box");

            checkboxElements = searchResultsView.targetView.$el.find(".csui-search-item-check .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "item check box");

            headerTitleElement = searchResultsView.headerView.$el.find(".csui-custom-search-title");
            expect(isVisible(headerTitleElement[0])).toEqual(true, "header title visibility");
            expect(headerTitleElement.text().trim()).toEqual("Test add relationships", "header title text");
            expect(headerTitleElement.length && headerTitleElement[0].tagName.toLowerCase()).toEqual("h2", "header tag name");

            selectedCounterRegion = searchResultsView.targetView.standardHeaderView.selectedCounterView.$el.find(".csui-selected-counter-region>button");
            expect(isVisible(selectedCounterRegion[0])).toEqual(false, "selection counter visibility");

            testCommandElement = searchResultsView.targetView.standardHeaderView.toolbarView.$el.find('[data-csui-command="addrelationtest"]');
            expect(isVisible(testCommandElement[0])).toEqual(false, "test command visibility");

            done();
          });

          it('select item', function (done) {

            searchResultsView.targetView.children.findByIndex(0)._checkboxView.model.set("checked", "true");

            checkboxElements = searchResultsView.targetView.standardHeaderView._selectAllView.$el.find(".csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("mixed", "header check box");

            checkboxElements = searchResultsView.targetView.$el.find(".csui-search-item-check .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("true", "item check box");

            headerTitleElement = searchResultsView.headerView.$el.find(".csui-custom-search-title");
            expect(isVisible(headerTitleElement[0])).toEqual(true, "header title visibility");
            expect(headerTitleElement.text().trim()).toEqual("Test add relationships", "header title text");
            expect(headerTitleElement.length && headerTitleElement[0].tagName.toLowerCase()).toEqual("h2", "header tag name");

            selectedCounterRegion = searchResultsView.targetView.standardHeaderView.selectedCounterView.$el.find(".csui-selected-counter-region>button");
            expect(isVisible(selectedCounterRegion[0])).toEqual(true, "selection counter visibility");
            expect($(selectedCounterRegion[0]).text().trim()).toEqual("Selected1", "selection counter text");

            testCommandElement = searchResultsView.targetView.standardHeaderView.toolbarView.$el.find('[data-csui-command="addrelationtest"]');
            expect(isVisible(testCommandElement[0])).toEqual(true, "test command visibility");
            expect(testCommandElement.text().trim()).toEqual(lang.ToolbarItemAddRelationSubmit, "test command text");

            done();
          });

          it('deselect item', function (done) {

            searchResultsView.targetView.children.findByIndex(0)._checkboxView.model.set("checked", "false");

            checkboxElements = searchResultsView.targetView.standardHeaderView._selectAllView.$el.find(".csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "header check box");

            checkboxElements = searchResultsView.targetView.$el.find(".csui-search-item-check .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "item check box");

            headerTitleElement = searchResultsView.headerView.$el.find(".csui-custom-search-title");
            expect(isVisible(headerTitleElement[0])).toEqual(true, "header title visibility");
            expect(headerTitleElement.text().trim()).toEqual("Test add relationships", "header title text");
            expect(headerTitleElement.length && headerTitleElement[0].tagName.toLowerCase()).toEqual("h2", "header tag name");

            selectedCounterRegion = searchResultsView.targetView.standardHeaderView.selectedCounterView.$el.find(".csui-selected-counter-region>button");
            expect(isVisible(selectedCounterRegion[0])).toEqual(false, "selection counter visibility");

            testCommandElement = searchResultsView.targetView.standardHeaderView.toolbarView.$el.find('[data-csui-command="addrelationtest"]');
            expect(isVisible(testCommandElement[0])).toEqual(false, "test command visibility");

            done();
          });

        });

        describe('PageSelect', function () {

          beforeAll(function (done) {
            expect(searchResultsView.targetView.standardHeaderView._selectAllView && searchResultsView.targetView.standardHeaderView._selectAllView.$el).toBeTruthy();
            expect(searchResultsView.targetView && searchResultsView.targetView.$el).toBeTruthy();
            expect(searchResultsView.headerView && searchResultsView.headerView.$el).toBeTruthy();
            expect(searchResultsView.targetView.standardHeaderView.selectedCounterView && searchResultsView.targetView.standardHeaderView.selectedCounterView.$el).toBeTruthy();
            expect(searchResultsView.targetView.standardHeaderView.toolbarView && searchResultsView.targetView.standardHeaderView.toolbarView.$el).toBeTruthy();
            done();
          });

          var checkboxElements, headerTitleElement, selectedCounterRegion, testCommandElement;

          it('before preselect', function (done) {

            checkboxElements = searchResultsView.targetView.standardHeaderView._selectAllView.$el.find(".csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "header check box");

            checkboxElements = searchResultsView.targetView.$el.find(".csui-search-item-check .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "item check box");

            headerTitleElement = searchResultsView.headerView.$el.find(".csui-custom-search-title");
            expect(isVisible(headerTitleElement[0])).toEqual(true, "header title visibility");
            expect(headerTitleElement.text().trim()).toEqual("Test add relationships", "header title text");
            expect(headerTitleElement.length && headerTitleElement[0].tagName.toLowerCase()).toEqual("h2", "header tag name");

            selectedCounterRegion = searchResultsView.targetView.standardHeaderView.selectedCounterView.$el.find(".csui-selected-counter-region>button");
            expect(isVisible(selectedCounterRegion[0])).toEqual(false, "selection counter visibility");

            testCommandElement = searchResultsView.targetView.standardHeaderView.toolbarView.$el.find('[data-csui-command="addrelationtest"]');
            expect(isVisible(testCommandElement[0])).toEqual(false, "test command visibility");

            done();
          });

          it('preselect item', function (done) {

            checkboxElements = searchResultsView.targetView.$el.find(".csui-search-item-check .csui-checkbox");
            $(checkboxElements[0]).trigger('click');

            checkboxElements = searchResultsView.targetView.standardHeaderView._selectAllView.$el.find(".csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("mixed", "header check box");

            checkboxElements = searchResultsView.targetView.$el.find(".csui-search-item-check .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("true", "item check box");

            headerTitleElement = searchResultsView.headerView.$el.find(".csui-custom-search-title");
            expect(isVisible(headerTitleElement[0])).toEqual(true, "header title visibility");
            expect(headerTitleElement.text().trim()).toEqual("Test add relationships", "header title text");
            expect(headerTitleElement.length && headerTitleElement[0].tagName.toLowerCase()).toEqual("h2", "header tag name");

            selectedCounterRegion = searchResultsView.targetView.standardHeaderView.selectedCounterView.$el.find(".csui-selected-counter-region>button");
            expect(isVisible(selectedCounterRegion[0])).toEqual(true, "selection counter visibility");
            expect($(selectedCounterRegion[0]).text().trim()).toEqual("Selected1", "selection counter text");

            testCommandElement = searchResultsView.targetView.standardHeaderView.toolbarView.$el.find('[data-csui-command="addrelationtest"]');
            expect(isVisible(testCommandElement[0])).toEqual(true, "test command visibility");
            expect(testCommandElement.text().trim()).toEqual(lang.ToolbarItemAddRelationSubmit, "test command text");

            done();
          });

          it('select page', function (done) {

            checkboxElements = searchResultsView.targetView.standardHeaderView._selectAllView.$el.find(".csui-checkbox");
            $(checkboxElements[0]).trigger('click');

            checkboxElements = searchResultsView.targetView.standardHeaderView._selectAllView.$el.find(".csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("true", "header check box");

            checkboxElements = searchResultsView.targetView.$el.find(".csui-search-item-check .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("true", "item check box");

            headerTitleElement = searchResultsView.headerView.$el.find(".csui-custom-search-title");
            expect(isVisible(headerTitleElement[0])).toEqual(true, "header title visibility");
            expect(headerTitleElement.text().trim()).toEqual("Test add relationships", "header title text");
            expect(headerTitleElement.length && headerTitleElement[0].tagName.toLowerCase()).toEqual("h2", "header tag name");

            selectedCounterRegion = searchResultsView.targetView.standardHeaderView.selectedCounterView.$el.find(".csui-selected-counter-region>button");
            expect(isVisible(selectedCounterRegion[0])).toEqual(true, "selection counter visibility");
            expect($(selectedCounterRegion[0]).text().trim()).toEqual("Selected10", "selection counter text");

            testCommandElement = searchResultsView.targetView.standardHeaderView.toolbarView.$el.find('[data-csui-command="addrelationtest"]');
            expect(isVisible(testCommandElement[0])).toEqual(true, "test command visibility");
            expect(testCommandElement.text().trim()).toEqual(lang.ToolbarItemAddRelationSubmit, "test command text");

            done();
          });

          it('deselect page', function (done) {

            checkboxElements = searchResultsView.targetView.standardHeaderView._selectAllView.$el.find(".csui-checkbox");
            $(checkboxElements[0]).trigger('click');

            checkboxElements = searchResultsView.targetView.standardHeaderView._selectAllView.$el.find(".csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "header check box");

            checkboxElements = searchResultsView.targetView.$el.find(".csui-search-item-check .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "item check box");

            headerTitleElement = searchResultsView.headerView.$el.find(".csui-custom-search-title");
            expect(isVisible(headerTitleElement[0])).toEqual(true, "header title visibility");
            expect(headerTitleElement.text().trim()).toEqual("Test add relationships", "header title text");
            expect(headerTitleElement.length && headerTitleElement[0].tagName.toLowerCase()).toEqual("h2", "header tag name");

            selectedCounterRegion = searchResultsView.targetView.standardHeaderView.selectedCounterView.$el.find(".csui-selected-counter-region>button");
            expect(isVisible(selectedCounterRegion[0])).toEqual(false, "selection counter visibility");

            testCommandElement = searchResultsView.targetView.standardHeaderView.toolbarView.$el.find('[data-csui-command="addrelationtest"]');
            expect(isVisible(testCommandElement[0])).toEqual(false, "test command visibility");

            done();
          });

        });

      });

      describe('TableViewTest', function () {

        var page1request, page1response;

        beforeAll(function (done) {
          page1request = new EventTracker();
          page1response = new EventTracker();
          testsetup(done);
        });

        afterAll(function (done) {
          teardown(done);
        });

        it('search setup page 1', function (done) {
          searchResultsView.collection.once("request", function () {
            page1response.track(searchResultsView.collection, "sync error");
            page1response.start();
          });

          page1request.track(searchResultsView.collection, "request");
          page1request.start(function () {
            searchResultsView.customSearchView.loadCustomSearch();
          });

          done();
        });

        it('search request page 1', function (done) {
          page1request.check(searchResultsView.collection, "request", done);
          page1request.timeout(done.fail);
        });

        it('search response page 1', function (done) {
          page1request.timeout(done.fail);
          page1response.check(searchResultsView.collection, "sync", done);
          page1response.check(searchResultsView.collection, "error", done.fail);
          page1response.timeout(done.fail);
        });

        it('table view is displayed', function (done) {
          switchResultView(done, "table");
        });

        it('table view exists', function (done) {
          expect(searchResultsView.targetView).toBeDefined();

          expect(searchResultsView.targetView.el.classList.contains('binf-list-group')).toBeFalsy();
          expect(searchResultsView.targetView.el.classList.contains('csui-nodetable')).toBeTruthy();
          done();
        });

        it('table view displays page 1', function (done) {
          var nameElements = searchResultsView.targetView.$el.find("tbody .csui-table-cell-name");
          expect(nameElements.length).toEqual(10);
          expect($(nameElements[0]).text().trim()).toEqual("Agnes Iams, 82009, US, Customer");
          done();
        });

        it('table view sorting drop down', function (done) {
          var sortSelectionElement = searchResultsView.headerView.$el.find(".csui-search-sorting .csui-search-sort-options > button");
          expect(sortSelectionElement.text().trim()).toEqual("Name", "sorting field");
          var sortDirectionElement = searchResultsView.headerView.$el.find(".csui-search-sorting .cs-sort-links .search-sort-btn");
          expect(sortDirectionElement.hasClass("icon-sortArrowUp")).toEqual(true, "sort direction is ascending");
          var sortOptionElements = searchResultsView.headerView.$el.find(".csui-search-sorting .csui-search-sort-options .csui-sort-option");
          expect(sortOptionElements.text().trim()).toEqual("NumberObject KeyStreetCityCountryPostal CodeIndustryStatusStageName");
          done();
        });

        describe('ItemSelect', function () {

          var checkboxElements, selectedCounterRegion, headerTitleElement, testCommandElement;

          beforeAll(function (done) {
            expect(searchResultsView.targetView && searchResultsView.targetView.$el).toBeTruthy();
            expect(searchResultsView.headerView && searchResultsView.headerView.$el).toBeTruthy();
            expect(searchResultsView.targetView._tableRowSelectionToolbarView && searchResultsView.targetView._tableRowSelectionToolbarView.$el).toBeTruthy();
            done();
          });

          it('check before select item', function (done) {

            checkboxElements = searchResultsView.targetView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "header check box");

            checkboxElements = searchResultsView.targetView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "item check box");

            headerTitleElement = searchResultsView.headerView.$el.find(".csui-custom-search-title");
            expect(isVisible(headerTitleElement[0])).toEqual(true, "header title visibility");
            expect(headerTitleElement.text().trim()).toEqual("Test add relationships", "header title text");
            expect(headerTitleElement.length && headerTitleElement[0].tagName.toLowerCase()).toEqual("h2", "header tag name");

            selectedCounterRegion = searchResultsView.targetView._tableRowSelectionToolbarView.$el.find(".csui-selected-counter-region>button");
            expect(isVisible(selectedCounterRegion[0])).toEqual(false, "selection counter visibility");

            testCommandElement = searchResultsView.targetView._tableRowSelectionToolbarView.$el.find('[data-csui-command="addrelationtest"]');
            expect(isVisible(testCommandElement[0])).toEqual(false, "test command visibility");

            done();
          });

          it('select item', function (done) {
            checkboxElements = searchResultsView.targetView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            $(checkboxElements[0]).trigger('click');
            waitFor(function () {
              var headerHeight = searchResultsView.headerView.$el.find(".csui-search-header").height();
              var toolbarHeight = searchResultsView.headerView.$el.find(".csui-table-rowselection-toolbar").height();
              return headerHeight === 0 && toolbarHeight >= 48;
            }, 1000, "header to disappear toolbar to appear").then(done, done.fail);
          });

          it('check after select item before show header', function (done) {

            checkboxElements = searchResultsView.targetView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("mixed", "header check box");

            checkboxElements = searchResultsView.targetView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("true", "item check box");

            headerTitleElement = searchResultsView.headerView.$el.find(".csui-custom-search-title");
            expect(isVisible(headerTitleElement[0])).toEqual(false, "header title visibility");
            expect(headerTitleElement.text().trim()).toEqual("Test add relationships", "header title text");
            expect(headerTitleElement.length && headerTitleElement[0].tagName.toLowerCase()).toEqual("h2", "header tag name");

            selectedCounterRegion = searchResultsView.targetView._tableRowSelectionToolbarView.$el.find(".csui-selected-counter-region>button");
            expect(isVisible(selectedCounterRegion[0])).toEqual(true, "selection counter visibility");
            expect($(selectedCounterRegion[0]).text().trim()).toEqual("Selected1", "selection counter text");

            testCommandElement = searchResultsView.targetView._tableRowSelectionToolbarView.$el.find('[data-csui-command="addrelationtest"]');
            expect(isVisible(testCommandElement[0])).toEqual(true, "test command visibility");
            expect(testCommandElement.text().trim()).toEqual(lang.ToolbarItemAddRelationSubmit, "test command text");

            done();
          });

          it('show header', function (done) {
            var toggleHeaderElement = searchResultsView.targetView._tableRowSelectionToolbarView.$el.find(".csui-condensed-header-toggle");
            $(toggleHeaderElement[0]).trigger('click');
            waitFor(function () {
              var headerHeight = searchResultsView.headerView.$el.find(".csui-search-header").height();
              var toolbarHeight = searchResultsView.headerView.$el.find(".csui-table-rowselection-toolbar").height();
              return headerHeight >= 48 && toolbarHeight >= 48;
            }, 1000, "header to reappear toolbar to stay visible").then(done, done.fail);
          });

          it('check after show header before deselect item', function (done) {

            checkboxElements = searchResultsView.targetView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("mixed", "header check box");

            checkboxElements = searchResultsView.targetView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("true", "item check box");

            headerTitleElement = searchResultsView.headerView.$el.find(".csui-custom-search-title");
            expect(isVisible(headerTitleElement[0])).toEqual(true, "header title visibility");
            expect(headerTitleElement.text().trim()).toEqual("Test add relationships", "header title text");
            expect(headerTitleElement.length && headerTitleElement[0].tagName.toLowerCase()).toEqual("h2", "header tag name");

            selectedCounterRegion = searchResultsView.targetView._tableRowSelectionToolbarView.$el.find(".csui-selected-counter-region>button");
            expect(isVisible(selectedCounterRegion[0])).toEqual(true, "selection counter visibility");
            expect($(selectedCounterRegion[0]).text().trim()).toEqual("Selected1", "selection counter text");

            testCommandElement = searchResultsView.targetView._tableRowSelectionToolbarView.$el.find('[data-csui-command="addrelationtest"]');
            expect(isVisible(testCommandElement[0])).toEqual(true, "test command visibility");
            expect(testCommandElement.text().trim()).toEqual(lang.ToolbarItemAddRelationSubmit, "test command text");

            done();
          });

          it('deselect item', function (done) {
            checkboxElements = searchResultsView.targetView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            $(checkboxElements[0]).trigger('click');
            waitFor(function () {
              var headerHeight = searchResultsView.headerView.$el.find(".csui-search-header").height();
              var toolbarHeight = searchResultsView.headerView.$el.find(".csui-table-rowselection-toolbar").height();
              return headerHeight >= 48 && toolbarHeight === 0;
            }, 1000, "header to stay visible toolbar to disappear").then(done, done.fail);
          });

          it('check after deselect item', function (done) {

            checkboxElements = searchResultsView.targetView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "header check box");

            checkboxElements = searchResultsView.targetView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "item check box");

            headerTitleElement = searchResultsView.headerView.$el.find(".csui-custom-search-title");
            expect(isVisible(headerTitleElement[0])).toEqual(true, "header title visibility");
            expect(headerTitleElement.text().trim()).toEqual("Test add relationships", "header title text");
            expect(headerTitleElement.length && headerTitleElement[0].tagName.toLowerCase()).toEqual("h2", "header tag name");

            selectedCounterRegion = searchResultsView.targetView._tableRowSelectionToolbarView.$el.find(".csui-selected-counter-region>button");
            expect(isVisible(selectedCounterRegion[0])).toEqual(false, "selection counter visibility");

            testCommandElement = searchResultsView.targetView._tableRowSelectionToolbarView.$el.find('[data-csui-command="addrelationtest"]');
            expect(isVisible(testCommandElement[0])).toEqual(false, "test command visibility");

            done();
          });

        });

        describe('PageSelect', function () {

          var checkboxElements, selectedCounterRegion, headerTitleElement, testCommandElement;

          beforeAll(function (done) {
            expect(searchResultsView.targetView && searchResultsView.targetView.$el).toBeTruthy();
            expect(searchResultsView.headerView && searchResultsView.headerView.$el).toBeTruthy();
            expect(searchResultsView.targetView._tableRowSelectionToolbarView && searchResultsView.targetView._tableRowSelectionToolbarView.$el).toBeTruthy();
            done();
          });

          it('check before preselect item', function (done) {

            checkboxElements = searchResultsView.targetView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "header check box");

            checkboxElements = searchResultsView.targetView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "item check box");

            headerTitleElement = searchResultsView.headerView.$el.find(".csui-custom-search-title");
            expect(isVisible(headerTitleElement[0])).toEqual(true, "header title visibility");
            expect(headerTitleElement.text().trim()).toEqual("Test add relationships", "header title text");
            expect(headerTitleElement.length && headerTitleElement[0].tagName.toLowerCase()).toEqual("h2", "header tag name");

            selectedCounterRegion = searchResultsView.targetView._tableRowSelectionToolbarView.$el.find(".csui-selected-counter-region>button");
            expect(isVisible(selectedCounterRegion[0])).toEqual(false, "selection counter visibility");

            testCommandElement = searchResultsView.targetView._tableRowSelectionToolbarView.$el.find('[data-csui-command="addrelationtest"]');
            expect(isVisible(testCommandElement[0])).toEqual(false, "test command visibility");

            done();
          });

          it('preselect item', function (done) {

            checkboxElements = searchResultsView.targetView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            $(checkboxElements[0]).trigger('click');
            waitFor(function () {
              var headerHeight = searchResultsView.headerView.$el.find(".csui-search-header").height();
              var toolbarHeight = searchResultsView.headerView.$el.find(".csui-table-rowselection-toolbar").height();
              return headerHeight === 0 && toolbarHeight >= 48;
            }, 1000, "header to disappear toolbar to appear").then(done, done.fail);

          });

          it('check after preselect item before select page', function (done) {

            checkboxElements = searchResultsView.targetView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("mixed", "header check box");

            checkboxElements = searchResultsView.targetView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("true", "item check box");

            headerTitleElement = searchResultsView.headerView.$el.find(".csui-custom-search-title");
            expect(isVisible(headerTitleElement[0])).toEqual(false, "header title visibility");

            selectedCounterRegion = searchResultsView.targetView._tableRowSelectionToolbarView.$el.find(".csui-selected-counter-region>button");
            expect(isVisible(selectedCounterRegion[0])).toEqual(true, "selection counter visibility");
            expect($(selectedCounterRegion[0]).text().trim()).toEqual("Selected1", "selection counter text");

            testCommandElement = searchResultsView.targetView._tableRowSelectionToolbarView.$el.find('[data-csui-command="addrelationtest"]');
            expect(isVisible(testCommandElement[0])).toEqual(true, "test command visibility");
            expect(testCommandElement.text().trim()).toEqual(lang.ToolbarItemAddRelationSubmit, "test command text");

            done();
          });

          it('select page', function (done) {
            checkboxElements = searchResultsView.targetView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            $(checkboxElements[0]).trigger('click');
            waitFor(function () {
              var headerHeight = searchResultsView.headerView.$el.find(".csui-search-header").height();
              var toolbarHeight = searchResultsView.headerView.$el.find(".csui-table-rowselection-toolbar").height();
              return headerHeight !== 0 || toolbarHeight === 0;
            }, 1000, "header to stay hidden toolbar to stay visible").then(done.fail, done);
          });

          it('check after select page before deselect page', function (done) {

            checkboxElements = searchResultsView.targetView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("true", "header check box");

            checkboxElements = searchResultsView.targetView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("true", "item check box");

            headerTitleElement = searchResultsView.headerView.$el.find(".csui-custom-search-title");
            expect(isVisible(headerTitleElement[0])).toEqual(false, "header title visibility");

            selectedCounterRegion = searchResultsView.targetView._tableRowSelectionToolbarView.$el.find(".csui-selected-counter-region>button");
            expect(isVisible(selectedCounterRegion[0])).toEqual(true, "selection counter visibility");
            expect($(selectedCounterRegion[0]).text().trim()).toEqual("Selected10", "selection counter text");

            testCommandElement = searchResultsView.targetView._tableRowSelectionToolbarView.$el.find('[data-csui-command="addrelationtest"]');
            expect(isVisible(testCommandElement[0])).toEqual(true, "test command visibility");
            expect(testCommandElement.text().trim()).toEqual(lang.ToolbarItemAddRelationSubmit, "test command text");

            done();
          });

          it('deselect page', function (done) {
            checkboxElements = searchResultsView.targetView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            $(checkboxElements[0]).trigger('click');
            waitFor(function () {
              var headerHeight = searchResultsView.headerView.$el.find(".csui-search-header").height();
              var toolbarHeight = searchResultsView.headerView.$el.find(".csui-table-rowselection-toolbar").height();
              return headerHeight >= 48 && toolbarHeight === 0;
            }, 1000, "header to reappear toolbar to disappear").then(done, done.fail);
          });

          it('check after deselect page', function (done) {

            checkboxElements = searchResultsView.targetView.$el.find("thead .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "header check box");

            checkboxElements = searchResultsView.targetView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
            expect($(checkboxElements[0]).attr("aria-checked")).toEqual("false", "item check box");

            headerTitleElement = searchResultsView.headerView.$el.find(".csui-custom-search-title");
            expect(isVisible(headerTitleElement[0])).toEqual(true, "header title visibility");
            expect(headerTitleElement.text().trim()).toEqual("Test add relationships", "header title text");
            expect(headerTitleElement.length && headerTitleElement[0].tagName.toLowerCase()).toEqual("h2", "header tag name");

            selectedCounterRegion = searchResultsView.targetView._tableRowSelectionToolbarView.$el.find(".csui-selected-counter-region>button");
            expect(isVisible(selectedCounterRegion[0])).toEqual(false, "selection counter visibility");

            testCommandElement = searchResultsView.targetView._tableRowSelectionToolbarView.$el.find('[data-csui-command="addrelationtest"]');
            expect(isVisible(testCommandElement[0])).toEqual(false, "test command visibility");

            done();
          });
        });

      });

      describe('ViewSwitchTest', function () {

        var page1request, page1response, page5request, page5response;

        beforeAll(function (done) {
          page1request = new EventTracker();
          page1response = new EventTracker();
          page5request = new EventTracker();
          page5response = new EventTracker();
          testsetup(done);
        });

        afterAll(function (done) {
          teardown(done);
        });

        it('search setup page 1', function (done) {
          searchResultsView.collection.once("request", function () {
            page1response.track(searchResultsView.collection, "sync error");
            page1response.start();
          });

          page1request.track(searchResultsView.collection, "request");
          page1request.start(function () {
            searchResultsView.customSearchView.loadCustomSearch();
          });

          done();
        });

        it('search request page 1', function (done) {
          page1request.check(searchResultsView.collection, "request", done);
          page1request.timeout(done.fail);
        });

        it('search response page 1', function (done) {
          page1request.timeout(done.fail);
          page1response.check(searchResultsView.collection, "sync", done);
          page1response.check(searchResultsView.collection, "error", done.fail);
          page1response.timeout(done.fail);
        });

        it('switch to table view', function (done) {
          switchResultView(done, "table");
        });

        it('table view displays page 1', function (done) {
          var nameElements = searchResultsView.targetView.$el.find("tbody .csui-table-cell-name");
          expect($(nameElements[0]).text().trim()).toEqual("Agnes Iams, 82009, US, Customer");
          done();
        });

        it('table view select first item', function (done) {
          var checkboxElements = searchResultsView.targetView.$el.find("tbody .csui-table-cell-_select .csui-checkbox");
          $(checkboxElements[0]).trigger('click');
          expect($(checkboxElements[0]).attr("aria-checked")).toEqual("true", "item check box");
          done();
        });

        it('search setup page 5', function (done) {
          searchResultsView.collection.once("request", function () {
            page5response.track(searchResultsView.collection, "sync error");
            page5response.start();
          });

          page5request.track(searchResultsView.collection, "request");
          page5request.start(function () {
            var pageBrowseElement5 = searchResultsView.$el.find(".csui-search-results-body .csui-pager .csui-pages [data-pageid=4]");
            $(pageBrowseElement5[0]).trigger('click');
          });

          done();
        });

        it('search request page 5', function (done) {
          page5request.check(searchResultsView.collection, "request", done);
          page5request.timeout(done.fail);
        });

        it('search response page 5', function (done) {
          page5request.timeout(done.fail);
          page5response.check(searchResultsView.collection, "sync", done);
          page5response.check(searchResultsView.collection, "error", done.fail);
          page5response.timeout(done.fail);
        });

        it('table view displays page 5', function (done) {
          var nameElements = searchResultsView.targetView.$el.find("tbody .csui-table-cell-name");
          expect($(nameElements[0]).text().trim()).toEqual("Hitech AG, 22767, DE, Customer");
          done();
        });

        it('back to standard view', function (done) {
          switchResultView(done, "standard");
        });

        it('standard view displays page 5', function (done) {
          var nameElements = searchResultsView.$el.find(".csui-search-results-body .csui-search-results-content .csui-result-list .csui-search-item-name");
          expect($(nameElements[0]).text().trim()).toEqual("Hitech AG, 22767, DE, Customer");
          done();
        });

        it('standard view select page 5', function (done) {
          var checkboxElements = searchResultsView.targetView.standardHeaderView._selectAllView.$el.find(".csui-checkbox");
          $(checkboxElements[0]).trigger('click');
          var selectedCounterRegion = searchResultsView.targetView.standardHeaderView.selectedCounterView.$el.find(".csui-selected-counter-region>button");
          expect($(selectedCounterRegion[0]).text().trim()).toEqual("Selected11", "selection counter text");
          done();
        });
        it('standard view command execution', function (done) {
          var deferred = $.Deferred();
          addRelatedItemTestCmd.once("command:execute", function (status, options) {
            deferred.resolve(status, options);
          });
          var testCommandLink = searchResultsView.targetView.standardHeaderView.toolbarView.$el.find('[data-csui-command="addrelationtest"]>a');
          $(testCommandLink[0]).trigger('click');
          deferred.promise().then(function (status, options) {
            expect(status.nodes.length).toEqual(11, "command nodes length");
            done();
          });
        });

      });

      describe('SearchSortTest', function () {

        var searchDErequest, sortCITYrequest, toggleSORTrequest;
        var searchDEresponse, sortCITYresponse, toggleSORTresponse;

        beforeAll(function (done) {
          searchDErequest = new EventTracker();
          searchDEresponse = new EventTracker();
          sortCITYrequest = new EventTracker();
          sortCITYresponse = new EventTracker();
          toggleSORTrequest = new EventTracker();
          toggleSORTresponse = new EventTracker();
          testsetup(done);
        });

        afterAll(function (done) {
          teardown(done);
        });

        it("prepare search Country DE", function (done) {
          searchResultsView.customSearchView.once("render:form", done);
          searchResultsView.customSearchView.customFormView.formView.model.get("data").search.wnf_att_yw39_7 = "DE";
          searchResultsView.customSearchView.customFormView.formView.model.trigger("change");
        });

        it('search DE setup', function (done) {
          searchResultsView.collection.once("request", function () {
            searchDEresponse.track(searchResultsView.collection, "sync error");
            searchDEresponse.start();
          });

          searchDErequest.track(searchResultsView.collection, "request");
          searchDErequest.start(function () {
            searchResultsView.customSearchView.loadCustomSearch();
          });

          done();
        });

        it('search DE request', function (done) {
          searchDErequest.check(searchResultsView.collection, "request", done);
          searchDErequest.timeout(done.fail);
        });

        it('search DE response', function (done) {
          searchDErequest.timeout(done.fail);
          searchDEresponse.check(searchResultsView.collection, "sync", done);
          searchDEresponse.check(searchResultsView.collection, "error", done.fail);
          searchDEresponse.timeout(done.fail);
        });

        it('switch to table view', function (done) {
          switchResultView(done, "table");
        });

        it('table view displays search result', function (done) {
          var nameElements = searchResultsView.targetView.$el.find("tbody .csui-table-cell-name");
          expect($(nameElements[0]).text().trim()).toEqual("Auto Klement, 81737, DE, Customer");
          done();
        });

        it('sort City setup', function (done) {
          searchResultsView.collection.once("request", function () {
            sortCITYresponse.track(searchResultsView.collection, "sync error");
            sortCITYresponse.start();
          });

          sortCITYrequest.track(searchResultsView.collection, "request");
          sortCITYrequest.start(function () {
            var sortOptionButton = searchResultsView.headerView.$el.find(".csui-search-sorting .csui-search-sort-options button");
            $(sortOptionButton[0]).trigger('click');
            var sortOptionElement = searchResultsView.headerView.$el.find(".csui-search-sorting .csui-search-sort-options a[data-csui-sortoption-id=wnf_att_yw39_6]");
            $(sortOptionElement[0]).trigger('click');
          });

          done();
        });

        it('sort City request', function (done) {
          sortCITYrequest.check(searchResultsView.collection, "request", done);
          sortCITYrequest.timeout(done.fail);
        });

        it('sort City response', function (done) {
          sortCITYrequest.timeout(done.fail);
          sortCITYresponse.check(searchResultsView.collection, "sync", done);
          sortCITYresponse.check(searchResultsView.collection, "error", done.fail);
          sortCITYresponse.timeout(done.fail);
        });

        it('table view displays sort result', function (done) {
          var nameElements = searchResultsView.targetView.$el.find("tbody .csui-table-cell-name");
          expect($(nameElements[1]).text().trim()).toEqual("CPG  Europa, 63067, DE, Customer");
          done();
        });

        it('switch to standard view', function (done) {
          switchResultView(done, "standard");
        });

        it('standard view displays sort result', function (done) {
          var nameElements = searchResultsView.$el.find(".csui-search-results-body .csui-search-results-content .csui-result-list .csui-search-item-name");
          expect($(nameElements[1]).text().trim()).toEqual("CPG  Europa, 63067, DE, Customer");
          done();
        });

        it('toggle Sort setup', function (done) {
          searchResultsView.collection.once("request", function () {
            toggleSORTresponse.track(searchResultsView.collection, "sync error");
            toggleSORTresponse.start();
          });

          toggleSORTrequest.track(searchResultsView.collection, "request");
          toggleSORTrequest.start(function () {
            var sortDirectionElement = searchResultsView.$el.find(".csui-search-results-body .csui-search-sorting .cs-sort-links a.search-sort-btn");
            $(sortDirectionElement[0]).trigger('click');
          });

          done();
        });

        it('toggle Sort request', function (done) {
          toggleSORTrequest.check(searchResultsView.collection, "request", done);
          toggleSORTrequest.timeout(done.fail);
        });

        it('toggle Sort response', function (done) {
          toggleSORTrequest.timeout(done.fail);
          toggleSORTresponse.check(searchResultsView.collection, "sync", done);
          toggleSORTresponse.check(searchResultsView.collection, "error", done.fail);
          toggleSORTresponse.timeout(done.fail);
        });

        it('standard view displays toggle result', function (done) {
          var nameElements = searchResultsView.$el.find(".csui-search-results-body .csui-search-results-content .csui-result-list .csui-search-item-name");
          expect($(nameElements[1]).text().trim()).toEqual("Becker AG, 12099, DE, Customer");
          done();
        });


      });

      describe('InitialSortOrderTest', function () {

        var page1request, page1response;

        beforeAll(function (done) {
          page1request = new EventTracker();
          page1response = new EventTracker();
          var orderBy = "wnf_att_yw39_6 desc"; // order by City descending
          testsetup(done,orderBy);
        });

        afterAll(function (done) {
          teardown(done);
        });

        it('search setup page 1', function (done) {
          searchResultsView.collection.once("request", function () {
            page1response.track(searchResultsView.collection, "sync error");
            page1response.start();
          });

          page1request.track(searchResultsView.collection, "request");
          page1request.start(function () {
            searchResultsView.customSearchView.loadCustomSearch();
          });

          done();
        });

        it('search request page 1', function (done) {
          page1request.check(searchResultsView.collection, "request", done);
          page1request.timeout(done.fail);
        });

        it('search response page 1', function (done) {
          page1request.timeout(done.fail);
          page1response.check(searchResultsView.collection, "sync", done);
          page1response.check(searchResultsView.collection, "error", done.fail);
          page1response.timeout(done.fail);
        });

        it('table view is displayed', function (done) {
          switchResultView(done, "table");
        });

        it('table view exists', function (done) {
          expect(searchResultsView.targetView).toBeDefined();

          expect(searchResultsView.targetView.el.classList.contains('binf-list-group')).toBeFalsy();
          expect(searchResultsView.targetView.el.classList.contains('csui-nodetable')).toBeTruthy();

          done();
        });

        it('table view sorting drop down', function (done) {
          var sortSelectionElement = searchResultsView.headerView.$el.find(".csui-search-sorting .csui-search-sort-options > button");
          expect(sortSelectionElement.text().trim()).toEqual("City", "sorting field");
          var sortDirectionElement = searchResultsView.headerView.$el.find(".csui-search-sorting .cs-sort-links .search-sort-btn");
          expect(sortDirectionElement.hasClass("icon-sortArrowDown")).toEqual(true, "sort direction is descending");
          done();
        });

      });

    });

  });
