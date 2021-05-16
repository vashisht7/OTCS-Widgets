/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/controls/tile/behaviors/infinite.scrolling.behavior', 'csui/utils/base'],
  function (_, $, InfiniteScrollingBehavior, Base) {
    var TKLInfiniteScrollingBehavior = InfiniteScrollingBehavior.extend({
      constructor: function TKLInfiniteScrollingBehavior(options, view) {
        InfiniteScrollingBehavior.prototype.constructor.apply(this, arguments);
        this.eventsName = 'scroll.' + this.view.cid;
        if (typeof window.onwheel !== "undefined") {
          this.eventsName += ' wheel.';
        } else if (typeof window.onmousewheel !== "undefined") {
          this.eventsName += ' mousewheel.';
        }        
        this.eventsName += this.view.cid;        
      },

      _bindScrollingEvents: function () {
        var contentParent = this.options.contentParent;
        this._contentParent = contentParent ? this.view.$(contentParent) : this.view.$el;        
        this._contentParent.on(this.eventsName, _.bind(this._checkScrollPosition, this));
        if (Base.isTouchBrowser()) {  
          this._contentParent.one('touchstart.' + this.view.cid,
            _.bind(this._checkScrollPosition, this));
        }        
        var content = this.options.content;
        this._content = content ? this.view.$(content) :
                        contentParent ? this._contentParent.children().first() : this.view.$el;
      },

      _checkScrollPosition: function (event) {       
        if (this.view.fetchMore) {
          var fetchMoreItemsThreshold = this.options.fetchMoreItemsThreshold;
          var contentH;
          if (this._content.length === 1) {
            contentH = this._content.height();
          } else {
            contentH = _.reduce(this._content, function (sum, el) {
              return sum + $(el).height();
            }, 0);
          }
          var scrollableHeight = contentH - this._contentParent.height(),
            scrollablePercentage = this._contentParent.scrollTop() * 100 / scrollableHeight;
          if (scrollablePercentage >= fetchMoreItemsThreshold ||
            (this._contentParent.outerHeight() > contentH)) {
            this._checkScrollPositionFetch(event);
          }
          event.stopPropagation();          
        }        
      },

      _checkScrollPositionFetch: function (event) {
        if (!this.view.isPullingValues) {        
          this.view.pullValidValues(null, true);
        }
      },

      _unbindScrollingEvents: function () {
        if (this._contentParent) {          
          this._contentParent.off(this.eventsName);          
        }
      }
    });

    return TKLInfiniteScrollingBehavior;
  });