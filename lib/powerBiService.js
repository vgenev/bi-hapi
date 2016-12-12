'use strict'
const Service = require('node-bi')
const appConfig = require(`${__dirname}/real_config`)
const moment = require('moment')
const Log = require(`${__dirname}/../node_modules/node-bi/service/log`)

class PowerBiService {
  constructor (scheme, dataSource) {
    this.Scheme = scheme
    this.data = dataSource
    this.service = new Service(appConfig, this.Scheme)
    this.log = new Log(moment)
  }

  start (userName, password, callback) {
    this.service.login(userName, password, () => {
    })

    for (var element of this.data) {
      for (var obj of element.dataArray) {
        this.service.sendData(element.tableName, obj, () => {
        })
      }
    }

    this.service.onSendData((success, count) => {
      if ((success === true) && (count === this.data.length)) {
        this.log.info('Send data successful. Send: ' + count + ' items.')
        return callback(null, count)
      } else if (!success) {
        this.log.warning('Something has gone wrong. Lost: ' + count + ' items.')
        return (callback(count, null))
      } else {
        return
      }
    })
  }
}

module.exports = PowerBiService
