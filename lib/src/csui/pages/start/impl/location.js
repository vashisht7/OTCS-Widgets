/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([], function () {
  return {
    get search() {
      return location.search;
    },
    get href() {
      return location.href;
    },
    get hash() {
      return location.hash;
    }
  };
});
