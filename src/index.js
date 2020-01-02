#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var file = path.resolve(process.argv[2])
var target = path.resolve(process.argv[3])

var swaggerDoc = JSON.parse(fs.readFileSync(file, 'utf8'))

var favIconHtml =
  '<link rel="icon" type="image/png" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3.11.0/favicon-32x32.png" sizes="32x32" />' +
  '<link rel="icon" type="image/png" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3.11.0/favicon-16x16.png" sizes="16x16" />'

var setup = function (swaggerDoc, customfavIcon, customeSiteTitle) {
  customfavIcon = customfavIcon || false
  customeSiteTitle = customeSiteTitle || 'Swagger UI'
  var html = fs.readFileSync(__dirname + '/indexTemplate.html')
  try {
    fs.unlinkSync(__dirname + '/index.html')
  } catch (e) {}

  var favIconString = customfavIcon
    ? '<link rel="icon" href="' + customfavIcon + '" />'
    : favIconHtml

  var explorerString =
  '.swagger-ui .topbar { display: none }\n' +
  'a[href*="swagger.io"] { display: none }';
  var htmlWithCustomCss = html
    .toString()
    .replace('<% customCss %>', explorerString)
  var htmlWithFavIcon = htmlWithCustomCss.replace(
    '<% favIconString %>',
    favIconString
  )

  var initOptions = {
    swaggerDoc: swaggerDoc || undefined
  }
  var htmlWithOptions = htmlWithFavIcon
    .replace('<% swaggerOptions %>', JSON.stringify(initOptions))
    .replace('<% title %>', customeSiteTitle)

  try {
    fs.unlinkSync(target)
  } catch (e) {}

  fs.writeFileSync(target, htmlWithOptions)

  console.log('HTML created')
}

var stringify = function (obj, prop) {
  var placeholder = '____FUNCTIONPLACEHOLDER____'
  var fns = []
  var json = JSON.stringify(
    obj,
    function (key, value) {
      if (typeof value === 'function') {
        fns.push(value)
        return placeholder
      }
      return value
    },
    2
  )
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function (_) {
    return fns.shift()
  })
  return json + ';'
}

setup(swaggerDoc)
