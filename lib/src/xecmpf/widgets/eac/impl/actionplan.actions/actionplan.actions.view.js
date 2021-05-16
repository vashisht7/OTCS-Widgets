/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
    'csui/utils/contexts/factories/connector', 'csui/controls/form/form.view', 'csui/controls/progressblocker/blocker',
    'csui/controls/globalmessage/globalmessage',
    'xecmpf/widgets/eac/impl/actionplan.actions/impl/actionplan.actions.form.model',
    'hbs!xecmpf/widgets/eac/impl/actionplan.actions/impl/actionplan.actions',
    'i18n!xecmpf/widgets/eac/impl/nls/lang',
    'css!xecmpf/widgets/eac/impl/actionplan.actions/impl/actionplan.actions',
], function(_, $, Backbone, Marionette, ConnectorFactory, FormView, BlockingView,
    GlobalMessage, EACActionFormModel, template, lang) {

    var EACActionsView = FormView.extend({

        className: function() {
            var computedClassName = FormView.prototype.className.call(this);
            computedClassName += ' xecmpf-eac-actions xecmpf-eac-actions-hide-validation-errors';
            return computedClassName;
        },

        constructor: function(options) {
            var actionPlanActionsModels,
                actions = options.eventModel && options.eventModel.get('actions') || [];
            actionPlanActionsModels = actions.map(function(action, index) {
                return new Backbone.Model({
                    sequence: index + 1,
                    action_key: action.action_key,
                    attribute_mappings: action.attribute_mappings
                });
            });
            this.collection = new Backbone.Collection();
            this.collection.add(actionPlanActionsModels);
            options.model = new EACActionFormModel(undefined, {
                context: options.context,
                eventModel: options.eventModel,
                collection: this.collection
            });
            options.mode = 'create';
            options.layoutMode = 'doubleCol';
            options.breakFieldsAt = 3;
            FormView.prototype.constructor.call(this, options);
        },

        formTemplate: template,

        formTemplateHelpers: function() {
            return {
                actionsLabel: lang.actionsTabLabel
            };
        },

        _getLayout: function() {
            var retVal = FormView.prototype._getLayout.call(this);
            var template = this.getOption('formTemplate'),
                html = template.call(this, {
                    data: this.alpaca.data,
                    mode: this.mode
                }),
                bindings = this._getBindings(),
                view = {
                    parent: 'bootstrap-csui',
                    layout: {
                        template: html,
                        bindings: bindings
                    }
                };
            return view;
        },

        _getBindings: function() {
            return {
                actionsData: '.xecmpf-eac-actions-container'
            };
        },
        getSubmitData: function() {
            var data = this.getValues().actionsData;
            return data;
        }

    });

    return EACActionsView;

});