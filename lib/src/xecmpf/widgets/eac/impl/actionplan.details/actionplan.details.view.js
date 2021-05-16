/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module",
  "csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin",
  'csui/dialogs/modal.alert/modal.alert',
  'csui/utils/url',
  'csui/utils/contexts/factories/connector',
  'csui/controls/globalmessage/globalmessage',
  'csui/controls/progressblocker/blocker',
  "xecmpf/widgets/eac/impl/actionplan.list/actionplan.list.view",
  "xecmpf/widgets/eac/impl/actionplan.header/actionplan.header.view",
  "xecmpf/widgets/eac/impl/actionplan.tab.content/actionplan.tabbed.view",
  "hbs!xecmpf/widgets/eac/impl/actionplan.details/impl/actionplan.details",
  "i18n!xecmpf/widgets/eac/impl/nls/lang",
  "css!xecmpf/widgets/eac/impl/actionplan.details/impl/actionplan.details"
], function (module, $, _, Backbone, Marionette, LayoutViewEventsPropagationMixin, ModalAlert, Url, ConnectorFactory, GlobalMessage, BlockingView, 
    ActionPlanListView, ActionPlanHeaderView, ActionPlanTabbedView, template, lang) {
  'use strict';

  var ActionPlanDetailsView = Marionette.LayoutView.extend({

    className: 'xecmpf-actionplan-details',
    template: template,

    regions: {
      headerRegion: '.xecmpf-actionplan-header-view',
      actionPlanListRegion: '.xecmpf-actionplan-list-view',
      actionPlanDetailsRegion: '.xecmpf-actionpan-details-view'
    },

    initialize: function () {
      this.setHeaderView();
      this.setActionPlanListView();
    },

    constructor: function ActionPlanDetailsView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.propagateEventsToRegions(); // propagate dom:refresh to child views
    },
    onRender: function () {
      var that = this;

      this.listenTo(this.actionPlanListView, 'actionplan:click:item', function(eventSrc) {
        this.isContentViewCanbeUpdated(eventSrc.model).then(function() {
          that.updateContentView(eventSrc);
        });
      });

      this.listenTo(this.actionPlanListView, 'actionplan:add:item', function(eventSrc) {
        this.isContentViewCanbeUpdated().then(function() {
          that.actionplanTabbedView.destroy(); // to avoid multiple confirmations on addition of action plan
          that.actionPlanListView.addNewActionPlan(); // adds new action plan
        });
      });

      this.listenTo(this.actionPlanListView, 'actionplan:click:delete', function(eventSrc) {
        this.deleteActionPlan(eventSrc);
      });
      this.actionPlanListRegion.on('show', _.bind(this.onActionPlanListShown, this)); 
      this.headerRegion.show(this.headerView); 
      this.actionPlanListRegion.show(this.actionPlanListView);          
           
    },
    isContentViewCanbeUpdated: function( nextModel ) {
      var $deferred = $.Deferred(),
        currentModel = null;
      if (this.actionplanTabbedView && !this.actionplanTabbedView.isDestroyed) {
        currentModel = this.actionplanTabbedView.options.model
        if (currentModel === nextModel) {
          $deferred.reject();
        } else if (this.actionplanTabbedView.tabbedViewContainsChanges) {
          ModalAlert.confirmQuestion( lang.warningMsgOnActionPlanNavigation, 
            lang.actionPlanNavigationDialogTitle, { buttons: ModalAlert.OkCancel })
          .done(function() {
            $deferred.resolve();
          })
          .fail(function() {
            $deferred.reject();
          });
        } else {
          $deferred.resolve();  
        }
      } else {
        $deferred.resolve();
      }
      return $deferred.promise();
    },
    updateContentView: function(eventSrc) {
      this.setActionPlanTabbedView(eventSrc.model);
      this.actionPlanDetailsRegion.show(this.actionplanTabbedView);
      this.actionPlanListView.$el.find('.binf-active').removeClass('binf-active');
      eventSrc.$el.addClass('binf-active');
    },

    setHeaderView: function () {
      this.headerView = new ActionPlanHeaderView(this.options);
      this.listenTo(this.headerView, "actionplan:click:back", function () {
        this.isContentViewCanbeUpdated().then((function() {
          this.trigger("actionplan:close");
        }).bind(this));
      });
    },
    setActionPlanListView: function () {
      this.actionPlanListView = new ActionPlanListView({
        showAddActionPlan: true,
        context: this.options.context,
        model: this.options.model
      });
    },
    setActionPlanTabbedView: function (model) {
      var that = this;
      if (this.actionplanTabbedView) {
          this.actionplanTabbedView.destroy();
      }
      this.actionplanTabbedView = new ActionPlanTabbedView({
          context: this.options.context,
          model: model,
          eventname: this.options.eventname,
          namespace: this.options.namespace,
          originatingView: this.options.originatingView
      });
      this.listenTo(this.actionplanTabbedView, "actionplan:click:back", function() {
        this.trigger("actionplan:close");
      });
      this.listenTo(this.actionplanTabbedView, "refresh:current:action:plan:item", function(data) {
        this.actionPlanListView.refreshCurrentActionPlanItem(data).then(function(actionPlanListItem) {
          that.updateContentView(actionPlanListItem);
        });
      });
    },
    onActionPlanListShown: function(actionPlanListView) {      
      var firstActionPlan = actionPlanListView.actionPlanListRegion.currentView.children.findByIndex(0);
      if (firstActionPlan) {
        firstActionPlan.trigger('click:actionplan:item');
      }     
    },
    deleteActionPlan: function(eventSrc) {
      var that = this,
          model = eventSrc.model,
          message = _.str.sformat(lang.deleteActionPlanConfirmatonText, model.get('name') ),
          planId = model.get('plan_id');
      if (!!planId) {
        ModalAlert.confirmQuestion( message, 
          lang.deleteActionPlanConfirmatonTitle, {buttons: ModalAlert.OkCancel})
          .done(function () {
            var connector = that.options.context.getObject(ConnectorFactory, that.options);
            var deleteActplanURL = new Url(connector.connection.url).getApiBase('v2');
            deleteActplanURL = Url.combine(deleteActplanURL, 'eventactioncenter', 'actionplan');
            var queryParameters = Url.combineQueryString({
                  rule_id : model.attributes.rule_id,
                  plan_id : planId
                });
            deleteActplanURL = Url.combine(deleteActplanURL+'?'+queryParameters);
            connector.makeAjaxCall({
                type: "DELETE",
                url: deleteActplanURL,
                processData: false,
                contentType: false,
                success: function (response) {
                    that.updateActionPlanSelection(eventSrc);
                    GlobalMessage.showMessage("success", response.results.msg);
                },
                error: function (xhr) {
                    that.trigger("error");
                    var errorMessage = xhr.responseJSON ?
                            (xhr.responseJSON.errorDetail ? xhr.responseJSON.errorDetail :
                                    xhr.responseJSON.error) :
                            "Server Error: Unable to perform the action";
                    GlobalMessage.showMessage("error", errorMessage);
                }
            });
          }).fail(function(){
            eventSrc._setFocus();
          })

        } else {
          that.updateActionPlanSelection(eventSrc);
        }
    },
    updateActionPlanSelection: function(actionPlan) {
      var actionPlanCollectionView = this.actionPlanListView.actionPlanListItemCollectionView;
      var actionPlanListChildren = actionPlanCollectionView.children;
      var index = actionPlan._index;
      var nextView = actionPlanListChildren.findByIndex(index + 1);
      var prevView = actionPlanListChildren.findByIndex(index - 1);
      var nextActiveView = nextView ? nextView : (prevView ? prevView : undefined);
      var isActive = actionPlan.$el.hasClass('binf-active');
      if (nextActiveView && actionPlan._hasFocus) {
        actionPlanCollectionView._changeTabIndexesAndSetFocus(actionPlan, nextActiveView, false);
      }
      actionPlan.model.destroy();
      if (isActive === true) {
        this.actionplanTabbedView.destroy(); // destroying tab view as corresponding model is already destroyed
        if (nextActiveView) {
          nextActiveView.trigger('click:actionplan:item');
        }
      }
    }
  });

  _.extend(ActionPlanDetailsView.prototype, LayoutViewEventsPropagationMixin);

  return ActionPlanDetailsView;
});