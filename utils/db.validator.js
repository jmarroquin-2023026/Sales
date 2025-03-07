
import mongoose from 'mongoose'
import { isValidObjectId } from "mongoose";
import User from '../src/users/user.model.js'
import Category from '../src/category/category.model.js'
import Product from '../src/product/product.model.js'

export const existUsername = async(username, user)=>{
    const alreadyUsername = await User.findOne({username})
    if(alreadyUsername && alreadyUsername._id != user.uid){
        console.error(`Username ${username} is already taken`)
        throw new Error(`Username ${username} is already taken`)
    }
}

export const existEmail = async(email, user)=>{
    const alreadyEmail = await User.findOne({email}) 
        if(alreadyEmail && alreadyEmail._id != user.uid){
        console.error(`Email ${email} is already taken`)
        throw new Error(`Email ${email} is already taken`)
    }
}

export const existCategory = async(name,category)=>{
    const alreadycategory = await Category.findOne({name})
    if(alreadycategory && alreadycategory._id != category.uid){
        console.error(`Username ${name} is already exist`)
        throw new Error(`Username ${name} is already exist`)
    }
}

export const existProduct = async(name, product)=>{
    const alreadyProduct = await Product.findOne({name})
    if(alreadyProduct && alreadyProduct._id != product._id){
        console.error(`Username ${name} is already exist`)
        throw new Error(`Username ${name} is already exist`)
    }
}

export const notRquiredField=(field)=>{
    if(field){
        throw new Error(`${field} is not required`)
    }
}

export const objectValid = (objectId) => {  
    if (!mongoose.Types.ObjectId.isValid(objectId)) {  
        console.error(`Invalid ObjectId: ${objectId}`)  
        return false  
    }  
    return true  
}




export const findUser=async(id)=>{
    try{
        const userExist=await User.findById(id)
        if(!userExist) return false
        return userExist
    }catch(e){
        console.error(e)
        return false
    }
}