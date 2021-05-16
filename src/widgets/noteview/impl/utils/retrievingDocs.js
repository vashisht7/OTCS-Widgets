define([
  'csui/lib/jquery',
  'csui/utils/connector',
  'csui/models/node/node.model',
  "csui/models/node.children2/node.children2"
], function ($, Connector,NodeModel,NodeChildren2Collection) {
      var names,ids;
  var connection = {
    url: "http://localhost/otcs/cs.exe/api/v1",
    supportPath: "/otcssamples",
  };
  var connector = new Connector({
    connection: connection
  });
  var link = window.location.href.split("/");
  var matchs =link[link.length - 1].match(/(\d+)/);
  console.log(matchs[0]);
  var container = new NodeModel({ id: parseInt(matchs[0]) }, { connector: connector });
  var children = new NodeChildren2Collection(undefined, { node: container });
  return children;
  });