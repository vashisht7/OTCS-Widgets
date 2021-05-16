/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette3',
  'hbs!csui/widgets/search.results/impl/breadcrumbs/search.breadcrumbs',
  'csui/utils/contexts/factories/next.node',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/utils/node.links/node.links'
], function (_, $, Backbone, Marionette, SearchResultsBreadCrumbTemplate, NextNodeModelFactory,
    TabableRegionBehavior, NodeLinks) {

  var SearchResultsBreadCrumbView = Marionette.View.extend({

    tagName: 'ol',

    className: 'binf-breadcrumb',

    template: SearchResultsBreadCrumbTemplate,

    templateContext: function () {
      var messages = {
        'crumbs': this.collection.models,
        'subcrumbTooltip': this.lang.subcrumbTooltip
      };
      return messages;
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    events: {'keydown': 'onKeyInView'},

    _breadcrumbSelector: 'a.csui-acc-focusable:visible',

    constructor: function SearchResultsBreadCrumbView(options) {
      options || (options = {});
      this.lang = options.lang || {};
      this.collection = options.collection;
      this.isRtl = options.isRtl;
      this.connector = this.collection.connector;

      var crumbModels = this.collection.models;
      for (var i = 0; i < crumbModels.length; i++) {
        crumbModels[i].attributes.node_link_url = this._getAncestorUrl(crumbModels[i]);
      }
      Marionette.View.call(this, options);

      this.listenTo(this.collection, 'update reset', this._adjustToFit);
      this.context = this.options.context;
      this.accLastBreadcrumbElementFocused = true;
      this.accNthBreadcrumbElementFocused = 0;

      this.resizeTimer = undefined;
      $(window).on('resize.' + this.cid, {view: this}, this._onWindowResize);
    },

    _getAncestorUrl: function (crumbModel) {
      return crumbModel.get('id') > 0 && (this.connector) &&
             NodeLinks.getUrl(crumbModel, {connector: this.connector}) || '#';
    },

    _onWindowResize: function (event) {
      if (event && event.data && event.data.view) {
        var self = event.data.view;
        if (self.resizeTimer) {
          clearTimeout(self.resizeTimer);
        }
        self.resizeTimer = setTimeout(function () {
          self._adjustToFit();
        }, 200);
      }
    },

    isTabable: function () {
      return this.collection.models.length > 1;
    },

    currentlyFocusedElement: function () {
      if (this.isTabable()) {
        if (this.accLastBreadcrumbElementFocused) {
          return this.$(this._breadcrumbSelector + ':last');
        } else {
          var breadcrumbElements = this.$(this._breadcrumbSelector);
          return $(breadcrumbElements[this.accNthBreadcrumbElementFocused]);
        }
      } else {
        return $();
      }
    },

    synchronizeCollections: function () {
      return true;
    },

    onKeyInView: function (event) {
      var allBreadcrumbElements;

      switch (event.keyCode) {
      case 37:
      case 38:

        allBreadcrumbElements = this.$(this._breadcrumbSelector);
        if (this.accLastBreadcrumbElementFocused) {
          if (allBreadcrumbElements.length > 1) {
            this.accLastBreadcrumbElementFocused = false;
            this.accNthBreadcrumbElementFocused = allBreadcrumbElements.length - 2;
          }
        } else {
          if (this.accNthBreadcrumbElementFocused > 0) {
            this.accNthBreadcrumbElementFocused--;
          }
        }
        this.trigger('changed:focus', this);
        this.currentlyFocusedElement().trigger('focus');

        break;
      case 39:
      case 40:

        if (!this.accLastBreadcrumbElementFocused) {
          allBreadcrumbElements = this.$(this._breadcrumbSelector);
          if (this.accNthBreadcrumbElementFocused < allBreadcrumbElements.length - 1) {
            this.accNthBreadcrumbElementFocused++;
            this.trigger('changed:focus', this);
            this.currentlyFocusedElement().trigger('focus');
          }
        }
        break;
      }
    },

    refresh: function () {
      this._adjustToFit();
    },

    _adjustToFit: function () {
      if (this.collection.length > 1) {
        if (!!this.options.hasPromoted) {
          this.render();
        }
        this.el.getElementsByClassName('binf-dropdown')[0].classList.add('binf-hidden');
        var availableWidth       = this.el.offsetWidth,
            childs               = this.el.getElementsByClassName('tail'),
            ddChilds             = this.el.getElementsByClassName('csui-breadcrumb-menu'),
            lastEle              = childs[childs.length - 1],
            widthOfPromotedLabel = 0,
            hideAndShowCrumbs    = _.bind(function (index) {
              if (index === 0) {
                this.el.getElementsByClassName('binf-dropdown')[0].classList.remove('binf-hidden');
              }
              childs[index].classList.add('binf-hidden');
              ddChilds[index].classList.remove('binf-hidden');
            }, this);
        if (this.options.hasPromoted) {
          widthOfPromotedLabel = this.$el.closest('.csui-search-promoted-breadcrumbs-row').find(
                  '.csui-search-promoted').outerWidth() + 1;
        }
        for (var i = 0; i < childs.length; i++) {
          childs[i].classList.remove('binf-hidden');
          ddChilds[i].classList.add('binf-hidden');
        }

        for (i = 0; i < this.collection.length - 1; i++) {
          if (this.isRtl) {
            if (lastEle.offsetLeft > this.el.offsetLeft) {
              hideAndShowCrumbs(i);
            } else {
              break;
            }
          } else {
            if (availableWidth < (lastEle.offsetLeft + 32 - widthOfPromotedLabel)) {
              hideAndShowCrumbs(i);
            } else {
              break;
            }
          }
        }

        this.triggerMethod('tabable');
      }
    },

    _getMaxDisplayWidth: function () {
      return (this.el.offsetWidth * 0.9);
    },

    _getDisplayWidth: function () {
      var childs       = this.el.children,
          displayWidth = 0;
      for (var i = 0; i < childs.length; i++) {
        displayWidth += childs[i].offsetWidth;
      }
      return displayWidth;
    },

    onClickAncestor: function (model, node) {
    },

    onBeforeDestroy: function () {
      $(window).off('resize.' + this.cid, this._onWindowResize);
    }

  });

  return SearchResultsBreadCrumbView;

});
