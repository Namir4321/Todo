const z = require("zod");

const genederEnum = z.enum(["male", "female", "other"], {
  errorMap: () => ({
    message: "Invalid gender value. Allowed: male, female, other",
  }),
});
const skillsSchema = z.array(z.string()).default([]).optional();
const validationWithZodSchema = async (data, schema) => {
  try {
    const result = schema.safeParse(data);
    if (!result.success) {
      console.log(result.error);
      const errors = result.error.errors.map((error) => error.message);
      console.log(errors.join(", "));
      throw new Error(errors.join(", "));
    }
    return result.data;
  } catch (error) {
    console.error("Validation error:", error);
    throw error;
  }
};

const userSignUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required").trim(),
    lastName: z.string().min(1, "Last name is required").trim().optional(),
    email: z.string().email("Invalid email format").trim(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .trim(),
    gender: genederEnum.optional(),
    age: z
      .number({ invalid_type_error: "Age must be a number" })
      .min(18, "Age must be at least 18")
      .optional(),
    photoUrl: z
      .string()
      .url("Invalid URL format")
      .default("https://example.com/default-profile.png")
      .optional(),
    skills: skillsSchema.optional(),
  })
  .strict();
const userSignInSchema = z.object({
  email: z.string().email("Invalid email format").trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .trim(),
});

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional().default("todo"),
  tags: z.array(z.string()).optional().default([]),
  project: z.enum(["one", "two", "three"]).optional().default("one"),
  dueDate: z.coerce.date().optional(),
  members: z.array(z.string()).optional().default([]),
  comments: z.number().int().nonnegative().optional().default(0),
  subtasks: z.number().int().nonnegative().optional().default(0),
  thumbnail: z.string().url().optional().nullable(),
});
const taskUpdateSchema = z
  .object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    tags: z.array(z.string()).optional(),
    project: z.enum(["one", "two", "three"]).optional(),
    dueDate: z.coerce.date().optional(),
    members: z.array(z.string()).optional(),
    comments: z.number().int().nonnegative().optional(),
    subtasks: z.number().int().nonnegative().optional(),
    thumbnail: z.string().url().optional().nullable(),
  })
  .strict();

module.exports = {
  validationWithZodSchema,
  userSignUpSchema,
  userSignInSchema,
  taskSchema,
};
