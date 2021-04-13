const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateCreateProductInput( categoryId, title, img, price) {

  let errors = {};// Convert empty fields to an empty string so we can use validator functions

  categoryId = !isEmpty(categoryId) ? categoryId : "";
  title = !isEmpty(title) ? title : "";
  img = !isEmpty(img) ? img : "";
  price = !isEmpty(price) ? price : "";

    // firstName checks
if (Validator.isEmpty(categoryId)) {
    errors.categoryId = "Category is required";
    }
    // lastName checks
  if (Validator.isEmpty(title)) {
    errors.title = "Title is required";
  }
  // Name checks
  if (Validator.isEmpty(img)) {
    errors.img = "Image is required";
  }
    // Name checks
    if (Validator.isEmpty(price)) {
        errors.price = "Price is required";
      }else if(!Validator.isCurrency(price)){
          errors.price = "Price must be a valid number"
      }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};