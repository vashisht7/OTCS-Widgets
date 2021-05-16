csui.require.config({
  bundles: {
'otcss/bundles/otcss-all': [
  'otcss/widgets/hello/hello.view',
  'json!otcss/widgets/hello/hello.manifest.json',
  'otcss/widgets/noteview/noteview.view',
  'json!otcss/widgets/noteview/noteview.manifest.json',
  'otcss/perspective.context.plugin/lp.perspective.context.plugin',
  'otcss/perspective.routers/lp.perspective.router',
  'json!otcss/pages/lp.json',
  'otcss/commands/NoteComment/note.comment.command',
  'otcss/commands/NoteComment/note.comment.nodestable.toolitems',
  'otcss/commands/ViewNote/view.note.command',
  'otcss/commands/ViewNote/view.note.nodestable.toolitems',
  'otcss/widgets/getdeptnames/getdeptnames.view',
  'json!otcss/widgets/getdeptnames/getdeptnames.manifest.json',
  'otcss/widgets/dps/dps.view',
  'json!otcss/widgets/dps/dps.manifest.json'
]
  }
});