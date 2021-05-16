/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url',
  'csui/utils/namedlocalstorage'
], function (_, $, Url, NamedLocalStorage) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        getStorage: function () {
          var deferred = $.Deferred(),
              that     = this;
          require(['csui/utils/contexts/factories/user'], function (UserModelFactory) {
            var user          = that.options.context.getModel(UserModelFactory),
                currentUserId = user.get('id');
            if (!currentUserId) {
              var userFactory = that.options.context.getFactory(UserModelFactory);
              if (userFactory.initialResponse) {
                currentUserId = userFactory.initialResponse.data.id;
              }
            }
            if (!that.namedLocalStorage) {
              that.namedLocalStorage = new NamedLocalStorage('perspective:personalization:' +
                                                             currentUserId);
            }
            that.namedLocalStorage;
            return deferred.resolve(that.namedLocalStorage);
          }, deferred.reject);
          return deferred;
        },

        savePerspective: function () {
          var that = this;
          return this.getStorage().then(function (storage) {
            return storage.set(that.getNodeId(), that.toJSON());
          });
        },

        fetchPerspective: function () {
          var that = this;
          return this.getStorage().then(function (storage) {
            return storage.get(that.getNodeId());
          });
        },
        sync: function (method, model, options) {
          var deferred = $.Deferred();
          switch (method) {
          case 'create':
          case 'update':
          case 'patch':
            model.savePerspective().then(function () {
              deferred.resolve(this);
            }, deferred.reject);

            break;
          case 'read':
            model.fetchPerspective().then(function (personalization) {
              if (!_.isEmpty(personalization)) {
                model.set(personalization);
              }
              deferred.resolve(model);
            }, deferred.reject);
            break;
          default:
            deferred.reject();
            break;
          }
          return deferred.promise();
        }
      });

    }
  };

  return ServerAdaptorMixin;
});