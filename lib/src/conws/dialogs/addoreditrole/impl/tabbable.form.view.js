/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/jquery',
    'csui/controls/form/form.view',
    'csui/behaviors/keyboard.navigation/tabable.region.behavior',
], function ($, FormView, TabableRegionBehavior) {

    var TabbableFormView = FormView.extend({

        behaviors: {
            TabablesBehavior: {
                behaviorClass: TabableRegionBehavior,
                recursiveNavigation: true,
                containTabFocus: true
            }
        },

        events: {
            'keydown': 'onKeyInView'
        },

        isTabable: function () {
            return this.$('*[tabindex]').length > 0;
        },

        currentlyFocusedElement: function (event) {
            var readonly = !!this.$form && this.$form.find('.alpaca-readonly button'),
                tabElements = this.$('*[tabindex]:visible');
            if (tabElements.length) {
                tabElements.prop('tabindex', 0);
                if (readonly.length) {
                    readonly.attr('tabindex', -1)
                }
            }
            this.tabableElements = tabElements;
            return $(tabElements[0]);
        },

        onKeyInView: function (event) {
            var tabableEleLength = this.tabableElements.length;
            if (tabableEleLength > 0 && event.keyCode === 9) {
                if (event.shiftKey) {
                    var index = this.tabableElements.index(event.target);
                    var target = --index;
                    if (target >= 0) {
                        this._setFocus(event, target);
                    }
                } else {
                    var index = this.tabableElements.index(event.target);
                    var target = ++index;
                    if (target < tabableEleLength) {
                        this._setFocus(event, target);
                    }
                }
            }
        },

        _setFocus: function (event, target) {
            this.tabableElements.eq(target).focus();
            event.stopPropagation();
            event.preventDefault();
        }
    });
    return TabbableFormView;
});      