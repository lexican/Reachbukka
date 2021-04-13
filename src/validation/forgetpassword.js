const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateForgetPasswordInput(email) {
  let errors = {};// Convert empty fields to an empty string so we can use validator functions
  email = !isEmpty(email.toLowerCase()) ? email.toLowerCase() : "";
  
  // Email checks
  if (Validator.isEmpty(email)) {
    errors.email = "Email is required";
  }else if (!Validator.isEmail(email)) {
    errors.email = "Email is invalid";
  }
return {
    errors,
    isValid: isEmpty(errors)
  };
};