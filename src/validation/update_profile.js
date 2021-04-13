const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function updateProfileInput(firstName, lastName) {
  let errors = {};// Convert empty fields to an empty string so we can use validator functions
  firstName = !isEmpty(firstName) ? firstName : "";
  lastName = !isEmpty(lastName) ? lastName : "";

    // firstName checks
if (Validator.isEmpty(firstName)) {
    errors.firstName = "First Name is required";
    }
    // lastName checks
  if (Validator.isEmpty(lastName)) {
    errors.lastName = "Last Name is required";
  }
 return {
    errors,
    isValid: isEmpty(errors)
  };
};