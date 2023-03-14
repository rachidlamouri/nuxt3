
export default {
  validator: {
    $jsonSchema: {
      required: ['name'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Product name is required and 50 characters max',
          maxLength: 200,
        },
        slug: {
          bsonType: 'string',
          description: 'Product slug is required',
        },
        description: {
          bsonType: 'string',
          description: 'Product description',
          maxLength: 2000,
        },
        dateCreated: {
          bsonType: 'date',
          description: 'Date created',
        },
        sortOrder: {
          bsonType: 'int',
        },
      },
    },
  },
}

