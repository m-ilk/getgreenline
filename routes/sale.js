const express = require('express');
const SaleController = require('../controllers/SaleController');

const route = express.Router();
let {
    index,
    store,
    show,
    destroy
} = SaleController
route.get('/',index);
route.post('/',store);
route.get('/:id',show);
route.delete('/:id',destroy);

module.exports= route;