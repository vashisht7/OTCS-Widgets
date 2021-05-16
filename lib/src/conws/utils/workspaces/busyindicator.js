/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([], function () {
  'use strict';
  function BusyIndicator (on_fct,off_fct) {
    this.on_fct = on_fct;
    this.off_fct = off_fct;
  }

  function OnOff(status,onoff) {
      if (status.busyIndicator) {
        status.busyIndicator[onoff]();
      } else {
        var view = status.originatingView;
        if (view && view.blockActions && view.unblockActions) {
          status.busyIndicator = new BusyIndicator(
            function(){ view.blockActions(); },
            function(){ view.unblockActions(); }
          );
          status.busyIndicator[onoff]();
        }
      }
  }

  BusyIndicator.on = function(status) { OnOff(status,"on"); };
  BusyIndicator.off = function(status) { OnOff(status,"off"); };

  BusyIndicator.prototype.on = function() {
    if (!this.busy) { this.busy = true; this.on_fct(); }
  };
  BusyIndicator.prototype.off = function() {
    if (this.busy) { this.busy = false; this.off_fct(); }
  };

  return BusyIndicator;

});
