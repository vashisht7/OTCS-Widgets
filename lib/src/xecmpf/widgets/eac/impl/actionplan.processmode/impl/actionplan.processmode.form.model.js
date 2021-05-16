/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';

define(['csui/models/form', 'i18n!xecmpf/widgets/eac/impl/nls/lang'], function (FormModel, lang
) {

    var ActionPlanProcessModeFormModel = FormModel.extend({
        constructor: function ActionPlanProcessModeFormModel(attributes, options) {
            this.options = options || (options = {});
            attributes || (attributes = {
                schema: { properties: {} },
                options: { fields: {} },
                date: {}
            });
            FormModel.prototype.constructor.call(this, attributes, options);
        },

        initialize: function (attributes, options) {
            this._setAttributes();
        },

        _setAttributes: function () {
            var that = this;
            var run_as = '';
            var process_mode = '';
            if(this.options.eventModel && this.options.eventModel.attributes && this.options.eventModel.attributes.process_mode){
                process_mode = this.options.eventModel.attributes.process_mode
            }
            if(this.options.eventModel && this.options.eventModel.attributes && this.options.eventModel.attributes.run_as_key){
                run_as = this.options.eventModel.attributes.run_as_key
            }
            
            this.set({
                schema: {
                    properties: {
                        run_as: {
                            required: true,
                            type: "otcs_user_picker"
                        },
                        process_mode: {
                            enum: ['Synchronously','Asynchronously'],
                            required: true,
                            type: "string"
                        }
                    }
                },
                options: {
                    fields: {
                        run_as: {
                            label: lang.runAs,
                            type: "otcs_user_picker",
                            events: {
                                change: function () {
                                    that.setValue(this.path, this.getValue());
                                }
                            }
                        },
                        process_mode: {
                            label: lang.processMode,
                            type: "select",
                            optionLabels: [lang.synchronouslyProcessLabel,lang.asynchronouslyProcessLabel],
                            events: {
                                change: function () {
                                    that.setValue(this.path, this.getValue());
                                }
                            },
                            removeDefaultNone: true
                        }
                    }
                },
                data: {
                    run_as: run_as,
                    process_mode: process_mode
                }
            });
        }

    });
    return ActionPlanProcessModeFormModel;
});