'use strict'
const fs = require('fs')

module.exports = function (request, reply) {
  const schema = request.params.schema
  if (schema === undefined) {
    let path = `${__dirname}/../schemas`
    fs.readdir(path, (err, dir) => {
      if (err) {
        return reply(err)
      } else {
        return reply(dir)
      }
    })
  } else {
    let path = `${__dirname}/../schemas/${schema}.json`
    fs.readFile(path, (err, file) => {
      if (err) {
        return reply(err)
      } else {
        return reply(file.toString())
      }
    })
  }
}
