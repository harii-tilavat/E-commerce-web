const Product = require('../models/mongo/product');

class ProductService {
  constructor() {}

  async createNewProduct(product, file, userId) {
    const { title, price, description } = product;

    const imageUrl = file?.path ?? null;

    const createdProduct = await Product.create({
      title,
      price,
      imageUrl,
      description,
      userId,
    });
    return createdProduct;
  }
}

module.exports = ProductService;
