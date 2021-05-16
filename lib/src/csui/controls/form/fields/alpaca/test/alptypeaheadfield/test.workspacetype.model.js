/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'require',
    'csui/lib/underscore',
    'csui/lib/jquery',
    'csui/lib/backbone',
    'csui/utils/url'
  ], function (require,_, $, Backbone, Url) {
    'use strict';
  
    var WSTypeModel = Backbone.Model.extend({
  
      nameAttribute: 'wksp_type_name',
      imageAttribute: 'wksp_type_icon',

      constructor: function WSTypeModel(attributes, options) {
        Backbone.Model.prototype.constructor.apply(this, arguments);
        this.options = _.pick(options,'context');
      },
  
      parse: function (response) {
        this.fetched = true;
        var data = response&&response.data||{};
        var attributes = _.extend(data.properties||{},data.wksp_info||{});
        attributes.id = attributes.wksp_type_id;
        attributes.display_name = attributes.wksp_type_name;
        attributes.type = 864;
        return attributes;
      },

      ensureFetched: function (options) {
        if (this.fetched) {
          if (options && options.success) {
            options.success(this);
          }
          return $.Deferred()
              .resolve(this, {}, options)
              .promise();
        }
        return this.fetch(options);
      },

      fetch: function(options) {
        function reject() {
          if (options && options.error) {
            options.error(this);
          }
          deferred.reject();
  	    }
        function finish(wstypes,deferred,options) {
          var model = wstypes.get(this.get('id'));
          if (model) {
            this.set(model.attributes);
            this.fetched = true;
            if (options && options.success) {
              options.success(this);
            }
            deferred.resolve(this, {}, options);
          } else {
            reject.call(this,deferred,options);
          }
        }
        var deferred = $.Deferred();
        require(['./test.workspacetypes.factory.js'], _.bind(function (WorkspacesTypesFactory) {
          var wstypes = this.options.context.getModel(WorkspacesTypesFactory);
          if (wstypes.fetched) {
            finish.call(this,wstypes,deferred,options);
          } else {
            wstypes.fetch(options).then(_.bind(function(){
              finish.call(this,wstypes,deferred,options);
            },this),_.bind(function(){
              reject.call(this,deferred,options);
            },this));
          }
        }, this),_.bind(function(){
          reject.call(this,deferred,options);
        },this));
        return deferred.promise();
      }
  
    });
  
    return WSTypeModel;
  
  }); 
  