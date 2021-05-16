/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
    'csui/controls/form/form.view',
    'hbs!xecmpf/widgets/eac/impl/actionplan.processmode/impl/actionplan.processmode',
    'i18n!xecmpf/widgets/eac/impl/nls/lang',
    'css!xecmpf/widgets/eac/impl/actionplan.processmode/impl/actionplan.processmode',
], function (require, _, $, Backbone, FormView, formTemplate, lang) {

    var ActionPlanProcessModeView = FormView.extend({

        constructor: function ActionPlanProcessModeView(options) {
            FormView.prototype.constructor.call(this, options);
        },

        formTemplate: formTemplate,

        formTemplateHelpers: function() {
            return {
                header : lang.processModeTabLabel
            };
        },

        _getLayout: function () {
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
                run_as: 'xecmpf-eac-processmode-run_as',
                process_mode: 'xecmpf-eac-processmode-process_mode'
            };
        }

    });
    
    return ActionPlanProcessModeView;
});