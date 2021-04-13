const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateContactUsInput(
  fullName,
  email,
  subject,
  message
) {
  let errors = {}; // Convert empty fields to an empty string so we can use validator functions

  fullName = !isEmpty(fullName) ? fullName : "";
  email = !isEmpty(email) ? email : ""; // Email checks
  subject = !isEmpty(subject) ? subject : "";
  message = !isEmpty(message) ? message : "";

  //fullname check
  if (Validator.isEmpty(fullName)) {
    errors.fullName = "Full Name is required";
  }
  //subject check
  if (Validator.isEmpty(subject)) {
    errors.subject = "Subject is required";
  }
  //message check
  if (Validator.isEmpty(message)) {
    errors.message = "Message is required";
  }
//email check
  if (Validator.isEmpty(email)) {
    errors.email = "Email is required";
  } else if (!Validator.isEmail(email)) {
    errors.email = "Email is invalid";
  } 
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
