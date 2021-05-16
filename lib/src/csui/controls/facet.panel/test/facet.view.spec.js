/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/controls/facet.panel/facet.panel.view',
  "csui/utils/contexts/factories/node",
  'csui/utils/contexts/factories/connector',
  'csui/models/node/node.facet2.factory',
  './facet.mock.data.js',
  "csui/lib/jquery.simulate"
], function (_, $, Marionette, PageContext, FacetPanelView, NodeFactory,
    ConnectorFactory, Facet2CollectionFactory, mockData) {
  "use strict";

  describe('Facet View Spec', function () {

    var facetPanelView;

    beforeEach(function (done) {
      mockData.enable();

      var context = new PageContext({
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
            attributes: {id: 2000}
          }
        }
      });

      var facetCollection = context.getCollection(Facet2CollectionFactory, {
            options: {
              itemsToShow: 5
            }}),
          facetFetching   = facetCollection.fetch()
              .then(function () {
                var facetView = $(
                    '<div class="csui-table-facetview" style="height:400px; width:200px">');
                $('body').append(facetView);

                var factPanelRegion = new Marionette.Region({
                  el: ".csui-table-facetview"
                });
                facetPanelView = new FacetPanelView({
                  collection: facetCollection
                });
                factPanelRegion.show(facetPanelView);
                done();
              })
              .fail(function () {
                expect(facetFetching.state()).toBe('resolved', "facet fetch did not complete");
              });
    });

    afterEach(function () {
      facetPanelView.destroy();

      mockData.disable();
    });

    it('show 1 facet with 5 filters and another with 5 too', function (done) {
      expect($('.csui-facet').length).toBe(2);
      expect($('.csui-facet').first().find('.csui-facet-item').length).toBe(5);
      expect($('.csui-facet').first().next().find('.csui-facet-item').length).toBe(5);
      expect($('.csui-facet .header-label').first().text()).toBe('Content Type');
      done();
    });

    describe('test more options', function () {

      it('facet with 6 plus filters has a more options', function (done) {
        expect($('.csui-facet').first().find('.csui-more-text').length).toBe(1);
        expect($('.csui-facet').first().next().find('.csui-more-text').length).toBe(0);
        done();
      });

      it('click on more shows all items', function (done) {
        expect($('.csui-facet').first().find('.csui-facet-item').length).toBe(5);
        expect($('.csui-facet').first().find('.csui-more-text').text()).toBe('Show more');
        $('.csui-facet').first().find('.csui-filter-more').trigger('click');
        expect($('.csui-facet').first().find('.csui-more-text').text()).toBe('Show less');
        expect($('.csui-facet').first().find('.csui-facet-item').length).toBe(6);
        done();
      });

      it('click on Less shows only 5 items', function (done) {
        $('.csui-facet').first().find('.csui-filter-more').trigger('click');

        expect($('.csui-facet').first().find('.csui-facet-item').length).toBe(6);
        $('.csui-facet').first().find('.csui-filter-more').trigger('click');
        expect($('.csui-facet').first().find('.csui-more-text').text()).toBe('Show more');
        expect($('.csui-facet').first().find('.csui-facet-item').length).toBe(5);
        done();
      });

      it('test cancel filter', function () {
        $('.csui-facet').first().find('button').first().trigger('click');
        expect($('.csui-facet').eq(0).find(
            '.csui-facet-controls.csui-multi-select .csui-clear').length).toBe(1);
        $('.csui-facet').eq(0).find(
            '.csui-facet-controls.csui-multi-select .csui-clear').trigger('click');
        expect($('.csui-facet').eq(0).find(
            '.csui-facet-controls.csui-multi-select .csui-clear').length).toBe(0);
      });

      it('click on facet header to hide and show facet content', function () {
        var faceContentEle = $('.csui-facet').eq(0).find('.csui-facet-content.binf-hidden');
        expect(faceContentEle.length).toBe(0);
        $('.csui-facet').eq(0).find('.csui-facet-header').trigger('click', function() {
          expect(faceContentEle.length).toBe(1);
        });
        $('.csui-facet').eq(0).find('.csui-facet-header').trigger('click', function() {
          expect(faceContentEle.length).toBe(0);
        });
      });
    });

    describe('test clicking on checkbox', function () {
      var itFlags = [false, false, false, false, false];

      it('click on checkbox displays apply/control options and disables all other facets',
          function (done) {
            expect($('.csui-facet-content.facet-disabled').length).toBe(0);
            expect($('.csui-facet').first().find(
                '.csui-facet-controls.csui-multi-select').length).toBe(0);
            $('.csui-facet').first().find('button').first().trigger('click');
            expect($('.csui-facet').first().find(
                '.csui-facet-controls.csui-multi-select').length).toBe(1);
            expect($('.csui-facet-content.facet-disabled').length).toBe(1);
            done();
          });

      it('keydown on checkbox displays apply/control options and disables all other facets',
          function () {
            expect($('.csui-facet-content.facet-disabled').length).toBe(0);
            expect($('.csui-facet').eq(0).find(
                '.csui-facet-controls.csui-multi-select').length).toBe(0);
            var facetBtnEle = $('.csui-facet').first().find('button').first();
            facetBtnEle.trigger('focus');
            facetBtnEle.trigger({type: 'keyup', keyCode: 13});
            expect($('.csui-facet').first().find(
                '.csui-facet-controls.csui-multi-select').length).toBe(1);
            expect($('.csui-facet-content.facet-disabled').length).toBe(1);
            facetBtnEle.trigger({type: 'keyup', keyCode: 32});
            facetBtnEle.trigger('blur');
            expect($('.csui-facet').eq(0).find(
                '.csui-facet-controls.csui-multi-select').length).toBe(0);
            expect($('.csui-facet-content.facet-disabled').length).toBe(0);
          });

      it('selecting 5 checkboxes disables remaining facet filters', function (done) {
        $('.csui-facet').first().find('.csui-filter-more').trigger('click');

        $('.csui-facet').first().find('button').first().trigger('click');
        for (var i = 1; i < 5; i++) {
          $('.csui-facet').first().find('button').eq(i).trigger('click');
        }
        expect($('.csui-facet').first().find('.csui-facet-item-checkbox.binf-disabled').length).toBe(1);
        done();
      });

      it('de-selecting one of 5 items re-enables remaining facet filters', function (done) {
        $('.csui-facet').first().find('.csui-filter-more').trigger('click');

        $('.csui-facet').first().find('button').first().trigger('click');
        for (var i = 1; i < 5; i++) {
          $('.csui-facet').first().find('button').eq(i).trigger('click');
        }

        $('.csui-facet').first().find('button').eq(4).trigger('click');
        expect($('.csui-facet').first().find('.csui-facet-item.binf-disabled').length).toBe(0);
        itFlags[2] = true;
        done();
      });
    });

  });
});
