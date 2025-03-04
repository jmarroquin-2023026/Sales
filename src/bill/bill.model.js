import { Schema, model } from "mongoose";

const billSchema = new Schema(
    {
        date: {
            type: Date,
            default: Date.now
        },
        NIT: {
            type: String,
            maxLength: [9, "Can't be more than 9 characters"]
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        purchase: {
            type: Schema.Types.ObjectId,
            ref: 'ShoppingCart',
            required: true
        },
        products:[{
                product: { 
                    type: Schema.Types.ObjectId, 
                    ref:'Product', 
                    name: String,
                    price: Number,
                    quantity: Number
                }
            }],
        total: {
            type:Number
        },
        status: {
            type: Boolean,
            default: true
        }
    }
)

export default model('Bill', billSchema);
