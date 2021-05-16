/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/widgets/nodestable/nodestable.view', 'csui/utils/contexts/page/page.context',
  'csui/integration/folderbrowser/folderbrowser.widget',
  'csui/utils/contexts/factories/search.query.factory',
  'xecmpf/utils/commands/folderbrowse/test/nodestable.toolitems.mock.data',
  'csui/utils/contexts/factories/node'
], function (module, $, _, Marionette, NodesTableView, PageContext,
    FolderBrowserWidget, SearchQueryFactory, folderBrowserMock, NodeModelFactory) {
  'use strict';

  describe('FolderBrowserWidget', function () {
    var context, folderBrowser, tableRendered, queryChanged;

    beforeAll(function (done) {
      folderBrowserMock.test.enable();
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
          }
        }
      });
      require.config({
        config: {
          'xecmpf/utils/commands/folderbrowse/search.container': {
            enabled: true
          },
          'xecmpf/utils/commands/folderbrowse/open.full.page.workspace': {
            enabled: true,
            fullPageOverlay : true
          }
        }
      });
      folderBrowser = new FolderBrowserWidget({
        context: context,
        start: {id: 101},
        breadcrumb: false,
        placeholder: $('<div>').appendTo(document.body)
      });
      folderBrowser.show();

      folderBrowser.folderView.on("show", function () {
        setTimeout(function () {
          tableRendered = true;
          done();
        }, 1000);
      })

      context.getObject(SearchQueryFactory).once("change", function () {
        queryChanged = true;
      });

    });
    afterAll(function () {
      folderBrowserMock.test.disable();
    });
    it('has rendered nodes table', function (done) {
      expect(tableRendered).toBeTruthy();
      done();
    });

    it('has rendered search control', function (done) {
      expect(folderBrowser.folderView.$el.find("#SearchFromHere").length).toBeGreaterThan(0);
      done();
    });

    it('has rendered page expansion control', function (done) {
      expect(folderBrowser.folderView.$el.find("#WorkspacePage").length).toBeGreaterThan(0);
      done();
    });

    it('has displayed search input',
        function (done) {
          folderBrowser.folderView.$el.find(".csui-search-button .icon-search").trigger("click");
          setTimeout(function () {
            expect(folderBrowser.folderView.$el.find(
                ".csui-search-button .csui-input").length).toBeGreaterThan(0);
            done();
          }, 2000);

        });

    it('has displayed search results view',
        function (done) {
          folderBrowser.folderView.$el.find(".csui-search-button .csui-input").val("*");
          folderBrowser.folderView.$el.find(".csui-search-button .csui-header-search-icon").trigger("click");
          setTimeout(function () {
            expect(queryChanged).toBeTruthy();
            expect(folderBrowser.folderView.$el.find(
                ".cs-search-results-wrapper").length).toBeGreaterThan(0);
            done();
          }, 2000);

        });

    it('has displayed nodes table view',
        function (done) {
          folderBrowser.folderView.$el.find(".cs-search-results-wrapper .arrow_back").trigger("click");
          setTimeout(function () {
            expect(folderBrowser.folderView.$el.find(".cs-search-results-wrapper").length).toBe(0);
            expect(folderBrowser.folderView.$el.find(".csui-nodestable").is(":visible")).toBe(true);
            done();
          }, 2000);
        });
  });

});
