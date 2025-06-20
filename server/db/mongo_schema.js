// assuming the collection 'javva_ecommerce_db' already exists

const ratingsSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["productId", "userId", "ratingValue", "createdAt"],
      properties: {
        productId: { bsonType: "int", description: "must be an integer matching product_id in MySQL" },
        userId: { bsonType: "int", description: "must be an integer matching user_id in MySQL" },
        ratingValue: { bsonType: ["double", "int"], minimum: 1, maximum: 5, description: "must be a number between 1-5 and is required" },
        reviewText: { bsonType: "string", description: "must be a string if the field exists" },
        createdAt: { bsonType: "date", description: "must be a date and is required" }
      }
    }
  }
};

const cartsSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "items", "createdAt", "updatedAt"],
      properties: {
        userId: { bsonType: "int", description: "must be an integer matching user_id in MySQL and is required" },
        items: {
          bsonType: "array",
          description: "must be an array of cart items",
          items: {
            bsonType: "object",
            required: ["productId", "quantity", "addedAt"],
            properties: {
              productId: { bsonType: "int", description: "must be an integer matching product_id in MySQL" },
              quantity: { bsonType: "int", minimum: 1, description: "must be a positive integer" },
              addedAt: { bsonType: "date", description: "must be a date when the item was added" },
              priceAtAddition: { bsonType: ["double", "int"], minimum: 0, description: "optional price snapshot when added to cart" }
            }
          }
        },
        createdAt: { bsonType: "date", description: "must be a date when the cart was created" },
        updatedAt: { bsonType: "date", description: "must be a date when the cart was last updated" },
        couponCode: { bsonType: "string", description: "optional discount coupon applied to cart" }
      }
    }
  }
};

const wishlistsSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "items", "updatedAt"],
      properties: {
        userId: { bsonType: "int", description: "must be an integer matching user_id in MySQL" },
        items: {
          bsonType: "array",
          description: "must be an array of wishlist items",
          items: {
            bsonType: "object",
            required: ["productId", "addedAt"],
            properties: {
              productId: { bsonType: "int", description: "must be an integer matching product_id in MySQL" },
              addedAt: { bsonType: "date", description: "must be a date when the item was added" }
            }
          }
        },
        updatedAt: { bsonType: "date", description: "must be a date when the wishlist was last updated" }
      }
    }
  }
};

module.exports = {
    ratingsSchema,
    cartsSchema,
    wishlistsSchema
};
