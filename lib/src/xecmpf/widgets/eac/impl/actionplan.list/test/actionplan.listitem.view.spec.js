/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'xecmpf/widgets/eac/impl/actionplan.list/actionplan.listitem.view'],
  function ($, _, Backbone, Marionette, PageContext, ActionPlanListItemView) {
    describe('Action plan list item view', function () {
      var actionPlanListItemView;
      beforeAll(function () {
        var mockModel = new Backbone.Model({ 'run_as_key': '18206', 'run_as_value': 'twalker', 'process_mode': 'Synchronously', 'rules': [], 'actions': [{ 'position': 1, 'action_key': 'CreateOrUpdateEventAction.Create Or Update Workspace', 'attribute_mappings': [{ 'action_attr_id': 451, 'position': 1, 'mapping_method': 'Event Property', 'mapping_data': 'startDate', 'action_attr_name': 'userId' }, { 'action_attr_id': 452, 'position': 2, 'mapping_method': 'Event Property', 'mapping_data': 'startDate', 'action_attr_name': 'userId' }] }, { 'position': 2, 'action_key': 'DocGenEventAction.Generate Document', 'attribute_mappings': [{ 'action_attr_id': 453, 'position': 1, 'mapping_method': 'Event Property', 'mapping_data': 'startDate', 'action_attr_name': 'DocumentType' }, { 'action_attr_id': 454, 'position': 2, 'mapping_method': 'Event Property', 'mapping_data': 'startDate', 'action_attr_name': 'userId' }] }, { 'position': 3, 'action_key': 'DocGenEventAction.Generate Document', 'attribute_mappings': [{ 'action_attr_id': 455, 'position': 1, 'mapping_method': 'Event Property', 'mapping_data': 'seqNumber', 'action_attr_name': 'DocumentType' }, { 'action_attr_id': 456, 'position': 2, 'mapping_method': 'Event Property', 'mapping_data': 'seqNumber', 'action_attr_name': 'UserId' }] }], 'plan_id': 55, 'rule_id': 55 }),
          $body = $('body'),
          contentRegion;
        $body.append('<div class="sample-region"></div>');
        actionPlanListItemView = new ActionPlanListItemView({
          model: mockModel
        });
        contentRegion = new Marionette.Region({
          el: '.sample-region'
        });
        contentRegion.show(actionPlanListItemView);
      });
      it('can be instantiated', function () {
        expect(actionPlanListItemView).toBeDefined();
      });
      it('updateNewActionPlanIndication should add a class if it is new action plan', function () {
        actionPlanListItemView.model.set({ plan_id: '' });
        actionPlanListItemView.updateNewActionPlanIndication();
        expect(actionPlanListItemView.$el.hasClass('xecmpf-new-eac-action-plan-list-item')).toBeTruthy();
      });
      afterAll(function () {
        actionPlanListItemView.destroy();
      });
    });
  });