hb = require('handlebars')
fs = require('fs-extra-promise')
moment = require('moment')
path = require('path')

TEMPLATEDIR = process.cwd() + '/templates'
PARTIAL_DIR = "#{TEMPLATEDIR}/partials"
NODE_ENV = process.env.NODE_ENV or 'development'

siteSettings = ->
  items =
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
  return items[NODE_ENV]

buildTemplates = ->
  templates = {}
  for partial in ['footer', 'header', 'sidebar']
    hb.registerPartial partial, fs.readFileSync("#{PARTIAL_DIR}/#{partial}.hbs").toString()
    templates[partial] = hb.compile("{{> #{partial}}}")
  for tpl in ['single', 'feed', 'sitemap', 'home']
    templates[tpl] = hb.compile(fs.readFileSync("#{TEMPLATEDIR}/#{tpl}.hbs").toString())
  return templates

config =
  site: siteSettings()

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

config.templates = buildTemplates()

module.exports = config
