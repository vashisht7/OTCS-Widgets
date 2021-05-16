/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
    'csui/utils/contexts/factories/search.query.factory',
    'hbs!xecmpf/controls/search.textbox/impl/search.textbox',
    'i18n!xecmpf/controls/search.textbox/impl/nls/lang',
    'i18n', 'css!xecmpf/controls/search.textbox/impl/search.textbox'
],function(module, _, $, Marionette, SearchQueryModelFactory, 
    template, lang, i18n) {
    "use strict";
    
    var config = _.defaults({}, module.config(), {
        inputValue: '',
        nodeId: '',
        nodeName: ''
    });

    var SearchTextBoxView = Marionette.ItemView.extend({
        className: 'xecmpf-search-text-box',
        template: template,
        
        ui: {
            input: '.xecmpf-input',
            clearer: '.xecmpf-clearer',
            closeSearchBtn: '.xempf-search-hide'
        },

        events: {
			'keyup @ui.input': 'inputTyped',
			'keydown @ui.input': 'inputTyped',
            'paste @ui.input': 'inputChanged',
            'change @ui.input': 'inputChanged',
            'click @ui.clearer': 'clearerClicked',
            'keydown @ui.clearer': 'keyDownOnClear',
            'click @ui.closeSearchBtn': 'closeSearchButtonClicked',
            'keydown @ui.closeSearchBtn': 'KeyDownOnCloseSearchBtn'
        },

        templateHelpers: function () {
            return {
                searchFromHere : lang.searchFromHere,
                clearTextTooltip: lang.clearTextTooltip,
                closeSearchTooltip: lang.closeSearchTooltip,
                searchTooltip: lang.search
            }
        },

        constructor: function SearchTextBoxView(options) {
            options || (options = {});
            options.data = _.defaults({}, options.data, config);
            this.direction = i18n.settings.rtl ? 'left' : 'right';

            var context = options.context;
            if (!options.model) {
                options.model = context.getModel(SearchQueryModelFactory);
            }
            Marionette.ItemView.prototype.constructor.apply(this, arguments);
        },

        onRender: function() {
            var value = this.options.data.inputValue || this.model.get('where');
            if (value) {
                this._setInputValue(value);
            }
        },

        inputTyped: function(event) {
            var value = this.ui.input.val().trim();
            if (event.which === 32) {
                event.stopPropagation();
            } else if (event.which === 13) {
                event.preventDefault();
                event.stopPropagation();
                this._setInputValue(value);
                if (!!value) {
                this.searchIconClicked(event);
                }
                if (this.previousValue !== value) {
                this.previousValue = value;
                }
            } else {
                this.inputChanged(event);
            }
		},
		
        inputChanged: function(event) {
            var value = this.ui.input.val();
            this.ui.clearer.toggle(!!value.length);
        },

        clearerClicked: function(event) {
            event.preventDefault();
            event.stopPropagation();

            this._setInputValue('');
            this.ui.input.trigger("focus");
        },

        keyDownOnClear: function (event) {
            if (event.keyCode === 13) {
                this.clearerClicked(event);
            }
        },

        searchIconClicked: function(event) {
            var value = this.ui.input.val().trim();
            if (!!value) {
                this._setInputValue(value);
                var searchOption = this.options.data.nodeId;

                if (!!value) {
                this._setSearchQuery(value, this.options.sliceString, searchOption, event);
                this._updateInput();
                this.options.data.searchFromHere = true;
                }

                this._triggerSearchResults();
            }    
        },

        _updateInput: function() {
            if (this._isRendered) {
                var value = this.model.get('where') || '';
                this._setInputValue(value);
              }
        },

        _setSearchQuery: function(value, sliceString, searchOption, event) {
            this.model.clear({silent: true});
            var params = {};
            if (!!sliceString) {
                params['slice'] = sliceString;
            }
            if (!!searchOption) {
                params['location_id1'] = searchOption;
            }
            if (value) {
                params['where'] = value;
            }
            this.model.set(params);
        },

        _setInputValue: function(value) {
            this.ui.input.val(value);
            this.ui.clearer.toggle(!!value.length);
        },

        closeSearchButtonClicked: function (event) {
            this.trigger("hide:searchbar");
        },

        KeyDownOnCloseSearchBtn: function(event) {
            if (event.keyCode === 13) {
                event.preventDefault();
		        event.stopPropagation();
                this.trigger("hide:searchbar");
            }
        },

        _triggerSearchResults: function() {
            this.trigger("search:results");
        }

    });

    return SearchTextBoxView;

});