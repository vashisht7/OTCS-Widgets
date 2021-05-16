/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/backbone', 'csui/utils/log', 'csui/utils/base',
  'csui/utils/url', 'i18n', 'i18n!csui/utils/impl/nls/lang',
  'csui/utils/authenticators/authenticators',
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/lib/jquery.ajax-progress'
], function (require, module, $, _, Backbone, log, base,
  Url, i18n, lang, authenticators, UploadableMixin) {
  'use strict';

  var config = _.extend({
    connectionTimeout: undefined
  }, module.config());

  var pageUnloading = false;
  $(window).on('beforeunload.' + module.id, function (event) {
    pageUnloading = true;
  });

  function Connector(options) {
    this.connection = options.connection;
    this.authenticator = options.authenticator;
    if (!this.authenticator) {
      var Authenticator = authenticators.findByConnection(this.connection);
      if (!Authenticator) {
        throw new Error(
          'No authenticator found. Load csui-extensions.json to enable built-in authenticators.');
      }
      this.authenticator = new Authenticator();
    }
    this.authenticator.connection = this.connection;
    this.authenticator.connectionTimeout = this.connectionTimeout;
    this.authenticationPending = false;
    this.waitingRequests = [];
    this.restartRequests = [];
  }

  function assignTo(model) {
    if (model.connector) {
      if (model.connector === this) {
        return;
      }
      throw new Error('Impossible to re-assign connector.');
    }
    model.connector = this;
    return overrideBackboneSync.call(this, model);
  }

  function overrideBackboneSync(model) {
    var self = this;
    var originalSync = model.sync;

    model.sync = function (method, model, options) {
      function executeSync() {
        pageUnloading = false;

        var restartRequest = {
          execute: originalSync,
          thisObj: model
        };
        self.extendAjaxOptions(options, restartRequest);
        var originalOptions = _.clone(options);
        _.extend(restartRequest, {
          options: originalOptions,
          deferred: options.deferred,
          executeOptionsArray: [method, model, _.extend(originalOptions, {restartRequest: true})]
        });
        var deferred = options.deferred;
        var jqxhr = originalSync.call(model, method, model, options)
            .progress(deferred.notify)
            .done(deferred.resolve)
            .fail(function (request, message, statusText) {
              if (!pageUnloading && request.status !== 401) {
                deferred.reject(request, message, statusText);
              }
            });
        return addAbort(deferred.promise(), jqxhr);
      }

      return executeOrScheduleRequest.call(self, executeSync);
    };

    return this;
  }

  function getConnectionUrl() {
    return new Url(this.connection.url);
  }

  function addAbort(promise, jqxhr) {
    promise.abort = function () {
      if (jqxhr.abort) {
        jqxhr.abort();
      }
      return this;
    };
    return promise;
  }

  function executeOrScheduleRequest(executeCall) {
    if (this.authenticator.isAuthenticated()) {
      return executeCall();
    }

    var executor = {
      execute: executeCall,
      deferred: $.Deferred()
    };
    this.waitingRequests.push(executor);

    var self = this;
    authenticate.call(this, function success() {
      executeWaitingRequests.call(self);
    }, function fail(error) {
      cancelWaitingRequests.call(self);
      reportError(error);
    });

    return executor.deferred.promise();
  }

  function extendAjaxOptions(options, restartRequest) {
    options.headers || (options.headers = {});
    _.extend(options.headers, this.connection.headers);
    _.extend(options.headers, {
      'Accept-Language': i18n.settings.locale
    });
    this.authenticator.setAuthenticationHeaders(options.headers);
    options.timeout = this.connectionTimeout;
    options.deferred = $.Deferred();

    var self = this;
    var originalOptions;

    var beforeSend = options.beforeSend;
    options.beforeSend = function (request, settings) {
      options.request = request;
      request.settings = settings;
      if (self.reportSending) {
        self.reportSending(request, settings);
      }
      if (beforeSend) {
        beforeSend(request, settings);
      }
      options.progress({
        lengthComputable: false,
        beforeSend: true
      });
    };

    var progress = options.progress;
    options.progress = function (event) {
      if (self.reportProgress) {
        self.reportProgress(event, options.request);
      }
      if (progress) {
        progress(event);
      }
      options.deferred.notify(event, options.request);
    };

    var success = options.success;
    options.success = function (data, result, request) {
      self.authenticator.updateAuthenticatedSession(request);
      self._succeeded = true;
      if (self.reportSuccess) {
        self.reportSuccess(request);
      }

      if (success) {
        success(data, result, request);
      }
    };

    var error = options.error;
    options.error = function (request, message, statusText) {
      if (pageUnloading) {
        return;
      }

      function reportError() {
        if (request.status == 409) {
          setConflictMessage(request);
        }
        if (self.reportError) {
          self.reportError(request);
        }
        if (error) {
          error(request, message, statusText);
        }
      }

      function sessionExpired() {
        if (!self.confirmingReload) {
          self.confirmingReload = true;
          var failure     = new base.RequestErrorMessage(request),
              dialogTitle = self._succeeded ? lang.SessionExpiredDialogTitle :
                            lang.AuthenticationFailureDialogTitle;
          log.warn(failure) && console.warn(log.last);
          require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
            alertDialog
              .showWarning(lang.AuthenticationFailureDialogText, dialogTitle, {
                buttons: alertDialog.buttons.Ok
              })
              .always(function () {
                self.authenticator.unauthenticate({reason: 'failed'});
              });
          });
        }
      }

      if (request.status == 401) {
        if (restartRequest || options.restartDeferred) {
          var requestObj = restartRequest || {
                options: originalOptions,
                deferred: options.restartDeferred || options.deferred,
                execute: $.ajax,
                thisObj: undefined,
                executeOptionsArray: [_.extend(originalOptions, {restartRequest: true})]
              };
          self.restartRequests.push(requestObj);
          if (!self.reauthenticatingInitiated) {
            self.reauthenticatingInitiated = true;
            self.authenticator.unauthenticate({reason: 'expired'});  // clear expired session
            self.authenticator.authenticate(function () {  // success
              self.reauthenticatingInitiated = false;
              executeRestartRequests.call(self);
            }, function (error) {  // failure
              self.restartRequests = [];
              sessionExpired();
            });
          }
        } else {
          sessionExpired();
        }
      } else {
        reportError();
      }
    };
    originalOptions = _.clone(options);
    return options;
  }

  function formatAjaxData(data) {
    data = JSON.stringify(data);
    return UploadableMixin.useJSON || UploadableMixin.mock ?
           data : {body: data};
  }

  function getAjaxContentType() {
    return UploadableMixin.useJSON || UploadableMixin.mock ?
           'application/json' : 'application/x-www-form-urlencoded';
  }

  function makeAjaxCall(options) {
    var method = options.method || options.type || 'GET';
    var data = options.data;
    var self = this;

    if (data) {
      if (method === 'GET') {
		    if (typeof data !== 'string') {
          data = $.param(data, true);
		    }
        var url = options.url || location.href;
        url += url.indexOf('?') >= 0 ? '&' : '?';
        url += data;
        delete options.data;
      } else {
        var contentType = options.contentType;
        if (data instanceof FormData) {
          if (contentType === undefined) {
            options.contentType = false;
          }
          options.processData = false;
        } else {
          if (typeof data !== 'string') {
            options.data = formatAjaxData(data);
          }
          if (contentType === undefined) {  // Note: 'false' is a valid value, don't change it
            options.contentType = getAjaxContentType();
          }
        }
      }
    }

    function executeCall() {
      options = self.extendAjaxOptions(options);

      var deferred = $.Deferred();
      _.extend(options, {restartDeferred: deferred});
      var jqxhr = $.ajax(options)
          .progress(deferred.notify)
          .done(deferred.resolve)
          .fail(function (request, message, statusText) {
            if (request.status !== 401) {
              if (!pageUnloading) {
                deferred.reject(request, message, statusText);
              }
            }
          });
      return addAbort(deferred.promise(), jqxhr);
    }

    return executeOrScheduleRequest.call(this, executeCall);
  }

  function executeRestartRequests() {
    var self = this;
    var executors = this.restartRequests.slice(0);
    this.restartRequests = [];
    _.each(executors, function (executor) {
      self.authenticator.setAuthenticationHeaders(executor.options.headers);
      executor.execute.apply(executor.thisObj, executor.executeOptionsArray)
          .progress(executor.deferred.notify)
          .done(executor.deferred.resolve)
          .fail(function (request, message, statusText) {
            if (!pageUnloading) {
              executor.deferred.reject(request, message, statusText);
            }
          });
    });
  }

  function executeWaitingRequests() {
    var executors = this.waitingRequests.slice(0);
    this.waitingRequests = [];
    _.each(executors, function (executor) {
      executor.execute()
        .progress(executor.deferred.notify)
        .done(executor.deferred.resolve)
        .fail(function (request, message, statusText) {
          if (!pageUnloading) {
            executor.deferred.reject(request, message, statusText);
          }
        });
    });
  }

  function cancelWaitingRequests() {
    var executors = this.waitingRequests.slice(0);
    this.waitingRequests = [];
    _.each(executors, function (executor) {
      executor.deferred.reject();
    });
  }

  function authenticate(success, failure) {
    if (!this.authenticationPending) {
      this.authenticationPending = true;
      var self = this;
      this.authenticator.authenticate(function () {
          self.authenticationPending = false;
          success();
        }, function (error) {
          self.authenticationPending = false;
          failure(error);
        });
    }
  }

  function reportSending(request, settings) {
    if (request && settings) {
      log.debug('Sending request as {0} to {1}.', settings.type, settings.url) &&
      console.log(log.last);
    }
  }

  function reportProgress(event, request) {
    var progress = event.lengthComputable ? _.str.sformat(
      '{0} from {1} bytes transferred', event.loaded, event.total) :
                   event.beforeSend ? 'connection opened' : 'no information';
    log.debug('Progress of {0} from {1}: {2}.', request.settings.type,
      request.settings.url, progress) && console.log(log.last);
  }

  function reportSuccess(request) {
    if (request && request.settings) {
      log.debug('Receiving response for {0} from {1}.', request.settings.type,
        request.settings.url) && console.log(log.last);
    }
  }

  function reportError(request, error) {
    if (!error) {
      if (request instanceof Error) {
        error = request;
        request = undefined;
      } else {
        error = new base.RequestErrorMessage(request);
      }
    }
    if (request && request.settings) {
      log.warn('{0} request to {1} failed:', request.settings.type, request.settings.url) &&
      console.warn(log.last);
    }
    log.warn(error) && console.warn(log.last);
    base.MessageHelper.addMessage(error.toString());
  }

  function requestContentAuthToken(node) {
    var attributes = base.isBackbone(node) ? node.attributes : node,
        url        = Url.combine(this.connection.url, 'contentauth?id=' + attributes.id),
        headers    = _.extend({
          'Accept-Language': i18n.settings.locale
        }, this.connection.headers);
    this.authenticator.setAuthenticationHeaders(headers);
    return $.ajax({
      type: 'GET',
      url: url,
      headers: headers,
      timeout: this.connectionTimeout,
      context: this,
      beforeSend: _.bind(function (request, settings) {
        request.settings = settings;
        if (this.reportSending) {
          this.reportSending(request, settings);
        }
      }, this),
      success: _.bind(function (data, result, request) {
        this.authenticator.updateAuthenticatedSession(request);
        if (this.reportSuccess) {
          this.reportSuccess(request);
        }
      }, this),
      error: _.bind(function (request, message, statusText) {
        if (this.reportError) {
          this.reportError(request);
        }
      }, this)
    });
  }

  function setConflictMessage(request) {
    if (request.responseText) {
      try {
        request.responseJSON = JSON.parse(request.responseText);
      } catch (failure) {
        log.warn("Parsing error response failed: {0}.", failure)
        && console.warn(log.last);
      }
    }
    if (request.responseJSON) {
      var data = request.responseJSON;
      data.error = lang.resourceConflict;
      request.responseText = JSON.stringify(data);
    }
  }

  _.extend(Connector.prototype, Backbone.Events, {
    constructor: Connector,
    assignTo: assignTo,
    getConnectionUrl: getConnectionUrl,
    extendAjaxOptions: extendAjaxOptions,
    extendFetchOptions: extendAjaxOptions,
    formatAjaxData: formatAjaxData,
    getAjaxContentType: getAjaxContentType,
    makeAjaxCall: makeAjaxCall,
    reportSending: reportSending,
    reportProgress: reportProgress,
    reportSuccess: reportSuccess,
    reportError: reportError,
    requestContentAuthToken: requestContentAuthToken,
    connectionTimeout: config.connectionTimeout,
    authenticate: authenticate
  });

  return Connector;
});
