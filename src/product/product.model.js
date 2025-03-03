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
            maxLength:[250,`Can't be overcome 250 characters`],
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
        sold:{
            type:Number,
            required:false
        },
        category:{
            type:Schema.Types.ObjectId,
            ref:'Category',
            required:true
        }
        
    }
)

export default model('Product',producSchema)