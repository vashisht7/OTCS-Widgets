define(['require', 'csui/lib/underscore', 'csui/lib/jquery',
'csui/models/command', 'csui/utils/commandhelper',
'i18n!otcss/commands/NoteComment/impl/nls/lang'
],function(require, _, $, CommandModel, CommandHelper,lang) {
    var ModalAlert;

  var NoteCommentCommand = CommandModel.extend({

    defaults: {
      signature: 'otcss-note-comment',
      name     : lang.toolbarButtonTitle,
      scope    : 'single'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get('type') === 848;
    },

    execute: function (status, options) {
      var self     = this,
          deferred = $.Deferred();
      require(['csui/lib/backbone'
      ], function (Backbone) {
        var Router = Backbone.Router.extend({});
           
        var routerobj = new Router();
        routerobj.navigate("/lp",{trigger : true,replace : true});
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    }

  });

  return NoteCommentCommand;

});