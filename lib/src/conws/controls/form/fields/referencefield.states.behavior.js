/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/controls/form/impl/fields/csformfield.states.behavior'
], function (FormFieldStatesBehavior) {

    var ReferenceFieldStatesBehavior = FormFieldStatesBehavior.extend({

        constructor: function ReferenceFieldStatesBehavior(options, view) {
            FormFieldStatesBehavior.apply(this, arguments);

        },
        isReadOnly: function () {
            return true;
        }

    });

    return ReferenceFieldStatesBehavior;

});
