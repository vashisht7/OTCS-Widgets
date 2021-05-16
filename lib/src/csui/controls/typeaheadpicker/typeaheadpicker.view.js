/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/utils/base',
  'csui/utils/url',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/typeaheadpicker/impl/typeaheaditem.view',
  'i18n!csui/controls/typeaheadpicker/nls/typeaheadpicker.lang',
  'hbs!csui/controls/typeaheadpicker/impl/typeaheadpicker',
  'css!csui/controls/typeaheadpicker/impl/typeaheadpicker',
  'css!csui/controls/form/impl/fields/typeaheadfield/typeaheadfield',
  'csui/lib/bootstrap3-typeahead',
  'csui/lib/jquery.when.all'
], function (module, _, $, Backbone, Marionette, Handlebars,
    Base, Url,
    TabableRegionBehavior, TypeaheadItemView,
    lang, template) {

  var TypeaheadPickerView = Marionette.LayoutView.extend({

    template: template,

    templateHelpers: function () {
      var id2Use = this.options.id_input && this.options.id_input.length > 0 ?
                   this.options.id_input : _.uniqueId('csui-typeaheadpicker-input');
      return {
        placeholder: this.options.placeholder,
        id_input: id2Use,
        ariaLabel: this.options.ariaLabel || this.options.placeholder,
        idBtnDescription: this.options.descriptionId,
        clearValue: lang.clearValue,
        isRequired: this.options.isRequired,
        classItemPicker: this.options.css && this.options.css.itemPicker || 'csui-control-typeaheadpicker'
      };
    },

    ui: {
      itempicker: 'div.cs-item-picker',
      searchbox: 'input.typeahead',
      searchicon: '.typeahead.cs-search-icon',
      searchclear: '.typeahead.cs-search-clear'
    },

    behaviors: function () {
      return {
        TabableRegionBehavior: {
          behaviorClass: TabableRegionBehavior
        }
      };
    },

    currentlyFocusedElement: function (options) {
      if (!!this.ui.searchclear && $(this.ui.searchclear).is(':visible') && options &&
          options.shiftKey) {
        return this.ui.searchclear;
      } else {
        return this.ui.searchbox;
      }
    },

    triggers: {
      'click @ui.searchbox': 'click',
      'click @ui.searchicon': 'click'
    },

    events: {
      'keyup @ui.searchbox': 'onKeyUp',
      'keydown @ui.searchbox': 'onKeyDown',
      'click @ui.searchclear': 'onClickClear',
      'keydown @ui.searchclear': 'onClickClear',
      'dragstart .typeahead.binf-dropdown-menu li > a': 'onDragItem'
    },

    constructor: function TypeaheadPickerView(options) {
      options || (options = {});

      if (options.css && options.css.root) {
        this.className = options.css.root;
      }
      (options.placeholder !== undefined) || (options.placeholder = lang.placeholderDefault);
      options.clearOnSelect || (options.clearOnSelect = false);
      options.items || (options.items = 'all');
      options.delay || (options.delay = 200);
      options.disabledMessage || (options.disabledMessage = '');
      options.prettyScrolling || (options.prettyScrolling = false);
      if (!options.collection) {
        throw new Error('Collection is missing in the constructor options.');
      }
      if (!options.model) {
        options.model = new options.collection.model(undefined, {connector: options.collection.connector});
      }
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    onRender: function () {
      var that = this;
      $(this.ui.searchicon).on("click", _.bind(this.onClickIcon, this));
      var emptyTemplate = Handlebars.compile('<span>'+
        '<li class="csui-typeahead-picker-no-results{{#if classNoResults}} {{classNoResults}}{{/if}}">{{langNoResults}}</li>'+
          '</span>')({
        classNoResults: this.options.css && this.options.css.noResults,
        langNoResults: lang.noResults
      });
      var typeaheadOptions = {
        items: this.options.items,
        delay: this.options.delay,
        collection: this.collection,
        autoSelect: false,
        matcher: this._matchItems,
        sorter: this._sortItems,
        source: _.bind(this._retrieveItems, this),
        displayText: _.bind(this._retrieveDisplayText, this),
        highlighter: _.bind(this._renderHighlighter, this),
        afterSelect: _.bind(this._afterSelect, this),
        nextHighlighter: _.bind(this._nextHighlighter, this),
        accessibility: _.bind(this._accessibility, this),
        currentHighlighter: _.bind(this._currentHighlighter, this),
        prettyScrolling: this.options.prettyScrolling,
        appendTo: this.ui.itempicker,
        handleNoResults: true,
        emptyTemplate: emptyTemplate,
        beforeShow: this._beforePositioning,
        afterShow: _.bind(this._positionContainer, this)
      };
      if (this.options.scrollContainerHeight) {
        typeaheadOptions.scrollContainerHeight = this.options.scrollContainerHeight;
      }
      this.ui.searchbox.typeahead(typeaheadOptions);
      if (this.model.get(this.model.idAttribute||'id')) {
        this.ui.searchbox.val(Base.formatMemberName(this.model));
      }
      this.updateStyles();
    },

    onKeyUp: function (e) {
      this.updateStyles();
      if (this.ui.searchbox.val() === "") {
        this.trigger('item:clear');
        this.ui.searchbox.removeAttr('aria-activedescendant');
      }
    },

    onClickIcon: function () {
      if (!this.context || !this.context.$scrollContainer.is(":visible")) {
        this.ui.searchbox.typeahead('lookup');
        this.ui.searchbox.trigger('focus');
      }
    },

    onKeyDown: function (e) {
      if (e.keyCode === 9 && $(this.ui.searchclear).is(":visible")) {
        if (e.shiftKey) {
          this.updateStyles();
          this.ui.searchbox.typeahead('hide');
        } else {
          e.preventDefault();
          e.stopPropagation();
          this.ui.searchclear.trigger('focus');
        }
      }
    },

    onClickClear: function (event) {
      if (event.type === "click" || event.keyCode === 13) {
        this.ui.searchbox.val('');
        this.updateStyles();
        this.trigger('item:clear');
        this.ui.searchbox.removeAttr('aria-activedescendant');
        this.ui.searchbox.typeahead('hide');
        this.ui.searchbox.trigger('focus');
      } else if (event.keyCode === 9 && $(this.ui.searchclear).is(":visible")) {
        if (event.shiftKey) {
          event.preventDefault();
          event.stopPropagation();
          this.ui.searchbox.trigger('focus');
        } else {
          this.updateStyles();
          this.ui.searchbox.typeahead('hide');
        }
      }
    },

    onDragItem: function (e) {
      return false;
    },
    updateStyles: function () {
      var clear = this.ui.searchbox.val() && this.ui.searchbox.val().length > 0;
      this.ui.searchclear.css({
        'display': clear ? '' : 'none'
      });
    },
    _retrieveItems: function (query) {
      if (this.options.onRetrieveItems) {
        return this.options.onRetrieveItems(this.collection,query);
      } else {
        var collection = this.collection;
        var retrieve = $.Deferred();
        if (collection.setFilter(_.object([this.model.nameAttribute||'name'],[query]),{fetch:false})) {
            collection.fetch().then(function(){
              retrieve.resolve(collection.models);
          },function() {
            retrieve.reject();
          });
          return retrieve.promise();
        } else {
          return retrieve.resolve(collection.models).promise();
        }
      }
    },
    
    _retrieveDisplayText: function (item) {
      return item.get(this.model.nameAttribute||'name');
    },

    _renderHighlighter: function (item) {
      var model      = this.collection.findWhere(_.object([this.model.nameAttribute||'name'],[item]));
      var PickerItemView = this.options.TypeaheadItemView ? this.options.TypeaheadItemView(model) : TypeaheadItemView;
      var view = new PickerItemView(_.extend({
        model: model,
        connector: this.collection.connector,
        disabledMessage: this.options.disabledMessage,
        lightWeight: this.options.lightWeight
      },this.options.itemOptions||{}));
      return view.render().el;
    },

    _matchItems: function (item) {

      if (this.options.onMatchItems) {
        return this.options.matchItems(this.collection,item);
      } else {
        return true;
      }
    },

    _sortItems: function (items) {
      return items;
    },

    _afterSelect: function (item) {
      var val = this.options.clearOnSelect ? '' : Base.formatMemberName(item);
      this.ui.searchbox.val(val);
      this.updateStyles();
      this.trigger('item:change', {item: item});
    },
    _currentHighlighter: function (item) {
      return;
    },
    _nextHighlighter: function (item) {
      return;
    },

    _accessibility: function (item) {
      this.ui.searchbox.attr('aria-activedescendant', item.attr(this.model.idAttribute||'id'));
      return;
    },

    _beforePositioning: function (context) {  //prevent the visiblity of position adjustment
      var scrollSelector = context.$element.closest('.csui-perfect-scrolling').length > 0 ?
                           '.csui-perfect-scrolling' : '.csui-normal-scrolling'; //.csui-normal-scrolling for touch devices
      var form = context.$element.closest(scrollSelector);
      if (form.length > 0) {
        if (context.$appendTo) {
          context.$appendTo.addClass('csui-transparent');
        }
      }
    },

    _positionContainer: function (context) {
      var placeVertical = '', controlTop = 0, formTop = 0, formHeight = 0;
      var scrollSelector = context.$element.closest('.csui-perfect-scrolling').length > 0 ?
                           '.csui-perfect-scrolling' : '.csui-normal-scrolling'; //.csui-normal-scrolling for touch devices
      var form = context.$element.closest(scrollSelector);
      var contextHeight = context.$scrollContainer.children(
          'ul.typeahead.binf-dropdown-menu').height();

      var that = this;
      that.context = context;
      form = form.length > 0 ? form : context.$element.closest('.alpaca-field');
      context.$element.addClass('cs-typeaheadfield-height');
      if (form.length > 0) {
        formTop = form.offset().top;
        formHeight = form.height();
        controlTop = context.$element.offset().top;
        if (formTop < 0) {
          formTop = -1 * formTop;
        }

        if ((controlTop - formTop) > (formHeight + formTop - controlTop)) {
          if (controlTop > 0 && context.$scrollContainer.height() >
                                controlTop - form.offset().top) {
            context.$element.css("overflow", "hidden");
            context.$element.perfectScrollbar({suppressScrollX: true});
          }
        }

        if (contextHeight < 450) {
          context.$scrollContainer.children('ul.typeahead.binf-dropdown-menu').append($("<div" +
                                                                                        " class='picker-spacer'>spacer</div>"));
        }
        context.$scrollContainer.css("height", "auto");
        setTimeout(function () {
          context.$scrollContainer.scrollTop(0);
          context.$scrollContainer.children('ul.typeahead.binf-dropdown-menu').find(
              ".picker-spacer").remove();

          var inputEle = context.$element;
          Base.adjustDropDownField(inputEle, context.$scrollContainer, true, that,
              that.hideItemPicker, context.$scrollContainer);

          context.$scrollContainer.perfectScrollbar("update");
          if (context.$appendTo) {
            context.$appendTo.removeClass('csui-transparent');
          }
          that.trigger("typeahead:picker:open");
          that.ui.searchbox.attr("aria-expanded", true);
          that.ui.searchbox.attr('aria-owns', 'user-picker-ul');
        }, 0);
      }
    },

    hideItemPicker: function (view) {
      view.context.$scrollContainer.hide();
      view.trigger("typeahead:picker:close");
      view.ui.searchbox.attr("aria-expanded", false);
    }

  });

  return TypeaheadPickerView;

});
