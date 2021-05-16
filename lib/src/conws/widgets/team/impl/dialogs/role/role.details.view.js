/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/controls/form/fields/booleanfield.view',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'conws/widgets/team/impl/controls/filter/filter.view',
  'conws/widgets/team/impl/controls/filter/impl/filter.model',
  'conws/widgets/team/impl/controls/footer/footer.view',
  'conws/widgets/team/impl/dialogs/role/impl/role.details.members.view',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/dialogs/role/impl/role.details',
  'css!conws/widgets/team/impl/dialogs/role/impl/role.details'
], function (module, _, $, Backbone, Marionette, Handlebars, Checkbox, LayoutViewEventsPropagationMixin,
             Filter, FilterModel, FooterView, RoleDetailsMembers, lang, template) {
  var config = module.config();

  var RoleDetailsView = Marionette.LayoutView.extend({
    rolesCountForFilter: 15,
    filterModel: undefined,
    constructor: function RoleDetailsView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.propagateEventsToRegions();

      $(window).on('resize', _.bind(this.onWindowResize, this));
    },

    onWindowResize: function () {
      this.updateScrollbar();
    },

    template: template,
    captions: {
      Title: lang.roleDetailsTitle,
      RoleName: lang.roleDetailsName,
      Participants: lang.rolesParticipantsColTitle,
      RolesParticipantsColTooltip: lang.rolesParticipantsColTooltip,
      Description: lang.roleDetailsDescription,
      Permissions: lang.roleDetailsPermissions,
      TeamLead: lang.rolesNameColTeamLead,
      Read: lang.roleDetailsRead,
      Write: lang.roleDetailsWrite,
      Manage: lang.roleDetailsManage,
      Advanced: lang.roleDetailsAdvanced,
    },

    regions: {
      participantsHeaderRegion: '.conws-role-details-participants-region',
      participantsListRegion: '.conws-role-details-participants-list-region',
      teamLeadSwitch: '.conws-role-details-teamlead-switch',
      buttonsRegion: '.conws-role-details-buttons-region'
    },
    templateHelpers: function () {
      var self = this;
      return {
        labelId: _.uniqueId("conws-teamlead-"),
        hideTeamLead: config.hideTeamLead,
        readonly: true,
        captions: this.captions,
        model: this.model.toJSON()
      };
    },
    onAfterShow: function () {
      this.$el.find('.conws-role-details-canedit-content').perfectScrollbar({
        suppressScrollX: true,
        scrollYMarginOffset: 15 // like bottom padding of container, otherwise scrollbar is shown always
      });

      this.$el.find('.conws-role-details-canedit-left').perfectScrollbar({
        suppressScrollX: true,
        scrollYMarginOffset: 5
      });

      this.$el.find('.conws-roles-edit-canedit-content').perfectScrollbar('update');

      this.$el.find('.conws-role-details-rolename-text').perfectScrollbar({
        scrollXMarginOffset: 15, // like bottom padding of container, otherwise scrollbar is shown always
        scrollYMarginOffset: 15 // like bottom padding of container, otherwise scrollbar is shown always
      });

      this.$el.find('.conws-role-details-rolename-text').scrollTop(0);
      this.$el.find('.conws-role-details-rolename-text').scrollLeft(0);
      this.$el.find('.conws-role-details-rolename-text').perfectScrollbar('update');

      this.$el.find('.conws-role-details-roledescription-text').perfectScrollbar({
        scrollXMarginOffset: 15, // like bottom padding of container, otherwise scrollbar is shown always
        scrollYMarginOffset: 15 // like bottom padding of container, otherwise scrollbar is shown always
      });
      this.$el.find('.conws-role-details-roledescription-text').scrollTop(0);
      this.$el.find('.conws-role-details-roledescription-text').scrollLeft(0);
      this.$el.find('.conws-role-details-roledescription-text').perfectScrollbar('update');
    },
    onRender: function () {
      this.filterModel = new FilterModel({
        caption: this.captions.Participants,
        tooltip: this.captions.RolesParticipantsColTooltip,
        active: (this.model.members.length >= this.rolesCountForFilter)
      });
      this.participantsHeaderRegion.show(new Filter({
        model: this.filterModel,
        initialActivationWeight: this.model.members.length >= this.rolesCountForFilter ? 100 : 0
      }));
      this.participantsListRegion.show(new RoleDetailsMembers({
        model: this.model.members,
        filterModel: this.filterModel,
        initialActivationWeight: this.model.members.length > 0 ? 100 : 0
      }));
      this.listenTo(this.participantsListRegion.currentView, 'dom:refresh', this.updateScrollbar);
      if (!config.hideTeamLead) {
        this.teamLeadSwitch.show(new Checkbox({
          model: new Backbone.Model({
            data: this.model.get('leader'),
            caption: this.captions.TeamLead
          }),
          labelId: this.$(".conws-role-details-teamlead-caption").attr("id"),
          mode: 'readonly'
        }));
      }
      this.buttonsRegion.show(new FooterView({
        collection: new Backbone.Collection([{
          id: 'cancel',
          label: lang.rolesDialogButtonClose,
          css: 'conws-roles-edit-button pull-right',
          close: true
        }])
      }));
    },
    updateScrollbar: function () {
      var sc1 = this.$el.find('.conws-role-details-canedit-content');
      _.each(sc1, function (sc) {
        $(sc).scrollTop(0);
        $(sc).perfectScrollbar('update');
      })

      var roleDetailsLeftPane = this.$el.find('.conws-role-details-canedit-left');
      if(roleDetailsLeftPane && roleDetailsLeftPane.length){
        roleDetailsLeftPane.scrollTop(0);
        roleDetailsLeftPane.perfectScrollbar('update');
      }
    }
  });
  _.extend(RoleDetailsView.prototype, LayoutViewEventsPropagationMixin);
  return RoleDetailsView;
});
