csui.define(["module", "csui/lib/jquery", "csui/lib/underscore",
  "csui/utils/log",
  "hbs!esoc/widgets/utils/command/comment/comment.toolitem",
  "csui/controls/toolbar/toolitem.view",
  "i18n!esoc/widgets/tablecell/nls/lang"
], function (module, $, _, log, template, ToolItemView, Lang) {

  var CommentToolItemView = ToolItemView.extend({

    tagName: 'li',

    template: template,

    templateHelpers: function () {
      var commentCount = this.model.attributes.commandData.wnd_comments;
      var data = {
        renderIconAndText: this.options.renderIconAndText === true,
        renderTextOnly: this.options.renderTextOnly === true,
        isSeparator: this.model.isSeparator(),
        id: this.model.attributes.commandData.id,
        wnd_comments_title: this._getCommentsTitle(commentCount),
        wnd_comments_validated: commentCount > 99 ? '99+' : (commentCount > 0 ? commentCount : "")
      };
      return data;
    },

    constructor: function CommentToolItemView() {
      ToolItemView.prototype.constructor.apply(this, arguments);
    },

    /* TODO this should go to the widgets/common/util class and be used in all places, also the wnd_comments_validated */
    /* always return a non-empty string for aria-label and title */
    _getCommentsTitle: function(commentCount) {
      Number.isInteger = Number.isInteger || function(value) {
        return typeof value === 'number' &&
          isFinite(value) &&
          Math.floor(value) === value;
      };
      commentCount = Number.isInteger(commentCount) ? commentCount : 0;

      /* TODO should rather use _.str.sformat() and texts with placeholders in the lang.js files */
      if (commentCount !== 1) {
        return commentCount + " " + Lang.commentCount;
      } else {
        return "1 " + Lang.oneComment;
      }
    }
  });

  return CommentToolItemView;

});

