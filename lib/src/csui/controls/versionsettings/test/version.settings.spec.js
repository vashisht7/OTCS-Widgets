/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/controls/versionsettings/version.settings.view',
  'csui/models/node/node.model',
  'csui/models/actions',
  'csui/models/action',
  'csui/utils/connector',
  './versions.settings.mock.js',
  '../../../utils/testutils/async.test.utils.js'
], function ($, _, Backbone, Marionette, PageContext, VersionControlView, NodeModel,
    ActionCollection, ActionModel, Connector, VersionSettingsMock, TestUtils) {
  'use strict';

  describe('version settings view', function () {

    var versionControlView, boxRegion, regionEl, context;

    beforeAll(function () {

      TestUtils.restoreEnvironment();
      VersionSettingsMock.enable();
      var connector = new Connector({
        connection: {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/support',
          session: {
            ticket: 'dummy'
          }
        }
      });
      if (!context) {
        context = new PageContext({
          factories: {
            connector: {
              connection: connector
            }
          }
        });
      }

      var container   = new NodeModel({id: 20346268, type: 0, versions_control_advanced: false},
          {connector: connector}),
          actionModel = new ActionModel({
            method: "PUT",
            name: "versionscontrol",
            signature: "versionscontrol"
          });
      actionModel.id = "versionscontrol";
      container.actions = new ActionCollection(
          [actionModel]);
      var parentView = {
        container: container,
        unblockActions: function () {},
        blockActions: function () {}
      };
      regionEl = $('<div></div>').appendTo(document.body);
      versionControlView = new VersionControlView({
        parentView: parentView,
        model: container,
        context: context
      });

      boxRegion = new Marionette.Region({
        el: regionEl
      }).show(versionControlView);

    });

    afterAll(function () {
      TestUtils.cancelAllAsync();
      boxRegion.destroy();
      regionEl && regionEl.remove();
      TestUtils.restoreEnvironment();
      VersionSettingsMock.disable();
    });

    it('clicking on version settings icon, version setting view is loaded',
        function (done) {
          TestUtils.asyncElement('body',
              ".csui-toolbar-control-settings:visible").done(
              function (el) {
                expect(el.is(':visible')).toBeTruthy();
                el.trigger('click');
                TestUtils.asyncElement(versionControlView.$el,
                    '.csui-toolbar-control-settings-dropdown.binf-open').done(
                    function (ele) {
                      expect(ele.is(":visible")).toBeTruthy();
                      done();
                    });
              });
        });

    it('clicking on the major/minor versions toggle button, version folder persmission settings are loaded',
        function (done) {
          TestUtils.asyncElement('.csui-toolbar-control-settings-dropdown',
              ".cs-formfield.cs-booleanfield").done(
              function ($el) {
                expect($el.is(':visible')).toBeTruthy();
                var e = $.Event("mousedown", {pageX: 500});
                $('.binf-switch-container').trigger(e);
                $('.binf-switch-container').trigger('mouseup');
                TestUtils.asyncElement('.csui-toolbar-control-settings-dropdown',
                    ".csui-version-folder-permissions").done(
                    function ($el) {
                      expect($el.is(':visible')).toBeTruthy();
                      done();
                    });
              });
        });

    it('By default current folder option is selected, clicking on Currrent folder and Sub-folders option, it gets selected',
        function (done) {
          expect($("li.csui-folder-permissions-item[title='Current folder']").hasClass(
              'selected')).toBeTruthy();
          $("li.csui-folder-permissions-item[title='Currrent folder and sub-folders']").trigger(
              'click');
          TestUtils.asyncElement(
              "li.csui-folder-permissions-item[title='Currrent folder and sub-folders']",
              "span.icon-listview-checkmark").done(
              function ($el) {
                expect($el.is(':visible')).toBeTruthy();
                done();
              });
        });

    it('again clicking on the current folder option, it gets selected',
        function (done) {
          $("li.csui-folder-permissions-item[title='Current folder']").trigger('click');
          TestUtils.asyncElement("li.csui-folder-permissions-item[title='Current folder']",
              "span.icon-listview-checkmark").done(
              function ($el) {
                expect($el.is(':visible')).toBeTruthy();
                done();
              });
        });

    it('switching off the major/minor version, closes the options',
        function (done) {
          var e = $.Event("mousedown", {pageX: 500});
          $('.binf-switch-container').trigger(e);
          $('.binf-switch-container').trigger('mouseup');
          TestUtils.asyncElement('.csui-toolbar-control-settings-dropdown',
              ".csui-version-folder-permissions:visible", true).done(
              function ($el) {
                expect($el.is(':visible')).toBeFalsy();
                done();
              });
        });

    it('clicking on version settings icon when version settings view is open, closes it',
        function (done) {
          $('.csui-toolbar-control-settings').trigger('click');
          TestUtils.asyncElement('.csui-toolbar-control-settings-dropdown',
              ".csui-toolbar-settings-container", true).done(
              function ($el) {
                expect($el.is(':visible')).toBeFalsy();
                done();
              });
        });

    describe('saving states of version control', function () {
      it('turning major/mjnor version in version control on and saving it',
          function (done) {
            $(".csui-toolbar-control-settings").trigger('click');
            TestUtils.asyncElement(versionControlView.$el, ".cs-formfield.cs-booleanfield").done(
                function (ele) {
                  expect(ele.is(":visible")).toBeTruthy();
                  var e = $.Event("mousedown", {pageX: 500});
                  $('.binf-switch-container').trigger(e);
                  $('.binf-switch-container').trigger('mouseup');
                  TestUtils.asyncElement('.csui-toolbar-control-settings-dropdown',
                      ".csui-version-folder-permissions").done(
                      function ($el) {
                        expect($el.is(':visible')).toBeTruthy();
                        $(".csui-toolbar-control-settings").trigger('click');
                        TestUtils.asyncElement('.csui-toolbar-control-settings-dropdown',
                            ".csui-toolbar-settings-container", true).done(
                            function ($el) {
                              expect($el.is(':visible')).toBeFalsy();
                              setTimeout(done);

                            });
                      });
                });
          });

      it('major/minor version should be turned on',
          function (done) {
            TestUtils.asyncElement('body',
                ".csui-toolbar-control-settings:visible").done(
                function (el) {
                  expect(el.is(':visible')).toBeTruthy();
                  el.trigger('click');
                  TestUtils.asyncElement(versionControlView.$el, ".binf-switch-off").done(
                      function (ele) {
                        expect(ele.is(":visible")).toBeTruthy();
                        done();
                      });
                });
          });

      it('switching off major/mjnor version in version control, shows the version control dialog',
          function (done) {
            TestUtils.asyncElement(versionControlView.$el, ".cs-formfield.cs-booleanfield").done(
                function (ele) {
                  expect(ele.is(":visible")).toBeTruthy();
                  var e = $.Event("mousedown", {pageX: 500});
                  $('.binf-switch-container').trigger(e);
                  $('.binf-switch-container').trigger('mouseup');
                  TestUtils.asyncElement(document.body,
                      ".csui-version-control-dialog-view:visible").done(
                      function ($el) {
                        expect($el.is(':visible')).toBeTruthy();
                        done();
                      });
                });
          });

      it('pressing cancel, major/minor version wont be turned off',
          function (done) {
            $('.binf-modal-footer button#cancel').trigger('click');
            TestUtils.asyncElement('.document.body',
                ".csui-version-control-dialog", true).done(
                function (ele) {
                  expect(ele.is(":visible")).toBeFalsy();
                  $(".csui-toolbar-control-settings").trigger('click');
                  TestUtils.asyncElement(versionControlView.$el,
                      ".binf-switch-off").done(
                      function ($el) {
                        expect($el.is(':visible')).toBeTruthy();
                        done();
                      });
                });
          });

      it('switching off major/mjnor version in version control, shows the version control dialog',
          function (done) {
            TestUtils.asyncElement(versionControlView.$el, ".cs-formfield.cs-booleanfield").done(
                function (ele) {
                  expect(ele.is(":visible")).toBeTruthy();
                  var e = $.Event("mousedown", {pageX: 500});
                  $('.binf-switch-container').trigger(e);
                  $('.binf-switch-container').trigger('mouseup');
                  TestUtils.asyncElement(document.body,
                      ".csui-version-control-dialog-view:visible").done(
                      function ($el) {
                        expect($el.is(':visible')).toBeTruthy();
                        done();
                      });
                });
          });

      it('pressing apply, major/minor version will be turned off',
          function (done) {
            $('.csui-version-control-dialog .binf-modal-footer button#add').trigger('click');
            TestUtils.asyncElement('.document.body',
                ".csui-version-control-dialog:visible", true).done(
                function (ele) {
                  expect(ele.is(":visible")).toBeFalsy();
                  setTimeout(function () {
                    $(".csui-toolbar-control-settings").trigger('click');
                    TestUtils.asyncElement(versionControlView.$el,
                        ".binf-switch-on").done(
                        function ($el) {
                          expect($el.is(':visible')).toBeTruthy();
                          done();
                        });
                  }, 200);
                });
          });
    });
  });
});
