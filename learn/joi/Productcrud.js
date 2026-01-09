import joi from "joi";

const productCreateSchema = joi
  .object({
    name: joi.string().min(3).max(100).required(),
    price: joi.number().positive().required(),
    discount: joi
      .number()
      .min(0)
      .max(joi.ref("price"))
      .messages({ "number.max": "discount must be less than price" }),
    tags: joi.array().items(joi.string()).unique().max(5),
  })
  .unknown(false);

const data = {
  name: "Gaming Mouse",
  price: 50,
  discount: 60,
  tags: ["electronics", "pc"],
};

const { error, value } = productCreateSchema.validate(data);
console.log(error);
console.log(value);
