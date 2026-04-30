import Product from '../models/mongo/product.js';
import CommanService from './comman.service.js';

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
}

export default ProductService;
