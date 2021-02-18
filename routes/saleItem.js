const express = require('express');
const SaleItemController = require('../controllers/SaleItemController');

const route = express.Router();
let {
    store,
    show,
    update,
    destroy
} = SaleItemController
route.post('/',store);
route.get('/:id',show);
route.put('/:id',update);
route.delete('/:id',destroy);

module.exports= route;