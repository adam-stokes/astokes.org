hb = require('handlebars')
fs = require('fs-extra-promise')
moment = require('moment')
path = require('path')

config =
  templates:
    single: fs.readFileSync("./templates/single.hbs").toString()
    feed: fs.readFileSync("./templates/feed.hbs").toString()
    sitemap: fs.readFileSync("./templates/sitemap.hbs").toString()
    home: fs.readFileSync("./templates/home.hbs").toString()

nodeEnv = process.env.NODE_ENV or 'development'

siteSettings =
  'development':
    'sitename': 'Adam Stokes'
    'title': '(dev) devBlog'
    'baseUrl': 'http://localhost:3000'
    'description': 'tehe.'
  'production':
    'sitename': 'Adam Stokes'
    'title': 'steven seagal says hai.'
    'baseUrl': 'http://astokes.org'
    'description': 'ir0n fists'

config.site = siteSettings[nodeEnv]

for partial in ['footer', 'header', 'sidebar']
  pFile = fs.readFileSync("./templates/partials/#{partial}.hbs").toString()
  hb.registerPartial partial, pFile

hb.registerHelper 'date', (date) ->
  moment(date).format 'Do MMMM YYYY'

hb.registerHelper 'xmldate', (date) ->
  moment(date).format 'ddd, DD MMM YYYY HH:mm:ss ZZ'

hb.registerHelper 'sitemapdate', (date) ->
  moment(date).format 'YYYY-MM-DD'

hb.registerHelper 'link', (path) ->
  "#{config.site.baseUrl}/#{path}"

hb.registerHelper 'sitename', ->
  "#{config.site.sitename}"

hb.registerHelper 'siteDescription', ->
  "#{config.site.description}"

hb.registerHelper 'siteTitle', ->
  "#{config.site.title}"

module.exports = config
