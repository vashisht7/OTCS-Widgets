/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore',
    'csui/lib/jquery',
    'csui/utils/url',
    'csui/utils/contexts/page/page.context',
    'csui/utils/contexts/factories/connector',
    'csui/dialogs/modal.alert/modal.alert',
    'conws/widgets/outlook/impl/utils/emailservice',
    'conws/widgets/outlook/impl/dialog/authenticator',
    'conws/widgets/outlook/impl/utils/utility',
    'conws/widgets/outlook/impl/dialog/nameresolver',
    'i18n!conws/widgets/outlook/impl/nls/lang',
    'i18n!csui/utils/impl/nls/lang'
], function CsService(_, $, Url, PageContext, ConnectorFactory, ModalAlert, EmailService, Authenticator, WkspUtil, NameResolver, lang, csuiLang) {

    return {
        save: save,
        confirmSaving: confirmSaving,
        reauthenticate: reauthenticate,
        getSuggestedWksps: getSuggestedWksps,
        filterWksps: filterWksps,
        searchWksps: searchWksps,
        getWkspForEmail: getWkspForEmail,
        getSuggestedWkspConfig: getSuggestedWkspConfig,
        getSimpleSearchQueries: getSimpleSearchQueries,
        getAddinConfig: getAddinConfig,
        resolveNames: resolveNames,
        resolveName: resolveName,
        verifyName: verifyName,
        prepareNames: prepareNames,
        nameExists: nameExists
} 
  
    function save(connector, folderId, emailName, attachments, metadataValues){
        var self = this,
            emailItem = window.CurrentEmailItem,
            saveEmail = emailName ? true : false,
            attachmentNames = "",
            attachmentIds = "",
            attachmentTypes = "",
            saveAttachment = false,
            metadataValueString = metadataValues === undefined ?  "" : JSON.stringify(metadataValues),
            defer = $.Deferred();

            if (attachments != null && attachments.length > 0){
                saveAttachment = true;
                for(var i = 0; i < attachments.length; i++){
                    attachmentNames += i === 0 ? '"' + attachments[i].name + '"' : ',"' + attachments[i].name + '"';
                    attachmentIds += i === 0 ? '"' + attachments[i].id + '"' : ',"' + attachments[i].id + '"';
                    attachmentTypes += i === 0 ? '"' + attachments[i].mimeType + '"' : ',"' + attachments[i].mimeType + '"';
                }
            }
            attachmentNames = "{" + attachmentNames + "}";
            attachmentIds = "{" + attachmentIds + "}";
            attachmentTypes = "{" + attachmentTypes + "}";

      
            var saveSuccessful = "";
            if (saveEmail && saveAttachment){
                saveSuccessful = lang.save_successful_all;
            } else if (saveEmail){
                saveSuccessful = lang.save_successful_email;
            } else if (saveAttachment){
                if (attachments.length > 1){
                    saveSuccessful = lang.save_successful_attachments;
                } else {
                    saveSuccessful = lang.save_successful_attachment;
                }
            }

            WkspUtil.writeTrace("Ready to perform: saving email = " + saveEmail + ", saving attachment(s) = " + saveAttachment);

            if (typeof window.Office === "undefined" || typeof window.Office.context === "undefined" ||
                typeof window.Office.context.mailbox === "undefined"){
                    defer.reject({errorMsg: lang.warning_no_outlook_context});
                    WkspUtil.writeTrace("Could not save email because there is no Outlook context.");

                    return defer.promise();
            }

            window.Office.context.mailbox.getCallbackTokenAsync(function(tokenResult) {
                if (tokenResult.status === 'succeeded') {
                    var dummyEmailContent = "From: Demo <demo@demo.com>\nTo: Demo <demo@demo.com>\nSubject: Content placeholder email\nDate: 1 Jul 2017";
                    var dummyBlob = new Blob([dummyEmailContent], { type: 'message/rfc822' });
                    var formData = new FormData();

                    formData.append("parent_id", folderId);
                    formData.append("ewsUrl", window.Office.context.mailbox.ewsUrl);
                    formData.append("emailId", emailItem.itemId);
                    formData.append("accessToken", tokenResult.value);
                    formData.append("emailName", emailName);
                    formData.append("file", dummyBlob);
                    formData.append("body", metadataValueString);
                    if (saveAttachment){
                        formData.append("attachmentNames", attachmentNames);
                        formData.append("attachmentIds", attachmentIds);
                        formData.append("attachmentTypes", attachmentTypes);
                    }

                    WkspUtil.writeTrace("Calling CS REST to retrieve email content and attachment to save ...");
                    $.ajax({
                        type: "POST",
                        headers: {
                            "Content-Type": undefined,
                            'otcsticket': connector.connection.session.ticket
                        },
                        url: WkspUtil.v1ToV2(connector.connection.url) + "businessworkspaces/outlookaddin/email",
                        contentType: false,
                        data: formData,
                        processData: false,
                        success: function (data) {
                            var successful = false,
                                csRestMsg = "";
                            if (data.results != null && data.results.length > 0) {
                                successful = data.results[0].resultCode === "Success";
                                csRestMsg = data.results[0].message;
                            } else {
                                csRestMsg = "OutlookAddinRestFailed";
                            }

                            if (successful) {
                                defer.resolve({result: saveSuccessful});
                                WkspUtil.writeTrace("Saving the email/attachment to Content Server completed.");
                            } else {
                                defer.reject({errorMsg: _.str.sformat(lang.error_save_email, csRestMsg)});
                                WkspUtil.writeTrace("Saving the email/attachment to Content Server failed with message: " + csRestMsg);
                            }
                        },
                        error: function (error, errorText, obj) {
                            var errMsg = errorText;
                            if (error) {
                                errMsg = (error.responseJSON && error.responseJSON.error) ? error.responseJSON.error :
                                    error.responseText ? error.responseText :
                                        error.statusText ? error.statusText : JSON.stringify(error);
                            }
                            if (error.status === 401) {
                                self.reauthenticate(lang.warning_session_expired);
                            } else {
                                defer.reject({errorMsg: _.str.sformat(lang.error_save_email, errMsg)});
                                WkspUtil.writeTrace("Saving the email to Content Server failed with message: " + errMsg);
                            }
                        }
                    });
                } else {
                    defer.reject({errorMsg: lang.error_retrieve_token});
                    WkspUtil.writeTrace("Retrieving EWS access token failed.");
                }
            });
        return defer.promise();
    }

    function confirmSaving (needConfirmation, folderName) {
        if (!needConfirmation) {
            return $.Deferred().resolve(true);
        } else {
            WkspUtil.stopGlobalSpinner();
            return ModalAlert.confirmQuestion(_.str.sformat(lang.info_confirm_saving, folderName),
                lang.title_save_email, { buttons: ModalAlert.buttons.OkCancel });
        }
    }

    function reauthenticate (message) {
        var conn = WkspUtil.getConnector();
        if (!conn.timeoutProcessed){
            conn.timeoutProcessed = true;
            WkspUtil.stopGlobalSpinner();
            ModalAlert.showWarning(csuiLang.AuthenticationFailureDialogText, message, {
                buttons: ModalAlert.buttons.Ok
            })
                .always(function () {
                    var context = new PageContext(),
                        connector = conn;

                    context.connector = connector;
                    var authenticator = new Authenticator({ context: context, centerVertically: true });
                    authenticator.authenticate()
                        .done(function(result){
                            authenticator.beingAuthenticated = false;
                        });
                });
        }
    }

    function getSuggestedWksps(connector, emailItem, config) {
        var self = this,
            processes = [],
            defer = $.Deferred(),
            i = 0;
        var dummyEmailItem = null;
        var email = emailItem != null ? emailItem : dummyEmailItem;

        var filterConfig = WkspUtil.getSuggestedWkspFilters(email, config);
        if (filterConfig != null && filterConfig.rules.length > 0) {
            for (i = 0; i < filterConfig.rules.length; i++) {
                var rule = filterConfig.rules[i];
                var name = rule.filterName.trim();
                if (name) {
                    processes.push(self.filterWksps(connector, rule.typeId, rule.typeName.trim(), name, rule.weight));
                }
            }
        }

        var emailSearchConfig = WkspUtil.getSuggestedWkspEmailSearchConfig(email, config);
        if (emailSearchConfig != null && emailSearchConfig.searchTerm.length > 0) {
            for (i = 0; i < emailSearchConfig.searchTerm.length; i++) {
                var term = emailSearchConfig.searchTerm[i];
                if (term.region != null && term.searchTerm != null) {
                    processes.push(self.searchWksps(connector, term.region, term.searchTerm, emailSearchConfig.sort, emailSearchConfig.weight));
                }
            }
        }

        if (processes.length === 0) {
            setTimeout(function () {
                defer.resolve({ results: [] });
            });
        } else {
            $.whenAll(processes)
                .then(function (values) {
                    var collection = [];
                    var errors = [];
                    for (i = 0; i < values.length; i++) {
                        if (values[i].error != null) {
                            errors.push(values[i].error);
                        } else {
                            Array.prototype.push.apply(collection, (values[i].results));
                        }
                    }
                    var wksps = [];
                    for (i = 0; i < collection.length; i++) {
                        var wkspProp = collection[i].data.properties,
                            foundDuplicate = false;
                        for (var k = 0; k < wksps.length; k++) {
                            if (wkspProp.id === wksps[k].data.properties.id) {
                                wksps[k].data.properties.suggestedWeight += wkspProp.suggestedWeight;

                                var kDate = new Date(wksps[k].data.properties.modifyDate),
                                    iDate = new Date(wkspProp.modifyDate);
                                if (iDate > kDate) {
                                    wksps[k].data.properties.modifyDate = iDate;
                                }

                                foundDuplicate = true;
                                break;
                            }
                        }
                        if (foundDuplicate) {
                            continue;
                        } else {
                            wksps.push(collection[i]);
                        }
                    }
                    var compareWeight = function(a, b) {
                        if (a.data.properties.suggestedWeight > b.data.properties.suggestedWeight) {
                            return -1;
                        }
                        if (a.data.properties.suggestedWeight < b.data.properties.suggestedWeight) {
                            return 1;
                        }
                        var aDate = new Date(a.data.properties.modifyDate),
                            bDate = new Date(b.data.properties.modifyDate);
                        if (aDate > bDate) {
                            return -1;
                        } else {
                            return 1;
                        }
                    };
                    wksps.sort(compareWeight);
                    var maxNumber = config.general != null && config.general.count != null ? config.general.count : 5;
                    var suggestWksps = wksps.slice(0, maxNumber);
                    var displayError = false;

                    if (errors.length > 0) {
                        for (var j = 0; j < errors.length; j++) {
                            WkspUtil.writeTrace("Error reported in retrieving suggested workspace: " + errors[j]);
                        }
                    }

                    var reportedErrors = displayError ? errors : [];

                    defer.resolve({ results: suggestWksps, errors: reportedErrors });
                }, function (error) {
                    defer.reject(WkspUtil.getErrorMessage(error));
                });
        }

        return defer.promise();
    }

    function filterWksps(connector, wkspType, wkspTypeName, wkspName, weight) {
        var defer = $.Deferred(),
            queryString;

        if (wkspType !== -999){
            WkspUtil.writeTrace("Suggested Wksp: filter wksps with typeID '" + wkspType + "' and name contains '" + wkspName + "'");
            queryString = 'where_workspace_type_id=' + wkspType + '&' + 'where_name=contains_' + encodeURIComponent(wkspName);
        } else {
            WkspUtil.writeTrace("Suggested Wksp: filter wksps with type name '" + wkspTypeName + "' and name contains '" + wkspName + "'");
            queryString = 'where_workspace_type_name=' + encodeURIComponent(wkspTypeName) + '&' + 'where_name=contains_' + encodeURIComponent(wkspName);
        }
        
        var url = Url.combine(WkspUtil.v1ToV2(connector.connection.url), 'businessworkspaces?expanded_view=true&' + queryString);
        $.ajax({
            url: url,
            type: "GET",
            headers: {
                'OTCSTicket': connector.connection.session.ticket
            },
            success: function (data) {
                var wksps = [];
                if (data != null && data.results != null && data.results.length > 0) {
                    for (var i = 0; i < data.results.length; i++) {
                        var props = data.results[i].data.properties;
                        wksps.push({ data: { properties: { id: props.id, name: props.name, size: props.size, modifyDate: props.modify_date, suggestedWeight: weight, type: 848, container: true } } });
                    }
                }
                defer.resolve({ results: wksps });
            },
            error: function (error) {
                defer.resolve({ error: "Filter: " + WkspUtil.getErrorMessage(error) });
            }
        });

        return defer.promise();
    }

    function searchWksps(connector, region, searchTerm, sortBy, weight) {
        var self = this,
            defer = $.Deferred();

        WkspUtil.writeTrace("Suggested Wksp: search emails with region '" + region + "' contains '" + searchTerm + "'");
        var queryString = 'search?where1=%22' + region + '%22:(*' + encodeURIComponent(searchTerm) + '*)&limit=50';
        if (sortBy !== "relevance") {
            queryString += "&sort=desc_OTObjectDate";
        }
        var url = Url.combine(WkspUtil.v1ToV2(connector.connection.url), queryString);
        $.ajax({
            url: url,
            type: "GET",
            headers: {
                'OTCSTicket': connector.connection.session.ticket
            },
            success: function (data) {
                var processes = [],
                    wksps = [],
                    i = 0;
                if (data != null && data.results != null && data.results.length > 0) {
                    for (i = 0; i < data.results.length; i++) {
                        var props = data.results[i].data.properties;
                        processes.push(self.getWkspForEmail(connector, props.id, props.modify_date,  weight));
                    }


                    $.whenAll(processes)
                        .then(function(values) {
                            for (i = 0; i < values.length; i++) {
                                var value = values[i];
                                if (value != null) {
                                    wksps.push(value);
                                }
                            }
                            defer.resolve({ results: wksps });
                        }, function(error) {
                            defer.reject(WkspUtil.getErrorMessage(error));
                        });
                } else {
                    defer.resolve({ results: wksps });
                }
            },
            error: function (error) {
                defer.resolve({ error: "Search: " + WkspUtil.getErrorMessage(error) });
            }
        });

        return defer.promise();
    }

    function getWkspForEmail(connector, wkspId, modifyDate, weight) {
        var defer = $.Deferred(),
            url = Url.combine(connector.connection.url, "nodes/" + wkspId + "/ancestors");
        $.ajax({
            url: url,
            type: "GET",
            headers: {
                'OTCSTicket': connector.connection.session.ticket
            },
            success: function (data) {
                var wksp = null;
                if (data != null && data.ancestors != null && data.ancestors.length >= 2) {
                    for (var i = data.ancestors.length - 2; i >= 0; i--) {
                        var node = data.ancestors[i];
                        if (node.type === 848) {
                            wksp = { data: { properties: { id: node.id, name: node.name, size: 1, modifyDate: modifyDate, suggestedWeight: weight, type: 848, container: true } } }; // size > 0 meaning has children.
                            break;
                        }
                    }
                    defer.resolve(wksp);
                } else {
                    defer.resolve(null);
                }
            },
            error: function(error) {
                defer.reject(WkspUtil.getErrorMessage(error));
            }
        });

        return defer.promise();
    }

    function getSuggestedWkspConfig(connector) {
        var defer = $.Deferred(),
            url = Url.combine(WkspUtil.v1ToV2(connector.connection.url), "businessworkspaces/outlookaddin/suggestedworkspacesconfig");
        $.ajax({
            url: url,
            type: "GET",
            headers: {
                'OTCSTicket': connector.connection.session.ticket
            },
            success: function (data) {
                if (data != null && data.results != null && data.results.resultCode === "Success") {
                    defer.resolve(data.results.config);
                } else if (data == null || data.results == null) {
                    defer.reject(_.str.sformat(lang.error_retrieve_suggestedConfig, "Null Configuration"));
                } else {
                    defer.reject(_.str.sformat(lang.error_retrieve_suggestedConfig, data.results.message));
                }
            },
            error: function (error) {
                defer.reject(WkspUtil.getErrorMessage(error));
            }
        });

        return defer.promise();
    }

    function getSimpleSearchQueries(connector) {
        var defer = $.Deferred(),
            url = Url.combine(WkspUtil.v1ToV2(connector.connection.url), "businessworkspaces/outlookaddin/simplesearchqueries");
        $.ajax({
            url: url,
            type: "GET",
            headers: {
                'OTCSTicket': connector.connection.session.ticket
            },
            success: function (data) {
                if (data != null && data.results != null && data.results.resultCode === "Success") {
                    defer.resolve(data.results.menuEntries);
                } else if (data == null || data.results == null) {
                    defer.reject(_.str.sformat(lang.error_retrieve_searchQueries, "Null Configuration"));
                } else {
                    defer.reject(_.str.sformat(lang.error_retrieve_searchQueries, data.results.message));
                }
            },
            error: function (error) {
                defer.reject(WkspUtil.getErrorMessage(error));
            }
        });

        return defer.promise();
    }

    function getAddinConfig(connector) {
        var defer = $.Deferred(),
            url = Url.combine(WkspUtil.v1ToV2(connector.connection.url), "businessworkspaces/outlookaddin/config");
        $.ajax({
            url: url,
            type: "GET",
            headers: {
                'OTCSTicket': connector.connection.session.ticket
            },
            success: function (data) {
                if (data != null && data.results != null && data.results.resultCode === "Success") {
                    defer.resolve(data.results.config);
                } else if (data == null || data.results == null) {
                    defer.reject(_.str.sformat(lang.error_retrieve_config, "Null Configuration"));
                } else {
                    defer.reject(_.str.sformat(lang.error_retrieve_config, data.results.message));
                }
            },
            error: function (error) {
                defer.reject(_.str.sformat(lang.error_retrieve_config, WkspUtil.getErrorMessage(error)));
            }
        });

        return defer.promise();
    }

    function resolveNames(connector, folderId, emailTitleInfo, attachmentInfo){
        var self = this,
            namesToResolve = [],
            resolvedNames = [],
            defer = $.Deferred();

        var url = Url.combine(connector.connection.url, 'validation/nodes/names'),
            ticket = connector.connection.session.ticket;    
        
        if (emailTitleInfo.checked){
            emailTitleInfo.isEmail = true;
            namesToResolve.push(emailTitleInfo);
        }
        if (attachmentInfo != null && attachmentInfo.length ){
            for (var i = 0; i < attachmentInfo.length; i++){
                var info = attachmentInfo[i].data;
                if (info.checked){
                    info.isEmail = false;
                    namesToResolve.push(info);
                }
            }
        }

        var looper = $.Deferred().resolve();
        $.when.apply($, $.map(namesToResolve, function(item, i){
            looper = looper.then(function(){
                var nameToResolve = typeof item.isEmail === "undefined" || ! item.isEmail ? 
                                    item.suggestedName : item.suggestedName + ".eml";

                return self.resolveName(url, ticket, folderId, nameToResolve, item, resolvedNames)
            });
            return looper
        })).then(function(){
                defer.resolve();
            },  function (error) {
                var err = Array.isArray(error) && error.length > 0 ? error[0] : error;
                defer.reject(err);
        });

        return defer.promise();
    }

    function verifyName(url, ticket, folderId, names) {
        var bodyFormat = '{"parent_id":%d,"names":[%s]}';

        var escapedNames = [];
        for(var i = 0; i < names.length; i++){
            escapedNames.push(WkspUtil.escapeNameToVerify(names[i]));
        }
        var nameString = '"' + escapedNames.join('","') + '"';
        var body = _.str.sprintf(bodyFormat, folderId, nameString); 

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
    }

    function resolveName(url, ticket, folderId, nameToResolve, nameInfo, resolvedNames) {
        var self = this,
            defer = $.Deferred();

        var ensuredName = nameToResolve,
            nameConflicted = false,
            nameCandidates;
        if (!Array.isArray(ensuredName) && resolvedNames.length > 0){
            while (self.nameExists(resolvedNames, ensuredName)){
                nameCandidates = self.prepareNames(ensuredName, 5, resolvedNames);
                ensuredName = nameCandidates[1];
                nameConflicted = true;
            }
        }
        if (!nameConflicted){
            nameCandidates = self.prepareNames(ensuredName, 5, resolvedNames);
        }

        var verifyingPromise = self.verifyName(url, ticket, folderId, nameCandidates);
        verifyingPromise.done(function (data) {
            if (data.results && data.results.length === 0) {
                nameInfo.suggestedName = nameCandidates[0];
                nameInfo.editable = nameConflicted || Array.isArray(ensuredName);
                nameInfo.hasConflict = nameConflicted || Array.isArray(ensuredName);
                resolvedNames.push(nameCandidates[0]);
                defer.resolve();
            } else if (data.results.length === nameCandidates.length) {
                var subPromise = self.resolveName(url, ticket, folderId, nameCandidates, nameInfo, resolvedNames);
                subPromise.done(function (result){
                    defer.resolve();
                });
                subPromise.fail(function (error){
                    defer.reject(error);
                });
            } 
            else {
                for (var i = 0; i < nameCandidates.length; i++){
                    var candidate = nameCandidates[i];
                    var exist = false;
                    for (var j = 0; j < data.results.length; j++){
                        var existName = data.results[j].name;
                        if (candidate.toUpperCase() === existName.toUpperCase()){
                            exist = true;
                            break;
                        }
                    }
                    if (exist){
                        continue;
                    } else {
                        nameInfo.suggestedName = candidate;
                        nameInfo.editable = nameConflicted || i !== 0;
                        nameInfo.hasConflict = nameConflicted || i !== 0;
                        resolvedNames.push(candidate);
                        break;
                    }
                }
                defer.resolve();
            }

        });
        verifyingPromise.fail(function (error, errorDetail) {
            if (error.status === 401) {
                self.reauthenticate(lang.warning_session_expired);
            } else {
                defer.reject(_.str.sformat(lang.error_validate_name, WkspUtil.getErrorMessage(error)));
            }
        });

        return defer.promise();
    }

    function prepareNames(name, nameCount, existingNames){
        var initialRequest = Array.isArray(name) ? false : true;
        var baseName = initialRequest ? name : name[name.length-1];

        var ext = "",
            namePart = baseName,
            lastDot = baseName.lastIndexOf(".");

        if (lastDot >= 0){
            ext = baseName.substring(lastDot).trim();
            namePart = baseName.substring(0, lastDot);
        }

        var regEx = /.*\((\d+)\)$/g;
        var match = regEx.exec(namePart);
        var sequence = 1,
            nameSeed = "",
            hasSequence = false;

        if (match !== null && match.length > 1){
            sequence = parseInt(match[1], 10);
            if (!initialRequest){
                sequence++;
            }
            hasSequence = true;
            nameSeed = namePart.substring(0, namePart.lastIndexOf("("));
        } else {
            nameSeed = namePart;
        }
        nameSeed = nameSeed.trim();
        var count = typeof nameCount === "undefined" || nameCount < 1 ? 5 : nameCount;
        var alreadyExistedNames = typeof existingNames === "undefined" ? [] : existingNames;

        var candidates = [],
            index = 0;
        while (index < count){
            var candidate;
            if (initialRequest && !hasSequence){
                candidate = nameSeed + ext;
                initialRequest = false;
            } else {
                candidate = nameSeed + " (" + sequence + ")" + ext;
                sequence++;
            }

            if (!this.nameExists(alreadyExistedNames, candidate)){
                candidates.push(candidate);
                index++;
            }
        }

        return candidates;
    }

    function nameExists(nameArray, name){
        if (!Array.isArray(nameArray) || nameArray.length === 0){
            return false;
        }
        for (var i = 0; i < nameArray.length; i++){
            if (name.toUpperCase() === nameArray[i].toUpperCase()){
                return true;
            }
        }
        return false;
    }
});
