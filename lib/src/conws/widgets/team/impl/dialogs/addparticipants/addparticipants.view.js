/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/node',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/dialogs/modal.alert/modal.alert',
  'conws/models/workspacecontext/workspacecontext.factory',
  'conws/widgets/team/impl/participant.model',
  'conws/widgets/team/impl/dialogs/addparticipants/impl/participant.listitem.view',
  'conws/widgets/team/impl/controls/rolepicker/rolepicker.view',
  'conws/widgets/team/impl/controls/footer/footer.view',
  'csui/controls/userpicker/userpicker.view',
  'i18n!conws/widgets/team/impl/nls/team.lang',
  'hbs!conws/widgets/team/impl/dialogs/addparticipants/impl/addparticipants',
  'css!conws/widgets/team/impl/dialogs/addparticipants/impl/addparticipants'
], function (_, $, Backbone, Marionette, base, ConnectorFactory, NodeFactory,
    LayoutViewEventsPropagationMixin, ModalAlert, WorkspaceContextFactory, Participant,
    ParticipantView, RolePicker, ButtonBar, UserPicker, lang, template) {

  var ParticipantsListCollectionView = Marionette.CollectionView.extend({

    tagName: 'ul',

    className: 'binf-list-group',

    childView: ParticipantView,

    constructor: function ParticipantsListCollectionView(options) {
      Marionette.CollectionView.call(this, options);
      this.listenTo(this, 'moveTabIndex', this.moveTabIndex);
    },

    moveTabIndex:function(view){
      this.children.each(function (participantView) {
        if(view.children.length === view.selectedIndex){
          view.selectedIndex = view.children.length - 1;
        }
        if (participantView._index === view.selectedIndex) {
          participantView.roles.currentView.rolePickerRegion.currentView.trigger('updateFocus')
        }
      });
    }
  });

  var AddParticipantsView = Marionette.LayoutView.extend({

    template: template,

    regions: {
      userPickerRegion: '.conws-addparticipants-userpicker',
      rolePickerRegion: '.conws-addparticipants-rolepicker',
      buttonsRegion: '.conws-addparticipants-buttons',
      participantsRegion: '.conws-addparticipants-members'
    },

    templateHelpers: {
      'title': lang.addParticipantsTitle,
      'roles-help': lang.addParticipantsRolesHelp
    },

    constructor: function AddParticipantsView(options) {
      options || (options = {});

      this.view = options.view;
      this.context = options.view.context;
      this.connector = options.view.context.getObject(ConnectorFactory, options.view);
      if (!options.workspaceContext) {
        options.workspaceContext = options.view.context.getObject(WorkspaceContextFactory);
      }
      this.workspaceContext = options.workspaceContext;

      this.teamRoles = options.view.roleCollection.clone() ;
      this.teamParticipants = options.view.participantCollection;
      this.listenTo(this.view, 'destroy', this.close);
      this.buttonsModel = undefined;
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.propagateEventsToRegions();
    },

    onRender: function () {
      var user = new UserPicker({
        context: this.workspaceContext,
        limit: 20,
        clearOnSelect: true,
        placeholder: lang.addParticipantsUserPickerPlaceholder,
        disabledMessage: lang.addParticipantsDisabledMemberMessage,
        onRetrieveMembers: _.bind(this.retrieveMembersCallback, this),
        prettyScrolling: true,
        initialActivationWeight: 100
      });
      this.userPickerRegion.show(user);
      user.$(".cs-search-icon").attr("aria-label",lang.addParticipantsSearchAria);
      this.listenTo(user, 'item:change', this.onUserItemChanged);
      var role = new RolePicker({
        roles: this.teamRoles,
        showInherited: false,
        prettyScrolling: true
      });
      this.rolePickerRegion.show(role);
      this.listenTo(role, 'item:change', this.onRoleItemChanged);
       var participants = new ParticipantsListCollectionView({
         context: this.options.workspaceContext,
         collection: _.extend(new Backbone.Collection(), {
           workspaceContext: this.workspaceContext,
           node: this.workspaceContext.getModel(NodeFactory),
           roles: this.teamRoles,
           comparator: function (left, right) {
             return base.localeCompareString(left.get('display_name'), right.get('display_name'));
           }
         })
       });
      this.participantsRegion.show(participants);
      this.participants = participants.collection;
      this.listenTo(this.participants, 'reset add change', this.onParticipantsChanged);
      this.listenTo(this.participants, 'remove', this.onParticipantsRemove);
      this.buttonModel = new Backbone.Collection([{
        id: 'reset',
        label: lang.addParticipantsButtonClear,
        css: 'clear binf-pull-left',
        click: _.bind(this.onClickClear, this),
        disabled: true,
        close: false
      }, {
        id: 'submit',
        label: lang.addParticipantsButtonSave,
        css: 'save',
        click: _.bind(this.onClickSave, this),
        disabled: true,
        close: true
      }, {
        id: 'cancel',
        label: lang.addParticipantsButtonCancel,
        css: 'cancel',
        disabled: false,
        close: true
      }]);
      this.buttonsRegion.show(new ButtonBar({
        collection: this.buttonModel
      }));
    },

    onUserItemChanged: function (e) {
      if (e.item.get('disabled')) {
        return;
      }
      var attributes = _.extend(e.item.attributes, {
        display_name: e.item.get('name_formatted')
      });
      var participant = new Participant(attributes, {
        connector: this.connector,
        collection: this.participants
      });
      participant.roles = new Backbone.Collection(undefined, {
        comparator: function (left, right) {
          return base.localeCompareString(left.get('name'), right.get('name'));
        }
      });
      this.participants.add(participant);
    },

    retrieveMembersCallback: function (args) {
      var self = this;
      args.collection.each(function (current) {
        var exists = false;
        if (self.teamParticipants.findWhere({id: current.get('id')})) {
          exists = true;
        } else {
          if (self.participants.findWhere({id: current.get('id')})) {
            exists = true;
          }
        }
        current.set('disabled', exists);
      });
    },

    onRoleItemChanged: function (e) {
      this.participants.each(function (current) {
        current.roles.add(e.item);
      });
    },

    onClickSave: function () {
      var self = this;
      var error = false;
      var count = this.participants.length;
      this.participants.each(function (current) {
        self.teamParticipants.addNewParticipant(current);
        current.save(
            {
              add: current.roles.models
            }, {
              success: function (response) {
                if ((--count) === 0) {
                  self.refreshAfterSave(error);
                }
              },
              error: function (response) {
                error = true;
                if ((--count) === 0) {
                  self.refreshAfterSave(error);
                }
              }
            });
      });
    },

    refreshAfterSave: function (error) {
      var self = this;
      if (error === true) {
        ModalAlert.showError(lang.addParticipantsErrorMessageDefault);
      }
      function afterFetch() {
        self.teamParticipants.trigger('saved', self.teamParticipants);
      }
      self.teamParticipants.fetch({
        success: function () {
          self.teamParticipants.setNewParticipant();
        }
      }).then(afterFetch,afterFetch);
    },

    onClickClear: function () {
      this.participants.reset();
      this.userPickerRegion.currentView.currentlyFocusedElement().focus();
      this.updateScrollbar();
    },

    onParticipantsRemove: function () {
      this.onParticipantsChanged();
      if (this.participants && this.participants.length>0) {
        this.participantsRegion.currentView.trigger('moveTabIndex', this.participantsRegion.currentView);
      } else {
        this.userPickerRegion.currentView.currentlyFocusedElement().focus();
      }
    },

    onParticipantsChanged: function () {
      var disableClear = (this.participants.length === 0);
      var disableSave = (this.participants.length === 0);
      this.participants.each(function (participant) {
        if ((participant.roles === undefined) || (participant.roles.length === 0)) {
          disableSave = true;
        }
      });
      this.buttonModel.get('reset').set('disabled', disableClear);
      this.buttonModel.get('submit').set('disabled', disableSave);
      this.$el.find('.conws-addparticipants-members').perfectScrollbar({
        suppressScrollX: true,
        scrollYMarginOffset: 15
      });
    },
    updateScrollbar: function () {
      var sc1 = this.$el.find('.conws-addparticipants-members');
      _.each(sc1, function (sc) {
        $(sc).perfectScrollbar('update');
      })
    }
  });
  _.extend(AddParticipantsView.prototype, LayoutViewEventsPropagationMixin);
  return AddParticipantsView;
})
;
