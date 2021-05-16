/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/controls/table/cells/searchbox/searchbox.view',
  'csui/utils/contexts/factories/connector',
  'csui/utils/base',
  "i18n!csui/controls/table/impl/nls/lang",
  'hbs!csui/controls/table/cells/searchbox/empty.results',
  'csui/lib/bootstrap3-typeahead',
  'css!csui/controls/table/cells/searchbox/searchbox'
], function ($, _, Marionette, SearchBoxView, ConnectorFactory, base, lang, emptyTemplate) {

  var TypeaheadSearchBoxView = SearchBoxView.extend({

    valueChangedEventName: 'item:change',

    events: function () {
      return _.defaults({
        'keyup @ui.searchInput': 'userFilterChanged',
        'keydown': 'onKeyInViewUserFilter',
        'paste @ui.searchInput': 'userFilterChanged',
        'change @ui.searchInput': 'userFilterChanged'
      }, SearchBoxView.prototype.events);
    },

    userFilterChanged: function (event) {
      this.showClearerIfFilterHasValue();
    },

    onKeyInViewUserFilter: function (event) {
      if (!(this.getShown() && this.lastFocused == 'I' && event.keyCode == 13)) {
        this.onKeyInView(event);
      }
    },

    constructor: function TypeaheadSearchBoxView(options) {
      this.defaultOptions = {
        items: 'all',
        delay: 200,
        minLength: 0,
        autoSelect: true,
        handleNoResults: true,
        prettyScrolling: true,
        emptyTemplate: emptyTemplate({"noresultsfound": lang.noResultsFound})
      };

      if (!options.context) {
        throw new Error('Context is missing in the constructor options');
      } else {
        this.context = options.context;
      }
      SearchBoxView.prototype.constructor.apply(this, [undefined, arguments[0]]);

      this.source = this.options.source;
      this.collection = this.options.collection;

      var connector  = this.options.context.getObject(ConnectorFactory),
          isSourceFn = _.isFunction(this.source);
      if (!this.source) {
        throw new Error("user.seachbox options require a source to be set");
      }
      else {
        this.source = isSourceFn ? _.bind(this.source, this) : this.source;
      }
      if (options.sorter) {
        this.sorter = options.sorter;
      } else {
        this.sorter = isSourceFn ? this._sortMembers : null;
      }
      if (options.matcher) {
        this.matcher = options.matcher;
      } else {
        this.matcher = isSourceFn ? this._matchMembers : null;
      }

      this.listenTo(this, 'render', _.bind(this.initializeTypeahead, this));
    },

    initializeTypeahead: function () {
      _.defaults(this.options, this.defaultOptions);

      var typeaheadOptions = {
        matcher: this.matcher,
        sorter: this.sorter,
        source: this.source,
        displayText: this.options.displayText && _.bind(this.options.displayText, this),
        highlighter: this.options.highlighter && _.bind(this.options.highlighter, this),
        afterSelect: _.bind(this.options.afterSelect || this._afterSelect, this),
        updater: _.bind(this.options.updater || this._updater, this),
        accessibility: _.bind(this.options.accessibility || this._accessibility, this),
        appendTo: this.ui.searchBox
      };

      if (this.lastFilterValue !== undefined) {
        this.$el.addClass('csui-searchbox-shown');
      }
      this.$el.prop('title', ''); // to stop title attribute of parent(column) being assigned to children(dropdown).
      this.ui.searchInput.typeahead(_.extend(this.options, typeaheadOptions));
    },

    hideAndClearPostAction: function (silent) {
      if (this.getFilterValue() !== undefined && !silent) {

        this.setValue();
        this.triggerMethod(this.valueChangedEventName, {column: this.options.filter, keywords: ''});
      }
      this.ui.searchInput.val('');   // empty the search input when search glass is clicked
      this.lastFilterValue = undefined;
      this.triggerMethod('closed');
    },

    _updater: function (item) {
      var updatedModel = item.clone();
      updatedModel.set('name', base.formatMemberName(updatedModel));
      return updatedModel;
    },

    _matchMembers: function (item) {
      return true;
    },

    _sortMembers: function (items) {
      return items;
    },

    _searchFieldClearerClicked: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.showInputField = true;
      this.ui.searchInput.val('');
      this.ui.clearer.addClass('binf-hidden');
      this.lastFilterValue = ''; // show empty input field on re-render
      this.setFocusToInput();
      this.triggerMethod(this.valueChangedEventName, {
        'column': this.options.filter,
        'keywords': ''
      });
    },

    _afterSelect: function (item) {
      var val = this.options.clearOnSelect ? '' : base.formatMemberName(item);
      this.ui.searchBox.val(val);
      this.trigger(this.valueChangedEventName, {
        column: this.options.filter,
        keywords: item.get('id')
      });
    },

    setValue: function (val) {
      this.lastFilterValue = ( val === "" ? undefined : val );
    },

    getFilterValue: function () {
      return this.lastFilterValue;
    },

    getColumn: function () {
      return this.options.filter;
    },

    _accessibility: function (item) {
      this.ui.searchBox.attr('aria-activedescendant', item.attr("id"));
      return;
    },

  });

  return TypeaheadSearchBoxView;

})
;
