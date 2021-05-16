/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'module', 'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/lib/jquery',
  'csui/utils/log',
  'csui/widgets/metadata/impl/header/item.name/metadata.item.name.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/controls/form/form.view',
  'csui/utils/nodesprites',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/table/cells/parent/parent.view',
  'csui/utils/contexts/factories/node',
  'csui/utils/thumbnail/thumbnail.object',
  'csui/widgets/metadata/general.panels/document/document.general.form.model',
  'csui/controls/tableheader/comment/comment.button.view',
  'csui/widgets/favorites/favorite.star.view',
  'csui/controls/toolbar/toolbar.command.controller',
  'csui/models/nodes',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/utils/commands',
  'i18n!csui/widgets/document.overview/impl/nls/lang',
  'hbs!csui/widgets/document.overview/impl/document.overview',
  'css!csui/widgets/document.overview/impl/document.overview'
], function (module, _, Marionette, $, log,
    MetadataItemNameView,
    ViewEventsPropagationMixin,
    FormView,
    NodeSpriteCollection,
    NodeTypeIconView,
    ParentCellView,
    NodeModelFactory, Thumbnail, DocumentGeneralFormModel, CommentView,
    FavoriteStarView, ToolbarCommandController,
    NodeCollection,
    PerfectScrollingBehavior, commands, lang, documentOverviewTemplate) {
  'use strict';

  log = log(module.id);

  var DocumentOverviewView = FormView.extend({
    constructor: function DocumentOverviewView(options) {
      options || (options = {});
      options.data || (options.data = {});
      if (!options.node) {
        options.node = options.context.getModel(NodeModelFactory, {
          attributes: options.data.id && { id: options.data.id },
          temporary: true
        });
      }
      this.options = options;
      this._createModel();
      FormView.prototype.constructor.call(this, this.options);

      this.listenTo(this.options.node, "change", this.updateForm);

      this._createMetadataItemNameView();

      this.commandController = new ToolbarCommandController({
        commands: options.commands || commands
      });
      this.commands = this.commandController.commands;
      this.reloadWidget = false;
      this.parentNode = undefined;
      this.supportOriginatingView = true;
    },
    fieldToRefresh: "modify_date",

    _createMetadataItemNameView: function() {
      if (this.metadataItemNameView) {
        this.cancelEventsToViewsPropagation(this.metadataItemNameView);
        this.metadataItemNameView.destroy();
      }

      var inv = (this.metadataItemNameView = new MetadataItemNameView({
        model: this.options.node,
        container: this.options.node.parent,
        containerCollection: this.options.containerCollection,
        collection: this.options.collection,
        context: this.options.context,
        nameSchema: {},
        commands: this.commands,
        originatingView: this,
        showDropdownMenu: true,
        showPropertiesCommand: true
      }));
      this.listenTo(inv, "metadata:item:name:save", this._saveItemName);
      this.listenTo(
        inv,
        "metadata:item:before:delete",
        _.bind(function(args) {
          this.trigger("metadata:item:before:delete", args);
        }, this)
      );
      this.listenTo(
        inv,
        "metadata:item:before:move",
        _.bind(function(args) {
          this.trigger("metadata:item:before:move", args);
        }, this)
      );
      this.listenTo(
        inv,
        "metadata:item:deleted",
        _.bind(function(args) {
          this.trigger("metadata:item:deleted", args);
        }, this)
      );

      this.propagateEventsToViews(this.metadataItemNameView);
    },

    reloadWidget: false,

    formTemplate: documentOverviewTemplate,

    className: "cs-form csui-general-form cs-document-overview-wrapper",

    ui: {
      location: ".location-view",
      back: '.cs-go-back'
    },

    events: {
      "click .command-btn": "_handleClickButton",
      "click .thumbnail_section": "_handleClickThumbnail",
      'click @ui.back' : 'onBackButton',
      'keydown': 'onKeyInView'
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: ".cs-content-container",
        suppressScrollX: true
      }
    },

    onKeyInView: function (e) {
      var event = e || window.event;
      var target = event.target || event.srcElement;
      if (event.keyCode === 13 || event.keyCode === 32) {
        event.preventDefault();
        event.stopPropagation();
        $(target).trigger('click');
      }
    },

    onBackButton: function() {
      history.back();
    },

    _saveItemName: function(args) {
      var self = this;
      var itemName = args.sender.getValue();
      var name = { name: itemName };
      var node = this.options.model;
      node.setFields("versions.element(0)", "owner_id");
      node.set(name, { silent: true });
      var data = _.clone(node.attributes);
      return node
        .save(data, {
          data: name,
          wait: true,
          silent: true
        })
        .then(function() {
          node.fetch({ silent: true }).done(function() {
            self._updateFieldsToRefersh();
            self.metadataItemNameView._toggleEditMode(false, false);
          });
        });
    },

    _handleClickThumbnail: function(event) {
      event.stopImmediatePropagation();
      this._executeCommand("Open");
    },

    _handleClickButton: function(event) {
      event.stopImmediatePropagation();
      var signature = $(event.target).data("signature");
      this._executeCommand(signature);
    },

    _executeCommand: function(signature) {
      var command = this.commands.get(signature);
      var originatingView = this;
      originatingView.collection = new NodeCollection([this.options.node]);

      var status = {
        nodes: new NodeCollection([this.options.node]),
        container: this.options.node,
        originatingView: originatingView
      };
      var options = {
        context: this.options.context
      };

      try {
        if (!command) {
          throw new Error('Command "' + signature + '" not found.');
        }

        command.execute(status, options);
      } catch (error) {
        log.warn(
          'Executing the command "{0}" failed.\n{1}',
          command.get("signature"),
          error.message
        ) && console.warn(log.last);
      }
    },

    _createModel: function() {
      var node = this.options.node;
      this.options.model = new DocumentGeneralFormModel(
        {
          data: {
            name: node.get("name"),
            description: node.get("description"),
            create_date: node.get("create_date"),
            create_user_id: node.get("create_user_id"),
            type: node.get("type"),
            type_name: node.get("type_name"),
            mime_type: NodeSpriteCollection.findTypeByNode(node),
            modify_date: node.get("modify_date"),
            owner_user_id: node.get("owner_user_id"),
            size: node.get("size_formatted"),
            reserved_user_id: node.get("reserved_user_id")
          },
          schema: {
            properties: {
              name: {
                maxLength: 248,
                minLength: 1,
                readonly: true,
                required: true,
                title: "Name",
                type: "string"
              },
              description: {
                readonly: true,
                required: false,
                title: "Description",
                type: "string"
              },
              create_date: {
                readonly: true,
                required: false,
                title: "Created",
                type: "string",
                format: "datetime"
              },
              create_user_id: {
                readonly: true,
                required: false,
                title: "Created By",
                type: "otcs_user_picker"
              },
              type: {
                readonly: true,
                required: false,
                title: "Type",
                type: "integer"
              },
              type_name: {
                readonly: true,
                required: false,
                title: "Type",
                type: "string"
              },
              modify_date: {
                readonly: true,
                required: false,
                title: "Modified",
                type: "string",
                format: "datetime"
              },
              owner_user_id: {
                readonly: true,
                required: false,
                title: "Owned By",
                type: "otcs_user_picker"
              },
              size: {
                hidden: false,
                readonly: true,
                title: "Size",
                type: "string",
                tooltip: "838,049 bytes"
              },
              mime_type: {
                hidden: false,
                readonly: true,
                title: "Type",
                type: "string"
              }
            },
            type: "object",
            title: "General"
          },
          options: {
            fields: {
              name: {
                hidden: false,
                hideInitValidationError: true,
                label: lang.name,
                readonly: true,
                type: "text"
              },
              description: {
                hidden: false,
                rows: 5,
                hideInitValidationError: true,
                label: lang.description,
                readonly: true,
                type: "textarea",
                placeholder: "Add description"
              },
              create_date: {
                hidden: false,
                hideInitValidationError: true,
                label: lang.created,
                readonly: true,
                type: "datetime",
                placeholder: "n/a"
              },
              create_user_id: {
                hidden: false,
                hideInitValidationError: true,
                label: lang.createdBy,
                readonly: true,
                type: "otcs_user",
                type_control: {
                  name: "Admin"
                },
                placeholder: "n/a"
              },
              type: {
                hidden: true,
                hideInitValidationError: true,
                label: lang.type,
                readonly: true,
                type: "integer"
              },
              type_name: {
                hidden: false,
                hideInitValidationError: true,
                label: lang.type,
                readonly: true,
                type: "text"
              },
              modify_date: {
                hidden: false,
                hideInitValidationError: true,
                label: lang.modified,
                readonly: true,
                type: "datetime",
                placeholder: "n/a"
              },
              owner_user_id: {
                hidden: false,
                hideInitValidationError: true,
                label: lang.ownedBy,
                readonly: true,
                type: "otcs_user",
                type_control: {
                  name: "Admin"
                },
                placeholder: "n/a"
              },
              size: {
                hidden: false,
                readonly: true,
                label: lang.size,
                placeholder: "n/a",
                type: "text"
              },
              mime_type: {
                hidden: false,
                readonly: true,
                label: lang.type,
                placeholder: "n/a",
                type: "text"
              }
            }
          }
        },
        this.options
      );
      this.options.model._addReserveInfo(this.options.model.attributes);
    },

    _updateModel: function() {
      var node = this.options.node;

      _.extend(this.model.attributes.data, {
        name: node.get("name"),
        description: node.get("description"),
        create_date: node.get("create_date"),
        create_user_id: node.get("create_user_id"),
        type: node.get("type"),
        type_name: node.get("type_name"),
        mime_type: NodeSpriteCollection.findTypeByNode(node),
        modify_date: node.get("modify_date"),
        owner_user_id: node.get("owner_user_id"),
        size: node.get("size_formatted"),
        reserved_user_id: node.get("reserved_user_id")
      });
      this.model._addReserveInfo(this.model.attributes);
    },

    _getLayout: function() {
      var data = this.alpaca.data,
          context = this.options && this.options.context,
          viewStateModel = context && context.viewStateModel,
          back_button = viewStateModel && viewStateModel.getLastRouterInfo();
      data.name = this.model.get("data").name;
      var template = this.getOption("formTemplate"),
        html = template.call(this, {
          data: data,
          mode: this.mode,
          lang: lang,
          back_button: back_button,
          imgSrc:
            "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
          imgAlt: lang.docPreviewImgAlt
        }),
        bindings = this._getBindings(),
        view = {
          parent: "bootstrap-csui",
          layout: {
            template: html,
            bindings: bindings
          }
        };
      return view;
    },

    _getBindings: function() {
      var bindings = {
        name: "name_section",
        create_user_id: ".created_by_section",
        modify_date: ".modified_section",
        mime_type: ".type_section",
        description: ".description_section",
        size: ".size_section",
        status: "status_section"
      };
      if (this.model && this.model.node && this.model.node.get("reserved")) {
        bindings = _.extend(bindings, {
          reserve_info: ".reserve_info"
        });
      }

      return bindings;
    },

    updateForm: function(event) {
      this._updateModel();
      this._createModel();
      FormView.prototype.constructor.call(this, this.options);
      this.metadataItemNameView = new MetadataItemNameView({
        model: this.options.node,
        container: this.options.node.parent,
        containerCollection: this.options.containerCollection,
        collection: this.options.collection,
        context: this.options.context,
        nameSchema: {},
        commands: this.commands,
        originatingView: this,
        showDropdownMenu: true,
        showPropertiesCommand: true
      });
      this.listenTo(
        this.metadataItemNameView,
        "metadata:item:name:save",
        this._saveItemName
      );
      this.propagateEventsToViews(this.metadataItemNameView);
      FormView.prototype.updateForm.apply(this, arguments);
    },

    updateRenderedForm: function(options) {
      FormView.prototype.updateRenderedForm.apply(this, arguments);

      this._showNodeIcon();
      this._showMetadataItemName();
      this._showThumbnail();
      this._addLocationView();
      this._addCommentView();
      this._addFavoriteView();
      this._checkDescriptionContent();
      this._checkEditPermission();
      this._overrideDefaultScroll();
    },
    _validateAndSave: function() {
      var currentValue = this.metadataItemNameView.getValue().trim();
      var inputValue = this.metadataItemNameView.getInputBoxValue();
      inputValue = inputValue.trim();
      if (inputValue.length === 0 || currentValue !== inputValue) {
        this.metadataItemNameView.ItemNameBehavior.validateInputName(
          inputValue
        ).done(
          _.bind(function(success) {
            if (success) {
              this.metadataItemNameView.setInputBoxValue(inputValue);
              this.metadataItemNameView.setValue(inputValue);
              this.metadataItemNameView.modelHasEmptyName = false;
              this.metadataItemNameView.trigger("metadata:item:name:save", {
                sender: this.metadataItemNameView
              });
            } else {
              return false;
            }
          }, this)
        );
      }
    },

    _showThumbnail: function() {
      this.thumbnail =
        this.options.thumbnail ||
        new Thumbnail({
          node: this.options.node
        });
      this.listenTo(this.thumbnail, "loadUrl", this._showImage);
      this.listenTo(this.thumbnail, "error", this._showDefaultImage);
      this.listenTo(this, "destroy", _.bind(this._destroyThumbnail, this));

      if (this.mode !== "create" && !this.thumbnailSet) {
        var self = this;
        this.thumbnailSet = true;
        if (
          this.thumbnail.hasOwnProperty("imgUrl") &&
          !!this.thumbnail.imgUrl
        ) {
          this._showImage();
        } else {
          this.thumbnail.loadUrl();
        }
      }
    },

    _showImage: function() {
      this.$el.addClass("cs-document-overview-wrapper-with-thumbnail");
      this.$el.find(".thumbnail-container").removeClass("binf-hidden");
      this.trigger("thumbnail:show:image");
      var self = this,
        img = this.$el.find(".img-doc-preview");
      img.attr("src", this.thumbnail.imgUrl);
      img.prop("tabindex", "0");
      img.one("load", function(evt) {
        if (evt.target.clientHeight >= evt.target.clientWidth) {
          img.addClass("cs-form-img-vertical");
        } else {
          img.addClass("cs-form-img-horizontal");
        }
        img.addClass("cs-form-img-border");
        img.removeClass("binf-hidden");
        var event = $.Event("tab:content:render");
        self.$el.trigger(event);
      });
    },

    _showDefaultImage: function() {
      console.error(
        "error while loading thumbnail image in document overview page"
      );
    },

    _showNodeIcon: function() {
      if (!this._nodeIconView) {
        this._nodeIconView = new NodeTypeIconView({
          el: this.$el.find(".csui-type-icon").get(0),
          node: this.options.node
        });
        this._nodeIconView.render();
      }
    },

    _showMetadataItemName: function() {
      var inv = this.metadataItemNameView.render();
      Marionette.triggerMethodOn(inv, "before:show", inv, this);
      this.$el.find(".title-container").append(inv.el);
      Marionette.triggerMethodOn(inv, "show", inv, this);
    },

    _addLocationView: function() {
      var self = this,
        renderLocation = function() {
          var field = new ParentCellView({
            model: self.options.node,
            context: self.options.context,
            nameEdit: false,
            el: self.$el.find(self.ui.location)
          });
          field.render();
        };
      if (!this.options.node.get("parent_id_expand")) {
        this.options.node.setExpand("properties", [
          "parent_id",
          "reserved_user_id"
        ]);
        this.options.node.fetch({ silent: true }).then(function() {
          renderLocation();
        }, self);
      } else {
        renderLocation();
      }
    },

    _addCommentView: function() {
      var commentOptions = this.options;
      commentOptions.model = this.options.node;
      var commentView = new CommentView(commentOptions);

      var commentRegion = new Marionette.Region({
        el: this.$el.find(".commentRegion")
      });
      commentRegion.show(commentView);
    },

    _checkDescriptionContent: function() {
      var descEle = this.$el.find(".description_section");
      if (!!this.options.model.get("description")) {
        descEle.removeClass("binf-hidden");
        descEle.find(".btn-container > button").removeAttr("title");
      } else {
        descEle.addClass("binf-hidden");
      }
    },

    _addFavoriteView: function() {
      var favoriteOptions = this.options;
      favoriteOptions.model = this.options.node;
      favoriteOptions.popoverAtBodyElement = true;
      var favoriteView = new FavoriteStarView(favoriteOptions);

      var favoriteRegion = new Marionette.Region({
        el: this.$el.find(".favoriteRegion")
      });
      favoriteRegion.show(favoriteView);
    },

    _checkEditPermission: function() {
      var command = this.commands.findWhere({ signature: "Edit" });

      var status = {
        nodes: new NodeCollection([this.options.node]),
        container: this.options.node.parent
      };
      var options = {
        context: this.options.context
      };

      if (!(command && command.enabled(status, options))) {
        this.$el.find(".edit-btn").addClass("binf-hidden");
      }
    },

    _destroyForm: function() {
      FormView.prototype._destroyForm.apply(this, arguments);
      this._destroyThumbnail();
    },

    _destroyThumbnail: function() {
      if (this.thumbnail) {
        this.thumbnail.destroy();
        this.thumbnail = undefined;
      }
      this.thumbnailSet = false;
    },

    _updateFieldsToRefersh: function() {
      var alpacaForm = this.$el.alpaca("get");
      if (!!alpacaForm) {
        var data = this.options.model.attributes;
        var field = alpacaForm.childrenByPropertyId[this.fieldToRefresh],
          value = data[this.fieldToRefresh];
        if (!!field && field.getValue() !== value) {
          field.setValue(value);
          field.refresh();
        }
      }
    },

    _overrideDefaultScroll: function() {
      var parentEl = this.$el.parent();
      parentEl.length &&
        parentEl.css({
          "margin-top": "7.5px",
          height: "calc((100vh - 102px)",
          "overflow-y": "hidden",
          "padding-top": "32px"
        });
    }
  });

  _.extend(DocumentOverviewView.prototype, ViewEventsPropagationMixin);

  return DocumentOverviewView;

});
