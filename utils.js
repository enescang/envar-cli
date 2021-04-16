const readline = require("readline");

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



module.exports = {
    ask,
    handleEnv
}