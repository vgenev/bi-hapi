const Joi = require('joi')
const powerBiDataHandler = require(`${__dirname}/../handlers/powerBiHandler`).powerBiDataHandler
const getSchema = require(`${__dirname}/../handlers/getSchema`)
const powerBiSchemaHandler = require(`${__dirname}/../handlers/powerBiHandler`).powerBiSchemaHandler
const dataTypesENUM = ['String', 'Int64', 'Double', 'Boolean', 'Datetime']

module.exports = [
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
              dataType: Joi.string().valid(dataTypesENUM).required(),
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
]
