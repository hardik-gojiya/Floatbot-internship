import express from "express";
import joi from "joi";

const app = express();

const queryParamsSchema = joi.object({
  page: joi.number().integer().min(1).default(1).required(),
  limit: joi.number().integer().min(1).max(100).default(10).required(),
  sort: joi.string().valid("price", "createdAt", "rating"),
  order: joi
    .string()
    .valid("asc", "desc")
    .default("asc")
    .when(joi.ref("sort"), {
      is: joi.exist(),
      then: joi.string().valid("asc", "desc").required(),
      otherwise: joi.optional(),
    }),
});

app.get("/items", (req, res) => {
  const { error, value } = queryParamsSchema.validate(req.query);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  res.json({ message: "Query parameters are valid", query: value });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
