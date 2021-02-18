const models = require('../models');
const Validator = require('fastest-validator');
const sequelize = require('sequelize');
module.exports ={
    index : async (req,res)=>{
        try {
            let sales = await models.Sale.findAll({
                include: models.SaleItem
            });
            res.status(200).json(sales);
        } catch (error) {
            res.status(400).json({
                message:`something went wrong: ${error}`
            });
        }
    },

    /**
     * not checking duplicate saleitem
     * @param {*} req 
     * @param {*} res 
     */
    store : async (req,res)=>{
        try {
            //validation 
            const schema = {
                company_id: {type:'number', integer: true },
                customer_id:{type:'number', integer: true },
                products:{
                    type:'array',
                    items:{
                        type: "object", props: {
                            id: { type: "number", integer: true },
                            amount: { type: "number", positive: false,integer:true }
                        }
                    }
                }
            };
            const v = new Validator();
            const validationResponse = v.validate(req.body,schema);
            if (validationResponse!==true) {
                throw new Error(`Validation failed: ${validationResponse[0].message}`);
            }
            let {customer_id,company_id,products} = req.body;

            //check company exist 
            let count = await models.Company.count({ where: {id:company_id} })
            if (count===0) throw new Error(`company with id: ${company_id} does not exist in database`)
            
            //check customer exist in the company
            let customer = await models.Customer.findByPk(customer_id);
        
            if (!customer) {
                throw new Error(` customer with id:${customer_id} does not exist`)
            }
            if (customer.company_id!==company_id) {
                throw new Error(`this customer does not belong to this company`)
            }

            //check product exist in the company
            await Promise.all(products.map(async (product_obj) => {
                let product = await models.Product.findByPk(product_obj.id);
                if (!product) {
                    throw new Error(`product with id :${product_obj.id} does not exist`);
                }
                if (product.company_id!==company_id) {
                    throw new Error(`product with id :${product_obj.id} does not belong to this company`);
                }
            }));
            
            let result = await models.sequelize.transaction(async (t) => {
                let sale = await models.Sale.create({
                    company_id,
                    customer_id
                },{ transaction: t })

                await Promise.all(products.map(async (product_obj) => {
                    await models.SaleItem.create({
                        product_id:product_obj.id,
                        amount:product_obj.amount,
                        sale_id:sale.id
                    },{ transaction: t })
                }));
                return sale;
            })
            res.status(200).json({
                message:'a new sale created successfully',
                sale : result
            });
        } catch (error) {
            res.status(400).json({
                message:`something went wrong: ${error}`
            });
        }
    },

    show : async (req,res)=>{
        try {
            const id = req.params.id;
            //check sale exist
            let sale = await models.Sale.findByPk(id,{
                include: models.SaleItem
            });
            if (!sale) throw new Error(`can not find sale with id ${id}`)
            
            res.status(200).json(sale);
        } catch (error) {
            res.status(400).json({
                message:`something went wrong: ${error}`
            });
        }
    },

    destroy : async(req,res) => {
        try {
            let id = req.params.id;
            //check sale exist
            let sale = await models.Sale.findByPk(id);
            if (!sale) throw new Error(`can not find sale with id ${id}`)
            
            let result = await models.Sale.destroy({where:{id}});
            res.status(200).json({
                message:' sale deleted successfully',
                sale : result
            });
        } catch (error) {
            res.status(400).json({
                message:`something went wrong: ${error}`
            });
        }
    }
}