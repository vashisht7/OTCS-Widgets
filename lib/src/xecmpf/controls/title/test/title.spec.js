/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/lib/backbone',
  'xecmpf/controls/title/title.view'
], function ($, _, Marionette, Backbone, TitleView) {

  describe("TitleView", function () {
    var titleView;

    beforeAll(function (done) {

      titleView = new TitleView({
        icon: 'title-assignments',
        title: 'Title Control'
      });
      titleView.render();
      $('body').append(titleView.$el);
      done();
    });

    it("can be instantiated", function () {
      expect(titleView instanceof TitleView).toBeTruthy();
    });

    it("has Title icon and name", function (done) {

      var el = titleView.$el;
      var titleIcon = el.find('.tile-type-icon');
      var titleName = el.find('.title-name');

      expect(titleIcon.length).toBeGreaterThan(0);
      expect(titleName.length).toBeGreaterThan(0);

      var titleNameValue = titleName.find('.title-name-block');
      expect(titleNameValue.text()).toEqual('Title Control');

      done();
    });

  });

});
