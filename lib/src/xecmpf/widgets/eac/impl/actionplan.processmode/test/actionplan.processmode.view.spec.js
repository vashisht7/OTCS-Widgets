/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'xecmpf/widgets/eac/impl/actionplan.processmode/impl/actionplan.processmode.form.model',
  'xecmpf/widgets/eac/impl/actionplan.processmode/actionplan.processmode.view',
  'csui/utils/testutils/async.test.utils'],
  function ($, _, Backbone, Marionette, PageContext, ActionPlanProcessModeModel, ActionPlanProcessModeView, TestUtils) {
    describe('Action plan process mode view', function () {
      var actionPlanProcessModeView,
        processModeGroup;
      beforeAll(function (done) {
        var $body = $('body'),
          mockContext = new PageContext({
            factories: {
              connector: {
                connection: {
                  url: 'http://server/otcs/cs/api/v2/',
                  supportPath: '/support',
                  session: {
                    ticket: 'dummy'
                  }
                }
              },
              node: {
                attributes: { id: 51209, type: 848 }
              }
            }
          }),
          contentRegion;
        $body.append('<div id="sample-region"></div>');

        actionPlanProcessModeView = new ActionPlanProcessModeView({
          mode: 'create',
          model: new ActionPlanProcessModeModel(),
          context: mockContext
        });
        actionPlanProcessModeView.render();
        contentRegion = new Marionette.Region({ el: '#sample-region' });
        contentRegion.show(actionPlanProcessModeView);
        TestUtils.asyncElement(actionPlanProcessModeView.$el, '.alpaca-container-item').done(function (el) {
          processModeGroup = el;
          done();
        });
      });
      it('can be instantiated', function () {
        expect(actionPlanProcessModeView).toBeDefined();
      });
      afterAll(function () {
        TestUtils.cancelAllAsync();
        actionPlanProcessModeView.destroy();
      });
    });
  });