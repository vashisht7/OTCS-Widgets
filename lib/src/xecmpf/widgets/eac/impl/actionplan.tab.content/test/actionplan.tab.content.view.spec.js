/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'xecmpf/widgets/eac/impl/actionplan.tab.content/actionplan.tab.content.view',
  'xecmpf/widgets/eac/test/actionplan.mock',
  'csui/utils/testutils/async.test.utils'
],
  function ($, _, Backbone, Marionette, PageContext, ActionPlanTabContentView, mock, TestUtils) {
    describe('Action plan tabbed content view', function () {
      var actionPlanTabContentView,
        mockInst;
      beforeAll(function (done) {
        mockInst = mock();
        mockInst.enable();
        var mockModel = new Backbone.Model({ 'event_id': 'com.successfactors.Employment.AssignmentInformation.Hire', 'event_name': 'ChangeInTitle', 'namespace': 'SuccessFactors', 'plan_id': '1122', 'action_plan_count': 1, 'action_plans': [{ 'run_as_key': '18206', 'run_as_value': 'jbaker', 'process_mode': 'Synchronously', 'rules': [{ 'position': 1, 'operand': 'perPersonUuid', 'operator': 'Equal to', 'value': '2562', 'conjunction': 'And' }], 'actions': [{ 'position': 1, 'action_key': 'DocGenEventAction.Generate Document', 'attribute_mappings': [{ 'action_attr_id': 443, 'position': 1, 'mapping_method': 'Event Property', 'mapping_data': 'seqNumber', 'action_attr_name': 'DocumentType' }, { 'action_attr_id': 444, 'position': 2, 'mapping_method': 'Event Property', 'mapping_data': 'personIdExternal', 'action_attr_name': 'UserId' }] }], 'plan_id': 37, 'rule_id': 37 }], 'enableActionPlanCount': true, 'eventIndexCount': 2, 'has_action_plan': 'true', 'hasMetadataRow': false, 'inactive': true }),
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
          $body = $('body'),
          contentRegion;

        $body.append('<div id="sample-region"></div>');

        actionPlanTabContentView = new ActionPlanTabContentView({
          context: mockContext,
          node: mockModel,
          eventname: 'ChangeInTitle',
          namespace: 'SuccessFactors',
          actionplanSettingsView: this
        });
        contentRegion = new Marionette.Region({ el: '#sample-region' });
        contentRegion.show(actionPlanTabContentView);
        TestUtils.asyncElement(actionPlanTabContentView.$el, '.cs-array.alpaca-container-item').done(function (el) {
          done();
        });
      });
      it('can be instantiated', function () {
        expect(actionPlanTabContentView).toBeDefined();
      });
      it('getGeneralInformation should form an object with general information', function () {
        var generalInformation = actionPlanTabContentView.getGeneralInformation();
        expect(generalInformation).toEqual({ event_id: 'com.successfactors.Employment.AssignmentInformation.Hire', namespace: 'SuccessFactors', event_name: 'ChangeInTitle', rule_id: undefined, plan_id: '1122' });
      });
      it('makeActionPlanServiceCall should trigger refresh:current:action:plan:item on successful save', function (done) {
        spyOn(actionPlanTabContentView, 'getFormsData').and.returnValue({});
        actionPlanTabContentView.$el.find('[data-alpaca-container-item-name="actionsData_0_action"] .binf-dropdown-menu li:eq(1) a').trigger('click');
        actionPlanTabContentView.makeActionPlanServiceCall();
        actionPlanTabContentView.listenTo(actionPlanTabContentView, 'refresh:current:action:plan:item', function () {
          done();
        });
      });
      afterAll(function () {
        mockInst.disable();
        TestUtils.cancelAllAsync();
        actionPlanTabContentView.destroy();
      })
    });
  });