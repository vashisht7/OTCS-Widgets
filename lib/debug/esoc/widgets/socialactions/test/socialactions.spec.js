csui.define(['csui/lib/marionette', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/contexts/page/page.context',
  'csui/utils/testutils/async.test.utils',
  'esoc/widgets/utils/commentdialog/commentdialog.view', './socialactions.mock.js'
], function (Marionette, _, $, PageContext, asyncTestUtils, CommentDialogView, SocialActionsMock) {

  describe('Comment Widget', function () {
    // Declare objects used in the checks
    var context;

    // Initialize the objects first here to enable describe and iit
    // tricks; wait until the model gets fetched by the CS REST API
    // mock before any spec is executed
    beforeAll(function () {
      SocialActionsMock.enable();
      if (!context) {
        context = new PageContext({
          factories: {
            connector: {
              connection: {
                url: '//server/otcs/cs/api/v1',
                supportPath: '/support',
                session: {
                  ticket: 'dummy'
                }
              }
            }
          }
        });
      }
    });

    afterAll(function () {
      SocialActionsMock.disable();
      $('body').empty();
    });

    describe('Get the comments', function () {
      var commentDialogView, regionEl;

      beforeAll(function (done) {
        commentDialogView = new CommentDialogView({
          context: context,
          nodeid: 5000,
          CSID: 5000
        });
        regionEl = $('<div></div>').appendTo(document.body);
        new Marionette.Region({
          el: regionEl
        }).show(commentDialogView);
        done();
      });

      afterAll(function () {
        commentDialogView.destroy();
      });

      it('Rendered comment widget', function () {
        expect(commentDialogView.$el.find('cs-icon-comment')).toBeTruthy();
      });

      it('Get comments count', function () {
        expect(commentDialogView.$el.find('.wnd_comments_validated').text().trim()).toEqual("3");
      });

      it('Click comment icon and open a list of comments', function (done) {
        $('.cs-icon-comment').trigger('click');
        asyncTestUtils.asyncElement('body', '.esoc-social-comment-list-item').done(function (el) {
          expect(el.width()).toBeGreaterThan(0);
          done();
        });
      });

      it('Check attachment icon', function (done) {
        $('.esoc-header-emoji').trigger('click');
        asyncTestUtils.asyncElement(document.body,
            '.esoc-social-textinput-button-holder:visible').done(function (el) {
          expect(el.length).toBe(1);
          expect($('.esoc-social-comment-attachment-header').length).toBe(1);
          done();
        });
      });

      it('Click on attachment icon, opens binf-popover', function (done) {
        $('.esoc-social-comment-attachment-header').trigger('click');
        asyncTestUtils.asyncElement('body', '.esoc-social-comment-dialog-minheight:visible').done(
            function (el) {
              expect(el.length).toBe(1);
              // two options inside the attachment popover.
              expect($('a#esoc-social-attachment-cs-comment').length).toBe(1);
              expect($('a#esoc-social-attachment-desktop-comment').length).toBe(1);

              done();
            });
      });

      it('Click on option "from the content server" from binf-popover', function (done) {
        $('a#esoc-social-attachment-cs-comment').trigger('click');
        asyncTestUtils.asyncElement('body', '.csui-node-picker:visible').done(function (el) {
          expect(el.length).toBe(1);
          done();
        });
      });

      it('Select target for attachment', function (done) {
        $('.target-browse .csui-node-picker ul li .csui-selectable:first').trigger('click');
        asyncTestUtils.asyncElement('.target-browse.cs-dialog', '.cs-add-button:enabled').done(
            function (el) {
              expect(el.length).toEqual(1);
              done();
            });
      });

      it('Upload the attachment successfully', function (done) {
        $('.cs-add-button').trigger('click');
        asyncTestUtils.asyncElement('body', '.esoc-social-selected-file').done(function (el) {
          expect(el.length).toBe(1);
          $('.esoc-social-attachment-icon-delete:first').trigger('click');
          $('.esoc-header-emoji').trigger('click');
          done();
        });
      });

      it("Enable post button by writing a comment", function (done) {
        asyncTestUtils.asyncElement('body', '#esoc-social-comment-input').done(function (el) {
          el.val('abc');
          el.trigger("change");
          expect($('#esoc-social-comment-submit').attr('disabled')).toBe(undefined);
          done();
        });
      });

      it('Post a Comment', function (done) {
        $('#esoc-social-comment-submit').trigger('click');
        asyncTestUtils.asyncElement('body', '.wnd_comments_validated[title="4 comments"]').done(
            function (el) {
              expect(commentDialogView.$el.find('.wnd_comments_validated').text().trim()).toEqual(
                  "4");
              done();
            });
      });

      it('Click on delete button of a comment', function (done) {
        $('.esoc-social-comment-icon-delete')[0].trigger('click');
        asyncTestUtils.asyncElement('body', '#esoc-social-dialog:visible').done(
            function (el) {
              expect(el.length).toBe(1);
              done();
            });
      });

      it('Clicking on delete button in the confirmation dialog', function (done) {
        $('.esoc-social-dialog-delete-button').trigger('click');
        asyncTestUtils.asyncElement('body', '.esoc-social-comment-data[data-id=40]', true).done(
            function (el) {

              expect(commentDialogView.$el.find('.wnd_comments_validated').text().trim()).toEqual(
                  "3");
              done();
            });
      });

      it('Delete attachment for a comment', function (done) {
        $('.esoc-social-attachment-icon-delete:first').trigger('click');
        asyncTestUtils.asyncElement('body', '#esoc-social-dialog:visible').done(function (el) {
          expect(el.length).toBe(1);
          done();
        });
      });

      it('Confirm deleting attachment', function (done) {
        $('.esoc-social-dialog-delete-button').trigger('click');
        asyncTestUtils.asyncElement('body', '.esoc-social-attachment-icon-delete', true).done(
            function (el) {
              expect(el.length).toBe(0);
              done();
            });
      });

      it('Editing a comment', function (done) {
        $('.esoc-social-comment-icon-edit').eq(0).trigger('click');
        asyncTestUtils.asyncElement('body', '.esoc-comment-emoji:visible').done(function (el) {
          el.val('testing put call');
          var commentIcons = $('.esoc-social-edit-icons:visible');
          commentIcons.find('.esoc-social-comment-emoticon').trigger('click');
          $(commentIcons).find('.binf-popover.emoji-menu .myemoji a:first').trigger('click');
          asyncTestUtils.asyncElement('body', '.esoc-comment-emoji:visible > img[title = "Smile  :)"]:visible').done(function (el) {
            done();
          });
        });
      });

      it('Click on update button', function (done) {
        $('.esoc-social-comment-update').eq(0).trigger('click');
        asyncTestUtils.asyncElement('body', '.esoc-comment-emoji:visible', true).done(
            function (el) {
              var commentDataEl = $('.esoc-social-comment-data:first');
              expect(commentDataEl.text().trim()).toEqual("testing put call");
              expect($(commentDataEl).find('img[title = "Smile  :)"]:visible').length).toEqual(1);
              done();
            });
      });

      it('Click on Cancel button', function (done) {
        $('.esoc-social-comment-icon-edit').eq(0).trigger('click');
        asyncTestUtils.asyncElement('body', '.esoc-comment-emoji:visible').done(function (el) {
          $('.esoc-social-comment-cancel').eq(0).trigger('click');
          asyncTestUtils.asyncElement('body', '.esoc-comment-emoji:visible', true).done(
              function (el) {
                var commentDataEl = $('.esoc-social-comment-data:first');
                expect(commentDataEl.text().trim()).toEqual("testing put call");
                expect($(commentDataEl).find('img[title = "Smile  :)"]:visible').length).toEqual(1);
                done();
              });
        });
      });

      it('Hover over username for mini profile view', function (done) {
        $('.esoc-user-display-name').eq(2).trigger('mouseover');
        asyncTestUtils.asyncElement('body',
            '.esoc-mini-profile-actions:visible').done(function (el) {
          expect(el.length).toBe(1);
          done();
        });
      });

      it('Mouse leave on mini profile view', function (done) {
        $('.esoc-mini-profile-popover').trigger('mouseleave');
        asyncTestUtils.asyncElement('body', '.esoc-mini-profile-popover', true).done(function (el) {
          expect($('.esoc-mini-profile-popover').length).toBe(0);
          done();
        });
      });

      it('Open profile view', function (done) {
        $('.esoc-user-display-name').trigger('click');
        asyncTestUtils.asyncElement('body',
            '.esoc-user-widget-dialog:visible').done(function (el) {
          expect(el.length).toBe(1);
          done();
        });
      });

      it('close the profile view', function (done) {
        $('.esoc-user-widget-dialog-close').trigger('click');
        asyncTestUtils.asyncElement('body',
            '.esoc-simple-user-widget-view:visible', true).done(function (el) {
          expect(el.length).toBe(0);
          done();
        });
      });

      it('Click close button and close a comment widget view', function (done) {
        $('.cs-icon-comment').trigger('click');
        asyncTestUtils.asyncElement('body', '.esoc-social-comment-list-item').done(function (el) {
          expect(el.width()).toBeGreaterThan(0);
          $('.esoc-social-comment-close-button').trigger('click');
          expect($('.esoc-social-comment-widget').length).toBe(0);
          done();
        });
      });

    });

    describe('Get the reply comments', function () {
      var commentDialogView, regionEl;

      beforeAll(function (done) {
        commentDialogView = new CommentDialogView({
          context: context,
          nodeid: 5000,
          CSID: 5000
        });
        regionEl = $('<div></div>').appendTo(document.body);
        new Marionette.Region({
          el: regionEl
        }).show(commentDialogView);
        done();
      });

      afterAll(function () {
        commentDialogView.destroy();
      });

      it('Rendered comment widget', function () {
        expect(commentDialogView.$el.find('cs-icon-comment')).toBeTruthy();
      });

      it('Click comment icon and open a list of comments', function (done) {
        $('.cs-icon-comment').trigger('click');
        asyncTestUtils.asyncElement('body', '.esoc-social-comment-list-item').done(function (el) {
          expect(el.width()).toBeGreaterThan(0);
          done();
        });
      });

      it('Get reply comments count', function () {
        expect($($('.esoc-reply_link')[3].children).text().trim()).toEqual("(4)");
      });

      it('Click reply and open a list of reply comments', function (done) {
        $('.esoc-reply_link')[3].trigger('click');
        asyncTestUtils.asyncElement('body', '.esoc-social-reply-list-item').done(function (el) {
          expect(el.width()).toBeGreaterThan(0);
          done();
        });
      });

      it("Enable post button by writing a reply comment", function (done) {
        $('.esoc-reply_link:first').trigger('click');
        asyncTestUtils.asyncElement('body', '.esoc-social-reply-input').done(function (el) {
          el.val('abc');
          el.trigger("change");
          expect($('#esoc-social-reply-submit').attr('disabled')).toBe(undefined);
          done();
        });
      });

      it('Post a reply Comment', function (done) {
        $('#esoc-social-reply-submit').trigger('click');
        asyncTestUtils.asyncElement('body', "#esoc-social-reply-container .comments-list li").done(
            function (el) {
              expect(el.length).toBeGreaterThan(0);
              done();
            });
      });

      it('Delete a reply', function (done) {
        $('#esoc-social-reply-container .comments-list li:first').find(
            '.esoc-social-reply-delete-confirm').trigger('click');
        asyncTestUtils.asyncElement('body',
            '.binf-modal-dialog .esoc-social-dialog-delete-button:visible').done(function (el) {
          expect(el.length).toBeGreaterThan(0);
          done();
        });
      });

      it('Clicking on delete button in the confirmation dialog', function (done) {
        $('.esoc-social-dialog-delete-button').trigger('click');
        asyncTestUtils.asyncElement('body', '.esoc-social-reply-comment-data[data-id=13]',
            true).done(function (el) {
          expect($('#esoc-social-reply-container .comments-list li').length).toEqual(3);
          done();
        });
      });

      it('Editing reply comment', function (done) {
        $('.esoc-social-reply-container').find('.esoc-social-comment-icon-edit:first').trigger('click');
        asyncTestUtils.asyncElement('body', '.esoc-reply-emoji:visible').done(function (el) {
          el.val('testing put call');
          var Icons = $('.esoc-social-reply-icons-container:visible');
          Icons.find('.esoc-social-reply-emoticon').trigger('click');
          $(Icons).find('.binf-popover.emoji-menu .myemoji a:first').trigger('click');
          asyncTestUtils.asyncElement('body', '.esoc-reply-emoji-comment:visible > img[title = "Smile  :)"]:visible').done(function (el) {
            done();
          });
        });
      });

      it('Click on update button', function (done) {
        $('.esoc-social-reply-update:first').trigger('click');
        asyncTestUtils.asyncElement('body', '.esoc-reply-emoji-comment:visible', true).done(
            function (el) {
              var replyDataEl = $('.esoc-social-reply-comment-data:first');
              expect(replyDataEl.text().trim()).toEqual("testing put call");
              expect($(replyDataEl).find('img[title = "Smile  :)"]:visible').length).toEqual(1);
              done();
            });
      });

      it('Click on Cancel button', function (done) {
        $('.esoc-social-comment-icon-edit:nth-child(3)').trigger('click');
        asyncTestUtils.asyncElement('body', '.esoc-reply-emoji:visible').done(function (el) {
          $('.esoc-social-reply-cancel:first').trigger('click');
          asyncTestUtils.asyncElement('body', '.esoc-reply-emoji:visible', false).done(
              function (el) {
                var replyDataEl = $('.esoc-social-reply-comment-data:first');
                expect(replyDataEl.text().trim()).toEqual("testing put call");
                expect($(replyDataEl).find('img[title = "Smile  :)"]:visible').length).toEqual(1);
                done();
              });
        });
      });

      it('Delete a attachment of reply comment', function (done) {
        $('#reply_link_9').trigger('click');
        asyncTestUtils.asyncElement('body', "#reply_9 .esoc-social-reply-list-item:visible").done(
            function (el) {
              $('.esoc-social-reply-attachment-icon-delete:first').trigger('click');
              asyncTestUtils.asyncElement('body', '#esoc-social-dialog:visible').done(
                  function (el) {
                    expect(el.length).toBe(1);
                    done();
                  });
            });
      });

      it('Clicking on delete button in the confirmation dialog', function (done) {
        $('.esoc-social-dialog-delete-button').trigger('click');
        asyncTestUtils.asyncElement('body', '#esoc-social-reply-attachment-13',
            true).done(function (el) {
          expect(el.length).toBe(0);
          done();
        });
      });

      it('Click on attachment icon, opens binf-popover', function (done) {
        var attachmentIcon = $('#esoc-social-reply-container .comments-list li:first').find('.esoc-social-reply-list-actions .esoc-reply-attachment > a');
        attachmentIcon.trigger('focus');
        attachmentIcon.trigger('click');
        asyncTestUtils.asyncElement('body', '.esoc-social-comment-dialog-minheight:visible a.esoc-social-attachment-cs:visible').done(
            function (el) {
              expect(el.length).toBe(1);
              // two options inside the attachment popover.
              expect($('a.esoc-social-attachment-cs').length).toBe(1);
              expect($('a.esoc-social-attachment-desktop').length).toBe(1);
              done();
            });
      });

      it('Click on option "from the content server" from binf-popover', function (done) {
        $('a.esoc-social-attachment-cs:visible').trigger('click');
        asyncTestUtils.asyncElement('body', '.csui-node-picker:visible').done(function (el) {
          expect(el.length).toBe(1);
          done();
        });
      });

      it('Select target for attachment', function (done) {
        $('.target-browse .csui-node-picker ul li .csui-selectable:first').trigger('click');
        asyncTestUtils.asyncElement('.target-browse.cs-dialog', '.cs-add-button:enabled').done(
            function (el) {
              expect(el.length).toEqual(1);
              done();
            });
      });

      it('Upload the attachment successfully', function (done) {
        $('.cs-add-button').trigger('click');
        asyncTestUtils.asyncElement('#esoc-social-reply-container .comments-list li:first', '.esoc-social-attachment:visible').done(function (el) {
          expect(el.length).toBe(1);
          done();
        });
      });

      it('Click close button and close a comment widget view', function () {
        $('.esoc-social-comment-close-button').trigger('click');
        expect($('.esoc-social-comment-widget').length).toBe(0);
      });

    });

  });

});
