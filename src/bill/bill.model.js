import { Schema,model } from "mongoose";

const billSchema=Schema(
    {
        date:{
            type:Date,
            default:Date.now()
        },
        NIT:{
            type:String,
            maxLength:[9,`Can't be overcome 9 characters`]
        },
        user:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        purchase:{
            type:Schema.Types.ObjectId,
            ref:'ShoppingCart',
            required:true
        }
    }
)

export default model('Bill',billSchema)