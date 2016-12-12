'use strict'
const fs = require('fs')
const PowerBiAPI = require('../lib/powerBiAPI')

let userName = 'saleshub@trinitisoft.onmicrosoft.com'
let password = 'MashaIMechoka201'

function powerBiSchemaHandler (request, reply) {
  let data = request.payload
  fs.writeFile(`${__dirname}/../schemas/${data.name}.json`, JSON.stringify(data), (err) => {
    if (!err) return reply('success')
    else return reply(err)
  })
}

function powerBiDataHandler (request, reply) {
  let schema = require(`${__dirname}/../schemas/${request.payload.schema}.json`)
  let data = request.payload.data
  let powerBi = new PowerBiAPI(schema, data)
  powerBi.start(userName, password, (err, count) => {
    if (!err) return
    else return reply(`ERROR! ${err} entries lost`)
  })
}

module.exports = {
  powerBiDataHandler: powerBiDataHandler,
  powerBiSchemaHandler: powerBiSchemaHandler
}
