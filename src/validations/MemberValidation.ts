import Joi from "joi";

const memberCreateSchema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().min(1).max(300).required(),
    address: Joi.string().required(),
    phone_number: Joi.string().regex(/^[0-9]{10}$/).length(12).required()
});

export default memberCreateSchema
