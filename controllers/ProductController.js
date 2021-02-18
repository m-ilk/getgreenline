const models = require('../models');
const Validator = require('fastest-validator');
const sequelize = require('sequelize');
module.exports ={
    index : async (req,res)=>{
        try {
            let products = await models.Product.findAll();
            res.status(200).json(products);
        } catch (error) {
            res.status(400).json({
                message:`something went wrong: ${error}`
            });
        }
    },

    /**
     * within one company, product name must be unique.
     * @param {*} req 
     * @param {*} res 
     */
    store : async (req,res)=>{
        try {
            //validation 
            const schema = {
                name: {type:'string',min:1,max:255},
                company_id: {type:'number', integer: true }
            };
            const v = new Validator();
            const validationResponse = v.validate(req.body,schema);
            if (validationResponse!==true) {
                throw new Error(`Validation failed: ${validationResponse[0].message}`);
            }
            
            let {name,company_id} = req.body;

            //check company exist 
            let count = await models.Company.count({ where: {id:company_id} })
            if (count===0) throw new Error(`company with id: ${company_id} does not exist in database`)
            
            //check product name unique within the company
            let product_count = await models.Product.count({ where: {company_id,name} })
            if (product_count>0) throw new Error(`product with name: ${name} already exist in the company`)

            let result = await models.Product.create({name,company_id});
            res.status(200).json({
                message:'a new product created successfully',
                product : result
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
            //check product exist
            let product = await models.Product.findByPk(id);
            if (!product) throw new Error(`can not find product with id ${id}`)
            
            res.status(200).json(product);
        } catch (error) {
            res.status(400).json({
                message:`something went wrong: ${error}`
            });
        }
    },

    /**
     * only allow product name to be changed
     * @param {*} req 
     * @param {*} res 
     */
    update : async ( req,res)=>{
        try {
            let id = req.params.id;
            let updateProduct = {
                name:req.body.name
            }
            //validation 
            const schema = {
                name: {type:'string',min:3,max:255}	
            };
            const v = new Validator();
            const validationResponse = v.validate(req.body,schema);
            if (validationResponse!==true) {
                throw new Error(`Validation failed: ${validationResponse[0].message}`);
            }

            let name = req.body.name

            //check product exist
            let product = await models.Product.findByPk(id);
            if (!product) throw new Error(`can not find product with id ${id}`)

            let product_count = await models.Product.count({ where: {
                name,
                company_id:product.company_id,
                id:{
                    [sequelize.Op.not]: id
                }
            }})
            if (product_count>0) throw new Error(`product with name: ${name} already exist in the company`)

    
            let result = await models.Product.update(updateProduct,{where:{id}});
            res.status(200).json({
                message:' product updated successfully',
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
            //check product exist
            let product = await models.Product.findByPk(id);
            if (!product) throw new Error(`can not find company with id ${id}`)
            
            let result = await models.Product.destroy({where:{id}});
            res.status(200).json({
                message:' product deleted successfully',
                product : result
            });
        } catch (error) {
            res.status(400).json({
                message:`something went wrong: ${error}`
            });
        }
    }
}