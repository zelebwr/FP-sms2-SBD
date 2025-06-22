const sampleRatings = [
  {
    productId: 1, // Javva Classic Logo Tee
    userId: 2, // Jonathan Joestar
    ratingValue: 5,
    reviewText: "Excellent quality, very comfortable!",
    createdAt: new Date(), 
  },
  {
    productId: 1,
    userId: 3, // Dio Brando
    ratingValue: 2,
    reviewText: "It's just a t-shirt. Not worth my time.",
    createdAt: new Date(),
  },
  {
    productId: 8, // Slim Fit Chinos
    userId: 2,
    ratingValue: 4,
    reviewText: "Great fit and very stylish for a night out.",
    createdAt: new Date(),
  },
  {
    productId: 9, // Classic Denim Jeans
    userId: 3,
    ratingValue: 4,
    reviewText: "Surprisingly durable. I approve.",
    createdAt: new Date(),
  }
];

module.exports = {
  sampleRatings
};