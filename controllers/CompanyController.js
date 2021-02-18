const models = require('../models');
const Validator = require('fastest-validator');
const sequelize = require('sequelize');
module.exports ={
    index : async (req,res)=>{
        try {
            let companies = await models.Company.findAll();
            res.status(200).json(companies);
        } catch (error) {
            res.status(400).json({
                message:`something went wrong: ${error}`
            });
        }
    },

    store : async (req,res)=>{
        try {
            //validation 
            const schema = {
                name: {type:'string',min:1,max:255}	
            };
            const v = new Validator();
            const validationResponse = v.validate(req.body,schema);
            if (validationResponse!==true) {
                throw new Error(`Validation failed: ${validationResponse[0].message}`);
            }

            //check company with the name already exist
            let count = await models.Company.count({ where: { name: req.body.name } })
            if (count>0) throw new Error(`company with name ${req.body.name} already exist in database`)

            const company = {
                name: req.body.name
            }
            let result = await models.Company.create(company)
            res.status(200).json({
                message:'a new company create successfully',
                company : result
            });
        } catch (error) {
            res.status(400).json({
                message:`something went wrong: ${error}`
            });
        }
    },

    show : async (req,res)=>{
        try {
            //check company exist
            const id = req.params.id;
            let company = await models.Company.findByPk(id);
            if (!company) throw new Error(`can not find company with id ${id}`)

            res.status(200).json(company);
        } catch (error) {
            res.status(400).json({
                message:`something went wrong: ${error}`
            });
        }
    },

    update : async ( req,res)=>{
        try {
            let id = req.params.id;
            let updateCompany = {
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

            //check company exist
            let company = await models.Company.findByPk(id);
            if (!company) throw new Error(`can not find company with id ${id}`)

            //check if other company is using this name 
            let count = await models.Company.count({ where: {
                name: req.body.name,
                id:{
                    [sequelize.Op.not]: id
                }
                }})
            if (count>0) throw new Error(`company with name ${req.body.name} is already exist`);
    
            let result = await models.Company.update(updateCompany,{where:{id}});
            res.status(200).json({
                message:' company updated successfully',
                company : result
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
            //check company exist
            let company = await models.Company.findByPk(id);
            if (!company) throw new Error(`can not find company with id ${id}`)
            
            let result = await models.Company.destroy({where:{id}});
            res.status(200).json({
                message:' company deleted successfully',
                company : result
            });
        } catch (error) {
            res.status(400).json({
                message:`something went wrong: ${error}`
            });
        }
    }
}