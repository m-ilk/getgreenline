const express = require('express');
const ProductController = require('../controllers/ProductController');

const route = express.Router();
let {
    index,
    store,
    show,
    update,
    destroy
} = ProductController
route.get('/',index);
route.post('/',store);
route.get('/:id',show);
route.put('/:id',update);
route.delete('/:id',destroy);

module.exports= route;