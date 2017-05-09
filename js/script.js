---
---

var API_URL = '{{ site.api-url }}'
var TASK_ID = 'fix-ocr'

var item = {}
var ocrTextElement = document.getElementById('ocr-text')

var elements = {
  error: document.getElementById('error'),
  oauth: document.getElementById('oauth')
}

var brickByBrick = BrickByBrick(API_URL, TASK_ID, null, elements)

// function formSubmit(event) {
//   event.preventDefault()
//   submit()
//   return false
// }

// document.getElementById('form').addEventListener('submit', function (event) {
//   event.preventDefault()
//   submit()
// })

// titleElement.addEventListener('keydown', function (event) {
//   if (event.metaKey) {
//     return
//   }

//   if (event.keyCode === 13) {
//     // submit()
//     // event.preventDefault()
//   } else if (event.keyCode >= 37 && event.keyCode <= 40) {
//   } else if (event.keyCode >= 48 && event.keyCode <= 57) {
//     event.preventDefault()
//   } else {
//     event.preventDefault()
//   }
// })

function updateItem(item) {
  var canvas = document.getElementById('canvas')
  var ctx = canvas.getContext('2d')

  var pngUrl = item.collection.data.baseUrl + item.collection.data.pngDir + '/' + item.data.pngFile

  console.log(pngUrl)

  var png = new Image()
  png.onload = function () {
    var bbox = item.data.bbox
    var pageSize = item.data.pageSize

    var sx = bbox[0]
    var sy = pageSize[1] - bbox[3]
    var sWidth = bbox[2] - bbox[0]
    var sHeight = bbox[3] - bbox[1]

    var dx = 0
    var dy = 0
    var dWidth = sWidth
    var dHeight = sHeight

    ctx.drawImage(png, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  }

  png.src = pngUrl

  // d3.select('#digital-collections')
  //   .attr('href', pngUrl)

  d3.select('#full-png')
    .attr('href', pngUrl)

  d3.select('#ocr-text')
    .attr('value', item.data.text)
}

function getItem() {
  ocrTextElement.focus()

  brickByBrick.getItem()
    .then(function (nextItem) {
      d3.select('article')
        .classed('hidden', false)

      item = nextItem

      updateItem(item)
    })
    .catch(function (err) {
      console.error(err.message)
    })
}

function submit() {
  if (!item || !item.id) {
    return
  }

  var data
  var toponym = titleElement.value
    .substring(titleElement.selectionStart, titleElement.selectionEnd).trim()

  if (toponym.length) {
    data = {
      toponym: toponym
    }
  }

  brickByBrick.postSubmission(item.organization.id, item.id, data)
    .then(function () {
      getItem()
    })
    .catch(function (err) {
      console.error(err.message)
    })
}

getItem()

