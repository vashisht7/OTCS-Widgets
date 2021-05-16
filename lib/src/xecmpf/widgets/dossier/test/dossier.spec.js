/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
    'csui/utils/contexts/page/page.context',
    'xecmpf/widgets/dossier/dossier.view', 'xecmpf/widgets/dossier/test/dossiermock', 'xecmpf/widgets/dossier/test/documentsmock'
], function ($, _, Marionette, PageContext, DossierView, dossierMock, documentsMock) {
    describe('Dossier Widget', function () {
        var context, dossierView, contentRegion;
        beforeAll(function () {
            dossierMock.enable();
            documentsMock.enable();

            var $head = $('head');
            $head.append('<link rel="stylesheet" href="/base/csui/themes/carbonfiber/theme.css">');

            var $body = $('body');
            $body.addClass('binf-widgets');

            $body.css({
                'margin': 0,
                'height': '100%',
                'overflow-y': 'hidden',
                'overflow-x': 'hidden',
                'padding-right': '0px !important'
            });
            $body.append('<div id="widgetWMainWindow" style="height:100vh"></div>');

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

        describe('List view of the widget', function () {
            it('can be instantiated and rendered', function (done) {
                dossierView = new DossierView({
                    context: context,
                    data: {
                        "groupBy": "classification",
                        "hideGroupByCriterionDropdown": false,
                        "hideMetadata": false,
                        "metadata": [
                            {
                                "type": "category",
                                "categoryId": 15064
                            }
                        ],
                        "hideEmptyFields": true,
                        "hideFavorite": false
                    }
                });

                contentRegion = new Marionette.Region({
                    el: '#widgetWMainWindow'
                });

                contentRegion.show(dossierView);
                expect(dossierView).toBeDefined();
                expect(dossierView.$el.length).toBe(1);
                done();
            });
        });
        describe('The Dossier View rendering- ', function () {
            it('Checks whether the view is rendered', function (done) {
                setTimeout(function () {
                    expect(dossierView).not.toBeNull();
                    expect(dossierView.el.childNodes.length > 0).toBeTruthy();
                    done();
                }, 2000);
                done();
            });
        });
        describe('Dossier View Tile Header', function () {
            it('verifies the tile header of the widget', function (done) {
                var tileHeader = dossierView.$el.find('.tile-header');
                expect(tileHeader.length).toBe(1);
                done();
            });
        });
        describe('Groups and documents', function () {
            it('dosser properties has 4 child nodes', function (done) {
                var dossierProperties = dossierView.$el.find('.tile-header').find('.dossier-properties');
                expect(dossierProperties.children().length).toEqual(4);
                done();
            });
            it('has groups', function (done) {
                setTimeout(function () {
                    var groups = dossierView.$el.find('.tile-header').find('.dossier-properties').children()[1].innerText;
                    expect(groups).toEqual('group(s)');

                    var grpCount = dossierView.$el.find('.tile-header').find('.dossier-properties').children()[0].innerText;
                    expect(grpCount).toEqual('11');
                }, 2000);
                done();
            });

            it('has documents', function (done) {
                setTimeout(function () {
                    var docs = dossierView.$el.find('.tile-header').find('.dossier-properties').children()[3].innerText;
                    expect(docs).toEqual('document(s)');

                    var docsCount = dossierView.$el.find('.tile-header').find('.dossier-properties').children()[2].innerText;
                    expect(docsCount).toEqual('16');

                }, 2000);
                done();
            });

        });

        describe('Grouped by Classification', function () {
            it('is grouped by Classification', function (done) {
                var groupBy = dossierView.$el.find('.tile-header').find('.tile-controls').find('.dossier-dropdown-wrapper').children()[0].innerText;
                expect(groupBy).toEqual('Group by');

                var grpByClassification = dossierView.$el.find('.tile-header').find('.tile-controls').find('.dossier-dropdown-wrapper').find('.dossier-dropdown').find('.xecmpf-dropdown').find('.binf-dropdown-toggle').children()[0].innerText;
                expect(grpByClassification).toEqual('Classification');

                done();
            });
        });

        afterAll(function () {
            dossierView.destroy();
            $('#widgetWMainWindow').remove();
            $('link[href="/base/csui/themes/carbonfiber/theme.css"]').remove();
            dossierMock.disable();
            documentsMock.disable();
        });
    });
});