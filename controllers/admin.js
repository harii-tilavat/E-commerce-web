const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: req.user._id,
  });
  await product.save();
  res.redirect('/');
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = Boolean(req.query.edit);
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  const product = await Product.findById(prodId);
  if (!product) {
    return res.redirect('/');
  }
  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode,
    product: product,
  });
};

exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedProduct = {
    title: req.body.title,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
  };
  await Product.findByIdAndUpdate(prodId, updatedProduct);
  res.redirect('/admin/products');
};

exports.getProducts = async (req, res, next) => {
  const products = await Product.find();
  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products',
  });
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  await Product.deleteById(prodId);
  res.redirect('/admin/products');
};
