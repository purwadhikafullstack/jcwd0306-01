/* eslint-disable no-console */

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}.local` });
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const cors = require('cors');
const express = require('express');
const bearerToken = require('express-bearer-token');
const { createClient } = require('redis');
const { Server } = require('socket.io');
const http = require('http');
const {
  cartRouter,
  categoryRouter,
  productRouter,
  userRouter,
  carouselRouter,
  userAddressRouter,
  provinceRouter,
  cityRouter,
  orderRouter,
  warehouseRouter,
  warehouseUserRouter,
} = require('./routes');

const PORT = process.env.PORT || 8000;
const app = express();

app.use(
  cors({
    // origin: [
    //   process.env.WHITELISTED_DOMAIN &&
    //     process.env.WHITELISTED_DOMAIN.split(","),
    // ],
  })
);

app.use(express.json());
app.use(bearerToken());

// #region API ROUTES

// ===========================
// NOTE : Add your routes here
app.use('/carousels', carouselRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);
app.use('/order', orderRouter);
app.use('/warehouses', warehouseRouter);
app.use('/warehouseusers', warehouseUserRouter);
app.use('/cart', cartRouter);
app.use('/user_address', userAddressRouter);
app.use('/user', userRouter);
app.use('/province', provinceRouter);
app.use('/city', cityRouter);

const server = http.createServer(app);
const io = new Server(server);
global.io = io;

const client = createClient();
client.connect();
global.client = client;

app.get('/', (req, res) => {
  res.send('Hello, this is my API');
});

app.get('/greetings', (req, res) => {
  res.status(200).json({
    message: 'Hello, Student !',
  });
});

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes('/api/')) {
    res.status(404).send('Not found !');
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes('/api/')) {
    console.error('Error : ', err.stack);
    res.status(500).send('Error !');
  } else {
    next();
  }
});

// #endregion

io.on('connection', (socket) => {
  console.log('a user is connected');
});

server.listen(PORT, (err) => {
  client.on('error', () => {
    console.log(`REDIS client error`);
  });
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} 🚀`);
  }
});
