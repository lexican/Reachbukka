const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(username, firstName, lastName, email, password, password2) {
  let errors = {};// Convert empty fields to an empty string so we can use validator functions
  firstName = !isEmpty(firstName) ? firstName : "";
  lastName = !isEmpty(lastName) ? lastName : "";
  username = !isEmpty(username) ? username : "";
  email = !isEmpty(email.toLowerCase()) ? email.toLowerCase() : "";
  password = !isEmpty(password) ? password : "";
  password2 = !isEmpty(password2) ? password2 : "";

    // firstName checks
if (Validator.isEmpty(firstName)) {
    errors.firstName = "First Name is required";
    }
    // lastName checks
  if (Validator.isEmpty(lastName)) {
    errors.lastName = "Last Name is required";
  }
  // Name checks
  if (Validator.isEmpty(username)) {
    errors.username = "Username is required";
  }else if(!Validator.isLength(username, { min: 3, max: 30 })) {
    errors.username = "Username must be at least 3 characters";
  }
  
  // Email checks
  if (Validator.isEmpty(email)) {
    errors.email = "Email is required";
  }else if (!Validator.isEmail(email)) {
    errors.email = "Email is invalid";
  }// Password checks
  if (Validator.isEmpty(password)) {
    errors.password = "Password is required";
  }
  if (!Validator.isEmpty(password) && !Validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }
  if (Validator.isEmpty(password2)) {
    errors.password2 = "Confirm password is required";
  }
  if (!Validator.isEmpty(password2) && !Validator.isLength(password2, { min: 6, max: 30 })) {
    errors.password2 = "Password must be at least 6 characters";
  }
  if (!Validator.isEmpty(password) && !Validator.isEmpty(password2)  && !Validator.equals(password, password2)) {
    errors.password2 = "Passwords must match";
  }return {
    errors,
    isValid: isEmpty(errors)
  };
};