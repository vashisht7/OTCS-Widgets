/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/utils/node.links/node.links',
  'hbs!csui/controls/thumbnail/content/thumbnail.icon/impl/thumbnail.icon',
  'hbs!csui/controls/thumbnail/content/thumbnail.icon/impl/thumbnail.image',
  'i18n!csui/controls/thumbnail/content/thumbnail.icon/impl/nls/localized.strings',
  'csui/controls/thumbnail/content/content.registry',
  'csui/controls/dialog/dialog.view',
  'csui/controls/thumbnail/content/thumbnail.icon/util/gallery.view',
  'csui/utils/thumbnail/thumbnail.object',
  'csui/models/nodes',
  'csui/utils/url',
  'csui/utils/taskqueue',
  'csui/utils/commands/download',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/lib/exif',
  'css!csui/controls/thumbnail/content/thumbnail.icon/impl/thumbnail.icon'
], function (module, _, $, Backbone, Marionette, base, NodeTypeIconView, nodeLinks, template,
    templateImage, lang,
    ContentRegistry, DialogView, GalleryView, Thumbnail, NodeCollection, Url, TaskQueue,
    DownloadCommand, PerfectScrollingBehavior, EXIF) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    parallelism: 3
  });
  var disableMultipleClicks = false;
  var ThumbnailIconView = Marionette.LayoutView.extend({

    className: 'csui-thumbnail-icon-view',

    ui: {
      thumbnailIcon: '.csui-thumbnail-content-icon',
      iconcloseGallery: '.icon-close-gallery'
    },

    events: {
      'keydown': 'onKeyInView',
      'keydown click @ui.iconcloseGallery': 'handleShiftKey',
      'click @ui.thumbnailIcon': 'showThumbCarousel',
      'keyup @ui.thumbnailIcon': 'showGalleryView'
    },

    template: template,

    regions: {
      imageRegion: '.csui-thumbnail-content-icon'
    },

    templateHelpers: function () {
      var node = this.model,
          thumbnailAction = this.model.get("mime_type") &&
                            this.model.get("mime_type").match(/^image|video\/*[-.\w\s]*$/g) ||
                            this.model.get("type") === 144,
          defaultActionUrl = nodeLinks.getUrl(this.model),
          typeAndName = _.str.sformat(lang.typeAndNameAria, node.get('type_name'),
              node.get('name'));
      return {
        thumbnailAction: thumbnailAction,
        cid: (this.model && this.model.cid) || this.options.model.cid,
        defaultActionUrl: defaultActionUrl,
        typeAndNameAria: typeAndName,
        inactive: node.get('inactive'),
        inCreateMode: !this.model.get('id') // if node is in create mode e.g. add folder,
      };
    },

    constructor: function ThumbnailIconView(options) {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

      this.thumbnailObj = new Thumbnail({node: this.model});
      this.listenTo(this.thumbnailObj, 'loadUrl', this.render);
      this.showingCarousel = false;
    },

    onRender: function () {
      if (this.thumbnailObj.available()) {
        if (this.thumbnailObj.imgUrl) {
          var imageView = new ThumbnailImageView({model: this.model});
          this.imageRegion.show(imageView);
          return; // don't show the NodeTypeIconView
        } else {
          this.thumbnailObj.loadUrl();
        }
      }
      var iconView = new NodeTypeIconView({node: this.model});
      this.imageRegion.show(iconView);
    },

    showGalleryView: function (event) {
      if (event.keyCode === 13 || event.keyCode === 32) {
        this.showThumbCarousel(event);
      }
    },


    showThumbCarousel: function (event) {
      if (!this.showingCarousel) {
        this.showingCarousel = true;
        var self = this,
            showGalleryView = false;
        if (base.isSafari() || base.isMSBrowser() || base.isAppleMobile()) {
          showGalleryView = this.model.get("mime_type") &&
                            (this.model.get("mime_type").match(/^image\/*[-.\w\s]*$/g) ||
                            this.model.get("mime_type").match(/^video\/(mp4|mov)$/g));
        } else {
          showGalleryView = this.model.get("mime_type") &&
                            (this.model.get("mime_type").match(/^image\/*[-.\w\s]*$/g) ||
                            this.model.get("mime_type").match(/^video\/(mp4|webm|ogg|mov)$/g));
        }
        if (showGalleryView && showGalleryView.length > 0) {
          this.options.originatingView.blockingView.enable();
          var thumbNailCollection = _.filter(self.model.collection.models, function (model) {
            if (base.isSafari() || base.isMSBrowser() || base.isAppleMobile()) {
              return model.get("mime_type") &&
                    (model.get("mime_type").match(/^image\/*[-.\w\s]*$/g) ||
                      model.get("mime_type").match(/^video\/(mp4|mov)$/g));
            } else {
              return model.get("mime_type") &&
                    (model.get("mime_type").match(/^image\/*[-.\w\s]*$/g) ||
                      model.get("mime_type").match(/^video\/(mp4|webm|ogg|mov)$/g));
            }
          }, this);
          this.fetchGalleryImageURL(thumbNailCollection);
          var thumbnailGalleryData = [],
              currentItemIndex = 0;

          self.thumbNailCollection = thumbNailCollection;
          _.each(thumbNailCollection, function (model, idx) {
            var thumbnailData = {
              name: model.get('name'),
              contentURL: model.contentURL ? model.contentURL :
                          model.thumbnail ? model.thumbnail.imgUrl : '',
              thumbnailURL: (model.thumbnail && model.thumbnail.imgUrl) ? model.thumbnail.imgUrl :
                            model.contentURL ? model.contentURL : '',
              id: model.cid,
              index: idx,
              activeItem: model.get('id') === self.model.get('id'),
              downloadItem: self.downloadItem.bind(null, model),
              executeDefaultAction: self.executeDefaultAction.bind(null, self),
              updateScroll: self.updateScroll.bind(null, self),
              isVideo: model.get("mime_type").match(/^video\/*[-.\w\s]*$/g),
              videoType: model.get("mime_type"),
              model: model,
              videoNotSupportMsg: lang.videoNotSupportMsg,
              originalAvailable: model.contentURL ? true : false,
              thumbnailAvailable: (model.thumbnail && model.thumbnail.imgUrl) ? true : false
            };
            if (model.get('id') === self.model.get('id')) {
              currentItemIndex = idx;
            }
            thumbnailGalleryData.push(thumbnailData);

          }, self);
          var galleryContainer = GalleryView.createGalleryContainer(thumbnailGalleryData,
              currentItemIndex, lang),
              galleryView = new GalleryContentView({el: galleryContainer[0]});
          var dialog = new DialogView({
            title: "",
            headerView: '',
            view: galleryView,
            className: "csui-thumbcarousel-dialog",
            userClassName: "",
            largeSize: true
          });
          if (PerfectScrollingBehavior.usePerfectScrollbar()) {
            galleryContainer.find('.binf-filmstrip-container').addClass('csui-no-scrolling');
          }
          if (!disableMultipleClicks) {
            dialog.show();
            disableMultipleClicks = true;
          } else {
            self.options.originatingView.blockingView.disable();
            return false;
          }
          var dialogLabelElemId = _.uniqueId('dialogLabelId'),
              dialogHeaderTitle = dialog.headerView.$el.find('.binf-modal-title');
          if (dialogHeaderTitle) {
            dialogHeaderTitle.attr('id', dialogLabelElemId);
            dialogHeaderTitle.html(lang.GalleyViewTitle);
            dialog.headerView.$el.attr('aria-labelledby', dialogLabelElemId);
          }

          dialog.headerView.$el.find('.cs-icon-cross').removeClass("cs-icon-cross").addClass(
              "icon-close-gallery");
          dialog.headerView.$el.on('keydown click', _.bind(this.handleShiftKey, this));
          self.options.originatingView.blockingView.disable();
          self.galleryView = galleryView;

          var activeThumbnail = galleryContainer.find('.csui-preview-carousal .binf-active');
          setTimeout(function () {
            GalleryView.updateSlide(event, activeThumbnail);
            self.showingCarousel = false;
          }, 200);

        } else if (!this.model.get("inactive") && !!this.model.get('id')) {
          this.trigger('execute:defaultAction', event);
        }
      }
    },

    handleShiftKey: function (event) {
      var shiftKey = event.shiftKey;
      if (event.shiftKey && event.keyCode === 9) {
        var cid = this.thumbNailCollection[this.thumbNailCollection.length - 1].cid;
        setTimeout(function () {
          $(".binf-filmstrip-item-" + cid).trigger('focus');
        }, 200);
      }
      disableMultipleClicks = false;
    },

    downloadItem: function (nodeModel, event) {
      new DownloadCommand().execute({
        nodes: new NodeCollection([nodeModel])
      });
    },

    executeDefaultAction: function (self) {
      self.options.originatingView.thumbnail.trigger('execute:defaultAction', self.model);
    },
    updateScroll: function (view, element) {
      view.galleryView.updateScrollbar(element);
    },

    fetchGalleryImageURL: function (models) {
      var self = this,
          queue = new TaskQueue({
            parallelism: config.parallelism
          }),
          promises = _.map(models, function (model) {
            var deferred = $.Deferred();
            if (!model.contentURL) {
              queue.pending.add({
                worker: function () {
                  self._fetchImageOpenURL(model).done(function (node) {
                    deferred.resolve(node);
                  }).fail(function (node) {
                    deferred.reject(node);
                  });

                  return deferred.promise();
                }
              });
            }
            return deferred.promise(promises);  // return promises
          });
      return $.whenAll.apply($, promises);
    },

    _fetchImageOpenURL: function (node) {
      var self = this,
          deferredObject = $.Deferred();
      if (!node.thumbnail) {
        node.thumbnail = new Thumbnail({node: node});
      }
      var photoOptions = node.thumbnail.getPhotOptions(node);

      if (node.get("type") === 144) {
        node.connector.makeAjaxCall(photoOptions).done(
            _.bind(function (response, textStatus, jqXHR) {
              node.contentURL = node.thumbnail.getContentUrl(response);
              node.addedOriginalImage = true;
              self.displayGalleryItems(node, response);
              deferredObject.resolve();
            }, this)).fail(_.bind(function (jqXHR, textStatus, errorThrown) {
          node.contentURL = node.thumbnail && node.thumbnail.defaultImgUrl;
          node.addedOriginalImage = false;
          self.displayGalleryItems(node, undefined);
          deferredObject.reject(errorThrown);
        }, this));
      }
      return deferredObject.promise();
    },

    displayGalleryItems: function (node, response) {
      var transformDegrees = 0, flipRight = false,
          self = this;

      if (node.get("mime_type").match(/^video\/!*[-.\w\s]*$/g)) {
        var video = self.galleryView &&
                    self.galleryView.$el.find(".binf-item-" + node.cid).find("video");
        if (video.length > 0) {
          video.attr("src", node.contentURL);
          self.galleryView.$el.find(".binf-item-" + node.cid).addClass(
              "csui-item-original");
          self.galleryView.$el.find(
              ".binf-item-" + node.cid + " .csui-img-loader").addClass(
              "binf-hidden");
        }
      } else {
        var galleryItem = self.galleryView &&
                          self.galleryView.$el.find(".binf-item-" + node.cid),
            thumbnailImage = galleryItem.find(".csui-gallery-thumbnail-icon"),
            originalImage = galleryItem.find(".csui-gallery-original-icon");

        if (thumbnailImage.length > 0) {
          thumbnailImage.addClass("binf-hidden");
        } else {
          self.galleryView.$el.find(
              ".binf-item-" + node.cid + " .outer-border").addClass(
              "binf-hidden");
        }
        originalImage.find("img").attr("src", node.contentURL);
        originalImage.find("img").addClass("csui-item-original");
        originalImage.removeClass("binf-hidden");

        if (response) {
          EXIF.getData(response, function () {
            var myData = this,
                orientation = myData && myData.exifdata && myData.exifdata.Orientation;
            if (orientation === 7 || orientation === 8) {
              transformDegrees = -90;
            } else if (orientation === 5 || orientation === 6) {
              transformDegrees = 90;
            } else if (orientation === 3 || orientation === 4) {
              transformDegrees = 180;
            } else {
              transformDegrees = 0;
            }
            node.transformDegrees = transformDegrees;
            if (orientation === 2 || orientation === 4 || orientation === 5 ||
                orientation === 7) {
              flipRight = true;
              node.flipRight = true;
            }
            if (flipRight) {
              originalImage.find("img").css({
                "transform": "scaleX(-1)",
                "filter": "FlipH",
                "-ms-filter": "FlipH"
              });
            }
            originalImage.find("img").css({
              "transform": "rotate(" + transformDegrees + "deg)"
            });

          });
        }
        var filmstripItem = self.galleryView &&
                            self.galleryView.$el.find(".binf-filmstrip-item-" + node.cid);
        if (!filmstripItem.find("img").attr("src") ||
            (!!filmstripItem.find("img").attr("src") &&
             filmstripItem.find("img").hasClass('binf-hidden'))) {
          filmstripItem.find("img").attr("src", node.contentURL).removeClass('binf-hidden');
          filmstripItem.find(".mime_image").addClass('binf-hidden');
        }
      }
    },

    onKeyInView: function (event) {
      if (event.keyCode === 13 || event.keyCode === 32) {
        this.$el.find('a.csui-thumbnail-content-default-action').trigger('click');
      }
    }
  });

  var ThumbnailImageView = Marionette.ItemView.extend({

    templateHelpers: function () {
      var description = this.model.get('description');

      return {
        imgUrl: this.model.get('csuiThumbnailImageUrl'),
        title: description ? description : this.model.get('name')
      };
    },

    template: templateImage,

    constructor: function ThumbnailImageView(options) {
      options || (options = {});

      ThumbnailImageView.__super__.constructor.call(this, options);
    }
  });

  var GalleryContentView = Marionette.View.extend({

    constructor: function GalleryContentView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.binf-filmstrip-container',
        suppressScrollY: true,
        scrollXMarginOffset: 2
      }
    },
    updateScrollbar: function (element) {
      this.trigger('update:scrollbar');
      var container = this.$(this.behaviors.PerfectScrolling.contentParent),
          scrollX = this.$el.find('.binf-filmstrip-container').scrollLeft(),
          adjustScrollLeft;
      if (element.offset().left + element.width() >= container.width()) {
        adjustScrollLeft = element.offset().left - container.width() + scrollX + element.width() +
                           20;
      } else if (element.offset().left <= 0) {
        adjustScrollLeft = element.offset().left + scrollX - 5;
      }
      this.$(this.behaviors.PerfectScrolling.contentParent).animate(
          {scrollLeft: adjustScrollLeft}, "fast");
    }
  });

  ContentRegistry.registerByKey('thumbnailIcon', ThumbnailIconView);
  return ThumbnailIconView;
});
