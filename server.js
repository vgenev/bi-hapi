'use strict'
const Hapi = require('hapi')
const Hoek = require('hoek')
const router = require(`${__dirname}/route/router`)
const config = require(`${__dirname}/lib/real_config`)

let server = new Hapi.Server()

server.connection(config.server)

server.route(router)

server.register([
  require('inert'),
  require('vision'),
  { register: require('good'), options: config.goodOptions },
  { register: require('hapi-swagger'), options: config.swaggerOptions }
], (err) => {
  Hoek.assert(!err, err)

  server.start((err) => {
    Hoek.assert(!err, err)
    console.log('Server started at:', server.info.uri)
  })
})
