/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore',
    'csui/lib/handlebars',
    'csui/lib/marionette',
    'csui/lib/jquery',
    'csui/widgets/search.custom/search.custom.view',

    'conws/widgets/outlook/impl/utils/utility',
    'i18n!conws/widgets/outlook/impl/nls/lang'
], function(_, Handlebars, Marionette, $, CustomSearchWidgetView, WkspUtil, lang) {

    var simpleSearchView = CustomSearchWidgetView.extend({
        constructor: function simpleSearchView(options) {
            options || (options = {});

            CustomSearchWidgetView.prototype.constructor.call(this, options);

            this.context = options.context;
            this.options = options;
            this.options.parentView = this;
            this.contentViewOptions = this.options;

            WkspUtil.startGlobalSpinner();
        },
        initialize: function () {
            _.bindAll(this, 'render', 'afterRender');
            var self = this;
            this.render = _.wrap(this.render, function (render) {
                render();
                self.afterRender();
                return self;
            }); 
        },

        afterRender: function () {
            this.verifyForm();
        },

        verifyForm: function() {
            setTimeout(function checking() {
                var att = $(".customsearch-attr-container");
                if (att.length === 0) {
                    setTimeout(checking, 100);
                } else {
                    WkspUtil.stopGlobalSpinner();

                    var occupied = (WkspUtil.SearchFormBottomPadding + WkspUtil.TraceAreaHeight) + "px";
                    $(".tile-content").css("height", "calc(100vh - " + occupied +")");
                }
            }, 20);
        }


    });
    return simpleSearchView;
});