/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore',
    'csui/lib/jquery.mockjax',
    'csui/lib/jquery.parse.param',

    'json!./KNA1/businessworkspacetypes.json',
    'json!./KNA1/workspaces_asc_name.json',
    'json!./KNA1/workspaces_desc_name.json',

    'json!./KNA2/businessworkspacetypes.json',
    'json!./KNA2/workspaces_asc_name.json',
    'json!./KNA2/workspaces_desc_name.json',

    'json!./KNA3/businessworkspacetypes.json',
    'json!./KNA3/workspaces_asc_name.json',
    'json!./KNA3/workspaces_desc_name.json',

    'json!./KNA4/businessworkspacetypes.json',
    'json!./KNA4/workspaces_asc_name.json',
    'json!./KNA4/workspaces_desc_name.json',

    'json!./KNA5/businessworkspacetypes.json',
    'json!./KNA5/workspaces_asc_name.json',
    'json!./KNA5/workspaces_desc_name.json',

    'json!./workspaces_empty.json',
    'json!./createform.json',
    'json!./createdworkspace.json',
    'json!./categories.json',
    'json!./updateform.json',
    'json!./nodesexpand.json',
    'json!./auth.json',
    'json!./facets.json',
    'json!./fieldproperties.json',
    'json!./properties.json',
    'json!./nodes.json',
    'json!./actions.json',
    'json!./addablenodetypes.json',
    'json!./ancestors.json',
    'json!./members.json',
    'json!./membersexpand.json',
    'json!./businessworkspaces.json',
    'json!./pulse.json',
    'json!./objectsocialinfo.json',
    'json!./membersFavoritesTabs.json'
], function (_, MockJax,
             parseParam,
             BusWrksTypeKNA1,
             WrksAscNameKNA1,
             WrksDescNameKNA1,
             BusWrksTypeKNA2,
             WrksAscNameKNA2,
             WrksDescNameKNA2,
             BusWrksTypeKNA3,
             WrksAscNameKNA3,
             WrksDescNameKNA3,
             BusWrksTypeKNA4,
             WrksAscNameKNA4,
             WrksDescNameKNA4,
             BusWrksTypeKNA5,
             WrksAscNameKNA5,
             WrksDescNameKNA5,
             WrksEmpty,
             CreateForm,
             CreatedWorkspace,
             Categories,
             UpdateForm,
             NodesExpand,
             Auth,
             Facets,
             FieldProperties,
             Properties,
             Nodes,
             Actions,
             AddableNodeTypes,
             Ancestors,
             Members,
             MembersExpand,
             BusinessWorkspaces,
             Pulse,
             ObjectSocialInfo,
             MembersFavoritesTabs) {


    var mocks = [];

    return {

        enable: function () {

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v1\/objectsocialinfo/,
                responseText: ObjectSocialInfo
            }));

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v2\/pulse\/settings/,
                responseText: Pulse
            }));

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v1\/members\?expand=member/,
                responseText: MembersExpand
            }));

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v2\/members\/favorites\/tabs\?*/,
                responseText: MembersFavoritesTabs
            }));

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v1\/members\/[0-9]+/,
                responseText: Members
            }));

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v2\/nodes\/[0-9]+\?actions/,
                responseText: Actions
            }));

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v2\/nodes\/actions\/*/,
                responseText: Actions
            }));

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v1\/nodes\/[0-9]+\/ancestors/,
                responseText: Ancestors
            }));

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v1\/nodes\/[0-9]+\/addablenodetypes/,
                responseText: AddableNodeTypes
            }));

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v1\/nodes\/[0-9]+\/nodes\?extra/,
                responseText: Nodes
            }));

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v1\/forms\/nodes\/update\?id=[0-9]+/,
                responseText: Properties
            }));

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v1\/forms\/nodes\/properties\/general\?id=[0-9]+/,
                responseText: Properties
            }));

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v2\/nodes\/[0-9]+\?fields=properties/,
                responseText: FieldProperties
            }));

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v1\/nodes\/[0-9]+\/businessworkspacetypes/,
                responseText: {}
            }));

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v2\/nodes\/[0-9]+\?expand=properties/,
                responseText: NodesExpand
            }));

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v2\/businessworkspaces\/[0-9]+/,
                response: function (settings) {
                    this.responseText = BusinessWorkspaces;
                }
            }));

            mocks.push(MockJax({
                responseTime: 0,
                url: /\/\/server\/otcs\/cs\/api\/v1\/nodes\/[0-9]+\/facets/,
                response: function (settings) {
                    this.responseText = Facets;
                }
            }));

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v1\/forms\/nodes\/categories\/update\?id=[0-9]+&category_id=[0-9]+/,
                response: function (settings) {
                    this.responseText = UpdateForm;
                }
            }));

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v1\/nodes\/[0-9]+\/categories/,
                response: function (settings) {
                    this.responseText = Categories;
                }
            }));

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v2\/forms\/businessworkspaces\/create\?/,
                urlParams: ['query'],
                response: function (settings) {
                    this.responseText = CreateForm;
                }

            }));

            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v1\/auth/,
                response: function (settings) {
                    this.responseText = Auth;
                }

            }));
            mocks.push(MockJax({
                type: "POST",
                url: /\/\/server\/otcs\/cs\/api\/v2\/businessworkspaces/,
                response: function (settings) {
                    this.responseText = CreatedWorkspace;
                }

            }));


            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v2\/businessworkspaces(?:(.*))$/,
                urlParams: ['query'],
                responseTime: 0,
                response: function (settings) {

                    var query = settings.urlParams.query || '',
                        parameters = _.reduce(query.split('&'), function (result, parameter) {
                            var parts = parameter.split(/=(.+)/, 2),
                                name = parts[0].toLowerCase(),
                                value = parts[1];
                            result[name] = value && decodeURIComponent(value) || value;
                            return result;
                        }, {});
                    var whereCond = 'contains_X';
                    if (!parameters.sort) {
                        parameters.sort = "asc_name";
                    }
                    if (parameters.where_bo_type === 'KNA1') {
                        if (parameters.where_name === whereCond) {
                            this.responseText = WrksEmpty;
                        } else if (parameters.sort === "asc_name") {
                            this.responseText = WrksAscNameKNA1;
                        } else {
                            this.responseText = WrksDescNameKNA1;
                        }
                    } else if (parameters.where_bo_type === 'KNA2') {
                        if (parameters.where_name === whereCond) {
                            this.responseText = WrksEmpty;
                        } else if (parameters.sort === "asc_name") {
                            this.responseText = WrksAscNameKNA2;
                        } else {
                            this.responseText = WrksDescNameKNA2;
                        }
                    } else if (parameters.where_bo_type === 'KNA3') {
                        if (parameters.where_name === whereCond) {
                            this.responseText = WrksEmpty;
                        } else if (parameters.sort === "asc_name") {
                            this.responseText = WrksAscNameKNA3;
                        } else {
                            this.responseText = WrksDescNameKNA3;
                        }
                    } else if (parameters.where_bo_type === 'KNA4') {
                        if (parameters.where_name === whereCond) {
                            this.responseText = WrksEmpty;
                        } else if (parameters.sort === "asc_name") {
                            this.responseText = WrksAscNameKNA4;
                        } else {
                            this.responseText = WrksDescNameKNA4;
                        }
                    } else if (parameters.where_bo_type === 'KNA5') {
                        if (parameters.where_name === whereCond) {
                            this.responseText = WrksEmpty;
                        } else if (parameters.sort === "asc_name") {
                            this.responseText = WrksAscNameKNA5;
                        } else {
                            this.responseText = WrksDescNameKNA5;
                        }
                    }
                }
            }));

            mocks.push(MockJax({
                    url: /\/\/server\/otcs\/cs\/api\/v2\/businessworkspacetypes(?:(.*))$/,
                    urlParams: ['query'],
                    responseTime: 0,
                    response: function (settings) {
                        var query = settings.urlParams.query || '',
                            parameters = _.reduce(query.split('&'), function (result, parameter) {
                                var parts = parameter.split(/=(.+)/, 2),
                                    name = parts[0].toLowerCase(),
                                    value = parts[1];
                                result[name] = value && decodeURIComponent(value) || value;
                                return result;
                            }, {});

                        if (parameters.bo_type === "KNA1") {
                            this.responseText = BusWrksTypeKNA1;
                        } else if (parameters.bo_type === "KNA2") {
                            this.responseText = BusWrksTypeKNA2;
                        } else if (parameters.bo_type === "KNA3") {
                            this.responseText = BusWrksTypeKNA3;
                        } else if (parameters.bo_type === "KNA4") {
                            this.responseText = BusWrksTypeKNA4;
                        } else if (parameters.bo_type === "KNA5") {
                            this.responseText = BusWrksTypeKNA5;
                        } else {
                            this.responseText = BusWrksTypeKNA1;
                        }
                    }
                }
            ));
        },

        disable: function () {
            var mock;
            while ((mock = mocks.pop())) {
                MockJax.clear(mock);
            }
        }

    };

});
