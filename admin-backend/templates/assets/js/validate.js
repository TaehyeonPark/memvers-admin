// // @ts-check
/**
 * @param {String} input
 * @returns {boolean}
 */
function IsNicknameValid(input) {
    return input.length >= 4; // TODO: add more rules
}

/**
 *s 
 * @param {String} input 
 * @returns {boolean}
 */
 function IsNumeric(input) {
    return input == "" ? true : !isNaN(input);
}

/**
 * @param {input} input
 * @returns {boolean}
*/
function IsPasswordValid(input) {
    return input.length >= 8; // TODO: add more rules
}

/**
 * @param {String} input
 * @returns {boolean}
 */
function IsStudentIDValid(input) {
    return input.length == 8 && IsNumeric(input);
}

/**
 * @param {String} input
 * @returns {boolean}
 */
function IsBirtdayValid(input) {
    return input == "" ? true : input.length == 8 && IsNumeric(input) && ( Number(input[0] + input[1]) >= 19 ) && ( Number(input[4] + input[5]) <= 12 ) && ( Number(input[6] + input[7]) <= 31 );
}