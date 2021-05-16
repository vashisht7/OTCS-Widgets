/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/utils/base',
  'i18n',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/tree/tree.view',
  'csui/widgets/permissions/impl/edit/permission.attributes/impl/permission.attributes.data',
  'hbs!csui/widgets/permissions/impl/edit/permission.attributes/impl/permission.attributes',
  'i18n!csui/widgets/permissions/impl/nls/lang'
], function ($, _, Marionette, base, i18n, TabableRegionBehavior, TreeView, permissionAttributes,
    template, lang) {

  var PermissionAttributesView = Marionette.LayoutView.extend({
    className: "csui-permission-attributes",

    template: template,

    regions: {
      treeRegion: ".csui-permission-attribute-tree"
    },

    events: {
      "click button.cs-save-btn": "onClickSave",
      "click button.cs-cancel-btn": "onClickCancel",
      "keydown": '_handleKeyEvents'
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    _handleKeyEvents: function (event) {      
      if (event && event.keyCode === 9) {
        var currentIndex = this.$tabableElements.index(event.target);
        if (event.shiftKey && currentIndex === 0) {
          currentIndex = this.$tabableElements.length - 1;
        } else if (!event.shiftKey && currentIndex === this.$tabableElements.length - 1) {
          currentIndex = 0;
        } else {
          currentIndex = undefined;
        }
        if (currentIndex !== undefined) {
          event.preventDefault();
          this.$tabableElements.eq(currentIndex).trigger('focus');          
        }
      }      
    },

    currentlyFocusedElement: function (event) {      
      this.$tabableElements.prop('tabindex', 0);      
      if (!!event && event.shiftKey) {
        return this.$tabableElements.eq([this.$tabableElements.length - 1]);
      } else {
        return this.$tabableElements.eq(0);
      }
    },

    onLastTabElement: function(shiftKey, event) {
      var currentIndex = this.$tabableElements.index(event.target);      
      return shiftKey && currentIndex === 0 || 
        !shiftKey && currentIndex === this.$tabableElements.length -1;
    },

    templateHelpers: function () {
      var showButtons = this.options.showButtons;
      if (showButtons === undefined) {
        showButtons = !this.options.readonly;
      }
      return {
        save_button_label: lang.saveButtonLabel,
        cancel_button_label: lang.cancelButtonLabel,
        showButtons: showButtons
      };
    },

    constructor: function PermissionAttributesView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.options = options;      
    },

    onRender: function () {
      var permissionLevelCollection = permissionAttributes.getPermissionAttributes({
        readonly: this.options.readonly,
        node: this.options.node,
        permissions: this.options.permissions || this.model.get("permissions")        
      });

      this.treeView = new TreeView({
        collection: permissionLevelCollection
      });
      this.treeRegion.show(this.treeView);
      this.listenTo(this.treeView, 'node:selected', this.onPermissionNodeSelected);
      this.listenTo(this.treeView, 'node:unselected', this.onPermissionNodeUnselected);
      this.$tabableElements = this.$('*[tabindex]');      
    },

    onPermissionNodeSelected: function (target) {
      var view = this.treeView,
          dependentNodes;
      if (target.attributes.name.value === lang.edit_label_permissions) {

        view.$el.find('input:checkbox').each(function (index, element) {
          element.checked = true;
        });
        dependentNodes = view.$el.find("input.csui-tree-checkbox");
      }
      else if (target.attributes.name.value === lang.edit_attributes) {
        view.$el.find("#node_see")[0].checked = true;
        view.$el.find("#node_see_contents")[0].checked = true;
        view.$el.find("#node_modify")[0].checked = true;
        dependentNodes = view.$el.find(target).closest(".csui-tree-root").parents(
            ".csui-tree-root").children(".csui-tree-child").find("input.csui-tree-checkbox");

      }
      else if (target.attributes.name.value === lang.delete) {
        view.$el.find("#node_see")[0].checked = true;
        view.$el.find("#node_see_contents")[0].checked = true;
        view.$el.find("#node_delete_versions")[0].checked = true;
        dependentNodes = view.$el.find(target).closest(".csui-tree-root").parents(
            ".csui-tree-root").children(".csui-tree-child").find("input.csui-tree-checkbox");

      }
      else if (target.attributes.name.value === lang.delete_versions) {
        view.$el.find("#node_see")[0].checked = true;
        view.$el.find("#node_see_contents")[0].checked = true;
        view.$el.find("#node_modify")[0].checked = true;
        dependentNodes = view.$el.find(target).closest(".csui-tree-root").parents(
            ".csui-tree-root").children(".csui-tree-child").find("input.csui-tree-checkbox");

      }
      else if (target.attributes.name.value === lang.reserve) {
        view.$el.find("#node_see")[0].checked = true;
        view.$el.find("#node_see_contents")[0].checked = true;
        view.$el.find("#node_modify")[0].checked = true;
        dependentNodes = view.$el.find(target).closest(".csui-tree-root").parents(
            ".csui-tree-root").children(".csui-tree-child").find("input.csui-tree-checkbox");
      }
      else {
        dependentNodes = view.$el.find(target).closest(".csui-tree-root").parents(
            ".csui-tree-root").children(".csui-tree-child").find("input.csui-tree-checkbox");
      }
      dependentNodes.prop('checked', true);
      if (dependentNodes.length && this.options.node.attributes.type !== 0) {
        view.$el.find("#node_see_contents")[0].checked = true;
      }
    },

    onPermissionNodeUnselected: function (target) {
      var view = this.treeView,
          dependentNodes;
      if (target.attributes.name.value === "see_contents") {
        dependentNodes = view.$el.find(target).closest(".csui-tree-root").siblings(
            ".csui-tree-root").find("input.csui-tree-checkbox");
      }
      else {
        dependentNodes = view.$el.find(target).closest(".csui-tree-root").children("ul").find(
            "input.csui-tree-checkbox");
        if (!dependentNodes.length || target.attributes.name.value === "reserve") {
          view.$el.find("#node_edit_permissions")[0].checked = false;
        }
      }
      dependentNodes.prop('checked', false);
    },

    onClickSave: function () {
      var permissions = this.getSelectedPermissions();
      this.trigger("permission:attribute:save:clicked", permissions);
    },

    onClickCancel: function () {
      this.trigger("permission:attribute:cancel:clicked");
    },

    onDestroy: function () {
    },

    getSelectedPermissions: function () {
      var treeNodes   = this.treeView.$el.find('input.csui-tree-checkbox'),
          permissions = [];
      for (var i = 0; i < treeNodes.length; i++) {
        if (treeNodes[i].checked) {
          permissions.push(treeNodes[i].name);
        }
      }
      return permissions;
    }

  });
  return PermissionAttributesView;
});