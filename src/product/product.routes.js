import { Router } from "express";
import { add, getById, list, update } from "./product.controller.js";
import { isAdmin } from "../../middlewares/validate.jwt";


const api=Router()

api.post('/addProduct',isAdmin,add)
api.get('/list',list)
api.get('/getById/:id',getById)
api.get('/updateProduct/:id',update,isAdmin)