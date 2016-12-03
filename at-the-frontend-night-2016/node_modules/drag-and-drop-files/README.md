drag-and-drop-files
===================
Handle [file drag and drop events](https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications) in an HTML5 capable browser with less Yak shaving.

## Example

```javascript
var dropTarget = document.querySelector("#dropTarget")

require("drag-and-drop-files")(dropTarget, function(files) {
  console.log("Got some files:", files)
})
```

## Install

    npm install drag-and-drop-files

### `require("drag-and-drop-files")(element, callback(files) )`
Hooks a listener for a file data transfer event.

* `element` is the DOM element to listen for file events on
* `callback(files)` is a callback that gets fired when the files are dropped on to it.  The argument `files` is an array of all the file objects that were dragged onto the element.


## Credits
(c) 2013 Mikola Lysenko. MIT License
