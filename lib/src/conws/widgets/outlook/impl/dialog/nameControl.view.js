/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/jquery',
    'csui/lib/underscore',                             
    'csui/lib/marionette',                             
    'csui/lib/backbone',
    'csui/utils/contexts/page/page.context',
    'csui/utils/nodesprites',

    'conws/widgets/outlook/impl/utils/utility',
    'conws/widgets/outlook/impl/utils/csservice',

    'i18n!conws/widgets/outlook/impl/nls/lang',       
    'hbs!conws/widgets/outlook/impl/dialog/impl/nameControl',
    'css!conws/widgets/outlook/impl/conwsoutlook'         
], function ($, _, Marionette, Backbone, PageContext, NodeSprites, WkspUtil, CSService, lang, template) {

    var nameControlView = Marionette.CompositeView.extend({

    tagName: "tr",

    template: template,


    ui: {
        
    },

    events: {
        'click #saveSelectionBack': 'backToPreSave',
        'click #itemEditIcon': 'toggleEdit',
        'click #checkButton': 'clickCheckbox',
        'keyup #itemName': 'nameTyping',
        'blur #itemName': 'ensureName',
        'keyup #itemEditIcon': 'processKey'
    },

    templateHelpers: function () {
        return {
            iconClass: this.mimeType,
            tabIndex: this.checked ? "0" : "-1",
            saveLabel: lang.save_label
        }
    },

    initialize: function(options) {
        
    },

    constructor: function nameControlView(options) {
        Marionette.CompositeView.prototype.constructor.call(this, options);

        var self = this;

        var data = options.model != null ? options.model.get('data') : options.data;

        if (data != null){
            this.showOriginalName = data.showOriginalName != null ? data.showOriginalName : false;
            this.hasConflict = data.hasConflict != null ? data.hasConflict : false;
            var name = "";
            if (this.showOriginalName && this.hasConflict){
                name = data.name ? data.name : lang.name_untitled;
            } else {
                name = data.suggestedName ? data.suggestedName : (data.name ? data.name : lang.name_untitled);
            }
            this.name = name;

            this.showCheckbox = data.showCheckbox != null ? data.showCheckbox : true;
            this.checkboxDisabled = data.checkboxDisabled != null ? data.checkboxDisabled : false;
            this.checked = data.checked != null ? data.checked : false;
            this.showEditButton = data.showEditButton != null ? data.showEditButton : true;
            this.editable = this.showEditButton ? (data.editable != null ? data.editable : false) : false;
            this.showIcon = data.showIcon != null ? data.showIcon : true;
            this.mimeType = data.mimeType ? data.mimeType : "";
            this.wrapping = data.wrapping != null ? data.wrapping : false;
            this.focus = this.editable && (data.hasConflict != null ? data.hasConflict : false);
            this.avoidHighlight = data.avoidHighlight != null ? data.avoidHighlight : false;
        }

        self.renderForm();
    },

    processKey: function(e){
        if (e.which === 13 || e.which === 32) {
            if (e.target.id === "itemEditIcon"){
                this.toggleEdit(e);
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

    renderForm: function (model, response, options) {
        var self = this;

        setTimeout(
            function(){
                self.$("#itemName").text(self.name);
                if (self.showCheckbox){
                    self.$("#checkboxTd").removeClass("hiddenArea");
                }
                if (self.editable){
                    self.$("#editButtonTd").removeClass("hiddenArea");
                    self.switchEditMode(true, self.focus);
                }
                if (self.checked){
                    self.$("#checkboxIcon").addClass("checkboxSelected");
                    self.$("#itemEditIcon").removeAttr("disabled");
                }
                if (self.checkboxDisabled){
                    self.$("#checkboxIcon").removeClass("checkboxSelected");
                    self.$("#checkboxIcon").addClass("checkboxDisabled");
                } 
                if (self.showEditButton){
                    self.$("#editButtonTd").removeClass("hiddenArea");
                }
                if (self.showIcon){
                    self.$("#itemIconTd").removeClass("hiddenArea");

                    var css = "icon " + NodeSprites.findClassByNode({mime_type: self.mimeType});
                    self.$("#itemIcon").addClass(css);
                }
                if (self.wrapping){
                    var nameEditor = self.$("#itemName");
                    nameEditor.removeClass("textNoWrap");
                    nameEditor[0].style.height = (nameEditor[0].scrollHeight) + "px";
                } 
                
            }
        )
    },

    renderError: function (model, response, options) {
        var self = this;
        var msg = model.get('error');
        if (!msg) {
            msg = typeof (response) !== 'object' ? JSON.parse(response).error : response.responseJSON ? response.responseJSON.error : response.error;
        }

        self.renderMessage(msg);
    },

    toggleEdit: function (args){
        var self = this;
        var editable = args.target.classList.contains("editCancelIcon");
        self.switchEditMode(!editable, true);
        self.avoidHighlight = false;
    },

    switchEditMode: function (editable, focus){
        var self = this;
        var nameEditor = self.$("#itemName");
        if (editable){
            self.$("#itemEditIcon").addClass("editCancelIcon");
            nameEditor.removeClass("textReadonly");
            nameEditor.prop("contenteditable", true);
            nameEditor.attr('tabindex', "0");
                nameEditor.removeClass("textNoWrap");
                setTimeout(function(){
                    if ( nameEditor[0].scrollHeight >= 30){
                        nameEditor[0].style.height = ( nameEditor[0].scrollHeight) + "px";
                    }
                });

            if (focus){
                setTimeout(function(){
                    self.highlightName();
                });
                
            }
        }else{
            self.$("#itemEditIcon").removeClass("editCancelIcon");
            nameEditor.addClass("textReadonly");
            nameEditor.prop("contenteditable", false);
            nameEditor.attr('tabindex', "-1");

            if (!self.wrapping){
                nameEditor.addClass("textNoWrap");
                nameEditor[0].style.removeProperty("height");
            }
        }
    },

    clickCheckbox: function (args){
        var self = this,
            checkbox = self.$("#checkboxIcon"),
            edit = self.$("#itemEditIcon");

        if (checkbox.hasClass("checkboxDisabled")){
            return;
        }

        var checked = checkbox.hasClass("checkboxSelected");
        var tabIndex = "-1",
            nameEditor = self.$("#itemName");
        if (checked){
            checkbox.removeClass("checkboxSelected");
            edit.attr("disabled", "disabled");
            edit.removeClass("editCancelIcon");
            nameEditor.addClass("textReadonly");
            nameEditor.prop("contenteditable", false);

            if (!self.wrapping){
                nameEditor.addClass("textNoWrap");
                nameEditor[0].style.removeProperty("height");
            }
        } else{
            checkbox.addClass("checkboxSelected");
            edit.removeAttr("disabled");
            tabIndex = "0";
        }

        edit.attr('tabindex', tabIndex);
    },

    nameTyping: function(event) {
        var inputs = this.$("#itemName");
        if (inputs.length === 0) {
            return;
        }
        if (inputs.hasClass("textReadonly")){
            return;
        }
        var nameInput = inputs[0];
        if (nameInput.scrollHeight >= 30){
            nameInput.style.height = "1px";
            nameInput.style.height = (nameInput.scrollHeight) + "px";
        }
    },

    ensureName: function(event){
        var self = this;
        if (!self.$("#itemName").text().trim()){
            self.$("#itemName").text(lang.name_untitled);
        }
    },

    backToPreSave: function(args){
        WkspUtil.uiShow(WkspUtil.PreSaveSection);
        if (WkspUtil.PreSaveSection === "standardSections"){
            WkspUtil.uiShow("customSearchButton");
        }
        WkspUtil.uiHide("saveSelectionPanel");
        WkspUtil.uiHide("savePanel");
    },

    backToStandard: function(args){
        WkspUtil.uiShow("standardSections");
        WkspUtil.uiShow("customSearchButton");
        WkspUtil.uiHide("customSearchSection");
    },

    highlightName: function(){
        var self = this;
        var nameText = self.$("#itemName")[0];

        if (!self.avoidHighlight){
            nameText.focus();

            var range;
            if (document.selection) { // IE
                range = document.body.createTextRange();
                range.moveToElementText(nameText);
                range.select();
            } else if (window.getSelection) {
                range = document.createRange();
                range.selectNodeContents(nameText);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
            }
        }
    }

  });

  return nameControlView;

});
