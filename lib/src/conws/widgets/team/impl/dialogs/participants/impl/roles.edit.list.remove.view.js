/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/controls/globalmessage/globalmessage' /* needed for style csui-icon-notification-warning */,
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'conws/widgets/team/impl/behaviors/list.keyboard.behavior',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/dialogs/participants/impl/roles.edit.list.remove',
], function (_, $, Marionette, Handlebars, GlobalMessage, TabableRegionBehavior, ListKeyboardBehavior,
    lang, template) {

  var RolesEditRemoveList = Marionette.LayoutView.extend({
    className: 'conws-roles-edit-remove-list',

    template: template,
    filterModel: {},
    constructor: function RolesEditRemoveList(options) {
      options || (options = {});
      this.model = options.model;
      this.filterModel = options.filterModel;
      this.selectedIndex = 0;
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    ui: {
      item: '.conws-roles-edit-itemaction-remove a',
      focusedItem: 'li'
    },

    events: {
      'click @ui.item': 'itemRemove',
      'click @ui.focusedItem': 'itemRemove',
      'keydown': 'onKeyDownExt'
    },
    captions: {
      RemoveParticipant1: lang.rolesDialogRemoveParticipant1,
      RemoveParticipant2: lang.rolesDialogRemoveParticipant2,
      RemoveParticipantWarning: lang.rolesDialogRemoveParticipantWarning,
      RoleInherited: lang.rolesNameColInherited
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      ListKeyboard: {
        behaviorClass: ListKeyboardBehavior
      }
    },
    onKeyDownExt: function (e) {
      var $preElem = this.currentlyFocusedElement();

      switch (e.keyCode) {
      case 38: // up
        this.calculateSelectedIndex();
        this._moveTo(e, this._selectPrevious(), $preElem);
        break;
      case 40: // down
        this.calculateSelectedIndex();
        this._moveTo(e, this._selectNext(), $preElem);
        break;
      case 13:
      case 32:
      case 46:
        this.currentlyFocusedElement().trigger('click', e);
        break;
      }
    },

    initialize: function () {
      this.listenTo(this.filterModel, 'change', this.render);
      this.listenTo(this.filterModel, 'change:filter', function () {
        this.selectedIndex = 0;
      });
      this.listenTo(this, 'updateFocus', this.updateFocus);
      this.listenTo(this.model, 'add change reset remove', this.render);
    },
    templateHelpers: function () {
      return {
        removeRole: lang.rolesDialogRemoveRole,
        setRoles: this.model.filterList(this.filterModel.get('filter')).toJSON(),
        removeParticipant: this.model.length === 0,
        captions: this.captions
      }
    },

    calculateSelectedIndex: function () {
      var keywords = this.filterModel.get('filter');
      if (keywords.length) {
        this.totalCount = this.model.filterList(keywords).models.length;
        if (this.selectedIndex !== 0 && this.selectedIndex === this.totalCount - 1) {
          this.selectedIndex = this.selectedIndex - 1;
        }
      } else {
        this.totalCount = this.model.length;
      }
    },

    updateFocus:function(){
      this.trigger('changed:focus', this);
      this.currentlyFocusedElement().trigger('focus');
    },
    itemRemove: function (event) {
      var target = $(event.currentTarget);
      var id = target.data("id");
      if( _.isUndefined(id) && target.find(this.ui.item)){
        id = $(event.currentTarget).find(this.ui.item).data('id')
      }
      this.calculateSelectedIndex();
      this.model.remove(id);
      event.preventDefault();
      event.stopPropagation();
    }
  })

  return RolesEditRemoveList;
});

