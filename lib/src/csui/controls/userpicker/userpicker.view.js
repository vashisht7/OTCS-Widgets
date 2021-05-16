/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/contexts/factories/connector',
  'csui/models/member',
  'csui/models/members',
  'csui/controls/typeaheadpicker/typeaheadpicker.view',
  'csui/controls/userpicker/impl/user.view',
  'csui/controls/userpicker/impl/group.view',
  'csui-ext!csui/controls/userpicker/userpicker.view',
  'css!csui/controls/userpicker/impl/userpicker'
], function (_, $,
    ConnectorFactory, MemberModel, MemberCollection,
    TypeaheadPickerView, UserView, GroupView, extensionView) {

  var UserPickerView = TypeaheadPickerView.extend({

    constructor: function UserPickerView(options) {

      $.extend(true,options||{},{
        css: {
          itemPicker: 'csui-control-userpicker',
          noResults: 'csui-user-picker-no-results'
        },
        expandFields: ['group_id', 'leader_id']
      });

      var connector;
      if (options.collection) {
        connector = options.collection.connector;
      } else {
        if (!options.context) {
          throw new Error('Context is missing in the constructor options');
        }
        connector = options.context.getObject(ConnectorFactory);
        options.collection = new MemberCollection(undefined, {
          connector: connector,
          memberFilter: options.memberFilter,
          expandFields: options.expandFields,
          limit: options.limit,
          comparator: function (item) {
            return item.get('name_formatted').toLowerCase();
          }
        });
      }
      if (!options.model) {
        options.model = new MemberModel(undefined, {connector: connector});
      }
      options.TypeaheadItemView = function(model) {
        return model.get('type') === 0 ? UserView : (extensionView ? extensionView[0] : GroupView);
      };
      options.onRetrieveItems = function(collection,query) {
        collection.query = query;
        return collection
          .fetch()
          .then(function () {
            if (typeof options.onRetrieveMembers === 'function') {
              options.onRetrieveMembers({
                collection: collection
              });
            }
            if (options.widgetoptions && options.widgetoptions.collection &&
                options.widgetoptions.collection.extraMemberModels &&
                options.widgetoptions.collection.extraMemberModels.length) {
                var filteredModels = _.filter(options.widgetoptions.collection.extraMemberModels, function (model) {
                  return options.collection.comparator(model)
                    .indexOf(query.toLowerCase()) !== -1;
                });
                collection.add(filteredModels);
            }
            return collection.models;
          });
      };

      TypeaheadPickerView.prototype.constructor.call(this, options);

      this.listenTo(this,"typeahead:picker:open",function(){ this.trigger("userpicker:open");});
      this.listenTo(this,"typeahead:picker:close",function(){ this.trigger("userpicker:close");});

    },

  });

  return UserPickerView;

});
