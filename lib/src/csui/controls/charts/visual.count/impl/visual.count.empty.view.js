/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette3',
    'hbs!csui/controls/charts/visual.count/impl/visual.count.empty',
    'i18n!csui/controls/charts/visual.count/impl/nls/lang'
], function (Marionette, template, lang) {


    var NoDataView = Marionette.View.extend({

        constructor: function NoDataView() {
            Marionette.View.prototype.constructor.apply(this, arguments);
        },

        className: 'csui-visual-count-empty-container',

        template: template,

        templateContext: function() {
            return {
                text: this.options.text || lang.NodataDefaultText
            };
        }

    });

    return NoDataView;

});
