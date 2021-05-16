/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone', 'csui/lib/marionette', 'csui/lib/jquery',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/connector',
  'csui/models/widget/search.results/search.results.model',
  'csui/utils/commands/collection/collect',
  'csui/utils/contexts/factories/search.query.factory',
  '../../../../utils/testutils/async.test.utils.js',
  './mock.collect.js',
  'csui/lib/binf/js/binf'
], function (Backbone, Marionette, $, PageContext, ConnectorFactory,
    SearchResultsCollection, CollectCommand, SearchQueryModelFactory, TestUtils, mock) {
  'use strict';

  describe('Collect Command', function () {
    var context, connector, searchQueryModel, searchResultsCollection;
    beforeAll(function () {
      $(document.body).empty();
      mock.enable();
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
      connector = context.getObject(ConnectorFactory);

    });

    afterAll(function () {
      TestUtils.cancelAllAsync();

      mock.disable();
      TestUtils.restoreEnvironment();
    });

    it('Execute collect command for one node and open node picker', function (done) {
      searchQueryModel = context.getObject(SearchQueryModelFactory);
      searchQueryModel.set({
        where: "*"
      });
      searchResultsCollection = new SearchResultsCollection({
        context: context
      }, {
        connector: connector,
        query: searchQueryModel
      });
      var status = {
        connector: connector,
        container: searchResultsCollection.models[0],
        context: context,
        nodes: searchResultsCollection,
        originatingView: {},
        collection: searchResultsCollection
      };

      searchResultsCollection.fetch().then(function () {
        status.nodes = new Backbone.Collection([status.nodes.models[0]]);
        new CollectCommand().execute(status);
      });
      TestUtils.asyncElement(document.body, '.csui-node-picker').done(
          function (el) {
            expect(el.length).toEqual(1);
            done();
          });

    });
    xit('Select Collection type as destination folder', function (done) {
      var dialog        = $('.binf-modal-content'),
          target        = $(
              '.binf-modal-content .list-content ul li:last-child span.csui-selectable'),
          collectButton = '.cs-add-button';
      expect($(collectButton).is(':disabled')).toBeTruthy();

      target.click();
      TestUtils.asyncElement(dialog, collectButton + ':disabled', true).done(function (el) {
        expect(el.length).toEqual(0);
        done();
      });
    });

    xit('Select Enterprise Workspace from location dropdown and  check for collection toolitem in the header tools', function (done) {
      var dialog = $('.binf-modal-content');
      var locationsMenu = dialog.find('.dropdown-locations');
      expect(locationsMenu.length).toEqual(1);
      locationsMenu.find('.binf-dropdown-toggle').trigger('click');

      var clickMenuItem = locationsMenu.find("ul.binf-dropdown-menu  li:first-child > a");

      clickMenuItem.trigger('click');
      TestUtils.asyncElement(document.body, ".csui-header-tools .csui-toolitem").done(
          function (el) {
            expect(el.length).toBeGreaterThan(0);
            done();
          });
    });

    xit('Select Collection from header toolitem and check for input name inline form',
        function (done) {
          var dialog = $('.binf-modal-content');
          var headerTools = dialog.find(
              '.csui-header-tools');
          headerTools.find('.csui-toolitem').trigger('click');

          TestUtils.asyncElement(document.body, ".csui-inlineform-input-name").done(
              function (el) {
                expect($(el).is(':visible')).toBeTruthy();
                done();
              });
        });

  });

});