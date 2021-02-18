const models = require('../models');
const Validator = require('fastest-validator');
const sequelize = require('sequelize');
module.exports ={


    /**
     * not checking duplicate saleitem
     * @param {*} req 
     * @param {*} res 
     */
    store : async (req,res)=>{
        try {
            //validation 
            const schema = {
                sale_id: {type:'number', integer: true },
                product_id:{type:'number', integer: true },
                amount:{type:'number', integer: true ,positive:true}
            };
            const v = new Validator();
            const validationResponse = v.validate(req.body,schema);
            if (validationResponse!==true) {
                throw new Error(`Validation failed: ${validationResponse[0].message}`);
            }
            let {sale_id,product_id,amount} = req.body;

            //check product belongs to company 
            let product = await models.Product.findByPk(product_id);
            let sale = await models.Sale.findByPk(sale_id);
            if (!product) {
                throw new Error(`product with id: ${product_id} does not exist`);
            }
            if (!sale) {
                throw new Error(`sale with id: ${sale_id} does not exist`);
            }
            if (product.company_id!==sale.company_id){
                throw new Error(`sale and product does not belong to the same company`);
            } 
            
            //check product exist in the sale
            let count = await models.SaleItem.count({where:{sale_id,product_id}});
            if (count>0) {
                throw new Error(`this item already exist in the sale, please update the sale`);
            }
            
            let result = await models.SaleItem.create({
                sale_id,
                product_id,
                amount
            })


            res.status(200).json({
                message:'a new sale item created successfully',
                saleItem : result
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
            //check sale item exist
            let saleItem = await models.SaleItem.findByPk(id);
            if (!saleItem) throw new Error(`can not find sale item with id ${id}`)
            
            res.status(200).json(saleItem);
        } catch (error) {
            res.status(400).json({
                message:`something went wrong: ${error}`
            });
        }
    },

    /**
     * only amount can be changed
     * @param {*} req 
     * @param {*} res 
     */
    update : async ( req,res)=>{
        try {
            let id = req.params.id;
            let updateSaleItem = {
                amount:req.body.amount
            }
            //validation 
            const schema = {
                amount:{ type: "number", positive: false,integer:true }	
            };
            const v = new Validator();
            const validationResponse = v.validate(req.body,schema);
            if (validationResponse!==true) {
                throw new Error(`Validation failed: ${validationResponse[0].message}`);
            }

            //check product exist
            let saleItem = await models.SaleItem.findByPk(id);
            if (!saleItem) throw new Error(`can not find sale item with id ${id}`)
    
            let result = await models.SaleItem.update(updateSaleItem,{where:{id}});
            res.status(200).json({
                message:' sale item updated successfully',
                product : result
            });
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
            let saleItem = await models.SaleItem.findByPk(id);
            if (!saleItem) throw new Error(`can not find sale item with id ${id}`)
            
            let result = await models.SaleItem.destroy({where:{id}});
            res.status(200).json({
                message:' sale item deleted successfully',
                sale : result
            });
        } catch (error) {
            res.status(400).json({
                message:`something went wrong: ${error}`
            });
        }
    }

}