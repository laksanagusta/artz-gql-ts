import Joi from "joi";

const transactionCreateSchema = Joi.object({
    complaint: Joi.string().required(),
    diagnosis: Joi.string().required(),
    symptom: Joi.string().required(),
    actions: Joi.string().required(),
    recipe: Joi.string().required(),
});

module.exports = {
    transactionCreateSchema
}