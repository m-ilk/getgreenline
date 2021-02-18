const express = require("express");
const bodyParser = require('body-parser');

const companyRoute = require('./routes/company');
const customerRoute = require('./routes/customer');
const productRoute = require('./routes/product');
const saletRoute = require('./routes/sale');
const saleItemRoute = require('./routes/saleItem');

const app = express();

app.use(bodyParser.json());

app.use('/companies',companyRoute);
app.use('/customers',customerRoute);
app.use('/products',productRoute);
app.use('/sales',saletRoute);
app.use('/saleItems',saleItemRoute);

app.get('/', (req, res) => {
  return res.send('Received a GET HTTP method');
});



module.exports = app;