/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/side.panel/impl/footer.view',
  'csui/controls/side.panel/impl/header.view',
  'hbs!csui/controls/side.panel/impl/side.panel',
  'csui/utils/non-emptying.region/non-emptying.region',
  'csui/utils/log',
  'csui/utils/base',
  'i18n',
  'css!csui/controls/side.panel/impl/side.panel',
  'csui/lib/binf/js/binf'
], function (module, _, $, Backbone, Marionette, LayoutViewEventsPropagationMixin,
    TabablesBehavior, PerfectScrollingBehavior, FooterView, HeaderView, template,
    NonEmptyingRegion, log, base, i18n) {
  log = log(module.id);

  var config   = module.config(),
      DEFAULTS = _.defaults(config, {
        backdrop: 'static',
        keyboard: true,
        focus: true,
        openFrom: 'right'
      });

  var SidePanelView = Marionette.LayoutView.extend({

    className: function () {
      var classNames = ['csui-sidepanel'];
      if (!!this.options.sidePanelClassName) {
        classNames.push(this.options.sidePanelClassName);
      }
      if (SidePanelView.SUPPORTED_SLIDE_ANIMATIONS.indexOf(this.options.openFrom) !== -1) {
        classNames.push('csui-sidepanel--from-' + this.options.openFrom);
      }
      return _.unique(classNames).join(' ');
    },

    attributes: {
      tabindex: -1
    },

    template: template,

    templateHelpers: function () {
      return {
        backdrop: this.options.backdrop
      };
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.csui-sidepanel-body',
        suppressScrollX: true,
        scrollYMarginOffset: 15
      },
      TabablesBehavior: {
        behaviorClass: TabablesBehavior,
        recursiveNavigation: true,
        containTabFocus: true
      }
    },
    
    ui: {
      body: '.csui-sidepanel-body',
      header: '.csui-sidepanel-header',
      backdrop: '.csui-sidepanel-backdrop',
      container: '.csui-sidepanel-container'
    },

    events: {
      'click @ui.backdrop': 'onBackdropClick',
      'keyup': 'onKeyInView',
    },

    regions: function () {
      return {
        header: '@ui.header',
        body: '@ui.body',
        footer: '.csui-sidepanel-footer'
      };
    },

    constructor: function SidePanelView(options) {
      options = _.defaults(options, DEFAULTS);
      var slides = this.extractSlides(options);
      if (!slides || !_.isArray(slides) || !slides.length) {
        throw new Marionette.Error({
          name: 'NoSildesError',
          message: '"slides" must be specified'
        });
      }
      this.slides = slides;

      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.propagateEventsToRegions();
    },

    extractSlides: function (options) {
      if (_.isArray(options.slides) && options.slides.length) {
        return options.slides;
      }
      var slideInfo = _.pick(options, 'title', 'subTitle', 'headerView', 'content', 'footer', 'buttons',
          'leftButtons', 'rightButtons');
      if (_.isEmpty(slideInfo)) {
        return undefined;
      }
      return [slideInfo];
    },

    onKeyInView: function (event) {
      if (this.options.keyboard && event.keyCode === 27 && !event.isDefaultPrevented()) {
        this.hide();
      }
    },

    onBackdropClick: function () {
      if (this.options.backdrop === 'static') {
        this.$el.trigger('focus');
      } else {
        this.hide();
      }
    },

    updateButton: function (id, options) {
      if (!this.footerView.updateButton) {
        throw new Error('Dialog footer does not support button updating.');
      }
      this.footerView.updateButton(id, options);
    },

    show: function (callback) {
      this.trigger("before:show");
      if (!Marionette.isNodeAttached(this.el)) {
        var container = $.fn.binf_modal.getDefaultContainer(),
            region    = new NonEmptyingRegion({
              el: container
            });
        region.show(this);
        setTimeout(_.bind(this._doShow, this, callback));
      } else {
        this._doShow(callback);
      }
      return this;
    },

    _doShow: function (callback) {
      this.$el.addClass("csui-sidepanel-visible");
      $('body').addClass('csui-sidepanel-open');
      this.options.focus && this.$el.trigger('focus');
      this.trigger("after:show");
      _.isFunction(callback) && callback.call(this);
    },

    close: function () {
      log.warn('DEPRECATED: .close() has been deprecated. Use .hide() instead.')
      && console.warn(log.last);
      this.hide();
    },

    hide: function (callback) {
      this.trigger("before:hide");
      this.doDestroy(function () {
        this.trigger("after:hide");
        _.isFunction(callback) && callback.call(this);
      });
    },

    destroy: function () {
      this.hide();
    },

    doDestroy: function (callback) {
      base.onTransitionEnd(this.$el, function () {
        Marionette.LayoutView.prototype.destroy.call(this);
        _.isFunction(callback) && callback.call(this);
      }, this);
      this.$el.removeClass("csui-sidepanel-visible");
    },

    onDestroy: function () {
      this._doCleanup();
    },

    _doCleanup: function () {
      $('body').removeClass('csui-sidepanel-open');
    },

    onRender: function () {
      this.ui.backdrop.height($(document).height());
      this.headerView = new HeaderView(this.options);
      this.header.show(this.headerView);

      this.contentHolders = [];

      this.footerView = new FooterView(this.options);
      this.footer.show(this.footerView);

      this._registerEventHandlers();
      this._showSlide(0, this.onSetFocus);
    },

    _registerEventHandlers: function () {
      this.listenTo(this.footerView, "button:click:back", this._onBackClick);
      this.listenTo(this.footerView, "button:click:next", this._onNextClick);
      this.listenTo(this.footerView, "button:click:cancel", this._onCancelClick);
      this.listenTo(this.footerView, "button:click", this._onBtnClick);

      this.listenTo(this, "click:next", this._onNextClick);
      this.listenTo(this, "click:previous", this._onBackClick);

      this.listenTo(this, "refresh:buttons", this.refreshButtons);
      this.listenTo(this, "update:button", this.updateButton);
      this.listenTo(this.headerView, "close:click", this.hide);
    },

    _onBackClick: function () {
      this._showSlide(this.currentSlideIndex - 1);
    },

    _onNextClick: function () {
      this._showSlide(this.currentSlideIndex + 1);
    },

    _onCancelClick: function () {
      this.hide();
    },

    _onBtnClick: function(btn) {
      if (_.isFunction(btn.click)) {
        var clickEvent = $.Event('click');
        btn.click(clickEvent, this.currentSlide);
        if (clickEvent.isDefaultPrevented()) {
          return;
        }
      }
      Marionette.triggerMethodOn(this.currentSlide.content, "button:click", btn);
      if (btn.close) {
        this.hide();
      }
    },
    _showSlide: function (slideIndex, finishCallback) {
      this._cleanUpCurrentSlide();
      var slide = this.slides[slideIndex];
      this.trigger("show:slide", slide, slideIndex);

      this._updateHeader(slide);
      this._updateBody(slide, slideIndex, finishCallback);
      this.footerView.update({
        slide: slide,
        slideIndex: slideIndex,
        totalSlides: this.slides.length
      });
      if (slide.footer && slide.footer.hide) {
        this.$el.addClass('no-footer');
      } else {
        this.$el.removeClass('no-footer');
      }

      this.currentSlide = slide;
      this.currentSlideIndex = slideIndex;
      this.trigger("shown:slide", slide, slideIndex);
      this.listenTo(slide.content, "update:button", this.updateButton);
      this._completeSlideShow(slide);
    },

    _completeSlideShow: function (slide) {
      if (!!slide.containerClass) {
        this.ui.container.addClass(slide.containerClass);
      }
    },

    _cleanUpCurrentSlide: function () {
      if (!this.currentSlide) {
        return;
      }
      if (this.currentSlide.containerClass) {
        this.ui.container.removeClass(this.currentSlide.containerClass);
      }
    },

    _updateHeader: function (slide) {
      if (!_.isUndefined(this.currentSlideIndex) && 
        this.slides[this.currentSlideIndex] && 
        this.slides[this.currentSlideIndex].headerView) {
        this.slides[this.currentSlideIndex].headerView.$el.addClass('binf-hidden');
      }
      if (!!slide.headerView) {
        var headerRegion = new NonEmptyingRegion({
          el: this.ui.header
        });
        headerRegion.show(slide.headerView);
        slide.headerView.$el.removeClass('binf-hidden');
        this.headerView.$el.addClass('binf-hidden');
      } else {
        this.headerView.$el.removeClass('binf-hidden');
        this.headerView.update(slide);
      }
    },

    onSetFocus: function () {
      this._focusonFirstFocusableElement();
    },

    _focusonFirstFocusableElement: function () {
      var focusableElements = base.findFocusables(this.ui.body);
      if (focusableElements.length) {
        focusableElements.first().trigger("focus");
      }
    },

    _updateBody: function (slide, index, finishCallback) {
      if (!slide.content) {
        throw new Marionette.Error({
          name: 'NoContentError',
          message: '"content" must be specified.'
        });
      }
      if (!_.isUndefined(this.currentSlideIndex)) {
        var currentContent = this.contentHolders[this.currentSlideIndex];
        currentContent.$el.removeClass('csui-slide-visible');
        currentContent.$el.addClass('csui-slide-hidden');
        this.stopListening(currentContent, 'dom:refresh');
      }

      if (index >= this.contentHolders.length) {
        this.contentHolders.push(slide.content);
        var bodyRegion = new NonEmptyingRegion({
          el: this.ui.body
        });
        this.listenToOnce(slide.content, 'show', function () {
          _.isFunction(finishCallback) && finishCallback.call(this);
        });
        bodyRegion.show(slide.content);
        this.listenToOnce(slide.content, 'dom:refresh', function () {
          this.triggerMethod('dom:refresh');
        });
      }
      var content = this.contentHolders[index];
      content.$el.removeClass('csui-slide-hidden');
      content.$el.addClass('csui-slide-visible');
    },

    onShow: function () {
      if (this.footerView && this.footerView.triggerMethod) {
        this.footerView.triggerMethod('dom:refresh');
        this.footerView.triggerMethod('after:show');
      }
    }

  }, {
    SUPPORTED_SLIDE_ANIMATIONS: ["left", "right"]
  });

  _.extend(SidePanelView.prototype, LayoutViewEventsPropagationMixin);

  return SidePanelView;
});
