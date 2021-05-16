/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



define([
  'xecmpf/pages/start/perspective-only.page.view',
  'xecmpf/widgets/integration/folderbrowse/search.box.view',
  'xecmpf/widgets/integration/folderbrowse/full.page.workspace.view',
  'xecmpf/widgets/integration/folderbrowse/search.results/search.results.view',
  'xecmpf/widgets/integration/folderbrowse/modaldialog/modal.dialog.view',
  'xecmpf/utils/commands/folderbrowse/go.to.workspace.history',
  'xecmpf/utils/commands/folderbrowse/search.container',
  'xecmpf/utils/commands/folderbrowse/open.full.page.workspace',
  'xecmpf/utils/commands/workspaces/workspace.delete',
  'xecmpf/utils/commands/boattachments/boattachments.create',
  'xecmpf/utils/commands/eac/eac.refresh',
  'xecmpf/utils/commands/eac/eac.back',
  'xecmpf/widgets/boattachments/impl/boattachment.table/commands/snapshot',
  'xecmpf/behaviors/toggle.header/toggle.header.behavior',
  'xecmpf/widgets/integration/folderbrowse/toolbaritems',
  'xecmpf/widgets/boattachments/impl/boattachment.table/tablecell/createdby.view',
  'xecmpf/widgets/boattachments/impl/boattachment.table/tablecell/modifiedby.view',
  'xecmpf/controls/table/cells/eac.actionplan.view',
  'xecmpf/controls/bosearch/bosearch.dialog.controller',
  'xecmpf/controls/property.panels/reference/impl/reference.panel.view',
  'xecmpf/widgets/boattachments/boattachments.view',
  'xecmpf/widgets/workspaces/workspaces.widget',
  'xecmpf/widgets/myattachments/metadata.property.panels',
  'xecmpf/widgets/dossier/dossier.view',
  'xecmpf/widgets/eac/eac.view',
  'xecmpf/widgets/header/header.view',
  'xecmpf/widgets/scan/scan.view',
  'xecmpf/utils/document.thumbnail/document.thumbnail.view',
  'xecmpf/controls/savedquery.node.picker/savedquery.node.picker.view',
  'xecmpf/controls/savedquery.node.picker/impl/savedquery.form.view',
  'xecmpf/controls/search.textbox/search.textbox.view',
  'xecmpf/controls/property.panels/reference/reference.panel',
  'xecmpf/dialogs/node.picker/start.locations/businessobjecttypes.container/businessobjecttypes.container.factory',
  'xecmpf/dialogs/node.picker/start.locations/extended.ecm.volume.container/extended.ecm.volume.container.factory',
  'json!xecmpf/widgets/workspaces/workspaces.manifest.json',
  'json!xecmpf/widgets/boattachments/boattachments.manifest.json',
  'json!xecmpf/widgets/dossier/dossier.manifest.json',
  'json!xecmpf/widgets/header/header.manifest.json',
  'json!xecmpf/widgets/scan/scan.manifest.json',
  'json!xecmpf/utils/perspective/custom.search.json',
  'i18n!xecmpf/widgets/scan/impl/nls/scan.manifest',
  'i18n!xecmpf/widgets/boattachments/impl/nls/lang',
  'i18n!xecmpf/controls/property.panels/reference/impl/nls/lang',
  'xecmpf/utils/perspective/custom.search.perspective',
  'xecmpf/widgets/boattachments/impl/boattachmentutil',
  'xecmpf/utils/perspective/eventactionnode.perspective',
  'json!xecmpf/utils/perspective/impl/perspectives/eventaction.json'

], {});

require(['require', 'css'], function (require, css) {
  css.styleLoad(require, 'xecmpf/bundles/xecmpf-app', true);
});
