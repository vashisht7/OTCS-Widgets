/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

  var mocks = [];
  var id = 1;
  return {
    enable: function () {
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/facets/2000(.*)$'),
        responseText: {
          'results': {
            'data': {
              'facets': getFacets(),
              'values': {
                'available': getAvailableValues(),
                'selected': []
              }
            }
          }
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }
  };

  function getFacets() {
    var properties = {};
    for (var j = 1; j < 3; j++) {
      properties[j] = {
        'id': j,
        'items_to_show': 5,
        'name': 'Content Type',
        'total_displayable': (j === 2 ? 5 : 6)
      };
    }
    return properties;
  }

  function getAvailableValues() {
    var availableValues = [];
    for (var j = 1; j < 3; j++) {
      var facet = {},
        facetTopics = facet[j] = [],
        i = j === 2 ? 5 : 6;

      availableValues.push(facet);

      for (; i > 0 ; i--) {
        var topic = {"name": "Microsoft Word", "percentage": 25, "count": 70, "value": i.toString()};
        facetTopics.push(topic);
      }
    }
    return availableValues;
  }
});
