/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
    'csui/lib/underscore',
    'csui/lib/jquery',
    'csui/lib/marionette',
    'csui/utils/log',
    'csui/utils/base',
    'csui/utils/url',
    'csui/utils/requestauthenticator',

    'conws/widgets/outlook/impl/utils/utility',

    'hbs!conws/widgets/outlook/impl/dialog/impl/nameresolver', 

    'i18n!conws/widgets/outlook/impl/nls/lang',
    'csui/behaviors/keyboard.navigation/tabkey.behavior',
    'csui/lib/binf/js/binf'
], function (module, _, $, Marionette, log, base, Url, RequestAuthenticator, WkspUtil, template, lang, TabKeyBehavior) {

    var NameResolver = Marionette.ItemView.extend({
        className: function () {
            var className = 'csui-alert binf-modal binf-fade';
            if (this.options.modalClass) {
                className += ' ' + this.options.modalClass;
            }
            return className;
        },

        template: template,

        ui: {
            errorMessage: '.errorMessagae',
            fileName: '#fileName'
        },

        triggers: {
            'click .csui-yes': 'click:yes'
        },

        events: {
            'shown.binf.modal': 'onShown',
            'hide.binf.modal': 'onHiding',
            'hidden.binf.modal': 'onHidden',
            'keyup': 'processKey',
            "keyup #fileName": "emailNameTyping"
        },

        behaviors: {
            TabKeyBehavior: {
                behaviorClass: TabKeyBehavior,
                recursiveNavigation: true
            }
        },

        constructor: function NameResolver(options) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);
            options = this.options;
           
            this.connector = options.connector;
            this._deferred = $.Deferred();
            this.folderId = options.folderId;

            this.proposedName = WkspUtil.escapeNameToCreate(options.originalName);
            this.originalName = this.proposedName;
            this.folderName = options.folderName;
            
            this.url = Url.combine(this.connector.connection.url, 'validation/nodes/names');
            this.bodyFormat = '{"parent_id":%d,"names":["%s"]}';
        },

        templateHelpers: function () {
            return {
                validationMessage: this.originalName ? _.str.sformat(lang.validation_name_conflict, this.originalName, this.folderName) : lang.validation_no_subject,
                titleSaveEmail: lang.title_save_email,
                uniqueNameLabel: lang.save_nameNotUnique,
                titleOk: lang.title_ok,
                titleCancel: lang.title_cancel
            }
        },

        show: function () {
            WkspUtil.modalOpen();

            this.render();
            this.$el.attr('tabindex', 0);
            if (this.options.centerVertically) {
                this.centerVertically();
            }
            this.$el.binf_modal('show');
            this.triggerMethod('show');

            if (this.proposedName) {
                this.$('#fileName').val(this.proposedName);
            }
            this.templateHelpers();

            var promise = this._deferred.promise(),
                self = this;
            promise.close = function () {
                self.$el.binf_modal('hide');
                return promise;
            };

            return promise;
        },

        centerVertically: function () {
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

        onShown: function () {
            this._deferred.notify({ state: 'shown' });
            this.$('#fileName').focus();

            var nameInput = this.$('#fileName')[0];
            nameInput.style.height = "1px";
            nameInput.style.height = (nameInput.scrollHeight) + "px";
        },

        onHiding: function () {
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

        emailNameTyping: function(event) {
            var inputs = this.$("#fileName");
            if (inputs.length === 0) {
                return;
            }

            var nameInput = inputs[0];
            nameInput.style.height = "1px";
            nameInput.style.height = (nameInput.scrollHeight) + "px";
        },

        processKey: function (e) {
            if (e.which === 13) {
                this.onClickYes();
            }
        },

        onClickNo: function () {
            this._result = false;
        },

        onClickYes: function () {
            var self = this,
                fileName = WkspUtil.escapeNameToCreate(self.$('#fileName').val().trim()),
                messageArea = self.$('.errorMessage');

            messageArea.html('  ');

            if (!fileName) {
                messageArea.html(lang.save_enterName);
            } else {
                self.originalName = fileName;
                self.proposedName = fileName;
                self.validate()
                    .done(function (data) {
                        if (data.status) {
                            self.destroy();
                        }
                    });
            }
        },

        _setTabFocus: function () {
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
        _getStartIndex: function (lastIndex, tabShift) {
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

        validate: function(options) {
            var namePromise = this._deferred.promise(),
                self = this,
                url = self.url;

            if (self.proposedName) {
                WkspUtil.startGlobalSpinner();

                var verifyingPromise = self.verifyName(url, self.proposedName);
                verifyingPromise.done(function(data) {
                    if (data.results && data.results.length === 0) {
                        self._result = { success: true, name: self.proposedName };
                        self.onHidden();
                        self._deferred.resolve(self._result);
                    } else {
                        var firstNewName = self.rename(self.proposedName);
                        self.resolveName(firstNewName, function(newName) {
                            self.proposedName = newName;
                            WkspUtil.stopGlobalSpinner();
                            self.show();
                            self.onShown();
                        });
                    }

                });
                verifyingPromise.fail(function (error, errorText) {
                    WkspUtil.stopGlobalSpinner();
                    var errMsg = errorText;
                    if (error) {
                        errMsg = (error.responseJSON && error.responseJSON.error) ? error.responseJSON.error :
                            error.responseText ? error.responseText :
                            error.statusText ? error.statusText : JSON.stringify(error);
                    }
                    self.$('.errorMessage').html(errMsg);
                    self._result = { success: false , status: error.status, errorMessage: errMsg};
                    self._deferred.resolve(self._result);
                });
            } else {
                self.show();
            }

            return namePromise;
        },

        verifyName: function (url, nameToVerify) {
            var self = this,
                ticket = self.connector.connection.session.ticket;

            var body = _.str.sprintf(self.bodyFormat, self.folderId, WkspUtil.escapeNameToVerify(nameToVerify) + ".eml"); 

            return $.ajax({
                type: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    'OTCSTicket': ticket
                },
                url: url,
                contentType: false,
                data: {body: body}
            });
        },

        resolveName: function(nameToResolve, callback) {
            var self = this,
                url = self.url;

            var verifyingPromise = self.verifyName(url, nameToResolve);
            verifyingPromise.done(function (data) {
                if (data.results && data.results.length === 0) {
                    callback(nameToResolve);
                } else {
                    var newName = self.rename(nameToResolve);
                    self.resolveName(newName, callback);
                }

            });

        },

        rename: function(originalName) {
            if (!originalName) {
                return null;
            }

            var toRename = originalName.trim();
            if (toRename[toRename.length - 1] === ')') {
                var lastOpenParenthesis = toRename.lastIndexOf('(');
                if (lastOpenParenthesis > 0 && lastOpenParenthesis < toRename.length-2) {
                    var sequence = toRename.substring(lastOpenParenthesis + 1, toRename.length - 1),
                        newSequence = parseInt(sequence, 10);
                    if (sequence === String(newSequence)) {
                        newSequence++;
                        return toRename.substring(0, lastOpenParenthesis + 1) + newSequence + ")";
                    } 
                } 
            } 

            return toRename + " (1)";
        }
    });

    return NameResolver;

});
