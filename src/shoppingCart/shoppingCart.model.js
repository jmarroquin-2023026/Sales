import { Schema,model } from "mongoose";

const shoppingCartSchema=Schema(
    {
        user:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        products:[{
            product:{ 
                type:Schema.Types.ObjectId,
                ref:'Product',
                required:[true,'Products are required']
            },
            quantity:{
                type:Number,
                required:true,
                min:1
            }
        }],
        total:{
            type:Number,
            required:true
        }
    }
)

export default model('ShoppingCart',shoppingCartSchema)