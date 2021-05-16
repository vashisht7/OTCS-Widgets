/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/models/form',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'conws/dialogs/addoreditrole/impl/tabbable.form.view',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/widgets/permissions/impl/edit/permission.level.selector/permission.level.selector.view',
  'csui/widgets/permissions/impl/edit/permission.attributes/permission.attributes.view',
  'csui/models/permission/nodepermission.model',
  'conws/dialogs/addoreditrole/impl/roleheader/roleheader.view',
  'conws/dialogs/addoreditrole/impl/rolepermissions/impl/rolepermissions.title.view',
  'i18n!conws/dialogs/addoreditrole/impl/nls/lang',
  'hbs!conws/dialogs/addoreditrole/impl/rolepermissions/impl/rolepermissions',
  'css!conws/dialogs/addoreditrole/impl/rolepermissions/impl/rolepermissions', 'i18n'
], function (_, $, Backbone, Marionette, FormModel, TabableRegionBehavior, TabbableFormView, LayoutViewEventsPropagationMixin,
  PermissionLevelSelectorView, PermissionAttributesView, NodePermissionModel, RoleHeaderView, TitleView, lang, template, i18n) {

    var BackButtonView = Marionette.ItemView.extend({

      template: false,

      tagName: 'div',

      className: 'conws-addoreditrole-rolepermissions-backbtn icon circular arrow_back cs-go-back binf-hidden',

      attributes: {
        title: lang.backButtonTooltip,
        'aria-label': lang.backButtonAria,
        role: 'link'
      },

      constructor: function BackButtonView(options) {
        Marionette.View.prototype.constructor.apply(this, arguments);
      },

      behaviors: {
        TabableRegion: {
          behaviorClass: TabableRegionBehavior
        }
      },

      currentlyFocusedElement: function () {
        return this.$el;
      }
    });

    var RolePermissionsView = Marionette.LayoutView.extend({

      template: template,

      regions: {
        HeaderRegion: '.conws-addoreditrole-rolepermissions-header',
        PickerRegion: '.conws-addoreditrole-rolepermissions-picker',
        TitleRegion: '.conws-addoreditrole-rolepermissions-title',
        RightRegion: '.conws-addoreditrole-rolepermissions-right',
        BackButtonRegion: '.conws-addoreditrole-rolepermissions-back'
      },

      templateHelpers: {
        'title': lang.selectPermissionLevel,
        'backButtonTooltip': lang.backButtonTooltip,
        'backButtonAria': lang.backButtonAria
      },

      events: {
        'click .conws-addoreditrole-rolepermissions-back': 'onBackSelection',
        'keydown .conws-addoreditrole-rolepermissions-back': 'onBackKeySelection'
      },

      _createHeaderControl: function () {
        var roleHeaderView = new RoleHeaderView({
          headerViewoptions: this.options,
          currentStep: 'step2'
        });
        return roleHeaderView;
      },

      constructor: function RolePermissionsView(options) {
        options || (options = {});

        this.context = options.context;
        this.connector = options.connector;
        Marionette.LayoutView.prototype.constructor.apply(this, arguments);
        this.listenTo(this, 'set:initial:focus', this.onSetInitialFocus);
        this.propagateEventsToRegions();
      },

      onRender: function () {

        var SubItemsInheritForm = {
          "data": {
            "subitems_inherit": true
          },
          "options": {
            "fields": {
              "subitems_inherit": {
                "hidden": false,
                "hideInitValidationError": true,
                "label": lang.SubItemsInherit,
                "readonly": false,
                "type": "checkbox"
              }
            },
            "label": ""
          },
          "schema": {
            "properties": {
              "subitems_inherit": {
                "readonly": false,
                "required": false,
                "title": lang.SubItemsInherit,
                "type": "boolean"
              }
            },
            "type": "object"
          }
        },

          permissionLevelView = new PermissionLevelSelectorView({
            selected: this.options.addrole ? 1 : this.options.model.getPermissionLevel(),
            isContainer: this.options.isContainer,
            nodeModel: this.options.nodeModel,
            permissionModel: this.options.model
          }),

          SubItemsInheritFormView = new TabbableFormView({
            model: new FormModel(SubItemsInheritForm),
            mode: "create"
          });

        this.titleView = new TitleView({
          model: new Backbone.Model({
            title: lang.selectPermissionLevel
          })
        });

        if (!this.options.addrole) {
          this.lastSelectedPermLevel = this.options.model.getPermissionLevel();
          if (this.options.model.getPermissionLevel() === NodePermissionModel.PERMISSION_LEVEL_CUSTOM) {
            this.lastSelectedCustomPermissions = this.options.model.get('permissions');
          }
        }

        permissionLevelView.on('permission:level:selected', this.onPermissionLevelSelection, this);
        this.HeaderRegion.show(this._createHeaderControl());
        this.PickerRegion.show(permissionLevelView);
        this.RightRegion.show(SubItemsInheritFormView);
        this.TitleRegion.show(this.titleView);
        this.BackButtonRegion.show(new BackButtonView());
      },

      onPermissionLevelSelection: function () {
        var view = this.PickerRegion.currentView;
        if (view && view.selected === NodePermissionModel.PERMISSION_LEVEL_CUSTOM) {
          var customPermissionView = new PermissionAttributesView({
            permissions: !!this.lastSelectedCustomPermissions ? this.lastSelectedCustomPermissions : [],
            readonly: false,
            showButtons: false,
            node: this.options.nodeModel
          });

          this.titleView.model.set('title', lang.simplePermissionSelection);
          this.$el.find('.conws-addoreditrole-rolepermissions-backbtn').removeClass('binf-hidden').focus();
          this.BackButtonRegion.currentView.trigger("dom:refresh");
          this.PickerRegion.show(customPermissionView);
          this.isCustom = true;
          var $treeViewDiv = customPermissionView.$el.find('.csui-permission-attribute-tree'),
            adjustSplitsHeight,
            adjustSplitsRight,
            adjustSplitsSeparator,
            adjustSplits = $treeViewDiv.find(".csui-tree-split");

          for (var i = adjustSplits.length - 1, j = 0; i >= 0, j < adjustSplits.length; i-- , j++) {
            adjustSplitsRight = $(adjustSplits[i]).width() * j;
            adjustSplitsSeparator = $(adjustSplits[i]).closest(".csui-tree-child").find(
              '.csui-separator');
            if (adjustSplits[i] === adjustSplits[adjustSplits.length - 1]) {
              adjustSplitsHeight = $treeViewDiv.outerHeight();
            } else {
              adjustSplitsHeight = Math.round(($(adjustSplits[i]).closest("li").position().top) +
                $(adjustSplits[i]).closest(
                  ".csui-tree-child").outerHeight());
              adjustSplitsRight = adjustSplitsRight + j;
            }
            if (i18n && i18n.settings.rtl) {
              $(adjustSplits[i]).css({ 'height': adjustSplitsHeight, 'left': adjustSplitsRight });
              adjustSplitsSeparator.css({
                'width': ($treeViewDiv.find('.csui-tree-container').width()),
                'left': adjustSplitsRight
              });
              $(adjustSplits[i]).closest('.csui-tree-child').css(
                { 'padding-left': adjustSplitsRight + $(adjustSplits[i]).width() });
            } else {
              $(adjustSplits[i]).css({ 'height': adjustSplitsHeight, 'right': adjustSplitsRight });
              adjustSplitsSeparator.css({
                'width': ($treeViewDiv.find('.csui-tree-container').width()),
                'right': adjustSplitsRight
              });
              $(adjustSplits[i]).closest('.csui-tree-child').css(
                { 'padding-right': adjustSplitsRight + $(adjustSplits[i]).width() });
            }
          }
        }
        else {
          this.lastSelectedPermLevel = view.selected;
        }
      },

      onBackSelection: function () {
        this.lastSelectedCustomPermissions = this.PickerRegion.currentView.getSelectedPermissions();
        this.titleView.model.set('title', lang.selectPermissionLevel);
        this.$el.find('.conws-addoreditrole-rolepermissions-backbtn').addClass('binf-hidden');
        this.BackButtonRegion.currentView.trigger("dom:refresh");
        var permissionLevelView = new PermissionLevelSelectorView({
          selected: !!this.lastSelectedPermLevel ? this.lastSelectedPermLevel : 1,
          isContainer: this.options.isContainer,
          nodeModel: this.options.nodeModel
        })
        this.PickerRegion.show(permissionLevelView);
        permissionLevelView.on('permission:level:selected', this.onPermissionLevelSelection, this);
        this.PickerRegion.currentView.$el.find("li[data-optionid='" + NodePermissionModel.PERMISSION_LEVEL_NONE + "'] a").focus();
      },

      onBackKeySelection: function (event) {
        if (event.keyCode === 13) {
          this.onBackSelection();
        }
      },

      onAfterShow: function () {
        this.onSetInitialFocus();
      },

      onSetInitialFocus: function () {
        this.RightRegion.currentView.$el.find("[data-alpaca-container-item-name='subitems_inherit'] input[type='checkbox']").focus();
      }

    });
    _.extend(RolePermissionsView.prototype, LayoutViewEventsPropagationMixin);
    return RolePermissionsView;
  });