//Validar campos en las rutas
import { body } from "express-validator";
import { validateErrors, validateErrorsWithoutFile } from "./validated.errors.js";
import { existUsername,existEmail, notRquiredField, existCategory, existProduct, objectValid } from "../utils/db.validator.js";
import { isValidObjectId } from "mongoose";

//Areglo de validaciones (por cada ruta)
export const registerVAlidator=[
    body('name','Name cannot be empty').notEmpty(),
    body('surname','Surname cannot be empty').notEmpty(),
    body('username','Username cannot be empty').notEmpty().toLowerCase().custom(existUsername),
    body('email','Email cannot be empty').notEmpty().isEmail().custom(existEmail),
    body('password','Password cannot be empty').notEmpty().isStrongPassword().withMessage('Password must be strong').isLength({min:8}),
    validateErrors

]

export const categoryValidator=[
    body('name','Name cannot be empty').notEmpty().custom(existCategory),
    validateErrors
]

export const updateUserValidator =[
    body('username')
        .optional()
        .notEmpty()
        .toLowerCase()
        .custom((username,{req})=>existUsername(username,req.user)),
    body('email')
        .optional()
        .notEmpty()
        .isEmail()
        .custom((email, {req})=>existEmail(email, req.user)),
    body('password')
        .optional()
        .notEmpty()
        .custom(notRquiredField),
    body('role')
    .optional()
        .optional()
        .notEmpty()
        .custom(notRquiredField),
    validateErrorsWithoutFile //Luego se modificara
]


export const updateRoleValidator =[
    body('name')
        .optional()
        .notEmpty()
        .toLowerCase()
        .custom(notRquiredField), 
    body('surname')
        .optional()
        .notEmpty()
        .toLowerCase()
        .custom(notRquiredField),
    body('username')
        .optional()
        .notEmpty()
        .toLowerCase()
        .custom(notRquiredField),
    body('email')
        .optional()
        .notEmpty()
        .isEmail()
        .custom(notRquiredField),
    body('password')
        .optional()
        .notEmpty()
        .custom(notRquiredField),
    body('role')
    .optional()
        .notEmpty()
        .custom(),
    validateErrorsWithoutFile //Luego se modificara
]

export const productValidator=[
    body('name','Name cannot be empty').notEmpty().toLowerCase().custom(existProduct),
    body('description','Description cannot be empty').notEmpty(),
    body('price','Price cannot be empty').notEmpty(),
    body('stock','Stock cannot be empty').notEmpty(),
    body('category','Category cannot be empty').notEmpty(),
    validateErrors
]

export const updateProduct=[
    body('name').optional().notEmpty().toLowerCase().custom((name,{req})=>existProduct(name,{_id:req.params.id})),
    validateErrorsWithoutFile
]