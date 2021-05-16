/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/utils/url',
  'csui/utils/contexts/factories/connector',
  'csui/utils/nodesprites', 'csui/controls/node-type.icon/node-type.icon.view',
  'csui/behaviors/default.action/default.action.behavior',
  'hbs!xecmpf/utils/document.thumbnail/impl/document.thumbnail',
  'i18n!xecmpf/utils/document.thumbnail/impl/nls/lang',
  'css!xecmpf/utils/document.thumbnail/impl/document.thumbnail'
], function (_, $, Marionette, Url,
    ConnectorFactory, NodeSpriteCollection, NodeTypeIconView, DefaultActionBehavior,
    template, lang) {

  var DocumentThumbnailView = Marionette.ItemView.extend({

    className: 'xecmpf-document-thumbnail',

    constructor: function DocumentThumbnailView(options) {
      options || (options = {});
      options.model || (options.model = options.node);
      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      if (!this.model) {
        throw new Error('node is missing in the constructor options.');
      }
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    template: template,

    templateHelpers: function () {
      return {
        title: this.options.title || lang.open,
        document_name:lang.toOpen + this.options.model.get('name'),
        enableCaption: this.options.enableCaption
      };
    },

    ui: {
      thumbnailNotLoadedEl: '.thumbnail_not_loaded',
      imgEl: '.img-doc-preview',
      iconEl: '.csui-type-icon',
      buttonToHide:'.document-thumbnail-wrapper > button'
    },
    
    events:{
        'keydown .thumbnail_not_loaded': function(event){
            if (event.keyCode === 13 || event.keyCode === 32){
            var activeEl = this.$el.find(document.activeElement);
			$(activeEl).trigger("click");
            }
        },
        'keydown button.wrapper': function(event){
            if (event.keyCode === 13 || event.keyCode === 32){
            var activeEl = this.$el.find(document.activeElement);
			$(activeEl).trigger("click");
            }
        }
        
    },

    _showThumbnail: function () {
      this.ui.thumbnailNotLoadedEl
          .addClass('thumbnail_empty')
          .removeClass('binf-hidden thumbnail_missing');
      this.ui.imgEl.addClass('binf-hidden');

      var that = this;
      this.model.connector
          .requestContentAuthToken({id: that.model.get('id')})
          .then(function (response) {
            var url;
            url = Url.combine(that.model.connector.connection.url, '/nodes', that.model.get('id'),
                '/thumbnails/medium/content?token=' + encodeURIComponent(response.token));

            if (typeof $ === 'function' && that.ui.imgEl instanceof $ &&
                that.ui.thumbnailNotLoadedEl instanceof $) {
              that.ui.imgEl.one('error', function () {
                var className = NodeSpriteCollection.findClassByNode(that.model) ||
                                'thumbnail_missing';
                that.ui.thumbnailNotLoadedEl
                    .removeClass('binf-hidden thumbnail_empty')
                    .addClass(className);
                that.ui.imgEl.addClass('binf-hidden');
                that.ui.buttonToHide.addClass('binf-hidden');
                
              });

              that.ui.imgEl
                  .attr('src', url)
                  .one('load', function (evt) {
                    if (evt.target.clientHeight >= evt.target.clientWidth) {
                      that.ui.imgEl.addClass('cs-form-img-vertical');
                    } else {
                      that.ui.imgEl.addClass('cs-form-img-horizontal');
                    }
                    that.ui.thumbnailNotLoadedEl.addClass('binf-hidden');
                    that.ui.imgEl
                        .removeClass('binf-hidden')
                        .addClass('cs-form-img-border');
                  });
              that.ui.imgEl.parent().parent().on('click', function () {
                var args = {
                  model: that.model,
                  abortDefaultAction: false
                };
                that.triggerMethod('before:defaultAction', args);
                if (args.abortDefaultAction === false) {
                  that.triggerMethod('execute:DefaultAction', that.model);
                }
                that.triggerMethod('after:defaultAction', args);
              });
            }
          }, function () {
            if (typeof $ === 'function' && that.ui.imgEl instanceof $ &&
                that.ui.thumbnailNotLoadedEl instanceof $) {
              that.ui.imgEl.addClass('binf-hidden');
              that.ui.thumbnailNotLoadedEl
                  .removeClass('binf-hidden thumbnail_empty')
                  .addClass('csui-icon thumbnail_missing');
            }
          });
    },

    _renderNodeTypeIconView: function () {
      this._nodeIconView = new NodeTypeIconView({
        el: this.ui.iconEl,
        node: this.model
      });
      this._nodeIconView.render();
    },

    onRender: function () {
      this._renderNodeTypeIconView();
      this._showThumbnail();
    },

    onBeforeDestroy: function () {
      if (this._nodeIconView) {this._nodeIconView.destroy();}
    }
  });

  return DocumentThumbnailView;
});
