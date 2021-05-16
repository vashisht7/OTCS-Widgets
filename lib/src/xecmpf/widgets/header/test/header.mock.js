/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore',
        'csui/lib/jquery.mockjax',
        'csui/lib/jquery.parse.param',
        'json!./businessworkspace_types.json',
        'json!./businessworkspace.json',
        'json!./businessworkspace_expand.json',
        'json!./metadata.json',
        'json!./categories.json',
        'json!./categories_actions.json',
        'json!./categories_update_92523.json',
        'json!./categories_update_254974.json',
        'json!./missingdocuments.json',
        'json!./commentcount.json',
        'json!./workspaceproperties.json',
         
], function (_, MockJax, parseParam,
             BusinessWorkspaceTypes,
             BusinessWorkspace,
             BusinessWorkspace_Expand,
             MetaData,
             Categories,
             Categories_Actions,
             Categories_Update_92523,
             Categories_Update_254974,
             MissingDocuments,
             CommentCount,
             WorkspaceProperties
) {

    var mocks = [];

    return {

        enable: function () {
            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v2\/businessworkspacetypes\?ext_system_id=D7K-HTTP\&expand_templates=true\&bo_type=BUS2038/,
                responseText: BusinessWorkspaceTypes
            }));

            mocks.push(MockJax({
                url: '//server/otcs/cs/api/v1/nodes/51209/businessworkspace',
                responseText: BusinessWorkspace
            }));
            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v2\/nodes\/[0-9]+\?expand/,
                responseText: BusinessWorkspace_Expand
            }));

            mocks.push(MockJax({
                url: '//server/otcs/cs/api/v2/businessworkspaces/51209?metadata&fields=categories&include_icon=true&expand=properties%7Bcreate_user_id%2Cmodify_user_id%2Cowner_group_id%2Cowner_user_id%2Creserved_user_id%7D',
                responseText: MetaData
            }));

            mocks.push(MockJax({
                url: '//server/otcs/cs/api/v1/nodes/51209/categories',
                responseText: Categories
            }));

            mocks.push(MockJax({
                url: '//server/otcs/cs/api/v1/nodes/51209/categories/actions',
                responseText: Categories_Actions
            }));

            mocks.push(MockJax({
                url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=51209&category_id=92523',
                responseText: Categories_Update_92523
            }));
            
            mocks.push(MockJax({
                url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=51209&category_id=254974',
                responseText: Categories_Update_254974
            }));

            mocks.push(MockJax({
                url: '//server/otcs/cs/api/v2/businessworkspaces/51209/missingdocuments',
                responseText: MissingDocuments
            }));

            mocks.push(MockJax({
                url: '//server/otcs/cs/api/v1/objectsocialinfo?csid=51209&includes=comment_count',
                responseText: CommentCount
            }));
            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v2\/members\/favorites?/,
                responseText: {
                    results: []
                }
            }));
            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v2\/members\/favorites\/tabs?/,
                responseText: {
                    results: []
                }
            }));
            mocks.push(MockJax({
                url: /\/\/server\/otcs\/cs\/api\/v2\/nodes\/[0-9]+\?fields=properties/,
                responseText: {
                    results: []
                }
            }));
        },

        disable: function () {
            var mock;
            while ((mock = mocks.pop())) {
                MockJax.clear(mock);
            }
        }

    };

});
