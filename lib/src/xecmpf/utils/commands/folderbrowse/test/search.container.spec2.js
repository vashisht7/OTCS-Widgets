/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/utils/contexts/page/page.context',
  'csui/utils/commands',
  "xecmpf/utils/commands/folderbrowse/search.container",
  'csui/utils/contexts/factories/search.query.factory',
  'csui/utils/contexts/factories/node'

], function (module, $, _, PageContext, commands,
    SearchWorkspaceCommand, SearchQueryFactory, NodeModelFactory) {
  'use strict';

  describe('SearchWorkspace', function () {

    var searchCommand, context, node, status, originalWindowOpen, openedWindow, queryChanged, searchQuery = "*";

    beforeAll(function () {
      $('<div class="csui-search-button"></div>').appendTo(document.body);

      searchCommand = commands.get('SearchFromHere');
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
            attributes: {
              id: 2000
            }
          }
        }
      });
      node = context.getObject(NodeModelFactory),
          status = {
            context: context
          }

      context.getObject(SearchQueryFactory).once("change", function () {
        queryChanged = true;
      });

    });

    afterAll(function () {
      $(".csui-search-button").remove();
    });

    it('is registered by default', function () {
      expect(searchCommand).toBeDefined();
    });

    it('is not enabled by default', function () {
      expect(searchCommand.enabled()).toBeFalsy();
    });

    it('is enabled based on module configuration', function () {
      require.config({
        config: {
          'xecmpf/utils/commands/folderbrowse/search.container': {
            enabled: true
          }
        }
      });
      expect(searchCommand.enabled(status)).toBeTruthy();
    });

    it('has rendered search widget successfully', function (done) {
      searchCommand.execute(status, {el: '.csui-search-button', context: context}).done(
          function () {
            expect($(".csui-search-input-container").length).toBeGreaterThan(0);
            done();
          });
    });

    it('has no slice  popover', function (done) {
      expect($(".csui-search-box-slice-popover").length).toBe(0);
      done();
    });

    it('has no searchfromhere popover', function (done) {
      expect($(".csui-search-options-dropdown").length).toBe(0);
      done();
    });

    it('has executed search query', function (done) {
      $(".csui-input").val(searchQuery);
      $(".csui-header-search-icon").trigger("click");
      expect(queryChanged).toBeTruthy();
      done();
    });

  });

});
