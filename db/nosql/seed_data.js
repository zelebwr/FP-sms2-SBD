// Sample data for MongoDB

db = db.getSiblingDB('your_database_name');

// Insert sample users
db.users.insertMany([
  {
    username: "admin",
    email: "admin@example.com",
    password: "hashed_password",
    role: "admin",
    profile: {
      full_name: "Admin User",
      address: "123 Admin St",
      phone_number: "555-1234"
    },
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    username: "user1",
    email: "user1@example.com",
    password: "hashed_password",
    role: "customer",
    profile: {
      full_name: "John Doe",
      dob: new Date("1990-01-15"),
      address: "456 User Ave",
      phone_number: "555-5678"
    },
    created_at: new Date(),
    updated_at: new Date()
  }
]);

// Insert sample products
db.products.insertMany([
  {
    name: "Smartphone",
    description: "Latest smartphone with advanced features",
    category: {
      name: "Electronics",
      description: "Electronic devices and accessories"
    },
    price: 599.99,
    stock_quantity: 50,
    images: ["/images/smartphone.jpg"],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: "T-shirt",
    description: "Cotton t-shirt, available in multiple colors",
    category: {
      name: "Clothing",
      description: "Apparel and fashion items"
    },
    price: 19.99,
    stock_quantity: 100,
    images: ["/images/tshirt.jpg"],
    created_at: new Date(),
    updated_at: new Date()
  }
]);