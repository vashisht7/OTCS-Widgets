/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'xecmpf/widgets/header/impl/previewpane/impl/previewpane.list.view',
  'hbs!xecmpf/widgets/header/impl/previewpane/impl/previewpane', 'i18n',
  'css!xecmpf/widgets/header/impl/previewpane/impl/previewpane'
], function (_, $, Marionette,
    base, PerfectScrollingBehavior, LayoutViewEventsPropagationMixin,
    PreviewListView, template, i18n) {

  var PreviewPaneView = Marionette.LayoutView.extend({

    className: 'xecmpf-preview binf-panel binf-panel-default',

    constructor: function PreviewPaneView(options) {
      Marionette.LayoutView.prototype.constructor.call(this, options);
      options || (options = {});
      this.config = options.config;

      if (this.config) {
        this.parent = options.parent;
        this.config.readonly = true;

        this.docsCollection = options.collection;
        this.headerTitle = options.headerTitle;
        this.footerInfoText = options.info;
        this.direction = i18n.settings.rtl ? 'left' : 'right';
        options.parent.$el.binf_popover({
          content: this.$el,
          placement: "auto " + this.direction,
          trigger: 'manual',
          container: 'body',
          html: true,
          title: options.headerTitle
        });

        var $tip = this.parent.$el.data('binf.popover');
        var $pop = $tip.tip();
        var customPopoverClass = !options.customPopoverClass ? options.customPopoverClass : "";
        $pop.addClass('xecmpf-previewpane-popover').addClass(options.customPopoverClass);
        if (options && options.headerColor) {
          if (this.config.debug === true) {
            console.log('add headerColor ' + options.headerColor + ' to ' +
                        $pop.find('.binf-popover-title'));
          }
          $pop.find('.binf-popover-title').addClass(options.headerColor);
        }
        this.parent.$el.off('click').on('click', $.proxy(function () {
          if (this.config.debug === true) {
            console.log('Preview : Keyboard enter item');
          }
          this.show();
          var index = 0;
          var nthChildSel = _.str.sformat('div a:nth-child({0})', index + 1);
          var $item = this.docsListView.$(nthChildSel);
          $item.first().trigger("focus");
        }, this));

        this.parent.$el.off('mouseenter').on('mouseenter', $.proxy(function () {
          if (this.config.debug === true) {
            console.log('Preview : Mouseenter item');
          }
          this.show();
        }, this));

        this.parent.$el.off('keydown').on('keydown', $.proxy(function () {
          if(event.keyCode === 13 || event.keyCode === 32  )
          {
            this.show();
          }
          if (event.keyCode === 27 && this.isRendered ){
          this._delayedHide();	
          }
        }, this));

        this.toggle = 0;
        this.parent.$el.on('touchend', $.proxy(function () {
          if (this.config.debug === true) {
            console.log('Preview : touchend item');
          }

          if (!this.$el.is(":visible")) {
            this.toggle = 0;
          }

          if (this.toggle === 0) {
            this.show();
          } else if (this.toggle === 1) {
            this._delayedHide();
          }
        }, this));

        this.parent.$el.off('mouseleave').on('mouseleave', $.proxy(function () {
          if (this.config.debug === true) {
            console.log('Preview : Mouseleave item');
          }
          this._delayedHide();
        }, this));

        $pop.off('mouseenter').on('mouseenter', $.proxy(function () {
          if (this.config.debug === true) {
            console.log('Preview : Mouseenter binf-popover');
          }
          this.show();
        }, this));

        $pop.off('keydown').on('keydown', $.proxy(function (event) {
          if(event.keyCode === 27){this._delayedHide();}
                  }, this));

        $pop.off('mouseleave').on('mouseleave', $.proxy(function () {
          if (this.config.debug === true) {
            console.log('Preview : Mouseleave binf-popover');
          }
          this._delayedHide();
        }, this));

        this.propagateEventsToRegions();
        this.listenTo(this, 'dom:refresh', function () {
          this.options.parent.$el.binf_popover('show');
        });
      }
    },

    template: template,

    regions: {
      contentRegion: '.xecmpf-preview-body',
      footerRegion: '.xecmpf-preview-footer'
    },

    templateHelpers: function () {
      return {
        title: this.headerTitle,
        info: this.footerInfoText
      };
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.xecmpf-preview-body',
        suppressScrollX: true
      }
    },

    onBeforeDestroy: function (e) {
      if (this.config) {
        this.parent.$el.binf_popover('destroy');
      }
    },

    show: function () {
      if (this.config) {
        var that = this;

        if (this.config.debug === true) {
          console.log('Preview : Preparing show');
        }
        if (this.hideTimeout) {
          clearTimeout(this.hideTimeout);
          if (this.config.debug === true) {
            console.log('Preview : Cleared hide timeout');
          }
          this.hideTimeout = null;
        }
        if (this.$el.is(":visible")) {
          if (this.config.debug === true) {
            console.log('Preview : Already visible');
          }
          return;
        }

        this.showCancelled = false;

        this.$el.hide();
        this.render();

        if (this.docsListView) {
          this.docsListView.destroy()
        }

        this.docsListView = new PreviewListView({
          collection: this.docsCollection,
          enableIcon: this.options.enableIcon,
          enableDescription: this.options.enableDescription,
          previewPane: this,
          config: this.config
        });

        this.listenTo(this.docsListView, 'before:DefaultAction', function (args) {
          args.cancelDefaultAction = this.options.cancelDefaultAction
        });

        if (!this.showCancelled) {

          if (this.config.debug === true) {
            console.log('Preview : Showing');
          }
          this.contentRegion.show(this.docsListView, {
            render: true
          });
          this.$el.show();
          this.triggerMethod('before:show', this);
          this.toggle = 1;
          this.options.parent.$el.binf_popover('show');
          this.triggerMethod('show', this);

          if (this.config.debug === true) {
            console.log("Viewport height: " + $(window).height());
            console.log("document height: " + $(document).height());
            console.log("body     height: " + $('body').height());
            console.log("binf-popover  height: " + this.$el.height());
            console.log("list     height: " +
                        this.$el.find('.xecmpf-preview-body').height());
          }
        } else if (this.config.debug === true) {
          console.log('Preview : Show was cancelled');
        }
      }
    },

    hide: function () {
      if (this.config.debug === true) {
        console.log('Preview : Going to hide');
      }

      if (this.config && !this.config.debugNoHide) {
        if (this.config.debug === true) {
          console.log('Preview : Hidden');
        }
        this.toggle = 0;
        this.options.parent.$el.binf_popover('hide');
        this.hideTimeout = null;
      } else {
        if (this.config.debug === true) {
          console.log('Preview : Leaving visible');
        }
      }

      this.showCancelled = true;
      this.hideTimeout = null;
    },

    _delayedHide: function () {
      if (this.config.debug === true) {
        console.log('Preview : Setting hide timeout');
      }
      this.hideTimeout = window.setTimeout($.proxy(this.hide, this), 200);
    },

    onShow: function () {
      this.$('.cs-simplelist.binf-panel').css('height',
          this.$('.binf-panel-body.xecmpf-preview-body').height());

      if (!this.footerInfoText) {
        $(this.regions.footerRegion).hide()
      }
    }
  });

  _.extend(PreviewPaneView.prototype, LayoutViewEventsPropagationMixin);

  return PreviewPaneView;
});