import { Router } from "express";
import { isAdmin, isAdminOrClient, validateJwt } from "../../middlewares/validate.jwt.js";
import { add, deleteC, findById, list, update } from "./category.controller.js";
import { categoryValidator } from "../../middlewares/validator.js";

const api=Router()

api.post('/addCategory',validateJwt,categoryValidator,isAdmin,add)
api.get('/listCategories',validateJwt,isAdminOrClient,list)
api.get('/getCategory/:id',validateJwt,isAdminOrClient,findById)
api.put('/updateCategory/:id',validateJwt,isAdmin,update)
api.delete('/deleteCategory/:id',validateJwt,isAdmin,deleteC)

export default api