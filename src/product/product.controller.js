import Product from './product.model.js'
import Category from '../category/category.model.js'
import { objectValid } from '../../utils/db.validator.js';


export const add=async(req,res)=>{
    try{
        const {category, ...data}=req.body;
        const category2 = await Category.findById(category);
        if(!category2){
            return res.status(404).send(
                {
                    sucess:false,
                    message:'Category not found'
                }
            );
        }
        const product=new Product({...data,category:category._id})
        await product.save()
        return res.status(200).send(
            {
                sucess:true,
                message:'Product saved successfully', 
                product
            }
        )
    }catch(e){
        console.error(e)
        return res.status(500).send({message: 'Error saving product', e})
    }
}

export const list=async(req,res)=>{
    try{
        const product=await Product.find()
        if(!product.lenght==0){
            return res.status(200).send(
                {
                    sucess:true,
                    message:'Products found', product
                }
            )
        }
        return res.status(404).send(
            {
                sucess:false,
                message:'Products not found'
            }
        )
    }catch(e){
        console.error(e)
        return res.status(500).send({message: 'Internal server errror',e})
    }
}

export const getById=async(req,res)=>{
    const { limit, skip} = req.query;
    try{
        const {id}=req.params
        const product=await Product.findById(id).populate(
            {
                path:'category',
                select: 'name description-_id'
            }
        )
        .skip(skip)
        .limit(limit)
        if(!product){
            return res.status(404).send(
                {
                    sucess:false,
                    message:'Product not found'
                }
            )
        }
        return res.status(200).send(
            {
                sucess:true,
                message:'Product found',
                product
            }
        )
    }catch(e){
        console.error(e)
        return res.status(500).send({message: 'Internal server error',e})
    }
}

export const update = async(req,res)=>{
    const {id}=req.params
    const {...data}=req.body
    try{
        if(!objectValid(id)){
            return res.status(400).send({msg:'Id is not available'})
        }
        if(data.category && objectValid(data.category)){
            const category=await Category.findOne({name:data.category})

            if(!category){
                return res.status(404).send({
                    sucess:false,
                    message:'Category not found'
                })
            }
            data.category=category._id
        }
        const product=await Product.findByIdAndUpdate(id,data,{new:true})
        if (!product) {
            return res.status(404).send(
                {
                    sucess:false,
                    message:'Product not found'
                }
            )
        }
        res.status(200).send(
            {
                sucess:true,
                message:'Product updated successfully',
                product
            }
        )
    }catch(e){
        console.error(e)
        return res.status(500).send({message:'Error updating product',e})
    }
}

export const deleteP=async(req,res)=>{
    try{
        const {id}=req.params
        const deletedProduct=await Product.findByIdAndDelete(id)
        if(!deletedProduct) return res.status(404).send({message:'Product not found'})
            return res.send({message:'Product deleted sucessfully',deletedProduct})
    }catch(e){
        console.error(e)
        return res.status(500).send({ message: 'General Error', e});
    }
}