/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'conws/widgets/team/impl/behaviors/list.keyboard.behavior',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/dialogs/participants/impl/roles.edit.list'
], function (_, $, Marionette, Handlebars, TabableRegionBehavior, ListKeyboardBehavior,
    lang, template) {

  var RolesEditList = Marionette.LayoutView.extend({
    className: 'conws-roles-edit-list',

    template: template,
    filterModel: {},
    constructor: function RolesEditList(options) {
      options || (options = {});
      this.model = options.model;
      this.filterModel = options.filterModel;
      this.selectedIndex = 0;
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    ui: {
      select: 'a.conws-roles-edit-itemaction-select'
    },

    events: {
      'click @ui.select': 'itemSelect',
      'click li': 'itemSelect',
      'dragstart @ui.select': 'itemDrag',
      'keydown': 'onKeyDownExt'
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
        this.currentlyFocusedElement().trigger('click', e);
        break;
      }
    },

    initialize: function () {
      this.listenTo(this.filterModel, 'change', this.render);
      this.listenTo(this.filterModel, 'change:filter', function () {
        this.selectedIndex = 0;
      });
      this.listenTo(this.model, 'add change reset remove', this.render);
      this.listenTo(this, 'updateFocus', this.updateFocus);
    },
    templateHelpers: function () {
      return {
        allRoles: this.model.filterList(this.filterModel.get('filter')).toJSON()
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
    itemSelect: function (event) {
      var target = $(event.currentTarget);
      var id = target.data("id");
      if( _.isUndefined(id) && target.find(this.ui.select).length > 0){
        id = $(event.currentTarget).find(this.ui.select).data('id')
      }
      this.calculateSelectedIndex();
      this.model.remove(id);
      event.preventDefault();
      event.stopPropagation();

    },
    itemDrag: function (event) {
      return false;
    }
  });

  return RolesEditList;
});

