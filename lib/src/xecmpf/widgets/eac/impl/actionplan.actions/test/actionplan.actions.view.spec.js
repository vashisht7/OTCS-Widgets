/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'xecmpf/widgets/eac/impl/actionplan.actions/actionplan.actions.view',
  'xecmpf/widgets/eac/test/actionplan.mock',
  'csui/utils/testutils/async.test.utils'],
  function ($, _, Backbone, Marionette, PageContext, ActionPlanActionsView, mock, TestUtils) {
    describe('Action plan actions view', function () {
      var actionPlanActionsView,
        actionsSet,
        mockInst;
      beforeAll(function (done) {
        mockInst = mock();
        mockInst.enable();
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
          eventModel = new Backbone.Model({ namespace: 'SuccessFactors', event_name: 'ChangeInTitle' }),
          contentRegion;
        $body.append('<div id="sample-region"></div>');

        actionPlanActionsView = new ActionPlanActionsView({
          context: mockContext,
          eventModel: eventModel
        });
        actionPlanActionsView.render();
        contentRegion = new Marionette.Region({ el: '#sample-region' });
        contentRegion.show(actionPlanActionsView);
        TestUtils.asyncElement(actionPlanActionsView.$el, '.cs-array.alpaca-container-item').done(function (el) {
          actionsSet = actionPlanActionsView.$el.find('.cs-form-set');
          done();
        });
      });
      it('can be instantiated', function () {
        expect(actionPlanActionsView).toBeDefined();
      });
      it('getSubmitData method should provide form details entered', function () {
        actionsSet.find('[data-alpaca-container-item-name="actionsData_0_action"] .binf-dropdown-menu li:eq(1) a').trigger('click');
        expect(actionPlanActionsView.getSubmitData()).toEqual([{ action: 'CreateOrUpdateEventAction.Create Or Update Workspace', 'CreateOrUpdateEventAction.Create Or Update Workspace_fields': { actionattributes: { parametername: 'Parameter name', sourcelabel: 'Source', valuelabel: 'Value' }, boType: { actionattrname: '', source: '' }, userId: { actionattrname: '', source: '' } } }]);
      });
      afterAll(function () {
        mockInst.disable();
        TestUtils.cancelAllAsync();
        actionPlanActionsView.destroy();
      });
    });
  });