/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/models/command'
], function (_, Backbone, CommandModel) {

  var CommandCollection = Backbone.Collection.extend({

    model: CommandModel,

    constructor: function CommandCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    clone: function () {
      var clone = new this.constructor(this.models, this.options);
      clone.signatures = _.clone(this.signatures);
      return clone;
    },
    getSignatures: function (toolbarItems) {
      var sigArray = [];
      _.mapObject(toolbarItems, function (val, key) {
        sigArray = _.union(sigArray, _.without(val.getCollection().pluck('signature'), 'disabled'));
      });

      var commands = this.clone();
      var commandsToRemove = [];
      commands.each(function (command) {
        if (sigArray.indexOf(command.get('signature')) === -1) {
          commandsToRemove.push(command);
        }
      });
      commands.remove(commandsToRemove, {silent: true});

      return commands.getAllSignatures();
    },

    getAllSignatures: function () {
      return _.chain(this.pluck('command_key'))
          .map(function (signature) {
            if (_.isArray(signature)) {
              var result = signature[0];
              if (result === 'default') {
                result = ['default', 'open', signature[2]];
              }
              return result;
            }
            return signature;
          })
          .flatten()
          .compact()
          .unique()
          .value();
    }

  });

  return CommandCollection;

});
