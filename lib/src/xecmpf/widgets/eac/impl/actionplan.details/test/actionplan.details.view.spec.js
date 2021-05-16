/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'xecmpf/widgets/eac/impl/actionplan.details/actionplan.details.view',
  'xecmpf/widgets/eac/test/actionplan.mock'
],
  function ($, _, Backbone, Marionette, PageContext, ActionPlanDetailsView, mock) {
    describe('Action plan details view', function () {
      var actionPlanDetailsView,
        mockInst;
      beforeAll(function () {
        mockInst = mock();
        mockInst.enable();
        var mockModel = new Backbone.Model({ 'event_id': 'com.successfactors.Employment.AssignmentInformation.Hire', 'event_name': 'ChangeInTitle', 'namespace': 'SuccessFactors', 'action_plan_count': 1, 'action_plans': [{ 'run_as_key': '18206', 'run_as_value': 'jbaker', 'process_mode': 'Synchronously', 'rules': [{ 'position': 1, 'operand': 'perPersonUuid', 'operator': 'Equal to', 'value': '2562', 'conjunction': 'And' }], 'actions': [{ 'position': 1, 'action_key': 'DocGenEventAction.Generate Document', 'attribute_mappings': [{ 'action_attr_id': 443, 'position': 1, 'mapping_method': 'Event Property', 'mapping_data': 'seqNumber', 'action_attr_name': 'DocumentType' }, { 'action_attr_id': 444, 'position': 2, 'mapping_method': 'Event Property', 'mapping_data': 'personIdExternal', 'action_attr_name': 'UserId' }] }], 'plan_id': 37, 'rule_id': 37 }], 'enableActionPlanCount': true, 'eventIndexCount': 2, 'has_action_plan': 'true', 'hasMetadataRow': false, 'inactive': true }),
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

        actionPlanDetailsView = new ActionPlanDetailsView({
          context: mockContext,
          model: mockModel,
          eventname: 'ChangeInTitle',
          namespace: 'SuccessFactors'
        });
        contentRegion = new Marionette.Region({ el: '#sample-region' });
        contentRegion.show(actionPlanDetailsView);
      });
      it('can be instantiated', function () {
        expect(actionPlanDetailsView).toBeDefined();
      });
      it('headerview should be instantiated in details view ', function () {
        expect(actionPlanDetailsView.headerView).toBeDefined();
      });
      it('listview should be instantiated in details view ', function () {
        expect(actionPlanDetailsView.actionPlanListView).toBeDefined();
      });
      it('updateContentView should set content view', function () {
        actionPlanDetailsView.updateContentView({ $el: $('<div></div>'), model: new Backbone.Model({ 'run_as_key': '18206', 'run_as_value': 'twalker', 'process_mode': 'Synchronously', 'rules': [], 'actions': [{ 'position': 1, 'action_key': 'CreateOrUpdateEventAction.Create Or Update Workspace', 'attribute_mappings': [{ 'action_attr_id': 451, 'position': 1, 'mapping_method': 'Event Property', 'mapping_data': 'startDate', 'action_attr_name': 'userId' }, { 'action_attr_id': 452, 'position': 2, 'mapping_method': 'Event Property', 'mapping_data': 'startDate', 'action_attr_name': 'userId' }] }, { 'position': 2, 'action_key': 'DocGenEventAction.Generate Document', 'attribute_mappings': [{ 'action_attr_id': 453, 'position': 1, 'mapping_method': 'Event Property', 'mapping_data': 'startDate', 'action_attr_name': 'DocumentType' }, { 'action_attr_id': 454, 'position': 2, 'mapping_method': 'Event Property', 'mapping_data': 'startDate', 'action_attr_name': 'userId' }] }, { 'position': 3, 'action_key': 'DocGenEventAction.Generate Document', 'attribute_mappings': [{ 'action_attr_id': 455, 'position': 1, 'mapping_method': 'Event Property', 'mapping_data': 'seqNumber', 'action_attr_name': 'DocumentType' }, { 'action_attr_id': 456, 'position': 2, 'mapping_method': 'Event Property', 'mapping_data': 'seqNumber', 'action_attr_name': 'UserId' }] }], 'plan_id': 55, 'rule_id': 55 }) });
        expect(actionPlanDetailsView.actionplanTabbedView).toBeDefined();
      });
      it('isContentViewCanbeUpdated method should be resolved if tabbedView does not contain any changes', function (done) {
        actionPlanDetailsView.actionplanTabbedView.tabbedViewContainsChanges = false;
        actionPlanDetailsView.isContentViewCanbeUpdated().then(function () {
          done();
        })
      });
      afterAll(function () {
        mockInst.disable();
        actionPlanDetailsView.destroy();
      })
    });
  });