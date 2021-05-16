/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
    'csui/lib/underscore',
    'csui/lib/jquery',
    'csui/lib/marionette',
    'csui/utils/log',
    'csui/utils/base',
    'csui/utils/url',

    'conws/widgets/outlook/impl/utils/utility',
    'hbs!conws/widgets/outlook/impl/dialog/impl/logindialog',
    'i18n!conws/widgets/outlook/impl/nls/lang',
    'csui/behaviors/keyboard.navigation/tabkey.behavior',
    'csui/lib/binf/js/binf'
], function (module, _, $, Marionette, log, base, Url, WkspUtil, template, lang, TabKeyBehavior) {

    var Authenticator = Marionette.ItemView.extend({
        className: function() {
            var className = 'csui-alert binf-modal binf-fade';
            if (this.options.modalClass) {
                className += ' ' + this.options.modalClass;
            }
            return className;
        },

        template: template,

        ui: {
            errorMessage: '.errorMessagae',
            userName: '#userName',
            password: '#password'
        },

        triggers: {
            'click .csui-yes': 'click:yes'
        },

        events: {
            'shown.binf.modal': 'onShown',
            'hide.binf.modal': 'onHiding',
            'hidden.binf.modal': 'onHidden',
            'keyup' : 'processKey'
        },
        behaviors: {
            TabKeyBehavior: {
                behaviorClass: TabKeyBehavior,
                recursiveNavigation: true
            }
        },

        constructor: function LoginDialogView(options) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);
            var connector = WkspUtil.getConnector(); 
            this.connector = connector;

            var urlObj = new Url(connector.connection.url);
            this.hostName = urlObj.getHost();
            this.ticketCookieName = 'otcsTicket' + this.hostName.replace(/;/g, "_").replace(/=/g, "_").replace(/ /g, "_").replace(/,/g, "_").replace(/-/g, "_");
            this._deferred = $.Deferred();
            this.ssoDeferred = $.Deferred();

            this.errorMessage = '';

            this.llCookie = null;
            this.isSSOMessageReceived = false;

            this.beingAuthenticated = false;
        },

        templateHelpers: function() {
            return {
                signInButtonTitle: lang.signIn_button_Title,
                usernameLabel: lang.signIn_username,
                passwordLabel: lang.signIn_password,
                signInMessage: _.str.sformat(lang.signIn_message, this.hostName),
                signInTitle: lang.signIn_title
            }
        },

        show: function () {
            var self = this,
                promise = self._deferred.promise();

            WkspUtil.stopGlobalSpinner();

            if (self.beingAuthenticated){
                WkspUtil.writeTrace("Bing authenticated, so skip.");
                self._deferred.resolve(false);
                self.beingAuthenticated = false;
            } else{
                self.beingAuthenticated = true;
                WkspUtil.modalOpen();

                this.render();
                this.$el.attr('tabindex', 0);
                if (this.errorMessage) {
                    this.$('.errorMessage').html(this.errorMessage);
                }
                if (this.options.centerVertically) {
                    this.centerVertically();
                }

                this.$el.binf_modal('show');
                this.triggerMethod('show');
    
                promise.close = function () {
                    self.$el.binf_modal('hide');
                    return promise;
                };
            }

            return promise;
        },

        centerVertically: function() {
            var $clone;
            var top;
            $clone = this.$el.clone();
            $clone.css('display', 'block');
            $clone.appendTo($.fn.binf_modal.getDefaultContainer());
            top = Math.round(($clone.height() - $clone.find('.binf-modal-content').height()) / 2);
            top = top > 0 ? top : 0;

            $clone.remove();
            this.$el.find('.binf-modal-content').css("margin-top", top);
        },

        onShown: function() {
            this._deferred.notify({ state: 'shown' });
            this.$('#userName').focus();
        },

        onHiding: function() {
            this._deferred.notify({ state: 'hiding' });
        },

        onHidden: function (event) {
            WkspUtil.modalClose();
            this.destroy();
            if (this.options.callback) {
                this.options.callback(this._result);
            }
            if (this._result) {
                this._deferred.resolve(this._result);
            } else {
                this._deferred.reject(this._result);
            }
        },

        processKey: function(e) {
            if (e.which === 13) {
                this.onClickYes();
            }
        },

        onClickYes: function() {
            var self = this,
                userName = self.$('#userName').val().trim(),
                password = self.$('#password').val().trim(),
                messageArea = self.$('.errorMessage');

            messageArea.html('  ');
            if (!userName || !password) {
                messageArea.html(lang.signIn_required);
                return;
            }

            this.connector.connection.credentials = {
                username: userName,
                password: password,
                domain: ''
            };
            this.connector.confirmingReload = false;
            var authenticator = this.connector.authenticator,
                data = {
                    type: 'POST',
                    data: this.connector.connection.credentials,
                    contentType: "application/x-www-form-urlencoded"
                };

            authenticator.login(data,
                function(connection) {
                    WkspUtil.writeTrace("Authenticated based on username & password.");

                    if (typeof self.connector.connection.session === 'undefined') {
                        self.connector.connection.session = connection.session;
                    }

                    self.options.context.csUser = data.data.username;  
                    WkspUtil.setPersistentSetting(self.ticketCookieName, connection.session.ticket, connection.session.expries);
                    self.connector.timeoutProcessed = false;
                    self._result = true;
                    self.onHidden();
                },
                function(error) {
                    self.connector.timeoutProcessed = false;
                    self.$('.errorMessage').html(WkspUtil.getErrorMessage(error));
                });

        },

        _setTabFocus: function() {
            var tabElements = this.$('*[tabindex=0]'),
                lastIndex = tabElements.length - 1,
                tabShift = event.shiftKey,
                i = this._getStartIndex(lastIndex, tabShift, tabElements);
            if (lastIndex > -1) {
                var activeIndex = (this.activeIndex !== undefined) ? this.activeIndex :
                (tabShift ? 0 : lastIndex);
                do {
                    var $tabElem = $(tabElements[i]);
                    if (base.isVisibleInWindowViewport($tabElem)) {
                        this.activeIndex = i;
                        $tabElem.focus();
                        break;
                    }
                    if (tabShift) {
                        i = (i === 0) ? lastIndex : i - 1;
                    } else {
                        i = (i === lastIndex) ? 0 : i + 1;
                    }
                } while (i !== activeIndex);
            }
            return false;
        },
        _getStartIndex: function(lastIndex, tabShift) {
            var startIndex = 0,
                activeIndex = this.activeIndex;
            if (tabShift) {
                startIndex = lastIndex;
                if (activeIndex !== undefined && activeIndex > 0) {
                    startIndex = this.activeIndex - 1;
                }
            } else {
                if (activeIndex !== undefined && activeIndex < lastIndex) {
                    startIndex = activeIndex + 1;
                }
            }
            return startIndex;
        },

        authenticate: function(options) {
            var self = this,
                authPromise = self._deferred.promise(),
                connection = self.connector.connection,
                url = connection.url;
            var login = function(self, ticket) {
                var savedTicket = (typeof ticket === 'undefined') ? WkspUtil.getPersistentSetting(self.ticketCookieName) : ticket;
                if (savedTicket && !self.connector.timeoutProcessed) {
                    connection.session = { ticket: savedTicket };

                    var verifyPromise = self.verifyAuthentication(self, connection);
                    verifyPromise.done(function(result) {
                        self.connector.authenticator.authenticate(options,
                            function(data) {
                                WkspUtil.setPersistentSetting(self.ticketCookieName, self.connector.authenticator.connection.session.ticket, self.connector.authenticator.connection.session.expries);
                                self.connector.timeoutProcessed = false;
                                self._result = true;
                                self._deferred.resolve(self._result);
                            },
                            function(error) {
                                return self.show();
                            });
                    });
                    verifyPromise.fail(function(error) {
                        if (WkspUtil.SSOEnabled) {
                            self.getSSOTicket(self).then(
                                function(data) {
                                    self.connector.timeoutProcessed = false;
                                    if (data) {
                                        WkspUtil.writeTrace("Using existing ticket unsuccessful, renew ticket using SSO.");
                                        connection.session = { 'ticket': data };
                                        self.traceLoginUser(self, connection);
                                        self.connector.confirmingReload = false;
                                        WkspUtil.stopGlobalSpinner();
                                        WkspUtil.setPersistentSetting(self.ticketCookieName, connection.session.ticket, connection.session.expries);
                                        self._result = true;
                                        self._deferred.resolve(self._result);
                                        return self._deferred.promise();
                                    } else {
                                        self.show();
                                    }
                                },
                                function() {
                                    self.show();
                                });
                        } else {
                            self.show();
                        }
                    });

                } else {
                    return self.show();
                }
                return self._deferred.promise();
            };

            var existingTicket, ticketSource;
            if (connection.session && connection.session.ticket) {
                existingTicket = connection.session.ticket;
                ticketSource = "existing connection session";
            } else {
                existingTicket = WkspUtil.getPersistentSetting(self.ticketCookieName);
                ticketSource = "persistent setting"
            }

            if (!self.connector.timeoutProcessed && existingTicket) {
                WkspUtil.writeTrace("Trying to authenticate based on " + ticketSource);
                return login(self, existingTicket);
            }
            else if (WkspUtil.SSOEnabled) {
                WkspUtil.writeTrace("Trying SSO authentication");
                self.getSSOTicket(self).then(
                    function (data) {
                        self.connector.timeoutProcessed = false;
                        if (data) {
                            connection.session = { 'ticket': data };
                            self.traceLoginUser(self, connection);
                            self.connector.confirmingReload = false;
                            WkspUtil.stopGlobalSpinner();
                            WkspUtil.setPersistentSetting(self.ticketCookieName, connection.session.ticket, connection.session.expries);
                            self._result = true;
                            self._deferred.resolve(self._result);
                            return self._deferred.promise();
                        } else {
                            return login(self);
                        }
                    },
                    function () {
                        return login(self);
                    }
                );
            } else {
                return login(self);
            }

            return authPromise;
        },

        getSSOTicket: function(self) {
            if (!WkspUtil.getPersistentSetting("sso_error")) {
                setTimeout(function () {
                    WkspUtil.startGlobalSpinner(true);
                }, 500);

                self.isSSOMessageReceived = false;
                var originDomain = window.ServerOrigin;
                self.messageListener = WkspUtil.registerMessageListener(function(message) { //register the listener to wait for the LLCookie from the child page
                    if (!self.isSSOMessageReceived) {
                        WkspUtil.writeTrace('Received SSO message from: ' + originDomain);
                        self.isSSOMessageReceived = true;
                        WkspUtil.detachMessageListener(self.messageListener, originDomain); //unregister the listener
                        setTimeout(function() {
                            WkspUtil.stopGlobalSpinner();
                        }, 500);
                        self.ssoDeferred.resolve(message.data);
                    }
                }, originDomain);

                var dummyPara = "&tick=" + (new Date()).getTime(); //change the url so the iframe can refresh each time to get SSO message
                var url = window.ServerCgiScript + WkspUtil.SSOLoginURL + dummyPara + "#";
                var src = url + encodeURIComponent(document.location.href); //pass in the current domain
                if (WkspUtil.isSafeURL(src)) {
                    document.getElementById("ssoFrame").src = src; //load the SSO authentication page in a hidden iFrame
                    setTimeout(function() {
                        if (self.isSSOMessageReceived === false) {
                            WkspUtil.writeTrace('SSO timed out.');
                            self.errorMessage = ""; //lang.ssoTimeout; don't show error message when SSO timed out
                            document.getElementById("ssoFrame").src = "";
                            WkspUtil.detachMessageListener(self.messageListener);
                            self.ssoDeferred.reject();
                        }
                    }, 6000);

                    WkspUtil.writeTrace('SSO enabled and token being retrieved.');
                } else {
                    WkspUtil.writeTrace('Unsafe URL found: ' + src);
                    self.ssoDeferred.reject();
                }
            } else {
                self.ssoDeferred.reject();
            }
            return self.ssoDeferred.promise();
        },

        verifyAuthentication: function (self, connection) {
            var defer = $.Deferred();

            $.ajax({
                type: "GET",
                headers: {
                    'otcsticket': connection.session.ticket
                },
                url: connection.url + "/auth",
                success: function (data) {
                    self.options.context.csUser = data.data.name;
                    WkspUtil.writeTrace("Logged in as: " + data.data.name);
                    defer.resolve({ successful: true });
                },
                error: function (error) {
                    defer.reject(error);
                }
            });

            return defer.promise();
        },

        traceLoginUser: function(self, connection) {
            if (WkspUtil.TraceEnabled) {
                $.ajax({
                    type: "GET",
                    headers: {
                        "Content-Type": undefined,
                        'otcsticket': connection.session.ticket
                    },
                    url: connection.url + "/auth",
                    success: function(data) {
                        if (data && data.data && data.data.name) {
                            self.options.context.csUser = data.data.name;
                            WkspUtil.writeTrace("Logged in as: " + data.data.name);
                        } else {
                            WkspUtil.writeTrace("Cannot get login user.");
                        }
                    }
                });
            }
        }
    }); 

    return Authenticator;
});
