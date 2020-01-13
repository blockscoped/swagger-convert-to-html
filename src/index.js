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
    '.swagger-ui .opblock .opblock-section-header h4 { font-size: 16px }' +
    '.swagger-ui .markdown p { margin: 0; line-height: 1.6; font-size: 15px; }' +
    '.swagger-ui .markdown p + p { margin-bottom: 1em; }' +
    '.swagger-ui li { line-height: 2; font-size: 15px; }' +
    '.swagger-ui .parameters-col_description { width: 50% }' +
    '.swagger-ui .parameter__name { flex-basis: 23% }' +
    '.swagger-ui .parameter__type { flex-basis: 23%; font-size: 14px; }' +
    '.swagger-ui .parameter__in { font-size: 14px; }' +
    '.swagger-ui .parameters-col_description input[type=text] { display: none; }' +
    '.swagger-ui table tbody tr td { padding: 12px; vertical-align: baseline; }' +
    '.swagger-ui table tbody tr td:first-of-type { display: flex; justify-content: flex-start; align-items: center; max-width: none; min-width: 0; padding: 12px; }' +
    '.swagger-ui .response-col_description { width: 90% }' +
    '.swagger-ui .opblock-body pre.microlight { font-size: 14px; line-height: 1.4; font-weight: 300; }' +
    '.swagger-ui table thead tr td, .swagger-ui table thead tr th { padding: 12px; font-size: 15px; }' +
    'thead { background: rgba(0, 0, 0, 0.07); }' +
    '.swagger-ui .execute-wrapper { padding: 0; }' +
    '.swagger-ui .btn.execute { margin: 20px }' +
    '.swagger-ui tbody .response-col_status { font-size: 16px }' +
    '.swagger-ui .model { line-height: 1.4; font-size: 14px; color: inherit; }' +
    '.swagger-ui .model-box { display: block; background: #41444e; color: #f1f1f1; }' +
    '.swagger-ui .model-title { color: inherit; }' +
    '.swagger-ui .prop-type { color: #6de082; }' +
    '.swagger-ui .prop-format { color: inherit; margin-left: 0.5em; }' +
    '.swagger-ui .model-box .markdown { display: block; margin-left: 2em }' +
    '.swagger-ui .model-box .markdown + span { display: block; margin-left: 2em }' +
    '.swagger-ui table.model tbody tr td { padding: 0.5em 2em; }' +
    '.swagger-ui table.model tbody tr td:first-of-type { padding: 0.5em 2em; }' +
    '.swagger-ui .model-box .prop .markdown { margin: 0; font-style: italic; opacity: 0.7; font-weight: 300; }' +
    '.swagger-ui section.models .model-box { background: #41444e; }' +
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
