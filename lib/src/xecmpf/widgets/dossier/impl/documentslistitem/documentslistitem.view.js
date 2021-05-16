/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'conws/models/favorite.model',
  'xecmpf/utils/document.thumbnail/document.thumbnail.view',
  'xecmpf/widgets/dossier/impl/documentslistitem/impl/metadata.model',
  'xecmpf/widgets/dossier/impl/documentslistitem/impl/metadata.view',
  'hbs!xecmpf/widgets/dossier/impl/documentslistitem/impl/documentslistitem',
  'i18n!xecmpf/widgets/dossier/impl/nls/lang',
  'css!xecmpf/widgets/dossier/impl/documentslistitem/impl/documentslistitem'
], function ($, _, Backbone, Marionette,
    FavoriteModel, DocumentThumbnailView, MetadataCollection, MetadataView,
    template, lang) {

  var DocumentsListItem;

  DocumentsListItem = Marionette.ItemView.extend({

    tagName: 'li',

    className: 'xecmpf-document-list-item',

    constructor: function DocumentsListItem(options) {
      options || (options = {});
      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      this.favModel = new FavoriteModel({
            selected: this.model.get('favorite')
          },
          {
            connector: this.model.connector,
            node: this.model
          });
      this.listenTo(this.favModel, 'change:selected', this.render);
    },

    template: template,

    templateHelpers: function () {
      return {
        enableIcon: true,
        hideMetadata: this.options.hideMetadata,
        hideFavorite: this.options.hideFavorite,
        addFav: lang.addFav + this.options.model.get('name'),
        removeFav: lang.removeFav + this.options.model.get('name')
      }
    },

    ui: {
      thumbnailEL: '.xecmpf-document-preview',
      metadataEl: '.document-category-attributes'
    },

    triggers: {
      'click a.socialFav.selected': 'remove:favorite',
      'click a.socialFav.notselected': 'add:favorite'

    },
    events: {
      'keydown a.socialFav.selected': function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
          this.triggerMethod('remove:favorite');
        }
      },

      'keydown a.socialFav.notselected': function (event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
          this.triggerMethod('add:favorite');
        }
      }
    },

    onRemoveFavorite: function (e) {
      this.favModel.remove();
      this.model.set('favorite', false);
      this.render();
    },

    onAddFavorite: function (e) {
      this.favModel.add();
      this.model.set('favorite', true);
      this.render();
    },

    _renderMetadata: function () {
      var metadata_categories = this.model.get('metadata_categories');
      if (!_.isEmpty(metadata_categories)) {
        var metadataCollection = new MetadataCollection(undefined, {
          data: metadata_categories,
          hideEmptyFields: this.options.hideEmptyFields,
          catsAndAttrs: this.options.catsAndAttrs
        });
        this._metadataView = new MetadataView({collection: metadataCollection});
        this.ui.metadataEl.html(this._metadataView.render().el);
      }
    },

    _renderThumbnail: function () {
      this._documentThumbnailView = new DocumentThumbnailView({
        model: this.model,
        enableCaption: true
      });
      this.ui.thumbnailEL.html(this._documentThumbnailView.render().el);
    },

    onRender: function () {
      this._renderThumbnail();
      if (this.options.hideMetadata !== true) {
        this._renderMetadata();
      }
    },

    onBeforeDestroy: function () {
      this._documentThumbnailView.destroy();
      if (this._metadataView) {this._metadataView.destroy();}
    }
  });

  return DocumentsListItem;
});
