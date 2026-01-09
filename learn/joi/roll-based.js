import joi from "joi";

const registerSchema = joi.object({
  username: joi.string().min(5).max(30).required(),
  role: joi.string().valid("admin", "user", "guest").required(),
  adminCode: joi.string().when(joi.ref("role"), {
    is: "admin",
    then: joi.required(),
    otherwise: joi.forbidden(),
  }),
  departmentId: joi.string().when(joi.ref("role"), {
    is: "manager",
    then: joi.required(),
    otherwise: joi.forbidden(),
  }),
});

console.log(
  registerSchema.validate({
    username: "john_doe",
    role: "admin",
    adminCode: "ADM123",
  })
); // Valid

console.log(
  registerSchema.validate({
    username: "jane_doe",
    role: "user",
    adminCode: "ADM123",
  })
); // Invalid, adminCode should not be present for role 'user'

console.log(
  registerSchema.validate({
    username: "mark_smith",
    role: "manager",
    departmentId: "DPT456",
  })
); // Valid
