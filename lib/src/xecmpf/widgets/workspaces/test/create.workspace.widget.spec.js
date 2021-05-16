/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
    'csui/lib/jquery',
    'csui/lib/underscore',
    'csui/lib/marionette',
    "xecmpf/widgets/workspaces/workspaces.widget",
    "xecmpf/widgets/workspaces/test/workspace.mock",
    'csui/utils/contexts/page/page.context',
    'csui/utils/contexts/factories/node'
], function (module, $, _, Marionette,
             WorkspacesWidget,
             Mock,
             PageContext) {
    'use strict';

    describe('Complete and Create Workspace Reference Widget - ', function () {

        var context,
            css,
            div,
            workspacesWidget,
            originalTimeout,
            currentView;

        beforeAll(function () {
            Mock.enable();
            $('head').append('<link rel="stylesheet" href="/base/csui/themes/carbonfiber/theme.css">');
            $('body').addClass("binf-widgets");

            $('body').css(
                {
                    "margin": 0,
                    "height": "100%",
                    "overflow-y": "hidden",
                    "overflow-x": "hidden",
                    "padding-right": "0px !important"
                }
            )


            $('body').append('<div id="widgetWMainWindow" style="height:100vh"></div>');

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
        });

        beforeEach(function () {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        afterEach(function () {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

        it('starts and shows widget', function () {
            workspacesWidget = new WorkspacesWidget({
                context: context,
                data: {
                    busObjectId: '0000003456',
                    busObjectType: 'KNA1',
                    extSystemId: 'D9A'
                }
            });
            workspacesWidget.show({placeholder: '#widgetWMainWindow'});
            context.fetch();
        });

        describe('The Select Workspace View - ', function () {

            it('initializes view', function (done) {
                setTimeout(function() {
                    currentView = workspacesWidget.region.currentView
                    expect(currentView).not.toBeNull();
                    done();
                }, 3000);
            });

            it('displays 11 early workspaces', function (done) {
                setTimeout(function() {
                    expect(currentView.$el.find("tr[role='row']").length-1).toEqual(11);
                    done();
                }, 1000);
            });

            it('navigates to Create Workspace View', function () {
                currentView.$(".csui-toolitem").trigger("click");
            });

        });

        describe('The Create Workspace View - ', function () {
            it('initializes view', function (done) {
                setTimeout(function() {
                    currentView = workspacesWidget.region.currentView;
                    expect(currentView).not.toBeNull();
                    done();
                }, 5000);
            });

            it('displays metadata panel for early workspace', function () {
                expect(currentView.$("div[title='09/22/2016 8:59 AM']")).not.toBeNull();
            });
            it('navigates to Display Workspace View', function () {
                currentView.$(".binf-btn-primary").trigger("click")
            });

        });

        describe('The Display Workspace View - ', function () {
            it('initializes view', function (done) {
                setTimeout(function() {
                    currentView = workspacesWidget.region.currentView;
                    expect(currentView).not.toBeNull();
                    done();
                }, 2000);
            });

            it('displays folder from workspace template', function () {
                expect(currentView.browser.region.$el.find("a[title='Folder 1']")).not.toBeNull();
            });

        });

        afterAll(function () {

            $('#widgetWMainWindow').remove();
            $("link[href='/base/csui/themes/carbonfiber/theme.css']").remove();

            Mock.disable();
        });
    })
});
