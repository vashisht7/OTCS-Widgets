/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
    'csui/controls/globalmessage/globalmessage',
    'i18n!csui/widgets/navigation.header/controls/progressbar.maximize/impl/nls/progressbar-maximize.lang',  // Use localizable texts
    'hbs!csui/widgets/navigation.header/controls/progressbar.maximize/impl/progressbar.maximize',
    'css!csui/widgets/navigation.header/controls/progressbar.maximize/impl/progressbar-maximize',
], function (_, $, Marionette, GlobalMessage, lang, template) {
    'use strict';

    var ProgressbarMaximizeView = Marionette.ItemView.extend({
        className: 'csui-progressbar-maximize-view binf-hidden',

        template: template,

        templateHelpers: function () {
            return {
                maximize: lang.maximize,
                maximizeAria: lang.maximizeAria
            };
        },

        ui: {
            favoritesButtonContainer: '.csui-favorites-icon-container',
            favoritesViewContainer: '.csui-favorites-view-container',
            progresspanelMaximize: '.csui-maximize .csui-button-icon',
            progressRight : '.csui-progressbar-pie .csui-progressbar-right-side',
            progressLeft : '.csui-progressbar-pie .csui-progressbar-left-side',
            wrapper: '.csui-progressbar-pie-wrapper.progress .csui-progressbar-pie'
        },

        events: {
            'click': '_onClick',
            'keydown @ui.progresspanelMaximize': 'onKeyInView',
        },

        constructor: function ProgressbarMaximizeView(options) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);
            this.listenTo(options.parentView, "processbar:minimize", this._doProcessbarMaximize);
            this.listenTo(options.parentView, "processbar:update", this._doProgressbarAnimation);
            this.listenTo(options.parentView, "processbar:finished", this._doFinishedProgressbar);
            this.listenTo(options.parentView, "processing:completed", this._onClick); //Open progres panel automatically once upload is 100% completed
            this.listenTo(options.parentView, "processing:error", this._doFailedProgressbar);
        },

        _doProcessbarMaximize: function () {
            this.$el.removeClass('binf-hidden');
            this.$el.find('.csui-progressbar-animation').removeClass('binf-hidden');
            this.ui.progresspanelMaximize.removeClass('icon-progresspanel-success');
            this.ui.progresspanelMaximize.removeClass('icon-progresspanel-error');
            this.ui.progresspanelMaximize.trigger("focus");
        },

        onKeyInView: function (event) {
            if (event.keyCode === 13 || event.keyCode === 32) {
                this._onClick();
                return false;
            }
        },

        _doFailedProgressbar: function(){
            this.ui.progresspanelMaximize.addClass('icon-progresspanel-error');
            this.ui.progresspanelMaximize.removeClass('icon-progresspanel-success');
        },
        
        _doFinishedProgressbar: function () {
            this.ui.wrapper.css('clip', 'rect(0, 1em, 1em, 0.5em)');
            this.ui.progressLeft.css('transform', 'rotate(' + 360 + 'deg)');
            this.ui.progressRight.css('transform', 'rotate(' + 0 + 'deg)');
            this.$el.addClass('binf-hidden');
        },

        _doProgressbarAnimation: function (progressPercent) {
            var calc = Math.round(3.6 * progressPercent);
            if (progressPercent <= 50) {
                this.ui.wrapper.css('clip', 'rect(0, 1em, 1em, 0.5em)');
                this.ui.progressLeft.css('transform', 'rotate(' + 360 + 'deg)');
                this.ui.progressRight.css('transform', 'rotate(' + calc + 'deg)');
            }
            if (progressPercent >= 50 && progressPercent <= 100) {
                this.ui.wrapper.css('clip', 'rect(auto, auto, auto, auto)');
                this.ui.progressRight.css('transform', 'rotate(' + 180 + 'deg)');
                this.ui.progressLeft.css('transform', 'rotate(' + calc + 'deg)');
            }
        },

        _onClick: function () {
            this.$el.addClass('binf-hidden');
            this.options.parentView.trigger('processbar:maximize');
        },

        onRender: function () {

        }

    });


    return ProgressbarMaximizeView;
});
