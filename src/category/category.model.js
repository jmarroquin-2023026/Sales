import { Schema,model } from "mongoose";

const categorySchema=Schema(
    {
        name:{
            type:String,
            unique:true,
            toLowerCase:true,
            required:true,
            maxLength:[25, `Can't be overcome 25 characters`]
        },
        description:{
            type:String,
            required:true,
            maxLength:[150, `Can't be overcome 150 characters`]
        }
    }
)


categorySchema.methods.toJSON = function(){
    const { __v, ...category } = this.toObject() //Sirve para convertir un documento de MongoDB a Objeto de JS
    return category
}

export default model('Category',categorySchema)