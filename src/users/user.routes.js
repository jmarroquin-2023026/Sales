import { Router } from "express";
import {isAdmin,isClient, validateJwt } from "../../middlewares/validate.jwt.js";
import { registerVAlidator, updateRoleValidator, updateUserValidator } from "../../middlewares/validator.js";
import { add, deleteUser, get, listUsers, login, update, updatePassword, updateRol } from "./user.controller.js";
const api=Router()

api.post('/addUser',registerVAlidator,add)
api.post('/login',login)
api.get('/getUsers',validateJwt,listUsers)
api.get('/getUser/:id',get)
api.put('/update',validateJwt,updateUserValidator,[isClient||isAdmin],update)
api.put('/updatePassword',validateJwt,[isClient||isAdmin],updatePassword)
api.put('/updateRol',validateJwt,isClient,updateRoleValidator,updateRol)
api.delete('/deleteUser',validateJwt,isClient,deleteUser)

export default api

