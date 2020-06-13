'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const PORT= process.env.PORT||3000;
const app = express();
const error404 = require('./middleware/404.js');
const error500 = require('./middleware/500.js');
const Route = require('./auth/router.js');  
const anotherRoute = require('./auth/another-routes.js');
const apiRoute = require('../routes/api.js');  
const E404 = require('../middleware/404.js');
const E500 = require('../middleware/500.js');

app.use(express.json());
app.use(anotherRoute);
app.use(cors());
app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(Route);  
app.use(error404);
app.use(error500);
app.use('/api/v1', apiRoute); 
app.use(E404);
app.use(E500);

module.exports = {
  server: app,
  start: () => {
    app.listen(PORT, () => console.log(`Server is lestining on PORT ${PORT}`));
  },
};

