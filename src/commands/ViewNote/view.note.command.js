define([
  "require",
  "csui/lib/underscore",
  "csui/lib/jquery",
  "csui/models/command",
  "csui/utils/commandhelper",
  "i18n!otcss/commands/ViewNote/impl/nls/lang",
], function (require, _, $, CommandModel, CommandHelper, lang) {
  var ModalAlert;

  var ViewNoteCommand = CommandModel.extend({
    defaults: {
      signature: "otcss-view-note",
      name: lang.toolbarButtonTitle,
      scope: "single",
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get("type") === 144;
    },

    execute: function (status, options) {
      var deferred = $.Deferred();
      require([
        "csui/lib/marionette",
        "csui/lib/jquery",
        "csui/utils/connector",
        "csui/controls/rich.text.editor/rich.text.editor",
        "csui/controls/dialog/dialog.view",
        "csui/models/node/node.model",
        "csui/models/node.children2/node.children2",
      ], function (
        Marionette,
        $,
        Connector,
        RichTextEditor,
        DialogView,
        NodeModel,
        NodeChildren2Collection
      ) {
        var CKEDITOR = RichTextEditor.getRichTextEditor();
        if (status.originatingView === undefined) {
        } else {
          var $originatingView = status.originatingView.$el;
          $originatingView.append("<div class='dialogbox'></div>");
          //$originatingView.append('<input type="button" value="new button"/>');
          var dialog = $originatingView.parent().find(".dialogbox")[0];
          var contentRegion = new Marionette.Region({
            el: dialog,
          });
          var options = { title: "View Note", Size: "largeSize" };
          var control = new DialogView(options);
          control.render();
          contentRegion.show(control);

          var csProperties = $originatingView
            .parent()
            .find(".binf-modal-body")[0];
          CKEDITOR.stylesSet.add("my_styles", [
            // Block-level styles
            {
              name: "Blue Title",
              element: "div",
              styles: { "background-color": "Blue" },
            },
          ]);
          CKEDITOR.replace(csProperties, {
            height: "20em",
            uiColor: "#008000",
            width: "48em",
            stylesSet: "my_styles",
            contentsCss: "style.css",
          });
          $(".binf-modal-content").width("50em");
          $(".binf-modal-content").height("30em");
          var footer = $originatingView.parent().find(".binf-modal-content")[0];
          var r = $('<input type="button" value="SAVE"/>');
          $(footer).append(r);
          $("input").on("click", function () {
            var connection = {
              url: "http://localhost/otcs/cs.exe/api/v1",
              supportPath: "/otcssamples",
            };
            var connector = new Connector({
              connection: connection,
            });
            var ckeditordata = CKEDITOR.instances.editor1.getData();
            console.log(ckeditordata.replace(/<[^>]+>/g, ""));
            var link = window.location.href.split("/");
            var matchs =link[link.length - 1].match(/(\d+)/);
            console.log(matchs[0]);
            var container = new NodeModel(
              { id: parseInt(matchs[0]) },
              { connector: connector }
            );
            var children = new NodeChildren2Collection(undefined, {
              node: container,
            });
            var docsIds = [];
            var docIds = [];

            children.fetch().done(function () {
              docsIds = children.pluck("id");
              docsIds.forEach(function (value) {
                docIds.push(value.toString());
              });
              $.ajax({
                type: "POST",
                url: "http://localhost/otcs/cs.exe/api/v1/ckeditordata",
                dataType: "json",
                headers: {
                  Authorization: "Basic " + btoa("Admin" + ":" + "Sedin@123"),
                },
                data: {
                  data: ckeditordata.replace(/<[^>]+>/g, ""),
                  nodeid: docIds[0],
                },
              }).done(function (data) {
                console.log(data);
              });
              // var data = ckeditordata.replace(/<[^>]+>/g, "");
              // connector.makeAjaxCall({
              //   type: "POST",
              //   dataType: 'json',
              //   contentType: "application/x-www-form-urlencoded",
              //  data:{'data':data,'nodeid': docsIds[0]},
              //   url:
              //     "api/v1/ckeditordata",
              // }).then(
              //   function (response) {
              //     console.log(response);
              //   },
              //   function (jqxhr) {
              //     console.log("not authenticated");
              //   }
              // );
            });

           
          });
        }
      }, function (error) {
        deferred.reject(error);
      });

      return deferred.promise();
    },
  });

  return ViewNoteCommand;
});
