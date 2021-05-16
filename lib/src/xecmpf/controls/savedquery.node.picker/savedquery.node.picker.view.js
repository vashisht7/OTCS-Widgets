/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/lib/marionette', 'csui/lib/handlebars',
  'xecmpf/controls/savedquery.node.picker/impl/search.query.factory',
  'xecmpf/controls/savedquery.node.picker/impl/search.results.factory',
  'xecmpf/controls/savedquery.node.picker/impl/savedquery.form.view',
  'csui/widgets/search.results/search.results.view',
  'css!xecmpf/controls/savedquery.node.picker/impl/savedquery.node.picker'
], function (_, $, Backbone, Marionette, Handlebars,
  SearchQueryModelFactory, SearchResultsCollectionFactory,
  SearchFormView, SearchResultsView) {

  var SavedQueryNodePickerView = Marionette.Object.extend({

    constructor: function SavedQueryNodePickerView(options) {
      options || (options = {});
      options.query || (options.query = options.context.getModel(SearchQueryModelFactory));
      options.collection ||
      (options.collection = options.context.getCollection(SearchResultsCollectionFactory, _.extend({}, options, {
          unique: true,
          temporary: true,
          detached: true,
          internal: false
      })));
      Marionette.Object.prototype.constructor.apply(this, arguments);
    },

    initialize: function (options) {
      this.searchFormView = new SearchFormView({
        context: options.context,
        query: options.query
      });

      this.searchResultsView = new SearchResultsView({
        context: options.context,
        query: options.query,
        collection: options.collection,
        customSearchView: this.searchFormView,
        toolbarItems: this.options.toolbarItems,
        enableBackButton: this.options.enableBackButton,
        titleView: new Marionette.ItemView({
          tagName: 'h2',
          template: Handlebars.compile('<span>{{title}}</span>')({
            title: this.options.title
          })
        })
      });

      if (!this.options.toolbarItems.inlineToolbar) {
        this.searchResultsView.resultsView.lockedForOtherContols = true;
        this.searchResultsView.resultsView.$el.addClass('xecmpf-sq-np-no-inline-toolbar');
      }

      this.listenTo(this.searchResultsView, {
        'set:picker:result': function (result) {
          this._result = result;
        },
        'close go:back': function () {
          this.triggerMethod('close');
        }
      });
    },

    onBeforeDestroy: function () {
      this.options.query.clear();
      this.searchFormView.destroy();
      this.searchResultsView.destroy();
    },

    show: function () {
      this._deferred = $.Deferred();
      var originatingView = this.options.originatingView,
        containerEl = this.options.containerEl;

      if (originatingView instanceof Backbone.View) {
        var $pickerEl = $('<div/>', {
            class: 'xecmpf-savedquery-node-picker'
          }),
          $originatingView = (_.isString(containerEl) && $(containerEl + '>*')) ||
          originatingView.$el;

        $originatingView.parent().append($pickerEl);

        this.searchResultsView.render();
        Marionette.triggerMethodOn(this.searchResultsView, 'before:show');
        $pickerEl.append(this.searchResultsView.el);

        var that = this;
        $pickerEl.show('blind', {
          direction: 'right',
          complete: function () {
            $originatingView.hide();
            originatingView.isDisplayed = false;
            if (that.searchResultsView.ui.searchSidePanel.hasClass('csui-is-hidden')) {
              that.searchResultsView.headerView.triggerMethod('toggle:filter', that.searchResultsView);
            }
            Marionette.triggerMethodOn(that.searchResultsView, 'show');
          }
        }, 100);

        this.listenTo(this, 'close', function () {
          $originatingView.show();
          $originatingView.promise()
            .done(function () {
              originatingView.isDisplayed = true;
              $pickerEl.hide('blind', {
                direction: 'right',
                complete: function () {
                  if (that._result) {
                    that._deferred.resolve(that._result);
                  } else if (that._deferred.state() === 'pending') {
                    that._deferred.reject({
                      cancelled: true
                    });
                  }
                  that.destroy();
                  $pickerEl.remove();
                }
              }, 100);
            });
        });
        return this._deferred;
      }
      return this._deferred.reject().promise();
    }
  });

  return SavedQueryNodePickerView;
});