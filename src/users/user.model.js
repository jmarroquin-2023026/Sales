import { Schema,model } from "mongoose";

export const userSchema=Schema(
    {
        name:{
            type:String,
            required:[true,'Name is required'],
            maxLength:[25, `Can't overcome 25 characters`]
        },
        surname:{
            type:String,
            required:[true,'Surname is required'],
            maxLength:[25, `Can't overcome 25 characters`],
        },
        username:{
            type: String,
            required:true,
            unique:true,
            lowercase: true,
            maxLenght: [15, `Can't be  overcome 15 characters`]
        },
        email:{
            type:String,
            unique:true,
            required:[true,,'Email is required']
        },
        password:{
            type:String,
            required:[true,'Password is required'],
            minLength:[8, 'Password must be 8 characteres'],
            maxLength:[100,`Can't be overcome 16 characteres`]
        },
        role:{
            type:String,
            enum:['ADMIN','CLIENT'],
            uppercase:true,
        },
    }
)

userSchema.methods.toJSON = function(){
    const { __v, password, ...user } = this.toObject() //Sirve para convertir un documento de MongoDB a Objeto de JS
    return user
}

export default model('User', userSchema)