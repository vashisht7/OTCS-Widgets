/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/utils/log',
  'csui/lib/marionette',
  'csui/models/nodes',
  'csui/utils/commandhelper'
], function ($, _, log,
    Marionette,
    NodeCollection,
    CommandHelper
) {

  var testUtils = {
    openProperties: function(nodesTableView,nodeName) {
      var node = nodesTableView.collection.findWhere({name: nodeName});
      var command = nodesTableView.defaultActionController.commands.findWhere({signature: "Properties"});
      var status = {
        nodes: new NodeCollection([node]),
        container: nodesTableView.collection.node,
        originatingView: nodesTableView,
        context: nodesTableView.context
      };
      var promisesFromCommands = command.execute(status);
      CommandHelper.handleExecutionResults(promisesFromCommands,
          {command: command, suppressSuccessMessage: status.suppressSuccessMessage});
      promisesFromCommands.then(function() {
        console.log("commands resolved");
      });
      return promisesFromCommands;
    },

    justWait: function(message,timeout,done) {
      var deferred = $.Deferred();
      console.log("starting to wait", message, timeout);
      setTimeout(function(){
        console.log("finished to wait", message);
        deferred.resolve();
      },timeout);
      if (done) {
        deferred.then(function() {
          done();
        },function(error){
          fail(error);
          done();
        });
      }
      return deferred.promise();
    },

    waitFor: function(check,message,timeout,done) {
      function clear(state) {
        if(state.timeout) {
          clearTimeout(state.timeout);
          delete state.timeout;
        }
        if (state.interval) {
          clearInterval(state.interval);
          delete state.interval
        }
      }
      var deferred = $.Deferred();
      var state = {};
      state.interval = setInterval(function() {
        if (check()) {
          clear(state);
          deferred.resolve();
        }
      },100);
      state.timeout = setTimeout(function(){
        clear(state);
        var error = new Error(_.str.sformat("Timeout {0} reached while waiting for {1}.",timeout,message));
        deferred.reject(error);
      },timeout);
      if (done) {
        deferred.then(function() {
          done();
        },function(error){
          fail(error);
          done();
        });
      }
      return deferred.promise();
    }

  };

  return testUtils;
});
