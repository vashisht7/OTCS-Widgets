/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([], function () {

  function integer(key, name) {
    return {
      "allow_undefined": false,
      "bulk_shared": false,
      "default_value": null,
      "description": null,
      "hidden": false,
      "key": key,
      "max_value": null,
      "min_value": null,
      "multi_value": null,
      "name": name,
      "persona": "node",
      "read_only": false,
      "required": false,
      "title": undefined,
      "type": 2,
      "type_name": "Integer",
      "valid_values": [],
      "valid_values_name": []
    }
  }

  function string(key, name) {
    return {
      "allow_undefined": false,
      "bulk_shared": false,
      "default_value": null,
      "description": null,
      "hidden": false,
      "key": key,
      "max_length": null,
      "min_length": null,
      "multiline": false,
      "multilingual": false,
      "multi_value": false,
      "name": name,
      "password": false,
      "persona": "",
      "read_only": false,
      "regex": "",
      "required": true,
      "title": undefined,
      "type": -1,
      "type_name": "String",
      "valid_values": [],
      "valid_values_name": []
    }
  }

  return {
    integer: integer,
    string: string
  }
});