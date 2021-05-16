/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/ancestors',
  'csui/utils/contexts/factories/node',
  'csui/utils/contexts/factories/next.node',
  'csui/controls/breadcrumbs/breadcrumbs.view',
  '../../../utils/testutils/async.test.utils.js',
  './breadcrumbs.mock.data.js', 'csui/lib/jquery.mockjax'
], function ($, Marionette, PageContext, AncestorsCollectionFactory,
    NodeModelFactory, NextNodeModelFactory, BreadCrumbsView, TestUtils, DataManager) {
  'use strict';

  describe("BreadCrumbCollectionView", function () {
    var pageContext, breadcrumbs, collection, breadCrumbEles, firstEle, lastEle;

    beforeAll(function () {
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
            attributes: {id: 3333}
          }
        }
      });

      DataManager.test.enable();
    });

    afterAll(function () {
      DataManager.test.disable();
    });

    beforeEach(function () {
      collection = pageContext.getCollection(AncestorsCollectionFactory);
      breadcrumbs = new BreadCrumbsView({
        context: pageContext,
        collection: collection
      });
    });

    it('can be instantiated and rendered', function () {
      expect(breadcrumbs).toBeDefined();
      expect(breadcrumbs.$el.length > 0).toBeTruthy();
      breadcrumbs.render();
      expect(breadcrumbs.$el.length > 0).toBeTruthy();
    });

    it('can load ancestors for current node', function (done) {
      pageContext
          .fetch()
          .then(function () {
            expect(breadcrumbs.completeCollection.length).toEqual(3);
            breadCrumbEles = breadcrumbs.$el.find('ol > li');
            done();
          });
    });

    describe('if the parent element is not wide enough', function () {

      var parent, region;

      beforeEach(function (done) {
        parent = $('<div>', {
          style: 'width: 624px'
        });
        region = new Marionette.Region({el: parent[0]});
        $(document.body).append(parent);
        region.show(breadcrumbs);

        var node = pageContext.getModel(NodeModelFactory);
        node.set('id', 1111);
        pageContext
            .fetch()
            .then(function () {
              breadcrumbs.refresh();
            })
            .done(done);
      });

      afterEach(function () {
        region.empty();
        parent.remove();
      });

      it('collapses a part of the breadcrumb to "..." popup menu', function () {
        expect(breadcrumbs.completeCollection.length)
            .not.toEqual(breadcrumbs.collection.length,
            'Some ancestors were collapsed to dropdown menu.');
      });

      it('key board accessibilty test among breadcrumbLinks', function() {
        var breadCrumbLinks =  breadcrumbs.$el.find('>li a'),
        lastEle = breadCrumbLinks.last();
        lastEle.trigger('focus');
        expect(document.activeElement).toBe(lastEle[0]);
        lastEle.trigger({type: 'keydown', keyCode: 38});
        var lastBeforeEle = breadCrumbLinks[breadCrumbLinks.length-2];
        expect(document.activeElement).toBe(lastBeforeEle);
        $(lastBeforeEle).trigger({type: 'keydown', keyCode: 39});
        expect(document.activeElement).toBe(lastEle[0]);
      });

      it('test window resize event', function () {
        breadcrumbs.options.noOfItemsToShow = 4;
        window.dispatchEvent(new Event('resize'));
      });

      it('test hide breadcrumb', function () {
       breadcrumbs.hide(true);
       expect(breadcrumbs.$el.is(':visible')).toBeFalsy();
       breadcrumbs.hide(false);
       expect(breadcrumbs.$el.is(':visible')).toBeTruthy();
      });

      it('test hide sub breadcrumb', function () {
        var dropdown = breadcrumbs.$el.find('li.binf-dropdown');
        dropdown.addClass('binf-open');
        breadcrumbs.hideSubCrumbs(true);
        expect(dropdown.hasClass('binf-open')).toBeFalsy();
       });

      it('renders URL of the target container in a collapsed link', function () {
        var href = breadcrumbs
            .$('li > ul.binf-dropdown-menu > li > a')
            .first()
            .attr('href');
        expect(/nodes\/\d+$/.test(href)).toBeTruthy();
      });

      it('navigates, when clicked on a collapsed link', function () {
        var link = breadcrumbs
                .$('li > ul.binf-dropdown-menu > li > a')
                .first(),
            nextId = parseInt(/nodes\/(\d+)$/.exec(link.attr('href'))[1]),
            nextNode = pageContext.getModel(NextNodeModelFactory);
        link.trigger('click');
        expect(nextNode.get('id')).toEqual(nextId);
      });

    });

  });

  describe("BreadCrumbCollectionView with options", function () {
    var pageContext, breadcrumbs, collection;

    beforeAll(function () {
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
            attributes: {id: 3333}
          }
        }
      });

      DataManager.test.enable();
    });

    afterAll(function () {
      DataManager.test.disable();
    });

    beforeEach(function () {
      collection = pageContext.getCollection(AncestorsCollectionFactory);
      breadcrumbs = new BreadCrumbsView({
        context: pageContext,
        collection: collection,
      });
    });

    it('Remove Ancestors To Number of Items To Show more than collection', function (done) {
        breadcrumbs.options.noOfItemsToShow = 4;
        pageContext
            .fetch()
            .then(function () {
              expect(breadcrumbs.collection.length).toEqual(3);
              done();
            });
      });

    it('Remove Ancestors To Number of Items To Show less than collection', function (done) {
      breadcrumbs.options.noOfItemsToShow = 2;
      pageContext
          .fetch()
          .then(function () {
            expect(breadcrumbs.collection.length).toEqual(breadcrumbs.options.noOfItemsToShow);
            done();
          });
    });
  });
});
