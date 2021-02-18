const models = require('../models');
const Validator = require('fastest-validator');
const sequelize = require('sequelize');
module.exports ={
    index : async (req,res)=>{
        try {
            let customers = await models.Customer.findAll();
            res.status(200).json(customers);
        } catch (error) {
            res.status(400).json({
                message:`something went wrong: ${error}`
            });
        }
    },

    /**
     * allow customers with same name exist in one company.
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

            let result = await models.Customer.create({name,company_id});
            res.status(200).json({
                message:'a new customer created successfully',
                customer : result
            });
        } catch (error) {
            res.status(400).json({
                message:`something went wrong: ${error}`
            });
        }
    },

    show : async (req,res)=>{
        try {
            //check customer exist
            const id = req.params.id;
            let customer = await models.Customer.findByPk(id);
            if (!customer) throw new Error(`can not find customer with id ${id}`)

            res.status(200).json(customer);
        } catch (error) {
            res.status(400).json({
                message:`something went wrong: ${error}`
            });
        }
    },

    /**
     * only allow customer name to be changed
     * @param {*} req 
     * @param {*} res 
     */
    update : async ( req,res)=>{
        try {
            let id = req.params.id;
            let updateCustomer = {
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

            //check customer exist
            let customer = await models.Customer.findByPk(id);
            if (!customer) throw new Error(`can not find company with id ${id}`)
    
            let result = await models.Customer.update(updateCustomer,{where:{id}});
            res.status(200).json({
                message:' customer updated successfully',
                customer : result
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
            //check customer exist
            let customer = await models.Customer.findByPk(id);
            if (!customer) throw new Error(`can not find company with id ${id}`)
            
            let result = await models.Customer.destroy({where:{id}});
            res.status(200).json({
                message:' customer deleted successfully',
                customer : result
            });
        } catch (error) {
            res.status(400).json({
                message:`something went wrong: ${error}`
            });
        }
    }
}