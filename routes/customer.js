const express = require('express');
const CustomerController = require('../controllers/CustomerController');

const route = express.Router();
let {
    index,
    store,
    show,
    update,
    destroy
} = CustomerController
route.get('/',index);
route.post('/',store);
route.get('/:id',show);
route.put('/:id',update);
route.delete('/:id',destroy);

module.exports= route;