export default {
  validator: {
    $jsonSchema: {
      required: ['name', 'slug'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Next higher assembly name is required and 50 characters max',
          maxLength: 200,
        },
        slug: {
          bsonType: 'string',
          description: 'Next higher assembly slug is required, and 50 characters max',
          maxLength: 250,
        },
      },
    },
  },
}
