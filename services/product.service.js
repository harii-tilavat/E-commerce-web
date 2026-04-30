const Product = require('../models/mongo/product');
const CommanService = require('./comman.service');
const socketService = require('./socket.service');

const productEvents = {
  productCreated: 'product:created',
  productDeleted: 'product:deleted',
};
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

    socketService.emitToAdmins(productEvents.productCreated, createdProduct);
    return createdProduct;
  }

  async getAllProducts(options) {
    const { limit, offset } = CommanService.getPagination(options);

    const [products, total_count] = await Promise.all([
      Product.find().limit(limit).skip(offset),
      Product.countDocuments(),
    ]);

    return {
      total_count,
      limit,
      offset,
      products,
    };
  }

  async getUsersProducts(userId, options) {
    const { limit, offset } = CommanService.getPagination(options);

    const [products, total_count] = await Promise.all([
      Product.find({ userId }).limit(limit).skip(offset),
      Product.countDocuments({ userId }),
    ]);

    return {
      total_count,
      limit,
      offset,
      products,
    };
  }

  async deleteProduct(productId, userId) {
    const result = await Product.deleteOne({ _id: productId, userId });
    if (result.deletedCount === 0) throw new ApiError(StatusCode.NOT_FOUND, 'Product not found');

    socketService.emitToAdmins(productEvents.productDeleted, { productId });
  }
}

module.exports = ProductService;
