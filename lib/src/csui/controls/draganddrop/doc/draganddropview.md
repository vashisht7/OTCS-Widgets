# DragAndDropView

    Provides the facility to drag and drop folders and files from OS to content server. It uses HTML5 drag and drop functionality. This controllers handle
        1. drag and drop folders/files to table(current container) as well as children(subfolders).
        2. add version using drag and drop to an existing file (limit: drag and drop single file to existing file).
    Currently this controller works with nodestable widget.
    This controller provides a view to show the message and heighlights the border  to either supported row/container while dragging items on table view.

    IE won't support for drag and drop folders as well as add version. In IE only we can upload files.

## Supportable subtypes

    Supported subtypes are hardcoded at UI level in 'csui/utils/dragndrop.supported.subtypes'.


## How to require DragAndDropView

    require(['csui/controls/draganddrop/draganddrop.view'
    ], function (DragAndDrop) {
    // Use drag and drop controller
    });


## How to register DragAndDropView with row/container

    var dnd = new DragAndDrop({
        container: target,
        collection: this.collection,
        addableTypes: this.addableTypes,
        context: context,
        highlightedTarget: highlightedTarget,
        originatingView: this,
        isSupportedRowView: isSupportedRowView
    });
### Params

#### container
    Based on supported subtype either it is a row or current container
#### collection
    Current/parent view collection
#### addableTypes
    current container has permissions to add new content or not, for sub level items we get 
    addable-types info after dropping items.
#### context
    Application context object
#### highlightedTarget
    Based on supported sub-type, highlighted target will be either row or container. while dragging 
    items on table view border applied to highlighted target
#### isSupportedRowView
     This value is true if node sub type contains in declared supported sub types (csui/utils/dragndrop.supported.subtypes)

## Events

### onOverView
   read dataTransfer object(browser api will give once you drag and drop) and get the items list. Based no of items and kind(file or directory) we will corresponding drop message and heighlight the row/container

### onLeaveView
   removes  drop message and border from row/container

### onDropView
    Drop files/folders into current container/row.
    dataTransfer object(browser api) gives entries, entries has info of name or kind of entry (file/directory). Prepared local models/files object from entries. reslove naming conflicts if any for first level items an then ask to fill if any required attributes are there for first level items.
    Folders are created from directory entries, later read folder entries to get sub level items(folders/files) till last leaf of the directory. By end of this recursive process we do have all files,  upload them using file upload helper.
