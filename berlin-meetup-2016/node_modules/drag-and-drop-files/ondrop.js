"use strict"

function handleDrop(callback, event) {
  event.stopPropagation()
  event.preventDefault()
  callback(Array.prototype.slice.call(event.dataTransfer.files))
}

function killEvent(e) {
  e.stopPropagation()
  e.preventDefault()
  return false
}

function addDragDropListener(element, callback) {
  element.addEventListener("dragenter", killEvent, false)
  element.addEventListener("dragover", killEvent, false)
  element.addEventListener("drop", handleDrop.bind(undefined, callback), false)
}

module.exports = addDragDropListener