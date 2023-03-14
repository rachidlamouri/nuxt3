export default {
  validator: {
    $jsonSchema: {
      required: ['name', 'abbreviation'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'State name is required and 50 characters max',
          maxLength: 200,
        },
        abbreviation: {
          bsonType: 'string',
          description: 'state abbreviation',
        },
      },
    },
  },
}