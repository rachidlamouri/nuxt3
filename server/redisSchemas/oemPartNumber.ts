export default {
  validator: {
    $jsonSchema: {
      required: ['partNumber', 'slug', 'oem'],
      properties: {
        partNumber: {
          bsonType: 'string',
          description: 'Part number is required and 50 characters max',
          maxLength: 200,
        },
        slug: {
          bsonType: 'string',
          description: 'Part numberslug is required, and 50 characters max',
          maxLength: 250,
        },

        oem: {
          bsonType: 'string',
          description: 'OEM',
        },
      },
    },
  },
}
