import joi from "joi";

const validationAttempt = joi.attempt(
  {
    name: "Hardik",
    number: 1234567890,
  },
  joi.object({
    name: joi.string().required(),
    number: joi.number().required(),
  })
);

console.log(validationAttempt);

const validationAsserts = joi.assert(
  {
    name: "Hardik",
    number: 1234567890,
  },
  joi.object({
    name: joi.string().required(),
    number: joi.number().required(),
  })
);

console.log(validationAsserts);
