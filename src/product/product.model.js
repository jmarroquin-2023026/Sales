import { Schema,model } from "mongoose";

export const producSchema=Schema(
    {
        name:{
            type:String,
            maxLength:[25, `Can't be overcome 25 characters`],
            required:true
        },
        description:{
            type:String,
            maxLength:[50,`Can't be overcome 50 characters`],
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        stock:{
            type:Number,
            required:true
        },
        category:{
            type:Schema.Types.ObjectId,
            ref:'category',
            required:true
        }
        
    }
)

export default model('Product',producSchema)