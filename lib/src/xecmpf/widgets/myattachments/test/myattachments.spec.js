/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/connector',
    'xecmpf/widgets/myattachments/metadata.attachments.view', 'csui/utils/contexts/page/page.context',
    'csui/utils/contexts/factories/node',
    'xecmpf/widgets/myattachments/test/myattachments.mock',
    'csui/controls/globalmessage/globalmessage',
], function (Marionette, _, $, Connector, MyAttachmentsView, PageContext, NodeModelFactory, MockData,
             GlobalMessage, testUtils) {
    'use strict';
    describe('Test MyAttachmentsView', function () {
        var pagecontext,
            node,
            css,
            div,
            myattachmentsView,
            connection,
            connector,
            contentRegion,
            originalTimeout,
            tableView,
            tableToolbarView;
        beforeAll(function () {
            MockData["testMyAttachments"].enable();
            
            $('body').append('<div id="widgetWMainWindow"></div>');
            contentRegion = new Marionette.Region({
                el: '#widgetWMainWindow'
            });
            connection = {
                url: MockData.url, //'//server/otcs/cs/api/v2',
                supportPath: '/support',
                session: {
                    ticket: 'dummy'
                }
            };

            connector = new Connector({
                connection: connection
            });
            pagecontext = new PageContext({
                factories: {
                    connector: {
                        connection: connection,
                        assignTo: function (model) {
                            if (model.connector) {
                                if (model.connector === this) {
                                    return;
                                }
                            }
                            model.connector = this;
                        }
                    },
                    node: {
                        attributes: {
                            id: 120,
                            type: 848
                        }
                    }
                }
            });
            node = pagecontext.getModel(NodeModelFactory);
            GlobalMessage.setMessageRegionView(contentRegion, {classes: "navbar-default"});
        });

        beforeEach(function () {
        });
        afterEach(function () {
        });

        it('starts and shows widget', function () {
            myattachmentsView = new MyAttachmentsView({
                context: pagecontext,
                connector: connector,
                model: node
            });
            contentRegion.show(myattachmentsView);
        });

        it('view initialized', function (done) {
            setTimeout(function () {
                tableView = myattachmentsView.tableView
                expect(tableView).not.toBeNull();
                tableToolbarView = myattachmentsView.tableToolbarView;
                done();

            }, 400);
        });

        it('displays 9 business attachment', function (done) {
            setTimeout(function () {
                expect(tableView.$el.find("tr[role='row']").length - 1).toEqual(9);
                done();
            }, 300);
        });

        describe('sort business attachments - ', function () {
            it('click on sort of name', function (done) {
                     var sortArrow = tableView.$("[title='Name: Click to sort" +
                                      " ascending']>div[role='button']" );
                    sortArrow.trigger("click");
                setTimeout(function () {
                    var nameFirstRow = tableView.$("tbody tr:first-child td:contains('Vendor Werk Hamburg (1000)')");
                    var b = "Vendor Werk Hamburg (1000)";
                    expect(nameFirstRow[0].innerText).toMatch(/b/);
                     done();
                }, 1000);
            });
        });

        describe('search business attachments - ', function () {
            it('click on search of name', function (done) {
                var searchBox = tableView.$("[title='Search by name'].icon.icon-search ");
                searchBox.trigger("click");
                var inputField = tableView.$("input[type='search'][title='Search name'] ");
                inputField.trigger("keydown");
                inputField.val('Hamburg');
                inputField.trigger("keyup");
                inputField.trigger("blur");
                setTimeout(function () {
                    var nameFirstRow = tableView.$("tbody tr:first-child td:contains('Vendor Werk Hamburg (1000)')");
                    var b = "Vendor Werk Hamburg (1000)";
                    expect(nameFirstRow[0].innerText).toMatch(/b/);
                    done();
                }, 1100);
            });
        });

        afterAll(function () {

                $('#widgetWMainWindow').remove();
                $("link[href='/base/csui/themes/carbonfiber/theme.css']").remove();
                MockData.disable();


        });
    });

});

