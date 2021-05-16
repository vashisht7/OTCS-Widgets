/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
'csui/lib/jquery',
'csui/lib/backbone',
'csui/lib/marionette',
'csui/utils/contexts/factories/connector',
'csui/controls/tile/behaviors/perfect.scrolling.behavior',
'xecmpf/models/eac/eventactionplans.model',
'xecmpf/widgets/eac/impl/actionplan.list/actionplan.listitem.view',
'hbs!xecmpf/widgets/eac/impl/actionplan.list/impl/actionplan.list',
'i18n!xecmpf/widgets/eac/impl/nls/lang',
'css!xecmpf/widgets/eac/impl/actionplan.list/impl/actionplan.list'], function(_, $, Backbone, Marionette, ConnectorFactory, PerfectScrollingBehavior, EACEventActionPlans, ActionPlanListItemView, ActionPlanListTemplate, lang) {
    var ActionPlanListItemCollectionView = Marionette.CollectionView.extend({
        className: 'xecmpf-action-plan-list-rows',
        tagName: 'ul',
        constructor: function ActionPlanListItemCollectionView(options) {
            options = options || {};
            this.options = options;
            this._focusIndex = 0;
            Marionette.CollectionView.prototype.constructor.call(this, options);
        },
        childView: ActionPlanListItemView,
        childEvents: {
            'click:actionplan:item': 'onActionPlanClickItem',
            'click:actionplan:delete': 'onActionPlanDelete',
            'actionplan:focusout': 'onFocusoutActionPlan'
        },
        events:{
            'keydown' : 'onkeyInView'
        },
        onkeyInView: function (event) {
            var nextActionPlan, nextView,
               currentView =  this.children.findByModel(this.collection.at(this._focusIndex));
            switch (event.keyCode) {
                case 38: // up arrow key
                case 40: // down arrow key
                    event.preventDefault();
                    event.stopPropagation();
                    
                    if (event.keyCode === 38 && this._focusIndex > 0) {
                        this._focusIndex--;
                    } else if (event.keyCode === 40 && this._focusIndex < this.children.length-1) {
                        this._focusIndex++;
                    }
                    nextView = this.children.findByModel(this.collection.at(this._focusIndex));
                    this._changeTabIndexesAndSetFocus(currentView, nextView, true);
                    nextView._setFocus();
                    break;
                case 36: // home button
                    event.preventDefault();
                    event.stopPropagation();
                    this._focusIndex = 0;
                    nextView = this.children.findByModel(this.collection.at(this._focusIndex));
                    this._changeTabIndexesAndSetFocus(currentView, nextView, true);
                    nextView._setFocus();
                    break;
                case 35: // end button 
                    event.preventDefault();
                    event.stopPropagation();
                    this._focusIndex = this.children.length-1;
                    nextView = this.children.findByModel(this.collection.at(this._focusIndex));
                    this._changeTabIndexesAndSetFocus(currentView, nextView, true);
                    nextView._setFocus();
                    break;      
            }
        },
        _changeTabIndexesAndSetFocus: function (currentView, nextView, showDeleteIcon) {
            currentView.$el.find('a').prop('tabindex', -1)
            currentView.$el.find('.xecmpf-eac-action-plan-list-item-delete-btn').prop('tabindex', -1)
            currentView.$el.find('.xecmpf-eac-action-plan-list-item-delete-btn').hide();
            currentView._hasFocus = false;
            nextView.$el.find('a').prop('tabindex', 0);
            nextView.$el.find('.xecmpf-eac-action-plan-list-item-delete-btn').prop('tabindex', 0);
            if (showDeleteIcon) {
                nextView.$el.find('.xecmpf-eac-action-plan-list-item-delete-btn').show();
            }
            nextView._hasFocus = true;
        },
        onFocusoutActionPlan: function (childView, event) {
            if (event.relatedTarget) {
                if ($.contains(this.el, event.relatedTarget) === false) {
                    childView.$el.find('.xecmpf-eac-action-plan-list-item-delete-btn').hide();
                }
            }
        }

    });
    var ActionPlanListView = Marionette.LayoutView.extend({
        className:'xecmpf-eac-action-plan-list-view',
        constructor: function ActionPlanListView(options) {
            options = options || {};
            if (!options.collection) {
                options.model.attributes.action_plans = options.model.attributes.action_plans.map(function(action_plan) {
                    action_plan.namespace = options.model.attributes.namespace;
                    action_plan.event_name = options.model.attributes.event_name;
                    action_plan.event_id = options.model.attributes.event_id;
                    return action_plan;
                });
                options.collection = new Backbone.Collection(options.model.attributes.action_plans);
            }
            this.options = options;
            Marionette.LayoutView.prototype.constructor.call(this, options);
        },
        template: ActionPlanListTemplate,
        templateHelpers: function() {
            return {
                showAddActionPlan: !!this.options.showAddActionPlan,
                newActionPlanLabel: lang.newActionPlan,
                actionPlansListHeader:  lang.actionPlansListHeader,
                actionPlansGroup: lang.actionPlansGroup
            }
        },
        behaviors: {
            PerfectScrolling: {
                behaviorClass: PerfectScrollingBehavior,
                contentParent: '.xecmpf-action-plan-list-rows',
                suppressScrollX: true,
                scrollYMarginOffset: 15
            }
        },
        regions: {
            actionPlanListRegion: '.xecmpf-eac-action-plan-list'
        },
        onRender: function() {            
            this.actionPlanListItemCollectionView = new ActionPlanListItemCollectionView({
                 collection: this.options.collection,
                 context: this.options.context
            });
            this.actionPlanListRegion.show(this.actionPlanListItemCollectionView);
            if (this.options.collection.length === 0) {
                this.addNewActionPlan(); // to open first action plan item by default
            }
        },
        ui: {
            'addActionEle': '.xecmpf-eac-add-action-plan-btn'
        },
        events: {
            'click @ui.addActionEle': 'onAddActionPlanClick'
        },
        childEvents: {
            'actionplan:click:item': 'onActionPlanClick',
            'actionplan:click:delete': 'onActionPlanDelete'
        },
        addNewActionPlan: function() {
            var newActionListItemModel = new Backbone.Model({
                plan_id: '',
                process_mode: '',
                rule_id: '',
                rules: [{}],
                namespace: this.options.model.attributes.namespace,
                event_name: this.options.model.attributes.event_name,
                event_id: this.options.model.attributes.event_id
            }), newActionListItem;

            this.actionPlanListItemCollectionView.collection.add(newActionListItemModel); // adding to collection
            newActionListItem = this.actionPlanListItemCollectionView.children.findByModel(newActionListItemModel);
            newActionListItem.trigger('click:actionplan:item'); // triggering event to open it
        },
        fetchEventActionPlans: function() {
            var deferred = $.Deferred(),
                eacCollection = new EACEventActionPlans(undefined, {
                    connector: this.options.context.getObject(ConnectorFactory)
                });
            eacCollection.fetch().done(function () {
                deferred.resolve(eacCollection);
            }, function() {
                deferred.reject();
            });
            return deferred.promise();
        },
        refreshCurrentActionPlanItem: function(eventInfo) {
            var planID = eventInfo.planID,
                modelToBeUpdated,
                $deferred = $.Deferred();
            if (eventInfo.operation === 'create') {
                modelToBeUpdated = this.actionPlanListItemCollectionView.collection.findWhere({ plan_id: '' });
            } else {
                modelToBeUpdated = this.actionPlanListItemCollectionView.collection.findWhere({ plan_id: planID });
            }
            if (!!modelToBeUpdated) {
                var actionListItemToRetrigger = this.actionPlanListItemCollectionView.children.findByModel(modelToBeUpdated);
                this.fetchEventActionPlans().then(function(eacPlansCollection) {
                    var eventModel = eacPlansCollection.findWhere({ event_id: eventInfo.event_id });
                    if (eventModel && eventModel.get('action_plans')) {
                        var actionPlanObj = eventModel.get('action_plans').filter(function(actionPlanObj) {
                            return actionPlanObj.plan_id === planID;
                        });
                        if (actionPlanObj.length > 0) {    
                            modelToBeUpdated.set(actionPlanObj[0], { sort: false });                            
                        } 
                    }
                    $deferred.resolve(actionListItemToRetrigger);
                }, function() {
                    $deferred.reject();
                });
            } else {
                $deferred.reject();
            }
            return $deferred.promise();
        }
    });

    return ActionPlanListView;
});