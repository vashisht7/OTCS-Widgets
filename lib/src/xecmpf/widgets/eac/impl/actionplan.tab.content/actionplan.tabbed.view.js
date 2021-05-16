/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
    'csui/lib/backbone',
    'csui/lib/marionette',
    'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
    'csui/utils/page.leaving.blocker',
    'xecmpf/widgets/eac/impl/actionplan.tab.content/actionplan.tab.content.view',
    'i18n!xecmpf/widgets/eac/impl/nls/lang',
    'hbs!xecmpf/widgets/eac/impl/actionplan.tab.content/impl/actionplan.tabbed.view',
    'css!xecmpf/widgets/eac/impl/actionplan.tab.content/impl/actionplan.tabbed.view'
], function(_, $, Backbone, Marionette, ViewEventsPropagationMixin, PageLeavingBlocker, ActionPlanContentView, lang, template) {

    var ActionPlanTabbedView = Marionette.ItemView.extend({

        className: 'metadata-inner-wrapper xecmpf-eac-actionplan-tabbed-inner-wrapper',

        template: template,

        templateHelpers: function() {
            return {
                save: !!this.model.get('plan_id') ? lang.saveLabel : lang.createLabel,
                cancel: lang.closeLabel
            }
        },

        events: {
            'click .xecmpf-eac-save-actionplan': 'saveEventActionPlan',
            'click .xecmpf-eac-cancel-actionplan': 'cancelEventActionPlan'
        },

        constructor: function ActionPlanTabbedView(options) {
            options || (options = {});
            Marionette.ItemView.prototype.constructor.call(this, options);

            var tabOptions = {
                context: this.options.context,
                node: this.options.model,
                eventname: this.options.eventname,
                namespace: this.options.namespace,
                actionplanSettingsView: this
            }

            this.actionPlanContentView = new ActionPlanContentView(tabOptions);
            this.propagateEventsToViews(this.actionPlanContentView);
        },
        onRender: function() {
            var that = this;
            var childTabView = this.actionPlanContentView.render();
            Marionette.triggerMethodOn(childTabView, 'before:show', childTabView, this);
            this.$el.find('.xecmpf-eac-actionplan-content').append(childTabView.el);
            Marionette.triggerMethodOn(childTabView, 'show', childTabView, this);
            this.listenTo(this.actionPlanContentView, 'refresh:current:action:plan:item', function(data) {
                that.trigger('refresh:current:action:plan:item', data);
            });
           var _tabbedViewContainsChanges = null;
            Object.defineProperty(this, 'tabbedViewContainsChanges', {
                get: function() {
                    return _tabbedViewContainsChanges;
                },
                set: function(containsChanges) {
                    _tabbedViewContainsChanges = containsChanges;
                    that.updateSaveButtonDisableStatus(!containsChanges);
                    if (containsChanges && !PageLeavingBlocker.isEnabled()) {
                        PageLeavingBlocker.enable(lang.warningMsgOnActionPlanNavigation);
                    } else if (!containsChanges) {
                        PageLeavingBlocker.disable();
                    }
                }
            });

            if (!!this.model.get('plan_id')) {
                this.tabbedViewContainsChanges = false;
            } else {
                this.tabbedViewContainsChanges = true;
            }
            this.actionPlanContentView.tabContent.children.forEach(function(tabContentView) {
                that.listenTo(tabContentView.content, 'change:field', function(eventInfo) {
                    that.tabbedViewContainsChanges = true;
                });
            });

        },
        saveEventActionPlan: function() {
            var that = this;
            this.actionPlanContentView.saveActionPlanContent().then(function() {
                that.tabbedViewContainsChanges = false; 
            }, function(errMsg) {
            });
        },

        cancelEventActionPlan: function() {
            this.trigger('actionplan:click:back');
        },
        updateSaveButtonDisableStatus: function(disableIt) {
            var $saveBtn = this.$el.find('.xecmpf-eac-save-actionplan');
            $saveBtn.prop('disabled', disableIt);
        },
        onDestroy: function() {
            if (PageLeavingBlocker.isEnabled()) {
                PageLeavingBlocker.disable();
            }
        }
    });

    _.extend(ActionPlanTabbedView.prototype, ViewEventsPropagationMixin);

    return ActionPlanTabbedView;
});