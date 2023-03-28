export default {
  validator: {
    $jsonSchema: {
      required: ['countryName', 'currencyCode'],
      properties: {
        countryName: {
          bsonType: 'string',
          description: 'Country name is required and 50 characters max',
          maxLength: 200,
        },
        countryCode: {
          bsonType: 'string',
          description: 'Country cose',
        },
        continentName: {
          bsonType: 'string',
          description: 'continent name',
          maxLength: 2000,
        },
        continentCode: {
          bsonType: 'string',
          description: 'Continent code',
          maxLength: 2000,
        },
        capitalName: {
          bsonType: 'string',
          description: 'Continent code',
          maxLength: 2000,
        },
        currencyCode: {
          bsonType: 'string',
          description: 'Continent code',
          maxLength: 2000,
        },
        phoneCode: {
          bsonType: 'string',
          description: 'Continent code',
        },
        threeLetterCountryCode: {
          bsonType: 'string',
          description: 'Continent code',
          maxLength: 2000,
        },
      },
    },
  },
}
