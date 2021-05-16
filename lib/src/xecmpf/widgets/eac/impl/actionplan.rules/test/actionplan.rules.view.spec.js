/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'xecmpf/widgets/eac/impl/actionplan.rules/impl/actionplan.rules.form.model',
  'xecmpf/widgets/eac/impl/actionplan.rules/actionplan.rules.view',
  'xecmpf/widgets/eac/test/actionplan.mock',
  'csui/utils/testutils/async.test.utils'],
  function ($, _, Backbone, Marionette, PageContext, ActionPlanRulesModel, ActionPlanRulesView, mock, TestUtils) {
    describe('Action plan rules view', function () {
      var actionPlanRulesView,
        rulesFormModel,
        rulesSet,
        mockInst;
      beforeAll(function (done) {
        mockInst = mock();
        mockInst.enable();
        var $body = $('body'),
          mockContext = new PageContext({
            factories: {
              connector: {
                connection: {
                  url: 'http://server/otcs/cs/api/v1/',
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
        rulesFormModel = new ActionPlanRulesModel(undefined, {
          context: mockContext,
          eventModel: eventModel,
          collection: new Backbone.Collection([{
            sequence: 1,
            operand: '',
            operator: '',
            to: '',
            conjunction: ''
          }])
        });
        $body.append('<div id="sample-region"></div>');

        actionPlanRulesView = new ActionPlanRulesView({
          context: mockContext,
          eventModel: eventModel,
          mode: 'create',
          model: rulesFormModel,
          isNewActionPlan: !eventModel.get('plan_id')
        });
        actionPlanRulesView.render();
        contentRegion = new Marionette.Region({ el: '.sample-region' });
        contentRegion.show(actionPlanRulesView);
        TestUtils.asyncElement(actionPlanRulesView.$el, '.cs-array.alpaca-container-item').done(function (el) {
          rulesSet = actionPlanRulesView.$el.find('.cs-form-set');
          done();
        });
      });
      it('can be instantiated', function () {
        expect(actionPlanRulesView).toBeDefined();
      });
      it('isFormValid method should return true initially if form does not contain any value', function () {
        expect(actionPlanRulesView.isFormValid()).toBeTruthy();
      });
      it('getSubmitData method should return an empty array in case first row in the form does not contain any values', function () {
        var submitData = actionPlanRulesView.getSubmitData();
        expect(submitData).toEqual([]);
      });
      it('getSubmitData method should return JSON data of the form', function () {
        actionPlanRulesView.$el.find('div[data-alpaca-container-item-name="rulesSet_0_from"] .binf-dropdown-menu li:eq(2) a').trigger('click');
        actionPlanRulesView.$el.find('div[data-alpaca-container-item-name="rulesSet_0_operator"] .binf-dropdown-menu li:eq(2) a').trigger('click');
        var submitData = actionPlanRulesView.getSubmitData();
        expect(submitData).toEqual([{ from: 'perPersonUuid', operator: 'Not equal to', to: '', conjunction: '' }]);
      });      
      afterAll(function () {
        mockInst.disable();
        TestUtils.cancelAllAsync();
        actionPlanRulesView.destroy();
      });
    });
  });