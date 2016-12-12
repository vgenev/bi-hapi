'use strict'
const Hapi = require('hapi')
const powerBiSchemaHandler = require('./handlers/powerBiHandler').powerBiSchemaHandler
const powerBiDataHandler = require('./handlers/powerBiHandler').powerBiDataHandler
const getSchema = require('./handlers/getSchema')
const Inert = require('inert')
const Vision = require('vision')
const Swagger = require('hapi-swagger')
const Joi = require('joi')

let server = new Hapi.Server()

server.connection({
  host: '0.0.0.0',
  port: 8033
})

server.register([
  Inert,
  Vision,
  {
    'register': Swagger,
    'options': {
      info: {
        title: 'PowerBI API Documentation',
        description: `\n
        PowerBI API for POSTing Schemas and Data to PowerBI. \n 
        After you POST actual schema, it is stored locally. \n
        After uploading schema, you can send data to PowerBI. \n
        Schema and Data objects are described below. \n
        Keep in mind that "schema" key in the Data object should have the same name as the uploaded schema. \n
        To list all schemas GET /power-bi-schema. \n
        GET /powet-bi-schema/SchemaName to get the particular schema. 
        `
      },
      expanded: 'full'
    }
  }
], (err) => {
  if (!err) {
    server.start((e) => {
      if (e) throw e
      else console.log('server running')
    })
  } else {
    throw err
  }
})

server.route([
  {
    method: 'POST',
    path: '/power-bi-schema',
    handler: powerBiSchemaHandler,
    config: {
      payload: {
        output: 'data',
        parse: true
      },
      tags: ['api'],
      validate: {
        payload: {
          name: Joi.string().required().default('SchemaName'),
          tables: Joi.array().items(Joi.object().keys({
            name: Joi.string().required().default('TableName'),
            columns: Joi.array().items(Joi.object().keys({
              name: Joi.string().required().default('ColumnName'),
              dataType: Joi.string().required().default('PowerBI Schema datatypes'),
              summarizeBy: Joi.string()
            })).required()
          })).required(),
          relationships: Joi.array().items(Joi.object())
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/power-bi-data',
    handler: powerBiDataHandler,
    config: {
      payload: {
        output: 'data',
        parse: true
      },
      tags: ['api'],
      validate: {
        payload: {
          schema: Joi.string().required().default('SchemaName'),
          data: Joi.array().items(Joi.object().keys({
            tableName: Joi.string().required().default('TableName'),
            dataArray: Joi.array().items(Joi.object()).required()
          })).required()
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/power-bi-schema/{schema?}',
    handler: getSchema,
    config: {
      tags: ['api']
    }
  }
])
