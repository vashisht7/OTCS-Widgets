/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/marionette', 'csui/lib/backbone', 'csui/lib/jquery',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/connector', 'csui/models/node/node.model',
  'csui/models/nodes', '../../testutils/async.test.utils.js',
  'csui/controls/globalmessage/globalmessage',
  'csui/utils/contexts/factories/application.scope.factory',
  "./edit.perspective.mock.js"
], function (require, Marionette, Backbone, $, PageContext, ConnectorFactory, NodeModel,
    NodeCollection, TestUtils, GlobalMessage, ApplicationScopeModelFactory, Mock) {
  'use strict';

  window.csui.require.config({
    config: {
      'csui/utils/commands/edit.perspective': {
        'enableInlinePerspectiveEditing': false,
        'enablePersonalization': false
      }
    }
  });

  xdescribe('Edit perspective Command', function () {

    var EditPerspective, editPerspectiveCommand, context, connector;

    beforeAll(function (done) {
      require(['csui/utils/commands/edit.perspective'], function (EditPerspectiveCommand) {
        EditPerspective = EditPerspectiveCommand;
        editPerspectiveCommand = new EditPerspective();
        Mock.enable();
        done();
      });
    });

    afterAll(function () {
      $('body').empty();
      Mock.disable();
    });

    it('can be constructed', function () {
      var helloCommand = new EditPerspective();
      expect(helloCommand instanceof EditPerspective).toBeTruthy();
    });

    it('is registered by default', function () {
      expect(editPerspectiveCommand).toBeDefined();
    });

    it('signature is "EditPerspective"', function () {
      expect(editPerspectiveCommand.get('signature')).toEqual('EditPerspective');
      expect(editPerspectiveCommand.get('command_key')).toBeUndefined();
    });

    describe('when executed with a node', function () {

      var messageLocation, status;

      beforeAll(function () {
        messageLocation = new Marionette.View();
        messageLocation.render();
        messageLocation.$el.height("62px");
        messageLocation.trigger('before:show');
        messageLocation.$el.appendTo(document.body);
        messageLocation.trigger('show');
        GlobalMessage.setMessageRegionView(messageLocation);
        var perspective = new Backbone.Model({canEditPerspective: true, id: 1, type: "flow"});
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
          },
        });
        context.perspective = perspective;
        connector = context.getObject(ConnectorFactory);
        status = {
          context: context
        };
      });

      afterAll(function () {
        messageLocation.destroy();
      });

      it('disable when node dont have perspectives configured', function () {
        var perspective = context.perspective;
        context.perspective = undefined;
        expect(editPerspectiveCommand.enabled(status)).toBeFalsy();
        context.perspective = perspective;
      });

      it('Open popup to choose between "Edit Page" or "Personalization', function (done) {
        context.perspective.set('type', 'flow');
        context.perspective.set('canEditPerspective', true);
        editPerspectiveCommand.execute(status, {
          inlinePerspectiveEditing: true,
          enablePersonalization: true
        });
        TestUtils.asyncElement('body', '.binf-modal-content').done(
            function (el) {
              expect(el.length).toEqual(1);
              done();
            });
      });

      it('Open inline editing page on execution', function (done) {
        TestUtils.asyncElement('body', '.binf-modal-content').done(
            function (el) {
              expect(el.length).toEqual(1);
              expect($(".binf-modal-title .title-text").attr('title')).toEqual("Edit Page");
              $('.binf-modal-footer .csui-yes').trigger('click');
              TestUtils.asyncElement('.perspective-editing', '.pman-mode-edit').done(function (em) {
                expect(em.length).toEqual(1);
                done();
              });
            });
      });

      it('Open inline personalize page on execution', function (done) {
        editPerspectiveCommand.execute(status,
            {inlinePerspectiveEditing: true, enablePersonalization: true});
        TestUtils.asyncElement('body', '.binf-modal-content').done(
            function (el) {
              expect(el.length).toEqual(1);
              expect($(".binf-modal-title .title-text").attr('title')).toEqual("Edit Page");
              $('.binf-modal-footer .csui-no').trigger('click');
              TestUtils.asyncElement('.perspective-editing', '.pman-mode-personalize').done(
                  function (em) {
                    expect(em.length).toEqual(1);
                    done();
                  });
            });
      });

      it('Allow edit page when layout is LCR', function (done) {
        context.perspective.set('type', "left-center-right");
        editPerspectiveCommand.execute(status,
            {inlinePerspectiveEditing: true, enablePersonalization: true});
        TestUtils.asyncElement('.perspective-editing', '.pman-mode-edit').done(
            function (el) {
              expect(el.length).toEqual(1);
              done();
            });
      });

      it('Create perspective', function (done) {
        var appScope = context.getModel(ApplicationScopeModelFactory, {
          permanent: true,
          detached: true
        });
        appScope.set('id', 'node');
        context._applicationScope = appScope;
        context.perspective.set('canEditPerspective', true);
        context.perspective.unset('id');
        editPerspectiveCommand.execute(status,
            {inlinePerspectiveEditing: true, enablePersonalization: true});
        TestUtils.asyncElement('.perspective-editing', '.pman-mode-edit').done(
            function (el) {
              expect(el.length).toEqual(1);
              done();
            });
      });

      it('Allow create perspective in classic mode', function (done) {
        editPerspectiveCommand.execute(status,
            {inlinePerspectiveEditing: false, enablePersonalization: false}).done(
            function () {
              expect($('.pman').length > 0).toBeTruthy();
              done();
            });
      });

      it('Allow edit perspective in classic mode', function (done) {
        context.perspective.set('id', 1);
        editPerspectiveCommand.execute(status,
            {inlinePerspectiveEditing: false, enablePersonalization: false}).done(
            function () {
              expect($('.pman').length > 0).toBeTruthy();
              done();
            });

      });

    });

  });

});
