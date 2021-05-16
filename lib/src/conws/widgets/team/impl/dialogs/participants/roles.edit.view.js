/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'conws/widgets/team/impl/controls/filter/filter.view',
  'conws/widgets/team/impl/controls/filter/impl/filter.model',
  'conws/widgets/team/impl/dialogs/participants/impl/roles.edit.list.remove.view',
  'conws/widgets/team/impl/dialogs/participants/impl/roles.edit.list.view',
  'conws/widgets/team/impl/dialogs/participants/impl/roles.readonly.list.view',
  'conws/widgets/team/impl/controls/footer/footer.view',
  'conws/widgets/team/impl/roles.model.expanded',
  'conws/widgets/team/impl/participants.model',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/dialogs/participants/impl/roles.edit',
  'conws/widgets/team/impl/roles.model',
  'css!conws/widgets/team/impl/dialogs/participants/impl/roles.edit',
  'css!conws/widgets/team/impl/cells/roles/impl/roles'
], function (_, $, Backbone, Marionette, Handlebars, ModalAlert, LayoutViewEventsPropagationMixin,
    TabableRegionBehavior, Filter, FilterModel, RolesRemoveList, RolesEditList, RolesReadOnlyList,
    FooterView, RolesCollection, ParticipantsCollection, lang,
    template, RolesModelCollection) {

  var ButtonLabels = {
    Close: lang.rolesDialogButtonClose,
    Save: lang.rolesDialogButtonSave,
    Cancel: lang.rolesDialogButtonCancel,
    Reset: lang.rolesDialogButtonReset,
    Remove: lang.rolesDialogButtonRemove
  };

  var RolesEditView = Marionette.LayoutView.extend({
    rolesCountForFilter: 15,
    modified: false,
    availableRoles: new RolesModelCollection(),
    assignedRoles: new RolesModelCollection(),
    filterModel1: undefined,
    filterModel2: undefined,
    constructor: function RolesEditView(options) {
      options || (options = {});

      this.teamRoles = options.roleCollection;
      this.teamParticipants = options.participantCollection;
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.propagateEventsToRegions();
    },

    template: template,

    regions: {
      assignedRolesHeaderRegion: '.conws-roles-edit-canedit-setroles-region',
      assignedRolesListRegion: '.conws-roles-edit-canedit-setroles-list-region',
      availableRolesHeaderRegion: '.conws-roles-edit-canedit-allroles-region',
      availableRolesListRegion: '.conws-roles-edit-canedit-allroles-list-region',
      readonlyRolesListRegion: '.conws-roles-readonly-region',
      buttonsRegion: '.conws-roles-edit-buttons-region'
    },

    ui: {
      footer: '.conws-roles-edit-buttons-region'
    },
    captions: {
      AssignedRoles: lang.rolesDialogAssignedRoles,
      TooltipAssignedRoles: lang.rolesDialogTooltipAssignedRoles,
      AvailableRoles: lang.rolesDialogAvailableRoles,
      TooltipAvailableRoles: lang.rolesDialogTooltipAvailableRoles
    },
    initialize: function () {

      if (_.isUndefined(this.model)) {
        return;
      }
      this.assignedRoles.reset(this.model.roles.models);
      var tmp = this.model.collection.availableRoles.clone();
      tmp.remove(this.assignedRoles.models);
      var notInheritedRoles = tmp.filter(function (m) {
        var id = m.get('inherited_from_id');
        return _.isUndefined(id) || _.isNull(id);
      });
      this.availableRoles.reset(notInheritedRoles);

      if (!_.isUndefined(this.filterModel1)) {
        this.filterModel1.set('resetFilter', true);
      }

      if (!_.isUndefined(this.filterModel2)) {
        this.filterModel2.set('resetFilter', true);
      }
      this.modified = false;
      this.setDialogState();
      this.listenTo(this.assignedRoles, 'remove', this.removeAssignedRole);
      this.listenTo(this.availableRoles, 'remove', this.addAvailableRole);
    },
    removeAssignedRole: function (model) {
      var r = model;
      this.availableRoles.add(r);
      this.modified = true;

      this.setDialogState();
      if (this.assignedRoles.length === 0) {
        this.filterModel2.get('active') ?
        this.availableRolesHeaderRegion.currentView.trigger('updateFocus') :
        this.availableRolesListRegion.currentView.trigger('updateFocus');
      } else if (this.assignedRolesListRegion.currentView.totalCount - 1 === 0 &&
                 this.filterModel1.get('active')) {
        this.assignedRolesHeaderRegion.currentView.trigger('updateFocus');
      }
    },
    addAvailableRole: function (model) {
      var r = model;
      this.assignedRoles.add(r);
      this.modified = true;

      this.setDialogState();
      if (this.availableRoles.length === 0) {
        this.filterModel1.get('active') ?
        this.assignedRolesHeaderRegion.currentView.trigger('updateFocus') :
        this.assignedRolesListRegion.currentView.trigger('updateFocus');
      } else if (this.availableRolesListRegion.currentView.totalCount - 1 === 0 &&
                 this.filterModel2.get('active')) {
        this.availableRolesHeaderRegion.currentView.trigger('updateFocus');
      }
    },
    setDialogState: function () {
      if (!_.isUndefined(this.filterModel1) && _.isEmpty(this.filterModel1.get('filter'))) {
        this.filterModel1.set('active', this.assignedRoles.length >= this.rolesCountForFilter);
      }
      if (!_.isUndefined(this.filterModel2) && _.isEmpty(this.filterModel2.get('filter'))) {
        this.filterModel2.set('active', this.availableRoles.length >= this.rolesCountForFilter);
      }
      if (!_.isUndefined(this.editRolesButtons)) {
        this.editRolesButtons.collection.findWhere({id: 'submit'}).set({disabled: !this.modified});
        this.assignedRoles.length > 0 ?
        this.editRolesButtons.collection.findWhere({id: 'submit'}).set({label: ButtonLabels.Save}) :
        this.editRolesButtons.collection.findWhere({id: 'submit'}).set({label: ButtonLabels.Remove});
      }
    },
    templateHelpers: function () {
      var self = this;
      var titleTemplate = lang.userRolesDialogTitle;
      if (this.model.getMemberType() === 'group') {
        titleTemplate = lang.groupRolesDialogTitle;
      }
      var value = _.str.sformat(titleTemplate, this.model.get('display_name'));
      return {
        title: value,
        canEdit: this.model.canEdit()
      };
    },
    updateScrollbar: function () {
      var sc1 = this.$el.find('.binf-modal-body .conws-roles-edit-readonly');
      _.each(sc1, function (sc) {
        $(sc).perfectScrollbar('update');
      })

      var sc2 = this.$el.find('.conws-roles-edit-canedit-content');
      _.each(sc2, function (sc) {
        $(sc).perfectScrollbar('update');
      })
    },
    onAfterShow: function () {
      this.$el.find('.binf-modal-body .conws-roles-edit-readonly').perfectScrollbar({
        suppressScrollX: true,
        scrollYMarginOffset: 15 // like bottom padding of container, otherwise scrollbar is shown always
      });
      this.$el.find('.conws-roles-edit-canedit-content').perfectScrollbar({
        suppressScrollX: true,
        scrollYMarginOffset: 15 // like bottom padding of container, otherwise scrollbar is shown always
      });
      this.updateScrollbar();

    },
    onRender: function () {
      if (this.model.canEdit()) {
        this.filterModel1 = new FilterModel({
          caption: this.captions.AssignedRoles,
          tooltip: this.captions.TooltipAssignedRoles,
          active: (this.assignedRoles.length >= this.rolesCountForFilter)
        });
        this.assignedRolesHeaderRegion.show(new Filter({
          model: this.filterModel1,
          initialActivationWeight: this.assignedRoles.length >= this.rolesCountForFilter ? 100 : 0
        }));
        this.assignedRolesListRegion.show(new RolesRemoveList({
          model: this.assignedRoles,
          filterModel: this.filterModel1,
          initialActivationWeight: this.assignedRoles.length > 0 ? 100 : 0
        }));
        this.listenTo(this.assignedRolesListRegion.currentView, 'dom:refresh',
            this.updateScrollbar);
        this.filterModel2 = new FilterModel({
          caption: this.captions.AvailableRoles,
          tooltip: this.captions.TooltipAvailableRoles,
          active: (this.availableRoles.length >= this.rolesCountForFilter)
        });
        this.availableRolesHeaderRegion.show(new Filter({model: this.filterModel2}));
        this.availableRolesListRegion.show(new RolesEditList({
          model: this.availableRoles,
          filterModel: this.filterModel2
        }));
        this.listenTo(this.availableRolesListRegion.currentView, 'dom:refresh',
            this.updateScrollbar);
      } else {
        this.readonlyRolesListRegion.show(new RolesReadOnlyList({
          model: this.model.roles,
          initialActivationWeight: this.model.roles.length > 0 ? 100 : 0
        }));
      }
      this._renderFooter();

    },
    saveClicked: function () {
      var self = this;
      var actServerParticipants = new ParticipantsCollection(undefined, {
        connector: self.model.collection.connector,
        node: self.model.collection.node,
        context: self.model.collection.workspaceContext,
        autoreset: true
      });
      actServerParticipants.fetch({
        success: function (ParticpantsCol) {
          var actParticipant = ParticpantsCol.find(function (participantfind) {
            return (participantfind.get('id') === self.model.get('id'));
          });
          var dataChanged;
          if ((actParticipant) && (actParticipant.roles.length === self.model.roles.length)) {
            dataChanged = false;
            actParticipant.roles.each(function (role) {
              var id = role.id;
              var found = self.model.roles.find(function (role2) {
                return (role2.id === id);
              });
              if (!found) {
                dataChanged = true;
              }
            })
          }
          if (dataChanged === false) {
            self.saveRolesForUser();
          }
          else {
            var message = lang.rolesEditDialogDataNotUptoDateUser;
            if (self.model.getMemberType() === 'group') {
              message = lang.rolesEditDialogDataNotUptoDateGroup;
            }
            ModalAlert.showError(message, self.getErrorMessageTitle()).always(
                function (result) {
                  self.refreshAfterSave();
                });
          }
        }
      });

    },
    saveRolesForUser: function () {
      var self = this;
      var removed = [];
      this.model.roles.each(function (role) {
        var id = role.id;
        var found = self.assignedRoles.find(function (role2) {
          return (role2.id === id);
        });

        if (!found) {
          removed.push(role);
        }
      });

      var added = [];
      this.assignedRoles.each(function (role) {
        var id = role.id;

        var found = self.model.roles.find(function (role2) {
          return (role2.id === id);
        });

        if (!found) {
          added.push(role);
        }
      });

      this.model.save({add: added, remove: removed}, {
        success: function (response) {
          self.refreshAfterSave();
        },
        error: function (response) {
          var message = '';
          if (response.successAdd.length > 0) {
            var rolesAdded = lang.rolesEditDialogSuccessfulAdded;
            _.each(response.successAdd, function (role) {
              rolesAdded = rolesAdded + '\n' + role.role.get('name');
            });

            message = rolesAdded;
          }

          if (response.errorAdd.length > 0) {
            var rolesNotAdded = lang.rolesEditDialogNotAdded;
            _.each(response.errorAdd, function (role) {
              rolesNotAdded = rolesNotAdded + '\n' + role.role.get('name');
            });

            if (message.length > 0) {
              message += '\n';
            }

            message = message + rolesNotAdded;
          }

          if (response.successRemove.length > 0) {
            var rolesRemoved = lang.rolesEditDialogSuccessfulRemoved;
            _.each(response.successRemove, function (role) {
              rolesRemoved = rolesRemoved + '\n' + role.role.get('name');
            });

            if (message.length > 0) {
              message += '\n';
            }

            message = message + rolesRemoved;
          }

          if (response.errorRemove.length > 0) {
            var rolesNotRemoved = lang.rolesEditDialogNotRemoved;
            _.each(response.errorRemove, function (role) {
              rolesNotRemoved = rolesNotRemoved + '\n' + role.role.get('name');
            });

            if (message.length > 0) {
              message += '\n';
            }

            message = message + rolesNotRemoved;
          }

          ModalAlert.showError(message, self.getErrorMessageTitle()).always(function (result) {
            self.refreshAfterSave();
          });
        }
      });
    },
    getErrorMessageTitle: function () {
      var titleTemplate = lang.rolesEditDialogErrorTitleUser;
      if (this.model.getMemberType() === 'group') {
        titleTemplate = lang.rolesEditDialogErrorTitleGroup;
      }
      var title = _.str.sformat(titleTemplate,
          this.model.get('display_name') ? this.model.get('display_name') :
          this.model.get('name'));
      return title;
    },

    refreshAfterSave: function () {
      var self = this;

      function afterRolesFetch() {
        self.trigger('refetched');
      }

      function afterFetch() {
        self.teamParticipants.trigger('saved', self.teamParticipants);
        self.teamRoles.fetch().then(afterRolesFetch,afterRolesFetch);
      }
      this.teamParticipants.fetch({
        success: function () {
          self.teamParticipants.setNewParticipant();
        }
      }).then(afterFetch,afterFetch);
    },
    resetClicked: function () {
      this.initialize();

    },

    _renderFooter: function(){
      var editRolesButtons = this.editRolesButtons;
      if (editRolesButtons) {
        this.ui.footer.removeClass('binf-hidden');
        this.buttonsRegion.show(editRolesButtons);
      } else {
        var buttons = [];
        if (this.model.canEdit()) {
          buttons = [{
            id: 'reset',
            label: ButtonLabels.Reset,
            css: 'conws-roles-edit-button binf-pull-left conws-roles-edit-button-reset',
            click: _.bind(this.resetClicked, this)
          }, {
            id: 'submit',
            label: ButtonLabels.Save,
            css:'conws-roles-edit-button conws-roles-edit-button-save',
            click: _.bind(this.saveClicked, this),
            disabled: true,
            close: true
          }, {
            id: 'cancel',
            label: ButtonLabels.Cancel,
            css:'conws-roles-edit-button conws-roles-edit-button-cancel',
            close: true
          }
          ];
        } else {
          buttons = [{
            id: 'cancel',
            label: ButtonLabels.Close,
            css:'conws-roles-edit-button binf-pull-right',
            close: true,
            initialActivationWeight: 100
          }];
        }

       editRolesButtons = this.editRolesButtons = new FooterView({
          collection: new Backbone.Collection(buttons)
        });
       this.buttonsRegion.show(editRolesButtons);
      }
    }
  });

  _.extend(RolesEditView.prototype, LayoutViewEventsPropagationMixin);

  return RolesEditView;
});

