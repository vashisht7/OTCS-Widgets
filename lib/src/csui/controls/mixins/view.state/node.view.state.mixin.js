/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/marionette', 'csui/utils/log'
], function (module, _, Marionette, log) {
  'use strict';

  log = log(module.id);

  return {

    getViewStatePage: function () {
      return this._parsePageInfo(this.context.viewStateModel.getViewState('page'));
    },

    getDefaultViewStatePage: function () {
      return this._parsePageInfo(this.context.viewStateModel.getDefaultViewState('page'));
    },

    _parsePageInfo: function (page) {
      if (page) {
        page = page.split('_');
        if (page.length > 1) {
          try {
            return {
              top: parseInt(page[0]),
              skip: parseInt(page[1])
            };
          } catch (error) {
            log.error('invalid page info in url.');
          }
        }
      }
    },

    setViewStatePage: function (top, skip, options) {
      var viewStateModel = this.context.viewStateModel;
      top = top > 50 ? 100 : top;
      if (options && options.default) {
        viewStateModel.setDefaultViewState('page', top + '_' + skip, options);
      }
      return viewStateModel.setViewState('page', top + '_' + skip, options);
    },

    getViewStateOrderBy: function (uiState) {
      var orderBy = uiState ? uiState.order_by : this.context.viewStateModel.getViewState('order_by');
      return this._formatOrderBy(orderBy);
    },

    _formatOrderBy: function (orderBy) {
      return orderBy && orderBy.replace(/_desc/g, ' desc').replace(/_asc/g, ' asc');
    },

    getDefaultViewStateOrderBy: function() {
      var orderBy = this.context.viewStateModel.getDefaultViewState('order_by');
      return this._formatOrderBy(orderBy);
    },

    setViewStateOrderBy: function (orderBy, options) {
      var viewStateModel = this.context.viewStateModel;
      if (orderBy && orderBy.length) {
        var stateOrderBy = viewStateModel.getViewState('order_by'),
            order_by     = orderBy.join();
        if (order_by !== stateOrderBy) {
          order_by = order_by.replace(/ /g, '_');
          if (options && options.default) {
            viewStateModel.setDefaultViewState('order_by', order_by, _.omit(options, 'default'));
          }
          return viewStateModel.setViewState('order_by', order_by, options);
        }
      } else {
        return viewStateModel.setViewState('order_by', undefined, options);
      }
    },

    getViewStateFilter: function () {
      return this.context.viewStateModel.getViewState('filter', true);
    },

    setViewStateFilter: function (filtersString, options) {
      if (this.getViewStateFilter() !== filtersString) {
        var viewStateModel = this.context.viewStateModel;
        options || (options = {});
        options.encode = true;
        if (options && options.default) {
          viewStateModel.setDefaultViewState('filter', filtersString, options);
        }
        return viewStateModel.setViewState('filter', filtersString, options);
      }
    },

    getViewStateTabIndex: function () {
      var tabIndex = this.context.viewStateModel.getViewState('tab');
      if (tabIndex) {
          try {
            tabIndex = parseInt(tabIndex);
          } catch (error) {
            log.error('invalid tab info in url.');
          }
      }
      return tabIndex;
    },

    setViewStateTabIndex: function (tabIndex, options) {
      var viewStateModel = this.context.viewStateModel;
      if (options && options.default) {
        viewStateModel.setDefaultViewState('tab', tabIndex, options);
      }
      return viewStateModel.setViewState('tab', tabIndex, options);
    }

  };

});
