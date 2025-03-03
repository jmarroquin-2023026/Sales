import { Router } from "express";
import { addOrder, list } from "./shoppingCart.controller.js";
import { isClient, validateJwt } from "../../middlewares/validate.jwt.js";

const api=Router()

api.post('/shop',validateJwt,isClient,addOrder)
api.get('/getShopCart',validateJwt,list)

export default api