/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/jquery',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/node',
  'conws/utils/test/testutil',
  'conws/widgets/header/header.view',
  'conws/widgets/header/impl/header.model',
  'conws/widgets/header/impl/header.icon.model',
  'conws/widgets/header/impl/editicon.view',
  'esoc/widgets/utils/commentdialog/commentdialog.view',
  './dialogs/tabable.test.view.js',
  './header.mock.testmanager.js',
  'csui/utils/log',
  'csui/lib/jquery.simulate',
  'csui/lib/jquery.simulate.ext',
  'csui/lib/jquery.simulate.key-sequence'
], function ($, PageContext, NodeModelFactory, TestUtil, HeaderView, HeaderModel, HeaderIconModel,
    EditIconView, CommentDialogView, TabableTestView, TestManager, log) {

  describe('HeaderView', function () {

    var view;

    describe('HeaderIconModel', function () {

      var headerModel;
      var model;

      beforeEach(function () {
        TestManager.reset();
        TestManager.init('Workspace');
        TestManager.prepare('Workspace');
        headerModel = TestManager.view.model;
        model = new HeaderIconModel({},
            {connector: headerModel.connector, node: headerModel});
        spyOn(model, 'save');
        spyOn(model, 'destroy');

      });

      describe('model', function () {

        it('is initialized correctly.', function () {
            expect(function () {
              model.get('id').toBe(headerModel.get('id'))
            });
            expect(function () {
              model.connector.toBe(headerModel.connector)
            });
            expect(function () {
              model.url().toBe('//server/otcs/cs/api/v2/businessworkspaces/' + headerModel.get('id') +
                '/icons')
            });
        });

        it('add image correctly.', function () {

            model.add([{file: 'file.txt'}]);
            expect(model.save.calls.first().args[0] instanceof FormData).toBeTruthy();
            expect(model.save.calls.first().args[1].data instanceof FormData).toBeTruthy();
            expect(model.save.calls.first().args[1].type).toEqual('POST');
            expect(model.save.calls.first().args[1].contentType).toEqual(false);
        });

        it('updates image correctly.', function () {

          model.update([{file: 'file.txt'}]);
          expect(model.save.calls.first().args[0] instanceof FormData).toBeTruthy();
          expect(model.save.calls.first().args[1].data instanceof FormData).toBeTruthy();
          expect(model.save.calls.first().args[1].type).toEqual('POST');
          expect(model.save.calls.first().args[1].contentType).toEqual(false);
        });

        it('deletes image correctly.', function () {

          model.remove();
          expect(model.destroy).toHaveBeenCalled();
        });
      });
    });

    describe('EditIconView', function () {

      describe('creation', function () {

        it('without options initializes with defaults', function () {
          var view = new EditIconView({});
          expect(view.options).toBeDefined();
          expect(view.options.title.length > 0).toBeTruthy();
          expect(view.options.message.length > 0).toBeTruthy();
          expect(view.options.resetButton).toBeTruthy();
          expect(view.options.uploadButton).toBeTruthy();
        });

        it('with options initializes correctly', function () {
          var view = new EditIconView({
            title: 'title',
            message: 'message',
            resetButton: false,
            uploadButton: false
          });
          expect(view.options).toBeDefined();
          expect(view.options.title).toEqual('title');
          expect(view.options.message).toEqual('message');
          expect(view.options.resetButton).toBeFalsy();
          expect(view.options.uploadButton).toBeFalsy();
        });
      });

      describe('render', function () {

        it('with options renders correctly.', function () {
          var view = new EditIconView({
            title: 'title',
            message: 'message'
          });
          view.render();
          expect(view.$('.title').text()).toEqual('title');
          expect(view.$('.message').text()).toEqual('message');
          expect(view.$('.reset').length).toEqual(1);
          expect(view.$('.reset').text()).toEqual('Reset');
          expect(view.$('.upload').length).toEqual(1);
          expect(view.$('.upload').text()).toEqual('Change');
          expect(view.$('.cancel').length).toEqual(1);
          expect(view.$('.cancel').text()).toEqual('Cancel');
        });

        it('with options renders correctly and hides buttons.', function () {
          var view = new EditIconView({
            title: 'title',
            message: 'message',
            resetButton: false,
            uploadButton: false
          });
          view.render();
          expect(view.$('.title').text()).toEqual('title');
          expect(view.$('.message').text()).toEqual('message');
          expect(view.$('.reset').length).toEqual(0);
          expect(view.$('.upload').length).toEqual(0);
          expect(view.$('.cancel').length).toEqual(1);
          expect(view.$('.cancel').text()).toEqual('Cancel');
        });
      });

      describe('callback', function () {

        it('is invoked correctly', function () {
          var val;
          var view = new EditIconView({
            callback: function (e) {
              val = e;
            }
          });
          view.render();
          view.$('.reset > a').trigger('click');
          expect(val).toEqual('reset');
          view.$('.upload').trigger('click');
          expect(val).toEqual('upload');
          view.$('.cancel').trigger('click');
          expect(val).toEqual('cancel');
        });
      });
    });

    describe('view creation', function () {

      describe('... fails', function () {

        it('... as it requires the context to be set', function () {
          expect(function () {
            view = new HeaderView();
          }).toThrowError('Context is missing in the constructor options');
        });
      });

      describe('... succeeds', function () {

        beforeEach(function () {
          TestManager.reset();
          TestManager.init(4711);

          view = TestManager.view;
        });

        it('... if the node info is set', function () {
          expect(
              view instanceof HeaderView
          ).toBeTruthy();
        });

        it('... and the model is initialized correctly', function () {
          expect(
              view.model instanceof HeaderModel
          ).toBeTruthy();
          expect(
              view.model.get('id')
          ).toBe(4711);
          expect(
              view.iconModel instanceof HeaderIconModel
          ).toBeTruthy();
          expect(
              view.iconModel.get('id')
          ).toBe(4711);
        });
      });
    });

    describe('view fetches', function () {
      beforeEach(function () {
        TestManager.reset();
        TestManager.init('Workspace');

        view = TestManager.view;
      });

      it('... existing node', function (done) {
        TestManager.fetch(done,view, view.model.get('id'));
        TestUtil.run(done,function () {
          expect(view.model.get('name')).toBe('Equipment Roller Support Stand');
          expect(view.model.attributes.name).toBe('Equipment Roller Support Stand');
          expect(view.model.categories["20368"]["20368_3"])
              .toBe("This all-purpose assistant helps you to saw large workpieces. Panels, large " +
                    "wooden boards and floorboards are easily placed on the stand, aligned on it and positioned " +
                    "against its stop. And the PTA 1000 weighs only about 6 kg, so it is just as easy to transport");
          expect(view.model.business_properties.workspace_type_name).toBe('Equipment');
          expect(view.model.icon).toBeDefined();
        });
      });
    });

    describe('view renders', function () {

      it('... correctly without configuration.. check description hidden', function (done) {
        TestManager.reset();
        TestManager.init('Workspace');
        view = TestManager.view;
        view.options.hideDescription = true;

        TestManager.fetch(done,view, view.model.get('id'));
        TestUtil.run(done,function () {
          expect(view.$('div .conws-header-desc .conws-description').length).toBe(0);
        });
      });

      it('... correctly without configuration..', function (done) {
        TestManager.reset();
        TestManager.init('Workspace');
        view = TestManager.view;
        TestManager.fetch(done, view, view.model.get('id'));
        TestUtil.run(done, function () {
          expect(view.$('div .conws-header-edit > div > img').html()).toBe('');
          expect(view.$('div .conws-header-title > h1').length).toBe(1);
          expect(view.$('div .conws-header-title > h1').html()).toBe('');
          expect(view.$('div .conws-header-type > p').length).toBe(1);
          expect(view.$('div .conws-header-type > p').html()).toBe('');
          expect(view.$('div .conws-header-desc').length).toBe(0);
          expect(view.$('div #conws-header-childview').length).toBe(0);
          expect(view.$('.conws-header-wrapper .conws-header-metadata-extension').length).toBe(0);
          expect(view.tabBarRightExtensionView).toBeDefined();
          expect(view.$('.conws-header-toolbar-extension').length).toBe(0);
          expect(view.$('.conws-header-wrapper .conws-header-toolbar li[id^="Comment"]').length).toBe(1);
          expect(view.$(
              '.conws-header-wrapper .conws-header-toolbar .conws-rightToolbar li[id^="Favorite"]').length).toBe(1);

          expect(view.$('.conws-header-wrapper .conws-header-toolbar .conws-rightToolbar li[id^="Favorite"] button')
		  .hasClass('csui-favorite-star')).toBeTruthy();
		  
		  expect(view.$('.conws-header-wrapper .conws-header-toolbar .conws-rightToolbar li[id^="Favorite"] button')
		  .hasClass('selected')).toBeFalsy();
          expect(view.$('.conws-header-wrapper .conws-header-toolbar .conws-delayedActionsToolbar').length).toBe(
            1);
          expect(view.$(
            '.conws-header-wrapper .conws-header-toolbar .conws-delayedActionsToolbar li[data-csui-command=copylink]').length).toBe(
            1);
            
            
        });
      });

      it('... comment and favorite icons are not shown based on the options', function (done) {
        TestManager.reset();
        TestManager.view = true;
        TestManager.init('Workspace');

        var viewOptions = {
          toolbarBlacklist: ['Comment', 'Favorite2'],
          context: TestManager.context,
          data: {}
        };
        view = TestManager.view = new HeaderView(viewOptions);

        TestManager.fetch(done, view, view.model.get('id'));
        TestUtil.run(done, function () {
          expect(view.$('div .conws-header-toolbar li[id^="Comment"]').length).toBe(0);
          expect(view.$('div .conws-header-toolbar .conws-rightToolbar li[id^="Favorite"]').length).toBe(
              0);
          expect(view.$('.conws-header-wrapper .conws-header-toolbar .conws-rightToolbar li[id^="Favorite"] button').length).toBe(0);
        });
      });

      it('... comment icon is not shown and favorite icon is shown based on the options',
        function (done) {
          TestManager.reset();
          TestManager.view = true;
          TestManager.init('Workspace');

          var viewOptions = {
            toolbarBlacklist: ['Comment'],
            context: TestManager.context,
            data: {}
          };
          view = TestManager.view = new HeaderView(viewOptions);
          TestManager.fetch(done, view, view.model.get('id'));
          TestUtil.run(done, function () {
            expect(view.$('div .conws-header-toolbar li[id^="Comment"]').length).toBe(0);
            expect(
                view.$('div .conws-header-toolbar .conws-rightToolbar li[id^="Favorite2"]').length).toBe(
                1);
          });
        });

      it('... workspace type,description, activity feed,toolbar not shown based on the options',
        function (done) {
          TestManager.reset();
          TestManager.view = true;
          TestManager.init('Workspace');

          var viewOptions = {
            hideToolbar: true,
            hideWorkspaceType: true,
            hideDescription: true,
            hideActivityFeed: true,
            context: TestManager.context,
            data: {}
          };
          view = TestManager.view = new HeaderView(viewOptions);

          TestManager.fetch(done, view, view.model.get('id'));
          TestUtil.run(done, function () {
            expect(view.$('div .conws-header-type > p').length).toBe(0);
            expect(view.$('div .conws-header-desc .conws-description').length).toBe(0);

            expect(view.$('div #conws-header-childview').length).toBe(0);
            expect(view.$('div .conws-header-toolbar .conws-rightToolbar').length).toBe(0);

          });
        });

      it('... metadata extension placeholder is shown based on the option', function (done) {
        TestManager.reset();
        TestManager.view = true;
        TestManager.init('Workspace');

        var viewOptions = {
          hasMetadataExtension: true,
          context: TestManager.context,
          data: {}
        };
        view = TestManager.view = new HeaderView(viewOptions);

        TestManager.fetch(done, view, view.model.get('id'));
        TestUtil.run(done, function () {

          expect(view.$('.conws-header-wrapper .conws-header-metadata-extension').length).toBe(1);

        });
      });

      it('... toolbar extension is not set based on the option', function (done) {
        TestManager.reset();
        TestManager.view = true;
        TestManager.init('Workspace');

        var viewOptions = {
          hideToolbarExtension: true,
          context: TestManager.context,
          data: {}
        };
        view = TestManager.view = new HeaderView(viewOptions);

        TestManager.fetch(done, view, view.model.get('id'));
        TestUtil.run(done, function () {
          expect(view.tabBarRightExtensionView).toBeUndefined();
        });
      });

      it('... correctly as configured with child widget', function (done) {
        TestManager.reset();
        TestManager.init('Workspace', {
          workspace: {
            properties: {
              icon: "{categories.20368_2}",
              title: "{name}",
              type: "{workspace_type_name}",
              description: "{categories.23228_18_1_19} {categories.23228_18_1_21}\n" +
                           "{categories.23228_2_1_8.value}"
            }
          },
          widget: {
            type: "src/widgets/header/test/controls/feeds.mock",
            options: {
              x: "y"
            }
          }
        });
        view = TestManager.view;
        TestManager.fetch(done,view, view.model.get('id'));
        TestUtil.run(done,function () {
          expect(view.$('div .conws-header-edit > div').length).toBe(2);
          expect(view.$('div .header-image > img').attr('src').match('image.png')).toBeTruthy();
          expect(view.$('div .header-editor > span').length).toBe(1);
          expect(view.$('div .conws-header-title > h1').length).toBe(1);
          expect(view.$('div .conws-header-title > h1').html()).toBe(
              'Equipment Roller Support Stand');
          expect(view.$('div .conws-header-type > p').length).toBe(1);
          expect(view.$('div .conws-header-type > p').html()).toBe('Equipment');
          expect(view.$('div .conws-header-desc .conws-description > span').length).toBe(1);
          expect(view.$('div .conws-header-desc .conws-description > span').html()).toBe(
              'Bosch PTA 1000\nThe flexible PTA 1000. Perfect support when sawing large' +
              ' workpieces');
          expect(view.$('div #conws-header-childview').length).toBe(1);
          expect(view.$('div .conws-header-toolbar li[id^="Comment"]').length).toBe(1);
          expect(view.$('div .conws-header-toolbar .conws-rightToolbar li[id^="Favorite"]').length).toBe(1);
          expect(view.$('.conws-header-wrapper .conws-header-toolbar .conws-rightToolbar li[id^="Favorite"] button')
          .hasClass('csui-favorite-star')).toBeTruthy();
		  expect(view.$('.conws-header-wrapper .conws-header-toolbar .conws-rightToolbar li[id^="Favorite"] button')
          .hasClass('selected')).toBeFalsy();
        });
      });

      it('... correctly as configured with favorite set', function (done) {
        TestManager.reset();
        TestManager.init('Workspace', {
          workspace: {
            properties: {
              icon: "{categories.20368_2}",
              title: "{name}",
              type: "{workspace_type_name}",
              description: "{categories.23228_18_1_19} {categories.23228_18_1_21}. {categories.23228_2_1_8.value}"
            }
          },
          widget: {
            type: "src/widgets/header/test/controls/feeds.mock",
            options: {
              x: "y"
            }
          }
        });
        view = TestManager.view;
        view.options.model.node.set('favorite', true);
        TestManager.fetch(done,view, view.model.get('id'));
        TestUtil.run(done,function () {
          expect(view.$('div .conws-header-edit > div').length).toBe(2);
          expect(view.$('div .header-image > img').attr('src').match('image.png')).toBeTruthy();
          expect(view.$('div .header-editor > span').length).toBe(1);
          expect(view.$('div .conws-header-title > h1').length).toBe(1);
          expect(view.$('div .conws-header-title > h1').html()).toBe(
              'Equipment Roller Support Stand');
          expect(view.$('div .conws-header-type > p').length).toBe(1);
          expect(view.$('div .conws-header-type > p').html()).toBe('Equipment');
          expect(view.$('div .conws-header-desc .conws-description > span').length).toBe(1);
          expect(view.$('div .conws-header-desc .conws-description > span').html()).toBe(
              'Bosch PTA 1000. The flexible PTA 1000. Perfect support when sawing large workpieces');
          expect(view.$('div #conws-header-childview').length).toBe(1);
          expect(view.$('div .conws-header-toolbar .conws-rightToolbar li[id^="Comment"]').length).toBe(1);
          expect(view.$('div .conws-header-toolbar .conws-rightToolbar li[id^="Favorite"]').length).toBe(1);
          expect(view.$('.conws-header-wrapper .conws-header-toolbar .conws-rightToolbar li[id^="Favorite"] button')
          .hasClass('csui-favorite-star')).toBeTruthy();
		  expect(view.$('.conws-header-wrapper .conws-header-toolbar .conws-rightToolbar li[id^="Favorite"] button')
          .hasClass('selected')).toBeTruthy();
        });
      });

      it('... correctly remove favorite via onclick', function (done) {
        TestManager.reset();
        TestManager.init('Workspace', {
          workspace: {
            properties: {
              icon: "{categories.20368_2}",
              title: "{name}",
              type: "{workspace_type_name}",
              description: "{categories.23228_18_1_19} {categories.23228_18_1_21}. {categories.23228_2_1_8.value}"
            }
          },
          widget: {
            type: "src/widgets/header/test/controls/feeds.mock",
            options: {
              x: "y"
            }
          }
        });
        view = TestManager.view;
        view.options.model.node.set('favorite', true);
        TestManager.fetch(done,view, view.model.get('id'));
        TestUtil.run(done,function () {
          expect(view.$('div .conws-header-toolbar .conws-rightToolbar li[id^="Comment"]').length).toBe(1);
          expect(view.$('div .conws-header-toolbar .conws-rightToolbar li[id^="Favorite"]').length).toBe(1);
		  var buttonEl = view.$('.conws-header-wrapper .conws-header-toolbar .conws-rightToolbar li[id^="Favorite"] button');
		  expect(buttonEl.length).toBe(1);
          expect(buttonEl.hasClass('csui-favorite-star')).toBeTruthy();
		  expect(buttonEl.hasClass('selected')).toBeTruthy();
         buttonEl.trigger('click');
          TestUtil.waitFor(done,function () {
            return (view.$('div .conws-header-toolbar .conws-rightToolbar li[id^="Favorite"] button').length === 1);
          }, 'Failed to remove favorite!', 200);
          TestUtil.run(done,function () {

            expect(view.$('div .conws-header-toolbar .conws-rightToolbar li[id^="Favorite"]').length).toBe(1);
            expect(view.$('.conws-header-wrapper .conws-header-toolbar .conws-rightToolbar li[id^="Favorite"] button')
            .hasClass('csui-favorite-star')).toBeTruthy();
			expect(view.$('.conws-header-wrapper .conws-header-toolbar .conws-rightToolbar li[id^="Favorite"] button')
            .hasClass('selected')).toBeFalsy();
          });
        });
      });

      describe('... with different image configurations', function () {

        it('... correctly as configured with image - workspace type has image configured',
            function (done) {
              TestManager.reset();
              TestManager.init('Workspace', {
                workspace: {
                  properties: {
                    title: "{name}",
                    type: "{business_properties.workspace_type_name}",
                    description: "{categories.23228_18_1_19} {categories.23228_18_1_21}. {categories.23228_2_1_8.value}"
                  }
                }
              });
              view = TestManager.view;
              TestManager.fetch(done,view, view.model.get('id'));
              TestUtil.run(done,function () {
                expect(view.$('div .conws-header-edit > div').length).toBe(2);
                expect(view.$('div .header-image > img').attr('src').search(
                    'data:image/png;base64,')).toBe(0);
                expect(view.$('div .header-image > img').attr('class')).toBe('');
                expect(view.$('div .header-editor > span').length).toBe(1);
                expect(view.$('div .conws-header-title > h1').length).toBe(1);
                expect(view.$('div .conws-header-title > h1').html()).toBe(
                    'Equipment Roller Support Stand');
                expect(view.$('div .conws-header-type > p').length).toBe(1);
                expect(view.$('div .conws-header-type > p').html()).toBe('Equipment');
                expect(view.$('div .conws-header-desc .conws-description > span').length).toBe(1);
                expect(view.$('div .conws-header-desc .conws-description > span').html()).toBe(
                    'Bosch PTA 1000. The flexible PTA 1000. Perfect support when sawing large workpieces');
                expect(view.$('div #conws-header-childview').length).toBe(0);
                expect(view.$('.conws-header-toolbar .conws-rightToolbar li[id^="Comment"]').length).toBe(1);
              });
            });

        it('... correctly as configured with image - workspace instance image configured',
            function (done) {
              TestManager.reset();
              TestManager.init('WSImage', {
                workspace: {
                  properties: {
                    title: "{name}",
                    type: "{business_properties.workspace_type_name}",
                    description: "{categories.23228_18_1_19} {categories.23228_18_1_21}. {categories.23228_2_1_8.value}"
                  }
                }
              });
              view = TestManager.view;
              TestManager.fetch(done,view, view.model.get('id'));
              TestUtil.run(done,function () {
                expect(view.$('div .conws-header-edit > div').length).toBe(2);
                expect(view.$('div .header-image > img').attr('src').search(
                    'data:image/png;base64,')).toBe(0);
                expect(view.$('div .header-image > img').attr('class')).toBe('');
                expect(view.$('div .header-editor > span').length).toBe(1);
                expect(view.$('div .conws-header-title > h1').length).toBe(1);
                expect(view.$('div .conws-header-title > h1').html()).toBe(
                    'Equipment Roller Support Stand');
                expect(view.$('div .conws-header-type > p').length).toBe(1);
                expect(view.$('div .conws-header-type > p').html()).toBe('Equipment');
                expect(view.$('div .conws-header-desc .conws-description > span').length).toBe(1);
                expect(view.$('div .conws-header-desc .conws-description > span').html()).toBe(
                    'Bosch PTA 1000. The flexible PTA 1000. Perfect support when sawing large workpieces');
                expect(view.$('div #conws-header-childview').length).toBe(0);
                expect(view.$('div .conws-header-toolbar .conws-rightToolbar li[id^="Comment"]').length).toBe(1);
              });
            });

        it('... correctly as configured with image - workspace type has no image configured',
            function (done) {
              TestManager.reset();
              TestManager.init('NoImage', {
                workspace: {
                  properties: {
                    title: "{name}",
                    type: "{business_properties.workspace_type_name}",
                    description: "{categories.23228_18_1_19} {categories.23228_18_1_21}. {categories.23228_2_1_8.value}"
                  }
                }
              });
              view = TestManager.view;
              TestManager.fetch(done,view, view.model.get('id'));
              TestUtil.run(done,function () {
                expect(view.$('div .conws-header-edit > div').length).toBe(2);
                expect(view.$('div .header-image > img').attr('src')).toBe(view.blankImage);
                expect(view.$('div .header-image > img').attr('class')).toBe(
                    'csui-icon conws-mime_workspace');
                expect(view.$('div .header-editor > span').length).toBe(1);
                expect(view.$('div .conws-header-title > h1').length).toBe(1);
                expect(view.$('div .conws-header-title > h1').html()).toBe(
                    'Equipment Roller Support Stand');
                expect(view.$('div .conws-header-type > p').length).toBe(1);
                expect(view.$('div .conws-header-type > p').html()).toBe('Equipment');
                expect(view.$('div .conws-header-desc .conws-description > span').length).toBe(1);
                expect(view.$('div .conws-header-desc .conws-description > span').html()).toBe(
                    'Bosch PTA 1000. The flexible PTA 1000. Perfect support when sawing large workpieces');
                expect(view.$('div #conws-header-childview').length).toBe(0);
                expect(view.$('div .conws-header-toolbar .conws-rightToolbar li[id^="Comment"]').length).toBe(1);
              });
            });
      });

      describe('... with different image edit actions', function () {

        it('... image edit elements available as all actions are available', function (done) {
          TestManager.reset();
          TestManager.init('Workspace', {
            workspace: {
              properties: {
                title: "{name}",
                type: "{business_properties.workspace_type_name}",
                description: "{categories.23228_18_1_19} {categories.23228_18_1_21}. {categories.23228_2_1_8.value}"
              }
            }
          });
          view = TestManager.view;
          TestManager.fetch(done,view, view.model.get('id'));
          TestUtil.run(done,function () {
            expect(view.$('.conws-header-image > div.conws-header-edit').length).toBe(1);
            expect(view.$('.conws-header-image > input').length).toBe(1);
            expect(view.$('.conws-header-image > input').attr('accept')).toBe(
                'image/gif, image/x-png, image/jpeg, image/pjpeg, image/png, image/svg+xml');
            expect(view.$('.conws-header-image > img').length).toBe(0);
          });
        });

        it('... image edit elements available as some actions are available', function (done) {
          TestManager.reset();
          TestManager.init('WorkspaceSomeActions', {
            workspace: {
              properties: {
                title: "{name}",
                type: "{business_properties.workspace_type_name}",
                description: "{categories.23228_18_1_19} {categories.23228_18_1_21}. {categories.23228_2_1_8.value}"
              }
            }
          });
          view = TestManager.view;
          TestManager.fetch(done,view, view.model.get('id'));
          TestUtil.run(done,function () {
            expect(view.$('div .conws-header-edit > div').length).toBe(2);
            expect(view.$('.conws-header-image > input').length).toBe(1);
            expect(view.$('.conws-header-image > input').attr('accept')).toBe(
                'image/gif, image/x-png, image/jpeg, image/pjpeg, image/png, image/svg+xml');
            expect(view.$('.conws-header-image > img').length).toBe(0);
            expect(view.$('div .header-editor > span').length).toBe(1);
          });
        });

        it('... image edit elements not available as no actions are available', function (done) {
          TestManager.reset();
          TestManager.init('WorkspaceNoActions', {
            workspace: {
              properties: {
                title: "{name}",
                type: "{business_properties.workspace_type_name}",
                description: "{categories.23228_18_1_19} {categories.23228_18_1_21}. {categories.23228_2_1_8.value}"
              }
            }
          });
          view = TestManager.view;
          TestManager.fetch(done,view, view.model.get('id'));
          TestUtil.run(done,function () {
            expect(view.$('.conws-header-image > img').length).toBe(1);
            expect(view.$('.conws-header-image > a').length).toBe(0);
            expect(view.$('.conws-header-image > input').length).toBe(0);
          });
        });

        it('... image upload filetypes are restricted in configuration', function (done) {
          TestManager.reset();
          TestManager.init('Workspace', {
            iconFileTypes: "image/png",
            workspace: {
              properties: {
                title: "{name}",
                type: "{business_properties.workspace_type_name}",
                description: "{categories.23228_18_1_19} {categories.23228_18_1_21}. {categories.23228_2_1_8.value}"
              }
            }
          });
          view = TestManager.view;
          TestManager.fetch(done,view, view.model.get('id'));
          TestUtil.run(done,function () {
            expect(view.$('.conws-header-image > div.conws-header-edit').length).toBe(1);
            expect(view.$('.conws-header-image > input').length).toBe(1);
            expect(view.$('.conws-header-image > input').attr('accept')).toBe('image/png');
            expect(view.$('.conws-header-image > img').length).toBe(0);
          });
        });
      });
    });

    describe('view private function ', function () {

      it('... \'resolveProperty\' works as expected', function (done) {
        TestManager.reset();
        TestManager.init('Workspace', {
          workspace: {
            properties: {
              name: "{name}",
              category: "{categories.23228_18_1_19}",
              business_property: "{business_properties.workspace_type_name}",
              mixed: "Workspace \'{name}\' with the node id \'{id}\'.",
              invalid: "{not_existing_property}",
              date: "{categories.23228_2_1_39}",
              node_user: "{owner_user_id}"
            }
          }
        });
        view = TestManager.view;
        TestManager.fetch(done,view, 'Workspace');
        TestUtil.run(done,function () {
          expect(view.resolveProperty('name'))
              .toBe('Equipment Roller Support Stand');
          expect(view.resolveProperty('category'))
              .toBe('Bosch');
          expect(view.resolveProperty('business_property'))
              .toBe('Equipment');
          expect(view.resolveProperty('mixed'))
              .toBe('Workspace \'' + view.model.get('name') + '\' with the node id \'' +
                    view.model.get('id') + '\'.');
          expect(view.resolveProperty('invalid'))
              .toBe('');
          expect(view.resolveProperty('invalid_key'))
              .toBe('');
          expect(view.resolveProperty('date'))
              .toBe('01/01/2015');
          expect(view.resolveProperty('node_user'))
              .toBe('Administrator, Mighty');
          expect(view.resolveProperty('date'))
              .toBe('01/01/2015');
        });
      });

      it('... \'resolveProperty\' supports user/group category fields', function (done) {
        TestManager.reset();
        TestManager.init('Workspace', {
          workspace: {
            properties: {
              multi_value_user: "{categories.20368_4}",
              multi_value_user_set: "{categories.20368_5_1_6}"
            }
          }
        });
        view = TestManager.view;
        TestManager.fetch(done,view, 'Workspace');
        TestUtil.run(done,function () {
          expect(view.resolveProperty('multi_value_user')).toBe('');
          expect(view.resolveProperty('multi_value_user_set')).toBe('');
        });
        TestManager.wait(done);
        TestUtil.run(done,function () {
          expect(view.resolveProperty('multi_value_user'))
              .toBe('Mighty Administrator; Mighty Administrator');
          expect(view.resolveProperty('multi_value_user_set'))
              .toBe('Mighty Administrator; Mighty Administrator; Mighty Administrator');
        });
      });

      it('... \'resolveProperty\' supports multi-value fields', function (done) {
        TestManager.reset();
        TestManager.init('MultiValueAttributes', {
          workspace: {
            properties: {
              multi_value: "{categories.111228_2}",
              multi_value_empty: "{categories.111228_3}"
            }
          }
        });
        view = TestManager.view;
        TestManager.fetch(done,view, 'MultiValueAttributes');
        TestUtil.run(done,function () {
          expect(view.resolveProperty('multi_value'))
              .toBe('01/01/2001; 01/01/2010; 01/01/2100');
          expect(view.resolveProperty('multi_value_empty'))
              .toBe('');
        });
      });

      it('... \'renderPopover\' renders the popover view correctly', function (done) {
        TestManager.reset();
        TestManager.init('Workspace', {
          iconFileSize: 512000,
          workspace: {
            properties: {
              icon: "{categories.20368_2}",
              title: "{name}",
              type: "{workspace_type_name}",
              description: "{categories.23228_18_1_19} {categories.23228_18_1_21}. {categories.23228_2_1_8.value}"
            }
          }
        });
        view = TestManager.view;
        TestManager.fetch(done,view, view.model.get('id'));
        TestUtil.run(done,function () {
          var ret = view.renderPopover();
          expect(ret.querySelector('.message').textContent.search('500 KB')).not.toEqual(-1);
        });
      });
    });

    describe('model changes ', function () {

      it('...node model changes are observed by the view', function (done) {
        TestManager.reset();
        TestManager.init(4711);

        TestUtil.run(done,function () {
          expect(TestManager.view.model.get('id')).toBe(4711);
          expect(TestManager.view.iconModel.get('id')).toBe(4711);
        });

        var prom;
        TestUtil.run(done,function () {
          var nodeModel = TestManager.context.getObject(NodeModelFactory,
              TestManager.context.options);
          TestManager.prepare(815);
          nodeModel.set({'id': 815});
          prom = TestManager.view.options.workspaceContext.fetch();
        });

        TestUtil.waitFor(done,function () {
          var state = prom.state();
          return state === "resolved";
        }, "context fetch", 1000);

        TestUtil.run(done,function () {
          expect(TestManager.view.model.get('id')).toBe(815);
          expect(TestManager.view.iconModel.get('id')).toBe(815);
        });
      });

      it('...node model changes are ignored on sub-type changes by the view', function (done) {
        TestManager.reset();
        TestManager.init(4711);

        TestUtil.run(done,function () {
          expect(TestManager.view.model.get('id')).toBe(4711);
          expect(TestManager.view.iconModel.get('id')).toBe(4711);
        });

        var prom;
        TestUtil.run(done,function () {
          var nodeModel = TestManager.context.getObject(NodeModelFactory,
              TestManager.context.options);
          TestManager.prepare(4711);
          TestManager.prepareWkspId(815, 4711);
          nodeModel.set({'id': 815, 'type': 0});
          prom = TestManager.view.options.workspaceContext.fetch();
        });

        TestUtil.waitFor(done,function () {
          var state = prom.state();
          return state === "resolved";
        }, "context fetch", 1000);

        TestUtil.run(done,function () {
          expect(TestManager.view.model.get('id')).toBe(4711);
          expect(TestManager.view.iconModel.get('id')).toBe(4711);
        });
      });
    });

    xdescribe('header view can be navigated with keyboard', function () {

      it('... with all view elements', function (done) {

        var view, tabable;

        TestUtil.run(done,function (done) {
          TestManager.reset();
          TestManager.init('Workspace', {
            workspace: {
              properties: {
                icon: "{categories.20368_2}",
                title: "{name}",
                type: "{workspace_type_name}",
                description: "{categories.23228_18_1_19} {categories.23228_18_1_21}\n" +
                             "{categories.23228_2_1_8.value}"
              }
            },
            widget: {
              type: "src/widgets/header/test/controls/feeds.mock",
              options: {
                x: "y"
              }
            }
          });
          TestManager.prepare('Workspace');
          view = TestManager.view;
          tabable = new TabableTestView({
            view: view
          });
          $('body').append(tabable.$el); // must add to page to make tab simulation working
          tabable.show();
          TestManager.fetch(done,TestManager.view, TestManager.view.model.get('id'));

        },"run1");

        TestUtil.waitFor(done,function () {
          return (view.$('div.conws-header-comment > div.conws-comment-icon a').length === 1);
        }, 'Failed to find commenting icon link!', 200);

        var iconEl, commentEl, favoriteEl, iconTabbed, commentTabbed, favoriteTabbed, focusEl;

        TestUtil.run(done,function () {
          window.tabelIcon = iconEl = view.$(".conws-header-edit");
          window.tabelComment = commentEl = view.$(".cs-icon.cs-icon-comment");
          window.tabelFavorite = favoriteEl = view.$(".csui-favorite-star");
          iconTabbed = false;
          commentTabbed = false;
          favoriteTabbed = false;
          focusEl = favoriteEl;
          focusEl.trigger('focus');
        },"run2");

        for (var ii = 1; ii<=3; ii++) {
          (function (ii) {
            TestUtil.run(done,function () {
              log.info("simulate tab "+ii) && console.log(log.last);
              focusEl.simulate('key-sequence', {sequence: '\x09'});
            },"run tab"+ii);

            TestUtil.run(done,function () {
              focusEl = view.$(":focus");
              window["tabel"+ii] = focusEl;
              focusEl.is(iconEl) && (iconTabbed = true) && log.info("icon element tabbed on tab "+ii) && console.log(log.last);
              focusEl.is(commentEl) && (commentTabbed = true) && log.info("comment element tabbed on tab "+ii) && console.log(log.last);
              focusEl.is(favoriteEl) && (favoriteTabbed = true) && log.info("favorite element tabbed on tab "+ii) && console.log(log.last);
            },"check tab"+ii);
          })(ii);
        }

        TestUtil.run(done,function () {
          expect(iconTabbed).toBeTruthy("icon element not tabbed");
          expect(commentTabbed).toBeTruthy("comment element not tabbed");
          expect(favoriteTabbed).toBeTruthy("favorite element not tabbed");

          tabable.$el.remove();
        },"run3");
      });
    });

    describe('ending test suite', function () {
      it('wait some time for mocks to be satisfied', function (done) {
        TestUtil.run(done,function() {
          TestManager.wait(done,1000);
        });
      });
    });

  });
});
