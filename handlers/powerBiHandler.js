'use strict'
const fs = require('fs')
const PowerBiService = require(`${__dirname}/../lib/powerBiService`)
const config = require(`${__dirname}/../lib/real_config`)

const userName = config.credentials.username
const password = config.credentials.password


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
  let powerBi = new PowerBiService(schema, data)
  powerBi.start(userName, password, (err, count) => {
    if (!err) return
    else return reply(`ERROR! ${err} entries lost`)
  })
}

module.exports = {
  powerBiDataHandler: powerBiDataHandler,
  powerBiSchemaHandler: powerBiSchemaHandler
}
