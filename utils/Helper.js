const bcrypt = require("bcryptjs");
const hashedPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (err) {
    console.log(err);
    throw new Error("Error hashing password");
  }
};
// const validateEditProfileData = (req) => {
//   const allowedEditField = [
//     "firstName",
//     "lastName",
//     "photoUrl",
//     "age",
//     "gender",
//     "skills",
//   ];
//   const isEditAllowed = Object.keys(req.body).every((fields) =>
//     allowedEditField.includes(fields)
//   );
//   return isEditAllowed;
// };

module.exports = {
  hashedPassword,
  // validateEditProfileData,
};
