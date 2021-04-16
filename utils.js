const readline = require("readline");

/**
 * Get input from terminal
 * @param {string} questionText 
 * @returns Promise
 */
const ask = (questionText) => {
    return new Promise((resolve, reject) => {
        const _ask = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false,
        });
        _ask.question(questionText, (input) => resolve(input));
    });
}

/**
 * Check the str is a valid .env variable.
 * If str is a valid .env handleEnv will returns 
 * the variable and it's value as an object
 * @param {Object} {line}
 * @param {string} line.str
 * @returns object
 */
const handleEnv = ({ str = null }) => {
    if (typeof str != "string") {
        throw new Error(`${str} must be a string`);
    }
    const splitted = str.split('=');
    if (splitted.length < 2) {
        throw new Error(`Your input malformed. It must be like "MY_VAR=MY_VALUE"`);
    }
    const extractValue = str.replace(`${splitted[0]}=`,"");
    return { ENV_VAR: splitted[0], ENV_VAL: extractValue };
}

/**
 * Check if str is a comment line
 * @param {Object} {line}
 * @param {string} line.str
 * @returns {boolean}
 */
const isCommentLine = ({str=null}) => {
    if (typeof str != "string") {
        throw new Error(`${str} must be a string`);
    }
    const removeSpaces = str.replace(/\s/g, "");
    return removeSpaces.startsWith("#");
}


module.exports = {
    ask,
    handleEnv,
    isCommentLine
}