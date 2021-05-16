/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
    'csui/lib/jquery',
    'conws/widgets/outlook/impl/utils/utility',
    'i18n!conws/widgets/outlook/impl/nls/lang'
], function EmailSerivce(module, $, WkspUtil, lang) {

        return {

            constants : {
                cs_config_missing: lang.config_CS_missing,
                retrieve_email_error: lang.error_retrieve_email
            },

            getCurrentMailboxItem: getCurrentMailboxItem,
            emailItemChanged: emailItemChanged
    };

        function getCurrentMailboxItem() {
            var deferred = $.Deferred();

            try {
                var currentEmail = window.Office.cast.item.toItemRead(window.Office.context.mailbox.item);
                var currentUser = window.Office.context.mailbox.userProfile.emailAddress;

                currentEmail.archivableAttachments = [];
                for (var i = 0; i < currentEmail.attachments.length; i++) {
                    var attachment = currentEmail.attachments[i];
                    if (attachment.attachmentType === window.Office.MailboxEnums.AttachmentType.File){
                        currentEmail.archivableAttachments.push(attachment);
                    }
                }

                deferred.resolve({
                    currentEmail: currentEmail,
                    currentUser: currentUser
                });
            } catch (error) {
                deferred.reject(error);
            }

            return deferred.promise();
        }

        function emailItemChanged(eventArgs){
            if (WkspUtil.SavingSubmitted){
                WkspUtil.EmailChangedAfterSaving = true;
                return;
            } else {
                WkspUtil.EmailChangedAfterSaving = false;
            }

            var item = window.Office.context.mailbox.item,
                previousItem = window.CurrentEmailItem,
                yPosition = window.pageYOffset;

            if (previousItem.itemId === item.itemId){
                return;
            }
            
            var currentEmail = window.Office.cast.item.toItemRead(item);
            currentEmail.archivableAttachments = [];
            for (var i = 0; i < currentEmail.attachments.length; i++) {
                var attachment = currentEmail.attachments[i];
                if (attachment.attachmentType === window.Office.MailboxEnums.AttachmentType.File){
                    currentEmail.archivableAttachments.push(attachment);
                }
            }
            window.CurrentEmailItem = currentEmail;

            if (previousItem === null){
                return;
            }

            WkspUtil.writeTrace("Email has been switched. New email subject: " + item.subject);

            window.CurrentEmailItem = window.Office.cast.item.toItemRead(item);
            WkspUtil.uiShow(WkspUtil.PreSaveSection);
            if (WkspUtil.PreSaveSection === "standardSections"){
                WkspUtil.uiShow("customSearchButton");
            }
            
            WkspUtil.uiHide("savePanel");
            if (WkspUtil.ScorllPositionBeforeSaving !== -1){
                window.scrollTo(0, WkspUtil.ScorllPositionBeforeSaving);
                WkspUtil.ScorllPositionBeforeSaving = -1;
            } else {
                window.scrollTo(0, yPosition);
            }

            if (WkspUtil.SuggestedWkspsView !== null){
                WkspUtil.SuggestedWkspsView.refresh();
            }
        }

    }
);
