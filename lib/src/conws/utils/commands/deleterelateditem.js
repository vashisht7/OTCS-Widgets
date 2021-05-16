/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/jquery',
  'i18n!conws/utils/commands/nls/commands.lang',
  'csui/models/command', 'conws/utils/workspaces/busyindicator'
], function (require, $, lang, CommandModel, BusyIndicator) {
  'use strict';

  var RemoveRelationCommand = CommandModel.extend({

    defaults: {
      signature: "RemoveRelation",
      command_key: ['deleterelateditem'],
      scope: 'multiple',
      name: lang.CommandNameDeleteRelatedItem,
      verb: lang.CommandVerbDeleteRelatedItem,
      confirmMessages: {
        formatForOne: lang.DeleteOneRelatedItemConfirmMessage,
        formatForTwo: lang.DeleteSomeRelatedItemsConfirmMessage,
        formatForFive: lang.DeleteManyRelatedItemsConfirmMessage
      },
      successMessages: {
        formatForNone: lang.DeleteRelatedItemsNoneMessage,
        formatForOne: lang.DeleteOneRelatedItemSuccessMessage,
        formatForTwo: lang.DeleteSomeRelatedItemsSuccessMessage,
        formatForFive: lang.DeleteManyRelatedItemsSuccessMessage
      }
    },

    enabled: function(status) {
      if (status.nodes && status.nodes.length) {
        var node = status.nodes.find(function(node){
          if (!(node.actions && node.actions.get("deleterelateditem"))) {
            return node;
          }
        });
        return !node;
      }
      return false;
    },

    execute: function(status, options) {
      var self = this;
      var deferred = $.Deferred();
      status.suppressSuccessMessage = true;
      BusyIndicator.on(status);
      deferred.always(function(){
        BusyIndicator.off(status);
      });
      require([ 'csui/lib/underscore', 'csui/utils/base', 'csui/utils/url',
        'csui/dialogs/modal.alert/modal.alert',
        'csui/controls/globalmessage/globalmessage'
      ], function (_, base, Url, ModalAlert, GlobalMessage) {

        function buildCallData(status) {
          var nodes = status.nodes;
          var connector, name, data;
          var calls = [];
          if (nodes) {
            nodes.each(function (node) {
              var action = node.actions.get('deleterelateditem');
              if (action) {
                connector = node.connector;
                name = node.get("name");
                var href = action.get('href')/*href: "/api/v2/businessworkspaces/98015/relateditems/125892?rel_type=child"*/;
                var match = href.match(/^\/?api\/v([0-9\.])+\/([^?#]+)/i);
                var call = {
                  apiCall: (match && match.length>=3) ? match[2] : href,
                  params: {
                    fRequestArgs: Url.urlParams(href),
                    fVersionNumber: (match && match.length>=2) ? parseInt(match[1]) : 2,
                    fParamTicket: "",
                    fParamMethod: action.get('method')/*method: "DELETE"*/,
                    fCallName: href
                  }
                };
                calls.push(call);
              }
            });
          }
          if (connector) {
            var connectionUrl = connector.getConnectionUrl();
            var baseUrl = connectionUrl.getCgiScript();
            var url = Url.combine(baseUrl,"/api/v1/csui/batch");
            var formData = new FormData();
            formData.append('body', JSON.stringify({
              exitOnError: true,
              calls: calls
            }));
            data = {
              url: url,
              method: "POST",
              data: formData,
              contentType: false,
              processData: false
            }
          }
          return {connector: connector, name: name, data: data, count: calls.length};
        }

        var callData = buildCallData(status);
        if (callData.count) {
          BusyIndicator.off(status);
          var confirmmsg = base.formatMessage(callData.count, self.get("confirmMessages"), callData.name);
          ModalAlert.confirmQuestion(confirmmsg, self.get("name"))
            .done(function() {
              BusyIndicator.on(status);
              callData.connector.makeAjaxCall(callData.data)
              .done(function(response) {
                var successmsg = base.formatMessage(response.calls.length, self.get("successMessages"), callData.name);
                deferred.resolve(response.calls);
                GlobalMessage.showMessage("success",successmsg);
              }).fail(function(request) {
                var errormsg = request.responseJSON ? request.responseJSON.error : request.statusText;
                var error = new Error(errormsg);
                error.suppressFailMessage = true;
                deferred.reject(error);
                GlobalMessage.showMessage("error",errormsg);
              });
            })
            .fail( function() {
              deferred.resolve();
            });
        } else {
          deferred.resolve();
        }
      }, deferred.reject );
      return deferred.promise();
    }

  });

  return RemoveRelationCommand;

});
