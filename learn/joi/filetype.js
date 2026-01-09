import joi from "joi";

const fileSchema = joi.object({
  fileType: joi.string().valid("image", "pdf").required(),

  mimeType: joi
    .string()
    .required()
    .when("fileType", {
      is: "image",
      then: joi
        .string()
        .pattern(/^image\/.*$/)
        .message({
          "string.pattern.base":
            '"mimeType must start with "image/" for image files"',
        }),
    }),

  size: joi
    .number()
    .positive()
    .required()
    .when("fileType", {
      switch: [
        {
          is: "image",
          then: joi.number().max(5 * 1024 * 1024),
        },
        {
          is: "pdf",
          then: joi.number().max(10 * 1024 * 1024),
        },
      ],
    }),
});

const input = {
  fileType: "image",
  mimeType: "image/png",
  size: 45000000,
};

const { error, value } = fileSchema.validate(input);

if (error) {
  console.log("Error:", error.details[0]);
} else {
  console.log("Success:", value);
}
