/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'module',
    'csui/lib/jquery',
    'csui/utils/contexts/page/page.context',
    'csui/utils/contexts/factories/connector',
    'csui/utils/authenticators/request.authenticator',
    'csui/utils/log'
], function Utility(module, $, PageContext, ConnectorFactory, RequestAuthenticator, log) {

    return {
        v1ToV2: replaceV1ToV2,
        startGlobalSpinner: startGlobalSpinner,
        stopGlobalSpinner: stopGlobalSpinner,
        startLocalSpinner: startLocalSpinner,
        stopLocalSpinner: stopLocalSpinner,
        modalOpen: modalOpen,
        modalClose: modalClose,
        escapeNameToCreate: escapeNameToCreate,
        escapeNameToVerify: escapeNameToVerify,

        ToggleStatusExpand: "toggleIcon toggleExpand",
        ToggleStatusCollapse: "toggleIcon toggleCollapse",
        ToggleStatusEmpty: "toggleIcon toggleEmpty",

        writeTrace: traceOutput,
        setConnector: setConnector,
        getConnector: getConnector,
        pageSize: 5,
        TraceEnabled: typeof(Storage) === 'undefined' ? false : localStorage.getItem('outlookTraceEnabled') ? localStorage.getItem('outlookTraceEnabled') === 'true' : false, 
        SSOEnabled: typeof(Storage) === 'undefined' ? false : localStorage.getItem('outlookAddinSSO') ? localStorage.getItem('outlookAddinSSO') === 'true' : false,
        ShowSearchFormSelection: true,
        DisplayedSearchForms: [],
        emailSavingConfig: {
            allowExpandWorkspace: true,
            onlySaveToEmailFolder: false,
            preConfigFolderToSave: {
                enabled: false,
                saveToFirstEmailFolder:  false,
                specificFolderName: ""
            }
        },
        setConfig: setConfig,

        messageListeners: {}, //one listener per source origin
        registerMessageListener: registerMessageListener,
        detachMessageListener: detachMessageListener,

        SSOLoginURL: '?func=outlookaddin.login',

        isSafeURL: isSafeURL,
        getPersistentSetting: getPersistentSetting,
        setPersistentSetting: setPersistentSetting,
        getCookie: getCookie,
        setCookie: setCookie,

        getCurrentTopDomain: getCurrentTopDomain,

        getErrorMessage: getErrorMessage,

        getSuggestedWkspFilters: getSuggestedWkspFilters,
        getSuggestedWkspEmailSearchConfig: getSuggestedWkspEmailSearchConfig,

        SuggestedWkspsView: null,

        emailProperties: {
            "project": { value: "project", displayName: "Project" },
            "from": { value: "from", displayName: "from" },
            "to": { value: "to", displayName: "To" }
        },

        disableSimpleSearch: disableSimpleSearch,
        collapsibleClicked: collapsibleClicked,
        SelectedWkspTypeId: -100,
        WkspSearchPerformed: false,

        SearchButtonHeight: 32,
        SearchFormBottomPadding: 88,
        TraceAreaHeight: 219,

        PreSaveSection: "standardSections",
        ScorllPositionBeforeSaving: -1,  // -1 means the scroll position not affected by saving panel

        uiHide: uiHide,
        uiShow: uiShow,

        ConflictHighlighted: false,
        SavingSubmitted: false,
        EmailChangedAfterSaving: false
    }

    function replaceV1ToV2(url) {
        return url.replace("/v1", "/v2/");
    }

    function startGlobalSpinner(force) {
        var spinner = $('#blockingSpinner'),
            top,
            scrollY = window.scrollY ? window.scrollY : document.documentElement.scrollTop;
        top = scrollY;
        var marginCss = top > 0 ? ";margin-top: " + top + "px" : "";

        spinner.css("cssText", "display:inline-block !important; visibility:visible !important" + marginCss);
        $('body').css('pointer-events', 'none');
        if (!force) {
            setTimeout(function() {
                var connector = getConnector();
                if (connector.confirmingReload) {
                    stopGlobalSpinner();
                }
            }, 500);
        }
    }

    function stopGlobalSpinner() {
        var spinner = $('#blockingSpinner');
        spinner.css("cssText", "display:none; visibility:hidden");
        $('body').css('pointer-events', '');
    }

    function startLocalSpinner(spinnerId) {
        var id = '#' + spinnerId;
        var spinner = $(id);

        spinner.css("cssText", "display:inline-block !important; visibility:visible !important");
    }

    function stopLocalSpinner(spinnerId) {
        var id = '#' + spinnerId;
        var spinner = $(id);
        spinner.css("cssText", "display:none; visibility:hidden");
    }

    function modalOpen() {
        $('body').addClass("binf-modal-open");
    }

    function modalClose() {
        $('body').removeClass("binf-modal-open");
    }

    function setConnector(connector) {
        window.contextConnector = connector;
    }

    function getConnector() {
        if (window.contextConnector == null) {
            var context = new PageContext(),
                options = {
                    authenticator: new RequestAuthenticator({})
                };

            var connector = context.getObject(ConnectorFactory, options);
            window.contextConnector = connector;
            return connector;
        } else {
            return window.contextConnector;
        }
    }

    function escapeNameToCreate(originalString) {
        var string = originalString.replace(/:/g, '_').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\u2028/g, '\\u2028') // Per Ecma-262 7.3 + 7.8.4
            .replace(/\u2029/g, '\\u2029');
        return string;
    }

    function escapeNameToVerify(originalString) {
        var string = originalString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        return string;
    }

    function traceOutput(message) {
        var self = this;
        if (!self.TraceEnabled) {
            return;
        }
        log.info(message);
    }
    function registerMessageListener(callback, sourceOrigin) {
        var self = this;

        if (typeof window.postMessage !== 'undefined') {
            if (callback && typeof sourceOrigin === 'string' && sourceOrigin) {
                self.messageListeners[sourceOrigin] = callback;
                var attachedCallback = function(e) {
                    if (e.origin) {
                        for (var source in self.messageListeners) {
                            if (self.messageListeners.hasOwnProperty(source)) {
                                if (e.origin.toLowerCase() === source.toLowerCase()) {
                                    self.writeTrace('Found matched source origin "' + e.origin);
                                    self.messageListeners[source](e);
                                }
                            }
                        }
                    }
                    return false;
                };
                if (typeof window.addEventListener !== 'undefined') {
                    window.addEventListener('message', attachedCallback, false);
                } else {
                    window.attachEvent('onmessage', attachedCallback);
                }
                self.writeTrace('Attached event listener for "' + sourceOrigin + '"');
                return attachedCallback;
            }
        } else {
            this.writeTrace('Cannot register message listener, your browser does not support window.postMessage!');
        }
        return null;
    }
    function detachMessageListener(attachedCallback, sourceOrigin) {
        if (typeof window.postMessage !== 'undefined') {

            if (typeof sourceOrigin === 'undefined') { //remove all sources
                for (var source in this.messageListeners) {
                    if (this.messageListeners.hasOwnProperty(source)) {
                        delete this.messageListeners[source];
                        this.writeTrace('Removed event source for "' + source + '"');
                    }
                }
            } else { //remove specific source
                if (this.messageListeners.hasOwnProperty(sourceOrigin)) {
                    delete this.messageListeners[sourceOrigin];
                    this.writeTrace('Removed event source for "' + sourceOrigin + '"');
                }
            }

            for (var listener in this.messageListeners) { //check if any source remains
                if (this.messageListeners.hasOwnProperty(listener)) {
                    return; //do not detach the event listener if any source exists.
                }
            }

            if (typeof window.addEventListener !== 'undefined') {
                window.removeEventListener('message', attachedCallback, false);
            } else {
                window.detachEvent('onmessage', attachedCallback);
            }
            this.writeTrace('Detached message event listener.');
        } else {
            this.writeTrace('Cannot detach message listener, your browser does not support window.postMessage!');
        }
    }

    function getPersistentSetting(name) {
        var setting;
        if (window.SettingStorage) {
            setting = window.SettingStorage.getItem(name);
        }
        if (setting) {
            return setting;
        } else {
            return this.getCookie(name);
        }
    }

    function setPersistentSetting(name, value, expire, domain) {
        if (window.SettingStorage) {
            window.SettingStorage.setItem(name, value);
        } else {
            this.setCookie(name, value, expire, domain);
        }
    }

    function getCookie(c_name) {
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start === -1) {
            c_start = c_value.indexOf(c_name + "=");
        }
        if (c_start === -1) {
            c_value = null;
        } else {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end === -1) {
                c_end = c_value.length;
            }
            c_value = decodeURI(c_value.substring(c_start, c_end));
        }
        return c_value;
    }

    function setCookie(c_name, value, expire, domain) {
        var c_value = encodeURI(value);
        if (typeof expire !== 'undefined' && expire) {
            if ((new Date(expire)).toString() !== 'Invalid Date') {
                c_value += "; expires=" + (new Date(expire)).toUTCString();
            }
        }
        if (typeof domain === 'undefined' || !domain) {
            domain = this.getCurrentTopDomain();
        }
        c_value += ("; domain=." + domain + ";path=/");

        document.cookie = c_name + "=" + c_value;
    }

    function getCurrentTopDomain() {
        var i,
            h,
            weird_cookie = 'weird_get_top_level_domain=cookie',
            hostname = document.location.hostname.split('.');
        for (i = hostname.length - 1; i >= 0; i--) {
            h = hostname.slice(i).join('.');
            document.cookie = weird_cookie + ';domain=.' + h + ';';
            if (document.cookie.indexOf(weird_cookie) > -1) {
                document.cookie = weird_cookie.split('=')[0] + '=;domain=.' + h + ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                return h;
            }
        }
    }

    function isSafeURL(urlString) {
        if (urlString) {
            var urlStr = urlString.toLowerCase();
            if (urlStr.indexOf('javascript:') > -1
                || urlStr.indexOf('<') > -1) {
                this.writeTrace('URL contains unsafe string: ' + urlString);
                return false;
            }
            return true;
        }
        return false;
    }

    function getSuggestedWkspFilters(emailItem, config) {
        var filterConfig = config.filter;

        var xecmRule = window.xECMRule;
        if (typeof xecmRule !== 'undefined'){
            filterConfig.rules.push(xecmRule);
        }

        var filters = [];

        if (emailItem != null && filterConfig.rules != null && filterConfig.rules.length > 0) {
            for (var i = 0; i < filterConfig.rules.length; i++) {
                var rule = filterConfig.rules[i],
                    ruleMatch = false;

                if (!rule.enabled || rule.wkspTypeId === 0) {
                    continue;
                }

                if (rule.onlyGroup1 == null) {
                    rule.onlyGroup1 = true;
                }
                if (rule.weight == null || rule.weight === -1) {
                    rule.weight = filterConfig.weight;
                }

                var processingString = "";
                switch (rule.property) {
                case "subject":
                    processingString = emailItem.subject;
                    break;
                case "sender":
                case "from":
                    processingString = emailItem.sender.displayName + "," + emailItem.sender.emailAddress;
                    break;
                case "to":
                    processingString = emailItem.to.map(function(elem) { return elem.displayName + "," + elem.emailAddress }).join(";");
                    break;
                case "cc":
                    processingString = emailItem.cc.map(function(elem) { return elem.displayName + "," + elem.emailAddress }).join(";");
                    break;
                case "recipient":
                    var recipients = emailItem.to.map(function(elem) { return elem.displayName + "," + elem.emailAddress });
                    recipients = recipients.concat(emailItem.cc.map(function(elem) { return elem.displayName + "," + elem.emailAddress }));
                    processingString = recipients.join(";");
                    break;
                default:
                }
                if (rule.method === "RegEx") {
                    try {
                        var matchPatt = new RegExp(rule.match, "i");
                        ruleMatch = matchPatt.test(processingString);
                    } catch (e) {
                        ruleMatch = false;
                    }
                } else {
                    var processingStringLower = processingString.toLocaleLowerCase(),
                        matchLower = rule.match.toLocaleLowerCase();
                    ruleMatch = processingStringLower.indexOf(matchLower) !== -1;
                }

                if (ruleMatch) {
                    try {
                        var retrievePatt = new RegExp(rule.retrieve, "ig");

                        var retrieves = retrievePatt.exec(processingString);
                        if (rule.retrieveMethod === "capturingGroup"){
                            if (retrieves && retrieves.length > 2){
                                filters.push({ typeName: retrieves[rule.wkspTypeGroup], 
                                               typeId: -999, //a non existing wksp type ID
                                               filterName: retrieves[rule.wkspNameGroup], 
                                               weight: rule.weight });
                            }
                        } else if (retrieves && retrieves.length > 0) {
                            var term = retrieves.length > 1 ? retrieves[1] : retrieves[0];
                            filters.push({ typeName: "", typeId: rule.wkspTypeId, filterName: term, weight: rule.weight });
                        }
                    } catch (e) {
                    }
                }
            }
        }
        return {
            suggestedWeight: filterConfig.weight,
            rules: filters
        };
    }

    function getSuggestedWkspEmailSearchConfig(emailItem, config) {
        var searchTerm = [];
        var searchConfig = config.search;

        if (searchConfig.weight == null) {
            searchConfig.weight = 1;
        }
        if (emailItem != null) {
            var currentUserAddress = window.currentUser,
                senderAddress = emailItem.sender.emailAddress;

            if (searchConfig.searchSender) {
                var noCurrentUserAsSender = searchConfig.noCurrentUserAsSender != null ? searchConfig.noCurrentUserAsSender : true;
                if (! noCurrentUserAsSender || currentUserAddress !== senderAddress) {
                    searchTerm.push({ region: "OTEmailSenderAddress", searchTerm: senderAddress + "," }); // has to add ',' to make the REST search working
                }
            }

            if (searchConfig.searchRecipient) {
                var noCurrentUserInRecipient = searchConfig.noCurrentUserInRecipient != null ? searchConfig.noCurrentUserInRecipient : true;
                var tos = emailItem.to.map(function(elem) { return noCurrentUserInRecipient && elem.emailAddress === currentUserAddress ? "" : elem.emailAddress; });
                var ccs = emailItem.cc.map(function(elem) { return noCurrentUserInRecipient && elem.emailAddress === currentUserAddress ? "" : elem.emailAddress; });

                var allRecipients = tos.concat(ccs);
                var recipients = allRecipients.reduce(function(a, b) {
                    if (a.indexOf(b) < 0) {
                        a.push(b);
                    }
                    return a;
                }, []);
                for (var i = recipients.length - 1; i >= 0; i--) {
                    if (!recipients[i]) {
                        recipients.splice(i, 1);
                    }
                }

                if (recipients.length > 0) {
                    var term = recipients.join(",") + ","; // has to add ',' in case of there is only one address
                    searchTerm.push({ region: "OTEmailRecipientAddress", searchTerm: term });
                }
            }
        }

        return {
            sort: searchConfig.sort,
            weight: searchConfig.weight,
            searchTerm: searchTerm
        };
    }

    function getErrorMessage(error) {
        if (typeof(error) === "string") {
            return error;
        }

        var errMsg = (error.responseJSON && error.responseJSON.error) ? error.responseJSON.error :
            error.message ? error.message :
            error.responseText ? error.responseText :
            error.statusText ? error.statusText : JSON.stringify(error);
        return errMsg;
    }

    function disableSimpleSearch() {
        $('#csui-custom-search-form-submit').addClass("binf-disabled csui-search-form-submit-disabled");
    }

    function setConfig(config, csUserLoginName) {
        this.pageSize = config.pageSize;
        
        var loginName = csUserLoginName ? csUserLoginName.toUpperCase() : "";

        if (!this.TraceEnabled){
            this.TraceAreaHeight = 0;
        }

        var traceEnabled = config.trace.enabled && (config.trace.userName === "" || config.trace.userName.toUpperCase() === loginName);
        this.TraceEnabled = traceEnabled;
        if (typeof (Storage) !== 'undefined') {
            localStorage.setItem('outlookTraceEnabled',traceEnabled.toString());
        }

        this.SSOEnabled = config.sso;
        if (typeof (Storage) !== 'undefined') {
            localStorage.setItem('outlookAddinSSO', config.sso.toString());
        }
        this.ShowSearchFormSelection = config.searchForm.enabled;
        this.DisplayedSearchForms = []; // bypass the filtering here. The search forms returned from the REST API already has this logic
        this.emailSavingConfig = {
            allowExpandWorkspace: config.save.expand,
            onlySaveToEmailFolder: config.save.emailFolderOnly,
            preConfigFolderToSave: {
                enabled: config.save.preConfig.enabled,
                saveToFirstEmailFolder: config.save.preConfig.firstEmailFolder,
                specificFolderName: config.save.preConfig.specificName
            }
        };
    }

    function collapsibleClicked(section){
        var displayArea = $("#" + section + "Section");

        if (displayArea.length === 0){
            return;
        }

        var displayStyle = displayArea[0].style.display;
        if (displayStyle === "none"){
            displayArea.css("display", "block");
        } else{
            displayArea.css("display", "none");
        }

        var collapsibleIcon = $("#" + section + "ToggleIcon");
        collapsibleIcon.toggleClass("sectionExpended");
    }

    function uiHide(uiId, uiClass){
        if (uiId){
            $("#" + uiId).addClass("hiddenArea");
        }
        if (uiClass){
            $("." + uiId).addClass("hiddenArea");
        }
    }

    function uiShow(uiId, uiClass){
        if (uiId){
            $("#" + uiId).removeClass("hiddenArea");
        }
        if (uiClass){
            $("." + uiId).removeClass("hiddenArea");
        }
    }
});