/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log'
], function ( _, $, log ) {
  'use strict';
  function set_footprint(obj,done,m1,m2) {
    if (done.footprint) {
      obj.footprint = done.footprint.slice();
      obj.footprint.push((m1||"")+((m1&&m2)?" ":"")+(m2||""));
    }
  }
  function log_footprint(obj,message) {
    obj && obj.footprint && log.info(message,obj.footprint) && console.log(log.last);
  }

  function Deferred(done,marker,message) {
    var deferred = $.Deferred();
    set_footprint(deferred,done,marker,message);
    return deferred;
  }

  function do_run(done,action,message) {
    var deferred = Deferred(done,"deferred",message), // promise to trigger this step
      next = Deferred(done,"next",message); // promise to trigger next step
    deferred.then(function() {
        action(subdone);
        if(subdone.start) {
          log_footprint(subdone.start,"start in run");
          subdone.start.resolve();
        } else if (!subdone.last) {
          log_footprint(subdone,"done in run");
          subdone(); // we must resolve only if action did not create a promise.
        }
      },function(error) {
        log_footprint(subdone,"fail in run");
        subdone.fail(error); // propagate error to end of chain.
      });
    function subdone() {
      next.resolve().done(function(){
        if (done.last===next) {
          log_footprint(done,"done in subdone");
          done();
        }
      });
    }
    subdone.fail = function (message) {
      next.reject(message).fail(function(error){
        if (done.last===next) {
          log_footprint(done,"fail in subdone");
          done.fail(error);
        }
      });
    };
    subdone.nested = true;
    set_footprint(subdone,done,"subdone",message);
    if (done.last) {
      done.last.then(deferred.resolve,deferred.reject); // connect to end of chain.
    } else {
      if(!done.nested) {
        setTimeout(function() {
          log_footprint(deferred,"start deferred");
          deferred.resolve();
          },0); // resolve after all sync operations, to trigger async operations.
      } else {
        done.start = deferred;
      }
    }
    done.last = next; // provide current end of chain for subsequent steps and to know the end later.

    return next.promise();
  }

  function do_justWait(done,message,timeout) {
    timeout===undefined && (timeout = 1000);
    var deferred = Deferred(done,"justwait",message);
    do_run(done,function(done){
      log.info("starting to wait " + timeout + " ms for " + message) && console.log(log.last);
      setTimeout(function(){
        log.info("continuing after waiting " + timeout + " ms for " + message) && console.log(log.last);
        log_footprint(deferred,"resolving after wait");
        deferred.resolve();
      },timeout);
      deferred.then(done,done.fail);
      done.last = deferred;
    },message);
    return deferred.promise();
  }

  function do_awaitPromise(done,promise,message) {
    var deferred = Deferred(done,"promise",message);
    do_run(done,function(done){
      log.info("starting to wait for promise " + message) && console.log(log.last);
      promise.then(function() {
        log.info("resolving after promise " + message) && console.log(log.last);
        log_footprint(deferred,"resolving after promise");
        deferred.resolve();
      }, function(error) {
        log.error("rejecting after promise " + message) && console.log(log.last);
        log_footprint(deferred,"rejecting after promise");
        deferred.reject(error);
      });
      deferred.then(done,done.fail);
      done.last = deferred;
    },message);
    return deferred.promise();
  }

  function do_waitFor(done,check,message,timeout) {
    var deferred;
    if (!_.isFunction(check)) {
      timeout = message; message = check; check = done;
      timeout===undefined && (timeout = 1000);
      deferred = $.Deferred();
      if (check()) {
        deferred.resolve();
      } else {
        var state = {
          clear: function () {
            if (this.timeout) {
              clearTimeout(this.timeout);
              delete this.timeout;
            }
            if (this.interval) {
              clearInterval(this.interval);
              delete this.interval;
            }
          },
          interval: setInterval(function () {
            if (check()) {
              state.clear();
              deferred.resolve();
            }
          }, 100),
          timeout: setTimeout(function () {
            state.clear();
            deferred.reject(state.error);
          }, timeout),
          error: new Error(_.str.sformat("Timeout {0} reached while waiting for {1}.",timeout,message))
        };
      }
      return deferred.promise();
    }
    timeout===undefined && (timeout = 1000);
    var timeoutError = new Error(_.str.sformat("Timeout {0} reached while waiting for {1}.",timeout,message));
    deferred = Deferred(done,"waitfor",message);
    do_run(done,function(done) {
      function clear(state) {
        if(state.timeout) {
          clearTimeout(state.timeout);
          delete state.timeout;
        }
        if (state.interval) {
          clearInterval(state.interval);
          delete state.interval;
        }
      }
      var state = {};
      state.interval = setInterval(function() {
        if (check()) {
          clear(state);
          log_footprint(deferred,"resolving after check");
          deferred.resolve();
        }
      }, 100);
      state.timeout = setTimeout(function(){
        clear(state);
        log_footprint(deferred,"rejecting after check");
        deferred.reject(timeoutError);
      },timeout);
      deferred.then(done,done.fail);
      done.last = deferred;
    },message);
    return deferred.promise();
  }

  var TestUtil = {

    run: do_run,
    justWait: do_justWait,
    awaitPromise: do_awaitPromise,
    waitFor: do_waitFor

  };

  return TestUtil;

});
