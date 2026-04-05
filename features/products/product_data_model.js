class Product {
  constructor(
    id,
    name,
    price,
    description,
    imageUrl,
    categoryId,
    stock,
    discount,
    orders,
    reviews,
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.categoryId = categoryId;
    this.stock = stock;
    this.discount = discount;
    this.orders = orders;
    this.reviews = reviews;
  }
}
class Review {
  constructor(userId, stars, comment) {
    this.userId = userId;
    this.stars = stars;
    this.comment = comment;
  }
}
