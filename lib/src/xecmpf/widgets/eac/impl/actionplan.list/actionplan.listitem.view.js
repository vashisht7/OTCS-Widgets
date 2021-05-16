/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'hbs!xecmpf/widgets/eac/impl/actionplan.list/impl/actionplan.listitem',
  'i18n!xecmpf/widgets/eac/impl/nls/lang',
  'css!xecmpf/widgets/eac/impl/actionplan.list/impl/actionplan.listitem'
], function(_, $, Backbone, Marionette, ActionPlanListItemTemplate, lang ) {
    var ActionPlanListItemView = Marionette.ItemView.extend({
        tagName: 'li',
        className: function() {
            var className = 'xecmpf-eac-action-plan-list-item'; 
            className += (!this.model.get('plan_id') ? ' xecmpf-new-eac-action-plan-list-item' : '');           
            return className;
        },
        template: ActionPlanListItemTemplate,
        constructor: function ActionPlanListItemView(options) {
            options = (options || {});
            Marionette.ItemView.call(this, options);
        },
        modelEvents: {
            'change': 'onActionPlanListItemModelUpdate'
        },
        templateHelpers: function() {
            var actionPlanName = lang.actionPlan + (!!this.model.get('plan_id') ? (' ' + _.str.pad(this._index + 1, 2, '0')) : '');
            this.model.set('name', actionPlanName, { silent: true });
            return {
                tabindex: this._index === 0 ? '0' : '-1',
                name: this.model.get('name'),
                deleteTooltip: lang.deleteActionPlanButton,
                deleteAria: lang.deleteActionPlanButtonAria + ' ' +  this.model.get('name')
            }
        },
        triggers: {
            'click .xecmpf-eac-action-plan-name-link': 'click:actionplan:item',
            'click .xecmpf-eac-action-plan-list-item-delete-btn': 'click:actionplan:delete'
        },

        ui: {
            actionPlanNameButton: '.xecmpf-eac-action-plan-name-link',
            deleteButton: '.xecmpf-eac-action-plan-list-item-delete-btn'
        },
        events: {
            'focusout': function (event) {
                this.trigger("actionplan:focusout", event);
            },            
            'focus @ui.actionPlanNameButton': function (event) {
                this._hasFocus = true;
                this.$el.find('.xecmpf-eac-action-plan-list-item-delete-btn').show();
            },
            "keydown ": 'onkeyInView'
        },
        onkeyInView: function(event){
            var nextActionPlan, nextView;
            switch (event.keyCode) {
                case 37: //left arrow key
                    event.preventDefault();
                    event.stopPropagation();
                    this.ui.actionPlanNameButton.trigger('focus');
                    break;
                case 39: // right arrow key
                    event.preventDefault();
                    event.stopPropagation();                       
                    this.ui.deleteButton.trigger('focus');
                    break;
                case 46: // Delete key
                    event.preventDefault();
                    event.stopPropagation();
                    this.trigger('click:actionplan:delete');
                    break;
                case 13:
                case 32:
                    if (event.target.classList.contains('xecmpf-eac-action-plan-list-item-delete-btn')) {
                        event.preventDefault();
                        event.stopPropagation();
                        this.trigger('click:actionplan:delete');
                    }
                    break;
            }
        },
        _setFocus: function () {
            if (this.ui.actionPlanNameButton.length > 0) {
              this.ui.actionPlanNameButton.trigger('focus');
            }
        },
        onActionPlanListItemModelUpdate: function() {
            this.updateNewActionPlanIndication();
        },
        updateNewActionPlanIndication: function() {
            this.$el.removeClass('xecmpf-new-eac-action-plan-list-item');
            if (!this.model.get('plan_id')) {
                this.$el.addClass('xecmpf-new-eac-action-plan-list-item');
            }
        }
    });
    return ActionPlanListItemView;
});