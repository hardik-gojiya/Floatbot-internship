import joi from "joi";

const passwordUpdateSchema = joi.object({
  currentPassword: joi
    .string()
    .required()
    .messages({ "any.required": "Current password is required." }),

  newPassword: joi
    .string()
    .min(10)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .custom((value, helpers) => {
      if (value === joi.ref("currentPassword")) {
        return helpers.error(
          "New password must be different from current password."
        );
      }
    })
    .messages({
      "string.pattern.base":
        "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "string.min": "New password must be at least 10 characters long.",
    }),
});

console.log(
  passwordUpdateSchema.validate({
    currentPassword: "OldPass123!",
    newPassword: "NewPass123!",
  })
); // Valid

console.log(
  passwordUpdateSchema.validate({
    currentPassword: "OldPass123!",
    newPassword: "oldpass123!",
  })
); // Invalid, new password lacks uppercase letter

console.log(
  passwordUpdateSchema.validate({
    currentPassword: "OldPass123!",
    newPassword: "OldPass123!",
  })
); // Invalid, new password is the same as current password
