/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log',
  'csui/utils/authenticators/ticket.authenticator'
], function (require, module, _, $, log, TicketAuthenticator) {
  'use strict';

  var config                      = module.config(),
      authenticationIFrameTimeout = config.authenticationIFrameTimeout || 3000;
  var RedirectingFormAuthenticator = TicketAuthenticator.extend({
    interactive: true,

    constructor: function RedirectingFormAuthenticator(options) {
      TicketAuthenticator.prototype.constructor.call(this, options);
    },

    authenticate: function (options, succeeded, failed) {
      if (typeof options === 'function') {
        failed = succeeded;
        succeeded = options;
        options = undefined;
      }

      TicketAuthenticator.prototype.authenticate.call(this, options,
          succeeded, _.bind(this.initiateLoginSequence, this, succeeded, failed));
    },

    initiateLoginSequence: function (succeeded, failed) {
      var self = this;
      var timer, dialog, urlOrigin;

      function createIFrame() {
        var deferred = $.Deferred();
        require([
          'csui/lib/marionette', 'csui/controls/dialog/dialog.view', 'csui/utils/url'
        ], function (Marionette, DialogView, Url) {
          var src = Url.appendQuery(new Url(self.connection.url).getCgiScript(), 'func=csui.ticket');
          src = Url.appendQuery(src, 'userid=' + self.getUserId());
          urlOrigin = new Url(self.connection.url).getOrigin();

          var view = new Marionette.View({
            el: $('<iframe>', {
              width: '100%',
              height: '100%',
              src: src
            })
          });

          dialog = new DialogView({
            standardHeader: false,
            view: view,
            fullSize: true
          });
          view.render();

          dialog.show({render: false});
          dialog.$el.css({'z-index': '1061'});  // higher than popover
          dialog.$el.addClass('binf-hidden');
          deferred.resolve();
        }, deferred.reject);
        return deferred.promise();
      }

      function removeIFrame() {
        resumeBlockingView();
        dialog && dialog.destroy();
      }

      function suppressBlockingView() {
        require(['csui/controls/progressblocker/blocker'],
            function (BlockingView) {
              BlockingView.suppressAll();
            });
      }

      function resumeBlockingView() {
        require(['csui/controls/progressblocker/blocker'],
            function (BlockingView) {
              BlockingView.resumeAll();
            });
      }

      function receiveMessage(event) {
        if (event.origin !== urlOrigin) {
          return;
        }
        if (event.data.ticket) {
          log.debug('Redirecting Form Authenticator received new ticket.') && console.log(log.last);
          window.removeEventListener('message', receiveMessage, false);
          timer && clearTimeout(timer);
          timer = undefined;
          removeIFrame();
          var session = self.connection.session || (self.connection.session = {});
          session.ticket = event.data.ticket;
          succeeded && succeeded(self.connection);
        }
      }

      window.addEventListener('message', receiveMessage, false);
      createIFrame()
          .done(waitForLogin);

      function waitForLogin() {
        timer = setTimeout(enableInteactiveLogin, authenticationIFrameTimeout);
      }

      function enableInteactiveLogin() {
        if (dialog) {
          dialog.$el.removeClass('binf-hidden');
          suppressBlockingView();
        }
      }

      function reportError(error) {
        require(['csui/dialogs/modal.alert/modal.alert'
        ], function (ModalAlert) {
          ModalAlert.showError(error.message);
        });
        failed(error, self.connection);
      }
    }
  });

  return RedirectingFormAuthenticator;
});
