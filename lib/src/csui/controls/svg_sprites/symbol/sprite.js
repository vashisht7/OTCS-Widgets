/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


            define(/Trident.*11/i.test(navigator.userAgent) ? ['csui/controls/svg_sprites/symbol/spriteLoader'] : ['require'],
                function (require) {
                  var spritePath;
                  if (/Trident.*11/i.test(navigator.userAgent)) {
                    spritePath = '';
                  } else {
                    var m = require.toUrl('csui');
                    spritePath = m.replace(/(^[^?]+)(\?[^?]*)?$/, '$1/controls/svg_sprites/symbol/svg/sprite.symbol.svg$2');
                    if (spritePath[spritePath.length - 1] === '?') {
                      spritePath = spritePath.substr(0, spritePath.length - 1);
                    }
                  }
                  return {
                    getSpritePath: function () {
                      return spritePath;
                    }
                  };
                });
          