const express = require('express');
const CompanyController = require('../controllers/CompanyController');

const route = express.Router();
let {
    index,
    store,
    show,
    update,
    destroy
} = CompanyController
route.get('/',index);
route.post('/',store);
route.get('/:id',show);
route.put('/:id',update);
route.delete('/:id',destroy);

module.exports= route;