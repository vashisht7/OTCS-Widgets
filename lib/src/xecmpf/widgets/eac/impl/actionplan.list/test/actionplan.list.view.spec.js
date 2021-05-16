/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'xecmpf/widgets/eac/impl/actionplan.list/actionplan.list.view',
  'xecmpf/widgets/eac/test/actionplan.mock',
], function ($, _, Backbone, Marionette, PageContext, ActionPlanListView, mock) {
  describe('Actionplan list view ', function () {
    var actionPlanListView,
      mockInst;
    beforeAll(function () {
      mockInst = mock();
      mockInst.enable();
      if (!actionPlanListView) {
        var mockModel = new Backbone.Model({ 'event_id': 'com.successfactors.Employment.AssignmentInformation.Termination', 'event_name': 'Employment Termination', 'namespace': 'SuccessFactors', 'action_plan_count': 1, 'action_plans': [{ 'run_as_key': '18206', 'run_as_value': 'twalker', 'process_mode': 'Synchronously', 'rules': [], 'actions': [{ 'position': 1, 'action_key': 'CreateOrUpdateEventAction.Create Or Update Workspace', 'attribute_mappings': [{ 'action_attr_id': 451, 'position': 1, 'mapping_method': 'Event Property', 'mapping_data': 'startDate', 'action_attr_name': 'userId' }, { 'action_attr_id': 452, 'position': 2, 'mapping_method': 'Event Property', 'mapping_data': 'startDate', 'action_attr_name': 'userId' }] }, { 'position': 2, 'action_key': 'DocGenEventAction.Generate Document', 'attribute_mappings': [{ 'action_attr_id': 453, 'position': 1, 'mapping_method': 'Event Property', 'mapping_data': 'startDate', 'action_attr_name': 'DocumentType' }, { 'action_attr_id': 454, 'position': 2, 'mapping_method': 'Event Property', 'mapping_data': 'startDate', 'action_attr_name': 'userId' }] }, { 'position': 3, 'action_key': 'DocGenEventAction.Generate Document', 'attribute_mappings': [{ 'action_attr_id': 455, 'position': 1, 'mapping_method': 'Event Property', 'mapping_data': 'seqNumber', 'action_attr_name': 'DocumentType' }, { 'action_attr_id': 456, 'position': 2, 'mapping_method': 'Event Property', 'mapping_data': 'seqNumber', 'action_attr_name': 'UserId' }] }], 'plan_id': 55, 'rule_id': 55 }], 'enableActionPlanCount': true, 'eventIndexCount': 4, 'has_action_plan': 'true', 'hasMetadataRow': false, 'inactive': true }
        ),
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

        $body.append('<div class="sample-region"></div>');
        actionPlanListView = new ActionPlanListView({
          showAddActionPlan: true,
          model: mockModel,
          context: mockContext
        });
        contentRegion = new Marionette.Region({
          el: '.sample-region'
        });
        contentRegion.show(actionPlanListView);
      }
    });
    it('should be initialized', function () {
      expect(actionPlanListView).toBeDefined();
    });
    it('should trigger an event on action plan click ', function (done) {
      actionPlanListView.listenTo(actionPlanListView, 'actionplan:click:item', function () {
        done();
      });
      actionPlanListView.onActionPlanClick(null, null);
    });
    it('should trigger an event on action plan delete ', function (done) {
      actionPlanListView.listenTo(actionPlanListView, 'actionplan:click:delete', function () {
        done();
      });
      actionPlanListView.onActionPlanDelete(null, null);
    });
    it('should trigger an event on add action plan ', function (done) {
      actionPlanListView.listenTo(actionPlanListView, 'actionplan:add:item', function () {
        done();
      });
      actionPlanListView.onAddActionPlanClick(null, null);
    });
    it('new model should be inserted in the collection on add action plan click', function () {
      var collectionLengthBeforeAdd = actionPlanListView.actionPlanListItemCollectionView.collection.length,
        collectionLengthAfterAdd = 1;
      actionPlanListView.addNewActionPlan();
      collectionLengthAfterAdd = actionPlanListView.actionPlanListItemCollectionView.collection.length;
      expect(collectionLengthBeforeAdd + 1).toEqual(collectionLengthAfterAdd);
    });
    it('fetchEventActionPlans method shoud fetch action plans by making service call', function (done) {
      actionPlanListView.fetchEventActionPlans().then(function (eacCollection) {
        expect(eacCollection.length).toEqual(1);
        done();
      });
    });
    afterAll(function () {
      mockInst.disable();
      actionPlanListView.destroy();
    })
  });
});