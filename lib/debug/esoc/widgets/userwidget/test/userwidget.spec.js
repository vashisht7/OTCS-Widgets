csui.define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/utils/connector',
  'csui/utils/contexts/factories/user',
  'csui/utils/testutils/async.test.utils',
  'esoc/controls/userwidget/userwidget.view',
  './userwidget.mock.js'
], function (_, $, Marionette, PageContext, Connector, User, TestUtils, UserWidgetControl,
    UserWidgetMock) {
  describe("UserWidget", function () {

    // Declare objects used in the checks
    var context, userWidgetViewModel, userwidgetRegion, defaultOptions, user;

    var userFetch = function () {
      var deferredObj = $.Deferred();
      user.fetch().done(function () {
        var customModelOptions  = _.extend({
              model: user.property
            }, defaultOptions),
            userWidgetViewModel = UserWidgetControl.extend({
              constructor: function CustomUserWidgetView(options) {
                options || (options = {});
                UserWidgetControl.prototype.constructor.apply(this, arguments);
              }
            }),
            // logged user set to admin always.
            userModal           = customModelOptions.context.getModel(User);
        if (userModal) {
          userModal.set('id', 1000);
        }
        // destroy already existing userwidgetregion if there is any.
        if (userwidgetRegion) {
          userwidgetRegion.destroy();
          userwidgetRegion.$el.remove();
        }
        userWidgetViewModel = new userWidgetViewModel(customModelOptions);
        userwidgetRegion = new Marionette.Region({
          el: $(
              '<div style="width:50px;height:20px;text-align: center;background-color: #ffffff; margin : 50px;"></div>').appendTo(
              document.body)
        });
        userwidgetRegion.show(userWidgetViewModel);
        deferredObj.resolve(userWidgetViewModel);

      });
      return deferredObj.promise();
    }

    describe("UserWidget with chat settings disable and userID name settings", function () {
      beforeAll(function () {
        UserWidgetMock.enable();
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
        defaultOptions = {
          context: context,
          connector: new Connector({
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/img',
              session: {
                ticket: 'dummy'
              }
            }
          }),
          userid: "1000", // mandatory
          showUserProfileLink: true, //Optional, default: false
          showMiniProfile: true, //Optional, default: false
          showUserWidgetFor: 'displayname', //Optional
          loggedUserId: "1000",//optional
          //Provide a wrapper class to override css for both profile pic and display name
          userWidgetWrapperClass: "",//Optional, default: blank
          id: "1000"
        };
        user = new User(context);
      });

      afterAll(function () {
        // Call cancelAllAsync before any the views gets destroyed.
        // Any changes in the dom might trigger running async calls from time out tests
        // or finished. By the time afterAll is called all async calls should have stopped.
        TestUtils.cancelAllAsync();

        UserWidgetMock.disable();

        // Always call restore last.
        TestUtils.restoreEnvironment();
      });

      describe("Simple User profile initiate", function () {
        beforeAll(function () {
          window.csui.require.config({
            config: {
              'esoc/controls/userwidget/userwidget.view': {
                enableSimpleUserProfile: true,
                enableProfilePicture: true
              }
            }
          });
        });
        afterAll(function () {
          window.csui.require.config({
            config: {
              'esoc/controls/userwidget/userwidget.view': {
                enableSimpleUserProfile: false,
                enableProfilePicture: false
              }
            }
          });
        });

        it('Render Userwidget widget', function (done) {
          userFetch().done(function (userWidgetViewModel) {
            expect(userWidgetViewModel.isRendered).toBeTruthy();
            done();
          });
        });

        it('Open a profile page when we click user information', function (done) {
          $('.esoc-user-profile-link').trigger("click");
          TestUtils.asyncElement('body',
              '.esoc-simple-user-widget-dialog.binf-in .cs-name:visible').done(
              function (el) {
                expect(el.is(':visible')).toBeTruthy();
                done();
              });
        });

        it('Can update profile picture based on enableProfilePicture setting', function () {
          expect($('.edit-user').length).toBe(1);
        });

        it('Display title of the user', function () {
          expect($('.esoc-user-title').length).toBe(1);
        });

        it('display the name based on name settings', function () {
          expect($('.esoc-user-name:first')[0].firstChild.data.trim()).toBe('Admin');
        });

        it('Verify the presence icon is disabled', function () {
          expect($('.esoc-chat-presence-indicator').length).toBe(0);
        });

        it('Open a mini profile view when we hover on manager name', function (done) {
          $('.esoc-simple-user-widget-form .esoc-user-mini-profile').trigger('mouseover');
          TestUtils.asyncElement('body', '.esoc-mini-profile-actions:visible').done(
              function (el) {
                expect(el.is(':visible')).toBeTruthy();
                done();
              });
        });

        it('Mouse leave on mini profile view using manager name', function (done) {
          $('.esoc-simple-user-widget-form .esoc-user-mini-profile').trigger('mouseleave');
          TestUtils.asyncElement('body', '.esoc-mini-profile-popover', true).done(function (el) {
            expect($('.esoc-mini-profile-popover').length).toBe(0);
            done();
          });
        });

        it('Open a mini profile view when we hover on manager image', function (done) {
          //we have one known issue - when we hover on first time then mini profile is not opened
          // so we need to use two times.
          //TODO - will remove this multiple mouseover's once we have fix that issue
          $('.user-default-image.image_user_placeholder').trigger('mouseover');
          TestUtils.asyncElement('body', '.csui-icon-edit.inline-edit-icon:visible').done(
              function (el) {
                $('.user-default-image.image_user_placeholder').trigger('mouseleave');
                TestUtils.asyncElement('body', '.esoc-mini-profile-popover', true).done(
                    function (el) {
                      expect($('.esoc-mini-profile-popover').length).toBe(0);
                      $('.user-default-image.image_user_placeholder').trigger('mouseover');
                      TestUtils.asyncElement('body', '.esoc-mini-profile-actions:visible').done(
                          function (el) {
                            expect(el.is(':visible')).toBeTruthy();
                            done();
                          });
                    });

              });
        });

        it('Mouse leave on mini profile view using manager image', function (done) {
          $('.user-default-image.image_user_placeholder').trigger('mouseleave');
          TestUtils.asyncElement('body', '.esoc-mini-profile-popover', true).done(function (el) {
            expect($('.esoc-mini-profile-popover').length).toBe(0);
            done();
          });
        });

        it('delete a profile page when we click profile image on logged user', function (done) {
          $('.esoc-full-profile-avatar-cursor').mouseover();
          $('.edit-user-image-placeholder.edit-user').trigger("click");
          TestUtils.asyncElement('body',
              '.esoc-simple-user-edit-pic-popover .esoc-simple-user-profile-pic-update:visible').done(
              function (el) {
                expect(el.length).toBe(1);
                $('.esoc-simple-user-profile-pic-delete').trigger("click");
                TestUtils.asyncElement('body', '.esoc-upload-image-style:visible', true).done(
                    function (el) {
                      expect(el.is(':visible')).toBeFalsy();
                      done();
                    });
              });
        });

        it('Open a manager profile page when we click manager image', function (done) {
          $('.esoc-simple-user-widget-form .user-photo').trigger("click");
          TestUtils.asyncElement('body', '.esoc-simple-user-widget-dialog.binf-in' +
                                         ' .slick-list .slick-current .cs-name:visible').done(
              function (el) {
                expect(el.length).toBe(1);
                var userName = $(el).text().trim();
                expect(userName).toEqual("Manager");
                done();
              });
        });

        it('Verify the chat icon is disabled', function () {
          expect($('.slick-current .esoc-user-profile-chat-comment').length).toBe(0);
        });

        it('Can not update profile picture of other user', function () {
          expect($('.slick-list .slick-current .edit-user').length).toBe(0);
        });

        it(' display initials in profile picture area when no picture or disable the picture enable option',
            function () {
              expect(
                  $(".slick-list .slick-current img.esoc-full-profile-avatar").css('display')).toBe(
                  'none');
              expect($(".slick-list .slick-current .esoc-user-show-profilepic").length).toBe(1);
            });

        it('Verify the title of the manager', function () {
          expect($('.slick-current .esoc-user-title').length).toBe(0);
        });

        it('close a profile page', function (done) {
          $('.esoc-simple-user-widget-dialog .slick-current .esoc-user-widget-dialog-close').trigger("click");
          TestUtils.asyncElement('body',
              '.esoc-simple-user-widget-dialog.binf-in .slick-slider:visible', true).done(
              function (el) {
                expect(el.is(':visible')).toBeFalsy();
                done();
              });
        });

        it('Open a manager profile page when we click manager name', function (done) {
          $('.esoc-simple-user-widget-form .esoc-user-container').trigger("click");
          TestUtils.asyncElement('body', '.esoc-simple-user-widget-dialog.binf-in' +
                                         ' .slick-list .slick-current .cs-name:visible').done(
              function (el) {
                expect(el.length).toBe(1);
                done();
              });
        });

        it('verify no permissions for edit by clicking on manager filed', function (done) {
          $('.binf-modal-dialog.binf-modal-lg.user1020 .esoc-simple-user-widget-manager .cs-field-read .csui-icon-edit').trigger("click");
          TestUtils.asyncElement('body',
              '.binf-modal-dialog.binf-modal-lg.user1020 .cs-field-write .csui-icon-edit.inline-edit-icon.edit-cancel:visible',
              true).done(
              function (cancelIcon) {
                expect(cancelIcon.is(':visible')).toBeFalsy();
                done();
              });
        });
        it('verify no permissions for edit by clicking on office location filed', function (done) {
          $('.binf-modal-dialog.binf-modal-lg.user1020 .esoc-simple-user-widget-office-location .cs-field-read .csui-icon-edit').trigger("click");
          TestUtils.asyncElement('body',
              '.binf-modal-dialog.binf-modal-lg.user1020 .cs-field-write .csui-icon-edit.inline-edit-icon.edit-cancel:visible',
              true).done(
              function (cancelIcon) {
                expect(cancelIcon.is(':visible')).toBeFalsy();
                done();
              });
        });
        it('verify no permissions for edit by clicking on email filed', function (done) {
          $('.binf-modal-dialog.binf-modal-lg.user1020 .esoc-simple-user-widget-email .cs-field-read .csui-icon-edit').trigger("click");
          TestUtils.asyncElement('body',
              '.binf-modal-dialog.binf-modal-lg.user1020 .cs-field-write .csui-icon-edit.inline-edit-icon.edit-cancel:visible',
              true).done(
              function (cancelIcon) {
                expect(cancelIcon.is(':visible')).toBeFalsy();
                done();
              });
        });
        it('verify no permissions for edit by clicking on phone filed', function (done) {
          $('.binf-modal-dialog.binf-modal-lg.user1020 .esoc-simple-user-widget-phone .cs-field-read .csui-icon-edit').trigger("click");
          TestUtils.asyncElement('body',
              '.binf-modal-dialog.binf-modal-lg.user1020 .cs-field-write .csui-icon-edit.inline-edit-icon.edit-cancel:visible',
              true).done(
              function (cancelIcon) {
                expect(cancelIcon.is(':visible')).toBeFalsy();
                done();
              });

        });

        it('close a profile page', function (done) {
          $('.esoc-simple-user-widget-dialog .slick-current .esoc-user-widget-dialog-close').trigger("click");
          TestUtils.asyncElement('body',
              '.esoc-simple-user-widget-dialog.binf-in .slick-slider:visible', true).done(
              function (el) {
                expect(el.is(':visible')).toBeFalsy();
                done();
              });
        });

        it('type in manager field user picker view dropdown opens', function (done) {
          TestUtils.asyncElement('body',
              '.esoc-simple-user-widget-dialog.binf-in .binf-modal-content').done(
              function (el) {
                var UserWidget = el;
                expect(el.is(':visible')).toBeTruthy();
                $('.esoc-simple-user-widget-manager .cs-field-read').mouseover();
                TestUtils.asyncElement('body',
                    '.esoc-simple-user-widget-manager .cs-field-read .csui-icon-edit').done(
                    function (el) {
                      el.trigger("click");
                      var userPickerTypeadhead = UserWidget.find('input.typeahead');
                      userPickerTypeadhead.val('a');
                      userPickerTypeadhead.trigger('keyup');
                      TestUtils.asyncElement(UserWidget,
                          'ul.typeahead.binf-dropdown-menu:visible').done(
                          function (el) {
                            expect(el.is(':visible')).toBeTruthy();
                            done();

                          });
                    });
              });
        });

        it('update a manager field using user picker view', function (done) {
          TestUtils.asyncElement('body',
              'ul.typeahead.binf-dropdown-menu>li').done(
              function (el) {
                expect(el.is(':visible')).toBeTruthy();
                $('.csui-userpicker-item').mouseover();
                $('.csui-userpicker-item').trigger("click");
                $('.typeahead.binf-form-control.cs-search.cs-userfield-height').trigger("blur");
                $('.cs-formfield.cs-userfield').mouseleave();
                $('.typeahead.binf-form-control.cs-search.cs-userfield-height').trigger("blur");
                TestUtils.asyncElement('body',
                    '.esoc-simple-user-widget-manager .cs-field-read:not(.binf-hidden)').done(
                    function (el) {
                      expect(el.is(':visible')).toBeTruthy();
                      done();
                    });
              });
        });

        it('verify edit by clicking on manager filed', function (done) {
          $('.esoc-simple-user-widget-manager .cs-field-read .csui-icon-edit').trigger("click");
          TestUtils.asyncElement('body',
              '.cs-field-write .csui-icon-edit.inline-edit-icon.edit-cancel:visible').done(
              function (cancelIcon) {
                expect(cancelIcon.is(':visible')).toBeTruthy();
                $(cancelIcon).trigger("click");
                TestUtils.asyncElement('body', '.cs-field-read:visible').done(function (readEl) {
                  expect(readEl.is(':visible')).toBeTruthy();
                  done();
                });

              });
        });
        it('verify edit by clicking on office location filed', function (done) {
          $('.esoc-simple-user-widget-office-location .cs-field-read .csui-icon-edit').trigger("click");
          TestUtils.asyncElement('body',
              '.cs-field-write .csui-icon-edit.inline-edit-icon.edit-cancel:visible').done(
              function (cancelIcon) {
                expect(cancelIcon.is(':visible')).toBeTruthy();
                $(cancelIcon).trigger("click");
                TestUtils.asyncElement('body', '.cs-field-read:visible').done(function (readEl) {
                  expect(readEl.is(':visible')).toBeTruthy();
                  done();
                });

              });
        });
        it('verify edit by clicking on email filed', function (done) {
          $('.esoc-simple-user-widget-email .cs-field-read .csui-icon-edit').trigger("click");
          TestUtils.asyncElement('body',
              '.cs-field-write .csui-icon-edit.inline-edit-icon.edit-cancel:visible').done(
              function (cancelIcon) {
                expect(cancelIcon.is(':visible')).toBeTruthy();
                $(cancelIcon).trigger("click");
                TestUtils.asyncElement('body', '.cs-field-read:visible').done(function (readEl) {
                  expect(readEl.is(':visible')).toBeTruthy();
                  done();
                });
              });
        });
        it('verify edit by clicking on phone filed', function (done) {
          $('.esoc-simple-user-widget-phone .cs-field-read .csui-icon-edit').trigger("click");
          TestUtils.asyncElement('body',
              '.cs-field-write .csui-icon-edit.inline-edit-icon.edit-cancel:visible').done(
              function (cancelIcon) {
                expect(cancelIcon.is(':visible')).toBeTruthy();
                $(cancelIcon).trigger("click");
                TestUtils.asyncElement('body', '.cs-field-read:visible').done(function (readEl) {
                  expect(readEl.is(':visible')).toBeTruthy();
                  done();
                });
              });

        });

        it('close a profile page', function (done) {
          $('.esoc-simple-user-widget-dialog .esoc-user-widget-dialog-close').trigger("click");
          TestUtils.asyncElement('body', '.esoc-simple-user-widget-dialog',
              true).done(
              function (el) {
                expect(el.length).toBe(0);
                done();
              });
        });
      });

      describe("Simple user view with profile picture disabled", function () {
        beforeAll(function () {
          window.csui.require.config({
            config: {
              'esoc/controls/userwidget/userwidget.view': {
                enableSimpleUserProfile: true
              }
            }
          });
        });

        afterAll(function () {
          window.csui.require.config({
            config: {
              'esoc/controls/userwidget/userwidget.view': {
                enableSimpleUserProfile: false
              }
            }
          });

        });

        it('Render Userwidget widget', function (done) {
          userFetch().done(function (userWidgetViewModel) {
            expect(userWidgetViewModel.isRendered).toBeTruthy();
            done();
          });
        });

        it('Can not update profile picture based on enableProfilePicture settings',
            function (done) {
              $('.esoc-user-profile-link').trigger("click");
              TestUtils.asyncElement('body',
                  '.esoc-simple-user-widget-dialog.binf-in .cs-name:visible').done(
                  function (el) {
                    expect(el.length).toBe(1);
                    expect($('.edit-user').length).toBe(0);
                    done();
                  });
            });

        it('close a profile page', function (done) {
          $('.esoc-simple-user-widget-dialog .esoc-user-widget-dialog-close').trigger("click");
          TestUtils.asyncElement('body', '.esoc-simple-user-widget-dialog',
              true).done(
              function (el) {
                expect(el.length).toBe(0);
                done();
              });
        });
      });
    });

    describe("UserWidget with chat settings enabled",
        function () {
          beforeAll(function () {
            UserWidgetMock.chatSettings = true;
            UserWidgetMock.enable();
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
            defaultOptions = {
              context: context,
              connector: new Connector({
                connection: {
                  url: '//server/otcs/cs/api/v1',
                  supportPath: '/img',
                  session: {
                    ticket: 'dummy'
                  }
                }
              }),
              userid: "1000", // mandatory
              showUserProfileLink: true, //Optional, default: false
              showMiniProfile: true, //Optional, default: false
              showUserWidgetFor: 'displayname', //Optional
              loggedUserId: "1000",//optional
              //Provide a wrapper class to override css for both profile pic and display name
              userWidgetWrapperClass: "",//Optional, default: blank
              id: "1000"
            };
            user = new User(context);
          });

          afterAll(function () {
            // Call cancelAllAsync before any the views gets destroyed.
            // Any changes in the dom might trigger running async calls from time out tests
            // or finished. By the time afterAll is called all async calls should have stopped.
            TestUtils.cancelAllAsync();

            UserWidgetMock.disable();

            // Always call restore last.
            TestUtils.restoreEnvironment();
          });

          describe("Simple User profile initiate", function () {
            beforeAll(function () {
              window.csui.require.config({
                config: {
                  'esoc/controls/userwidget/userwidget.view': {
                    enableSimpleUserProfile: true,
                    enableProfilePicture: true
                  }
                }
              });
            });
            afterAll(function () {
              window.csui.require.config({
                config: {
                  'esoc/controls/userwidget/userwidget.view': {
                    enableSimpleUserProfile: false,
                    enableProfilePicture: false
                  }
                }
              });
            });

            it('Render Userwidget widget', function (done) {
              userFetch().done(function (userWidgetViewModel) {
                expect(userWidgetViewModel.isRendered).toBeTruthy();
                done();
              });
            });

            it('Open a profile page when we click user information', function (done) {
              $('.esoc-user-profile-link').trigger("click");
              TestUtils.asyncElement('body',
                  '.esoc-simple-user-widget-dialog.binf-in .esoc-chat-presence-Unknown:visible').done(
                  function (el) {
                    expect(el.is(':visible')).toBeTruthy();
                    done();
                  });
            });

            it('Verify the presence icon is enabled', function () {
              expect($('.esoc-chat-presence-indicator').length).toBe(1);
            });

            it('Open a manager profile page when we click manager image', function (done) {
              $('.esoc-simple-user-widget-form .user-photo').trigger("click");
              TestUtils.asyncElement('body', '.esoc-simple-user-widget-dialog.binf-in' +
                                             ' .slick-list .slick-current .cs-name:visible').done(
                  function (el) {
                    expect(el.length).toBe(1);
                    done();
                  });
            });

            it('Verify the chat icon is enabled', function () {
              expect($('.slick-current .esoc-user-profile-chat-comment').length).toBe(1);
            });

            it('close a profile page', function (done) {
              $('.esoc-simple-user-widget-dialog .slick-current .esoc-user-widget-dialog-close').trigger("click");
              TestUtils.asyncElement('body',
                  '.esoc-simple-user-widget-dialog.binf-in .slick-slider:visible', true).done(
                  function (el) {
                    expect(el.length).toBe(0);
                    $('.esoc-simple-user-widget-dialog .esoc-user-widget-dialog-close').trigger("click");
                    TestUtils.asyncElement('body', '.esoc-simple-user-widget-dialog',
                        true).done(
                        function (el) {
                          expect(el.length).toBe(0);
                          done();
                        });
                  });
            });

          });

          describe("Old User profile initiate", function () {

            afterAll(function () {
              $('body').empty();
            });

            it('Render Userwidget widget', function (done) {
              userFetch().done(function (userWidgetViewModel) {
                expect(userWidgetViewModel.isRendered).toBeTruthy();
                done();
              });
            });

            it('Click to open the old user profile', function (done) {
              $('.esoc-user-profile-link').trigger("click");
              TestUtils.asyncElement('.binf-modal-dialog', '.esoc-user-job-description:visible')
                  .done(function (el) {
                    expect(el.is(':visible')).toBeTruthy();
                    done();
                  });
            });

            it('Click on close icon to close the old user profile', function (done) {
              $(".cs-close .esoc-user-widget-dialog-close").trigger("click");
              TestUtils.asyncElement('body', '.binf-modal-dialog', true)
                  .done(function (el) {
                    expect(!el.is(':visible')).toBeTruthy();
                    done();
                  });
            });

          });

        });
  });
});
