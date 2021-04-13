
function ValidateRegex(string) {
    var myregexp = /^[0-9a-fA-F]{24}$/;
    if (string.match(myregexp)) {
        // Successful match
        return true;
    } else {
        // Match attempt failed
        return false;
    }

}

//export default ValidateRegex;

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  export {ValidateRegex, numberWithCommas};