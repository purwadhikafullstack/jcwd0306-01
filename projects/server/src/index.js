/* eslint-disable no-console */
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '..', `.env.${process.env.NODE_ENV}`),
});
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const cors = require('cors');
const express = require('express');
const bearerToken = require('express-bearer-token');
const { Server } = require('socket.io');
const http = require('http');
const { createClient } = require('redis');

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
  chatRouter,
  stockMutationRouter,
  salesReportRouter,
  productHistoryRouter,
} = require('./routes');
const { cronDeleteUnpaid, testCron } = require('./utils/cron');

const PORT = process.env.PORT || 8000;
const app = express();

cronDeleteUnpaid();
// testCron();

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
app.use('/warehouses', warehouseRouter);
app.use('/warehouseusers', warehouseUserRouter);
app.use('/stockmutations', stockMutationRouter);
app.use('/order', orderRouter);
app.use('/cart', cartRouter);
app.use('/user_address', userAddressRouter);
app.use('/user', userRouter);
app.use('/province', provinceRouter);
app.use('/city', cityRouter);
app.use('/chat', chatRouter);
app.use('/sales-reports', salesReportRouter);
app.use('/product-history', productHistoryRouter);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
global.io = io;
const client = createClient({
  url: 'redis://localhost:6379',
  legacyMode: true,
});
client.connect();

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

server.listen(PORT, async (err) => {
  client.on('error', (error) =>
    console.log(
      error.code === 'ECONNREFUSED' ? 'Nyalain Redis oi' : `Redis${error.code}`
    )
  );
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} 🚀`);
  }
});
