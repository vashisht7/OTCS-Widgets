/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/widgets/navigation.header/controls/favorites/favorites.view',
  'csui/utils/contexts/page/page.context',
  '../../../../favorites/test/favorites2.mock.data2.js'
], function ($, _, Marionette, FavoritesButtonView, PageContext, mock) {

  describe("Favorites on Navigation Header", function () {

    var context, favoritesView, el, region;

    beforeAll(function () {
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
      favoritesView = new FavoritesButtonView({
        context: context
      });

      el = $('<div>', {id: 'target'});
      $('body').append(el);
      region = new Marionette.Region({
        el: el
      });
      region.show(favoritesView);
    });

    it("should open favorites dropdown on clicking favorite Button", function (done) {
      favoritesView.ui.favoritesButtonContainer.click();
      expect(favoritesView.$el.find('.csui-favorites-view-container:visible').length).toEqual(1);
      done();
    });

    it("should close favorites dropdown on clicking favorite Button", function (done) {
      favoritesView.ui.favoritesButtonContainer.click();
      expect(favoritesView.$el.find('.csui-favorites-view-container:visible').length).toEqual(0);
      done();
    });

    afterAll(function () {
      mock.disable();
      favoritesView.destroy();
    });
  });
});