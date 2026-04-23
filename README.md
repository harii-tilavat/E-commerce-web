# E-commerce Assignment

Node.js + Express e-commerce app with product catalog, cart, and orders. Uses MongoDB for products/cart and MySQL (Sequelize) for users/orders.

## Tech Stack

- Node.js / Express
- EJS view engine
- MongoDB (Mongoose) — products, cart items
- MySQL (Sequelize) — users, orders, order items

## Project Structure

```
app.js              # entry point
controllers/        # admin, shop, error
routes/             # admin, shop
models/
  mongo/            # product, cart-item
  sql/              # user, order, order-item
services/           # business logic
util/               # database, path helpers
views/              # EJS templates
public/             # static assets
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure DB credentials in `util/database.js` (MongoDB URI + MySQL host/user/password/database).
3. Ensure MySQL has database `e_commerce` created.

## Run

```bash
npm start            # nodemon (dev)
npm run start-server # plain node
```

Server: http://localhost:3000

## Routes

**Shop**
- `GET /` — home
- `GET /products` — list
- `GET /products/:productId` — detail
- `GET /cart` — view cart
- `POST /cart` — add to cart
- `POST /cart/increment` — qty +1
- `POST /cart/decrement` — qty -1
- `POST /cart-delete-item` — remove item
- `GET /orders` — order history
- `POST /create-order` — checkout

**Admin**
- `GET /admin/add-product`
- `POST /admin/add-product`
- `GET /admin/products`
- `GET /admin/edit-product/:productId`
- `POST /admin/edit-product`
- `POST /admin/delete-product`
