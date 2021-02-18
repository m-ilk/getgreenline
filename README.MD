# Prerequisites
- `npm 7.0.8^`
- `node v15.1.0`
- `mysql 8.0.20^`
 
# Installation
1. `cd` to project root directory
2. run `npm install -g sequelize-cli` 
3. add `config/config.json` file for connecting to databse.(see `config/config.json.example` file)
4. run `sequelize db:migrate` for mysql database migration
5. run `npm start` to start the server
 
# Usage

- All the concepts(Company,Product,...etc) are implemented based on CRUD operation 
 `GET /` for listing all the records
 `POST /` for creating/storing a new record
 `PUT /:id` for updating record based on record `id`
 `DELETE /:id` for deleting/destorying a record
 `GET /:id` for getting one single record
- `Express` is using `bodyParser.json()` as middleware, all the requests body should be sent as a `JSON` object

This is an API server for 4 different concepts:

**Company** : `/companies`:
- `name` field is unique

**Customer** :`/customers`:
- `name` : allow customer with same name in one company
- `comapany_id` :

**Product** :`/products`:
- `name` : product name is unique for within any given company
- `comapany_id` : 
 
**Sale** :`/sales`:
for any sale, its customer and products must belong to its company id
when creating a sale, the system is not checking duplicate saleitem with same product id
sale can not be updated, only its saleitems can be updated
- `customer_id` : 
- `comapany_id` :

**SaleItem** :`/saleItems`:
sale item controller does not have index,
every sale can have 0 to many saleItems
- `sale_id` :
- `product_id` :
- `amount` : must > 0
