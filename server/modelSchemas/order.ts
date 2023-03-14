export default {
  validator: {
    $jsonSchema: {
      // required: ['name', 'email'],
      properties: {
        status: {
          bsonType: 'string',
          enum: ['cart', 'checkout', 'billing', 'shipping', 'payment', 'processing'],
          description: 'Order status',
          // maxLength: 200,
        },
        orderDate: {
          bsonType: ['date', 'null'],
          description: 'Order creation date',
        },
        items: {
          bsonType: 'array',
          description: 'order items',
          required: ['_id', 'name', 'acsPartNumber', 'price', 'quantity', 'media'],
          properties: {
            _id: {
              bsonType: 'objectId',
              description: 'Product _id is required ',
            },
            acsPartNumber: {
              bsonType: 'string',
              description: 'Product ACS part number is required and 200 characters max',
              maxLength: 200,
            },
            price: {
              bsonType: 'number',
              description: 'Product price is required.',
              maxLength: 200,
            },
            quantity: {
              bsonType: 'number',
              description: 'Product quantityis required.',
              maxLength: 200,
            },
            media: {
              bsonType: 'array',
              description: 'Product images',
              items: {
                bsonType: 'object',
                properties: {
                  name: {
                    bsonType: 'string',
                    description: 'Eligibility name',
                  },
                  slug: {
                    bsonType: 'string',
                    description: 'Eligibility slug',
                  },
                },
              },
              uniqueItems: true,
              // items: {
              //   bsonType: 'objectId',
              // },
            },
            // image: {
            //   bsonType: 'string',
            //   description: 'Product image is required and 200 characters max',
            //   maxLength: 200,
            // },
          },
        },
        customer: {
          bsonType: 'object',
          description: 'customer',
          // required: ['name', 'email'],
          properties: {
            // _id: {
            //   bsonType: 'objectId',
            //   description: 'Customer _id is required ',
            //   // maxLength: 200,
            // },
            name: {
              bsonType: 'string',
              description: 'User name is required and 200 characters max',
              maxLength: 200,
            },
            email: {
              bsonType: 'string',
              description: 'User email is required and 200 characters max',
              maxLength: 100,
            },
            phoneNumber: {
              bsonType: 'string',
              description: 'User ephone number is required and 200 characters max',
              maxLength: 20,
            },
            // createAccount: {
            //   bsonType: 'boolean',
            //   description: 'Whether to create an acoount for the customer',
            //   // maxLength: 100,
            // },

            // addressLine2: {
            //   bsonType: 'string',
            //   description: 'User address line 2 is required and 200 characters max',
            //   maxLength: 100,
            // },
            // city: {
            //   bsonType: 'string',
            //   description: 'User address city is required and 200 characters max',
            //   maxLength: 100,
            // },
            // state: {
            //   bsonType: 'objectId',
            //   description: 'User address state is required and 200 characters max',
            //   maxLength: 20,
            // },
            // postalCode: {
            //   bsonType: 'string',
            //   description: 'User address postal code is required and 200 characters max',
            //   maxLength: 100,
            // },
            // country: {
            //   bsonType: 'objectId',
            //   description: 'User address countryis required and 200 characters max',
            //   maxLength: 20,
            // },
            // addressType: {
            //   enum: ['Residential', 'Commercial'],
            //   description: 'Address type and is required',
            // },
          },
        },
        cartTotal: {
          bsonType: 'number',
          description: 'Cart total is required',
          maxLength: 200,
        },
      },
    },
  },
}
