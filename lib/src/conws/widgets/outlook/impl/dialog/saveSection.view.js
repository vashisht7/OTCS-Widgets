/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/jquery',
    'csui/lib/underscore',                             
    'csui/lib/marionette3',                             
    'csui/lib/backbone',
    'csui/utils/contexts/page/page.context',
    'conws/widgets/outlook/impl/utils/utility',
    'conws/widgets/outlook/impl/utils/csservice',
    'conws/widgets/outlook/impl/utils/emailservice',
    'conws/widgets/outlook/impl/dialog/nameControl.view',
    'conws/widgets/outlook/impl/metadata/metadata.forms.view',

    'i18n!conws/widgets/outlook/impl/nls/lang',       
    'hbs!conws/widgets/outlook/impl/dialog/impl/saveSection',
    'css!conws/widgets/outlook/impl/conwsoutlook'         
], function ($, _, Marionette, Backbone, PageContext, WkspUtil, CSService, EmailService, NameView, MetadataFormsView, lang, template) {

    var saveSectionView = Marionette.CompositeView.extend({

    template: template,

    childView: NameView,
    childEvents:{
        'change:status': 'onStatusChange'
    },


    childViewContainer: '#emailAttachment',

    events: {
        'click #saveSectionBack': 'clickBack',
        'click #saveEmailDiv #checkButton': 'clickSaveEmail',
        'click #saveAttachmentCheckbox': 'clickSaveAttachment',
        'click #saveAttachmentDiv #checkButton': 'clickOneAttachment',
        'click #saveNextButton': 'clickNext',
        'keyup #saveSectionBack, #saveNextButton, #metadataFormBack': 'processKey',
        'click #metadataFormBack': 'clickMetadataBack'
    },

    templateContext: function () {
        return {
            saveEmailText: this.hasAttachment ? lang.save_email_text : lang.save_email_text_noAttachment,
            saveAttachmentText: lang.save_attachment_text,
            saveAttachmentOption: lang.save_attachment_option,
            saveInfo: _.str.sformat(lang.save_email_info, this.folderName),
            requiredFieldsTitle: lang.required_fields_title,
            saveLabel: lang.save_label,
            backLabel: lang.save_button_back
        }
    },

    initialize: function(options) {
        this.stageCode = {
            initial: 1,
            nameChecking: 2,
            metadata: 3,
            finished: 4
        };
        this.model = new Backbone.Model({});
    },

    constructor: function saveSectionView(options) {
        Marionette.CompositeView.prototype.constructor.call(this, options);

        var self = this;
        
        self.connector = options.connector;
        self.folderId = options.folderId;
        self.folderName = options.folderName;

        self.saveStage = self.stageCode.initial; // All saving stages: initial, nameChecking, metadata, finished 
        self.saveEmail = true;
        self.nothingToSave = false;
        self.hasAttachment = options.attachments != null && options.attachments.length > 0 ? true : false;
        
        self.attachments = options.attachments;
        self.emailTitleInfo = {name: options.proposedEmailName,
                        showCheckbox: self.hasAttachment,
                        checkboxDisabled: false,
                        editable: false,
                        hasConflict: false,
                        focus: false}

        self.attachmentInfo = [];
        if (self.attachments != null){
            self.attachments.forEach(function(element){
                self.attachmentInfo.push({
                    data: {
                        name: element.name, 
                        id: element.id, 
                        mimeType: element.contentType, 
                        attachmentType: element.attachmentType,
                        checked: false,
                        focus: false,
                        hasConflict: false
                    }
                });
            })
        }

        self.metadataFormView = null;
        self.metadataFormRetrieved = false;
        self.hasRequiredMetadata = false;
        self.requiredMetadataResolved = false;
        self.metadataValue = {};
        self.previousStage = self.stageCode.initial;

        self.saveFailed = false;
        self.saveMessage = "";

        if (self.hasAttachment){
            self.collection = new Backbone.Collection(self.attachmentInfo);
        }

        self.renderForm();
    },

    processKey: function(e){
        if (e.which === 13 || e.which === 32) {
            if (e.target.id === "saveSectionBack"){
                this.clickBack(e);
            } else if (e.target.id === "saveNextButton"){
                this.clickNext(e);
            } else if (e.target.id === "metadataFormBack"){
                this.clickMetadataBack(e);
            }
        }
    },

    renderMessage: function (msg) {
        var self = this;
        var msgArea = self.$('#saveMsgArea');

        if (msg) {
            msgArea.css("display", "block");
            msgArea.html(msg);
        } else {
            msgArea.css("display", "none");
        }
    },

    onStatusChange: function(model, value, options){
        this.render();
    },

    renderForm: function (model, response, options) {
        var self = this;

       self.renderChildren();

        if (self.saveStage === self.stageCode.initial){
            WkspUtil.ConflictHighlighted = false;
        }
        
        setTimeout(function(){ 

            $('#saveDisplayArea').css('height', 'calc(100vh - ' + (36 + WkspUtil.TraceAreaHeight) + 'px)');
            $('#saveResult').css('top', 'calc(40vh - ' + (36 + WkspUtil.TraceAreaHeight/2) + 'px)');
            
            var emailNameRegion = new Marionette.Region({
                el: '#emailName'
            });
            var emailTitle = "";
            if (self.saveStage === self.stageCode.initial){
                emailTitle = self.emailTitleInfo.name;
            } else {
                var pos = self.emailTitleInfo.suggestedName.lastIndexOf(".eml");
                if (pos > 0){
                    emailTitle = self.emailTitleInfo.suggestedName.substring(0, pos);
                } else {
                    emailTitle = self.emailTitleInfo.suggestedName;
                }
            }
            emailNameRegion.show(new NameView({ 
                data: {context: self.context,
                       name: self.emailTitleInfo.name,
                       suggestedName: emailTitle,
                       showIcon: false,
                       showCheckbox: self.hasAttachment,
                       checkboxDisabled: !self.hasAttachment,
                       checked: self.saveEmail,
                       wrapping: true,
                       showOriginalName: self.emailTitleInfo.showOriginalName,
                       hasConflict: self.emailTitleInfo.hasConflict,
                       editable: self.emailTitleInfo.editable,
                       focus: self.emailTitleInfo.focus }}));
            
            WkspUtil.uiShow("saveSelectionPanel");

            self.$("#saveNextButton").text(lang.save_button_next);
            if (self.saveStage === self.stageCode.initial){
                WkspUtil.uiHide(WkspUtil.PreSaveSection);
                if (WkspUtil.PreSaveSection === "standardSections"){
                    WkspUtil.uiHide("customSearchButton");
                }
                WkspUtil.uiShow("savePanel");
                WkspUtil.uiShow("saveSelectionPanel");
                self.$("#saveSectionTitle").text(lang.title_save_email);
                WkspUtil.uiHide("metadataPanel");
                WkspUtil.uiHide("saveMessageArea");
            } else if (self.saveStage === self.stageCode.nameChecking) {
                self.$("#saveSectionTitle").text(lang.save_selection_conflict);
                WkspUtil.uiShow("saveMessageArea");
                self.$("#saveMessage").html(lang.save_selection_conflict_msg);
            } else if (self.saveStage === self.stageCode.metadata){
                self.$("#saveSectionTitle").text(lang.required_fields_title);
                WkspUtil.uiShow("metadataPanel");
                WkspUtil.uiHide("saveSelectionPanel");
                WkspUtil.uiHide("saveResultPanel");
            } else if (self.saveStage === self.stageCode.finished){
                WkspUtil.uiHide("saveSelectionPanel");
                WkspUtil.uiHide("metadataPanel");
                WkspUtil.uiShow("saveResultPanel");
                self.$("#saveNextButton").text(lang.save_button_close);
                self.$("#saveResult").text(self.saveMessage);
                self.$("#saveResultTitle").text(self.saveTitle);
            }
            
            var attachmentOption = 0; // 0 unchecked, 1 checked, 2 mixed
            for(var i = 0; i < self.attachmentInfo.length; i++){
                var info = self.attachmentInfo[i].data;
                if (i === 0){
                    attachmentOption = info.checked ? 1 : 0;
                } else if ((info.checked && attachmentOption === 0) ||
                           (!info.checked && attachmentOption === 1)){
                        attachmentOption = 2;
                        break;
                }
            }
            self.$("#saveAttachmentCheckboxIcon").removeClass("checkboxSelected checkboxMixed");
            var attachmentClass = attachmentOption === 1 ? "checkboxSelected" : (attachmentOption === 2 ? "checkboxMixed" : "" );
            self.$("#saveAttachmentCheckboxIcon").addClass(attachmentClass);

            if (!self.hasAttachment){
                WkspUtil.uiHide("saveAttachmentDiv");
            } else if (self.attachments.length === 1){
                WkspUtil.uiHide("attachmentOptionTr");
            }

            if (self.nothingToSave){
                WkspUtil.uiShow("saveMessageArea");
                self.$("#saveNextButton").addClass("buttonDisabled");
                self.$("#saveMessage").html(lang.save_noSelection);
            }
        });
        
    },

    renderError: function (model, response, options) {
        var self = this;
        var msg = model.get('error');
        if (!msg) {
            msg = typeof (response) !== 'object' ? JSON.parse(response).error : response.responseJSON ? response.responseJSON.error : response.error;
        }

        self.renderMessage(msg);
    },


    clickBack: function(args){
        var self = this;
        if (self.saveStage === self.stageCode.initial){
            WkspUtil.uiShow(WkspUtil.PreSaveSection);
            if (WkspUtil.PreSaveSection === "standardSections"){
                WkspUtil.uiShow("customSearchButton");
            }
            WkspUtil.uiHide("saveSelectionPanel");
            WkspUtil.uiHide("savePanel");
            window.scrollTo(0, WkspUtil.ScorllPositionBeforeSaving);
            WkspUtil.ScorllPositionBeforeSaving = -1;
        } else if (self.saveStage === self.stageCode.nameChecking){
            self.emailTitleInfo.showOriginalName = true;
            self.emailTitleInfo.editable = false;
            for (var i = 0; i < self.attachmentInfo.length; i++){
                var info = self.attachmentInfo[i].data;
                info.showOriginalName = true;
                info.editable = false;
            }
            self.saveStage = self.stageCode.initial;
            self.renderForm();
        } else if (self.saveStage === self.stageCode.metadata){
            self.saveStage = self.previousStage;
            self.renderForm();
        }
        $("#conwsoutlook-body").focus();
    },

    backToStandard: function(args){
        WkspUtil.uiShow("standardSections");
        WkspUtil.uiShow("customSearchButton");
        WkspUtil.uiHide("customSearchSection");
    },

    clickMetadataBack: function(args){
        WkspUtil.uiShow("saveSelectionPanel");
        WkspUtil.uiHide("metadataPanel");
        this.saveStage = this.previousStage;
        this.$("#saveSectionBack").focus();
    },

    clickSaveAttachment: function(args){
        var self = this,
            icon = self.$("#saveAttachmentCheckboxIcon");
        var checked = icon.hasClass("checkboxSelected");
        icon.removeClass("checkboxMixed");
        if (checked){
            icon.removeClass("checkboxSelected");
        } else{
            icon.addClass("checkboxSelected");
            if (self.$("#saveNextButton").hasClass("buttonDisabled")){
                self.$("#saveNextButton").removeClass("buttonDisabled");
                WkspUtil.uiHide("saveMessageArea");
            }
        }

        self.$("#saveAttachmentDiv #checkboxIcon").each(function(i, obj){
            if (checked){
                $(obj).removeClass("checkboxSelected");
            } else{
                $(obj).addClass("checkboxSelected");
            }
        });

        self.$("#saveAttachmentDiv #itemEditIcon").each(function(i, obj){
            if (checked){
                $(obj).attr("disabled", "disabled");
                $(obj).removeClass("editCancelIcon");
                $(obj).attr("tabindex", "-1");
            } else{
                $(obj).removeAttr("disabled");
                $(obj).attr("tabindex", "0");
            }
        });

        self.$("#saveAttachmentDiv #itemName").each(function(i, obj){
            if (checked){
                $(obj).addClass("textReadonly");
                $(obj).prop("contenteditable", false);

                $(obj).addClass("textNoWrap");
                obj.style.removeProperty("height");
            } 
        });
    },

    clickOneAttachment: function(args){
        var self = this;
        var thisCheckbox = args.target; 
        if (args.target.id === "checkButton"){
            thisCheckbox = args.target.querySelector("span");
        }
        var allBox = self.$("#saveAttachmentCheckboxIcon");
        var attachmentBoxes = self.$("#saveAttachmentDiv #checkboxIcon");


        var changeToSelected = thisCheckbox.classList.contains("checkboxSelected") ? true : false;
        var changeToMix = false;
        attachmentBoxes.each(function(i, obj){
            if (obj !== thisCheckbox){
                if (obj.classList.contains("checkboxSelected") !== changeToSelected){
                    changeToMix = true;
                    return false; // 'break' for jQuery loop
                }
            }
        });

        if (changeToMix) {
            allBox.removeClass("checkboxSelected");
            allBox.addClass("checkboxMixed");
        } else{
            allBox.removeClass("checkboxMixed");
            if (changeToSelected){
                allBox.addClass("checkboxSelected");
            } else {
                allBox.removeClass("checkboxSelected");
            }
        }

        if (changeToSelected && self.$("#saveNextButton").hasClass("buttonDisabled")){
            self.$("#saveNextButton").removeClass("buttonDisabled");
            WkspUtil.uiHide("saveMessageArea");
        }
    },

    clickSaveEmail: function(args){
        var self = this;
        if (!self.$("#saveEmailDiv #checkButton").hasClass("checkboxSelected") && 
            self.$("#saveNextButton").hasClass("buttonDisabled")){
            self.$("#saveNextButton").removeClass("buttonDisabled");
            WkspUtil.uiHide("saveMessageArea");
        }
    },

    clickNext: function(args){
        var self = this;

        if (self.$("#saveNextButton").hasClass("buttonDisabled")){
            return;
        }

        if (self.saveStage === self.stageCode.initial || self.saveStage === self.stageCode.nameChecking){
            self.previousStage = self.saveStage;
            self.collectInfo();

            if (self.nothingToSave){
                self.renderForm();
            } else {
                WkspUtil.startGlobalSpinner();
                self.saveStage = self.stageCode.nameChecking;

                var nameResolvingPromise = CSService.resolveNames(self.connector, self.folderId, self.emailTitleInfo, self.attachmentInfo);
                nameResolvingPromise.done(function(result){
                    var nameCheckingPassed = true;
                    self.savingEmailName = self.emailTitleInfo.checked ? self.emailTitleInfo.suggestedName : "";
                    self.savingAttachments = [];

                    if (self.emailTitleInfo.hasConflict){
                        nameCheckingPassed = false;
                    }
                    
                    for (var i = 0; i < self.attachmentInfo.length; i++){
                        var info = self.attachmentInfo[i].data;
                        if (!nameCheckingPassed){
                            info.avoidHighlight = true;
                        }
                        if (info.hasConflict){
                            nameCheckingPassed = false;
                        }

                        if (info.checked){
                            self.savingAttachments.push({name: info.suggestedName,
                                                    id: info.id,
                                                    mimeType: info.mimeType})
                        }
                    }

                    if (nameCheckingPassed) {
                        self.saveStage = self.stageCode.metadata;
                        var metadataRegion = new Marionette.Region({
                            el: '#metadataDiv'
                        });
                        if (!self.metadataFormRetrieved){
                            self.metadataFormView = new MetadataFormsView({ 
                                parentId: self.folderId,
                                parentView: self
                            });
                            metadataRegion.show(self.metadataFormView);
                        } else if (self.hasRequiredMetadata){
                            WkspUtil.uiHide("saveSelectionPanel");
                            WkspUtil.uiShow("metadataPanel");
                            WkspUtil.stopGlobalSpinner();
                        } else {
                            self.processMetadata();
                        }

                    } else {
                        WkspUtil.stopGlobalSpinner();
                        self.renderForm();
                    }
                });
                nameResolvingPromise.fail(function(error){
                    self.saveStage = self.stageCode.finished;
                    self.saveFailed = true;
                    self.saveMessage = WkspUtil.getErrorMessage(error);
                    self.saveTitle = lang.title_save_error;
                    WkspUtil.stopGlobalSpinner();
                    self.renderForm();
                });
            }
        } else if (self.saveStage === self.stageCode.metadata) {
            var allValid = self.metadataFormView.getValuesToParent();
            if (allValid){
                WkspUtil.startGlobalSpinner();
                WkspUtil.uiHide("metadataMessageArea");
                self.processSave();
            } else {
                WkspUtil.uiShow("metadataMessageArea");
                self.$("#metadataMessage").html(lang.save_metadate_form_invalid);
            }
        } else if (self.saveStage === self.stageCode.finished){
            WkspUtil.SavingSubmitted = false;
            if (WkspUtil.EmailChangedAfterSaving){
                EmailService.emailItemChanged({});
            } else {
                WkspUtil.uiShow(WkspUtil.PreSaveSection);
                if (WkspUtil.PreSaveSection === "standardSections"){
                    WkspUtil.uiShow("customSearchButton");
                }
                WkspUtil.uiHide("savePanel");
                window.scrollTo(0, WkspUtil.ScorllPositionBeforeSaving);
                WkspUtil.ScorllPositionBeforeSaving = -1;
            }
        }
        $("#conwsoutlook-body").focus();
    },

    processMetadata: function(){
        var self = this;

        self.hasRequiredMetadata = self.model.get('hasRequired') || false;

        if (!self.metadataFormRetrieved && !self.hasRequiredMetadata){
            self.metadataFormRetrieved = true;
            return;
        }
        self.metadataFormRetrieved = true;
        if (!self.hasRequiredMetadata){
            self.processSave();
        } else {
            WkspUtil.stopGlobalSpinner();
            WkspUtil.uiHide("saveSelectionPanel");
            WkspUtil.uiShow("metadataPanel");
        }
    },

    processSave: function () {
        var self = this;
        self.saveStage = self.stageCode.finished;

        WkspUtil.SavingSubmitted = true;

        var savePromise = CSService.save(self.connector, self.folderId, self.savingEmailName, self.savingAttachments, self.metadataValue);
        savePromise.done(function (result) {
            self.saveFailed = false;
            self.saveMessage = result.result;
            self.saveTitle = lang.title_save_success;
            WkspUtil.stopGlobalSpinner();
            self.renderForm();
        });
        savePromise.fail(function (error) {
            self.saveFailed = true;
            self.saveMessage = error.errorMsg;
            self.saveTitle = lang.title_save_error;
            WkspUtil.stopGlobalSpinner();
            self.renderForm();
        });
    },

    collectInfo: function(){
        var self = this;
        self.nothingToSave = true;
        self.emailTitleInfo.suggestedName = WkspUtil.escapeNameToCreate(self.$("#emailName #itemName").text().trim());
        self.emailTitleInfo.showOriginalName = false;
        self.saveEmail = self.$("#saveEmailDiv #checkboxIcon").hasClass("checkboxSelected") ||
                        self.$("#saveEmailDiv #checkboxIcon").hasClass("checkboxDisabled");
        self.emailTitleInfo.checked = self.saveEmail;
        if (!self.saveEmail){
            self.emailTitleInfo.editable = false;
            self.emailTitleInfo.hasConflict = false;
            self.emailTitleInfo.focus = false;
            
        } else {
            self.nothingToSave = false;
        }

        var attachmentBoxes = self.$("#saveAttachmentDiv #checkboxIcon");
        var attachmentNames = self.$("#saveAttachmentDiv #itemName");

        for(var i=0; i < self.attachmentInfo.length; i++){
            var info = self.attachmentInfo[i].data;
            info.checked = attachmentBoxes.eq(i).hasClass("checkboxSelected");
            if (self.nothingToSave && info.checked){
                self.nothingToSave = false;
            }
            info.suggestedName = WkspUtil.escapeNameToCreate(attachmentNames.eq(i).text().trim());
            info.editable = !attachmentNames.eq(i).hasClass("textReadonly");
            info.showOriginalName = false;
            info.avoidHighlight = false;
            info.hasConflict = false;
        }
    }

  });

  return saveSectionView;

});
