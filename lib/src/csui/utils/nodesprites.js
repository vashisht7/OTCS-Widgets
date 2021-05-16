/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  'i18n!csui/utils/impl/nls/lang',
  'csui-ext!csui/utils/nodesprites'
], function (_, Backbone, RulesMatchingMixin, lang, extraIcons) {

  var NodeSpriteModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      className: null
    },

    constructor: function NodeSpriteModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }

  });

  RulesMatchingMixin.mixin(NodeSpriteModel.prototype);

  var NodeSpriteCollection = Backbone.Collection.extend({

    model: NodeSpriteModel,
    comparator: "sequence",

    constructor: function NodeSpriteCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    findClass: function (compareType, key, val) {
      var nodeSprite = this.find(function (item) {
        var values = item.get(compareType);
        if (values === undefined) {
          return undefined;
        }
        if (_.isArray(values[key])) {
          var keyValues = values[key];
          for (var i = 0; i < keyValues.length; i++) {
            if (keyValues[i] === val) {
              return true;
            }
          }
        }

        return (values[key] === val);
      });
      return nodeSprite ? nodeSprite.get('className') : undefined;
    },

    findTypeByNode: function (node) {
      var typeName = node.get('type_name') || lang.NodeTypeUnknown;

      var nodeSprite = this.findByNode(node);
      if (nodeSprite) {
        var spriteName = _.result(nodeSprite.attributes, 'mimeType');
        if (spriteName) {
          typeName = spriteName;
        }
      }

      return typeName;
    },

    findClassByNode: function (node) {
      var nodeSprite = this.findByNode(node);
      return nodeSprite && _.result(nodeSprite.attributes, 'className') || '';
    },

    findByNode: function (node) {
      return this.find(function (item) {
        return item.matchRules(node, item.attributes);
      });
    }

  });

  var nodeSprites = new NodeSpriteCollection([
    {
      equalsNoCase: {
        mime_type: [
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
          'application/vnd.ms-excel.sheet.macroEnabled.12',
          'application/vnd.ms-excel.template.macroEnabled.12',
          'application/vnd.ms-excel.addin.macroEnabled.12',
          'application/vnd.ms-excel.sheet.binary.macroEnabled.12'
        ]
      },
      className: 'csui-icon mime_excel',
      svgId: 'themes--carbonfiber--image--icons--mime_excel',
      mimeType: lang.NodeTypeXLS,
      sequence: 50
    },
    {
      equalsNoCase: {
        mime_type: [
          'application/visio',
          'application/x-visio',
          'application/vnd.visio',
          'application/visio.drawing',
          'application/vsd',
          'application/x-vsd',
          'image/x-vsd',
          'application/vnd.visio2013',
          'application/vnd.ms-visio.drawing',
          'application/vnd.ms-visio.viewer',
          'application/vnd.ms-visio.stencil',
          'application/vnd.ms-visio.template'
        ]
      },
      className: 'csui-icon mime_visio',
      svgId: 'themes--carbonfiber--image--icons--mime_visio',
      mimeType: lang.NodeTypeVisio,
      sequence: 50
    },
    {
      equalsNoCase: {
        mime_type: [
          'application/vnd.oasis.opendocument.spreadsheet',
          'application/vnd.oasis.opendocument.spreadsheet-template',
          'application/vnd.sun.xml.calc',
          'application/vnd.sun.xml.calc.template',
          'application/vnd.stardivision.calc',
          'application/x-starcalc'
        ]
      },
      className: 'csui-icon mime_spreadsheet',
      svgId: 'themes--carbonfiber--image--icons--mime_spreadsheet',
      mimeType: lang.NodeTypeSpreadsheet,
      sequence: 50
    },
    {
      equalsNoCase: {
        mime_type: [
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/vnd.openxmlformats-officedocument.presentationml.template',
          'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
          'application/vnd.ms-powerpoint.addin.macroEnabled.12',
          'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
          'application/vnd.ms-powerpoint.template.macroEnabled.12',
          'application/vnd.ms-powerpoint.slideshow.macroEnabled.12'
        ]
      },
      className: 'csui-icon mime_powerpoint',
      svgId: 'themes--carbonfiber--image--icons--mime_powerpoint',
      mimeType: lang.NodeTypePPT,
      sequence: 50
    },
    {
      equalsNoCase: {
        mime_type: [
          'application/vnd.google-apps.presentation', // GSLIDE - Google Drive Presentation
          'application/x-iwork-keynote-sffkey', // KEY, KEYNOTE — Apple Keynote Presentation
          'application/vnd.wolfram.mathematica', // NB — Mathematica Slideshow
          'application/vnd.wolfram.player', // NBP — Mathematica Player slideshow
          'application/vnd.oasis.opendocument.presentation', // ODP — OpenDocument Presentation
          'application/vnd.oasis.opendocument.presentation-template', // OTP - ODP Template
          'application/vnd.sun.xml.impress',
          'application/vnd.sun.xml.impress.template',
          'application/vnd.stardivision.impress',
          'application/vnd.stardivision.impress-packed',
          'application/x-starimpress',
          'application/vnd.lotus-freelance', // PRZ — Lotus Freelance Graphics
          'application/vnd.stardivision.impress', // SDD - Star Office's StarImpress
          'application/vnd.corel-presentations', // SHW — Corel Presentations slide show creation
          'application/vnd.sun.xml.impress', // SXI — OpenOffice.org XML (obsolete) Presentation
          'application/vnd.ms-officetheme', // THMX — Microsoft PowerPoint theme template
          'application/vnd.sun.xml.impress.template '// STI — OpenOffice Impress template

        ]
      },
      className: 'csui-icon mime_presentation',
      svgId: 'themes--carbonfiber--image--icons--mime_presentation',
      mimeType: lang.NodeTypePresentation,
      sequence: 50
    },
    {
      equalsNoCase: {
        mime_type: [
          'application/vnd.ms-publisher',
          'application/x-mspublisher'
        ]
      },
      className: 'csui-icon mime_publisher',
      svgId: 'themes--carbonfiber--image--icons--mime_publisher',
      mimeType: lang.NodeTypePublisher,
      sequence: 50
    },
    {
      equalsNoCase: {
        mime_type: [
          'application/vnd.oasis.opendocument.formula',
          'application/vnd.sun.xml.math',
          'application/vnd.stardivision.math',
          'application/x-starmath'
        ]
      },
      className: 'csui-icon mime_formula',
      svgId: 'themes--carbonfiber--image--icons--mime_formula',
      mimeType: lang.NodeTypeFormula,
      sequence: 50
    },
    {
      equalsNoCase: {
        mime_type: [
          'application/vnd.pdf',
          'application/x-pdf',
          'application/pdf'
        ]
      },
      className: 'csui-icon mime_pdf',
      svgId: 'themes--carbonfiber--image--icons--mime_pdf',
      mimeType: lang.NodeTypePDF,
      sequence: 50
    },
    {
      equalsNoCase: {
        mime_type: [
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
          'application/vnd.ms-word.document.macroEnabled.12',
          'application/vnd.ms-word.template.macroEnabled.12'
        ]
      },
      className: 'csui-icon mime_word',
      svgId: 'themes--carbonfiber--image--icons--mime_word',
      mimeType: lang.NodeTypeDOC,
      sequence: 50
    },
    {
      equalsNoCase: {
        mime_type: [
          'drawing/dwg'
        ]
      },
      className: 'csui-icon mime_dwg',
      svgId: 'themes--carbonfiber--image--icons--mime_dwg',
      mimeType: lang.NodeTypeDOC,
      sequence: 50
    },
    {
      equalsNoCase: {
        mime_type: [
          'application/onenote',
          'application/msonenote'
        ]
      },
      className: 'csui-icon mime_onenote',
      svgId: 'themes--carbonfiber--image--icons--mime_onenote',
      mimeType: lang.NodeTypeONE,
      sequence: 50
    },
    {
      equalsNoCase: {
        mime_type: [
          'application/vnd.ms-project',
          'application/msproj',
          'application/msproject',
          'application/x-msproject',
          'application/x-ms-project',
          'application/mpp'
        ]
      },
      className: 'csui-icon mime_project',
      svgId: 'themes--carbonfiber--image--icons--mime_project',
      mimeType: lang.NodeTypeMPP,
      sequence: 50
    },
    {
      startsWithNoCase: {mime_type: 'image/'},
      className: 'csui-icon mime_image',
      svgId: 'themes--carbonfiber--image--icons--mime_image',
      mimeType: lang.NodeTypeImage,
      sequence: 50
    },
    {
      startsWithNoCase: {mime_type: 'audio/'},
      className: 'csui-icon mime_audio',
      svgId: 'themes--carbonfiber--image--icons--mime_audio',
      mimeType: lang.NodeTypeAudio,
      sequence: 50
    },
    {
      startsWithNoCase: {mime_type: 'text/'},
      className: 'csui-icon mime_paper',
      svgId: 'themes--carbonfiber--image--icons--mime_paper',
      mimeType: lang.NodeTypeText,
      sequence: 50
    },
    {
      equalsNoCase: {mime_type: 'text/html'},
      className: 'csui-icon mime_html',
      svgId: 'themes--carbonfiber--image--icons--mime_html',
      mimeType: lang.NodeTypeHtml,
      sequence: 40
    },
    {
      startsWithNoCase: {mime_type: 'video/'},
      className: 'csui-icon mime_video',
      svgId: 'themes--carbonfiber--image--icons--mime_video',
      mimeType: lang.NodeTypeVideo,
      sequence: 50
    },
    {
      equalsNoCase: {
        mime_type: [
          'application/x-rar-compressed',
          'application/zip',
          'application/x-zip',
          'application/x-zip-compressed'
        ]
      },
      className: 'csui-icon mime_zip',
      svgId: 'themes--carbonfiber--image--icons--mime_zip',
      mimeType: lang.NodeTypeCompressed,
      sequence: 50
    },
    {
      equals: {type: 136},
      className: 'csui-icon compound_document',
      svgId: 'themes--carbonfiber--image--icons--compound_document',
      sequence: 100
    },
    {
      equals: {type: 144},
      className: 'csui-icon mime_document',
      svgId: 'themes--carbonfiber--image--icons--mime_document',
      sequence: 100
    },
    {
      equals: {type: 736},
      className: 'csui-icon mime_drawing',
      svgId: 'themes--carbonfiber--image--icons--mime_drawing',
      sequence: 100
    },
    {
      equals: {type: 258},
      className: 'csui-icon csui-icon-saved-search-query',
      svgId: 'themes--carbonfiber--image--icons--mime_saved_search',
      mimeType: lang.NodeTypeSearchQuery,
      sequence: 100
    },
    {
      equals: {type: 140},
      className: 'csui-icon url1',
      svgId: 'themes--carbonfiber--image--icons--url',
      mimeType: lang.NodeTypeURL,
      sequence: 100
    },
    {
      equals: {type: 1},
      className: 'csui-icon shortcut1',
      svgId: 'themes--carbonfiber--image--icons--shortcut',
      sequence: 100
    },
    {
      equals: {type: 2},
      className: 'csui-icon mime_generation',
      svgId: 'themes--carbonfiber--image--icons--mime_generation',
      sequence: 100
    },
    {
      equals: {type: 131},
      className: 'csui-icon category1',
      svgId: 'themes--carbonfiber--image--icons--category',
      sequence: 100
    },
    {
      equals: {type: 202},
      className: 'csui-icon csui-icon-project',
      svgId: 'themes--carbonfiber--image--icons--mime_cs_project',
      sequence: 100
    },
    {
      equals: {type: 298},
      className: 'csui-icon collection',
      svgId: 'themes--carbonfiber--image--icons--collection',
      sequence: 100
    },
    {
      equals: {type: 141},
      className: 'csui-icon csui-icon-enterprise-volume',
      svgId: 'themes--carbonfiber--image--icons--title_enterprise',
      sequence: 100
    },
    {
      equals: {type: 142},
      className: 'csui-icon csui-icon-personal-volume',
      svgId: 'themes--carbonfiber--image--icons--title_enterprise',
      sequence: 100
    },
    {
      equals: {type: 133},
      className: 'csui-icon csui-icon-category-volume',
      svgId: 'themes--carbonfiber--image--icons--category_volume',
      sequence: 100
    },
    {
      equals: {type: 132},
      className: 'csui-icon csui-icon-node-category-folder',
      svgId: 'themes--carbonfiber--image--icons--category_volume',
      sequence: 100
    },
    {
      equals: {type: 299},
      className: 'csui-icon csui-icon-node-livereport',
      svgId: 'themes--carbonfiber--image--icons--mime_livereport',
      sequence: 100
    },
    {
      equals: {type: 212},
      className: 'csui-icon csui-icon-node-milestone',
      svgId: 'themes--carbonfiber--image--icons--mime_milestone',
      sequence: 100
    },
    {
      equals: {type: 218},
      className: 'csui-icon csui-icon-node-poll',
      svgId: 'themes--carbonfiber--image--icons--mime_poll',
      sequence: 100
    },
    {
      equals: {type: 384},
      className: 'csui-icon csui-icon-node-prospector',
      svgId: 'themes--carbonfiber--image--icons--prospector',
      sequence: 100
    },
    {
      equals: {type: 206},
      className: 'csui-icon csui-icon-node-task',
      svgId: 'themes--carbonfiber--image--icons--mime_task',
      sequence: 100
    },
    {
      equals: {type: 205},
      className: 'csui-icon csui-icon-node-task-group',
      svgId: 'themes--carbonfiber--image--icons--mime_task_group',
      sequence: 100
    },
    {
      equals: {type: 204},
      className: 'csui-icon csui-icon-node-task-list',
      svgId: 'themes--carbonfiber--image--icons--mime_task_list',
      sequence: 100
    },
    {
      equals: {type: 957 },
      className: 'csui-icon csui-icon-perspective',
      svgId: 'themes--carbonfiber--image--icons--mime_perspective',
      sequence: 100
    },
    {
      equals: {type: 958 },
      className: 'csui-icon csui-icon-rule',
      svgId: 'themes--carbonfiber--image--icons--mime_rule',
      sequence: 100
    },
    {
      equals: {type: 955},
      className: 'csui-icon csui-icon-perspective-assets-folder',
      svgId: 'themes--carbonfiber--image--icons--perspective_assets_folder',
      sequence: 100
    },
    {
      equals: {type: 954},
      className: 'csui-icon csui-icon-perspective-assets-volume',
      svgId: 'themes--carbonfiber--image--icons--perspective_assets_volume',
      sequence: 100
    },
    {
      equals: {type: 899},
      className: 'csui-icon csui-icon-node-virtual-folder',
      svgId: 'themes--carbonfiber--image--icons--virtual_folder',
      sequence: 100
    },
    {
      equals: {type: 146},
      className: 'csui-icon mime_custom_view',
      svgId: 'themes--carbonfiber--image--icons--mime_custom_view',
      sequence: 30
    },
    {
      equals: {type: 153},
      className: 'csui-icon assignment-workflow',
      svgId: 'themes--carbonfiber--image--icons--assignment_workflow',
      sequence: 100
    },
    {
      equals: {type: 128},
      className: 'csui-icon mime_workflow_map',
      svgId: 'themes--carbonfiber--image--icons--mime_workflow_map',
      sequence: 100
    },
    {
      equals: {type: 190},
      className: 'csui-icon mime_workflow_status',
      svgId: 'themes--carbonfiber--image--icons--mime_workflow_status',
      sequence: 100
    },
    {
      equals: {type: 207},
      className: 'csui-icon mime_channel',
      svgId: 'themes--carbonfiber--image--icons--mime_channel',
      sequence: 100
    },
    {
      equals: {type: 208},
      className: 'csui-icon mime_news',
      svgId: 'themes--carbonfiber--image--icons--mime_news_item',
      sequence: 100
    },
    {
      equals: {type: 215},
      className: 'csui-icon mime_discussion',
      svgId: 'themes--carbonfiber--image--icons--mime_conversation',
      sequence: 100
    },
    {
      equals: {type: 335},
      className: 'csui-icon mime_xml_dtd',
      svgId: 'themes--carbonfiber--image--icons--mime_xml',
      sequence: 30
    },
    {
      equals: {type: 223},
      className: 'csui-icon mime_form',
      svgId: 'themes--carbonfiber--image--icons--mime_form',
      sequence: 100
    },
    {
      equals: {type: 230},
      className: 'csui-icon mime_form_template',
      svgId: 'themes--carbonfiber--image--icons--layout_template',
      sequence: 100
    },
    {
      equals: {type: 1281},
      className: 'csui-icon icon-pulse-comment',
      svgId: 'themes--carbonfiber--image--icons--pulse_comment',
      sequence: 100
    },
    {
      equals: {type: 5574},
      className: 'csui-icon mime_wiki_page',
      svgId: 'themes--carbonfiber--image--icons--mime_wiki_page',
      sequence: 10
    },
    {
      equals: {type: 5573},
      className: 'csui-icon mime_wiki',
      svgId: 'themes--carbonfiber--image--icons--mime_wiki',
      sequence: 10
    },
    {
      equals: {container: 'nonselectable'},
      className: 'csui-icon mime_folder_nonselectable',
      svgId: 'themes--carbonfiber--image--icons--mime_folder_nonselectable32',
      sequence: 1000
    },
    {
      equals: {container: true},
      className: 'csui-icon mime_folder',
      svgId: 'themes--carbonfiber--image--icons--mime_folder',
      sequence: 1000
    },
    {
      className: 'csui-icon mime_document',
      svgId: 'themes--carbonfiber--image--icons--mime_document',
      sequence: 10000
    }
  ]);

  if (extraIcons) {
    nodeSprites.add(_.flatten(extraIcons, true));
  }

  return nodeSprites;

});
