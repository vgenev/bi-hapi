'use strict'
const Service = require('node-bi')
const appConfig = require('./config.json')
const moment = require('moment')
const Log = require('../node_modules/node-bi/service/log')

class PowerBiAPI {
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
      if (success === true) {
        this.log.info('Send data successful. Send: ' + count + ' items.')
        return callback(null, count)
      } else {
        this.log.warning('Something has gone wrong. Lost: ' + count + ' items.')
        return (callback(count, null))
      }
    })
  }
}

module.exports = PowerBiAPI
