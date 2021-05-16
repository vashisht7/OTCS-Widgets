/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'conws/widgets/team/impl/participant.model',
  'conws/dialogs/addoreditrole/impl/roleparticipants/impl/participant.listitem.view',
  'conws/dialogs/addoreditrole/impl/roleheader/roleheader.view',
  'conws/dialogs/addoreditrole/impl/roleparticipants/impl/empty.roleparticipants.view',
  'csui/controls/userpicker/userpicker.view',
  'i18n!conws/dialogs/addoreditrole/impl/nls/lang',
  'hbs!conws/dialogs/addoreditrole/impl/roleparticipants/impl/roleparticipants',
  'css!conws/dialogs/addoreditrole/impl/roleparticipants/impl/roleparticipants'
], function (_, Backbone, Marionette, base,
  LayoutViewEventsPropagationMixin, PerfectScrollingBehavior, Participant,
  ParticipantListItemView, RoleHeaderView, EmptyRoleParticipantsView, UserPicker, lang, template) {

    var ParticipantsListCollectionView = Marionette.CollectionView.extend({

      tagName: 'ul',

      className: 'binf-list-group',

      childView: ParticipantListItemView,

      constructor: function ParticipantsListCollectionView(options) {
        Marionette.CollectionView.call(this, options);
      },

      onRemoveChild: function (childView) {
        this.moveTabIndex(childView);
      },

      moveTabIndex: function (childView) {
        var numberOfChildren = this.children && this.children.length;
        if (numberOfChildren) {
          var targetIndex = this.selectedIndex;
          if (targetIndex === numberOfChildren) {
            targetIndex = targetIndex - 1;
          }
          var newFocus = this.children.findByModel(this.collection.at(targetIndex));
          newFocus && newFocus.$el.find('.participant-delete .conws-icon-cross').focus();
        }
      }
    });

    var RoleParticipantsView = Marionette.LayoutView.extend({

      template: template,

      regions: {
        HeaderRegion: '.conws-addoreditrole-roleparticipants-header',
        userPickerRegion: '.conws-addoreditrole-roleparticipants-userpicker',
        participantsRegion: '.conws-addoreditrole-roleparticipants-members'
      },

      behaviors: {
        PerfectScrolling: {
          behaviorClass: PerfectScrollingBehavior,
          contentParent: '.conws-addoreditrole-roleparticipants-members',
          suppressScrollX: true
        }
      },

      templateHelpers: {
        'title': lang.participantsTitle
      },

      _createHeaderControl: function () {
        var roleHeaderView = new RoleHeaderView({
          headerViewoptions: this.options,
          currentStep: 'step3'
        });
        return roleHeaderView;
      },

      _createEmptyRoleParticipantsView: function () {
        var emptyRoleParticipantsView = new EmptyRoleParticipantsView({
          options: this.options
        });
        return emptyRoleParticipantsView;
      },

      _createParticipantsListCollectionView: function () {
        var participantsListCollectionView = new ParticipantsListCollectionView({
          context: this.context,
          collection: _.extend(new Backbone.Collection(), {
            context: this.context,
            node: this.options.nodeModel,
            comparator: function (left, right) {
              return base.localeCompareString(left.get('display_name'), right.get('display_name'));
            }
          })
        });
        return participantsListCollectionView;
      },

      constructor: function RoleParticipantsView(options) {
        options || (options = {});

        this.context = options.context;
        this.connector = options.connector;
        Marionette.LayoutView.prototype.constructor.apply(this, arguments);
        this.listenTo(this, 'set:initial:focus', this.onSetInitialFocus);
        this.propagateEventsToRegions();
      },

      onRender: function () {
        var user = new UserPicker({
          context: this.context,
          limit: 20,
          clearOnSelect: true,
          placeholder: lang.roleParticipantsUserPickerPlaceholder,
          disabledMessage: lang.roleParticipantsDisabledMemberMessage,
          onRetrieveMembers: _.bind(this.retrieveMembersCallback, this),
          prettyScrolling: true,
          initialActivationWeight: 100
        });
        this.HeaderRegion.show(this._createHeaderControl());
        this.userPickerRegion.show(user);
        user.$(".cs-search-icon").attr("aria-label", lang.roleParticipantsSearchAria);
        this.listenTo(user, 'item:change', this.onUserItemChanged);
        var participants = this._createParticipantsListCollectionView();
        if (!this.options.addrole && this.options.model) {
          _.each(this.options.model.get("members"), function (member) {
            var participant = new Participant(member, {
              connector: this.connector,
              collection: this.participants
            });
            participants.collection.add(participant);
          }, this)
        }
        this.participants = participants.collection;
        this.participantView = participants;
        this.listenTo(this.participants, 'reset add change', this.onParticipantsChanged);
        this.listenTo(this.participants, 'remove', this.onParticipantsRemove);

        if (participants.collection.length === 0) {
          this.participantsRegion.show(this._createEmptyRoleParticipantsView());
        } else {
          this.participantsRegion.show(participants);
          this.participantsRegion.$el.addClass("conws-addoreditrole-roleparticipants-members-exist");
        }
      },

      onAfterShow: function () {
        _.each(this.participantView.children._views, function (view) {
          view.delete && view.delete.currentView && view.delete.currentView.trigger("dom:refresh");
        }, this)
        this.onSetInitialFocus();
      },

      onSetInitialFocus: function () {
        this.userPickerRegion.currentView.$el.find("[class='csui-control-userpicker'] input[type='text']").focus();
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
        if (this.participants.length === 0) {
          this.participantsRegion.$el.addClass("conws-addoreditrole-roleparticipants-members-exist");
          var participants = this._createParticipantsListCollectionView();
          participants.collection = this.participants;
          participants.collection.add(participant);
          this.participantsRegion.show(participants);
          this.listenTo(participants.collection, 'reset add change', this.onParticipantsChanged);
          this.listenTo(participants.collection, 'remove', this.onParticipantsRemove);
          this.trigger('update:scrollbar');
        } else {
          this.participants.add(participant);
        }
      },

      retrieveMembersCallback: function (args) {
        var self = this;
        args.collection.each(function (current) {
          var exists = false;
          if (self.participants.findWhere({ id: current.get('id') })) {
            exists = true;
          }
          current.set('disabled', exists);
        });
      },

      onParticipantsRemove: function () {
        this.onParticipantsChanged();
        if (this.participants && this.participants.length === 0) {
          this.userPickerRegion.currentView.currentlyFocusedElement().focus();
          this.participantsRegion.$el.removeClass("conws-addoreditrole-roleparticipants-members-exist");
          this.participantsRegion.show(this._createEmptyRoleParticipantsView());
        }
      },

      onParticipantsChanged: function () {
        this.trigger('update:scrollbar');
      }
    });
    _.extend(RoleParticipantsView.prototype, LayoutViewEventsPropagationMixin);
    return RoleParticipantsView;
  });
