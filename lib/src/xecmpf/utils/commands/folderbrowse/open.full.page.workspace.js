/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/models/command',
  'csui/utils/contexts/factories/connector',
  'csui/utils/url',
  'csui/dialogs/modal.alert/modal.alert',
  'i18n!xecmpf/utils/commands/nls/localized.strings'
], function (module, require, $, _, CommandModel, ConnectorFactory, Url, ModalAlert, lang) {
  var OpenFullPageWorkpsace = CommandModel.extend({
    defaults: {
      signature: 'WorkspacePage',
      name: lang.OpenFullPageWorkpsace,
      scope: 'single'
    },

    enabled: function (status, options) {
      var config = _.extend({
        enabled: false
      }, module.config());
      return config.enabled && !!status.container;
    },
    execute: function (status, options) {
      var that = this,
          config = _.extend({
              fullPageOverlay: false,
          }, module.config()),
          deferred = $.Deferred(),
          context = status.originatingView ? status.originatingView.context : options && options.context,
          urlPrefix = 'xecm',
          connector = context.getObject(ConnectorFactory),
          cgiUrl = connector && connector.connection && connector.connection.url ?
                   connector.connection.url.replace('/api/v1', '') : '',
          currentWindowRef = window,
          applyTheme = !!status && !!status.data && !!status.data.applyTheme,
          themePath = applyTheme ? $(currentWindowRef.document).find(
              "head > link[data-csui-theme-overrides]").attr('href') : undefined,
          fullPageWorkspaceUrl = Url.combine(cgiUrl, urlPrefix, 'nodes',
              status.container.get('id')),
          xhr = new XMLHttpRequest(),
          targetOrigin = new Url(cgiUrl).getAbsolute();
        if (config.fullPageOverlay) {
          require(['xecmpf/widgets/integration/folderbrowse/modaldialog/modal.dialog.view',
                  'xecmpf/widgets/integration/folderbrowse/full.page.workspace.view', 'csui/models/node/node.model',
                  'csui/utils/contexts/factories/node',
                  'csui/utils/contexts/perspective/perspective.context',
                  'csui/controls/perspective.panel/perspective.panel.view',
                  'csui/utils/commands',
                  'csui/utils/contexts/perspective/plugins/node/node.extra.data'
            ],
            function (ModalDialogView, FullPageWorkspaceView, NodeModel, NodeModelFactory, PerspectiveContext, PerspectivePanelView, commands, NodeExtraData) {
              that.authenticate(xhr, cgiUrl, connector);
              xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                  var viewMode = context.options.viewMode || {};
                  if (viewMode.viewIFrame === undefined || viewMode.viewIFrame) {
                    if (config.extSystemId && config.busObjectType && config.busObjectId ) {
                      var queryParams = "where_ext_system_id=" + config.extSystemId +
                          "&where_bo_type=" + config.busObjectType +
                          "&where_bo_id=" + config.busObjectId +
                          "&view_mode=fullPage";
                      fullPageWorkspaceUrl = Url.appendQuery(fullPageWorkspaceUrl, queryParams);
                    }
                    fullPageWorkspaceUrl = Url.appendQuery(fullPageWorkspaceUrl, "pageOverlay=true");
                    var fullPageWorkspaceView = new FullPageWorkspaceView({
                            fullPageWorkspaceUrl: fullPageWorkspaceUrl
                        }),
                        dialog = new ModalDialogView({
                            title: status.container.get("name"),
                            className: 'xecm-modal-dialog',
                            iconRight: "icon-tileCollapse",
                            view: fullPageWorkspaceView
                        });
                    dialog.show();
                    currentWindowRef.addEventListener("message", function (e) {
                      if (e.origin &&
                        (new RegExp(e.origin, "i").test(new Url(cgiUrl).getOrigin()))) {
                          if (e.data) {
                            if (e.data.status === 'closeDialog') {
                              dialog.$el.find(".cs-close").trigger("click");
                            } else if (e.data.status === 'showDialogHeader') {
                              dialog.$el.find(".xecm-modal-header").show();
                            } else if (e.data.status === 'hideDialogHeader') {
                                dialog.$el.find(".xecm-modal-header").hide();
                            }
                          }
                      }
                    });

                    if (applyTheme) {
                      var setTheme = function (e) {
                        if (e.origin &&
                          (new RegExp(e.origin, "i").test(new Url(cgiUrl).getOrigin()))) {
                          if (e.data) {
                            if (e.data.status === "ok") {
                              e.source.postMessage({
                                  "themePath": themePath
                              }, targetOrigin);
                                currentWindowRef.removeEventListener("message", setTheme, false);
                            }
                          }
                        }
                      }
                      currentWindowRef.addEventListener("message", setTheme);
                    }
                  } else {
                    var data = {
                      viewMode: viewMode
                    };
                    var fullPageNoIFrameOptions = {
                      data: data,
                      nodeID: status.container.get('id'),
                      status: status,
                      context: context,
                      connector: connector,
                      renderType: 'dialog'
                    };
                    var fullPageWorkspace = new FullPageWorkspaceView(fullPageNoIFrameOptions);
                    dialog = new ModalDialogView({
                      title: status.container.get("name"),
                      className: 'xecm-modal-dialog',
                      iconRight: "icon-tileCollapse",
                      view: fullPageWorkspace
                    });
                    dialog.show();
                    require.config({
                      config: {
                        'conws/widgets/header/header.view': {
                          enableCollapse: config.fullPageOverlay
                        },
                        'xecmpf/widgets/header/header.view': {
                          enableCollapse: config.fullPageOverlay
                        },
                        'xecmpf/utils/commands/folderbrowse/open.full.page.workspace': {
                          enabled: false
                        }
                      }
                    });
                  }
                }
              }
              deferred.resolve();
            },
            function (error) {
              deferred.reject(error);
            });
        } else {
          var targetWindowRef = currentWindowRef.open('');
            this.authenticate(xhr, cgiUrl, connector);
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                targetWindowRef.location.href = fullPageWorkspaceUrl;
                if (applyTheme) {
                  currentWindowRef.addEventListener("message", function (e) {
                    if (e.origin && (new RegExp(e.origin, "i").test(new Url(cgiUrl).getOrigin()))) {
                      if (e.data) {
                        if (e.data.status === "ok") {
                            targetWindowRef.postMessage({
                                "themePath": themePath
                            }, targetOrigin);
                        }
                      }
                    }

                  });
                }
              }
                deferred.resolve();
            }
        }
        return deferred.promise();
    },
    authenticate: function (xhr, cgiUrl, connector) {
      if (connector.connection.session && connector.connection.session.ticket) {
        this.authenticateworkspace(xhr, cgiUrl, connector);
      } else if (!!connector.connection.credentials) {
        var that    = this,
            request = new XMLHttpRequest();
        request.onreadystatechange = function () {
          if (request.readyState === 4) {
            try {
              if (request.status === 200) {
                var contentType = request.getResponseHeader('content-type');
                if (/^application\/json/i.test(contentType)) {
                  var response = JSON.parse(request.responseText);
                  connector.connection.session = response;
                  that.authenticateworkspace(xhr, cgiUrl, connector);
                } else {
                  throw new Error('Unsupported content type: ' + contentType);
                }
              } else {
                throw new Error(request.status + ' ' + request.statusText);
              }
            } catch (error) {
              console.error(error);
            }
          }
        };
        request.open('POST', connector.connection.url + '/auth', true);
        request.setRequestHeader('Accept', 'application/json');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.send('username=' + encodeURIComponent(connector.connection.credentials.username) +
                     '&' + 'password=' +
                     encodeURIComponent(connector.connection.credentials.password));
      } else {
        ModalAlert.showError(lang.AuthenticationError);
      }
    },
    authenticateworkspace: function (xhr, cgiUrl, connector) {
      xhr.open("GET", cgiUrl + "/xecmauth", true);
      xhr.setRequestHeader("OTCSTicket", connector.connection.session.ticket);
      xhr.withCredentials = true;
      xhr.send(null);
    }
  });

  return OpenFullPageWorkpsace;
});