/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery", "csui/lib/underscore", "csui/lib/marionette", "csui/lib/backbone",
  "csui/widgets/permissions/permissions.view", "csui/utils/contexts/page/page.context",
  "csui/utils/contexts/factories/node", "csui/utils/contexts/factories/member",
  "./permissions.mock.data.js", 'csui/models/action', 'csui/models/actions',
  "../../../utils/testutils/async.test.utils.js",
  "csui/lib/jquery.mousehover"
], function ($, _, Marionette, Backbone, PermissionsView, PageContext, NodeModelFactory,
    MemberModelFactory,
    PermissionsMock, ActionModel, ActionCollection,
    TestUtils) {
  describe("Permissions View", function () {
    var context,
        ownerTitle                 = "Owner access",
        ownerName                  = "Admin",
        permissionLevelFullControl = "Full control",
        permissionLevelRead        = "Read",
        groupOwnerTitle            = "Group owner access",
        groupOwnerName             = "DefaultGroup",
        publicAccessName           = "Public Access",
        addOwnerOrOwnerGroup       = "Add owner or owner group",
        noOwnerAssignedValue       = "No owner assigned",
        addMajorVersion            = "Add major version";

    beforeAll(function () {
      PermissionsMock.enable();
      context = new PageContext({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v2',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          }
        }
      });

    });

    afterAll(function () {
      TestUtils.cancelAllAsync();

      PermissionsMock.disable();
      TestUtils.restoreEnvironment();
    });

    describe("For user with edit permission rights", function () {
      var userWithEditPermissionRights;
      beforeAll(function () {
        userWithEditPermissionRights = 1000;
      });

      describe("View having Owner,Group Owner and Public access", function () {
        var v1, node1, region1, permissionTableBody, permissionTableRows, ownerRow, userGroup,
            authUser;
        beforeAll(function (done) {
          node1 = context.getModel(NodeModelFactory, {attributes: {id: 11111}});
          authUser = context.getModel(MemberModelFactory, {attributes: {id: 1000}});
          node1.setExpand('permissions', '11111');
          var actionModel  = new ActionModel({
                method: "GET",
                name: "permissions",
                signature: "permissions"
              }),
              actionModel1 = new ActionModel({
                method: "GET",
                name: "editpermissions",
                signature: "editpermissions"
              });
          node1.actions = new ActionCollection([actionModel, actionModel1]);
          authUser.fetch().always(function () {
            v1 = new PermissionsView({
              context: context,
              model: node1,
              authUser: authUser
            });
            region1 = new Marionette.Region({
              el: $('<div id="permissions-view1"></div>').appendTo(document.body)
            });
            region1.show(v1);
            TestUtils.asyncElement(v1.$el, '.csui-table-list-body:visible').done(function () {
              permissionTableBody = v1.$el.find(".csui-table-list-body");
              permissionTableRows = permissionTableBody.find(".csui-table-row");
              done();
            });
          });

        });

        afterAll(function () {
          node1.destroy();
          v1.destroy();
          $('#permissions-view1').remove();
        });

        it("view can be instantiated", function () {
          expect(v1).toBeDefined();
          expect(v1.$el.length > 0).toBeTruthy();
          expect(v1.el.childNodes.length > 0).toBeTruthy();
          expect(v1.$el.attr('class')).toContain('cs-permissions');
        });

        it("contains Owner as first entry", function () {
          expect(permissionTableBody.length).toEqual(1);
          expect(permissionTableRows.length).toBeGreaterThan(0);
          ownerRow = permissionTableRows.eq(0);
          var ownerClass = ownerRow.find(".icon_permmision_owner");
          expect(ownerClass.length).toEqual(1);
          var ownerDisplayName = ownerRow.find(".csui-user-display-name").text();
          expect(ownerDisplayName).toEqual(ownerName);
          var ownerTitleClassValue = $(ownerClass)[0].getAttribute('title');
          expect(ownerTitleClassValue).toEqual(ownerTitle);
          var permissionLevelClass = ownerRow.find(".csui-permission-level");
          expect(permissionLevelClass.text()).toEqual(permissionLevelFullControl);
        });

        it("contains Group Owner as second entry after Owner", function () {
          ownerRow = permissionTableRows.eq(1);
          var groupOwnerClass = ownerRow.find(".icon_permmision_owner_group");
          expect(groupOwnerClass.length).toEqual(1);
          var groupOwnerDisplayName = ownerRow.find(".csui-user-display-name").text();
          expect(groupOwnerDisplayName).toEqual(groupOwnerName);
          var ownerTitleClassValue = $(groupOwnerClass)[0].getAttribute('title');
          expect(ownerTitleClassValue).toEqual(groupOwnerTitle);
          var permissionLevelClass = ownerRow.find(".csui-permission-level");
          expect(permissionLevelClass.text()).toEqual(permissionLevelRead);
        });

        it("contains Public access as third entry after Owner and Group Owner respectively",
            function () {
              ownerRow = permissionTableRows.eq(2);
              var publicAccessClass = ownerRow.find(".icon_permmision_public");
              expect(publicAccessClass.length).toEqual(1);
              var publicAccessDisplayName = ownerRow.find(".csui-user-display-name").text();
              expect(publicAccessDisplayName).toEqual(publicAccessName);
              var permissionLevelClass = ownerRow.find(".csui-permission-level");
              expect(permissionLevelClass.text()).toEqual(permissionLevelRead);
            });

        xdescribe("Change Owner permission", function () {
          var tableRows, inlineAction, i;
          beforeAll(function () {
            tableRows = v1.$el.find(".csui-table-list-body .csui-table-body .csui-table-row");
          });
          for (i = 0; i < 2; i++) {
            it("should show change owner action on hovering over the owner item", function (done) {
              tableRows.eq(0).trigger(
                  {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
              TestUtils.asyncElement(v1.$el,
                  ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul").done(
                  function (el) {
                    inlineAction = tableRows.eq(0).find(
                        ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul");
                    expect(el.length).toEqual(1);
                    var changeOwnerAction = el.find(
                        "li[data-csui-command='changeownerpermission']");
                    expect(changeOwnerAction.length).toEqual(1);
                    done();
                  });
            });

            it("should open change owner lookup on click of change owner permission ",
                function (done) {
                  var changeOwnerAction = inlineAction.find(
                      "li[data-csui-command='changeownerpermission'] a");
                  changeOwnerAction.trigger("click");
                  TestUtils.asyncElement(v1.$el,
                      '.csui-inline-owner-change .csui-control-userpicker').done(
                      function (el) {
                        var changeOwnerLookup = el.find(".typeahead[type='text']"),
                            saveButton        = v1.$el.find(
                                ".csui-inline-owner-change .cs-save-button[disabled]"),
                            cancelButton      = v1.$el.find(
                                ".csui-inline-owner-change .cs-cancel-button");
                        expect(changeOwnerLookup.length).toEqual(1);
                        expect(saveButton.length).toEqual(1);
                        expect(cancelButton.length).toEqual(1);
                        done();
                      });
                });
            describe("Change Owner Permission Lookup", function () {
              var changeOwnerLookUp, cancelButton, ownerRow;

              beforeAll(function () {
                changeOwnerLookUp = tableRows.eq(0).find(
                    ".csui-control-userpicker .typeahead[type='text']");
                cancelButton = tableRows.eq(0).find(".csui-inline-owner-change .cs-cancel-button");
                ownerRow = tableRows.eq(0);
              });

              it("should show save button as disabled if no text in lookup", function () {
                var saveButton = tableRows.eq(0).find(
                    '.csui-inline-owner-change .cs-save-button[disabled]');
                expect(changeOwnerLookUp.val()).toEqual('');
                expect(saveButton.length).toEqual(1);
              });
              if (i == 0) {
                it("should show clear icon if text in lookup", function (done) {
                  changeOwnerLookUp.val('u');
                  changeOwnerLookUp.trigger('keyup');
                  TestUtils.asyncElement(ownerRow, '.cs-search-clear.csui-icon').done(
                      function () {
                        var clearIcon = ownerRow.find('.cs-search-clear.csui-icon'),
                            saveButton;
                        expect(clearIcon.length).toEqual(1);
                        clearIcon.trigger('click');
                        expect(changeOwnerLookUp.val()).toEqual('');
                        saveButton = ownerRow.find(
                            '.csui-inline-owner-change .cs-save-button[disabled]');
                        expect(saveButton.length).toEqual(1);
                        done();
                      });
                });

                it("should display previous owner on clicking cancel", function (done) {
                  cancelButton.trigger('click');
                  TestUtils.asyncElement(ownerRow, '.csui-inline-owner-change .cs-cancel-button',
                      true).done(
                      function () {
                        var changeOwnerLookup = ownerRow.find(
                            ".csui-control-userpicker .typeahead[type='text']"),
                            saveButton        = ownerRow.find(
                                ".csui-inline-owner-change .cs-save-button"),
                            cancelButton      = ownerRow.find(
                                ".csui-inline-owner-change  .cs-cancel-button"),
                            ownerName;
                        expect(changeOwnerLookup.length).toEqual(0);
                        expect(saveButton.length).toEqual(0);
                        expect(cancelButton.length).toEqual(0);
                        ownerName = ownerRow.find(".csui-user-display-name");
                        expect(ownerName[0].innerHTML).toEqual("Admin");
                        done();
                      });
                });

              } else {
                it("should enable save button if the user is selected from dropdown",
                    function (done) {
                      changeOwnerLookUp.val('u');
                      changeOwnerLookUp.trigger('keyup');
                      TestUtils.asyncElement(ownerRow,
                          'ul.typeahead.binf-dropdown-menu').done(
                          function (el) {
                            var user = el.find('li .name[title="user"]'),
                                saveButton;
                            expect(user.length).toEqual(1);
                            user.trigger('mouseenter').trigger('click');
                            saveButton = v1.$el.find(
                                '.csui-inline-owner-change .cs-save-button:not([disabled])');
                            expect(saveButton.length).toEqual(1);
                            done();
                          });

                    });
                it("should change owner on clicking save", function (done) {
                  var saveButton = v1.$el.find(
                      '.csui-inline-owner-change .cs-save-button:not([disabled])');
                  saveButton.trigger('click');
                  TestUtils.asyncElement(ownerRow, '.csui-inline-owner-change .cs-save-button',
                      true).done(
                      function () {
                        var changeOwnerLookup = ownerRow.find(
                            ".csui-control-userpicker .typeahead[type='text']"),
                            saveButton        = ownerRow.find(
                                ".csui-inline-owner-change .cs-save-button"),
                            cancelButton      = ownerRow.find(
                                ".csui-inline-owner-change .cs-cancel-button"),
                            ownerName;
                        expect(changeOwnerLookup.length).toEqual(0);
                        expect(saveButton.length).toEqual(0);
                        expect(cancelButton.length).toEqual(0);
                        ownerName = v1.$el.find(".csui-user-display-name").first();
                        expect(ownerName[0].innerHTML).toEqual("user");
                        done();
                      });
                });
              }
            });

          }

        });

        describe("Change Owner Group permission", function () {
          var tableRow, inlineAction, i;
          beforeAll(function () {
            tableRow = v1.$el.find(".csui-table-list-body .csui-table-body .csui-table-row");
          });
          for (i = 0; i < 2; i++) {
            it("should show change owner group action on hovering over the owner group item",
                function (done) {
                  tableRow.eq(1).trigger(
                      {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
                  TestUtils.asyncElement(v1.$el,
                      ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul").done(
                      function (el) {
                        inlineAction = tableRow.eq(1).find(
                            ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul");
                        expect(el.length).toEqual(1);
                        var changeOwnerAction = el.find(
                            "li[data-csui-command='changeownerpermission']");
                        expect(changeOwnerAction.length).toEqual(1);
                        done();
                      });
                });

            xit("should open change owner group lookup on click of change owner group permission ",
                function (done) {
                  var changeOwnerAction = inlineAction.find(
                      "li[data-csui-command='changeownerpermission'] a");
                  changeOwnerAction.trigger("click");
                  TestUtils.asyncElement(v1.$el,
                      '.csui-inline-owner-change #csui-inline-permissions-user-picker').done(
                      function (el) {
                        var changeOwnerLookup = el.find(
                            ".csui-control-userpicker .typeahead[type='text']"),
                            saveButton        = v1.$el.find(
                                ".csui-inline-owner-change .cs-save-button"),
                            cancelButton      = v1.$el.find(
                                ".csui-inline-owner-change .cs-cancel-button");
                        expect(changeOwnerLookup.length).toEqual(1);
                        expect(saveButton.length).toEqual(1);
                        expect(cancelButton.length).toEqual(1);
                        done();
                      });
                });
            xdescribe("Change Owner group Permission Lookup", function () {
              var changeOwnerLookUp, cancelButton, ownerRow;

              beforeAll(function () {
                changeOwnerLookUp = tableRow.find(
                    ".csui-control-userpicker .typeahead[type='text']");
                cancelButton = tableRow.find(".csui-inline-owner-change .cs-cancel-button");
                ownerRow = tableRow.eq(1);
              });

              it("should show save button as disabled if no text in lookup", function () {
                var saveButton = tableRow.find(
                    '.csui-inline-owner-change .cs-save-button[disabled]');
                expect(changeOwnerLookUp.val()).toEqual("");
                expect(saveButton.length).toEqual(1);
              });

              if (i == 0) {
                it("should show clear icon if text in lookup", function (done) {
                  changeOwnerLookUp.val('b');
                  changeOwnerLookUp.trigger('keyup');
                  TestUtils.asyncElement(ownerRow, '.cs-search-clear.csui-icon').done(
                      function () {
                        var clearIcon = ownerRow.find('.cs-search-clear.csui-icon'),
                            saveButton;
                        expect(clearIcon.length).toEqual(1);
                        clearIcon.trigger('click');
                        expect(changeOwnerLookUp.val()).toEqual('');
                        saveButton = ownerRow.find(
                            '.csui-inline-owner-change .cs-save-button[disabled]');
                        expect(saveButton.length).toEqual(1);
                        done();
                      });
                });

                it("should display previous owner on clicking cancel", function (done) {
                  cancelButton.trigger('click');
                  TestUtils.asyncElement(ownerRow, '.csui-inline-owner-change .cs-cancel-button',
                      true).done(
                      function () {
                        var changeOwnerLookup = ownerRow.find(
                            ".csui-control-userpicker .typeahead[type='text']"),
                            saveButton        = ownerRow.find(
                                ".csui-inline-owner-change .cs-save-button"),
                            cancelButton      = ownerRow.find(
                                ".csui-inline-owner-change .cs-cancel-button"),
                            ownerName;
                        expect(changeOwnerLookup.length).toEqual(0);
                        expect(saveButton.length).toEqual(0);
                        expect(cancelButton.length).toEqual(0);
                        ownerName = ownerRow.find(".csui-user-display-name");
                        expect(ownerName[0].innerHTML).toEqual("DefaultGroup");
                        done();
                      });
                });

              } else {
                it("should enable save button if the owner group is selected from dropdown",
                    function (done) {
                      changeOwnerLookUp.val('b').trigger('keyup');
                      TestUtils.asyncElement(ownerRow,
                          'ul.typeahead.binf-dropdown-menu').done(
                          function (el) {
                            var user = el.find('li .name[title="Business Attributes"]'),
                                saveButton;
                            expect(user.length).toEqual(1);
                            user.trigger('mouseenter').trigger('click');
                            saveButton = v1.$el.find(
                                '.csui-inline-owner-change .cs-save-button:not([disabled])');
                            expect(saveButton.length).toEqual(1);
                            done();
                          });

                    });
                it("should change owner group on clicking save", function (done) {
                  var saveButton = v1.$el.find(
                      '.csui-inline-owner-change .cs-save-button:not([disabled])');
                  saveButton.trigger('click');
                  TestUtils.asyncElement(ownerRow, '.csui-inline-owner-change .cs-save-button',
                      true).done(
                      function () {
                        var changeOwnerLookup = ownerRow.find(
                            ".csui-control-userpicker .typeahead[type='text']"),
                            saveButton        = ownerRow.find(
                                ".csui-inline-owner-change .cs-save-button"),
                            cancelButton      = ownerRow.find(
                                ".csui-inline-owner-change .cs-cancel-button"),
                            ownerName;
                        expect(changeOwnerLookup.length).toEqual(0);
                        expect(saveButton.length).toEqual(0);
                        expect(cancelButton.length).toEqual(0);
                        ownerName = v1.$el.find(".csui-user-display-name").first();
                        expect(ownerName[0].innerHTML).toEqual("user");
                        done();
                      });
                });
              }
            });

          }

        });

        describe("View Permission Lookup", function () {
          it("on focus permission lookup is the active element", function (done) {

            TestUtils.asyncElement(v1.$el, '.typeahead.cs-search').done(
                function () {
                  var permissionLookupSearchField =
                          $('#csui-permissions-user-picker input.cs-search');
                  permissionLookupSearchField.trigger('focus');
                  done();
                });
          });

          it("on keypress dropdown open", function (done) {
            var permissionLookupSearchField = $('#csui-permissions-user-picker').find(
                'input.cs-search');
            permissionLookupSearchField.val('a');
            permissionLookupSearchField.trigger('keyup');
            TestUtils.asyncElement(v1.$el, 'ul.typeahead.binf-dropdown-menu').done(
                function () {
                  expect($('ul.typeahead.binf-dropdown-menu').length).toEqual(1);
                  done();
                });
          });

          it("Clearing the value when clicking on  search clear icon", function (done) {

            var permissionLKClearButton     = $('#csui-permissions-user-picker' +
                                                ' div.typeahead.cs-search-clear.csui-icon.formfield_clear'),
                permissionLookupSearchField = $('#csui-permissions-user-picker input.cs-search');
            permissionLKClearButton.trigger('click');
            TestUtils.asyncElement(v1.$el,
                'div.typeahead.cs-search-clear[style*="none"]').done(
                function () {
                  expect(permissionLookupSearchField.val('')).toBeTruthy();
                  done();
                });

          });

        });

        describe("User group dialog", function () {
          it("should open user group dialog on clicking on any user group", function (done) {
            userGroup = v1.$('.csui-table-row:nth-child(5) .csui-user-display-name');
            expect(userGroup.length).toEqual(1);
            userGroup.trigger('click');
            TestUtils.asyncElement($('body'),
                '.target-browse.cs-permission-group-picker .binf-modal-body .csui-mp-content .list-content .binf-list-group-item').done(
                function (el) {
                  expect(el.length).toEqual(1);
                  done();
                });
          });

          xit("should contain users matching the same count of the users ", function () {
            expect(
                $($.fn.binf_modal.getDefaultContainer()).find(
                    '.binf-list-group > a').length).toEqual(2);
          });

          it("should close the user group dialog", function (done) {
            TestUtils.asyncElement($('body'),
                '.target-browse.cs-permission-group-picker .binf-modal-footer .binf-btn-default').done(
                function (el) {
                  expect(el.length).toEqual(1);
                  expect(el.text()).toEqual("Cancel");
                  el.trigger('click');
                  TestUtils.asyncElement($('body'),
                      '.target-browse.cs-permission-group-picker .binf-modal-content',
                      true).done(function (el) {
                    expect(el.length).toEqual(0);
                    done();
                  });
                });
          });
        });

        describe("Remove/Delete/Restore permission", function () {
          var tableRows, inlineAction, deletedUser;
          it("should show remove action on hovering over the list item", function (done) {
            tableRows = v1.$el.find(".csui-table-list-body .csui-table-body .csui-table-row");
            tableRows.eq(2).trigger(
                {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
            TestUtils.asyncElement(v1.$el,
                ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul").done(
                function (el) {
                  inlineAction = tableRows.eq(2).find(
                      ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul");
                  expect(el.length).toEqual(1);
                  var deleteAction = el.find("li[data-csui-command='deletepermission']");
                  expect(deleteAction.length).toEqual(1);
                  done();
                });
          });

          it("public access should be removed on click of remove permission",
              function (done) {
                deletedUser = tableRows.find(
                    '.csui-table-cell .csui-profileimg span.icon_permmision_public');
                expect(deletedUser.length).toEqual(1);
                var deleteAction = inlineAction.find(
                    "li[data-csui-command='deletepermission'] a");
                deleteAction.trigger("click");
                TestUtils.asyncElement($('body'),
                    '.csui-table-cell .csui-profileimg span.icon_permmision_public', true).done(
                    function () {
                      deletedUser = $(
                          '.csui-table-cell .csui-profileimg span.icon_permmision_public');
                      expect(deletedUser.length).toEqual(0);
                      done();
                    });
              });

          it("should restore the public access permissions on clicking restore public" +
             " access action from dropdown", function (done) {
            TestUtils.asyncElement($('body'),
                '.cs-permissions .csui-table-list-header .csui-table-header-cell .csui-add-permission').done(
                function (el) {
                  expect(el.length).toEqual(1);
                  el.trigger('click');
                  TestUtils.asyncElement(v1.$el,
                      ".binf-dropdown-menu li[data-csui-command='restorepublicaccess'] .csui-toolitem").done(
                      function (el) {
                        expect(el.length).toEqual(1);
                        el.trigger('click');
                        TestUtils.asyncElement(v1.$el,
                            ".csui-table-cell .csui-profileimg span.icon_permmision_public").done(
                            function (el) {
                              expect(el.length).toEqual(1);
                              done();
                            });
                      });
                });
          });
        });

        describe("Search for owner group", function () {
          var tableRows, inlineAction, deletedUser;
          it("should show remove action on hovering over the owner group", function (done) {
            tableRows = v1.$el.find(".csui-table-list-body .csui-table-body .csui-table-row");
            tableRows.eq(1).trigger(
                {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
            TestUtils.asyncElement(v1.$el,
                ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul").done(
                function (el) {
                  inlineAction = tableRows.eq(1).find(
                      ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul");
                  expect(el.length).toEqual(1);
                  var deleteAction = el.find("li[data-csui-command='deletepermission']");
                  expect(deleteAction.length).toEqual(1);
                  done();
                });
          });

          it("Owner Group should be removed on click of remove owner group",
              function (done) {
                deletedUser = tableRows.find(
                    '.csui-table-cell .csui-profileimg span.icon_permmision_owner_group');
                expect(deletedUser.length).toEqual(1);
                var deleteAction = inlineAction.find(
                    "li[data-csui-command='deletepermission'] a");
                deleteAction.trigger("click");
                TestUtils.asyncElement(v1.$el,
                    '.csui-table-cell .csui-profileimg span.icon_permmision_owner_group',
                    true).done(
                    function () {
                      deletedUser = $(
                          '.csui-table-cell .csui-profileimg span.icon_permmision_owner_group');
                      expect(deletedUser.length).toEqual(0);
                      done();
                    });
          });

          it("should show add owner group in add permissions dropdown", function (done) {
            TestUtils.asyncElement($('body'),
                '.cs-permissions .csui-table-list-header .csui-table-header-cell .csui-add-permission').done(
                function (el) {
                  expect(el.length).toEqual(1);
                  el.trigger('click');
                  TestUtils.asyncElement(v1.$el,
                      'li[data-csui-command="addownerorgroup"]:visible').done(function (el) {
                    expect(el.length).toEqual(1);
                    expect(el.find('a').text()).toEqual("Add owner group");
                    done();
                  });
                });
          });

          it("should open member picker on clicking 'add owner group' in add permissions" +
             " dropdown", function (done) {
            TestUtils.asyncElement(v1.$el,
                'li[data-csui-command="addownerorgroup"]:visible').done(
                function (el) {
                  expect(el.length).toEqual(1);
                  expect(el.find('a').text()).toEqual("Add owner group");
                  el.find('a').trigger('click');
                  TestUtils.asyncElement($('body'),
                      '.target-browse.cs-permission-group-picker .binf-modal-body .list-content .binf-list-group .binf-list-group-item').done(
                      function (el) {
                        expect(el.length).toBeGreaterThan(0);
                        done();
                      });
                });
          });

          it("Search icon should be present in the group picker", function (done) {
            TestUtils.asyncElement($('body'),
                '.target-browse.cs-permission-group-picker .csui-mp-header .csui-folder-name span.icon-sv-search').done(
                function (el) {
                  expect(el.length).toEqual(1);
                  done();
                });
          });

          it("Click on search icon", function (done) {
            TestUtils.asyncElement($('body'),
                '.target-browse.cs-permission-group-picker .csui-mp-header .csui-folder-name span.icon-sv-search').done(
                function (el) {
                  expect(el.length).toEqual(1);
                  el.trigger('click');
                  TestUtils.asyncElement(
                      '.target-browse.cs-permission-group-picker .csui-mp-header',
                      'form .cs-filter-input').done(
                      function (el) {
                        expect(el.length).toEqual(1);
                        expect(el.val()).toEqual("");
                        done();
                      });
                });
          });

          it("Search clearer icon should be present ,if any text in search input", function (done) {
            TestUtils.asyncElement('.target-browse.cs-permission-group-picker .csui-mp-header',
                'form .cs-filter-input').done(
                function (el) {
                  el.val('d');
                  el.trigger('keyup');
                  TestUtils.asyncElement(
                      '.target-browse.cs-permission-group-picker .csui-mp-header',
                      'form .icon-formfield-clear').done(
                      function (el) {
                        expect(el.length).toEqual(1);
                        done();
                      });
                });
          });

          it("Select Default group to add as owner group", function (done) {
            TestUtils.asyncElement(
                '.target-browse.cs-permission-group-picker .binf-modal-body .list-content .binf-list-group',
                '.cs-left-item-1001').done(
                function (el) {
                  expect(el.length).toEqual(1);
                  el.trigger('click');
                  TestUtils.asyncElement(
                      '.target-browse.cs-permission-group-picker .binf-modal-footer',
                      '.cs-add-button').done(
                      function (el) {
                        expect(el.disabled).toBeFalsy();
                        expect(el.length).toEqual(1);
                        el.trigger('click');
                        TestUtils.asyncElement(
                            '.target-browse.csui-permissions-level .binf-modal-footer',
                            '.cs-add-button').done(
                            function (el) {
                              expect(el.disabled).toBeFalsy();
                              expect(el.length).toEqual(1);
                              el.trigger('click');
                              done();
                            });
                      });
                });
          });

          it("Default group should be added as owner group", function (done) {
            TestUtils.asyncElement(v1.$el,
                '.csui-table-cell .csui-profileimg span.icon_permmision_owner_group').done(
                function (el) {
                  expect(el.length).toEqual(1);
                  done();
                });
          });
        });
      });

      describe("View having only Group Owner and Public access", function () {
        var v2, node2, region2, permissionTableBody, permissionTableRows, ownerRow;
        beforeAll(function (done) {
          node2 = context.getModel(NodeModelFactory, {attributes: {id: 22222}});
          node2.setExpand('permissions', '22222');
          var actionModel2 = new ActionModel({
                method: "GET",
                name: "permissions",
                signature: "permissions"
              }),
              actionModel3 = new ActionModel({
                method: "GET",
                name: "editpermissions",
                signature: "editpermissions"
              });
          node2.actions = new ActionCollection([actionModel2, actionModel3]);
          v2 = new PermissionsView({
            context: context,
            model: node2
          });
          region2 = new Marionette.Region({
            el: $('<div id="permissions-view2"></div>').appendTo(document.body)
          });
          region2.show(v2);
          TestUtils.asyncElement(v2.$el, '.csui-table-list-body:visible').done(function () {
            permissionTableBody = v2.$el.find(".csui-table-list-body");
            permissionTableRows = permissionTableBody.find(".csui-table-row");
            done();
          });
        });

        afterAll(function () {
          v2.destroy();
          $('body').empty();
        });

        it("view can be instantiated", function () {
          expect(v2).toBeDefined();
          expect(v2.$el.length > 0).toBeTruthy();
          expect(v2.el.childNodes.length > 0).toBeTruthy();
          expect(v2.$el.hasClass('cs-permissions')).toBeTruthy();
        });

        it("contains Group Owner as first entry when there is no Owner", function () {
          ownerRow = permissionTableRows.eq(0);
          var groupOwnerClass = ownerRow.find(".icon_permmision_owner_group");
          expect(groupOwnerClass.length).toEqual(1);
          var groupOwnerDisplayName = ownerRow.find(".csui-user-display-name").text();
          expect(groupOwnerDisplayName).toEqual(groupOwnerName);
          var ownerTitleClassValue = $(groupOwnerClass)[0].getAttribute('title');
          expect(ownerTitleClassValue).toEqual(groupOwnerTitle);
          var permissionLevelClass = ownerRow.find(".csui-permission-level");
          expect(permissionLevelClass.text()).toEqual(permissionLevelRead);
        });

        it("contains Public access as second entry after Group Owner", function () {
          ownerRow = permissionTableRows.eq(1);
          var publicAccessClass = ownerRow.find(".icon_permmision_public");
          expect(publicAccessClass.length).toEqual(1);
          var publicAccessDisplayName = ownerRow.find(".csui-user-display-name").text();
          expect(publicAccessDisplayName).toEqual(publicAccessName);
          var permissionLevelClass = ownerRow.find(".csui-permission-level");
          expect(permissionLevelClass.text()).toEqual(permissionLevelRead);
        });

        xit("should show add owner in add permissions dropdown", function (done) {
          TestUtils.asyncElement($('body'),
              '.cs-permissions .csui-table-list-header .csui-table-header-cell .csui-add-permission').done(
              function (el) {
                expect(el.length).toEqual(1);
                el.trigger('click');
                TestUtils.asyncElement(v2.$el,
                    'li[data-csui-command="addownerorgroup"]:visible').done(
                    function (el) {
                      expect(el.length).toEqual(1);
                      expect(el.find('a').text()).toEqual("Add owner");
                    });
                done();
              });
        });

        xit("should open member picker on clicking Add Owner in dropdown",
            function (done) {
              TestUtils.asyncElement(v2.$el,
                  'li[data-csui-command="addownerorgroup"]:visible').done(
                  function (el) {
                    expect(el.length).toEqual(1);
                    expect(el.find('a').text()).toEqual("Add owner");
                    el.find('a').trigger('click');
                    TestUtils.asyncElement($('body'),
                        '.target-browse.cs-permission-group-picker .list-content .binf-list-group-item').done(
                        function (el) {
                          expect(el.length).toBeGreaterThan(0);
                        });
                    done();
                  });
            });

        xit("should add owner on selection", function (done) {
          TestUtils.asyncElement($('body'),
              '.target-browse.cs-permission-group-picker .list-content .binf-list-group-item span[title="Admin"]')
              .done(function (el) {
                expect(el.length).toEqual(1);
                el.trigger('click');
                TestUtils.asyncElement($('body'),
                    '.target-browse.csui-permissions-level .binf-modal-footer .binf-btn-primary')
                    .done(function (el) {
                      expect(el.length).toEqual(1);
                      expect(el.text()).toEqual("Next");
                      el.trigger('click');
                    });
                TestUtils.asyncElement($('body'),
                    '.target-browse.csui-permissions-apply-dialog .binf-modal-footer .binf-btn-primary')
                    .done(function (el) {
                      expect(el.length).toEqual(1);
                      expect(el.text()).toEqual("Done");
                      el.trigger('click');
                    });
                TestUtils.asyncElement(v2.$el,
                    '.csui-profileimg:not(.binf-disabled) .icon_permmision_owner').done(
                    function () {
                      var ownerName = $(
                          '.csui-table-row .csui-table-cell .csui-user-display-name').first();
                      expect(ownerName.text()).toEqual("Admin");
                    });
                done();
              });
        });
      });

      describe("View having only Owner and Public access", function () {
        var v4, node4, region4, permissionTableBody, permissionTableRows, ownerRow;
        beforeAll(function (done) {
          node4 = context.getModel(NodeModelFactory, {attributes: {id: 55555}});
          node4.setExpand('permissions', '55555');

          var actionModel4 = new ActionModel({
                method: "GET",
                name: "permissions",
                signature: "permissions"
              }),
              actionModel5 = new ActionModel({
                method: "GET",
                name: "editpermissions",
                signature: "editpermissions"
              });
          node4.actions = new ActionCollection([actionModel4, actionModel5]);
          v4 = new PermissionsView({
            context: context,
            model: node4
          });
          region4 = new Marionette.Region({
            el: $('<div id="permissions-view2"></div>').appendTo(document.body)
          });
          region4.show(v4);
          TestUtils.asyncElement(v4.$el, '.csui-table-list-body:visible').done(function () {
            permissionTableBody = v4.$el.find(".csui-table-list-body");
            permissionTableRows = permissionTableBody.find(".csui-table-row");
            done();
          });
        });

        afterAll(function () {
          v4.destroy();
          $('body').empty();
        });

        it("view can be instantiated", function () {
          expect(v4).toBeDefined();
          expect(v4.$el.length > 0).toBeTruthy();
          expect(v4.el.childNodes.length > 0).toBeTruthy();
          expect(v4.$el.hasClass('cs-permissions')).toBeTruthy();
        });

        it("contains Owner as first entry", function () {
          ownerRow = permissionTableRows.eq(0);
          var ownerClass = ownerRow.find(".icon_permmision_owner");
          expect(ownerClass.length).toEqual(1);
          var ownerDisplayName = ownerRow.find(".csui-user-display-name").text();
          expect(ownerDisplayName).toEqual(ownerName);
          var ownerTitleClassValue = $(ownerClass)[0].getAttribute('title');
          expect(ownerTitleClassValue).toEqual(ownerTitle);
          var permissionLevelClass = ownerRow.find(".csui-permission-level");
          expect(permissionLevelClass.text()).toEqual(permissionLevelFullControl);
        });

        it("contains Public access as second entry after Owner", function () {
          ownerRow = permissionTableRows.eq(1);
          var publicAccessClass = ownerRow.find(".icon_permmision_public");
          expect(publicAccessClass.length).toEqual(1);
          var publicAccessDisplayName = ownerRow.find(".csui-user-display-name").text();
          expect(publicAccessDisplayName).toEqual(publicAccessName);
          var permissionLevelClass = ownerRow.find(".csui-permission-level");
          expect(permissionLevelClass.text()).toEqual(permissionLevelRead);
        });

        xit("should show add owner group in add permissions dropdown", function (done) {
          TestUtils.asyncElement($('body'),
              '.cs-permissions .csui-table-list-header .csui-table-header-cell .csui-add-permission').done(
              function (el) {
                expect(el.length).toEqual(1);
                el.trigger('click');
                TestUtils.asyncElement(v4.$el,
                    'li[data-csui-command="addownerorgroup"]:visible').done(function (el) {
                  expect(el.length).toEqual(1);
                  expect(el.find('a').text()).toEqual("Add owner group");
                });
                done();
              });
        });

        xit("should open member picker on clicking 'add owner or owner group' in add permissions" +
           " dropdown", function (done) {
          TestUtils.asyncElement(v4.$el,
              'li[data-csui-command="addownerorgroup"]:visible').done(
              function (el) {
                expect(el.length).toEqual(1);
                expect(el.find('a').text()).toEqual("Add owner group");
                el.find('a').trigger('click');
                TestUtils.asyncElement($('body'),
                    '.target-browse.cs-permission-group-picker .list-content .binf-list-group-item').done(
                    function (el) {
                      expect(el.length).toBeGreaterThan(0);
                    });
                done();
              });
        });

        xit("should add owner group on selection", function (done) {
          TestUtils.asyncElement($('body'),
              '.target-browse.cs-permission-group-picker .list-content .binf-list-group-item span[title="Recommender"]')
              .done(function (el) {
                expect(el.length).toEqual(1);
                el.trigger('click');
                TestUtils.asyncElement($('body'),
                    '.target-browse.csui-permissions-level .binf-modal-footer .binf-btn-primary')
                    .done(function (el) {
                      expect(el.length).toEqual(1);
                      expect(el.text()).toEqual("Next");
                      el.trigger('click');
                    });
                TestUtils.asyncElement($('body'),
                    '.target-browse.csui-permissions-apply-dialog .binf-modal-footer .binf-btn-primary')
                    .done(function (el) {
                      expect(el.length).toEqual(1);
                      expect(el.text()).toEqual("Done");
                      el.trigger('click');
                    });
                TestUtils.asyncElement(v4.$el,
                    '.csui-profileimg:not(.binf-disabled) .icon_permmision_owner_group').done(
                    function () {
                      var ownerName = $(
                          '.csui-table-row .csui-table-cell .csui-user-display-name').eq(1);
                      expect(ownerName.text()).toEqual("Recommender");
                    });
                done();
              });
        });
      });

      describe("View having only Public access", function () {
        var v3, node3, region3, permissionTableBody, permissionTableRows, ownerRow;
        beforeAll(function (done) {
          node3 = context.getModel(NodeModelFactory, {attributes: {id: 33333}});
          node3.setExpand('permissions', '33333');
          var actionModel3 = new ActionModel({
                method: "GET",
                name: "permissions",
                signature: "permissions"
              }),
              actionModel4 = new ActionModel({
                method: "GET",
                name: "editpermissions",
                signature: "editpermissions"
              });
          node3.actions = new ActionCollection([actionModel3, actionModel4]);
          v3 = new PermissionsView({
            context: context,
            model: node3
          });
          region3 = new Marionette.Region({
            el: $('<div id="permissions-view3"></div>').appendTo(document.body)
          });
          region3.show(v3);
          TestUtils.asyncElement(v3.$el, '.csui-table-list-body:visible').done(function () {
            permissionTableBody = v3.$el.find(".csui-table-list-body");
            permissionTableRows = permissionTableBody.find(".csui-table-row");
            done();
          });
        });

        afterAll(function () {
          v3.destroy();
          $('body').empty();
        });

        it("view can be instantiated", function () {
          expect(v3).toBeDefined();
          expect(v3.$el.length > 0).toBeTruthy();
          expect(v3.el.childNodes.length > 0).toBeTruthy();
          expect(v3.$el.hasClass('cs-permissions')).toBeTruthy();
        });

        it("should contain No owner assigned text for public access", function () {
          expect(permissionTableBody.length).toEqual(1);
          expect(permissionTableRows.length).toBeGreaterThan(0);
          ownerRow = permissionTableRows.eq(0);
          var noOwnerAssignedClass = ownerRow.find(".csui-user-display-name");
          expect(noOwnerAssignedClass.text()).toEqual(addOwnerOrOwnerGroup);
        });

        it("contains Public access as second entry after Group Owner", function () {
          ownerRow = permissionTableRows.eq(1);
          var publicAccessClass = ownerRow.find(".icon_permmision_public");
          expect(publicAccessClass.length).toEqual(1);
          var publicAccessDisplayName = ownerRow.find(".csui-user-display-name").text();
          expect(publicAccessDisplayName).toEqual(publicAccessName);
          var permissionLevelClass = ownerRow.find(".csui-permission-level");
          expect(permissionLevelClass.text()).toEqual(permissionLevelRead);
        });

        it("should show edit icon hovering on user name", function (done) {
          ownerRow = permissionTableRows.eq(0);
          var noOwnerAssignedClass = ownerRow.find(".csui-user-display-name");
          noOwnerAssignedClass.trigger('mouseover');
          TestUtils.asyncElement(v3.$el,
              '.csui-add-owner-or-group .icon-edit:visible').done(function (el) {
            expect(el.length).toEqual(1);
            done();
          });
        });

        it("should open member picker on clicking edit icon", function (done) {
          var editIcon = v3.$el.find('.csui-add-owner-or-group .icon-edit:visible');
          editIcon.trigger('click');
          TestUtils.asyncElement($('body'),
              '.target-browse.cs-permission-group-picker .list-content .binf-list-group-item').done(
              function () {
                var cancelButton = $('body .binf-modal-footer .binf-btn-default');
                expect(cancelButton.length).toEqual(1);
                expect(cancelButton.text()).toEqual("Cancel");
                cancelButton.trigger('click');
                done();
              });
        });

        it("should show add owner or owner group in add permissions dropdown", function (done) {
          var addIcon = v3.$el.find(
              '.csui-table-header-toolbar .csui-add-permission');//.binf-dropdown-toggle.csui-permission-toolbar
          expect(addIcon.length).toEqual(1);
          addIcon.trigger('click');
          TestUtils.asyncElement(v3.$el,
              'li[data-csui-command="addownerorgroup"]:visible').done(function (el) {
            expect(el.length).toEqual(1);
            expect(el.find('a').text()).toEqual("Add owner or owner group");
            done();
          });
        });

        it("should open member picker on clicking 'add owner or owner group' in add permissions" +
           " dropdown",
            function (done) {
              var AddOwnerOrGroupCommand = v3.$el.find('li[data-csui-command="addownerorgroup"] a');
              expect(AddOwnerOrGroupCommand.length).toEqual(1);
              AddOwnerOrGroupCommand.trigger('click');
              TestUtils.asyncElement($('body'),
                  '.target-browse.cs-permission-group-picker .list-content .binf-list-group-item:visible').done(
                  function (el) {
                    expect(el.length).toBeGreaterThan(0);
                    done();
                  });
            });

        it("should add owner or owner group on selection", function (done) {
          var row = $(
              'body .target-browse.cs-permission-group-picker .list-content .binf-list-group-item span[title="Admin"]');
          expect(row.length).toEqual(1);
          row.trigger('click');
          var addButton = $('body .binf-modal-footer .binf-btn-primary');
          expect(addButton.length).toEqual(1);
          expect(addButton.text()).toEqual("Next");
          addButton.trigger('click');
          var permissionLevel = $(
              "body .cs-permission-group-picker .binf-modal-content .binf-modal-footer" +
              " .cs-add-button");
          permissionLevel.trigger('click');
          var applyPermissions = $("body .csui-permissions-apply-dialog .binf-modal-content" +
                                   " .binf-modal-footer" +
                                   " .cs-add-button.csui-acc-focusable-active");
          applyPermissions.trigger('click');
          TestUtils.asyncElement(v3.$el,
              '.csui-profileimg:not(.binf-disabled) .icon_permmision_owner').done(function () {
            var ownerName = $('.csui-table-row .csui-table-cell .csui-user-display-name').first();
            expect(ownerName.text()).toEqual("Admin");
            done();
          });
        });
      });
    });

    describe("For user without edit permission rights", function () {
      var userWithoutEditPermissionRights;
      beforeAll(function () {
        userWithoutEditPermissionRights = 1500;
      });

      describe("View having Owner,Group Owner and Public access", function () {
        var v1, node1, region1, permissionTableBody, permissionTableRows, ownerRow, userGroup;
        beforeAll(function (done) {
          node1 = context.getModel(NodeModelFactory, {attributes: {id: 66666}});
          node1.setExpand('permissions', '66666');
          var actionModel = new ActionModel({
            method: "GET",
            name: "permissions",
            signature: "permissions"
          });
          node1.actions = new ActionCollection([actionModel]);
          v1 = new PermissionsView({
            context: context,
            model: node1
          });
          region1 = new Marionette.Region({
            el: $('<div id="readonly-permissions-view1"></div>').appendTo(document.body)
          });
          region1.show(v1);
          TestUtils.asyncElement(v1.$el, '.csui-table-list-body:visible').done(function () {
            permissionTableBody = v1.$el.find(".csui-table-list-body");
            permissionTableRows = permissionTableBody.find(".csui-table-row");
            done();
          });
        });

        afterAll(function () {
          node1.destroy();
          v1.destroy();
          $('#readonly-permissions-view1').remove();
        });

        it("view can be instantiated", function () {
          expect(v1).toBeDefined();
          expect(v1.$el.length > 0).toBeTruthy();
          expect(v1.el.childNodes.length > 0).toBeTruthy();
          expect(v1.$el.attr('class')).toContain('cs-permissions');
        });

        it("contains Owner as first entry", function () {
          expect(permissionTableBody.length).toEqual(1);
          expect(permissionTableRows.length).toBeGreaterThan(0);
          ownerRow = permissionTableRows.eq(0);
          var ownerClass = ownerRow.find(".icon_permmision_owner");
          expect(ownerClass.length).toEqual(1);
          var ownerDisplayName = ownerRow.find(".csui-user-display-name").text();
          expect(ownerDisplayName).toEqual(ownerName);
          var ownerTitleClassValue = $(ownerClass)[0].getAttribute('title');
          expect(ownerTitleClassValue).toEqual(ownerTitle);
          var permissionLevelClass = ownerRow.find(".csui-permission-level");
          expect(permissionLevelClass.text()).toEqual(permissionLevelFullControl);
        });

        it("contains Group Owner as second entry after Owner", function () {
          ownerRow = permissionTableRows.eq(1);
          var groupOwnerClass = ownerRow.find(".icon_permmision_owner_group");
          expect(groupOwnerClass.length).toEqual(1);
          var groupOwnerDisplayName = ownerRow.find(".csui-user-display-name").text();
          expect(groupOwnerDisplayName).toEqual(groupOwnerName);
          var ownerTitleClassValue = $(groupOwnerClass)[0].getAttribute('title');
          expect(ownerTitleClassValue).toEqual(groupOwnerTitle);
          var permissionLevelClass = ownerRow.find(".csui-permission-level");
          expect(permissionLevelClass.text()).toEqual(permissionLevelRead);
        });

        it("contains Public access as third entry after Owner and Group Owner respectively",
            function () {

              ownerRow = permissionTableRows.eq(2);
              var publicAccessClass = ownerRow.find(".icon_permmision_public");
              expect(publicAccessClass.length).toEqual(1);
              var publicAccessDisplayName = ownerRow.find(".csui-user-display-name").text();
              expect(publicAccessDisplayName).toEqual(publicAccessName);
              var permissionLevelClass = ownerRow.find(".csui-permission-level");
              expect(permissionLevelClass.text()).toEqual(permissionLevelRead);
            });

        it("should not show Inline permission actions on hovering over the list item",
            function (done) {
              var tableRows = v1.$el.find(".csui-table-list-body .csui-table-body .csui-table-row");
              tableRows.eq(2).trigger(
                  {type: "pointerenter", originalEvent: {pointerType: "mouse"}});
              TestUtils.asyncElement(v1.$el,
                  ".csui-inlinetoolbar", true).done(
                  function (el) {
                    var isInlineToolbar = $('.csui-inlinetoolbar').is(':visible');
                    expect(isInlineToolbar).not.toBe(true);
                    done();
                  });
            });

        it("should open permission popover in read-mode when permission level link is clicked",
            function (done) {
              var tableRows = v1.$el.find(".csui-table-list-body .csui-table-body .csui-table-row");
              tableRows.eq(2).find('.csui-permission-level').click();
              TestUtils.asyncElement($(document.body),
                  ".csui-permission-attribute-popover-container .binf-popover").done(
                  function (el) {
                    var popoverContent = el.find(
                        '.binf-popover-content .csui-permission-attributes');
                    var buttonContainer = popoverContent.find(
                        'csui-permission-attribute-buttons-container');
                    expect(popoverContent.length).toEqual(1);
                    expect(buttonContainer.length).toEqual(0);

                    var allCheckbox = popoverContent.find(
                        '.csui-tree-container input[type="checkbox"]');
                    expect(allCheckbox.length).toBeGreaterThan(7);
                    expect(allCheckbox.length).toBeLessThan(11);
                    for (var k = 0; k < allCheckbox.length; k++) {
                      var checkbox = allCheckbox[k];
                      expect(checkbox.disabled).toBeTruthy();
                    }
                    done();
                  });
            });
        xit("should show option Add Major Version in popover when Public Access permission level" +
            " link is clicked",
            function (done) {
              var tableRows = v1.$el.find(".csui-table-list-body .csui-table-body .csui-table-row");
              tableRows.eq(2).find('.csui-permission-level').click();
              TestUtils.asyncElement(document.body,
                  ".csui-permission-attribute-popover-container .binf-popover").done(
                  function (el) {
                    var mv      = el.find(
                        '.binf-popover-content .csui-tree-container #node_add_major_version'),
                        mvLabel = mv.siblings('.csui-node-name');
                    expect(mv.length).toBeGreaterThan(0);
                    expect(mvLabel.text()).toEqual(addMajorVersion);
                    done();
                  });
            });
      });
    });

    describe("No results scenario on user group dialog", function () {
      var v4, node4, region4, permissionTableBody, permissionTableRows, emptyGroup;
      beforeAll(function (done) {
        node4 = context.getModel(NodeModelFactory, {attributes: {id: 44444}});
        node4.setExpand('permissions', '44444');
        var actionModel4 = new ActionModel({
          method: "GET",
          name: "permissions",
          signature: "permissions"
        });
        node4.actions = new ActionCollection([actionModel4]);
        v4 = new PermissionsView({
          context: context,
          model: node4
        });
        region4 = new Marionette.Region({
          el: $('<div id="permissions-view4"></div>').appendTo(document.body)
        });
        region4.show(v4);
        TestUtils.asyncElement(v4.$el, '.csui-table-list-body:visible').done(function () {
          permissionTableBody = v4.$el.find(".csui-table-list-body");
          permissionTableRows = permissionTableBody.find(".csui-table-row");
          done();
        });

      });

      afterAll(function () {
        v4.destroy();
        node4.destroy();
        $('#permissions-view4').remove();
      });

      it("should open user group dialog on clicking on empty group", function (done) {
        emptyGroup = v4.$('.csui-table-row .csui-user-display-name');
        expect(emptyGroup.length).toEqual(1);
        emptyGroup.trigger('click');
        TestUtils.asyncElement($.fn.binf_modal.getDefaultContainer(),
            '.binf-modal-content:visible').done(function (el) {
          expect(el.length).toEqual(1);
          done();
        });
      });

      it("should show no results on clicking empty group", function () {
        expect(
            $($.fn.binf_modal.getDefaultContainer()).find(
                '.binf-list-group > a').length).toEqual(
            0);
      });

      it("should close the empty group dialog", function (done) {
        $($.fn.binf_modal.getDefaultContainer()).find('.binf-modal-footer button').trigger(
            'click');
        TestUtils.asyncElement($.fn.binf_modal.getDefaultContainer(), '.binf-modal-content',
            true).done(function (el) {
          expect(el.length).toEqual(0);
          done();
        });
      });
    });

    describe('DefaultAccess Configuration', function () {

      var permissionsView, nodeModel, region1, permissionTableBody, permissionTableRows,
          authUserModel,
          tableRows, inlineAction, publicAccessRow, addGrps;

      describe("Should able to add only Groups when GrantAccessGroupOnly enabled", function () {

        beforeAll(function (done) {

          window.csui.require.config({
            config: {
              "csui/utils/commands/permissions/add.user.group": {
                "GrantAccessGroupOnly": true
              }
            }
          });
          nodeModel = context.getModel(NodeModelFactory, {attributes: {id: 11111}});
          authUserModel = context.getModel(MemberModelFactory, {attributes: {id: 64151}});
          nodeModel.setExpand('permissions', '11111');
          var actionModel  = new ActionModel({
                method: "GET",
                name: "permissions",
                signature: "permissions"
              }),
              actionModel1 = new ActionModel({
                method: "GET",
                name: "editpermissions",
                signature: "editpermissions"
              });
          nodeModel.actions = new ActionCollection([actionModel, actionModel1]);

          authUserModel.fetch().always(function () {
            permissionsView = new PermissionsView({
              context: context,
              model: nodeModel,
              authUser: authUserModel
            });
            region1 = new Marionette.Region({
              el: $('<div id="permissions-view1"></div>').appendTo(document.body)
            });
            region1.show(permissionsView);
            TestUtils.asyncElement(permissionsView.$el, '.csui-table-list-body:visible').done(
                function (el) {
                  permissionTableBody = permissionsView.$el.find(".csui-table-list-body");
                  permissionTableRows = permissionTableBody.find(".csui-table-row");
                  done();
                });

          });

        });

        afterAll(function () {
          window.csui.require.config({
            config: {
              "csui/utils/commands/permissions/add.user.group": {
                "GrantAccessGroupOnly": false
              }
            }
          });
          nodeModel.destroy();
          authUserModel.destroy();
          permissionsView.destroy();
          TestUtils.restoreEnvironment();
        });

        it("should display Add Groups from dropdown when GrantAccessGroupOnly enabled",
            function (done) {
              TestUtils.asyncElement($('body'),
                  '.cs-permissions .csui-table-list-header .csui-table-header-cell .csui-add-permission').done(
                  function (el) {
                    expect(el.length).toEqual(1);
                    el.trigger('click');
                    TestUtils.asyncElement($('body'),
                        ".binf-dropdown.binf-open .binf-dropdown-menu").done(
                        function (el) {
                          var addGrps = $(
                              ".binf-dropdown-menu li[data-csui-command='adduserorgroup']").text();
                          expect(addGrps).toBe('Add Groups');
                          done();
                        });
                  });
            });

        it("should open Add Groups Members Picker dialog on clicking add Groups from dropdown",
            function (done) {
              TestUtils.asyncElement($('body'),
                  ".binf-dropdown-menu li[data-csui-command='adduserorgroup'] .csui-toolitem").done(
                  function (el) {
                    expect(el.length).toEqual(1); 
                    expect(el.text()).toEqual('Add Groups');
                    el.trigger('click');
                    TestUtils.asyncElement($('body'),
                        '.target-browse.cs-permission-group-picker .binf-modal-content .binf-modal-header').done(
                        function (el) {
                          expect(el.length).toEqual(1);
                          var wizardTitle = $(
                              ".target-browse.cs-permission-group-picker .binf-modal-content .binf-modal-header .member-title");
                          expect(wizardTitle.text()).toBe('Groups');
                          var cancelButton = $(
                              ".target-browse.cs-permission-group-picker .binf-modal-content .binf-modal-footer button[title ='Cancel']");
                          expect(cancelButton.length).toEqual(1);
                          cancelButton.trigger('click');
                          done();
                        });
                  });

            });

      });

      describe("Delete & Restore Public Access Permissions with Non Admin User", function () {

        beforeAll(function (done) {
          window.csui.require.config({
            config: {
              "csui/utils/commands/permissions/restore.public.access": {
                "AdminRestorePublic": true
              }
            }
          });
          nodeModel = context.getModel(NodeModelFactory, {attributes: {id: 11111}});
          authUserModel = context.getModel(MemberModelFactory, {attributes: {id: 64151}});
          nodeModel.setExpand('permissions', '11111');
          var actionModel  = new ActionModel({
                method: "GET",
                name: "permissions",
                signature: "permissions"
              }),
              actionModel1 = new ActionModel({
                method: "GET",
                name: "editpermissions",
                signature: "editpermissions"
              });
          nodeModel.actions = new ActionCollection([actionModel, actionModel1]);

          authUserModel.fetch().always(function () {
            permissionsView = new PermissionsView({
              context: context,
              model: nodeModel,
              authUser: authUserModel
            });
            region1 = new Marionette.Region({
              el: $('<div id="permissions-view1"></div>').appendTo(document.body)
            });
            region1.show(permissionsView);
            TestUtils.asyncElement(permissionsView.$el, '.csui-table-list-body:visible').done(
                function (el) {
                  permissionTableBody = permissionsView.$el.find(".csui-table-list-body");
                  permissionTableRows = permissionTableBody.find(".csui-table-row");
                  done();
                });

          });

        });

        afterAll(function () {
          window.csui.require.config({
            config: {
              "csui/utils/commands/permissions/restore.public.access": {
                "AdminRestorePublic": false
              }
            }
          });
          nodeModel.destroy();
          authUserModel.destroy();
          permissionsView.destroy();
          TestUtils.restoreEnvironment();
        });

        it("should be able to Remove publicAccess Permissions", function (done) {

          TestUtils.asyncElement($('body'),
              '.cs-permissions .csui-table-list-header .csui-table-header-cell .csui-add-permission').done(
              function (el) {
                tableRows = permissionsView.$el.find(
                    ".csui-table-list-body .csui-table-body .csui-table-row");

                publicAccessRow = tableRows.find(
                    '.csui-table-cell .csui-profileimg span.icon_permmision_public');
                expect(publicAccessRow.length).toEqual(1);

                tableRows.eq(2).trigger(
                    {type: "pointerenter", originalEvent: {pointerType: "mouse"}});

                TestUtils.asyncElement(permissionsView.$el,
                    ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul").done(
                    function (el) {

                      inlineAction = permissionsView.$el.find(
                          ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul");
                      expect(inlineAction).toBeDefined();
                      var deleteAction = permissionsView.$el.find(
                          "li[data-csui-command='deletepermission'] a");
                      expect(deleteAction.length).toEqual(1);
                      deleteAction.trigger("click");

                      TestUtils.asyncElement(permissionsView.$el,
                          '.csui-table-cell .csui-profileimg span.icon_permmision_public',
                          true).done(
                          function () {
                            publicAccessRow = $(
                                '.csui-table-cell .csui-profileimg span.icon_permmision_public');
                            expect(publicAccessRow.length).toEqual(0);
                            done();
                          });
                    });
              });
        });

        it("should not display Restore PublicAccess from dropdown when AdminRestorePublic enabled",
            function (done) {

              TestUtils.asyncElement($('body'),
                  '.cs-permissions .csui-table-list-header .csui-table-header-cell .csui-add-permission').done(
                  function (el) {
                    expect(el.length).toEqual(1);
                    var publicAccessRow = tableRows.find(
                        '.csui-table-cell .csui-profileimg span.icon_permmision_public').is(
                        (':visible'));
                    expect(publicAccessRow).toBeFalsy();
                    el.trigger('click');
                    TestUtils.asyncElement(permissionsView.$el,
                        ".csui-table-header-toolbar .binf-dropdown-menu").done(
                        function (el) {
                          var restorepublicAccess = $(
                              ".binf-dropdown-menu li[data-csui-command='restorepublicaccess']").is(
                              ':visible');
                          expect(restorepublicAccess).toBeFalsy();
                          done();
                        });
                  });
            });
      });

      describe(
          "Delete and Restore owner & owner group with Non Admin User when AdminRestoreOwner & AdminRestoreOwnerGroup enabled  ",
          function () {

            beforeAll(function (done) {
              window.csui.require.config({
                config: {
                  "csui/utils/commands/permissions/add.owner.group": {
                    "AdminRestoreOwner": true,
                    "AdminRestoreOwnerGroup": true
                  }
                }
              });
              nodeModel = context.getModel(NodeModelFactory, {attributes: {id: 11111}});
              authUserModel = context.getModel(MemberModelFactory, {attributes: {id: 64151}});
              nodeModel.setExpand('permissions', '11111');
              var actionModel  = new ActionModel({
                    method: "GET",
                    name: "permissions",
                    signature: "permissions"
                  }),
                  actionModel1 = new ActionModel({
                    method: "GET",
                    name: "editpermissions",
                    signature: "editpermissions"
                  });
              nodeModel.actions = new ActionCollection([actionModel, actionModel1]);

              authUserModel.fetch().always(function () {
                permissionsView = new PermissionsView({
                  context: context,
                  model: nodeModel,
                  authUser: authUserModel
                });
                region1 = new Marionette.Region({
                  el: $('<div id="permissions-view1"></div>').appendTo(document.body)
                });
                region1.show(permissionsView);
                TestUtils.asyncElement(permissionsView.$el, '.csui-table-list-body:visible').done(
                    function (el) {
                      permissionTableBody = permissionsView.$el.find(".csui-table-list-body");
                      permissionTableRows = permissionTableBody.find(".csui-table-row");
                      done();
                    });

              });

            });

            afterAll(function () {
              window.csui.require.config({
                config: {
                  "csui/utils/commands/permissions/add.owner.group": {
                    "AdminRestoreOwner": false,
                    "AdminRestoreOwnerGroup": false
                  }
                }
              });
              nodeModel.destroy();
              authUserModel.destroy();
              permissionsView.destroy();
              TestUtils.restoreEnvironment();
            });

            it("should be able to Remove Owner", function (done) {

              tableRows = permissionsView.$el.find(
                  ".csui-table-list-body .csui-table-body .csui-table-row");
              var ownerRow = tableRows.find(
                  '.csui-table-cell .csui-profileimg span.icon_permmision_owner');
              expect(ownerRow.length).toEqual(1);

              tableRows.eq(0).trigger(
                  {type: "pointerenter", originalEvent: {pointerType: "mouse"}});

              TestUtils.asyncElement(permissionsView.$el,
                  ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul").done(
                  function (el) {

                    inlineAction = permissionsView.$el.find(
                        ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul");
                    expect(inlineAction.length).toEqual(1);

                    var deleteAction = el.find(
                        "li[data-csui-command='deletepermission'] .csui-toolitem");
                    expect(deleteAction.length).toEqual(1);

                    deleteAction.trigger("click");

                    TestUtils.asyncElement(permissionsView.$el,
                        '.csui-table-cell .csui-profileimg span.icon_permmision_owner', true).done(
                        function () {
                          ownerRow = $(
                              '.csui-table-cell .csui-profileimg span.icon_permmision_owner');
                          expect(ownerRow.length).toEqual(0);
                          permissionsView.render();
                          done();
                        });
                  });
            });

            it("Should not display Restore owner when default Access enabled for owner",
                function (done) {

                  TestUtils.asyncElement($('body'),
                      '.cs-permissions .csui-table-list-header .csui-table-header-cell .csui-add-permission').done(
                      function (el) {
                        expect(el.length).toEqual(1);
                        el.trigger('click');
                        TestUtils.asyncElement($('body'),
                            ".csui-table-header-toolbar .binf-dropdown-menu").done(
                            function (el) {
                              var addownerorgroup = $(
                                  ".binf-dropdown-menu li[data-csui-command='addownerorgroup']").is(
                                  ':visible');
                              expect(addownerorgroup).toBeFalsy();
                              done();
                            });
                      });
                });

            it("should be able to Remove Owner group", function (done) {

              tableRows = permissionsView.$el.find(
                  ".csui-table-list-body .csui-table-body .csui-table-row");
              var ownerGroupRow = tableRows.find(
                  '.csui-table-cell .csui-profileimg span.icon_permmision_owner_group');
              expect(ownerGroupRow.length).toEqual(1);

              tableRows.eq(0).trigger(
                  {type: "pointerenter", originalEvent: {pointerType: "mouse"}});

              TestUtils.asyncElement(permissionsView.$el,
                  ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul").done(
                  function (el) {
                    inlineAction = permissionsView.$el.find(
                        ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul");
                    expect(inlineAction.length).toEqual(1);

                    var deleteAction = el.find(
                        "li[data-csui-command='deletepermission'] .csui-toolitem");
                    expect(deleteAction.length).toEqual(1);

                    deleteAction.trigger("click");

                    TestUtils.asyncElement(permissionsView.$el,
                        '.csui-table-cell .csui-profileimg span.icon_permmision_owner_group',
                        true).done(
                        function (el) {
                          ownerGroupRow = $(
                              '.csui-table-cell .csui-profileimg span.icon_permmision_owner_group').is(
                              ':visible');
                          expect(ownerGroupRow).toBeFalsy();
                          done();
                        });
                  });
            });

            it("Should not display Restore Owner & Restore Owner Group from dropdown menu",
                function (done) {

                  TestUtils.asyncElement($('body'),
                      '.cs-permissions .csui-table-list-header .csui-table-header-cell .csui-add-permission').done(
                      function (el) {

                        expect(el.length).toEqual(1);
                        el.trigger('click');

                        TestUtils.asyncElement($('body'),
                            ".binf-dropdown-menu").done(
                            function (el) {
                              var addownerorgroup = $(
                                  ".binf-dropdown-menu li[data-csui-command='addownerorgroup']").is(
                                  ':visible');
                              expect(addownerorgroup).toBeFalsy();

                              done();
                            });
                      });
                });

            it("Should display No owner assigned when default access enabled for both owner & owner group",
                function (done) {

                  tableRows = permissionsView.$el.find(
                      ".csui-table-list-body .csui-table-body .csui-table-row");
                  var noOwnerAssignedValue = "No owner assigned";

                  var addownerorgroup = tableRows.eq(0).find(
                      '.csui-table-cell .member-info span.csui-user-display-name');
                  expect(addownerorgroup.text()).toEqual(noOwnerAssignedValue);

                  done();
                });
          });

      describe(
          "Delete and Restore owner & owner group with Non Admin User when only AdminRestoreOwner enabled",
          function () {

            beforeAll(function (done) {
              window.csui.require.config({
                config: {
                  "csui/utils/commands/permissions/add.owner.group": {
                    "AdminRestoreOwner": true
                  },
                  "csui/controls/table/cells/user/user.view": {
                    "AdminRestoreOwner": true,
                  }
                }
              });
              nodeModel = context.getModel(NodeModelFactory, {attributes: {id: 11111}});
              authUserModel = context.getModel(MemberModelFactory, {attributes: {id: 64151}});
              nodeModel.setExpand('permissions', '11111');
              var actionModel  = new ActionModel({
                    method: "GET",
                    name: "permissions",
                    signature: "permissions"
                  }),
                  actionModel1 = new ActionModel({
                    method: "GET",
                    name: "editpermissions",
                    signature: "editpermissions"
                  });
              nodeModel.actions = new ActionCollection([actionModel, actionModel1]);

              authUserModel.fetch().always(function () {
                permissionsView = new PermissionsView({
                  context: context,
                  model: nodeModel,
                  authUser: authUserModel
                });
                region1 = new Marionette.Region({
                  el: $('<div id="permissions-view1"></div>').appendTo(document.body)
                });
                region1.show(permissionsView);
                TestUtils.asyncElement(permissionsView.$el, '.csui-table-list-body:visible').done(
                    function (el) {
                      permissionTableBody = permissionsView.$el.find(".csui-table-list-body");
                      permissionTableRows = permissionTableBody.find(".csui-table-row");
                      done();
                    });

              });

            });

            afterAll(function () {
              window.csui.require.config({
                config: {
                  "csui/utils/commands/permissions/add.owner.group": {
                    "AdminRestoreOwner": false
                  },
                  "csui/controls/table/cells/user/user.view": {
                    "AdminRestoreOwner": false,
                  }
                }
              });
              nodeModel.destroy();
              authUserModel.destroy();
              permissionsView.destroy();
              TestUtils.restoreEnvironment();
            });

            it("should be able to Remove Owner", function (done) {

              tableRows = permissionsView.$el.find(
                  ".csui-table-list-body .csui-table-body .csui-table-row");
              var ownerRow = tableRows.find(
                  '.csui-table-cell .csui-profileimg span.icon_permmision_owner');
              expect(ownerRow.length).toEqual(1);

              tableRows.eq(0).trigger(
                  {type: "pointerenter", originalEvent: {pointerType: "mouse"}});

              TestUtils.asyncElement(permissionsView.$el,
                  ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul").done(
                  function (el) {

                    inlineAction = permissionsView.$el.find(
                        ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul");
                    expect(inlineAction.length).toEqual(1);

                    var deleteAction = el.find(
                        "li[data-csui-command='deletepermission'] .csui-toolitem");
                    expect(deleteAction.length).toEqual(1);

                    deleteAction.trigger("click");

                    TestUtils.asyncElement(permissionsView.$el,
                        '.csui-table-cell .csui-profileimg span.icon_permmision_owner', true).done(
                        function () {
                          ownerRow = $(
                              '.csui-table-cell .csui-profileimg span.icon_permmision_owner');
                          expect(ownerRow.length).toEqual(0);
                          permissionsView.render();
                          done();
                        });
                  });
            });

            it("should be able to Remove Owner group", function (done) {

              tableRows = permissionsView.$el.find(
                  ".csui-table-list-body .csui-table-body .csui-table-row");
              var ownerGroupRow = tableRows.find(
                  '.csui-table-cell .csui-profileimg span.icon_permmision_owner_group');
              expect(ownerGroupRow.length).toEqual(1);

              tableRows.eq(0).trigger(
                  {type: "pointerenter", originalEvent: {pointerType: "mouse"}});

              TestUtils.asyncElement(permissionsView.$el,
                  ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul").done(
                  function (el) {
                    inlineAction = permissionsView.$el.find(
                        ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul");
                    expect(inlineAction.length).toEqual(1);

                    var deleteAction = el.find(
                        "li[data-csui-command='deletepermission'] .csui-toolitem");
                    expect(deleteAction.length).toEqual(1);

                    deleteAction.trigger("click");

                    TestUtils.asyncElement(permissionsView.$el,
                        '.csui-table-cell .csui-profileimg span.icon_permmision_owner_group',
                        true).done(
                        function (el) {
                          ownerGroupRow = $(
                              '.csui-table-cell .csui-profileimg span.icon_permmision_owner_group').is(
                              ':visible');
                          expect(ownerGroupRow).toBeFalsy();
                          done();
                        });
                  });
            });

            it("Should display Add Owner Group from dropdown menu when owner & owner group not present in the Permissions list",
                function (done) {

                  TestUtils.asyncElement($('body'),
                      '.cs-permissions .csui-table-list-header .csui-table-header-cell .csui-add-permission').done(
                      function (el) {
                        expect(el.length).toEqual(1);
                        el.trigger('click');
                        TestUtils.asyncElement($('body'),
                            ".binf-dropdown-menu li[data-csui-command='addownerorgroup']").done(
                            function (el) {
                              var addownerorgroup = $(
                                  ".binf-dropdown-menu li[data-csui-command='addownerorgroup'] .csui-toolitem");
                              expect(addownerorgroup.text()).toEqual("Add owner group");

                              var addPermissionsIcon = $(
                                  '.cs-permissions .csui-table-list-header .csui-table-header-cell .csui-add-permission');
                              addPermissionsIcon.trigger('click');
                              done();
                            });
                      });
                });

            it("Should display Add Owner Group in permissions list when default access enabled for owner",
                function (done) {

                  tableRows = permissionsView.$el.find(
                      ".csui-table-list-body .csui-table-body .csui-table-row");
                  var addOwnerGroup = "Add Owner Group";

                  var addOwnerGroupRow = tableRows.eq(0).find(
                      '.csui-table-cell .member-info span.csui-user-display-name');
                  expect(addOwnerGroupRow.text().trim()).toEqual(addOwnerGroup);
                  done();
                });

            it("should open Owner Groups Members Picker dialog on clicking Add Owner Group from dropdown",
                function (done) {
                  TestUtils.asyncElement($('body'),
                      ".binf-dropdown-menu li[data-csui-command='addownerorgroup'] .csui-toolitem").done(
                      function (el) {
                        expect(el.length).toEqual(1);
                        expect(el.text().trim()).toEqual('Add owner group');
                        el.trigger('click');
                        TestUtils.asyncElement($('body'),
                            '.target-browse.cs-permission-group-picker .binf-modal-content .binf-modal-header').done(
                            function (el) {
                              expect(el.length).toEqual(1);
                              var wizardTitle = $(
                                  ".target-browse.cs-permission-group-picker .binf-modal-content .binf-modal-header .member-title");
                              expect(wizardTitle.text()).toBe('Add Owner or Owner group');
                              var cancelButton = $(
                                  ".target-browse.cs-permission-group-picker .binf-modal-content .binf-modal-footer button[title ='Cancel']");
                              expect(cancelButton.length).toEqual(1);
                              cancelButton.trigger('click');
                              done();
                            });
                      });
                });
          });

      describe(
          "Delete and Restore owner & owner group with Non Admin User when only AdminRestoreOwnerGroup enabled",
          function () {

            beforeAll(function (done) {
              window.csui.require.config({
                config: {
                  "csui/utils/commands/permissions/add.owner.group": {
                    "AdminRestoreOwnerGroup": true
                  },
                  "csui/controls/table/cells/user/user.view": {
                    "AdminRestoreOwnerGroup": true
                  }
                }
              });
              nodeModel = context.getModel(NodeModelFactory, {attributes: {id: 11111}});
              authUserModel = context.getModel(MemberModelFactory, {attributes: {id: 64151}});
              nodeModel.setExpand('permissions', '11111');
              var actionModel  = new ActionModel({
                    method: "GET",
                    name: "permissions",
                    signature: "permissions"
                  }),
                  actionModel1 = new ActionModel({
                    method: "GET",
                    name: "editpermissions",
                    signature: "editpermissions"
                  });
              nodeModel.actions = new ActionCollection([actionModel, actionModel1]);

              authUserModel.fetch().always(function () {
                permissionsView = new PermissionsView({
                  context: context,
                  model: nodeModel,
                  authUser: authUserModel
                });
                region1 = new Marionette.Region({
                  el: $('<div id="permissions-view1"></div>').appendTo(document.body)
                });
                region1.show(permissionsView);
                TestUtils.asyncElement(permissionsView.$el, '.csui-table-list-body:visible').done(
                    function (el) {
                      permissionTableBody = permissionsView.$el.find(".csui-table-list-body");
                      permissionTableRows = permissionTableBody.find(".csui-table-row");
                      done();
                    });

              });

            });

            afterAll(function () {
              window.csui.require.config({
                config: {
                  "csui/utils/commands/permissions/add.owner.group": {
                    "AdminRestoreOwnerGroup": false
                  },
                  "csui/controls/table/cells/user/user.view": {
                    "AdminRestoreOwnerGroup": false
                  }
                }
              });
              nodeModel.destroy();
              authUserModel.destroy();
              permissionsView.destroy();
              TestUtils.restoreEnvironment();
            });

            it("should be able to Remove Owner", function (done) {

              tableRows = permissionsView.$el.find(
                  ".csui-table-list-body .csui-table-body .csui-table-row");
              var ownerRow = tableRows.find(
                  '.csui-table-cell .csui-profileimg span.icon_permmision_owner');
              expect(ownerRow.length).toEqual(1);

              tableRows.eq(0).trigger(
                  {type: "pointerenter", originalEvent: {pointerType: "mouse"}});

              TestUtils.asyncElement(permissionsView.$el,
                  ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul").done(
                  function (el) {

                    inlineAction = permissionsView.$el.find(
                        ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul");
                    expect(inlineAction.length).toEqual(1);

                    var deleteAction = el.find(
                        "li[data-csui-command='deletepermission'] .csui-toolitem");
                    expect(deleteAction.length).toEqual(1);

                    deleteAction.trigger("click");

                    TestUtils.asyncElement(permissionsView.$el,
                        '.csui-table-cell .csui-profileimg span.icon_permmision_owner', true).done(
                        function () {
                          ownerRow = $(
                              '.csui-table-cell .csui-profileimg span.icon_permmision_owner');
                          expect(ownerRow.length).toEqual(0);
                          permissionsView.render();
                          done();
                        });
                  });
            });

            it("should be able to Remove Owner group", function (done) {

              tableRows = permissionsView.$el.find(
                  ".csui-table-list-body .csui-table-body .csui-table-row");
              var ownerGroupRow = tableRows.find(
                  '.csui-table-cell .csui-profileimg span.icon_permmision_owner_group');
              expect(ownerGroupRow.length).toEqual(1);

              tableRows.eq(0).trigger(
                  {type: "pointerenter", originalEvent: {pointerType: "mouse"}});

              TestUtils.asyncElement(permissionsView.$el,
                  ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul").done(
                  function (el) {
                    inlineAction = permissionsView.$el.find(
                        ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul");
                    expect(inlineAction.length).toEqual(1);

                    var deleteAction = el.find(
                        "li[data-csui-command='deletepermission'] .csui-toolitem");
                    expect(deleteAction.length).toEqual(1);

                    deleteAction.trigger("click");

                    TestUtils.asyncElement(permissionsView.$el,
                        '.csui-table-cell .csui-profileimg span.icon_permmision_owner_group',
                        true).done(
                        function (el) {
                          ownerGroupRow = $(
                              '.csui-table-cell .csui-profileimg span.icon_permmision_owner_group').is(
                              ':visible');
                          expect(ownerGroupRow).toBeFalsy();
                          done();
                        });
                  });
            });

            it("Should display Add Owner when default access enabled for owner & owner group",
                function (done) {
                  tableRows = permissionsView.$el.find(
                      ".csui-table-list-body .csui-table-body .csui-table-row");
                  var addOwner = "Add Owner";
                  var addOwnerRow = tableRows.eq(0).find(
                      '.csui-table-cell .member-info span.csui-user-display-name');
                  expect(addOwnerRow.text()).toEqual(addOwner);
                  done();
                });

            it("Should display Add Owner from dropdown menu when owner & owner group not present in the Permissions list",
                function (done) {

                  TestUtils.asyncElement($('body'),
                      '.cs-permissions .csui-table-list-header .csui-table-header-cell .csui-add-permission').done(
                      function (el) {
                        expect(el.length).toEqual(1);
                        el.trigger('click');
                        TestUtils.asyncElement($('body'),
                            ".binf-dropdown-menu li[data-csui-command='addownerorgroup']").done(
                            function (el) {
                              var addownerorgroup = $(
                                  ".binf-dropdown-menu li[data-csui-command='addownerorgroup'] .csui-toolitem");
                              expect(addownerorgroup.text()).toEqual("Add owner");
                              done();
                            });
                      });
                });

            it("should open Add Owner or Owner Group Members Picker dialog on clicking Add owner from dropdown",
                function (done) {
                  TestUtils.asyncElement($('body'),
                      ".binf-dropdown-menu li[data-csui-command='addownerorgroup'] .csui-toolitem").done(
                      function (el) {
                        expect(el.length).toEqual(1);
                        expect(el.text()).toEqual('Add owner');
                        el.trigger('click');
                        TestUtils.asyncElement($('body'),
                            '.target-browse.cs-permission-group-picker .binf-modal-content .binf-modal-header').done(
                            function (el) {
                              expect(el.length).toEqual(1);
                              var wizardTitle = $(
                                  ".target-browse.cs-permission-group-picker .binf-modal-content .binf-modal-header .member-title");
                              expect(wizardTitle.text()).toBe('Add Owner or Owner group');
                              done();
                            });
                      });
                });

          });

      describe(
          "Should display Add Owner or Owner Group when default access disabled for  both owner & owner group",
          function () {
            beforeAll(function (done) {
              nodeModel = context.getModel(NodeModelFactory, {attributes: {id: 11111}});
              authUserModel = context.getModel(MemberModelFactory, {attributes: {id: 64151}});
              nodeModel.setExpand('permissions', '11111');
              var actionModel  = new ActionModel({
                    method: "GET",
                    name: "permissions",
                    signature: "permissions"
                  }),
                  actionModel1 = new ActionModel({
                    method: "GET",
                    name: "editpermissions",
                    signature: "editpermissions"
                  });
              nodeModel.actions = new ActionCollection([actionModel, actionModel1]);

              authUserModel.fetch().always(function () {
                permissionsView = new PermissionsView({
                  context: context,
                  model: nodeModel,
                  authUser: authUserModel
                });
                region1 = new Marionette.Region({
                  el: $('<div id="permissions-view1"></div>').appendTo(document.body)
                });
                region1.show(permissionsView);
                TestUtils.asyncElement(permissionsView.$el, '.csui-table-list-body:visible').done(
                    function (el) {
                      permissionTableBody = permissionsView.$el.find(".csui-table-list-body");
                      permissionTableRows = permissionTableBody.find(".csui-table-row");
                      done();
                    });

              });

            });

            afterAll(function () {
              nodeModel.destroy();
              authUserModel.destroy();
              permissionsView.destroy();
              TestUtils.restoreEnvironment();
            });

            it("should be able to Remove Owner", function (done) {

              tableRows = permissionsView.$el.find(
                  ".csui-table-list-body .csui-table-body .csui-table-row");
              var ownerRow = tableRows.find(
                  '.csui-table-cell .csui-profileimg span.icon_permmision_owner');
              expect(ownerRow.length).toEqual(1);

              tableRows.eq(0).trigger(
                  {type: "pointerenter", originalEvent: {pointerType: "mouse"}});

              TestUtils.asyncElement(permissionsView.$el,
                  ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul").done(
                  function (el) {

                    inlineAction = permissionsView.$el.find(
                        ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul");
                    expect(inlineAction.length).toEqual(1);

                    var deleteAction = el.find(
                        "li[data-csui-command='deletepermission'] .csui-toolitem");
                    expect(deleteAction.length).toEqual(1);

                    deleteAction.trigger("click");

                    TestUtils.asyncElement(permissionsView.$el,
                        '.csui-table-cell .csui-profileimg span.icon_permmision_owner', true).done(
                        function () {
                          ownerRow = $(
                              '.csui-table-cell .csui-profileimg span.icon_permmision_owner');
                          expect(ownerRow.length).toEqual(0);
                          permissionsView.render();
                          done();
                        });
                  });
            });

            it("should be able to Remove Owner group", function (done) {

              tableRows = permissionsView.$el.find(
                  ".csui-table-list-body .csui-table-body .csui-table-row");
              var ownerGroupRow = tableRows.find(
                  '.csui-table-cell .csui-profileimg span.icon_permmision_owner_group');
              expect(ownerGroupRow.length).toEqual(1);

              tableRows.eq(0).trigger(
                  {type: "pointerenter", originalEvent: {pointerType: "mouse"}});

              TestUtils.asyncElement(permissionsView.$el,
                  ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul").done(
                  function (el) {
                    inlineAction = permissionsView.$el.find(
                        ".csui-inlinetoolbar:not('binf-hidden') .csui-table-actionbar ul");
                    expect(inlineAction.length).toEqual(1);

                    var deleteAction = el.find(
                        "li[data-csui-command='deletepermission'] .csui-toolitem");
                    expect(deleteAction.length).toEqual(1);

                    deleteAction.trigger("click");

                    TestUtils.asyncElement(permissionsView.$el,
                        '.csui-table-cell .csui-profileimg span.icon_permmision_owner_group',
                        true).done(
                        function (el) {
                          ownerGroupRow = $(
                              '.csui-table-cell .csui-profileimg span.icon_permmision_owner_group').is(
                              ':visible');
                          expect(ownerGroupRow).toBeFalsy();
                          done();
                        });
                  });
            });

            it("Should display Add Owner or Owner group in permissions list when default access disabled for owner & owner group",
                function (done) {

                  tableRows = permissionsView.$el.find(
                      ".csui-table-list-body .csui-table-body .csui-table-row");
                  var addOwnerOrOwnerGroup = "Add owner or owner group";

                  var addownerorgroup = tableRows.eq(0).find(
                      '.csui-table-cell .member-info span.csui-user-display-name');
                  expect(addownerorgroup.text()).toEqual(addOwnerOrOwnerGroup);
                  done();
                });
            it("Should display Add Owner or Owner Group from dropdown menu", function (done) {

              TestUtils.asyncElement($('body'),
                  '.cs-permissions .csui-table-list-header .csui-table-header-cell .csui-add-permission').done(
                  function (el) {

                    expect(el.length).toEqual(1);
                    el.trigger('click');

                    TestUtils.asyncElement($('body'),
                        ".binf-dropdown-menu").done(
                        function (el) {
                          var addownerorgroup = $(
                              ".binf-dropdown-menu li[data-csui-command='addownerorgroup']");
                          expect(addownerorgroup.text()).toEqual("Add owner or owner group");

                          done();
                        });
                  });
            });

          });
    });
  });
});



