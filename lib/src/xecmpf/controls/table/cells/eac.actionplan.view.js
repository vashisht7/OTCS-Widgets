/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry', 'csui/utils/contexts/factories/node',
  'csui/controls/dialog/dialog.view',
  'xecmpf/models/eac/eventactionplans.model',
  'xecmpf/widgets/eac/impl/actionplan.details/actionplan.details.view',
  'hbs!xecmpf/controls/table/cells/impl/actionplan',
  'i18n!xecmpf/widgets/eac/impl/nls/lang',
  'css!xecmpf/controls/table/cells/impl/actionplan'
], function ($, _, Backbone, Marionette, TemplatedCellView, cellViewRegistry, NodeFactory,
    DialogView, EACEventActionPlans, ActionPlanDetailsView, template, lang) {

  var ActionPlanCellView = TemplatedCellView.extend({

        template: template,
        className: 'csui-nowrap',

        triggers: {
          'click .action-plan-add': 'click:ActionPlanAdd'
        },

        events: {
          'click .action-plan-edit': 'editActionPlan'
        },

        getValueData: function () {
          var node  = this.model,
              count = node.get('action_plans').length;
          return {
            count: count,
            actionPlan: lang.actionPlan,
            addActionPlan: lang.addActionPlan
          };
        },

        onClickActionPlanAdd: function () {
          this.showActionPlanDetailsView();
        },
        editActionPlan: function (event) {
          event.preventDefault();
          event.stopPropagation();
          this.showActionPlanDetailsView();
        },
        showActionPlanDetailsView: function () {
          var actionPlanDetailsView = new ActionPlanDetailsView({
                context: this.options.context,
                model: this.options.model
              }),
              tableView             = this.options.tableView,
              originatingView       = tableView.options.originatingView,
              $originatingView      = tableView.options.originatingView.$el,
              actionPlanWrapper;

          $originatingView.parent().append(
              "<div class='xecmpf-actionplan-details-wrapper'></div>");
          actionPlanWrapper = $(
              $originatingView.parent().find('.xecmpf-actionplan-details-wrapper')[0]);
          actionPlanWrapper.hide();

          actionPlanDetailsView.render();
          Marionette.triggerMethodOn(actionPlanDetailsView, 'before:show');
          actionPlanWrapper.append(actionPlanDetailsView.el);
          originatingView.actionPlanDetailsView = actionPlanDetailsView;

          $originatingView.hide('blind', {
            direction: 'left',
            complete: function () {
              actionPlanWrapper.show('blind',
                  {
                    direction: 'right',
                    complete: function () {
                      Marionette.triggerMethodOn(actionPlanDetailsView, 'show');
                    }
                  }, 100);
            }
          }, 100);

          var _showOriginatingView = function () {
            var that = this;
            actionPlanWrapper.hide('blind', {
              direction: 'right',
              complete: function () {
                originatingView.$el.show('blind', {
                  direction: 'left',
                  complete: function () {
                    originatingView.actionPlanDetailsView &&
                    originatingView.actionPlanDetailsView.destroy();
                    originatingView.blockActions();
                    that.options.tableView.collection.fetch({reload: true})
                        .fail(function () {
                        })
                        .always(function () {
                          originatingView.triggerMethod('dom:refresh');
                          originatingView.unblockActions();
                        });
                  }
                }, 100);
                actionPlanDetailsView.destroy();
                actionPlanWrapper.remove();
              }
            }, 100);
          };
          this.listenTo(actionPlanDetailsView, "actionplan:close",
              _.bind(_showOriginatingView, this));
        }

      },
      {
        hasFixedWidth: true,
        columnClassName: 'xecmpf-table-cell-action-plan'
      });

  cellViewRegistry.registerByColumnKey('action_plan', ActionPlanCellView);

  return ActionPlanCellView;
});
