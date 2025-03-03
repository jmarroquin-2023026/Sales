import { Router } from "express";
import { add, deleteP, getByCategory, list, listOutOfStock, listTopSelling, update } from "./product.controller.js";
import { isAdmin, isAdminOrClient, validateJwt } from "../../middlewares/validate.jwt.js";
import { productValidator, updateProduct } from "../../middlewares/validator.js";


const api=Router()

api.post('/addProduct',validateJwt,productValidator,isAdmin,add) 
api.get('/list',list)
api.get('/getByCategory/:id',validateJwt,isAdminOrClient,getByCategory)
api.get('/getSoldOut',validateJwt,isAdmin,listOutOfStock)
api.get('/getTopSelling',validateJwt,isAdminOrClient,listTopSelling)
api.put('/updateProduct/:id',validateJwt,updateProduct,isAdmin,update)
api.delete('/deleteProduct/:id',validateJwt,isAdmin,deleteP)

export default api