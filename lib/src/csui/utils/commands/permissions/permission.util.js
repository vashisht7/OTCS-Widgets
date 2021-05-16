/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', "csui/lib/backbone", 'csui/lib/jquery',
  'i18n!csui/utils/commands/nls/localized.strings'
], function (module, require, _, Backbone, $, lang) {
  'use strict';

  function generateSuccessMessage(response, GlobalMessage) {
    var message;
    if (response.results.success > 0 && response.results.failure === 0) {
      message = _.str.sformat(
          response.results.success === 1 ? lang.AppliedPermissionsOneSuccess :
          lang.AppliedPermissionsOnlySuccess,
          response.results.success);
    } else if (response.results.success > 0 && response.results.failure > 0) {
      message = _.str.sformat(lang.AppliedPermissionsSuccessAndFailure,
          response.results.success, response.results.failure);
    } else if (response.results.success === 0 && response.results.failure > 0) {
      message = _.str.sformat(
          response.results.failure === 1 ? lang.AppliedPermissionsOneFailure :
          lang.AppliedPermissionsOnlyFailure,
          response.results.failure);
    }
    var errObject             = Backbone.Model.extend({
          defaults: {
            name: "",
            state: 'pending',
            commandName: 'ViewPermission'
          }
        }),
        errObjects            = [],
        failedFilesCollection = Backbone.Collection.extend({
          model: errObject
        }),
        errCollection         = new failedFilesCollection();

    for (var i = 0; response.results.failure > 0 && i < response.results.data.length; i++) {
      errObjects[i] = new errObject({
        name: response.results.data[i].name,
        mime_type: '',
        state: 'rejected'
      });
      errCollection.add(errObjects[i]);
    }
    var successCount = (response.results.success > 0 &&
                        response.results.failure > 0) ?
                       response.results.success : '',
        langTitle    = _.str.sformat(lang.ApplyingManyItemsSuccessMessage, successCount),
        successMsg   = successCount > 0 ? langTitle : ' ';

    response.results.failure > 0 ?
    GlobalMessage.showPermissionApplyingProgress(errCollection, {
      oneFileFailure: successMsg + lang.ApplyingOneItemFailMessage,
      someFileFailure: successMsg + _.str.sformat(lang.ApplyingManyItemsFailMessage2,
          errObjects.length),
      multiFileFailure: successMsg + _.str.sformat(lang.ApplyingManyItemsFailMessage2,
          errObjects.length)
    }) : '';

    (response.results.success > 0 && response.results.failure <= 0) ?
    GlobalMessage.showMessage('success', message ? message : lang.AppliedPermissions) : '';
  }

  return {
    generateSuccessMessage: generateSuccessMessage
  };
});