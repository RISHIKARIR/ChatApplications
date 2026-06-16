import Joi from "joi";


const createUser = Joi.object({
    name : Joi.string().min(1).required().messages({
        "string.empty" : "Name is required",
        "string.min" : "Name must be of atleast one character",
    }),
    email : Joi.string().min(1).email().required().messages({
        "string.empty" : "Email is Required",
        "string.email" : "Enter a Valid Email"
    }),
    password : Joi.string().min(8).max(20).required().pattern(/^[A-Z][a-zA-Z0-9._-%+]*@/).messages({
        "string.empty" : "Password cannot be empty",
        "string.min" : "Minimum length is 8 required",
        "string.max" : "Maximum length can be 20" 
    })
            


}).required()