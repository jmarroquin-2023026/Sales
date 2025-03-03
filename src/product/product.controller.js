import Product from './product.model.js'
import Category from '../category/category.model.js'
import { objectValid } from '../../utils/db.validator.js';


export const add = async (req, res) => {
    try {
        const { category, ...data } = req.body
        const category2 = await Category.findById(category)
        if (!category2) {
            return res.status(404).send({
                success: false,
                message: 'Category not found'
            })
        }
        const product = new Product({ ...data, category: category2._id })
        await product.save();
        return res.status(200).send(
            {
                success: true,
                message: 'Product saved successfully',
                product
            }
        )
    } catch (e) {
        console.error(e);
        return res.status(500).send({ message: 'Error saving product', e });
    }
}


export const list=async(req,res)=>{
    try{
        const product=await Product.find().populate('category', 'name description -_id')
        if(!product.length===0){
            return res.status(404).send(
                { 
                    sucess:false,
                    message:'Products not found'
                }
            )
        }
        return res.status(200).send(
            {
                sucess:true,
                message:'Products found', 
                product
            }
        )
    }catch(e){
        console.error(e)
        return res.status(500).send({message: 'Internal server errror',e})
    }
}

export const getByCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { limit = 10, skip = 0 } = req.query
        const products = await Product.find({ category: id })
            .populate('category', 'name description -_id')
            .skip(skip)
            .limit(limit)
            console.log('Searching for products in category:', id);

        if (!products.length) {
            return res.status(404).send({
                success: false,
                message: 'No products found for this category'
            })
        }

        return res.status(200).send({
            success: true,
            message: 'Products found',
            products
        })
    } catch (e) {
        console.error(e)
        return res.status(500).send({ message: 'Internal server error', e })
    }
};

export const update = async (req, res) => {  
    try {  
        const { id } = req.params  
        const { ...data } = req.body  
        if (!objectValid(id)) {  
            return res.status(400).send({  
                success: false,  
                message: 'Invalid product ID'  
            })  
        }  
        if (data.category) {  
            let category  
            if (objectValid(data.category)) {  
                category = await Category.findById(data.category)  
            } else {  
                category = await Category.findOne({ name: data.category })  
            }  

            if (!category) {  
                return res.status(404).send({  
                    success: false,  
                    message: `Category not found`  
                })  
            }  
            data.category = category._id  
        }  
        const product = await Product.findByIdAndUpdate(id, data, { new: true })  
        if (!product) {  
            return res.status(404).send({  
                success: false,  
                message: 'Product not found'  
            })  
        }  

        res.status(200).send({  
            success: true,  
            message: 'Product updated successfully',  
            product  
        })  
    } catch (e) {  
        console.error(e)  
        return res.status(500).send({  
            success: false,  
            message: 'Error updating product',  
            error: e  
        })  
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


export const listOutOfStock = async(req,res)=>{
    try {
        const soldOut = await Product.find({stock:0}).populate('category','name description -_id');
        if (!soldOut.length) {
            return res.status(404).send(
                { 
                    success: false, 
                    message: 'Out of stock products not found'
                }
            )
        }
        return res.status(200).send(
            { 
                success: true, 
                message: 'Out of stock products found', 
                soldOut 
            }
        )
    } catch(e){
        console.error(e)
        return res.status(500).send({ message:'Internal server error',e})
    }
}


export const listTopSelling = async (req, res) => {
    try {
        const topSellingProducts = await Product.find()
            .sort({ sold:-1})
            .limit(10)
            .populate('category', 'name description -_id')

        if (!topSellingProducts.length) {
            return res.status(404).send(
                { 
                    success: false, 
                    message: 'No top selling products found' 
                }
            )
        }
        return res.status(200).send(
            { 
                success: true, 
                message: 'Top selling products found', 
                topSellingProducts 
            }
        )
    } catch (e) {
        console.error(e)
        return res.status(500).send({ message: 'Internal server error', e })
    }
};