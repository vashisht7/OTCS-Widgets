/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
    'csui/utils/contexts/factories/connector', 'csui/controls/form/form.view', 'csui/controls/progressblocker/blocker',
    'xecmpf/widgets/eac/impl/actionplan.rules/impl/actionplan.rules.form.model',
    'hbs!xecmpf/widgets/eac/impl/actionplan.rules/impl/actionplan.rules',
    'csui/controls/globalmessage/globalmessage',
    'i18n!xecmpf/widgets/eac/impl/nls/lang',
    'css!xecmpf/widgets/eac/impl/actionplan.rules/impl/actionplan.rules'
], function (_, $, Backbone, Marionette,
    ConnectorFactory, FormView, BlockingView,
    EACRuleFormModel, formTemplate, GlobalMessage, lang) {
        var EACRulesView = FormView.extend({
            className: function() {
                var computedClassName = FormView.prototype.className.call(this);
                computedClassName += ' xecmpf-eac-rules xecmpf-eac-rules-hide-validation-errors';
                computedClassName += (this.options.isNewActionPlan ? ' xecmpf-eac-new-action-plan-rules' : '');
                return computedClassName;
            },
            constructor: function(options) {
                FormView.prototype.constructor.call(this, options);
            },
            ui: {
                pullRight: '.cs-pull-right'
            },
            events: {
                "mouseenter @ui.pullRight": "onMouseEnterOnActionButtons",
                "mouseleave @ui.pullRight": "onMouseLeaveFromActionButtons",
            },
            formTemplate: formTemplate,
            formTemplateHelpers: function () {
                return {
                    rulesLabel: lang.rulesLabel,
                    rulesSetLegend: lang.rulesSetLegend
                };
            },
            onRenderForm: function() {
                var rulesRowsSelector = ".xecmpf-eac-rules-container .cs-form-set .cs-array.alpaca-container-item";
                this.$el.find(rulesRowsSelector).addClass("xecmpf-eac-existing-rule");
            },            
            _getLayout: function () {
                FormView.prototype._getLayout.call(this);
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
            _getBindings: function () {
                return {
                    rulesSet: '.xecmpf-eac-rules-container'
                };
            }, 
            isFormValid: function() {
                this.$el.removeClass('xecmpf-eac-rules-hide-validation-errors'); // error indications can be shown after calling this method
                return this.validate();
            },  
            getSubmitData: function () {
                var data = this.getValues().rulesSet;
                data.length === 1 && !data[0].operator && !data[0].from && !data[0].to && (data = []);                
                return data;
            },
            onMouseEnterOnActionButtons: function(event) {
                var $currentTarget = $(event.currentTarget);
                if ($currentTarget.find('button').hasClass('binf-hidden')) {
                    $currentTarget.parent().find('.cs-pull-left .cs-field-write').trigger('mouseenter');
                }
            },
            onMouseLeaveFromActionButtons: function(event) {
                var $currentTarget = $(event.currentTarget);
                if (!$currentTarget.find('button').hasClass('binf-hidden')) {
                    $currentTarget.parent().find('.cs-pull-left .cs-field-write').trigger('mouseleave');
                }
            }
        });
        return EACRulesView;
    });
