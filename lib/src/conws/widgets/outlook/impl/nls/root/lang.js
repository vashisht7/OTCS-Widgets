/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



define({
    config_CS_missing: "The Content Server that this add-in connects to has not been specified properly.",

    error_create_Blob: "Creating the Blob object for the email content failed with error: {0}",
    error_create_CORS: "Creating CORS request failed.",
    error_CORS_NoResponse: "CORS call does not return anything.",
    error_retrieve_config: "Retrieving add-in configuration failed with error: {0}",
    error_retrieve_email: "Retrieving current email failed with error: ",
    error_retrieve_email_body: "Retrieving email body failed with error: {0}",
    error_retrieve_email_content: "Retrieving email content through Exchange Web Service failed with error: {0}",
    error_retrieve_favorite: "Retrieving favorite business workspace failed with message: {0}",
    error_retrieve_recent: "Retrieving recently accessed business workspace failed with message: {0}",
    error_retrieve_search: "Searching business workspace failed with message: {0}",
    error_retrieve_searchQueries: "Retrieving custom view search queries failed with message: {0}",
    error_retrieve_suggested: "An error occurred when retrieving suggested business workspaces: {0}",
    error_retrieve_suggestedConfig: "Retrieving configuration failed with message: {0}",
    error_retrieve_token: "Retrieving accessing token for EWS failed.",
    error_save_email: "The saving process did not complete successfully. {0}",
    error_validate_name: "Validating the name failed with message: {0}",

    help_button_tooltip: "Help",

    info_confirm_saving: 'The email will be saved to folder "{0}".',
    info_retrieving: 'Retrieving...',
    info_save_successful: "The email has been saved successfully.",

    name_untitled: "Untitled",

    noWksp_favorite: "No favorite business workspace",
    noWksp_recent: "No recently accessed business workspace",
    noWksp_search: "No business workspace found",
    noWksp_suggested: "No suggested business workspace",

    required_fields_title: "Enter required fields",
    required_fields_switchLabel: "Only required fields (*)",

    save_action_both: "Save email and attachment(s)",
    save_action_attachment: "Save attachment(s)",
    save_action_email: "Save email",
    save_attachment_text: "Save attachments separately",
    save_attachment_option: "Save all attachments",
    save_button_back: "Back",
    save_button_next: "Next",
    save_button_close: "Close",
    save_enterName: "Enter a unique name to save this email.",
    save_email_info: 'Save email to folder "{0}".',
    save_email_text: "Save email and attachments as one file",
    save_email_text_noAttachment: "Save email as one file",
    save_failed: "{0} failed with message: {1}.",
    save_label: "Save",
    save_metadate_form_invalid: "Correct the values on the form then click Next to save.",
    save_nameNotUnique: "Add this email with a unique name:",
    save_noSelection: "You must select the email or the attachment(s) you want to save.",
    save_successful_all: "The email and attachment(s) have been saved successfully.",
    save_successful_attachment: "The attachment has been saved successfully.",
    save_successful_attachments: "The attachments have been saved successfully.",
    save_successful_email: "The email has been saved successfully.",
    save_selection_conflict: "Conflict",
    save_selection_conflict_msg: "File(s) with the same name already exists. Please rename the file(s) then click Next to continue.",

    search_all_wksp: "Search all workspaces",
    search_button_tooltip: "Search",
    search_clear_button_tooltip: "Clear search",
    search_custom_button_label: "Custom search",
    search_noCondition: "Specify the search condition",
    search_result_title: "Search results",
    search_select_form: "Select a Search Form",
    search_select_wksp_type: "Select a workspace type",
    search_selected_wksp_type: "Workspace type",
    search_wksp_typeName: "Workspace Type and Name",
    search_wkspName_placeholder: "Search for Business Workspaces",

    sectionTitle_customSearch: "Custom search",
    sectionTitle_favorite: "Favorite workspaces",
    sectionTitle_recent: "Recent workspaces",
    sectionTitle_search: "Search workspaces",
    sectionTitle_suggested: "Suggested workspaces",

    showMore_link: "Show more...",
    showMore_folders: "Show more folders",
    showMore_wksp: "Show more workspaces",

    signIn_button_Title: "Sign in",
    signIn_required: "Enter the user name and password.",
    signIn_message: "Sign in to continue to {0}",
    signIn_password: "Password",
    signIn_title: "Sign in Content Server",
    signIn_username: "User name",

    ssoTimeout: "Single sign-on timeout.",

    title_cancel: "Cancel",
    title_ok: "OK",
    title_save_email: "Save email",
    title_save_email_to: "Save email to ",
    title_save_error: "Error",
    title_save_success: "Success",

    validation_name_conflict: 'An email item "{0}" already exists in the folder "{1}".',
    validation_no_subject: "The email does not contain a subject.",

    warning_no_outlook_context: "Cannot retrieve email information. Make sure the add-in is running within Outlook context.",
    warning_session_expired: "Session expired",

    wksp_open_link: "Open in browser"
});
