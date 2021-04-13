const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateCheckout(
  firstName,
  lastName,
  mobileNumber,
  address
) {
  var mobileNoRegex = /^[0]\d{10}$/;
  let errors = {}; // Convert empty fields to an empty string so we can use validator functions
  
  firstName = !isEmpty(firstName) ? firstName : "";
  lastName = !isEmpty(lastName) ? lastName : "";
  mobileNumber = !isEmpty(mobileNumber) ? mobileNumber : "";
  address = !isEmpty(address) ? address : "";

  if (Validator.isEmpty(firstName)) {
    errors.firstName = "FirstName is required";
  }
  if (Validator.isEmpty(lastName)) {
    errors.lastName = "LastName is invalid";
  }
  if (Validator.isEmpty(mobileNumber)) {
    errors.mobileNumber = "Mobile Number is required";
  } else if (!mobileNumber.match(mobileNoRegex)) {
    errors.mobileNumber = "Mobile Number is not valid";
  }if(address === null || address === ""){
    errors.address = "Delivery Address is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
