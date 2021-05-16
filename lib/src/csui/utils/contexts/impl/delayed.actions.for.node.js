/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/utils/commands', 'csui/utils/defaultactionitems'
], function (commands, defaultActionItems) {
  'use strict';

  function delayCommands (node) {
    node.resetCommands();
    node.resetDefaultActionCommands();
    node.setCommands(commands.getAllSignatures());
    node.setDefaultActionCommands(defaultActionItems.getAllCommandSignatures(commands));
    node.setEnabledDelayRestCommands(true, false);
  }

  function relayActionEvents (context) {
    if (context.nextNode.delayRestCommands) {
      context.nextNode.delayedActions
          .on('request', relayRequestNodeActions, context)
          .on('sync', relaySyncNodeActions, context)
          .on('error', relayErrorNodeActions, context);
      context.nextNode.actions
          .on('reset update', relayUpdateNodeActions, context);
      resumeRelayingActionEvents(context);
    }
  }

  function relayRequestNodeActions () {
    if (this.relayingActionEvents) {
      var delayedActions = this.node.delayedActions;
      delayedActions._fetchStarted();
      delayedActions.trigger('request', delayedActions, {}, {});
      delayedActions.fetching = this.nextNode.delayedActions.fetching;
    }
  }

  function relaySyncNodeActions () {
    if (this.relayingActionEvents) {
      var delayedActions = this.node.delayedActions;
      delayedActions._fetchSucceeded();
      delayedActions.trigger('sync', delayedActions, {}, {});
    }
  }

  function relayErrorNodeActions () {
    if (this.relayingActionEvents) {
      var delayedActions = this.node.delayedActions;
      delayedActions._fetchFailed();
      delayedActions.trigger('error', delayedActions, {}, {});
    }
  }

  function relayUpdateNodeActions () {
    if (this.relayingActionEvents) {
      updateNodeActions(this);
    }
  }

  function suppressRelayingActionEvents (context) {
    if (context.nextNode.delayRestCommands) {
      context.relayingActionEvents = false;
    }
  }

  function resumeRelayingActionEvents (context) {
    if (context.nextNode.delayRestCommands) {
      context.relayingActionEvents = true;
    }
  }

  function updateNodeActions(context) {
    if (context.nextNode.delayRestCommands) {
      context.node.actions.reset(context.nextNode.actions.models);
    }
  }

  return {
    delayCommands: delayCommands,
    relayActionEvents: relayActionEvents,
    suppressRelayingActionEvents: suppressRelayingActionEvents,
    resumeRelayingActionEvents: resumeRelayingActionEvents,
    updateNodeActions: updateNodeActions
  };
});
