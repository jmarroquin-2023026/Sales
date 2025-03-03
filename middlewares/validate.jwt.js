'use strict'

import jwt from 'jsonwebtoken'
import { findUser } from '../utils/db.validator.js'

export const validateJwt = async(req, res, next)=>{
    try{
        //Obtener la llave de acceso privada al Token
        let secretKey = process.env.SECRET_KEY
        //Obtener el token de los headers (cabeceras)
        let { authorization } = req.headers
        //Verificamos que venga el token
        if(!authorization) return res.status(401).send({message: 'Unauthorized'})
        let user = jwt.verify(authorization, secretKey)
        //Validar que el usuario exista
        const validateUser = await findUser(user.uid)
        if(!validateUser) return res.status(404).send(
            {
                success: false,
                message: 'User not found - unauthorized'
            }
        )
        //Inyectar en la solicitud un nuevo parámetro
        req.user = user
        //next() = todo salió bien por acá, que pase a la siguiente función
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Invalid credentials'})
    }
}

export const isAdmin=async(req,res,next)=>{
    try{
        const{user}=req
        if(!user || user.role!=='ADMIN') return res.status(403).send(
            {
                sucess:false,
                message:`You dont have access | username: ${user.username}`
            }
        )
        next()
    }catch(e){
        console.error
        return res.status(403).send(
            {
                success: false,
                message: 'Internal server error',
                e
            }
        )
    }
}

export const isClient=async(req,res,next)=>{
    try{
        const{user}=req
        if(!user || user.role!=='CLIENT') return res.status(403).send(
            {
                sucess:false,
                message:`You dont have access | username: ${user.username}`
            }
        )
        next()
    }catch(e){
        console.error
        return res.status(403).send(
            {
                success: false,
                message: 'Internal server error',
                e
            }
        )
    }
}

export const isAdminOrClient=async (req,res,next) =>{
    try {
        const {user} = req
        if (!user){
            return res.status(403).send({
                success: false,
                message: 'No user data found in request'
            })
        }
        if (user.role === 'ADMIN' || user.role === 'CLIENT') {
            return next()
        }
        return res.status(403).send({
            success: false,
            message: `Access denied for role: ${user.role}`
        });

    } catch (e) {
        console.error('Internal serverl Error', e);
        return res.status(500).send(
            {
                success: false,
                message: 'Internal server error',
                e
            }
        )
    }
}
