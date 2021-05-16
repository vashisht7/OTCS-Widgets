csui.require.config({
  bundles: {
'workflow/bundles/workflow-core': [
  'workflow/models/workitem/workitem.model.factory',
  'workflow/commands/defaultactionitems',
  'workflow/commands/initiate.workflow/initiate.workflow',
  'workflow/commands/edit.workflow.map/edit.workflow.map',
  'workflow/commands/initiate.document.workflow/initiate.document.workflow',
  'workflow/commands/open.workitem/open.workitem',
  'workflow/commands/open.form/open.form',
  'workflow/perspective/routers/workflow.perspective.router'
]
  }
});