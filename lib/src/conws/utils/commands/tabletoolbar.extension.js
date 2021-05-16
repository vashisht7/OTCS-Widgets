/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



define( [
  "csui/lib/jquery", "csui/lib/underscore", "csui/utils/url",
  "csui/controls/globalmessage/globalmessage",
  'csui/controls/toolbar/toolitem.model',
  'i18n!conws/utils/commands/nls/commands.lang',
  'csui/utils/base'
], function ($, _, Url, GlobalMessage, ToolItemModel, lang, base) {

  function ToolbarExtension () {}

  _.extend(ToolbarExtension.prototype,{

    _addMenuItems: function (toolbarItems,businessWorkspaceTypes) {
      var toolItems = [];
      businessWorkspaceTypes.forEach(function(bwtype) {
        if (bwtype.templates.length>0) {
          bwtype.templates.forEach(function(tmpl){
            var subTypeName = tmpl.subType === 848 ? lang.BusinessWorkspaceTypeName : '';
            var toolItem = new ToolItemModel({
              signature: "AddConnectedWorkspace",
              name: tmpl.name,
              type: tmpl.subType,
              group: 'conws',
              commandData: { wsType: bwtype, subType: tmpl.subType, subTypeName: subTypeName, template: tmpl }
            });
            toolItems.push(toolItem);
          });
        }
      });
      if (toolItems.length>0) {
        toolItems.sort(function(a,b) {
          var aname = a.get("name"),
              bname = b.get("name"),
              result = base.localeCompareString(aname,bname,{usage:"sort"});
          return result;
        });
        toolItems.forEach(function(toolItem){
          toolbarItems.push(toolItem);
        });
      }
    },

    OnUpdateToolbar: function (args) {
      var done = args.async(),
          container = args.container,
          toolbarItems = args.toolbarItems,
          conwsTemplateToolItem = _.find(toolbarItems, function (toolItem) {
            if (toolItem.attributes.type === 848) {
              return toolItem;
            }
          });

      if (!!conwsTemplateToolItem) {
        conwsTemplateToolItem.set("signature", "AddCONWSTemplate");
        conwsTemplateToolItem.set("group", "conws");
      }
      var deferred = $.Deferred();
      var getWsTypesUrl = Url.combine(container.urlBase(), 'businessworkspacetypes');
      var ajaxOptions = container.connector.extendAjaxOptions({
        type: 'GET',
        url: getWsTypesUrl
      });

      var that = this;
      container.connector.makeAjaxCall(ajaxOptions)
          .done(function (response, statusText, jqxhr) {

            if (response && response.businessworkspacetypes && response.businessworkspacetypes.length>0) {
              that._addMenuItems(toolbarItems,response.businessworkspacetypes);
            }

            deferred.resolve.apply(deferred, arguments);
            done();
          })
          .fail(function (jqXHR, statusText, error) {
            var linesep = "\r\n",
                lines = [];
            if (statusText!=="error") {
              lines.push(statusText);
            }
            if (jqXHR.responseText) {
              var respObj = JSON.parse(jqXHR.responseText);
              if (respObj && respObj.error) {
                lines.push(respObj.error);
              }
            }
            if (error) {
              lines.push(error);
            }
            var errmsg = lines.length>0 ? lines.join(linesep) : undefined;
            GlobalMessage.showMessage("error",lang.ErrorLoadingAddItemMenu,errmsg);
            deferred.reject.apply(deferred, arguments);
            done();
          });

    }
  });

  return function (tableToolbarView) {
    var extension = new ToolbarExtension();
    tableToolbarView.on('before:updateAddToolbar', function() { extension.OnUpdateToolbar.apply(extension,arguments);} );

  };

});