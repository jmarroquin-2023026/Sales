import argon  from 'argon2'
import { checkPassword, encrypt } from '../../utils/encryp.js'
import { generateJwt } from '../../utils/jwt.js'
import User from './user.model.js'

//Registrar
export const add = async(req,res)=>{
    try{
        const data=req.body
        const user = new User(data)
        user.password=await encrypt(user.password)
        user.role='CLIENT'
        await user.save()
        return res.status(200).send(
            { 
            message: `Registered successfully, can be logged with username: ${user.username}`,
            user
            })
    }catch(e){
        console.error(e)
        return res.status(500).send({message:'General error with user registration',e})
    }
}



//Login
export const login = async(req, res)=>{
    try{
        let { userLoggin, password } = req.body
        let user = await User.findOne(
            {
                $or: [ 
                    {email: userLoggin},
                    {username: userLoggin}
                ]
            }
        ) 
        console.log(user)
        if(user && await checkPassword(user.password, password)){
            //Generar el token
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    message: `Welcome ${user.name}`,
                    loggedUser,
                    token
                }
            )
        }
        return res.status(400).send({message: 'Invalid credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'General error with login function', err})
    }
}

export const listUsers = async(req,res)=>{
    try{
        //Configuraciones de paginacion
        const {limit = 20,skip=0}= req.query
        //Consultar
        const users=await User.find()
            .skip(skip)
            .limit(limit)

        if(users.length===0){
            return res.status(404).send(
                {
                    succes:false,
                    message: 'Users not found'

                })
        }
            return res.send(
                {   
                    succes:true,
                    message: 'Users found:', users, 
                    users
                })
    }catch(e){
        console.error(e)
        return res.status(500).send({message: 'General error',e})
    }
}

//Buscar usuario
export const get = async(req, res)=>{
    try {
        let { id } = req.params
        let user = await User.findById(id)
        if(!user) return res.status(404).send(
            {
                success: false,
                message: 'User not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'User found: ', 
                user
            }
        )
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error', 
                err
            }
        )
    }
}

//Actualizar rol
export const updateRol = async(req, res)=>{
    try{
        const { id } = req.params
        const {rol} = req.body
        const validRoles = ["CLIENT", "ADMIN"];
        if (!validRoles.includes(rol)) {
            return res.status(400).send({
                success: false,
                message: "Invalid role. Allowed roles: CLIENT, ADMIN"
            });
        }
        const update = await User.findByIdAndUpdate(
            id,
            {
              role:rol  
            },
            {new: true}
        )

        if(!update) return res.status(404).send(
            {
                success: false,
                message: 'User not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'User updated',
                user: update
            }
        )
    }catch(err){
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error', 
                err
            }
        )
    }
}

//Actualizar contraseña
export const updatePassword = async (req, res) => {
    try {
        let { id } = req.params;
        let { newPassword, oldPassword } = req.body;
        let user = await User.findById(id);
        if (!user) return res.status(404).send({ message: 'User not found' });
        if (!user.password) {
            return res.status(500).send({ message: 'Password not found in user data' });
        }
        let compare = await argon.verify(user.password, oldPassword);
        if (!compare) return res.status(400).send({ message: 'Incorrect Password' });
        user.password = await encrypt(newPassword);
        await user.save();
        return res.send({ message: 'Password updated successfully' });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ message: 'Internal Server Error', error: e.message });
    }
};

//Actualizar datos generales
export const update = async(req, res)=>{
    try{
        const { id } = req.params

        const data = req.body

        const update = await User.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )

        if(!update) return res.status(404).send(
            {
                success: false,
                message: 'User not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'User updated',
                user: update
            }
        )
    }catch(err){
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error', 
                err
            }
        )
    }
}



export const deleteUser = async(req,res)=>{
    try{
        let {id}=req.params
        let deltedUser=await User.findByIdAndDelete(id)
        if(!deltedUser) return res.status(404).send({message: 'User not found'})
            return res.send({message: 'User deleted succesfully', deltedUser})
    }catch(e){
        console.error(e)
        return res.status(500).send({message: 'General error',e})   
    }
}