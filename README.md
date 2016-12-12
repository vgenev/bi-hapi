# HAPI based API for posting Schemas and Data to PowerBI

## General information

To send data to PowerBI dataSet you need first to upload the schema.
After you POST your schema, it is stored locally.
API Endpoints, Schemas and Data objects are described in the /documentation endpoint.
The "schema" key in the Data object should have the same name as the uploaded schema. 

To list all stored schemas GET /power-bi-schema.
GET /powet-bi-schema/SchemaName to get the particular schema.

## Authorization

## DB Storage
