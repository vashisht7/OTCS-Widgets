FileOpenDialog
==============

Lets the user select a file from the file system with the file-open dialog
from the underlying operating system or with device functionality.

## Synopsis

```
var fileOpenDialog = new FileOpenDialog();
fileOpenDialog
    .on('add:files', function (files) {
      console.log('selected:', _.pluck(files, 'name'));
      fileOpenDialog.destroy();
    })
    .on('cancel', function () {
      console.log('canceled');
    })
    .show();
```

## Constructor options

multiple
: Enables selecting multiple files.
  (boolean, optional, default `false`)

## Events

add:files
: Triggers when one or more files have been selected, the single argument
  is a `FileList` enumerable with `File` objects.

cancel
: Triggers when the file selection dialog has been canceled.
