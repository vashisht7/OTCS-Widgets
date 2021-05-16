/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/controls/listitem/listitemstandard.view',
  'hbs!csui/dialogs/node.picker/impl/node.list/list.item',
  'hbs!csui/dialogs/node.picker/impl/search.list/search.location.item',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/behaviors/default.action/default.action.behavior',
  'i18n!csui/dialogs/node.picker/impl/nls/lang'
], function (_, $, Marionette, StandardListItem, itemTemplate, searchLocationTemplate,
    NodeTypeIconView,
    DefaultActionBehavior, npLang) {

  var ListItem = StandardListItem.extend({

    template: itemTemplate,
    searchLocationTemplate: searchLocationTemplate,

    templateHelpers: function () {
      var isSelectableNode = this.options.commandType.isSelectable(this.getResolvedModel());
      return {
        'showOnHover': isSelectableNode ? 'csui-selectable' : '',
        'selected': this.selected ? 'icon-checkbox-selected' : '',
        'browsed': this.browsed ? 'icon-sidebar-expand24' : '',
        'checkboxAria': _.str.sformat(npLang.checkboxSelectAria, this.model.get('name')),
        'ariaChecked': this.selected,
        inlineForm: this.model.inlineFormView !== undefined
      };
    },

    tagName: 'li',

    events: function() {
      var events = {
        'keydown': 'onKeyInView',
        'click .csui-selectable': 'onSelectClick',
      };
      var node = this.getResolvedModel();
      if (!node.get('container') || this._isBrowsable()) {
        _.extend(events, { 'click .csui-browsable': 'onBrowseClick' });
      }
      return events;
    },

    ui: {
      link: '.csui-list-group-item',
      inlineFormContainer: '.csui-inlineform-container'
    },

    onKeyInView: function (event) {
      if (this.model.inlineFormView !== undefined) {
        return;
      }
      if (event.keyCode === 39 || event.keyCode === 13) {
        event.preventDefault();
        event.stopPropagation();
        this.$el.find('.csui-browsable').trigger('click');
        this.$el.trigger('focus');
        return false;
      }
      if (event.keyCode === 32) {
        event.preventDefault();
        event.stopPropagation();
        this.$el.find('.csui-selectable').trigger('click');
        this.$el.trigger('focus');
      }
      return true;
    },

    constructor: function ListItem(options) {
      StandardListItem.apply(this, arguments);

      this.selected = false;
      this.browsed = false;
    },

    toggleSelect: function () {
      this.selected = !this.selected;
      this.render();
    },

    toggleBrowse: function () {
      this.browsed = !this.browsed;
      this.render();
    },

    assignedSelect: function () {
      this.selected = true;
      this.render();
    },

    assignedBrowse: function () {
      this.browsed = true;
      this.render();
    },

    unassignSelect: function () {
      if (!this.isDestroyed) {
        this.selected = false;
        this.render();
      }
    },

    unassignBrowse: function () {
      if (!this.isDestroyed) {
        this.browsed = false;
        this.render();
      }
    },

    isSelected: function () {
      return this.selected;
    },

    isBrowsed: function () {
      return this.browsed;
    },

    setValidity: function (valid) {
      this.valid = valid;
    },

    setEnable: function setEnable(enable) {
      var node = this.getResolvedModel(),
      browsable  = this._isBrowsable(),
          selectable = this.options.commandType.isSelectable(node);
      if (enable) {
        this.$el.removeClass('csui-disabled');
        var elementNamePlus = _.str.sformat(npLang.itemTypeNameAria, this.model.get('type_name'),
            this.model.get('name'));

        if (!this.valid) {
          elementNamePlus = _.str.sformat(npLang.disabledItemTypeNameAria,
              this.model.get('type_name'), this.model.get('name'));
        }
        if (selectable && browsable) {
          elementNamePlus = elementNamePlus.concat(npLang.selectNBrowseAria);
        } else if (selectable) {
          elementNamePlus = elementNamePlus.concat(npLang.selectAria);
        } else if (browsable) {
          elementNamePlus = elementNamePlus.concat(npLang.browseAria);
        }
        this.$el.attr('aria-label', elementNamePlus);
      } else {
        this.$el.addClass('csui-disabled');
        var disabledTitle = _.str.sformat(npLang.disabledItemTypeNameAria,
            this.model.get('type_name'), this.model.get('name'));
        this.$el.attr('aria-label', disabledTitle);
      }
      if (node.get('container') && !browsable) {
        this.$el.addClass('csui-browse-disabled');
      } else {
        this.$el.removeClass('csui-browse-disabled');
      }
    },

    onSelectClick: function () {
      if (this.model.inlineFormView !== undefined) {
        return;
      }
      this.trigger('select:item');
    },

    onBrowseClick: function () {
      if (this.model.inlineFormView !== undefined) {
        return;
      }
      this.trigger('browse:item');
    },

    onDomRefresh: function () {
      if (this.activeInlineForm) {
        this.activeInlineForm.triggerMethod('dom:refresh', this.activeInlineForm);
      }
    },

    onRender: function () {
      if (this.model.inlineFormView !== undefined) {
        this.$el.addClass('csui-has-inlineform');
        this.activeInlineForm = new this.model.inlineFormView({
          model: this.model,
          originatingView: this,
          context: this.context,
          cancelTitle: ''
        });
        this.listenTo(this.activeInlineForm, 'destroy editEnded', function () {
          if (!!this.model.get("id")) {
            this.onSelectClick();
          }
          delete this.activeInlineForm;
        });
        var inlineFormRegion = new Marionette.Region({el: this.ui.inlineFormContainer});
        inlineFormRegion.show(this.activeInlineForm);
        this.activeInlineForm.$el.find('.csui-btn-cancel')
            .removeClass('binf-btn') // To allow background
            .addClass('cancel-edit') // Set background
            .attr('title', npLang.cancelButtonLabel); // Set title
        if (!!this.model.get("csuiInlineFormErrorMessage")) {
          this.$el.addClass('csui-has-error');
        }
      }

      this.$el.addClass('cs-left-item-' + this.model.get('id'));
      this.$el.removeClass('select');
      this.$el.removeClass('browse');
      this.ui.link.removeAttr('aria-expanded', 'false');
      this.$el.removeAttr('aria-selected');
      this.$el.attr('role', 'option');
      this.$el.removeAttr('aria-label');
      this.setEnable(true);

      if (!this.options.searchView) {
        $(".binf-list-group").removeClass("search-left-item");
        if ($(".csui-np-content .csui-search-item-left-panel").is(":visible")) {
          $(".binf-list-group").addClass("search-left-folder-right");
        } else if ($(".cs-start-locations .binf-search-location-group").is(":visible")) {
          $(".binf-list-group").removeClass("search-left-folder-right");
        }
        if (this._nodeLocationIconView) {
          this._nodeLocationIconView.destroy();
        }
      }

      if (this._isBrowsable()) {
        this.ui.link.attr('aria-haspopup', 'true');
      }

      if (this.selected) {
        this.$el.addClass('select');
        this.ui.link.attr('aria-expanded', 'true');
        this.$el.attr('aria-selected', 'true');
        this.$el.attr('aria-label',
            _.str.sformat(npLang.checkboxSelectAria, this.model.get('type_name'),
                this.model.get('name')));
      } else if (this.browsed) {
        this.$el.addClass('browse');
        this.$el.attr('aria-label',
            _.str.sformat(npLang.checkboxBrowsedAria, this.model.get('type_name'),
                this.model.get('name')));
      }
      if (this.selected && this.browsed) {
        this.$el.attr('aria-label',
            _.str.sformat(npLang.checkboxAriaSelectNBrowse, this.model.get('type_name'),
                this.model.get('name')));
      }

      this._nodeIconView = new NodeTypeIconView({
        el: this.$('.csui-type-icon').get(0),
        node: this.model
      });

      var mimeTypeIconClassName = this._nodeIconView.model.get('className');
      mimeTypeIconClassName = this.valid ? mimeTypeIconClassName :
                              mimeTypeIconClassName + '_nonselectable';
      this._nodeIconView.model.set('className', mimeTypeIconClassName);

      var mimeTypeIconMainClassName = this._nodeIconView.model.get('mainClassName');
      mimeTypeIconMainClassName = this.valid ? mimeTypeIconMainClassName :
                                  mimeTypeIconMainClassName + '_nonselectable';
      this._nodeIconView.model.set('mainClassName', mimeTypeIconMainClassName);

      this._nodeIconView.render();
    },

    onBeforeDestroy: function () {
      if (this._nodeIconView) {
        this._nodeIconView.destroy();
      }
    },

    _openSearchLocation: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this._parent.triggerMethod("click:location", this.model.parent);
    },

    _isBrowsable: function () {
      return this.options.commandType.browseAllowed(this.model);
    },

    getResolvedModel: function () {
      var model = this.model;
      if (this.options.resolveShortcuts && model.get('type') === 1 && model.original !==
          undefined) {
        model = model.original;
      }
      return model;
    }

  });

  return ListItem;

});
