/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'xecmpf/widgets/eac/impl/actionplan.tab.content/actionplan.tabbed.view',
  'xecmpf/widgets/eac/test/actionplan.mock'
],
  function ($, _, Backbone, Marionette, PageContext, ActionPlanTabbedView, mock) {
    describe('Action plan tabbed view', function () {
      var actionPlanTabbedView,
        mockInst;
      beforeAll(function () {
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

        actionPlanTabbedView = new ActionPlanTabbedView({
          context: mockContext,
          model: mockModel,
          eventname: 'ChangeInTitle',
          namespace: 'SuccessFactors'
        });
        contentRegion = new Marionette.Region({ el: '#sample-region' });
        contentRegion.show(actionPlanTabbedView);
      });
      it('can be instantiated', function () {
        expect(actionPlanTabbedView).toBeDefined();
      });
      it('save button should be in disabled state initially', function () {
        var saveButton = actionPlanTabbedView.$el.find('.xecmpf-eac-save-actionplan');
        expect(actionPlanTabbedView.tabbedViewContainsChanges).toBeFalsy();
        expect(saveButton.prop('disabled')).toBeTruthy();
      });
      it('save button should be enabled on form changes', function () {
        actionPlanTabbedView.actionPlanContentView.tabContent.children.findByIndex(0).content.trigger('change:field');
        expect(actionPlanTabbedView.tabbedViewContainsChanges).toBeTruthy();
        var saveButton = actionPlanTabbedView.$el.find('.xecmpf-eac-save-actionplan');
        expect(saveButton.prop('disabled')).toBeFalsy();
      });
      it('save button should be disabled on successful save', function (done) {
        var saveButton = actionPlanTabbedView.$el.find('.xecmpf-eac-save-actionplan');
        actionPlanTabbedView.actionPlanContentView.tabContent.children.findByIndex(0).content.trigger('change:field');
        expect(actionPlanTabbedView.tabbedViewContainsChanges).toBeTruthy();
        spyOn(actionPlanTabbedView.actionPlanContentView, 'saveActionPlanContent').and.returnValue(Promise.resolve());
        actionPlanTabbedView.saveEventActionPlan();
        setTimeout(function () {
          expect(actionPlanTabbedView.tabbedViewContainsChanges).toBeFalsy();
          expect(saveButton.prop('disabled')).toBeTruthy();
          done();
        }, 0);
      });
      afterAll(function () {
        mockInst.disable();
        actionPlanTabbedView.destroy();
      });
    });
  });