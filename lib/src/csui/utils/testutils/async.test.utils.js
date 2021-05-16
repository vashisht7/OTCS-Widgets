/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/models/view.state.model'], function(module, _, $, viewStateModel) {

  var pendingTimers = [];
  function asyncElement(parent, selector, options) {
    var deferred      = $.Deferred(),
        timeout       = window.jasmine ? window.jasmine.DEFAULT_TIMEOUT_INTERVAL : 10000,
        newOptions    = {},
        intervalSoFar = 0,               
        el, intervalRef;
        timeout -= timeout/10;
    if (typeof options === 'number') {
      newOptions.interval = options;
    } else if (typeof options === 'boolean') {
      newOptions.removal = options;
    } else {
      newOptions = options;
    }
    options = _.extend({interval: 50, removal: false, length: 0}, newOptions);
    if (!parent || !selector) {
      console.warn('parent or child selector missing');
      deferred.reject();
    } else {
      el = $(parent).find(selector);
      if (options.removal ? el.length === options.length : el.length > options.length) {
        deferred.resolve(el);
      } else {
        var timeoutError = new Error('Waiting for element "' + selector + '" timed out.');
        intervalRef = setInterval(function () {
          intervalSoFar += options.interval;
          el = $(parent).find(selector);
          if ((options.removal ? el.length === options.length : el.length > options.length)) {
            stopTimer(intervalRef);
            deferred.resolve(el);
          } else if (intervalSoFar >= timeout) {
            throw timeoutError;
          }
        }, options.interval);
        pendingTimers.push(intervalRef);
      }
    }
    return deferred.promise();
  }

  function stopTimer(intervalRef) {
    clearInterval(intervalRef);
    pendingTimers = _.without(pendingTimers, intervalRef);
  }

  return {
    asyncElement: asyncElement,
    cancelAllAsync: function() {
      if (pendingTimers.length > 0) {
        console.error("Total "+pendingTimers.length+" was running. Tests needs to be fixed.");
      }
      pendingTimers.forEach(function (intervalRef) {
        clearInterval(intervalRef);
      });
      pendingTimers = [];
    },
    restoreEnvironment:function() {
      $('body').empty();
      viewStateModel.clean();
    },

    waitFor: function(check,message,timeout){
      timeout===undefined && (timeout = 1000);
      var deferred = $.Deferred();
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
    },
    findHidingElement: function(element, root) {

      if (!element) {
        return null;
      }
      var elementStyle = window.getComputedStyle(element);
      var elementRect = element.getBoundingClientRect();
      var middleX = elementRect.x + elementRect.width / 2;
      var middleY = elementRect.y + elementRect.height / 2;
      if (elementStyle["display"] === "none") {
        return element;
      }
      if (elementRect.width === 0 || elementRect.height === 0) {
        return element;
      }

      root = root ? root : document.body;
      var parentElement = element.parentElement;
      while (parentElement) {

        var parentStyle = window.getComputedStyle(parentElement);
        var parentRect = parentElement.getBoundingClientRect();
        var overflowX = parentStyle["overflow-x"] !== "clip" && parentStyle["overflow-x"] !== "hidden";
        var overflowY = parentStyle["overflow-y"] !== "clip" && parentStyle["overflow-y"] !== "hidden";
        var visibleX = overflowX || parentRect.width && parentRect.left <= middleX && middleX <= parentRect.right;
        var visibleY = overflowY || parentRect.height && parentRect.top <= middleY && middleY <= parentRect.bottom;
        if (parentStyle["display"] === "none") {
          return parentElement;
        }
        if (!visibleX || !visibleY) {
          return parentElement;
        }
        if (parentElement === root) {
          return undefined;
        }
        parentElement = parentElement.parentElement;
      }
      return undefined;
    },

    isElementVisible: function(element, root) {
      var visible = this.findHidingElement(element, root) === undefined;
      return visible;
    }
  };
});
