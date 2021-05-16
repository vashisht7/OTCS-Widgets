/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'xecmpf/widgets/eac/impl/actionplan.header/actionplan.header.view'],
  function ($, _, Backbone, Marionette, PageContext, ActionPlanHeaderView) {
    describe('Action plan header view', function () {
      var actionPlanHeaderView;
      beforeAll(function () {
        var $body = $('body'), contentRegion;
        $body.append('<div id="sample-region"></div>');

        actionPlanHeaderView = new ActionPlanHeaderView({
          model: new Backbone.Model({ /*mock model*/ })
        });
        contentRegion = new Marionette.Region({ el: '#sample-region' });
        contentRegion.show(actionPlanHeaderView);
      });
      it('can be instantiated', function () {
        expect(actionPlanHeaderView).toBeDefined();
      });
      it('click on back button should trigger an event', function (done) {
        actionPlanHeaderView.listenTo(actionPlanHeaderView, 'actionplan:click:back', function () {
          done();
        });
        actionPlanHeaderView.$el.find('.cs-go-back').trigger('click');
      });
      afterAll(function() {
        actionPlanHeaderView.destroy();
      });
    });
  });