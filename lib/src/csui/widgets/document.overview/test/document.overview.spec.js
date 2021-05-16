/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/widgets/document.overview/document.overview.view',
  'csui/utils/contexts/page/page.context', './document.overview.mock.data.js',
  'csui/utils/contexts/factories/node',
  "../../../utils/testutils/async.test.utils.js"
], function (Marionette, _, $, DocumentOverviewView, PageContext, mock, NodeModelFactory, TestUtils) {

    describe('given configuration', function () {
      var documentOverview, pageContext;
      beforeAll(function (done) {
        TestUtils.restoreEnvironment();
        mock.enable();
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
            }
          }
        });
        var node = pageContext.getModel(NodeModelFactory, {
          attributes: { id: 26820417 },
          temporary: true
        });
        node.fetch().done(function (){
          documentOverview = new DocumentOverviewView({
            context: pageContext,
            data: {
              showOptionsDropDown: true
            },
            node: node
          });
          documentOverview.once('render', function () {
              setTimeout(done);
          });
          new Marionette.Region({
            el: document.body
          }).show(documentOverview);
          pageContext.fetch().done();
        });
      });
      afterAll(function () {
        mock.disable();
        documentOverview.destroy();
        TestUtils.cancelAllAsync();
        TestUtils.restoreEnvironment();
      });
      it('can be constructed', function () {
        expect(documentOverview instanceof DocumentOverviewView).toBeTruthy();
      });
      it('should define widget', function() {
        expect(documentOverview).toBeDefined();
      });
      it('should open the dropdown', function(done) {
        var dropdownButton=documentOverview.$('.binf-dropdown>button');
        dropdownButton.trigger('click');
        TestUtils.asyncElement(documentOverview.$el, '.binf-dropdown.binf-open').done(function (ele) {
          expect(ele.is(":visible")).toBeTruthy();
          done();
        });
      });
      it('should open the favorites view', function (done) {
        var favoritesView=documentOverview.$('.csui-favorite-star.csui-acc-focusable');
        favoritesView.trigger('click');
        TestUtils.asyncElement('body', '.binf-popover-content').done(function (ele) {
          expect(ele.is(":visible")).toBeTruthy();
          done();
        });
      });
   });
  });
