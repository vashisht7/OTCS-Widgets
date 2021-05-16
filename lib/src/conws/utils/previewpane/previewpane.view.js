/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/behaviors/widget.container/widget.container.behavior',
  'csui/utils/base',
  'csui/utils/log',
  'csui/utils/url',
  'csui/controls/list/emptylist.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'conws/utils/previewpane/impl/previewheader.model',
  'conws/utils/previewpane/impl/previewheader.view',
  'conws/utils/previewpane/impl/attributes.model',
  'conws/utils/previewpane/impl/role.model',
  'conws/utils/previewpane/impl/rolemembers.view',
  'conws/models/selectedmetadataform/selectedmetadataform.model',
  'conws/controls/selectedmetadataform/selectedmetadataform.view',
  'i18n!conws/utils/previewpane/impl/nls/previewpane.lang',
  'hbs!conws/utils/previewpane/impl/previewpane',
  'css!conws/utils/previewpane/impl/previewpane'
], function (require, _, $, Marionette, Handlebars, WidgetContainerBehavior, base, log, Url,
    EmptyView, PerfectScrollingBehavior, LayoutViewEventsPropagationMixin,
    PreviewHeaderModel, PreviewHeaderView, PreviewAttributesModel,
    RoleMemberCollection, RoleMembersView,
    MetadataModel, MetadataView,
    lang, template) {
  var PreviewPaneView = Marionette.LayoutView.extend({
    className: 'conws-preview panel panel-default',
    template: template,
    regions: {
      headerRegion: '.conws-preview-header',
      metaDataRegion: '.conws-preview-metadata',
      roleMembersRegion: '.conws-preview-role-members'
    },
    triggers: {
      'change #header-ws-add-icon-file': 'add:icon',
      'click  #header-ws-remove-icon': 'remove:icon'
    },
    blankImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=',

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.conws-preview-perfect-scroll',
        suppressScrollX: true
      }
    },
    constructor: function PreviewPaneView(options) {
      Marionette.LayoutView.prototype.constructor.call(this, options);

      options || (options = {});
      this.config = options.config;
      this.fetched = false;
      if (this.config.roleId || this.config.metadata) {
        this.parent = options.parent;

        this.config.noMetadataMessage = this._localize('noMetadataMessage');
        this.config.noRoleMembersMessage = this._localize('noRoleMembersMessage');
        this.config.readonly = true;
        this.headerModel = new PreviewHeaderModel(options);
        this.metaDataModel = new MetadataModel(undefined, {
          node: options.node,
          metadataConfig: this.config,
          autofetch: true,
          autoreset: true
        });

        this.roleMemberCollection = new RoleMemberCollection(null, options);
        var container = $.fn.binf_modal.getDefaultContainer ?
                        $.fn.binf_modal.getDefaultContainer() : 'body';
        options.parent.$el.binf_popover({
          content: this.$el,
          parent: options.parent.$el,
          placement: function () {
            this.$element = this.options.parent;
            var defaultPlacement = "right";
            var placement = defaultPlacement;
            var tip = this.tip();
            tip.detach()
                .css({top: 0, left: 0, display: 'block'})
                .addClass('binf-' + placement)
                .data('binf.' + this.type, this);
            this.options.container ? tip.appendTo(this.options.container) : tip.insertAfter(this.$element);

            var pos = this.getPosition();
            var $container = this.options.container ? $(this.options.container) :
                             this.$element.parent();
            var containerDim = this.getPosition($container);
            var actualWidth = tip[0].offsetWidth;
            if ((pos.right + actualWidth < containerDim.width) || (pos.left - actualWidth > 0)) {
              placement = pos.right + actualWidth > containerDim.width ? 'left' :
                          pos.left - actualWidth < containerDim.left ? 'right' :
                          placement;
            }
            else {
              var defaultPosition = $(this.$element[0]).find('.conws-previewpane-default-position');
              if (defaultPosition.length > 0) {
                this.$element.removeAttr('aria-describedby')
                this.$element = defaultPosition
                this.$element.attr('aria-describedby', tip.attr('id'))
              }
            }
            if( placement !== defaultPlacement ){
              tip.removeClass('binf-' + defaultPlacement).addClass('binf-' + placement);
            }

            return placement;
          },
          trigger: 'manual',
          container: container,
          html: true
        });

        var $tip = this.parent.$el.data('binf.popover');
        var $pop = $tip.tip();
        $pop.addClass('conws-previewpane-popover');

        $pop.on('mouseenter', this, $.proxy(function () {
              if (this.config.debug === true) {
                log.info('Preview ' + this.options.node.get('id') + ': Mouseenter popover') && console.log(log.last);
              }
              this.show();
            }, this)
        );

        $pop.on('mouseleave', this, $.proxy(function () {
              if (this.config.debug === true) {
                log.info('Preview ' + this.options.node.get('id') + ': Mouseleave popover') && console.log(log.last);
              }
              this.delayedHide();
            }, this)
        );

        this.propagateEventsToRegions();
      }
    },

    onBeforeDestroy: function (e) {
      if (this.config.roleId || this.config.metadata) {
        this.parent.$el.binf_popover('destroy');
      }
    },

    show: function () {
      if (this.config.roleId || this.config.metadata) {
        var that = this;

        if (this.config.debug === true) {
          log.info('Preview ' + this.options.node.get('id') + ': Preparing show') && console.log(log.last);
        }
        if (this.hideTimeout) {
          clearTimeout(this.hideTimeout);
          if (this.config.debug === true) {
            log.info('Preview ' + this.options.node.get('id') + ': Cleared hide timeout') && console.log(log.last);
          }
          this.hideTimeout = null;
        }
        if (this.$el.is(":visible")) {
          if (this.config.debug === true) {
            log.info('Preview ' + this.options.node.get('id') + ': Already visible') && console.log(log.last);
          }
          return;
        }

        this.showCancelled = false;

        this.$el.hide();
        this.render();
        var $deferred = $.Deferred();

        if (this.headerView) {
          this.headerView.destroy();
        }

        if (this.roleView) {
          this.roleView.destroy();
        }

        if (this.metaDataView) {
          this.metaDataView.destroy();
        }

        this.headerView = new PreviewHeaderView({model: this.headerModel});
        this.roleView = new RoleMembersView({
          collection: this.roleMemberCollection,
          noRoleMembersMessage: this.config.noRoleMembersMessage,
          context: this.options.context
        });
        this.listenTo(this.roleView, 'click:member', this.hide);

        this.metaDataView = new MetadataView({
          model: this.metaDataModel,
          context: this.options.context
        });
        this.metaDataView.on('render:form', function () {
          that._attachUserFieldHandlers(this);
          $deferred.resolve();
        });

        if( !this.config.metadata ){
          $deferred.resolve();
        }

        var proms;
        if (!this.fetched) {
          proms = [
            this.headerModel.fetch(),
            this.metaDataModel.fetch(),
            this.roleMemberCollection.fetch(),
            $deferred
          ];
        }
        else if ( this.config.metadata ) {
          this.metaDataModel.trigger('change');
          proms = [
            $.Deferred().resolve(),
            $.Deferred().resolve(),
            $.Deferred().resolve(),
            $deferred
          ];
        }

        $.when.apply(this, proms).done(
            _.bind(function () {
              this.fetched = true;
              if (!this.showCancelled) {
                $(".conws-previewpane-popover").each(function (i, el) {
                  var popoverId = $(el).attr('id');
                  $("[aria-describedby^='" + popoverId + "']").binf_popover('hide')
                });

                if (this.config.debug === true) {
                  log.info('Preview ' + this.options.node.get('id') + ': Showing') && console.log(log.last);
                }

                var renderMeta = false;
                if (_.isEmpty(this.metaDataModel.attributes.data)) {
                  this.metaDataView = new EmptyView({text: this.config.noMetadataMessage});
                  renderMeta = true;
                }
                this.headerRegion.show(this.headerView, {render: true});
                this.metaDataRegion.show(this.metaDataView, {render: renderMeta});
                this.roleMembersRegion.show(this.roleView, {render: true});
                this.$el.show();
                this.options.parent.$el.binf_popover('show');

                if (this.config.debug === true) {
                  log.info("Viewport height: " + $(window).height()) && console.log(log.last);
                  log.info("document height: " + $(document).height()) && console.log(log.last);
                  log.info("body     height: " + $('body').height()) && console.log(log.last);
                  log.info("popover  height: " + this.$el.height()) && console.log(log.last);
                  log.info("metadata height: " +
                              this.$el.find('.conws-preview-metadata').height()) && console.log(log.last);
                  log.info("role     height: " +
                              this.$el.find('.conws-preview-role-members').height()) && console.log(log.last);
                }
                this.triggerMethod('dom:refresh');
              }
              else if (this.config.debug === true) {
                log.info('Preview ' + this.options.node.get('id') +
                            ': Show was cancelled -> skipped') && console.log(log.last);
              }
            }, this)
        );
      }
    },

    hide: function () {
      if (this.config.debug === true) {
        log.info('Preview ' + this.options.node.get('id') + ': Going to hide') && console.log(log.last);
      }

      if (this.config && !this.config.debugNoHide) {
        if (this.config.debug === true) {
          log.info('Preview ' + this.options.node.get('id') + ': Hidden') && console.log(log.last);
        }
        this.options.parent.$el.binf_popover('hide');
        this.hideTimeout = null;
      }
      else {
        if (this.config.debug === true) {
          log.info('Preview ' + this.options.node.get('id') + ': Leaving visible') && console.log(log.last);
        }
      }

      this.showCancelled = true;
      this.hideTimeout = null;
    },

    delayedHide: function () {
      if (this.config.debug === true) {
        log.info('Preview ' + this.options.node.get('id') + ': Setting hide timeout') && console.log(log.last);
      }
      this.hideTimeout = window.setTimeout($.proxy(this.hide, this), 200);
    },

    _localize: function (name) {
      var ret = lang[name];

      if (this.config[name]) {
        ret = base.getClosestLocalizedString(this.config[name], ret);
      }

      return ret;
    },
    _attachUserFieldHandlers: function (metadataView) {
      var handler = function (event) {
        log.info("User field mouseover") && console.log(log.last);
        event.stopPropagation();
        return false;
      };

      var userFields = metadataView.$el.find(".cs-userfield .cs-field-read");
      _.each(userFields, function (field) {
        field.addEventListener('mouseover', handler, true);
      });

      handler = $.proxy(this.hide, this);
      metadataView.$el.find(".cs-userfield .cs-field-read-inner").click(handler);
    }
  });

  _.extend(PreviewPaneView.prototype, LayoutViewEventsPropagationMixin);
  return PreviewPaneView;
});
