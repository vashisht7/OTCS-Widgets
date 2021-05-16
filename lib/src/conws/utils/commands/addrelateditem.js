/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'i18n!conws/utils/commands/nls/commands.lang',
  'csui/models/action',
  'csui/models/command', 'conws/utils/workspaces/busyindicator'
], function (require, _, $, lang, ActionModel, CommandModel, BusyIndicator ) {
  'use strict';

  function getAction(status) {
    var model = status.collection && status.collection.workspace;
    var action;
    if (model && model.actions) {
      action = model.actions.get ? model.actions.get("add-relitem") : model.actions["add-relitem"];
    }
    return action;
  }

    var AddRelationCommand = CommandModel.extend({
  
      defaults: {
        signature: "AddRelation",
        command_key: ['add-relitem'],
        scope: "multiple",
        name: lang.CommandNameAddRelatedItem,
        verb: lang.CommandVerbAddRelatedItem,
        successMessages: {
          formatForNone: lang.AddRelatedItemsNoneMessage,
          formatForOne: lang.AddOneRelatedItemSuccessMessage,
          formatForTwo: lang.AddSomeRelatedItemsSuccessMessage,
          formatForFive: lang.AddManyRelatedItemsSuccessMessage
        }
      },

      enabled: function(status) {
        var enabled = false;
        if (status.data && status.data.submit) {
          if (status.nodes && status.nodes.length) {
            enabled = !!getAction(status);
          }
        } else {
          enabled = !!getAction(status);
        }
        return enabled;
      },

      execute: function(status, options) {
        status.suppressSuccessMessage = true;
        if (status.data && status.data.submit) {
          return this.submitNodes(status,options);
        } else {
          return this.openSearch(status,options);
        }
      },

      submitNodes: function(status,options) {
        var self = this;
        var deferred = $.Deferred();
        status.suppressSuccessMessage = true;
        BusyIndicator.on(status);
        deferred.always(function(){
         BusyIndicator.off(status);
        });
        require([ 'csui/lib/underscore', 'csui/utils/base', 'csui/utils/url',
          'csui/controls/globalmessage/globalmessage'
        ], function ( _, base, Url, GlobalMessage) {
  
          function buildCallData(status) {
            var nodes = status.nodes;
            var connector, name, data;
            var calls = [];
            var action = getAction(status);
            if (nodes && action) {
              nodes.each(function (node) {
                  connector = node.connector;
                  name = node.get("name");
                  var href = action.href || action.get('href')/*href: "/api/v2/businessworkspaces/98015/relateditems"*/;
                  var match = href.match(/^\/?api\/v([0-9\.])+\/([^?#]+)/i);
                  var requestArgs = _.extend(Url.urlParams(href),{
                    rel_bw_id: node.get("id"),
                    rel_type: node.get("rel_type")
                  });
                  var call = {
                    apiCall: (match && match.length>=3) ? match[2] : href,
                    params: {
                      fRequestArgs: requestArgs,
                      fVersionNumber: (match && match.length>=2) ? parseInt(match[1]) : 2,
                      fParamTicket: "",
                      fParamMethod: action.method || action.get('method')/*method: "POST"*/,
                      fCallName: href
                    }
                  };
                  calls.push(call);
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
            callData.connector.makeAjaxCall(callData.data)
            .done(function(response) {
              var successmsg = base.formatMessage(response.calls.length, self.get("successMessages"), callData.name);
              deferred.resolve(status.nodes);
              GlobalMessage.showMessage("success",successmsg);
              status.originatingView && status.originatingView.trigger("cmd:success", self.get("signature"), status.nodes );
            }).fail(function(request) {
              var errormsg = request.responseJSON ? request.responseJSON.error : request.statusText;
              var error = new Error(errormsg);
              error.suppressFailMessage = true;
              deferred.reject(error);
              GlobalMessage.showMessage("error",errormsg);
              status.originatingView && status.originatingView.trigger("cmd:failure", self.get("signature"), error );
            });
          } else {
            deferred.resolve();
          }
        }, deferred.reject );
        return deferred.promise();
      },

      openSearch: function(status,options) {
        var self = this;
        var deferred = $.Deferred();
        status.suppressSuccessMessage = true;
        var action = getAction(status);
        if (action) {
          require(['conws/widgets/relatedworkspaces/addrelatedworkspaces.search'
          ], function (
            AddRelatedWorkspacesSearch
          ) {
            var addWkspSearch = new AddRelatedWorkspacesSearch({
              title: self.get("name"),
              signature: self.get("signature"),
              status: status
            });

            var lasterror;
            addWkspSearch.searchView.on("go:back", function() {
              if (lasterror) {
                lasterror.suppressFailMessage = true;
                deferred.reject(lasterror);
              } else {
                deferred.resolve();
              }
            });
            addWkspSearch.searchView.on("cmd:success", function(sig,result) {
              if (sig===self.get("signature")) {
                lasterror = undefined;
                addWkspSearch.close();
                result.each(function(node){
                  var rel_source = node.get("rel_source");
                  var rel_target = node.get("id");
                  var rel_type = node.get("rel_type");
                  var href = _.str.sformat("/api/v2/businessworkspaces/{0}/relateditems/{1}?rel_type={2}", rel_source, rel_target, rel_type);
                  var del_action = new ActionModel({
                    body: "",
                    content_type: "",
                    form_href: "",
                    href: href,
                    method: "DELETE",
                    name: lang.ServerCommandNameDeleteRelatedItem/*"Remove related item"*/,
                    signature: "deleterelateditem"
                  },{
                    connector: node.connector
                  });
                  node.actions.add(del_action);
                });
                deferred.resolve(result.models);
              }
            });
            addWkspSearch.searchView.on("cmd:failure", function(sig,error) {
              if (sig===self.get("signature")) {
                lasterror = error;
              }
            });
  
            addWkspSearch.show();

          }, deferred.reject );
        }
        else {
          deferred.resolve();
        }

        return deferred.promise();
      }


    });

    return AddRelationCommand;
  
  });
  