// MongoDB schema setup and validation

db = db.getSiblingDB('your_database_name');

// Drop collections if they exist
db.users.drop();
db.products.drop();
db.orders.drop();

// Create collections with validation
db.createCollection("users", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["username", "email", "password", "role"],
         properties: {
            username: {
               bsonType: "string",
               description: "must be a string and is required"
            },
            email: {
               bsonType: "string",
               pattern: "^.+@.+$",
               description: "must be a valid email address"
            },
            password: {
               bsonType: "string",
               description: "must be a string and is required"
            },
            role: {
               bsonType: "string",
               enum: ["admin", "customer"],
               description: "must be either admin or customer"
            },
            profile: {
               bsonType: "object",
               properties: {
                  full_name: { bsonType: "string" },
                  dob: { bsonType: "date" },
                  address: { bsonType: "string" },
                  phone_number: { bsonType: "string" }
               }
            }
         }
      }
   }
});

db.createCollection("products", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["name", "price", "stock_quantity"],
         properties: {
            name: {
               bsonType: "string",
               description: "must be a string and is required"
            },
            description: {
               bsonType: "string"
            },
            category: {
               bsonType: "object",
               required: ["name"],
               properties: {
                  name: { bsonType: "string" },
                  description: { bsonType: "string" }
               }
            },
            price: {
               bsonType: "number",
               minimum: 0,
               description: "must be a positive number"
            },
            stock_quantity: {
               bsonType: "int",
               minimum: 0,
               description: "must be a positive integer"
            },
            images: {
               bsonType: "array",
               items: { bsonType: "string" }
            },
            ratings: {
               bsonType: "array",
               items: {
                  bsonType: "object",
                  required: ["user_id", "rating"],
                  properties: {
                     user_id: { bsonType: "objectId" },
                     rating: { 
                        bsonType: "number",
                        minimum: 1,
                        maximum: 5
                     },
                     review: { bsonType: "string" },
                     created_at: { bsonType: "date" }
                  }
               }
            }
         }
      }
   }
});

// Create indexes
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
db.products.createIndex({ "name": 1 });