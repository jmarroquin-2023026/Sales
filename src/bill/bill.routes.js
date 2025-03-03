import { Router } from "express";
import { isClient, validateJwt } from "../../middlewares/validate.jwt.js";
import { addBill, getBillByUser } from "./bill.controller.js";

const api=Router()

api.post('/generateBill',validateJwt,isClient,addBill)
api.get('/viewBills',validateJwt,isClient,getBillByUser)

export default api
